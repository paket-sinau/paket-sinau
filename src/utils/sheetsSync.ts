/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DifficultyLevel,
  ExamPackage,
  ExamSession,
  ExamStatus,
  KategoriStatement,
  MonitoringEntry,
  MonitoringStatus,
  PilganLabel,
  PilganOption,
  Question,
  QuestionModel,
  Stimulus,
  SubjectId,
  User,
  UserRole,
} from '../types';

export const PILGAN_LABELS: readonly PilganLabel[] = ['A', 'B', 'C', 'D'] as const;

export function normalizePilganKunci(rawKunci?: unknown): PilganLabel {
  const k = asString(rawKunci, 'A').toUpperCase().charAt(0);
  return (PILGAN_LABELS as readonly string[]).includes(k) ? (k as PilganLabel) : 'A';
}

/**
 * Membersihkan daftar opsi pilihan ganda agar hanya memuat maksimal 4 opsi (A-D).
 * Opsi E dari data lama diabaikan tanpa menimbulkan error.
 */
export function sanitizePilganOptions(
  rawOptions?: ReadonlyArray<{
    label?: unknown;
    teks?: unknown;
    text?: unknown;
    gambarUrl?: unknown;
    gambar?: unknown;
  }>
): PilganOption[] {
  if (!Array.isArray(rawOptions) || rawOptions.length === 0) return [];

  const result: PilganOption[] = [];
  const seen = new Set<PilganLabel>();

  for (let i = 0; i < rawOptions.length; i++) {
    const item = rawOptions[i];
    if (!item || typeof item !== 'object') continue;

    const rawLabel = asString(item.label).toUpperCase().charAt(0);
    // Abaikan opsi E atau label lain di luar A-D secara eksplisit
    if (rawLabel) {
      if (!(PILGAN_LABELS as readonly string[]).includes(rawLabel)) continue;
    } else if (i >= PILGAN_LABELS.length) {
      continue;
    }

    const resolvedLabel = (rawLabel || PILGAN_LABELS[i]) as PilganLabel;
    if (seen.has(resolvedLabel)) continue;
    seen.add(resolvedLabel);

    const rawImg = item.gambarUrl ?? item.gambar;
    const sanitizedImg =
      typeof rawImg === 'string' ? sanitizeImageUrl(rawImg) : undefined;

    result.push({
      label: resolvedLabel,
      teks: asString(item.teks ?? item.text),
      ...(sanitizedImg ? { gambarUrl: sanitizedImg } : {}),
    });

    if (result.length >= PILGAN_LABELS.length) break;
  }

  return result;
}

export function sanitizeQuestionPilgan(q: Question): Question {
  if (q.modelSoal !== 'pilgan') return q;
  return {
    ...q,
    pilganOptions: sanitizePilganOptions(q.pilganOptions),
    pilganKunci: normalizePilganKunci(q.pilganKunci),
  };
}

export interface SheetPesertaRow {
  id: string;
  username: string;
  password: string;
  nama: string;
  role: string;
  kelas: string;
  nomor_induk: string;
}

export interface SheetSoalRow {
  id: string;
  paket_ujian: string;
  mapel: string;
  kelas: string;
  model: string;
  pertanyaan: string;
  gambar: string;
  opsi_json: string;
  kunci: string;
  pembahasan: string;
}

export interface SheetNilaiRow {
  id: string;
  waktu: string;
  nama_siswa: string;
  username: string;
  kelas: string;
  paket_ujian: string;
  mapel: string;
  skor: number;
  benar: number;
  salah: number;
  total_soal: number;
}

export interface SimpanNilaiPayload {
  action: 'simpan_nilai';
  nama_siswa: string;
  username: string;
  kelas: string;
  paket_ujian: string;
  mapel: string;
  skor: number;
  benar: number;
  salah: number;
  total_soal: number;
}

export interface SyncPesertaPayload {
  action: 'sync_peserta';
  peserta: SheetPesertaRow[];
}

export interface SyncSoalPayload {
  action: 'sync_soal';
  soal: SheetSoalRow[];
}

export interface SyncPaketPayload {
  action: 'sync_paket';
  paket: ExamPackage[];
}

export interface UpdateMonitoringPayload {
  action: 'update_monitoring';
  username: string;
  nama_siswa: string;
  kelas: string;
  paket_ujian: string;
  status: MonitoringStatus;
  progres: string;
  pindah_tab: number;
}

const SAFE_DATA_IMAGE_REGEX = /^data:image\/(png|jpe?g|webp|gif|bmp);base64,[A-Za-z0-9+/=]+$/i;

/**
 * Validasi dan sanitasi URL gambar untuk mencegah skema berbahaya (javascript:, vbscript:, data:text/html, svg).
 */
