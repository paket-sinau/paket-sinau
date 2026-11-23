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
  mergeUsersWithAdminFallback,
  reconcilePackagesWithSheetQuestions,
} from '../utils/sheetsSync';
import {
  fetchSheetsDatabase,
  submitNilaiToSheets,
  syncPesertaToSheets,
  syncSoalToSheets,
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
  submitExamSession: (sessionId?: string) => void;

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
const SEED_VERSION = 'tka_mtk_sd_2026_v1';
const FALLBACK_ADMINS: User[] = INITIAL_USERS.filter((u) => u.role === 'admin');

function migrateSeedDataIfNeeded() {
  if (typeof window === 'undefined') return;
  try {
    const currentVer = localStorage.getItem(`${STORAGE_KEY_PREFIX}seed_version`);
    if (currentVer === SEED_VERSION) return;

    const savedQuestionsRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}questions`);
    if (savedQuestionsRaw) {
      const savedQuestions: Question[] = JSON.parse(savedQuestionsRaw);
      const nonOldMtk = savedQuestions.filter((q) => !q.id.startsWith('mtk-'));
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
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
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

  // Refs to prevent stale closures & double submits during async Sheets calls
  const usersRef = useRef<User[]>(users);
  usersRef.current = users;
  const questionsRef = useRef<Question[]>(questions);
  questionsRef.current = questions;
  const packagesRef = useRef<ExamPackage[]>(packages);
  packagesRef.current = packages;
  const stimuliRef = useRef<Stimulus[]>(stimuli);
  stimuliRef.current = stimuli;
  const sessionsRef = useRef<ExamSession[]>(sessions);
  sessionsRef.current = sessions;
  const submittingSessionIdsRef = useRef<Set<string>>(new Set());

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

        if (result.users.length > 0) {
          const nextUsers = mergeUsersWithAdminFallback(
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

        if (result.questions.length > 0) {
          questionsRef.current = result.questions;
          setQuestions(result.questions);

          const nextPackages = reconcilePackagesWithSheetQuestions(
            packagesRef.current,
            result.questions
          );
          packagesRef.current = nextPackages;
          setPackages(nextPackages);
        }

        setLastSyncedAt(new Date().toISOString());

        if (!silent) {
          if (result.users.length > 0 || result.questions.length > 0) {
            showToast(
              `Sinkronisasi Google Sheets berhasil (${result.users.length} peserta, ${result.questions.length} soal).`,
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
    [showToast]
  );

  // Sinkronisasi awal saat aplikasi dibuka
  useEffect(() => {
    void syncFromGoogleSheets(true);
  }, [syncFromGoogleSheets]);

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
      setCurrentUser(user);
      setActiveView('beranda');
      showToast(`Selamat datang, ${user.nama}!`, 'success');
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
    const now = new Date().toISOString();
    const prev = questionsRef.current;
    const idx = prev.findIndex((item) => item.id === q.id);
    const next =
      idx >= 0
        ? prev.map((item, i) => (i === idx ? { ...q, updatedAt: now } : item))
        : [{ ...q, createdAt: q.createdAt || now, updatedAt: now }, ...prev];

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
    const normalized = newQuestions.map((q) => ({
      ...q,
      createdAt: q.createdAt || now,
      updatedAt: now,
    }));
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

  const deleteQuestion = (questionId: string) => {
    const nextQuestions = questionsRef.current.filter((q) => q.id !== questionId);
    const nextPackages = packagesRef.current.map((pkg) => ({
      ...pkg,
      soalIds: pkg.soalIds.filter((id) => id !== questionId),
    }));

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
    const next =
      idx >= 0
        ? prev.map((p, i) => (i === idx ? pkg : p))
        : [{ ...pkg, createdAt: new Date().toISOString() }, ...prev];
    packagesRef.current = next;
    setPackages(next);
    showToast(`Paket soal "${pkg.judul}" berhasil disimpan.`, 'success');
  };

  const deletePackage = (pkgId: string) => {
    const next = packagesRef.current.filter((p) => p.id !== pkgId);
    packagesRef.current = next;
    setPackages(next);
    showToast('Paket soal telah dihapus.', 'info');
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

    const questionOrder = pkg.acakSoal !== false ? shuffleArray(pkg.soalIds) : [...pkg.soalIds];

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
    async (sessionObj: ExamSession) => {
      if (submittingSessionIdsRef.current.has(sessionObj.id)) return;
      submittingSessionIdsRef.current.add(sessionObj.id);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionObj.id
            ? { ...s, nilaiSyncStatus: 'saving', nilaiSyncError: undefined }
            : s
        )
      );

      const matchedUser =
        usersRef.current.find((u) => u.id === sessionObj.muridId) || currentUser;
      const payload = buildSimpanNilaiPayload(
        sessionObj,
        sessionObj.muridUsername || matchedUser?.username
      );

      try {
        await submitNilaiToSheets(payload);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionObj.id
              ? { ...s, nilaiSyncStatus: 'saved', nilaiSyncError: undefined }
              : s
          )
        );
        showToast('Nilai ujian berhasil tersimpan ke Google Sheets.', 'success');
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Koneksi ke Google Sheets terputus.';
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionObj.id
              ? { ...s, nilaiSyncStatus: 'error', nilaiSyncError: msg }
              : s
          )
        );
        showToast(
          'Gagal mengirim nilai ke Google Sheets. Gunakan tombol Kirim Ulang Nilai.',
          'error'
        );
      } finally {
        submittingSessionIdsRef.current.delete(sessionObj.id);
      }
    },
    [currentUser, showToast]
  );

  const submitExamSession = useCallback(
    (sessionId?: string) => {
      const sessionToFinish = sessionId
        ? sessionsRef.current.find((s) => s.id === sessionId) || activeSession
        : activeSession;

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
        usersRef.current.find((u) => u.id === sessionToFinish.muridId) || currentUser;

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
        answers: evaluation.answers,
        nilaiSyncStatus: 'saving',
        nilaiSyncError: undefined,
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

      if (activeSession?.id === completedSession.id) {
        setActiveSession(null);
      }

      setSelectedSessionId(completedSession.id);
      setActiveView('murid-hasil');
      showToast(
        `Ujian selesai! Skor akhir Anda: ${completedSession.persentaseNilai} / 100`,
        'success'
      );

      void sendExamScoreToSheets(completedSession);
    },
    [activeSession, currentUser, sendExamScoreToSheets, showToast]
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
