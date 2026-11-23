/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Announcement,
  ClassRoom,
  ExamPackage,
  ExamSession,
  MonitoringEntry,
  MonitoringStatus,
  Question,
  Stimulus,
  StudentAnswerItem,
  SubjectId,
  SystemSettings,
  User,
} from '../types';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CLASSES,
  INITIAL_PACKAGES,
  INITIAL_QUESTIONS,
  INITIAL_SESSIONS,
  INITIAL_SETTINGS,
  INITIAL_STIMULI,
  INITIAL_USERS,
} from '../data/seedData';
import { evaluateExamSession } from '../utils/examScoring';
import {
  buildSimpanNilaiPayload,
  buildUpdateMonitoringPayload,
  isMonitoringEntryActive,
  mapSheetNilaiToSession,
  mergePackagesWithPendingLocal,
  mergeSheetNilaiSessions,
  mergeUsersWithAdminFallback,
  reconcilePackagesFromSheet,
  reconcilePackagesWithSheetQuestions,
  sanitizeQuestionPilgan,
} from '../utils/sheetsSync';
import {
  fetchSheetsDatabase,
  submitNilaiToSheets,
  syncPaketToSheets,
  syncPesertaToSheets,
  syncSoalToSheets,
  updateMonitoringToSheets,
} from '../services/sheetsApi';