export function sanitizeImageUrl(rawUrl?: unknown): string | undefined {
  if (typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (SAFE_DATA_IMAGE_REGEX.test(trimmed)) {
    return trimmed;
  }
  return undefined;
}

function asString(val: unknown, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  return String(val).trim();
}

export function normalizeRole(rawRole: unknown): UserRole {
  const r = asString(rawRole).toLowerCase();
  if (r === 'admin' || r === 'administrator') return 'admin';
  if (r === 'guru' || r === 'teacher' || r === 'pengajar') return 'guru';
  return 'murid';
}

export function normalizeSubjectId(rawMapel: unknown): SubjectId {
  const m = asString(rawMapel).toLowerCase();
  if (m.includes('matematika') || m === 'mtk') {
    return 'matematika';
  }
  if (m.includes('indo') || m === 'bind' || m === 'bahasa_indonesia') {
    return 'bahasa_indonesia';
  }
  if (m === 'ipa' || m.includes('ipas') || m.includes('ilmu pengetahuan alam') || m === 'sains') {
    return 'ipa';
  }
  if (m.includes('campur') || /\btematik\b/.test(m)) {
    return 'campuran';
  }
  return 'matematika';
}

export function normalizeQuestionModel(rawModel: unknown): QuestionModel {
  const m = asString(rawModel).toLowerCase();
  if (m.includes('mcma') || m.includes('kompleks')) return 'mcma';
  if (m.includes('kategori') || m.includes('benar') || m.includes('tabel')) return 'kategori';
  return 'pilgan';
}

export function normalizeDifficulty(rawDiff: unknown): DifficultyLevel {
  const d = asString(rawDiff).toLowerCase();
  if (d === 'mudah' || d === 'easy') return 'mudah';
  if (d === 'sulit' || d === 'hard') return 'sulit';
  return 'sedang';
}

export function mapUserToSheetPeserta(user: User): SheetPesertaRow {
  return {
    id: user.id,
    username: user.username,
    password: asString(user.password, ''),
    nama: user.nama,
    role: user.role,
    kelas: user.kelasId || '',
    nomor_induk: user.nomorInduk || user.username,
  };
}

export function mapSheetPesertaToUser(
  raw: Record<string, unknown>,
  index: number
): User | null {
  const username = asString(raw.username ?? raw.Username ?? raw.nomor_induk ?? raw.nis);
  const nama = asString(raw.nama ?? raw.Nama ?? raw.nama_lengkap);
  if (!username && !nama) return null;

  const role = normalizeRole(raw.role ?? raw.Role ?? raw.peran);
  const kelasRaw = asString(raw.kelas ?? raw.Kelas ?? raw.kelasId);
  const nomorInduk = asString(raw.nomor_induk ?? raw.nomorInduk ?? raw.nis) || username;
  const resolvedUsername = username || nomorInduk || `user_${index + 1}`;
  const id = asString(raw.id ?? raw.ID) || `usr-sheet-${resolvedUsername}-${index + 1}`;
  const password = asString(raw.password ?? raw.Password, role === 'admin' ? 'admin' : role === 'guru' ? 'guru' : 'siswa');
  const email = asString(raw.email) || `${resolvedUsername}@sekolah.sch.id`;
  const aktifRaw = raw.aktif;
  const aktif =
    aktifRaw === undefined || aktifRaw === null
      ? true
      : !(aktifRaw === false || asString(aktifRaw).toLowerCase() === 'false' || asString(aktifRaw).toLowerCase() === 'nonaktif');

  return {
    id,
    username: resolvedUsername,
    nomorInduk,
    nama: nama || resolvedUsername,
    email,
    role,
    password,
    kelasId: role === 'murid' ? kelasRaw || 'Kelas 6A' : kelasRaw || undefined,
    aktif,
    createdAt: asString(raw.createdAt) || new Date().toISOString(),
  };
}

/**
 * Gabungkan user dari Google Sheets dengan menjaga preferensi lokal (seperti customKkm)
 * dan memastikan selalu ada minimal 1 akun Admin bawaan agar sistem tidak terkunci.
 */
export function mergeUsersWithAdminFallback(
  sheetUsers: User[],
  existingUsers: User[],
  fallbackAdmins: User[]
): User[] {
  if (sheetUsers.length === 0) {
    return existingUsers.length > 0 ? existingUsers : fallbackAdmins;
  }

  const existingByUsername = new Map(
    existingUsers.map((u) => [u.username.toLowerCase(), u])
  );

  const merged = sheetUsers.map((su) => {
    const prev = existingByUsername.get(su.username.toLowerCase());
    if (!prev) return su;
    return {
      ...su,
      customKkm: prev.customKkm ?? su.customKkm,
      mapelAjar: su.mapelAjar ?? prev.mapelAjar,
    };
  });

  const hasActiveAdmin = merged.some((u) => u.role === 'admin' && u.aktif !== false);
  if (!hasActiveAdmin && fallbackAdmins.length > 0) {
    const adminFallbacksToAdd = fallbackAdmins.filter(
      (adm) => !merged.some((u) => u.username.toLowerCase() === adm.username.toLowerCase())
    );
    return [...adminFallbacksToAdd, ...merged];
  }

  return merged;
}

export function mapQuestionToSheetSoal(
  q: Question,
  packages: ExamPackage[] = [],
  stimuli: Stimulus[] = []
): SheetSoalRow {
  const matchedPkgTitles = packages
    .filter((p) => p.soalIds.includes(q.id))
    .map((p) => p.judul);

  const paketUjian =
    matchedPkgTitles.length > 0
      ? matchedPkgTitles.join(', ')
      : q.paketUjian || '';

  const matchedPkgKelas = packages
    .filter((p) => p.soalIds.includes(q.id))
    .flatMap((p) => p.kelasAkses)
    .filter((k) => k && k !== 'semua');

  const kelas =
    q.kelas ||
    (matchedPkgKelas.length > 0 ? Array.from(new Set(matchedPkgKelas)).join(', ') : 'Kelas 6');

  const linkedStimulus = q.stimulusId
    ? stimuli.find((s) => s.id === q.stimulusId)
    : undefined;

  const sanitizedPilganOptions =
    q.modelSoal === 'pilgan' ? sanitizePilganOptions(q.pilganOptions) : undefined;

  const opsiPayload = {
    topik: q.topik,
    tingkatKesulitan: q.tingkatKesulitan,
    gambarAlt: q.gambarAlt,
    stimulusId: q.stimulusId,
    stimulus: linkedStimulus,
    paketUjian,
    kelas,
    pembuatId: q.pembuatId,
    pembuatNama: q.pembuatNama,
    pilganOptions: sanitizedPilganOptions,
    mcmaOptions: q.mcmaOptions,
    mcmaScoringMode: q.mcmaScoringMode,
    kategoriLabels: q.kategoriLabels,
    kategoriPernyataan: q.kategoriPernyataan,
    kategoriScoringMode: q.kategoriScoringMode,
  };

  let kunci = '';
  if (q.modelSoal === 'pilgan') {
    kunci = normalizePilganKunci(q.pilganKunci);
  } else if (q.modelSoal === 'mcma') {
    kunci = (q.mcmaKunci || []).join(',');
  } else if (q.modelSoal === 'kategori') {
    kunci = (q.kategoriPernyataan || []).map((s) => s.kunciJawaban).join(',');
  }

  return {
    id: q.id,
    paket_ujian: paketUjian,
    mapel: q.mapelId,
    kelas,
    model: q.modelSoal,
    pertanyaan: q.teksSoal,
    gambar: sanitizeImageUrl(q.gambarUrl) || '',
    opsi_json: JSON.stringify(opsiPayload),
    kunci,
    pembahasan: q.pembahasan || '',
  };
}

function parseKunciList(rawKunci: unknown): string[] {
  if (Array.isArray(rawKunci)) {
    return rawKunci.map((k) => asString(k)).filter(Boolean);
  }
  const str = asString(rawKunci);
  if (!str) return [];
  if (str.startsWith('[')) {
    try {
      const arr = JSON.parse(str);
      if (Array.isArray(arr)) {
        return arr.map((k) => asString(k)).filter(Boolean);
      }
    } catch {
      // fallback to split
    }
  }
  return str
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mapSheetSoalToQuestion(
  raw: Record<string, unknown>,
  index: number
): { question: Question; extractedStimulus?: Stimulus } | null {
  const teksSoal = asString(raw.pertanyaan ?? raw.teksSoal ?? raw.Pertanyaan);
  if (!teksSoal) return null;

  const id = asString(raw.id ?? raw.ID) || `q-sheet-${index + 1}`;
  const mapelId = normalizeSubjectId(raw.mapel ?? raw.mapelId);
  const modelSoal = normalizeQuestionModel(raw.model ?? raw.modelSoal);
  const paketUjian = asString(raw.paket_ujian ?? raw.paketUjian);
  const kelas = asString(raw.kelas);
  const gambarUrl = sanitizeImageUrl(raw.gambar ?? raw.gambarUrl);
  const pembahasan = asString(raw.pembahasan);
  const rawKunci = raw.kunci ?? raw.kunciJawaban;

  let parsedOpsi: unknown = raw.opsi_json ?? raw.opsiJson ?? raw.opsi;
  if (typeof parsedOpsi === 'string' && parsedOpsi.trim()) {
    try {
      parsedOpsi = JSON.parse(parsedOpsi);
    } catch {
      parsedOpsi = null;
    }
  }

  let topik = 'Umum';
  let tingkatKesulitan: DifficultyLevel = 'sedang';
  let gambarAlt: string | undefined;
  let stimulusId: string | undefined;
  let extractedStimulus: Stimulus | undefined;
  let pembuatId = 'usr-guru-1';
  let pembuatNama = 'Guru (Google Sheets)';
  let pilganOptions: PilganOption[] | undefined;
  let mcmaOptions: { id: string; label: string; teks: string; gambarUrl?: string }[] | undefined;
  let mcmaScoringMode: 'all_or_nothing' | 'proportional' | undefined;
  let kategoriLabels: [string, string] | undefined;
  let kategoriPernyataan: KategoriStatement[] | undefined;
  let kategoriScoringMode: 'all_or_nothing' | 'per_row' | undefined;

  if (parsedOpsi && typeof parsedOpsi === 'object' && !Array.isArray(parsedOpsi)) {
    const obj = parsedOpsi as Record<string, unknown>;
    if (obj.topik) topik = asString(obj.topik, topik);
    if (obj.tingkatKesulitan) tingkatKesulitan = normalizeDifficulty(obj.tingkatKesulitan);
    if (obj.gambarAlt) gambarAlt = asString(obj.gambarAlt) || undefined;
    if (obj.stimulusId) stimulusId = asString(obj.stimulusId) || undefined;
    if (obj.pembuatId) pembuatId = asString(obj.pembuatId, pembuatId);
    if (obj.pembuatNama) pembuatNama = asString(obj.pembuatNama, pembuatNama);

    if (obj.stimulus && typeof obj.stimulus === 'object') {
      const st = obj.stimulus as Record<string, unknown>;
      const stId = asString(st.id) || stimulusId;
      if (stId && (st.judul || st.teks)) {
        extractedStimulus = {
          id: stId,
          judul: asString(st.judul, 'Wacana Soal'),
          teks: asString(st.teks),
          sumber: asString(st.sumber) || undefined,
          gambarUrl: sanitizeImageUrl(st.gambarUrl),
          gambarAlt: asString(st.gambarAlt) || undefined,
        };
        stimulusId = stId;
      }
    }

    if (Array.isArray(obj.pilganOptions)) {
      pilganOptions = sanitizePilganOptions(
        obj.pilganOptions as Array<Record<string, unknown>>
      );
    }

    if (Array.isArray(obj.mcmaOptions)) {
      const labels = ['A', 'B', 'C', 'D', 'E'];
      mcmaOptions = obj.mcmaOptions.map((o, idx) => {
        const item = o as Record<string, unknown>;
        const lbl = asString(item.label, labels[idx] || String(idx + 1));
        return {
          id: asString(item.id, lbl),
          label: lbl,
          teks: asString(item.teks ?? item.text),
          gambarUrl: sanitizeImageUrl(item.gambarUrl ?? item.gambar),
        };
      });
    }

    if (obj.mcmaScoringMode === 'all_or_nothing' || obj.mcmaScoringMode === 'proportional') {
      mcmaScoringMode = obj.mcmaScoringMode;
    }

    if (Array.isArray(obj.kategoriLabels) && obj.kategoriLabels.length >= 2) {
      kategoriLabels = [asString(obj.kategoriLabels[0], 'Benar'), asString(obj.kategoriLabels[1], 'Salah')];
    }

    if (Array.isArray(obj.kategoriPernyataan)) {
      const parsedKeys = parseKunciList(rawKunci);
      kategoriPernyataan = obj.kategoriPernyataan.map((s, idx) => {
        const stmt = s as Record<string, unknown>;
        return {
          id: asString(stmt.id, `stmt-${id}-${idx + 1}`),
          teks: asString(stmt.teks ?? stmt.text),
          kunciJawaban: asString(stmt.kunciJawaban) || parsedKeys[idx] || kategoriLabels?.[0] || 'Benar',
          gambarUrl: sanitizeImageUrl(stmt.gambarUrl ?? stmt.gambar),
        };
      });
    }

    if (obj.kategoriScoringMode === 'all_or_nothing' || obj.kategoriScoringMode === 'per_row') {
      kategoriScoringMode = obj.kategoriScoringMode;
    }

    // Also handle manual map format like { A: "Opsi 1", B: "Opsi 2" }
    if (!pilganOptions && !mcmaOptions && !kategoriPernyataan) {
      if (modelSoal === 'mcma') {
        const mcmaAlphaKeys = ['A', 'B', 'C', 'D', 'E'] as const;
        const mappedMcma = mcmaAlphaKeys
          .filter((k) => obj[k] !== undefined)
          .map((k) => ({ id: k, label: k, teks: asString(obj[k]) }));
        if (mappedMcma.length > 0) {
          mcmaOptions = mappedMcma;
        }
      } else {
        const mappedPilgan = PILGAN_LABELS
          .filter((k) => obj[k] !== undefined)
          .map((k) => ({ label: k, teks: asString(obj[k]) }));
        if (mappedPilgan.length > 0) {
          pilganOptions = mappedPilgan;
        }
      }
    }
  } else if (Array.isArray(parsedOpsi)) {
    const alphaKeys = ['A', 'B', 'C', 'D', 'E'] as const;
    if (modelSoal === 'pilgan') {
      const normalizedArr = parsedOpsi.slice(0, 4).map((item, idx) => {
        if (item && typeof item === 'object') {
          return item as Record<string, unknown>;
        }
        return { label: PILGAN_LABELS[idx], teks: asString(item) };
      });
      pilganOptions = sanitizePilganOptions(normalizedArr);
    } else if (modelSoal === 'mcma') {
      mcmaOptions = parsedOpsi.slice(0, 5).map((item, idx) => {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          const lbl = asString(o.label, alphaKeys[idx]);
          return {
            id: asString(o.id, lbl),
            label: lbl,
            teks: asString(o.teks ?? o.text),
            gambarUrl: sanitizeImageUrl(o.gambarUrl ?? o.gambar),
          };
        }
        return { id: alphaKeys[idx], label: alphaKeys[idx], teks: asString(item) };
      });
    } else if (modelSoal === 'kategori') {
      const parsedKeys = parseKunciList(rawKunci);
      kategoriLabels = ['Benar', 'Salah'];
      kategoriPernyataan = parsedOpsi.map((item, idx) => {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          return {
            id: asString(o.id, `stmt-${id}-${idx + 1}`),
            teks: asString(o.teks ?? o.text),
            kunciJawaban: asString(o.kunciJawaban) || parsedKeys[idx] || 'Benar',
            gambarUrl: sanitizeImageUrl(o.gambarUrl ?? o.gambar),
          };
        }
        return {
          id: `stmt-${id}-${idx + 1}`,
          teks: asString(item),
          kunciJawaban: parsedKeys[idx] || 'Benar',
        };
      });
    }
  }

  let pilganKunci: PilganLabel | undefined;
  let mcmaKunci: string[] | undefined;

  if (modelSoal === 'pilgan') {
    pilganKunci = normalizePilganKunci(rawKunci);
    if (!pilganOptions || pilganOptions.length === 0) {
      pilganOptions = [
        { label: 'A', teks: 'Opsi A' },
        { label: 'B', teks: 'Opsi B' },
        { label: 'C', teks: 'Opsi C' },
        { label: 'D', teks: 'Opsi D' },
      ];
    }
  } else if (modelSoal === 'mcma') {
    mcmaKunci = parseKunciList(rawKunci).map((k) => k.toUpperCase());
    mcmaScoringMode = mcmaScoringMode || 'proportional';
  } else if (modelSoal === 'kategori') {
    kategoriLabels = kategoriLabels || ['Benar', 'Salah'];
    kategoriScoringMode = kategoriScoringMode || 'per_row';
  }

  const now = new Date().toISOString();

  return {
    question: {
      id,
      mapelId,
      topik,
      kelas: kelas || undefined,
      paketUjian: paketUjian || undefined,
      tingkatKesulitan,
      modelSoal,
      teksSoal,
      gambarUrl,
      gambarAlt,
      stimulusId,
      pilganOptions,
      pilganKunci,
      mcmaOptions,
      mcmaKunci,
      mcmaScoringMode,
      kategoriLabels,
      kategoriPernyataan,
      kategoriScoringMode,
      pembahasan,
      pembuatId,
      pembuatNama,
      createdAt: asString(raw.createdAt) || now,
      updatedAt: asString(raw.updatedAt) || now,
    },
    extractedStimulus,
  };
}

