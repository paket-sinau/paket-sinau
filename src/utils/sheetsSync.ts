/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DifficultyLevel,
  ExamPackage,
  ExamSession,
  KategoriStatement,
  PilganOption,
  Question,
  QuestionModel,
  Stimulus,
  SubjectId,
  User,
  UserRole,
} from '../types';

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
    pilganOptions: q.pilganOptions,
    mcmaOptions: q.mcmaOptions,
    mcmaScoringMode: q.mcmaScoringMode,
    kategoriLabels: q.kategoriLabels,
    kategoriPernyataan: q.kategoriPernyataan,
    kategoriScoringMode: q.kategoriScoringMode,
  };

  let kunci = '';
  if (q.modelSoal === 'pilgan') {
    kunci = q.pilganKunci || 'A';
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
    .split(/[;,|]/)
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
      const labels: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
      pilganOptions = obj.pilganOptions.map((o, idx) => {
        const item = o as Record<string, unknown>;
        const lbl = (asString(item.label, labels[idx] || 'A').toUpperCase().charAt(0) as
          | 'A'
          | 'B'
          | 'C'
          | 'D'
          | 'E');
        return {
          label: labels.includes(lbl) ? lbl : labels[idx] || 'A',
          teks: asString(item.teks ?? item.text),
          gambarUrl: sanitizeImageUrl(item.gambarUrl ?? item.gambar),
        };
      });
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
      const alphaKeys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
      const mapped = alphaKeys
        .filter((k) => obj[k] !== undefined)
        .map((k) => ({ label: k, teks: asString(obj[k]) }));
      if (mapped.length > 0) {
        if (modelSoal === 'mcma') {
          mcmaOptions = mapped.map((m) => ({ id: m.label, label: m.label, teks: m.teks }));
        } else {
          pilganOptions = mapped;
        }
      }
    }
  } else if (Array.isArray(parsedOpsi)) {
    const alphaKeys: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
    if (modelSoal === 'pilgan') {
      pilganOptions = parsedOpsi.slice(0, 5).map((item, idx) => {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          return {
            label: (asString(o.label, alphaKeys[idx]) as 'A' | 'B' | 'C' | 'D' | 'E'),
            teks: asString(o.teks ?? o.text),
            gambarUrl: sanitizeImageUrl(o.gambarUrl ?? o.gambar),
          };
        }
        return { label: alphaKeys[idx], teks: asString(item) };
      });
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

  let pilganKunci: 'A' | 'B' | 'C' | 'D' | 'E' | undefined;
  let mcmaKunci: string[] | undefined;

  if (modelSoal === 'pilgan') {
    const k = asString(rawKunci, 'A').toUpperCase().charAt(0);
    pilganKunci = (['A', 'B', 'C', 'D', 'E'].includes(k) ? k : 'A') as 'A' | 'B' | 'C' | 'D' | 'E';
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

export function buildSimpanNilaiPayload(
  session: ExamSession,
  username?: string
): SimpanNilaiPayload {
  const totalSoal =
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