export type ActiveView =
  | 'welcome'
  | 'login'
  | 'beranda'
  | 'murid-paket'
  | 'murid-ujian'
  | 'murid-hasil'
  | 'murid-riwayat'
  | 'guru-bank-soal'
  | 'guru-paket-soal'
  | 'guru-hasil'
  | 'admin-users'
  | 'admin-classes'
  | 'admin-settings'
  | 'admin-monitoring';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string | null) => void;
  selectedPackageId: string | null;
  setSelectedPackageId: (id: string | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;

  // Data State
  users: User[];
  classes: ClassRoom[];
  questions: Question[];
  stimuli: Stimulus[];
  packages: ExamPackage[];
  announcements: Announcement[];
  sessions: ExamSession[];
  activeSession: ExamSession | null;
  setActiveSession: React.Dispatch<React.SetStateAction<ExamSession | null>>;
  settings: SystemSettings;
  toasts: ToastMessage[];

  // Google Sheets Sync State & Actions
  isSyncingSheets: boolean;
  lastSyncedAt: string | null;
  syncFromGoogleSheets: (silent?: boolean) => Promise<void>;
  retrySyncExamScore: (sessionId: string) => Promise<void>;

  // Live Monitoring State & Actions
  monitoringEntries: MonitoringEntry[];
  monitoringLastUpdatedAt: string | null;
  isRefreshingMonitoring: boolean;
  refreshMonitoring: (silent?: boolean) => Promise<void>;
  reportExamMonitoring: (params: {
    status: MonitoringStatus;
    progres: string;
    pindahTab?: number;
    session?: ExamSession;
  }) => Promise<void>;

  // Actions
  login: (identity: string, pass: string) => boolean;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Question CRUD
  saveQuestion: (question: Question) => void;
  saveQuestionsBulk: (newQuestions: Question[]) => void;
  duplicateQuestion: (questionId: string) => void;
  deleteQuestion: (questionId: string) => void;
  saveStimulus: (stimulus: Stimulus) => void;

  // Package CRUD
  savePackage: (pkg: ExamPackage) => void;
  deletePackage: (pkgId: string) => void;

  // Exam CBT Execution
  startExam: (packageId: string) => boolean;
  saveStudentAnswer: (questionId: string, answer: StudentAnswerItem) => void;
  recordTabViolation: () => void;
  submitExamSession: (sessionId?: string, finalProgres?: string) => void;

  // Admin & User Management
  saveUser: (user: User, customMessage?: string) => void;
  saveUsersBulk: (newUsers: User[]) => void;
  deleteUser: (userId: string) => void;
  updateStudentKkm: (kkm: Partial<Record<SubjectId | 'umum', number>>) => void;
  saveClass: (cls: ClassRoom) => void;
  deleteClass: (classId: string) => void;
  saveAnnouncement: (ann: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  updateSettings: (settings: SystemSettings) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'paketsinau_cbt_sd_v2_';
const SEED_VERSION = 'tka_mtk_sd_2026_4opsi_v1';
const FALLBACK_ADMINS: User[] = INITIAL_USERS.filter((u) => u.role === 'admin');

function migrateSeedDataIfNeeded() {
  if (typeof window === 'undefined') return;
  try {
    const currentVer = localStorage.getItem(`${STORAGE_KEY_PREFIX}seed_version`);
    if (currentVer === SEED_VERSION) return;

    const savedQuestionsRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}questions`);
    if (savedQuestionsRaw) {
      const savedQuestions: Question[] = JSON.parse(savedQuestionsRaw);
      const nonOldMtk = savedQuestions
        .filter((q) => !q.id.startsWith('mtk-'))
        .map(sanitizeQuestionPilgan);
      const newMtk = INITIAL_QUESTIONS.filter((q) => q.id.startsWith('mtk-'));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}questions`, JSON.stringify([...newMtk, ...nonOldMtk]));
    }

    const savedStimuliRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}stimuli`);
    if (savedStimuliRaw) {
      const savedStimuli: Stimulus[] = JSON.parse(savedStimuliRaw);
      const filteredStimuli = savedStimuli.filter((s) => s.id !== 'stm-2');
      localStorage.setItem(`${STORAGE_KEY_PREFIX}stimuli`, JSON.stringify(filteredStimuli));
    }

    const savedPackagesRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}packages`);
    if (savedPackagesRaw) {
      const savedPackages: ExamPackage[] = JSON.parse(savedPackagesRaw);
      const defaultPkg1 = INITIAL_PACKAGES.find((p) => p.id === 'pkg-1');
      if (defaultPkg1) {
        const hasPkg1 = savedPackages.some((p) => p.id === 'pkg-1');
        const nextPackages = hasPkg1
          ? savedPackages.map((p) => (p.id === 'pkg-1' ? defaultPkg1 : p))
          : [defaultPkg1, ...savedPackages];
        localStorage.setItem(`${STORAGE_KEY_PREFIX}packages`, JSON.stringify(nextPackages));
      }
    }

    const savedSessionsRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`);
    if (savedSessionsRaw) {
      const savedSessions: ExamSession[] = JSON.parse(savedSessionsRaw);
      const updatedSeedMap = new Map(
        INITIAL_SESSIONS.filter((s) => s.mapelId === 'matematika').map((s) => [s.id, s])
      );
      const nextSessions = savedSessions.map((s) => updatedSeedMap.get(s.id) || s);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(nextSessions));
    }

    const savedActiveRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_session`);
    if (savedActiveRaw) {
      const savedActive: ExamSession = JSON.parse(savedActiveRaw);
      if (savedActive.paketId === 'pkg-1' && savedActive.shuffledSoalIds.length <= 10) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_session`);
      }
    }

    localStorage.setItem(`${STORAGE_KEY_PREFIX}seed_version`, SEED_VERSION);
  } catch {
    // Ignore storage errors cleanly
  }
}

migrateSeedDataIfNeeded();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      return saved ? 'beranda' : 'welcome';
    } catch {
      return 'welcome';
    }
  });

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`) as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}classes`);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}questions`);
      return saved ? (JSON.parse(saved) as Question[]).map(sanitizeQuestionPilgan) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  const [stimuli, setStimuli] = useState<Stimulus[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}stimuli`);
      return saved ? JSON.parse(saved) : INITIAL_STIMULI;
    } catch {
      return INITIAL_STIMULI;
    }
  });

  const [packages, setPackages] = useState<ExamPackage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}packages`);
      return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}announcements`);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [sessions, setSessions] = useState<ExamSession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [activeSession, setActiveSession] = useState<ExamSession | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_session`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [monitoringEntries, setMonitoringEntries] = useState<MonitoringEntry[]>([]);
  const [monitoringLastUpdatedAt, setMonitoringLastUpdatedAt] = useState<string | null>(null);
  const [isRefreshingMonitoring, setIsRefreshingMonitoring] = useState(false);

  // Refs to prevent stale closures & double submits during async Sheets calls
  const usersRef = useRef<User[]>(users);
  usersRef.current = users;
  const currentUserRef = useRef<User | null>(currentUser);
  currentUserRef.current = currentUser;
  const questionsRef = useRef<Question[]>(questions);
  questionsRef.current = questions;
  const packagesRef = useRef<ExamPackage[]>(packages);
  packagesRef.current = packages;
  const stimuliRef = useRef<Stimulus[]>(stimuli);
  stimuliRef.current = stimuli;
  const sessionsRef = useRef<ExamSession[]>(sessions);
  sessionsRef.current = sessions;
  const activeSessionRef = useRef<ExamSession | null>(activeSession);
  activeSessionRef.current = activeSession;
  const selectedSessionIdRef = useRef<string | null>(selectedSessionId);
  selectedSessionIdRef.current = selectedSessionId;
  const submittingSessionIdsRef = useRef<Set<string>>(new Set());
  const isRefreshingMonitoringRef = useRef(false);
  const pendingPaketUpsertsRef = useRef<Set<string>>(
    (() => {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}paket_pending_upserts`);
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set<string>(Array.isArray(parsed) ? parsed : []);
      } catch {
        return new Set<string>();
      }
    })()
  );
  const pendingPaketDeletesRef = useRef<Set<string>>(
    (() => {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}paket_pending_deletes`);
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set<string>(Array.isArray(parsed) ? parsed : []);
      } catch {
        return new Set<string>();
      }
    })()
  );

  const persistPendingPaketIds = useCallback(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}paket_pending_upserts`,
        JSON.stringify(Array.from(pendingPaketUpsertsRef.current))
      );
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}paket_pending_deletes`,
        JSON.stringify(Array.from(pendingPaketDeletesRef.current))
      );
    } catch {
      // Abaikan kegagalan storage
    }
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}questions`, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}stimuli`, JSON.stringify(stimuli));
  }, [stimuli]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}packages`, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}active_session`, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_session`);
    }
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sinkronisasi GET dari Google Sheets
  const syncFromGoogleSheets = useCallback(
    async (silent = false) => {
      setIsSyncingSheets(true);
      try {
        const result = await fetchSheetsDatabase();

        let nextUsers = usersRef.current;
        if (result.users.length > 0) {
          nextUsers = mergeUsersWithAdminFallback(
            result.users,
            usersRef.current,
            FALLBACK_ADMINS
          );
          usersRef.current = nextUsers;
          setUsers(nextUsers);
        }

        if (result.stimuli.length > 0) {
          const existingMap = new Map(stimuliRef.current.map((s) => [s.id, s]));
          result.stimuli.forEach((st) => existingMap.set(st.id, st));
          const mergedStimuli = Array.from(existingMap.values());
          stimuliRef.current = mergedStimuli;
          setStimuli(mergedStimuli);
        }

        let latestQuestions = questionsRef.current;
        if (result.questions.length > 0) {
          const sanitizedSheetQuestions = result.questions.map(sanitizeQuestionPilgan);
          latestQuestions = sanitizedSheetQuestions;
          questionsRef.current = sanitizedSheetQuestions;
          setQuestions(sanitizedSheetQuestions);
        }

        const isGuruOrAdmin =
          currentUserRef.current?.role === 'guru' ||
          currentUserRef.current?.role === 'admin';
        const hasPendingLocalPaket =
          pendingPaketUpsertsRef.current.size > 0 ||
          pendingPaketDeletesRef.current.size > 0;

        let nextPackages = packagesRef.current;
        let pushedLocalPackages = false;

        if (
          isGuruOrAdmin &&
          !silent &&
          (hasPendingLocalPaket ||
            (result.packages.length === 0 && packagesRef.current.length > 0))
        ) {
          const mergedLocalPackages =
            result.packages.length > 0
              ? mergePackagesWithPendingLocal(
                  result.packages,
                  packagesRef.current,
                  pendingPaketUpsertsRef.current,
                  pendingPaketDeletesRef.current
                )
              : packagesRef.current;
          nextPackages =
            result.packages.length > 0
              ? reconcilePackagesFromSheet(mergedLocalPackages, latestQuestions)
              : reconcilePackagesWithSheetQuestions(mergedLocalPackages, latestQuestions);

          packagesRef.current = nextPackages;
          setPackages(nextPackages);

          try {
            await syncPaketToSheets(nextPackages);
            pendingPaketUpsertsRef.current.clear();
            pendingPaketDeletesRef.current.clear();
            persistPendingPaketIds();
            pushedLocalPackages = true;
          } catch {
            // Biarkan tanda pending tetap tersimpan agar bisa dikirim ulang pada sinkronisasi berikutnya
          }
        } else if (result.packages.length > 0) {
          const basePackages = hasPendingLocalPaket
            ? mergePackagesWithPendingLocal(
                result.packages,
                packagesRef.current,
                pendingPaketUpsertsRef.current,
                pendingPaketDeletesRef.current
              )
            : result.packages;
          nextPackages = reconcilePackagesFromSheet(basePackages, latestQuestions);
          packagesRef.current = nextPackages;
          setPackages(nextPackages);
        } else if (result.questions.length > 0) {
          nextPackages = reconcilePackagesWithSheetQuestions(
            packagesRef.current,
            latestQuestions
          );
          packagesRef.current = nextPackages;
          setPackages(nextPackages);
        }

        const sheetSessions = result.rawNilai
          .map((row, idx) => mapSheetNilaiToSession(row, idx, nextUsers, nextPackages))
          .filter((s): s is ExamSession => Boolean(s));

        if (sheetSessions.length > 0) {
          const { sessions: mergedSessions, remappedIds } = mergeSheetNilaiSessions(
            sheetSessions,
            sessionsRef.current
          );
          sessionsRef.current = mergedSessions;
          setSessions(mergedSessions);

          const currentSelectedId = selectedSessionIdRef.current;
          if (currentSelectedId && remappedIds[currentSelectedId]) {
            setSelectedSessionId(remappedIds[currentSelectedId]);
          }
        }

        setMonitoringEntries(result.monitoring);
        const nowIso = new Date().toISOString();
        setMonitoringLastUpdatedAt(nowIso);
        setLastSyncedAt(nowIso);

        if (!silent) {
          if (
            result.users.length > 0 ||
            result.questions.length > 0 ||
            result.packages.length > 0 ||
            sheetSessions.length > 0 ||
            pushedLocalPackages
          ) {
            const uploadedNote = pushedLocalPackages
              ? ' & mengunggah paket lokal ke Google Sheets'
              : '';
            showToast(
              `Sinkronisasi Google Sheets berhasil (${result.users.length} peserta, ${result.questions.length} soal, ${nextPackages.length} paket ujian, ${sheetSessions.length} riwayat nilai)${uploadedNote}.`,
              'success'
            );
          } else {
            showToast(
              'Terhubung ke Google Sheets. Sheet masih kosong, menggunakan data cadangan lokal.',
              'info'
            );
          }
        }
      } catch {
        if (!silent) {
          showToast(
            'Gagal memuat data dari Google Sheets. Periksa koneksi internet Anda.',
            'error'
          );
        }
      } finally {
        setIsSyncingSheets(false);
      }
    },
    [persistPendingPaketIds, showToast]
  );

  // Pembaruan khusus Live Monitoring (GET URL_DATABASE)
  const refreshMonitoring = useCallback(
    async (silent = false) => {
      if (isRefreshingMonitoringRef.current) return;
      isRefreshingMonitoringRef.current = true;
      setIsRefreshingMonitoring(true);

      try {
        const result = await fetchSheetsDatabase();
        setMonitoringEntries(result.monitoring);
        const nowIso = new Date().toISOString();
        setMonitoringLastUpdatedAt(nowIso);

        const sheetSessions = result.rawNilai
          .map((row, idx) =>
            mapSheetNilaiToSession(row, idx, usersRef.current, packagesRef.current)
          )
          .filter((s): s is ExamSession => Boolean(s));

        if (sheetSessions.length > 0) {
          const { sessions: mergedSessions, remappedIds } = mergeSheetNilaiSessions(
            sheetSessions,
            sessionsRef.current
          );
          sessionsRef.current = mergedSessions;
          setSessions(mergedSessions);

          const currentSelectedId = selectedSessionIdRef.current;
          if (currentSelectedId && remappedIds[currentSelectedId]) {
            setSelectedSessionId(remappedIds[currentSelectedId]);
          }
        }

        if (!silent) {
          const activeCount = result.monitoring.filter((entry) =>
            isMonitoringEntryActive(entry)
          ).length;
          showToast(
            `Live Monitoring diperbarui (${activeCount} peserta sedang mengerjakan).`,
            'success'
          );
        }
      } catch {
        if (!silent) {
          showToast(
            'Gagal memperbarui data Live Monitoring dari Google Sheets.',
            'error'
          );
        }
      } finally {
        isRefreshingMonitoringRef.current = false;
        setIsRefreshingMonitoring(false);
      }
    },
    [showToast]
  );

  const reportExamMonitoring = useCallback(
    async (params: {
      status: MonitoringStatus;
      progres: string;
      pindahTab?: number;
      session?: ExamSession;
    }) => {
      const targetSession = params.session || activeSessionRef.current;
      if (!targetSession) return;

      const matchedUser =
        usersRef.current.find((u) => u.id === targetSession.muridId) ||
        currentUserRef.current;

      const payload = buildUpdateMonitoringPayload({
        session: targetSession,
        username: targetSession.muridUsername || matchedUser?.username,
        status: params.status,
        progres: params.progres,
        pindahTab: params.pindahTab,
      });

      try {
        await updateMonitoringToSheets(payload);
      } catch {
        // Biarkan pengerjaan ujian tetap berjalan lancar jika koneksi monitoring terganggu sementara
      }
    },
    []
  );

  // Sinkronisasi awal saat aplikasi dibuka
  useEffect(() => {
    void syncFromGoogleSheets(true);
  }, [syncFromGoogleSheets]);

  // Auto-refresh polling setiap 10 detik saat Admin/Guru berada di Live Monitoring atau Beranda
  useEffect(() => {
    const canMonitor = currentUser?.role === 'admin' || currentUser?.role === 'guru';
    const isMonitorScreen =
      activeView === 'admin-monitoring' || activeView === 'beranda';

    if (!canMonitor || !isMonitorScreen) return;

    void refreshMonitoring(true);
    const intervalId = setInterval(() => {
      void refreshMonitoring(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentUser?.role, activeView, refreshMonitoring]);

  // Auth methods (gunakan users utama + cadangan Admin bawaan agar admin tidak terkunci)
  const login = (identity: string, pass: string): boolean => {
    const cleanId = identity.trim().toLowerCase();
    const matchUser = (u: User) =>
      (u.username.toLowerCase() === cleanId ||
        (u.nomorInduk && u.nomorInduk.toLowerCase() === cleanId) ||
        u.email.toLowerCase() === cleanId ||
        u.nama.toLowerCase() === cleanId) &&
      u.password === pass;

    const user = usersRef.current.find(matchUser) || FALLBACK_ADMINS.find(matchUser);

    if (user) {
      if (!user.aktif) {
        showToast('Akun Anda dinonaktifkan oleh Administrator. Hubungi pihak sekolah.', 'error');
        return false;
      }
      currentUserRef.current = user;
      setCurrentUser(user);
      setActiveView('beranda');
      showToast(`Selamat datang, ${user.nama}!`, 'success');
      void syncFromGoogleSheets(true);
      return true;
    }

    showToast('Identitas (Username/NIS) atau kata sandi tidak cocok. Harap periksa kembali.', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveSession(null);
    setActiveView('welcome');
    showToast('Anda telah berhasil keluar.', 'info');
  };

  // Helper sinkronisasi Bank Soal ke Google Sheets
  const pushQuestionsToSheets = useCallback(
    async (
      nextQuestions: Question[],
      nextPackages: ExamPackage[],
      nextStimuli: Stimulus[],
      successMsg: string
    ) => {
      try {
        await syncSoalToSheets(nextQuestions, nextPackages, nextStimuli);
        setLastSyncedAt(new Date().toISOString());
        showToast(successMsg, 'success');
      } catch {
        showToast(
          'Perubahan soal disimpan lokal, namun gagal disinkronkan ke Google Sheets.',
          'error'
        );
      }
    },
    [showToast]
  );

  // Question actions
  const saveQuestion = (q: Question) => {
    const cleanQ = sanitizeQuestionPilgan(q);
    const now = new Date().toISOString();
    const prev = questionsRef.current;
    const idx = prev.findIndex((item) => item.id === cleanQ.id);
    const next =
      idx >= 0
        ? prev.map((item, i) => (i === idx ? { ...cleanQ, updatedAt: now } : item))
        : [{ ...cleanQ, createdAt: cleanQ.createdAt || now, updatedAt: now }, ...prev];

    questionsRef.current = next;
    setQuestions(next);
    void pushQuestionsToSheets(
      next,
      packagesRef.current,
      stimuliRef.current,
      'Soal berhasil disimpan & disinkronkan ke Google Sheets.'
    );
  };

  const saveQuestionsBulk = (newQuestions: Question[]) => {
    if (newQuestions.length === 0) return;
    const now = new Date().toISOString();
    const normalized = newQuestions.map((q) => {
      const cleanQ = sanitizeQuestionPilgan(q);
      return {
        ...cleanQ,
        createdAt: cleanQ.createdAt || now,
        updatedAt: now,
      };
    });
    const next = [...normalized, ...questionsRef.current];
    questionsRef.current = next;
    setQuestions(next);
    void pushQuestionsToSheets(
      next,
      packagesRef.current,
      stimuliRef.current,
      `${newQuestions.length} butir soal berhasil diimpor & disinkronkan ke Google Sheets.`
    );
  };

  const duplicateQuestion = (questionId: string) => {
    const original = questionsRef.current.find((q) => q.id === questionId);
    if (!original) return;

    const now = new Date().toISOString();
    const newQuestion: Question = {
      ...original,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      teksSoal: `${original.teksSoal} (Salinan)`,
      createdAt: now,
      updatedAt: now,
    };

    const next = [newQuestion, ...questionsRef.current];
    questionsRef.current = next;
    setQuestions(next);
    void pushQuestionsToSheets(
      next,
      packagesRef.current,
      stimuliRef.current,
      'Soal diduplikasi & disinkronkan ke Google Sheets.'
    );
  };

  // Helper sinkronisasi Kelola Paket Ujian ke Google Sheets (sync_paket)
  const pushPackagesToSheets = useCallback(
    async (
      nextPackages: ExamPackage[],
      successMsg: string,
      syncedUpsertIds: string[] = [],
      syncedDeleteIds: string[] = []
    ) => {
      try {
        await syncPaketToSheets(nextPackages);
        syncedUpsertIds.forEach((id) => pendingPaketUpsertsRef.current.delete(id));
        syncedDeleteIds.forEach((id) => pendingPaketDeletesRef.current.delete(id));
        persistPendingPaketIds();
        setLastSyncedAt(new Date().toISOString());
        showToast(successMsg, 'success');
      } catch {
        showToast(
          'Perubahan paket ujian disimpan lokal, namun gagal disinkronkan ke Google Sheets.',
          'error'
        );
      }
    },
    [persistPendingPaketIds, showToast]
  );

  const deleteQuestion = (questionId: string) => {
    const nextQuestions = questionsRef.current.filter((q) => q.id !== questionId);
    const affectedPkgIds: string[] = [];
    const nextPackages = packagesRef.current.map((pkg) => {
      if (!pkg.soalIds.includes(questionId)) return pkg;
      affectedPkgIds.push(pkg.id);
      return {
        ...pkg,
        soalIds: pkg.soalIds.filter((id) => id !== questionId),
      };
    });

    questionsRef.current = nextQuestions;
    packagesRef.current = nextPackages;
    setQuestions(nextQuestions);
    setPackages(nextPackages);

    void pushQuestionsToSheets(
      nextQuestions,
      nextPackages,
      stimuliRef.current,
      'Soal dihapus & Bank Soal Google Sheets diperbarui.'
    );

    if (affectedPkgIds.length > 0) {
      affectedPkgIds.forEach((id) => pendingPaketUpsertsRef.current.add(id));
      persistPendingPaketIds();
      void syncPaketToSheets(nextPackages)
        .then(() => {
          affectedPkgIds.forEach((id) => pendingPaketUpsertsRef.current.delete(id));
          persistPendingPaketIds();
        })
        .catch(() => {
          // Biarkan tetap tercatat di pendingPaketUpsertsRef untuk sinkronisasi manual berikutnya
        });
    }
  };

  const saveStimulus = (stim: Stimulus) => {
    const prev = stimuliRef.current;
    const idx = prev.findIndex((s) => s.id === stim.id);
    const next =
      idx >= 0 ? prev.map((s, i) => (i === idx ? stim : s)) : [...prev, stim];

    stimuliRef.current = next;
    setStimuli(next);
    showToast('Wacana/Stimulus berhasil disimpan.', 'success');
  };

  // Package actions
  const savePackage = (pkg: ExamPackage) => {
    const prev = packagesRef.current;
    const idx = prev.findIndex((p) => p.id === pkg.id);
    const savedPkg: ExamPackage =
      idx >= 0
        ? pkg
        : { ...pkg, createdAt: pkg.createdAt || new Date().toISOString() };
    const next =
      idx >= 0
        ? prev.map((p, i) => (i === idx ? savedPkg : p))
        : [savedPkg, ...prev];

    packagesRef.current = next;
    setPackages(next);

    pendingPaketUpsertsRef.current.add(savedPkg.id);
    pendingPaketDeletesRef.current.delete(savedPkg.id);
    persistPendingPaketIds();

    void pushPackagesToSheets(
      next,
      `Paket soal "${savedPkg.judul}" berhasil disimpan & disinkronkan ke Google Sheets.`,
      [savedPkg.id],
      []
    );
  };

  const deletePackage = (pkgId: string) => {
    const next = packagesRef.current.filter((p) => p.id !== pkgId);
    packagesRef.current = next;
    setPackages(next);

    pendingPaketUpsertsRef.current.delete(pkgId);
    pendingPaketDeletesRef.current.add(pkgId);
    persistPendingPaketIds();

    void pushPackagesToSheets(
      next,
      'Paket soal telah dihapus & diperbarui di Google Sheets.',
      [],
      [pkgId]
    );
  };

  // Exam CBT Execution
  const startExam = (packageId: string): boolean => {
    if (!currentUser) return false;

    const pkg = packagesRef.current.find((p) => p.id === packageId);
    if (!pkg) {
      showToast('Paket ujian tidak ditemukan.', 'error');
      return false;
    }

    if (pkg.status !== 'terbit') {
      showToast('Paket soal ini sedang tidak aktif atau berstatus Draft.', 'error');
      return false;
    }

    if (activeSession && activeSession.paketId === packageId && activeSession.status === 'berjalan') {
      setActiveView('murid-ujian');
      return true;
    }

    const shuffleArray = <T,>(array: T[]): T[] => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const availableQuestionIds = new Set(questionsRef.current.map((q) => q.id));
    const resolvedSoalIds = pkg.soalIds.filter((id) => availableQuestionIds.has(id));
    if (resolvedSoalIds.length === 0) {
      showToast(
        'Butir soal pada paket ini belum tersedia di Bank Soal. Silakan tekan Sinkronkan Data.',
        'error'
      );
      return false;
    }

    const questionOrder =
      pkg.acakSoal !== false ? shuffleArray(resolvedSoalIds) : [...resolvedSoalIds];

    const durationSeconds = pkg.durasiMenit * 60;
    const newSession: ExamSession = {
      id: `ses-${Date.now()}-${currentUser.id.slice(-4)}`,
      paketId: pkg.id,
      paketJudul: pkg.judul,
      mapelId: pkg.mapelId,
      muridId: currentUser.id,
      muridUsername: currentUser.username,
      muridNama: currentUser.nama,
      kelasNama: currentUser.kelasId || 'Umum',
      waktuMulai: new Date().toISOString(),
      durasiDetikTerpakai: 0,
      sisaDetik: durationSeconds,
      status: 'berjalan',
      answers: {},
      shuffledSoalIds: questionOrder,
      jumlahPelanggaranTab: 0,
      nilaiSyncStatus: 'idle',
    };

    setActiveSession(newSession);
    setActiveView('murid-ujian');
    showToast(`Ujian dimulai! Durasi pengerjaan: ${pkg.durasiMenit} menit. Selamat mengerjakan!`, 'info');
    return true;
  };

  const saveStudentAnswer = (questionId: string, answer: StudentAnswerItem) => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answer,
        },
      };
    });
  };

  const recordTabViolation = () => {
    if (!activeSession) return;
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        jumlahPelanggaranTab: (prev.jumlahPelanggaranTab || 0) + 1,
      };
    });
  };

  const sendExamScoreToSheets = useCallback(
    async (sessionObj: ExamSession, finalProgres?: string) => {
      if (submittingSessionIdsRef.current.has(sessionObj.id)) return;
      submittingSessionIdsRef.current.add(sessionObj.id);

      setSessions((prev) => {
        const next = prev.map((s) =>
          s.id === sessionObj.id
            ? { ...s, nilaiSyncStatus: 'saving' as const, nilaiSyncError: undefined }
            : s
        );
        sessionsRef.current = next;
        return next;
      });

      const matchedUser =
        usersRef.current.find((u) => u.id === sessionObj.muridId) || currentUserRef.current;
      const resolvedUsername = sessionObj.muridUsername || matchedUser?.username;

      // 1. Kirim update_monitoring dengan status "Selesai" terlebih dahulu sebelum simpan_nilai
      const totalSoalCount =
        sessionObj.totalSoal ||
        sessionObj.shuffledSoalIds.length ||
        1;
      const monitoringPayload = buildUpdateMonitoringPayload({
        session: sessionObj,
        username: resolvedUsername,
        status: 'Selesai',
        progres: finalProgres || `Soal ${totalSoalCount} dari ${totalSoalCount}`,
        pindahTab: sessionObj.jumlahPelanggaranTab ?? 0,
      });

      try {
        await updateMonitoringToSheets(monitoringPayload);
      } catch {
        // Jangan gagalkan pengiriman nilai apabila update_monitoring gagal sementara
      }

      // 2. Kirim hasil akhir ujian ke simpan_nilai
      const payload = buildSimpanNilaiPayload(sessionObj, resolvedUsername);

      try {
        await submitNilaiToSheets(payload);
        setSessions((prev) => {
          const next = prev.map((s) =>
            s.id === sessionObj.id
              ? { ...s, nilaiSyncStatus: 'saved' as const, nilaiSyncError: undefined }
              : s
          );
          sessionsRef.current = next;
          return next;
        });
        showToast('Nilai ujian berhasil tersimpan ke Google Sheets.', 'success');
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Koneksi ke Google Sheets terputus.';
        setSessions((prev) => {
          const next = prev.map((s) =>
            s.id === sessionObj.id
              ? { ...s, nilaiSyncStatus: 'error' as const, nilaiSyncError: msg }
              : s
          );
          sessionsRef.current = next;
          return next;
        });
        showToast(
          'Gagal mengirim nilai ke Google Sheets. Gunakan tombol Kirim Ulang Nilai.',
          'error'
        );
      } finally {
        submittingSessionIdsRef.current.delete(sessionObj.id);
      }
    },
    [showToast]
  );

  const submitExamSession = useCallback(
    (sessionId?: string, finalProgres?: string) => {
      const currentActive = activeSessionRef.current;
      const sessionToFinish = sessionId
        ? sessionsRef.current.find((s) => s.id === sessionId) || currentActive
        : currentActive;

      if (!sessionToFinish) return;
      if (sessionToFinish.status === 'selesai') return;
      if (submittingSessionIdsRef.current.has(sessionToFinish.id)) return;

      const pkg = packagesRef.current.find((p) => p.id === sessionToFinish.paketId);
      if (!pkg) return;

      const sessionQuestions = sessionToFinish.shuffledSoalIds
        .map((id) => questionsRef.current.find((q) => q.id === id))
        .filter((q): q is Question => Boolean(q));

      const evaluation = evaluateExamSession(sessionQuestions, sessionToFinish.answers, pkg);

      const matchedUser =
        usersRef.current.find((u) => u.id === sessionToFinish.muridId) || currentUserRef.current;

      const completedSession: ExamSession = {
        ...sessionToFinish,
        muridUsername:
          sessionToFinish.muridUsername || matchedUser?.username || sessionToFinish.muridId,
        status: 'selesai',
        waktuSelesai: new Date().toISOString(),
        durasiDetikTerpakai: pkg.durasiMenit * 60 - sessionToFinish.sisaDetik,
        totalSkor: evaluation.totalSkor,
        skorMaksimal: evaluation.skorMaksimal,
        persentaseNilai: evaluation.persentaseNilai,
        jumlahBenar: evaluation.jumlahBenar,
        jumlahSalah: evaluation.jumlahSalah,
        jumlahKosong: evaluation.jumlahKosong,
        totalSoal: sessionToFinish.shuffledSoalIds.length || sessionQuestions.length,
        answers: evaluation.answers,
        nilaiSyncStatus: 'saving',
        nilaiSyncError: undefined,
        fromGoogleSheets: false,
      };

      setSessions((prev) => {
        const idx = prev.findIndex((s) => s.id === completedSession.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = completedSession;
          sessionsRef.current = next;
          return next;
        }
        const next = [completedSession, ...prev];
        sessionsRef.current = next;
        return next;
      });

      if (currentActive?.id === completedSession.id) {
        setActiveSession(null);
      }

      setSelectedSessionId(completedSession.id);
      setActiveView('murid-hasil');
      showToast(
        `Ujian selesai! Skor akhir Anda: ${completedSession.persentaseNilai} / 100`,
        'success'
      );

      void sendExamScoreToSheets(completedSession, finalProgres);
    },
    [sendExamScoreToSheets, showToast]
  );

  const retrySyncExamScore = useCallback(
    async (sessionId: string) => {
      const target = sessionsRef.current.find((s) => s.id === sessionId);
      if (!target || target.nilaiSyncStatus === 'saving') return;
      await sendExamScoreToSheets(target);
    },
    [sendExamScoreToSheets]
  );

  // Helper sinkronisasi peserta ke Google Sheets
  const pushUsersToSheets = useCallback(
    async (nextUsers: User[], successMsg: string) => {
      try {
        await syncPesertaToSheets(nextUsers);
        setLastSyncedAt(new Date().toISOString());
        showToast(successMsg, 'success');
      } catch {
        showToast(
          'Perubahan akun disimpan lokal, namun gagal disinkronkan ke Google Sheets.',
          'error'
        );
      }
    },
    [showToast]
  );

  // User management
  const saveUser = (u: User, customMessage?: string) => {
    const prev = usersRef.current;
    const idx = prev.findIndex((item) => item.id === u.id);
    const next =
      idx >= 0
        ? prev.map((item, i) => (i === idx ? u : item))
        : [...prev, { ...u, createdAt: u.createdAt || new Date().toISOString() }];

    usersRef.current = next;
    setUsers(next);

    if (currentUser && currentUser.id === u.id) {
      setCurrentUser(u);
    }

    void pushUsersToSheets(
      next,
      customMessage || `Perubahan akun "${u.nama}" telah tersimpan ke Google Sheets.`
    );
  };

  const saveUsersBulk = (newUsers: User[]) => {
    if (newUsers.length === 0) return;
    const prev = usersRef.current;
    const next = [...prev, ...newUsers];
    usersRef.current = next;
    setUsers(next);

    void pushUsersToSheets(
      next,
      `${newUsers.length} akun pengguna berhasil diimpor & tersimpan ke Google Sheets.`
    );
  };

  const deleteUser = (userId: string) => {
    const next = usersRef.current.filter((u) => u.id !== userId);
    usersRef.current = next;
    setUsers(next);

    void pushUsersToSheets(
      next,
      'Penghapusan akun telah tersimpan ke Google Sheets.'
    );
  };

  const updateStudentKkm = (kkm: Partial<Record<SubjectId | 'umum', number>>) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      customKkm: {
        ...(currentUser.customKkm || {}),
        ...kkm,
      },
    };
    setCurrentUser(updatedUser);
    const next = usersRef.current.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    usersRef.current = next;
    setUsers(next);
    showToast('Target KKM berhasil disimpan!', 'success');
  };

  const saveClass = (cls: ClassRoom) => {
    setClasses((prev) => {
      const idx = prev.findIndex((c) => c.id === cls.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = cls;
        return next;
      }
      return [...prev, cls];
    });
    showToast(`Kelas "${cls.nama}" berhasil disimpan.`, 'success');
  };

  const deleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    showToast('Kelas telah dihapus.', 'info');
  };

  const saveAnnouncement = (ann: Announcement) => {
    setAnnouncements((prev) => {
      const idx = prev.findIndex((a) => a.id === ann.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = ann;
        return next;
      }
      return [ann, ...prev];
    });
    showToast('Pengumuman berhasil dipublikasikan.', 'success');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Pengumuman dihapus.', 'info');
  };

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(newSettings));
    showToast('Pengaturan sistem berhasil diperbarui.', 'success');
  };

  const resetAllDataToDefault = () => {
    usersRef.current = INITIAL_USERS;
    questionsRef.current = INITIAL_QUESTIONS;
    stimuliRef.current = INITIAL_STIMULI;
    packagesRef.current = INITIAL_PACKAGES;
    sessionsRef.current = INITIAL_SESSIONS;

    setUsers(INITIAL_USERS);
    setClasses(INITIAL_CLASSES);
    setQuestions(INITIAL_QUESTIONS);
    setStimuli(INITIAL_STIMULI);
    setPackages(INITIAL_PACKAGES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSessions(INITIAL_SESSIONS);
    setSettings(INITIAL_SETTINGS);
    setActiveSession(null);
    setCurrentUser(INITIAL_USERS[3]);
    pendingPaketUpsertsRef.current.clear();
    pendingPaketDeletesRef.current.clear();
    persistPendingPaketIds();
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}seed_version`, SEED_VERSION);
    } catch {
      // Ignore storage errors
    }
    showToast('Seluruh data CBT telah di-reset ke nilai default contoh.', 'info');
  };

  const value = useMemo(
    () => ({
      currentUser,
      activeView,
      setActiveView,
      selectedSessionId,
      setSelectedSessionId,
      selectedPackageId,
      setSelectedPackageId,
      theme,
      setTheme,
      fontSize,
      setFontSize,
      users,
      classes,
      questions,
      stimuli,
      packages,
      announcements,
      sessions,
      activeSession,
      setActiveSession,
      settings,
      toasts,
      isSyncingSheets,
      lastSyncedAt,
      syncFromGoogleSheets,
      retrySyncExamScore,
      monitoringEntries,
      monitoringLastUpdatedAt,
      isRefreshingMonitoring,
      refreshMonitoring,
      reportExamMonitoring,
      login,
      logout,
      showToast,
      removeToast,
      saveQuestion,
      saveQuestionsBulk,
      duplicateQuestion,
      deleteQuestion,
      saveStimulus,
      savePackage,
      deletePackage,
      startExam,
      saveStudentAnswer,
      recordTabViolation,
      submitExamSession,
      saveUser,
      saveUsersBulk,
      deleteUser,
      updateStudentKkm,
      saveClass,
      deleteClass,
      saveAnnouncement,
      deleteAnnouncement,
      updateSettings,
      resetAllDataToDefault,
    }),
    [
      currentUser,
      activeView,
      selectedSessionId,
      selectedPackageId,
      theme,
      fontSize,
      users,
      classes,
      questions,
      stimuli,
      packages,
      announcements,
      sessions,
      activeSession,
      settings,
      toasts,
      isSyncingSheets,
      lastSyncedAt,
      syncFromGoogleSheets,
      retrySyncExamScore,
      monitoringEntries,
      monitoringLastUpdatedAt,
      isRefreshingMonitoring,
      refreshMonitoring,
      reportExamMonitoring,
      submitExamSession,
      showToast,
      removeToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