/**
 * Menyelaraskan daftar soal pada paket ujian saat Bank Soal dimuat dari Google Sheets.
 */
export function reconcilePackagesWithSheetQuestions(
  packages: ExamPackage[],
  sheetQuestions: Question[]
): ExamPackage[] {
  if (sheetQuestions.length === 0) return packages;

  const validIds = new Set(sheetQuestions.map((q) => q.id));

  return packages.map((pkg) => {
    // 1. Cari soal yang secara eksplisit menyebut judul/id paket ini di kolom paket_ujian
    const explicitlyTagged = sheetQuestions
      .filter((q) => {
        if (!q.paketUjian) return false;
        const tags = q.paketUjian
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        return (
          tags.includes(pkg.id.toLowerCase()) ||
          tags.includes(pkg.judul.toLowerCase())
        );
      })
      .map((q) => q.id);

    // 2. Pertahankan soalIds yang sudah ada jika ID-nya masih ada di sheetQuestions
    const keptExisting = pkg.soalIds.filter((id) => validIds.has(id));
    const combined = Array.from(new Set([...keptExisting, ...explicitlyTagged]));

    if (combined.length > 0) {
      return { ...pkg, soalIds: combined };
    }

    // 3. Jika sheet mengganti ID soal sepenuhnya tanpa tag paket_ujian, isi otomatis sesuai mapel paket
    const matchingSubjectIds = sheetQuestions
      .filter((q) => pkg.mapelId === 'campuran' || q.mapelId === pkg.mapelId)
      .map((q) => q.id);

    return matchingSubjectIds.length > 0
      ? { ...pkg, soalIds: matchingSubjectIds }
      : pkg;
  });
}

function asBoolean(val: unknown, fallback: boolean): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val !== 0;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    if (!s) return fallback;
    if (['true', '1', 'ya', 'yes', 'aktif', 'on'].includes(s)) return true;
    if (['false', '0', 'tidak', 'no', 'nonaktif', 'off'].includes(s)) return false;
  }
  return fallback;
}

function parseStringList(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((item) => asString(item)).filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => asString(item)).filter(Boolean);
        }
      } catch {
        // Fallback ke pemisahan koma di bawah
      }
    }
    return trimmed
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeExamStatus(rawStatus: unknown): ExamStatus {
  const s = asString(rawStatus).toLowerCase();
  if (s === 'draft' || s === 'konsep' || s === 'arsip') return 'draft';
  if (
    s === 'ditutup' ||
    s === 'tutup' ||
    s === 'closed' ||
    s === 'selesai' ||
    s === 'nonaktif'
  ) {
    return 'ditutup';
  }
  return 'terbit';
}

export function mapExamPackageToSheetPaket(pkg: ExamPackage): ExamPackage {
  return {
    id: pkg.id,
    judul: pkg.judul,
    mapelId: pkg.mapelId,
    deskripsi: pkg.deskripsi || '',
    durasiMenit: Number(pkg.durasiMenit) || 45,
    bobotBenar: Number(pkg.bobotBenar ?? 4),
    bobotSalah: Number(pkg.bobotSalah ?? 0),
    bobotKosong: Number(pkg.bobotKosong ?? 0),
    acakSoal: Boolean(pkg.acakSoal),
    acakOpsi: Boolean(pkg.acakOpsi),
    waktuBuka: pkg.waktuBuka || '2026-01-01T00:00:00.000Z',
    waktuTutup: pkg.waktuTutup || '2026-12-31T23:59:00.000Z',
    kelasAkses:
      Array.isArray(pkg.kelasAkses) && pkg.kelasAkses.length > 0
        ? [...pkg.kelasAkses]
        : ['semua'],
    kodeAkses: pkg.kodeAkses?.trim() || '',
    soalIds: Array.isArray(pkg.soalIds) ? [...pkg.soalIds] : [],
    status: normalizeExamStatus(pkg.status),
    izinkanLihatPembahasan: Boolean(pkg.izinkanLihatPembahasan),
    deteksiPindahTab: Boolean(pkg.deteksiPindahTab),
    pembuatId: pkg.pembuatId || 'usr-guru-1',
    pembuatNama: pkg.pembuatNama || 'Guru',
    createdAt: pkg.createdAt || new Date().toISOString(),
  };
}

export function mapSheetPaketToExamPackage(
  raw: Record<string, unknown>,
  index: number
): ExamPackage | null {
  let extra: Record<string, unknown> = {};
  const rawExtra = raw.pengaturan_json ?? raw.pengaturan;
  if (typeof rawExtra === 'string' && rawExtra.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawExtra);
      if (parsed && typeof parsed === 'object') {
        extra = parsed as Record<string, unknown>;
      }
    } catch {
      // Abaikan pengaturan_json tidak valid
    }
  } else if (rawExtra && typeof rawExtra === 'object') {
    extra = rawExtra as Record<string, unknown>;
  }

  const merged: Record<string, unknown> = { ...extra, ...raw };
  const judul = asString(
    merged.judul ?? merged.nama_paket ?? merged.paket_ujian ?? merged.title
  );
  const rawId = asString(merged.id ?? merged.ID ?? merged.paket_id);
  if (!judul && !rawId) return null;

  const id = rawId || `pkg-sheet-${slugifyId(judul) || index + 1}`;
  const mapelId = normalizeSubjectId(
    merged.mapelId ?? merged.mapel_id ?? merged.mapel
  );
  const deskripsi = asString(merged.deskripsi ?? merged.keterangan);
  const durasiMenit = Math.max(
    1,
    Math.round(asNumber(merged.durasiMenit ?? merged.durasi_menit ?? merged.durasi, 45))
  );
  const bobotBenar = asNumber(merged.bobotBenar ?? merged.bobot_benar, 4);
  const bobotSalah = asNumber(merged.bobotSalah ?? merged.bobot_salah, 0);
  const bobotKosong = asNumber(merged.bobotKosong ?? merged.bobot_kosong, 0);
  const acakSoal = asBoolean(merged.acakSoal ?? merged.acak_soal, true);
  const acakOpsi = asBoolean(merged.acakOpsi ?? merged.acak_opsi, true);
  const izinkanLihatPembahasan = asBoolean(
    merged.izinkanLihatPembahasan ??
      merged.izinkan_lihat_pembahasan ??
      merged.lihat_pembahasan,
    true
  );
  const deteksiPindahTab = asBoolean(
    merged.deteksiPindahTab ?? merged.deteksi_pindah_tab ?? merged.anti_cheat,
    true
  );

  const rawWaktuBuka = asString(merged.waktuBuka ?? merged.waktu_buka);
  const rawWaktuTutup = asString(merged.waktuTutup ?? merged.waktu_tutup);
  const rawCreatedAt = asString(merged.createdAt ?? merged.created_at);

  const kelasList = parseStringList(
    merged.kelasAkses ?? merged.kelas_akses ?? merged.kelas
  );
  const kelasAkses = kelasList.length > 0 ? kelasList : ['semua'];
  const kodeAkses =
    asString(merged.kodeAkses ?? merged.kode_akses ?? merged.token) || undefined;
  const soalIds = parseStringList(
    merged.soalIds ?? merged.soal_ids ?? merged.butir_soal ?? merged.soal
  );
  const status = normalizeExamStatus(
    merged.status ?? merged.Status ?? merged.status_publikasi
  );
  const pembuatId = asString(
    merged.pembuatId ?? merged.pembuat_id,
    'usr-guru-1'
  );
  const pembuatNama = asString(
    merged.pembuatNama ?? merged.pembuat_nama,
    'Guru'
  );

  return {
    id,
    judul: judul || `Paket Ujian ${index + 1}`,
    mapelId,
    deskripsi,
    durasiMenit,
    bobotBenar,
    bobotSalah,
    bobotKosong,
    acakSoal,
    acakOpsi,
    waktuBuka: rawWaktuBuka
      ? parseSheetTimestamp(rawWaktuBuka)
      : '2026-01-01T00:00:00.000Z',
    waktuTutup: rawWaktuTutup
      ? parseSheetTimestamp(rawWaktuTutup)
      : '2026-12-31T23:59:00.000Z',
    kelasAkses,
    ...(kodeAkses ? { kodeAkses } : {}),
    soalIds,
    status,
    izinkanLihatPembahasan,
    deteksiPindahTab,
    pembuatId,
    pembuatNama,
    createdAt: rawCreatedAt
      ? parseSheetTimestamp(rawCreatedAt)
      : new Date().toISOString(),
  };
}

export function mapSheetPackages(rawList: unknown[]): ExamPackage[] {
  const deduped = new Map<string, ExamPackage>();
  rawList.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const mapped = mapSheetPaketToExamPackage(item as Record<string, unknown>, idx);
    if (!mapped) return;
    deduped.set(mapped.id, mapped);
  });
  return Array.from(deduped.values());
}

/**
 * Memastikan paket yang datang dari Google Sheets tetap menjaga daftar soalIds pilihan guru
 * jika ID soalnya ada di Bank Soal, dan hanya mengisi otomatis bila soalIds kosong/tidak cocok sama sekali.
 */
export function reconcilePackagesFromSheet(
  sheetPackages: ExamPackage[],
  sheetQuestions: Question[]
): ExamPackage[] {
  if (sheetQuestions.length === 0) return sheetPackages;

  const validIds = new Set(sheetQuestions.map((q) => q.id));

  return sheetPackages.map((pkg) => {
    const curatedValidIds = pkg.soalIds.filter((id) => validIds.has(id));
    if (curatedValidIds.length > 0) {
      return curatedValidIds.length === pkg.soalIds.length
        ? pkg
        : { ...pkg, soalIds: curatedValidIds };
    }

    const explicitlyTagged = sheetQuestions
      .filter((q) => {
        if (!q.paketUjian) return false;
        const tags = q.paketUjian
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        return (
          tags.includes(pkg.id.toLowerCase()) ||
          tags.includes(pkg.judul.toLowerCase())
        );
      })
      .map((q) => q.id);

    if (explicitlyTagged.length > 0) {
      return { ...pkg, soalIds: explicitlyTagged };
    }

    const matchingSubjectIds = sheetQuestions
      .filter((q) => pkg.mapelId === 'campuran' || q.mapelId === pkg.mapelId)
      .map((q) => q.id);

    return matchingSubjectIds.length > 0
      ? { ...pkg, soalIds: matchingSubjectIds }
      : pkg;
  });
}

/**
 * Menggabungkan daftar paket dari server dengan perubahan lokal yang belum tersinkron (offline/pending).
 */
export function mergePackagesWithPendingLocal(
  sheetPackages: ExamPackage[],
  localPackages: ExamPackage[],
  pendingUpsertIds: ReadonlySet<string>,
  pendingDeleteIds: ReadonlySet<string>
): ExamPackage[] {
  const localMap = new Map(localPackages.map((p) => [p.id, p]));
  const result: ExamPackage[] = [];
  const seenIds = new Set<string>();

  sheetPackages.forEach((pkg) => {
    if (pendingDeleteIds.has(pkg.id)) return;
    if (pendingUpsertIds.has(pkg.id)) {
      const localVersion = localMap.get(pkg.id);
      if (localVersion) {
        result.push(localVersion);
        seenIds.add(localVersion.id);
        return;
      }
    }
    result.push(pkg);
    seenIds.add(pkg.id);
  });

  const pendingAdditions: ExamPackage[] = [];
  localPackages.forEach((localPkg) => {
    if (
      pendingUpsertIds.has(localPkg.id) &&
      !pendingDeleteIds.has(localPkg.id) &&
      !seenIds.has(localPkg.id)
    ) {
      pendingAdditions.push(localPkg);
      seenIds.add(localPkg.id);
    }
  });

  return [...pendingAdditions, ...result];
}

/**
 * Memfilter hanya paket ujian dengan status publikasi 'terbit' untuk tampilan siswa.
 */
export function filterPublishedPackages(packages: ExamPackage[]): ExamPackage[] {
  return packages.filter((pkg) => pkg.status === 'terbit');
}

export function buildSimpanNilaiPayload(
  session: ExamSession,
  username?: string
): SimpanNilaiPayload {
  const totalSoal =
    session.totalSoal ||
    session.shuffledSoalIds.length ||
    (session.jumlahBenar ?? 0) + (session.jumlahSalah ?? 0) + (session.jumlahKosong ?? 0);

  return {
    action: 'simpan_nilai',
    nama_siswa: session.muridNama,
    username: username || session.muridUsername || session.muridId,
    kelas: session.kelasNama,
    paket_ujian: session.paketJudul,
    mapel: session.mapelId,
    skor: session.persentaseNilai ?? 0,
    benar: session.jumlahBenar ?? 0,
    salah: session.jumlahSalah ?? 0,
    total_soal: totalSoal,
  };
}

function asNumber(val: unknown, fallback = 0): number {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (typeof val === 'string') {
    const normalized = val.trim().replace(',', '.');
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

/**
 * Mengurai format waktu dari Google Sheets (e.g. "23/11/2026 08:38:08", "23/11/2026 08.38.08",
 * "2026-11-23 08:38:08", atau ISO-8601) menjadi string ISO yang valid untuk new Date().
 */
export function parseSheetTimestamp(rawWaktu: unknown): string {
  const str = asString(rawWaktu);
  if (!str) return new Date().toISOString();

  // Format DD/MM/YYYY[ HH:mm[:ss]] atau DD-MM-YYYY[ HH.mm[.ss]]
  const idMatch = str.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2})[:.](\d{1,2})(?:[:.](\d{1,2}))?)?$/
  );
  if (idMatch) {
    const day = Number(idMatch[1]);
    const month = Number(idMatch[2]);
    const year = Number(idMatch[3]);
    const hour = Number(idMatch[4] ?? 0);
    const minute = Number(idMatch[5] ?? 0);
    const second = Number(idMatch[6] ?? 0);
    const parsed = new Date(year, month - 1, day, hour, minute, second);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  // Format YYYY-MM-DD HH:mm:ss
  const isoSpaceMatch = str.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2})[:.](\d{1,2})(?:[:.](\d{1,2}))?$/
  );
  if (isoSpaceMatch) {
    const year = Number(isoSpaceMatch[1]);
    const month = Number(isoSpaceMatch[2]);
    const day = Number(isoSpaceMatch[3]);
    const hour = Number(isoSpaceMatch[4]);
    const minute = Number(isoSpaceMatch[5]);
    const second = Number(isoSpaceMatch[6] ?? 0);
    const parsed = new Date(year, month - 1, day, hour, minute, second);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  const direct = new Date(str);
  if (!Number.isNaN(direct.getTime())) {
    return direct.toISOString();
  }

  return new Date().toISOString();
}

export function safeTimestampMs(rawDate?: string): number {
  if (!rawDate) return 0;
  const iso = parseSheetTimestamp(rawDate);
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

export function formatSafeDateTime(
  rawDate?: string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
): string {
  if (!rawDate) return '-';
  const direct = new Date(rawDate);
  const dateObj = !Number.isNaN(direct.getTime())
    ? direct
    : new Date(parseSheetTimestamp(rawDate));
  if (Number.isNaN(dateObj.getTime())) return rawDate;
  return dateObj.toLocaleDateString('id-ID', options);
}

export interface StudentIdentityMatcher {
  id: string;
  username?: string;
  nomorInduk?: string;
  nama?: string;
}

export function doesSessionMatchStudent(
  session: ExamSession,
  student: StudentIdentityMatcher
): boolean {
  if (session.muridId && student.id && session.muridId === student.id) {
    return true;
  }

  const sesUser = session.muridUsername?.trim().toLowerCase();
  const stuUser = student.username?.trim().toLowerCase();
  const stuNis = student.nomorInduk?.trim().toLowerCase();

  if (sesUser) {
    if (stuUser && sesUser === stuUser) return true;
    if (stuNis && sesUser === stuNis) return true;
    if (stuUser) return false;
  }

  const sesNama = session.muridNama?.trim().toLowerCase();
  const stuNama = student.nama?.trim().toLowerCase();
  if (sesNama && stuNama && sesNama === stuNama) {
    return true;
  }

  return false;
}

function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Mengonversi satu baris `nilai` dari Google Sheets menjadi objek ExamSession.
 */
export function mapSheetNilaiToSession(
  raw: Record<string, unknown>,
  index: number,
  users: User[] = [],
  packages: ExamPackage[] = []
): ExamSession | null {
  const namaSiswa = asString(raw.nama_siswa ?? raw.namaSiswa ?? raw.nama);
  const username = asString(raw.username ?? raw.Username ?? raw.nis);
  const paketUjian = asString(raw.paket_ujian ?? raw.paketUjian ?? raw.paket);

  if (!namaSiswa && !username && !paketUjian) return null;

  const rawId = asString(raw.id ?? raw.ID);
  const waktuIso = parseSheetTimestamp(raw.waktu ?? raw.waktuSelesai ?? raw.timestamp);
  const kelas = asString(raw.kelas ?? raw.kelasNama, 'Umum');
  const mapelId = normalizeSubjectId(raw.mapel ?? raw.mapelId);

  const skor = Math.round(asNumber(raw.skor ?? raw.persentaseNilai ?? raw.nilai, 0) * 10) / 10;
  const benar = Math.max(0, Math.round(asNumber(raw.benar ?? raw.jumlahBenar, 0)));
  const salah = Math.max(0, Math.round(asNumber(raw.salah ?? raw.jumlahSalah, 0)));
  const totalSoalRaw = Math.max(0, Math.round(asNumber(raw.total_soal ?? raw.totalSoal, 0)));
  const totalSoal = totalSoalRaw > 0 ? totalSoalRaw : benar + salah;
  const kosong = Math.max(0, totalSoal - benar - salah);

  const unameLower = username.toLowerCase();
  const namaLower = namaSiswa.toLowerCase();

  const matchedUser = users.find((u) => {
    if (unameLower) {
      if (u.username.toLowerCase() === unameLower) return true;
      if (u.nomorInduk && u.nomorInduk.toLowerCase() === unameLower) return true;
    }
    if (namaLower && u.nama.toLowerCase() === namaLower) return true;
    return false;
  });

  const paketLower = paketUjian.toLowerCase();
  const matchedPkg = packages.find(
    (p) =>
      p.judul.trim().toLowerCase() === paketLower ||
      p.id.trim().toLowerCase() === paketLower
  );

  const fallbackStudentKey = unameLower || slugifyId(namaSiswa) || `anon-${index + 1}`;
  const muridId = matchedUser?.id || `usr-sheet-${fallbackStudentKey}`;
  const paketId = matchedPkg?.id || `pkg-sheet-${slugifyId(paketUjian) || index + 1}`;
  const id =
    rawId ||
    `nilai-sheet-${fallbackStudentKey}-${slugifyId(paketUjian) || 'ujian'}-${index + 1}`;

  return {
    id,
    paketId,
    paketJudul: matchedPkg?.judul || paketUjian || 'Paket Ujian CBT',
    mapelId: matchedPkg?.mapelId || mapelId,
    muridId,
    muridUsername: username || matchedUser?.username || fallbackStudentKey,
    muridNama: namaSiswa || matchedUser?.nama || username || 'Siswa',
    kelasNama: kelas || matchedUser?.kelasId || 'Umum',
    waktuMulai: waktuIso,
    waktuSelesai: waktuIso,
    durasiDetikTerpakai: 0,
    sisaDetik: 0,
    status: 'selesai',
    answers: {},
    shuffledSoalIds: [],
    jumlahPelanggaranTab: 0,
    persentaseNilai: skor,
    jumlahBenar: benar,
    jumlahSalah: salah,
    jumlahKosong: kosong,
    totalSoal,
    nilaiSyncStatus: 'saved',
    fromGoogleSheets: true,
  };
}

function isSameNilaiAttempt(sheetSes: ExamSession, localSes: ExamSession): boolean {
  if (sheetSes.id === localSes.id || localSes.localSessionId === sheetSes.id) {
    return true;
  }

  const sameStudent = doesSessionMatchStudent(sheetSes, {
    id: localSes.muridId,
    username: localSes.muridUsername,
    nama: localSes.muridNama,
  });
  if (!sameStudent) return false;

  const samePackage =
    sheetSes.paketJudul.trim().toLowerCase() === localSes.paketJudul.trim().toLowerCase();
  if (!samePackage) return false;

  const sameScore =
    Math.abs((sheetSes.persentaseNilai ?? 0) - (localSes.persentaseNilai ?? 0)) < 0.05 &&
    (sheetSes.jumlahBenar ?? 0) === (localSes.jumlahBenar ?? 0) &&
    (sheetSes.jumlahSalah ?? 0) === (localSes.jumlahSalah ?? 0);

  return sameScore;
}

/**
 * Menggabungkan riwayat nilai dari Google Sheets (`sheetSessions`) dengan state lokal
 * tanpa menghasilkan duplikasi, sambil mempertahankan detail jawaban per-butir lokal
 * dan sesi lokal yang belum berhasil tersinkron (saving/error).
 */
export function mergeSheetNilaiSessions(
  sheetSessions: ExamSession[],
  existingSessions: ExamSession[]
): { sessions: ExamSession[]; remappedIds: Record<string, string> } {
  const remappedIds: Record<string, string> = {};

  if (sheetSessions.length === 0) {
    return { sessions: existingSessions, remappedIds };
  }

  // Deduplikasi sheetSessions berdasarkan id jika ada id ganda dari sheet
  const dedupedSheetMap = new Map<string, ExamSession>();
  sheetSessions.forEach((s) => {
    dedupedSheetMap.set(s.id, s);
  });
  const uniqueSheetSessions = Array.from(dedupedSheetMap.values());

  const localNonSheetCompleted = existingSessions.filter(
    (s) => s.status === 'selesai' && !s.fromGoogleSheets
  );
  const consumedLocalIds = new Set<string>();

  const enrichedSheetSessions = uniqueSheetSessions.map((sheetSes) => {
    const matchedLocal =
      existingSessions.find(
        (l) => !consumedLocalIds.has(l.id) && l.id === sheetSes.id
      ) ||
      localNonSheetCompleted.find(
        (l) => !consumedLocalIds.has(l.id) && isSameNilaiAttempt(sheetSes, l)
      );

    if (!matchedLocal) {
      return sheetSes;
    }

    consumedLocalIds.add(matchedLocal.id);
    if (matchedLocal.id !== sheetSes.id) {
      remappedIds[matchedLocal.id] = sheetSes.id;
    }

    const hasLocalDetails =
      Object.keys(matchedLocal.answers || {}).length > 0 ||
      (matchedLocal.shuffledSoalIds?.length || 0) > 0;

    return {
      ...sheetSes,
      localSessionId: matchedLocal.localSessionId || (matchedLocal.id !== sheetSes.id ? matchedLocal.id : undefined),
      waktuMulai: matchedLocal.waktuMulai || sheetSes.waktuMulai,
      durasiDetikTerpakai: matchedLocal.durasiDetikTerpakai || sheetSes.durasiDetikTerpakai,
      answers: hasLocalDetails ? matchedLocal.answers : sheetSes.answers,
      shuffledSoalIds: hasLocalDetails ? matchedLocal.shuffledSoalIds : sheetSes.shuffledSoalIds,
      jumlahPelanggaranTab: matchedLocal.jumlahPelanggaranTab ?? sheetSes.jumlahPelanggaranTab,
      totalSkor: matchedLocal.totalSkor ?? sheetSes.totalSkor,
      skorMaksimal: matchedLocal.skorMaksimal ?? sheetSes.skorMaksimal,
      nilaiSyncStatus: 'saved' as const,
      fromGoogleSheets: true,
    };
  });

  // Pertahankan sesi lokal yang masih proses kirim atau gagal kirim dan belum masuk sheet
  const pendingOrUnsyncedLocals = localNonSheetCompleted.filter(
    (l) =>
      !consumedLocalIds.has(l.id) &&
      (l.nilaiSyncStatus === 'saving' || l.nilaiSyncStatus === 'error')
  );

  const combined = [...pendingOrUnsyncedLocals, ...enrichedSheetSessions].sort(
    (a, b) =>
      safeTimestampMs(b.waktuSelesai || b.waktuMulai) -
      safeTimestampMs(a.waktuSelesai || a.waktuMulai)
  );

  return { sessions: combined, remappedIds };
}

export function buildUpdateMonitoringPayload(params: {
  session: ExamSession;
  username?: string;
  status: MonitoringStatus;
  progres: string;
  pindahTab?: number;
}): UpdateMonitoringPayload {
  const { session, username, status, progres, pindahTab } = params;
  return {
    action: 'update_monitoring',
    username: username || session.muridUsername || session.muridId,
    nama_siswa: session.muridNama,
    kelas: session.kelasNama || 'Umum',
    paket_ujian: session.paketJudul,
    status,
    progres,
    pindah_tab: Math.max(0, Math.round(pindahTab ?? session.jumlahPelanggaranTab ?? 0)),
  };
}

/**
 * Mengurai timestamp monitoring (epoch ms, epoch detik, atau format tanggal/ISO) ke milidetik.
 */
export function parseMonitoringTimestampMs(
  rawTimestamp: unknown,
  rawUpdateTerakhir?: unknown
): number {
  if (typeof rawTimestamp === 'number' && Number.isFinite(rawTimestamp) && rawTimestamp > 0) {
    return rawTimestamp < 1e12 ? Math.round(rawTimestamp * 1000) : Math.round(rawTimestamp);
  }

  if (typeof rawTimestamp === 'string') {
    const trimmed = rawTimestamp.trim();
    if (trimmed) {
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        const num = Number(trimmed);
        if (Number.isFinite(num) && num > 0) {
          return num < 1e12 ? Math.round(num * 1000) : Math.round(num);
        }
      }
      const parsedMs = safeTimestampMs(trimmed);
      if (parsedMs > 0) return parsedMs;
    }
  }

  const fallbackStr = asString(rawUpdateTerakhir);
  if (fallbackStr) {
    return safeTimestampMs(fallbackStr);
  }

  return 0;
}

export function mapSheetMonitoringRow(raw: Record<string, unknown>): MonitoringEntry | null {
  const username = asString(raw.username ?? raw.Username ?? raw.nis);
  const namaSiswa = asString(raw.nama_siswa ?? raw.namaSiswa ?? raw.nama);
  const paketUjian = asString(raw.paket_ujian ?? raw.paketUjian ?? raw.paket);

  if (!username && !namaSiswa) return null;

  const kelas = asString(raw.kelas ?? raw.Kelas, 'Umum');
  const status = asString(raw.status ?? raw.Status, 'Mengerjakan');
  const progres = asString(raw.progres ?? raw.Progres, '-');
  const pindahTab = Math.max(0, Math.round(asNumber(raw.pindah_tab ?? raw.pindahTab, 0)));
  const rawUpdateTerakhir = raw.update_terakhir ?? raw.updateTerakhir ?? raw.waktu;
  const timestamp = parseMonitoringTimestampMs(
    raw.timestamp ?? raw.Timestamp,
    rawUpdateTerakhir
  );

  const updateTerakhir =
    asString(rawUpdateTerakhir) ||
    (timestamp > 0
      ? new Date(timestamp).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : '-');

  return {
    username: username || namaSiswa,
    namaSiswa: namaSiswa || username,
    kelas,
    paketUjian: paketUjian || 'Paket Ujian CBT',
    status,
    progres,
    pindahTab,
    updateTerakhir,
    timestamp,
  };
}

export function mapMonitoringRows(rawList: unknown[]): MonitoringEntry[] {
  const deduped = new Map<string, MonitoringEntry>();

  rawList.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const mapped = mapSheetMonitoringRow(item as Record<string, unknown>);
    if (!mapped) return;

    const key = `${(mapped.username || mapped.namaSiswa).trim().toLowerCase()}::${mapped.paketUjian.trim().toLowerCase()}`;
    const existing = deduped.get(key);
    if (!existing || mapped.timestamp >= existing.timestamp) {
      deduped.set(key, mapped);
    }
  });

  return Array.from(deduped.values()).sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Menentukan apakah peserta tercatat aktif mengerjakan dalam 3 menit (180.000 ms) terakhir.
 */
export function isMonitoringEntryActive(
  entry: MonitoringEntry,
  nowMs: number = Date.now()
): boolean {
  return (
    entry.status.trim().toLowerCase() === 'mengerjakan' &&
    entry.timestamp > 0 &&
    nowMs - entry.timestamp < 180000
  );
}

/**
 * Mengamankan nilai sel CSV dari Excel/Spreadsheet formula injection dan kutip ganda.
 */
export function sanitizeCsvCell(value: string | number | undefined | null): string {
  const str = value === null || value === undefined ? '' : String(value);
  const formulaNeutralized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  const escaped = formulaNeutralized.replace(/"/g, '""');
  return `"${escaped}"`;
}

