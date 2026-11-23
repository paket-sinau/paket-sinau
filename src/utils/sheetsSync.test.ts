/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSimpanNilaiPayload,
  buildUpdateMonitoringPayload,
  filterPublishedPackages,
  isMonitoringEntryActive,
  mapExamPackageToSheetPaket,
  mapMonitoringRows,
  mapQuestionToSheetSoal,
  mapSheetNilaiToSession,
  mapSheetPackages,
  mapSheetPaketToExamPackage,
  mapSheetPesertaToUser,
  mapSheetSoalToQuestion,
  mapUserToSheetPeserta,
  mergePackagesWithPendingLocal,
  mergeSheetNilaiSessions,
  mergeUsersWithAdminFallback,
  parseMonitoringTimestampMs,
  parseSheetTimestamp,
  reconcilePackagesFromSheet,
  reconcilePackagesWithSheetQuestions,
  sanitizeCsvCell,
  sanitizeImageUrl,
  sanitizePilganOptions,
  sanitizeQuestionPilgan,
} from './sheetsSync.ts';
import type { ExamPackage, ExamSession, MonitoringEntry, Question, Stimulus, User } from '../types/index.ts';

test('sanitizeImageUrl allows safe https, relative paths, and raster data URLs while blocking dangerous URIs', () => {
  assert.equal(
    sanitizeImageUrl('https://drive.google.com/uc?export=view&id=123'),
    'https://drive.google.com/uc?export=view&id=123'
  );
  assert.equal(sanitizeImageUrl('/assets/aistudio/logo.jpg'), '/assets/aistudio/logo.jpg');
  assert.equal(
    sanitizeImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'),
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'
  );
  assert.equal(sanitizeImageUrl('javascript:alert(1)'), undefined);
  assert.equal(sanitizeImageUrl('data:text/html,<script>alert(1)</script>'), undefined);
  assert.equal(sanitizeImageUrl('data:image/svg+xml;base64,PHN2Zz4='), undefined);
  assert.equal(sanitizeImageUrl('//evil.example/img.png'), undefined);
  assert.equal(sanitizeImageUrl('   '), undefined);
});

test('User <-> Sheet Peserta mapping round-trips cleanly', () => {
  const user: User = {
    id: 'usr-murid-99',
    username: '20260099',
    nomorInduk: '20260099',
    nama: 'Aisyah Putri',
    email: 'aisyah@siswa.sch.id',
    role: 'murid',
    password: 'siswa',
    kelasId: 'Kelas 6A',
    aktif: true,
    createdAt: '2026-01-15T07:00:00Z',
  };

  const row = mapUserToSheetPeserta(user);
  assert.deepEqual(row, {
    id: 'usr-murid-99',
    username: '20260099',
    password: 'siswa',
    nama: 'Aisyah Putri',
    role: 'murid',
    kelas: 'Kelas 6A',
    nomor_induk: '20260099',
  });

  const restored = mapSheetPesertaToUser(row as unknown as Record<string, unknown>, 0);
  assert.ok(restored);
  assert.equal(restored.id, 'usr-murid-99');
  assert.equal(restored.username, '20260099');
  assert.equal(restored.nomorInduk, '20260099');
  assert.equal(restored.nama, 'Aisyah Putri');
  assert.equal(restored.role, 'murid');
  assert.equal(restored.kelasId, 'Kelas 6A');
  assert.equal(restored.password, 'siswa');
});

test('mergeUsersWithAdminFallback preserves fallback admin if sheet has no admin or is empty', () => {
  const fallbackAdmins: User[] = [
    {
      id: 'usr-admin-1',
      username: 'admin',
      nama: 'Administrator',
      email: 'admin@paketsinau.sch.id',
      role: 'admin',
      password: 'admin',
      aktif: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];
  const existingUsers: User[] = [
    ...fallbackAdmins,
    {
      id: 'usr-murid-1',
      username: 'raditya.p',
      nama: 'Raditya Pratama',
      email: 'raditya@siswa.sch.id',
      role: 'murid',
      password: 'siswa',
      kelasId: 'Kelas 6A',
      aktif: true,
      createdAt: '2026-01-01T00:00:00Z',
      customKkm: { matematika: 85 },
    },
  ];

  // Empty sheet -> keep existing
  assert.deepEqual(mergeUsersWithAdminFallback([], existingUsers, fallbackAdmins), existingUsers);

  // Sheet with only students -> injects admin fallback & preserves customKkm
  const sheetStudents: User[] = [
    {
      id: 'usr-murid-1',
      username: 'raditya.p',
      nama: 'Raditya Pratama (Sheets)',
      email: 'raditya@sekolah.sch.id',
      role: 'murid',
      password: 'baru',
      kelasId: 'Kelas 6B',
      aktif: true,
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  const merged = mergeUsersWithAdminFallback(sheetStudents, existingUsers, fallbackAdmins);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].username, 'admin');
  assert.equal(merged[0].role, 'admin');
  assert.equal(merged[1].nama, 'Raditya Pratama (Sheets)');
  assert.deepEqual(merged[1].customKkm, { matematika: 85 });
});

test('Question <-> Sheet Soal round-trip preserves PILGAN, MCMA, KATEGORI, Data URLs, and Stimulus', () => {
  const packages: ExamPackage[] = [
    {
      id: 'pkg-1',
      judul: 'Tryout TKA Matematika SD 2026',
      mapelId: 'matematika',
      deskripsi: 'Paket latihan',
      durasiMenit: 60,
      bobotBenar: 4,
      bobotSalah: 0,
      bobotKosong: 0,
      acakSoal: true,
      acakOpsi: true,
      waktuBuka: '2026-01-01T00:00:00Z',
      waktuTutup: '2026-12-31T23:59:00Z',
      kelasAkses: ['Kelas 6A'],
      soalIds: ['q-pilgan', 'q-mcma', 'q-kat'],
      status: 'terbit',
      izinkanLihatPembahasan: true,
      deteksiPindahTab: true,
      pembuatId: 'usr-guru-1',
      pembuatNama: 'Budi',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  const stimuli: Stimulus[] = [
    {
      id: 'stm-custom',
      judul: 'Teks Panen Padi',
      teks: 'Pak Tani memanen 200 kg beras.',
      sumber: 'Arsip SD',
    },
  ];

  const qPilgan: Question = {
    id: 'q-pilgan',
    mapelId: 'matematika',
    topik: 'Pecahan',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    stimulusId: 'stm-custom',
    teksSoal: 'Berapakah setengah dari 100?',
    gambarUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
    gambarAlt: 'Diagram pecahan',
    pilganOptions: [
      { label: 'A', teks: '25' },
      { label: 'B', teks: '50', gambarUrl: 'https://drive.google.com/uc?export=view&id=abc' },
      { label: 'C', teks: '75' },
      { label: 'D', teks: '100' },
    ],
    pilganKunci: 'B',
    pembahasan: '1/2 x 100 = 50',
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const qMcma: Question = {
    id: 'q-mcma',
    mapelId: 'ipa',
    topik: 'Energi',
    tingkatKesulitan: 'sedang',
    modelSoal: 'mcma',
    teksSoal: 'Pilih sumber energi terbarukan:',
    mcmaOptions: [
      { id: 'A', label: 'A', teks: 'Matahari' },
      { id: 'B', label: 'B', teks: 'Batu bara' },
      { id: 'C', label: 'C', teks: 'Angin' },
    ],
    mcmaKunci: ['A', 'C'],
    mcmaScoringMode: 'proportional',
    pembahasan: 'Matahari dan angin terbarukan.',
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const qKat: Question = {
    id: 'q-kat',
    mapelId: 'bahasa_indonesia',
    topik: 'Kalimat',
    tingkatKesulitan: 'sulit',
    modelSoal: 'kategori',
    teksSoal: 'Tentukan Fakta atau Opini:',
    kategoriLabels: ['Fakta', 'Opini'],
    kategoriPernyataan: [
      { id: 's1', teks: 'Air mendidih pada 100 C.', kunciJawaban: 'Fakta' },
      { id: 's2', teks: 'Es krim cokelat paling enak.', kunciJawaban: 'Opini' },
    ],
    kategoriScoringMode: 'per_row',
    pembahasan: 'Suhu didih air dapat diukur.',
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Budi',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const rowP = mapQuestionToSheetSoal(qPilgan, packages, stimuli);
  assert.equal(rowP.paket_ujian, 'Tryout TKA Matematika SD 2026');
  assert.equal(rowP.gambar, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');
  assert.equal(rowP.kunci, 'B');

  const restoredP = mapSheetSoalToQuestion(rowP as unknown as Record<string, unknown>, 0);
  assert.ok(restoredP);
  assert.equal(restoredP.question.pilganKunci, 'B');
  assert.equal(restoredP.question.pilganOptions?.[1].gambarUrl, 'https://drive.google.com/uc?export=view&id=abc');
  assert.equal(restoredP.extractedStimulus?.id, 'stm-custom');

  const rowM = mapQuestionToSheetSoal(qMcma, packages, stimuli);
  assert.equal(rowM.kunci, 'A,C');
  const restoredM = mapSheetSoalToQuestion(rowM as unknown as Record<string, unknown>, 1);
  assert.deepEqual(restoredM?.question.mcmaKunci, ['A', 'C']);

  const rowK = mapQuestionToSheetSoal(qKat, packages, stimuli);
  assert.equal(rowK.kunci, 'Fakta,Opini');
  const restoredK = mapSheetSoalToQuestion(rowK as unknown as Record<string, unknown>, 2);
  assert.deepEqual(restoredK?.question.kategoriLabels, ['Fakta', 'Opini']);
  assert.equal(restoredK?.question.kategoriPernyataan?.[1].kunciJawaban, 'Opini');
});

test('mapSheetSoalToQuestion gracefully parses simplified manual opsi_json arrays', () => {
  const manualRow = {
    id: 'sheet-manual-1',
    paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
    mapel: 'Matematika',
    kelas: 'Kelas 6',
    model: 'Pilihan Ganda',
    pertanyaan: '2 + 3 = ...',
    gambar: 'https://lh3.googleusercontent.com/d/sample',
    opsi_json: '["4", "5", "6", "7"]',
    kunci: 'B',
    pembahasan: '2 + 3 = 5',
  };

  const mapped = mapSheetSoalToQuestion(manualRow, 0);
  assert.ok(mapped);
  assert.equal(mapped.question.mapelId, 'matematika');
  assert.equal(mapped.question.modelSoal, 'pilgan');
  assert.equal(mapped.question.pilganKunci, 'B');
  assert.equal(mapped.question.pilganOptions?.[1].teks, '5');
  assert.equal(mapped.question.gambarUrl, 'https://lh3.googleusercontent.com/d/sample');
});

test('reconcilePackagesWithSheetQuestions associates tagged and subject-matched sheet questions', () => {
  const pkgs: ExamPackage[] = [
    {
      id: 'pkg-1',
      judul: 'Tryout TKA Matematika SD/MI 2026',
      mapelId: 'matematika',
      deskripsi: 'Desc',
      durasiMenit: 60,
      bobotBenar: 4,
      bobotSalah: 0,
      bobotKosong: 0,
      acakSoal: true,
      acakOpsi: true,
      waktuBuka: '2026-01-01T00:00:00Z',
      waktuTutup: '2026-12-31T23:59:00Z',
      kelasAkses: ['semua'],
      soalIds: ['old-1'],
      status: 'terbit',
      izinkanLihatPembahasan: true,
      deteksiPindahTab: true,
      pembuatId: 'u1',
      pembuatNama: 'Guru',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  const sheetQuestions: Question[] = [
    {
      id: 'sheet-mtk-1',
      mapelId: 'matematika',
      topik: 'Bilangan',
      paketUjian: 'Tryout TKA Matematika SD/MI 2026',
      tingkatKesulitan: 'mudah',
      modelSoal: 'pilgan',
      teksSoal: 'Soal 1',
      pembahasan: '',
      pembuatId: 'u1',
      pembuatNama: 'Guru',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  const updated = reconcilePackagesWithSheetQuestions(pkgs, sheetQuestions);
  assert.deepEqual(updated[0].soalIds, ['sheet-mtk-1']);
});

test('buildSimpanNilaiPayload constructs exact GAS schema for exam completion', () => {
  const session: ExamSession = {
    id: 'ses-123',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026',
    mapelId: 'matematika',
    muridId: 'usr-murid-1',
    muridUsername: 'raditya.p',
    muridNama: 'Raditya Pratama',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-01-01T08:00:00Z',
    waktuSelesai: '2026-01-01T08:30:00Z',
    durasiDetikTerpakai: 1800,
    sisaDetik: 1800,
    status: 'selesai',
    answers: {},
    shuffledSoalIds: ['q1', 'q2', 'q3', 'q4'],
    jumlahPelanggaranTab: 0,
    persentaseNilai: 75,
    jumlahBenar: 3,
    jumlahSalah: 1,
    jumlahKosong: 0,
  };

  const payload = buildSimpanNilaiPayload(session);
  assert.deepEqual(payload, {
    action: 'simpan_nilai',
    nama_siswa: 'Raditya Pratama',
    username: 'raditya.p',
    kelas: 'Kelas 6A',
    paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
    mapel: 'matematika',
    skor: 75,
    benar: 3,
    salah: 1,
    total_soal: 4,
  });
});

test('parseSheetTimestamp parses Indonesian DD/MM/YYYY HH:mm:ss and ISO dates without Invalid Date', () => {
  const iso1 = parseSheetTimestamp('23/11/2026 08:38:08');
  const d1 = new Date(iso1);
  assert.equal(Number.isNaN(d1.getTime()), false);
  assert.equal(d1.getFullYear(), 2026);
  assert.equal(d1.getMonth(), 10); // November = 10
  assert.equal(d1.getDate(), 23);
  assert.equal(d1.getHours(), 8);
  assert.equal(d1.getMinutes(), 38);

  const iso2 = parseSheetTimestamp('23/11/2026 09.15.00');
  const d2 = new Date(iso2);
  assert.equal(d2.getHours(), 9);
  assert.equal(d2.getMinutes(), 15);
});

test('mapSheetNilaiToSession maps live Google Sheets nilai row and resolves student & package IDs', () => {
  const users: User[] = [
    {
      id: 'usr-murid-3',
      username: 'fajar.h',
      nama: 'Fajar Nugraha',
      email: 'fajar@siswa.sch.id',
      role: 'murid',
      kelasId: 'Kelas 6A',
      aktif: true,
      createdAt: '2026-01-15T07:10:00Z',
    },
  ];
  const packages: ExamPackage[] = [
    {
      id: 'pkg-1',
      judul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
      mapelId: 'matematika',
      deskripsi: 'Desc',
      durasiMenit: 60,
      bobotBenar: 4,
      bobotSalah: 0,
      bobotKosong: 0,
      acakSoal: true,
      acakOpsi: true,
      waktuBuka: '2026-01-01T00:00:00Z',
      waktuTutup: '2026-12-31T23:59:00Z',
      kelasAkses: ['semua'],
      soalIds: ['mtk-1'],
      status: 'terbit',
      izinkanLihatPembahasan: true,
      deteksiPindahTab: true,
      pembuatId: 'u1',
      pembuatNama: 'Guru',
      createdAt: '2026-01-01T00:00:00Z',
    },
  ];

  const liveNilaiRow = {
    id: 'nilai_1',
    waktu: '23/11/2026 08:38:08',
    nama_siswa: 'Fajar Nugraha',
    username: 'fajar.h',
    kelas: 'Kelas 6A',
    paket_ujian: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapel: 'matematika',
    skor: 4.4,
    benar: 1,
    salah: 2,
    total_soal: 30,
  };

  const session = mapSheetNilaiToSession(liveNilaiRow, 0, users, packages);
  assert.ok(session);
  assert.equal(session.id, 'nilai_1');
  assert.equal(session.muridId, 'usr-murid-3');
  assert.equal(session.muridUsername, 'fajar.h');
  assert.equal(session.paketId, 'pkg-1');
  assert.equal(session.persentaseNilai, 4.4);
  assert.equal(session.jumlahBenar, 1);
  assert.equal(session.jumlahSalah, 2);
  assert.equal(session.jumlahKosong, 27);
  assert.equal(session.totalSoal, 30);
  assert.equal(session.fromGoogleSheets, true);
  assert.equal(session.nilaiSyncStatus, 'saved');
});

test('mergeSheetNilaiSessions prevents duplicates on repeated GET and merges newly submitted local sessions', () => {
  const localSubmitted: ExamSession = {
    id: 'ses-1760000001-3',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    muridId: 'usr-murid-3',
    muridUsername: 'fajar.h',
    muridNama: 'Fajar Nugraha',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-11-23T08:00:00.000Z',
    waktuSelesai: '2026-11-23T08:38:00.000Z',
    durasiDetikTerpakai: 450,
    sisaDetik: 3150,
    status: 'selesai',
    answers: {
      'mtk-1': { questionId: 'mtk-1', modelSoal: 'pilgan', state: 'sudah_dijawab', pilganAnswer: 'B', isFullyCorrect: true },
    },
    shuffledSoalIds: ['mtk-1', 'mtk-2'],
    jumlahPelanggaranTab: 1,
    persentaseNilai: 4.4,
    jumlahBenar: 1,
    jumlahSalah: 2,
    jumlahKosong: 27,
    totalSoal: 30,
    nilaiSyncStatus: 'saved',
    fromGoogleSheets: false,
  };

  const unsyncedErrorLocal: ExamSession = {
    ...localSubmitted,
    id: 'ses-1760000002-error',
    persentaseNilai: 90,
    jumlahBenar: 27,
    jumlahSalah: 3,
    jumlahKosong: 0,
    nilaiSyncStatus: 'error',
  };

  const sheetSession: ExamSession = {
    id: 'nilai_1',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026 (30 Soal Lengkap)',
    mapelId: 'matematika',
    muridId: 'usr-murid-3',
    muridUsername: 'fajar.h',
    muridNama: 'Fajar Nugraha',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-11-23T08:38:08.000Z',
    waktuSelesai: '2026-11-23T08:38:08.000Z',
    durasiDetikTerpakai: 0,
    sisaDetik: 0,
    status: 'selesai',
    answers: {},
    shuffledSoalIds: [],
    jumlahPelanggaranTab: 0,
    persentaseNilai: 4.4,
    jumlahBenar: 1,
    jumlahSalah: 2,
    jumlahKosong: 27,
    totalSoal: 30,
    nilaiSyncStatus: 'saved',
    fromGoogleSheets: true,
  };

  const merged1 = mergeSheetNilaiSessions([sheetSession], [localSubmitted, unsyncedErrorLocal]);
  // Should have 2 entries: 1 unsynced error local + 1 merged nilai_1 (localSubmitted deduplicated)
  assert.equal(merged1.sessions.length, 2);
  assert.equal(merged1.remappedIds['ses-1760000001-3'], 'nilai_1');

  const mergedSheetItem = merged1.sessions.find((s) => s.id === 'nilai_1');
  assert.ok(mergedSheetItem);
  assert.equal(mergedSheetItem.durasiDetikTerpakai, 450);
  assert.deepEqual(mergedSheetItem.shuffledSoalIds, ['mtk-1', 'mtk-2']);
  assert.equal(mergedSheetItem.answers['mtk-1']?.pilganAnswer, 'B');

  // Re-syncing again produces the exact same 2 sessions without duplicating
  const merged2 = mergeSheetNilaiSessions([sheetSession], merged1.sessions);
  assert.equal(merged2.sessions.length, 2);
});

test('sanitizeCsvCell neutralizes spreadsheet formula injection and escapes quotes', () => {
  assert.equal(sanitizeCsvCell('=CMD("calc")'), `"'=CMD(""calc"")"`);
  assert.equal(sanitizeCsvCell('+1+1'), `"'${'+1+1'}"`);
  assert.equal(sanitizeCsvCell('-2+3'), `"'${'-2+3'}"`);
  assert.equal(sanitizeCsvCell('@SUM(A1)'), `"'${'@SUM(A1)'}"`);
  assert.equal(sanitizeCsvCell('Fajar "Bintang"'), '"Fajar ""Bintang"""');
});

test('buildUpdateMonitoringPayload constructs exact GAS update_monitoring schema', () => {
  const session: ExamSession = {
    id: 'ses-mon-1',
    paketId: 'pkg-1',
    paketJudul: 'Tryout TKA Matematika SD/MI 2026',
    mapelId: 'matematika',
    muridId: 'usr-murid-1',
    muridUsername: 'raditya.p',
    muridNama: 'Raditya Pratama',
    kelasNama: 'Kelas 6A',
    waktuMulai: '2026-11-23T08:00:00Z',
    durasiDetikTerpakai: 45,
    sisaDetik: 3555,
    status: 'berjalan',
    answers: {},
    shuffledSoalIds: ['q1', 'q2', 'q3'],
    jumlahPelanggaranTab: 1,
  };

  assert.deepEqual(
    buildUpdateMonitoringPayload({
      session,
      status: 'Mengerjakan',
      progres: 'Soal 2 dari 3',
    }),
    {
      action: 'update_monitoring',
      username: 'raditya.p',
      nama_siswa: 'Raditya Pratama',
      kelas: 'Kelas 6A',
      paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
      status: 'Mengerjakan',
      progres: 'Soal 2 dari 3',
      pindah_tab: 1,
    }
  );

  assert.deepEqual(
    buildUpdateMonitoringPayload({
      session,
      status: 'Selesai',
      progres: 'Soal 3 dari 3',
      pindahTab: 2,
    }),
    {
      action: 'update_monitoring',
      username: 'raditya.p',
      nama_siswa: 'Raditya Pratama',
      kelas: 'Kelas 6A',
      paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
      status: 'Selesai',
      progres: 'Soal 3 dari 3',
      pindah_tab: 2,
    }
  );
});

test('parseMonitoringTimestampMs handles epoch ms, epoch seconds, and Indonesian update_terakhir fallback', () => {
  assert.equal(parseMonitoringTimestampMs(1795400000000), 1795400000000);
  assert.equal(parseMonitoringTimestampMs(1795400000), 1795400000000);
  assert.equal(parseMonitoringTimestampMs('1795400000123'), 1795400000123);
  const fromStr = parseMonitoringTimestampMs('', '23/11/2026 09:30:00');
  assert.equal(fromStr > 0, true);
  assert.equal(parseMonitoringTimestampMs('', ''), 0);
});

test('mapMonitoringRows deduplicates student+package keeping latest timestamp and sorts newest first', () => {
  const rows = [
    {
      username: 'raditya.p',
      nama_siswa: 'Raditya Pratama',
      kelas: 'Kelas 6A',
      paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
      status: 'Mengerjakan',
      progres: 'Soal 1 dari 30',
      pindah_tab: 0,
      update_terakhir: '09:00:00',
      timestamp: 1000000000000,
    },
    {
      username: 'raditya.p',
      nama_siswa: 'Raditya Pratama',
      kelas: 'Kelas 6A',
      paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
      status: 'Mengerjakan',
      progres: 'Soal 5 dari 30',
      pindah_tab: 2,
      update_terakhir: '09:02:10',
      timestamp: 1000000130000,
    },
    {
      username: 'fajar.h',
      nama_siswa: 'Fajar Nugraha',
      kelas: 'Kelas 6A',
      paket_ujian: 'Tryout TKA Matematika SD/MI 2026',
      status: 'Selesai',
      progres: 'Soal 30 dari 30',
      pindah_tab: 0,
      update_terakhir: '09:03:00',
      timestamp: 1000000180000,
    },
  ];

  const mapped = mapMonitoringRows(rows);
  assert.equal(mapped.length, 2);
  assert.equal(mapped[0].username, 'fajar.h');
  assert.equal(mapped[1].username, 'raditya.p');
  assert.equal(mapped[1].progres, 'Soal 5 dari 30');
  assert.equal(mapped[1].pindahTab, 2);
});

test('isMonitoringEntryActive filters by status === Mengerjakan and within 180000 ms', () => {
  const now = 2_000_000_000_000;
  const activeEntry: MonitoringEntry = {
    username: 'raditya.p',
    namaSiswa: 'Raditya Pratama',
    kelas: 'Kelas 6A',
    paketUjian: 'Tryout TKA',
    status: 'Mengerjakan',
    progres: 'Soal 4 dari 30',
    pindahTab: 0,
    updateTerakhir: '09:10:00',
    timestamp: now - 179_999,
  };
  const staleEntry: MonitoringEntry = {
    ...activeEntry,
    timestamp: now - 180_000,
  };
  const finishedEntry: MonitoringEntry = {
    ...activeEntry,
    status: 'Selesai',
    timestamp: now - 10_000,
  };
  const zeroTsEntry: MonitoringEntry = {
    ...activeEntry,
    timestamp: 0,
  };

  assert.equal(isMonitoringEntryActive(activeEntry, now), true);
  assert.equal(isMonitoringEntryActive(staleEntry, now), false);
  assert.equal(isMonitoringEntryActive(finishedEntry, now), false);
  assert.equal(isMonitoringEntryActive(zeroTsEntry, now), false);
});

test('4-option Pilgan (A-D) ignores legacy Option E from Google Sheets object, map, and array formats while preserving images and keys', () => {
  const legacySheetObj = {
    id: 'legacy-obj-1',
    mapel: 'ipa',
    model: 'pilgan',
    pertanyaan: 'Planet terbesar di tata surya adalah...',
    gambar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
    opsi_json: JSON.stringify({
      topik: 'Tata Surya',
      pilganOptions: [
        { label: 'A', teks: 'Mars' },
        { label: 'B', teks: 'Bumi' },
        { label: 'C', teks: 'Jupiter', gambarUrl: 'https://drive.google.com/uc?export=view&id=jup' },
        { label: 'D', teks: 'Saturnus' },
        { label: 'E', teks: 'Pluto (Opsi E lama)' },
      ],
    }),
    kunci: 'C',
    pembahasan: 'Jupiter adalah planet terbesar.',
  };

  const mappedObj = mapSheetSoalToQuestion(legacySheetObj, 0);
  assert.ok(mappedObj);
  assert.equal(mappedObj.question.pilganOptions?.length, 4);
  assert.deepEqual(
    mappedObj.question.pilganOptions?.map((o) => o.label),
    ['A', 'B', 'C', 'D']
  );
  assert.equal(mappedObj.question.pilganOptions?.[2].gambarUrl, 'https://drive.google.com/uc?export=view&id=jup');
  assert.equal(mappedObj.question.gambarUrl, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');
  assert.equal(mappedObj.question.pilganKunci, 'C');

  const legacyManualMap = {
    id: 'legacy-map-1',
    mapel: 'matematika',
    model: 'pilgan',
    pertanyaan: '5 + 5 = ...',
    opsi_json: JSON.stringify({ A: '8', B: '9', C: '10', D: '11', E: '12' }),
    kunci: 'C',
  };
  const mappedMap = mapSheetSoalToQuestion(legacyManualMap, 1);
  assert.ok(mappedMap);
  assert.equal(mappedMap.question.pilganOptions?.length, 4);
  assert.deepEqual(
    mappedMap.question.pilganOptions?.map((o) => o.label),
    ['A', 'B', 'C', 'D']
  );

  const legacyArray = {
    id: 'legacy-arr-1',
    mapel: 'bahasa_indonesia',
    model: 'pilgan',
    pertanyaan: 'Antonim besar adalah...',
    opsi_json: JSON.stringify(['kecil', 'tinggi', 'lebar', 'panjang', 'luas']),
    kunci: 'A',
  };
  const mappedArr = mapSheetSoalToQuestion(legacyArray, 2);
  assert.ok(mappedArr);
  assert.equal(mappedArr.question.pilganOptions?.length, 4);
  assert.equal(mappedArr.question.pilganKunci, 'A');

  // Verify sanitizePilganOptions and mapQuestionToSheetSoal drop Option E even if injected via untyped legacy JSON
  const rawLegacyOptions = [
    { label: 'A', teks: '1' },
    { label: 'B', teks: '2' },
    { label: 'C', teks: '3' },
    { label: 'D', teks: '4' },
    { label: 'E', teks: '5' },
  ];
  assert.equal(sanitizePilganOptions(rawLegacyOptions).length, 4);

  const legacyQuestion = {
    ...mappedObj.question,
    pilganOptions: rawLegacyOptions as unknown as Question['pilganOptions'],
  };
  const sanitized = sanitizeQuestionPilgan(legacyQuestion);
  assert.equal(sanitized.pilganOptions?.length, 4);

  const exportedRow = mapQuestionToSheetSoal(legacyQuestion);
  const parsedOpsi = JSON.parse(exportedRow.opsi_json);
  assert.equal(parsedOpsi.pilganOptions.length, 4);
  assert.equal(exportedRow.kunci, 'C');
  assert.equal(exportedRow.gambar, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');
});

test('ExamPackage <-> Sheet paket mapping round-trips all settings, soalIds, token, and status', () => {
  const pkg: ExamPackage = {
    id: 'pkg-sync-1',
    judul: 'Ulangan Harian Pecahan SD',
    mapelId: 'matematika',
    deskripsi: 'Latihan khusus kelas 6',
    durasiMenit: 50,
    bobotBenar: 5,
    bobotSalah: -1,
    bobotKosong: 0,
    acakSoal: false,
    acakOpsi: true,
    waktuBuka: '2026-04-01T08:00:00.000Z',
    waktuTutup: '2026-04-30T17:00:00.000Z',
    kelasAkses: ['Kelas 6A', 'Kelas 6B'],
    kodeAkses: 'MTK6A',
    soalIds: ['mtk-1', 'mtk-3', 'mtk-5'],
    status: 'terbit',
    izinkanLihatPembahasan: false,
    deteksiPindahTab: true,
    pembuatId: 'usr-guru-1',
    pembuatNama: 'Ibu Sari',
    createdAt: '2026-04-01T07:00:00.000Z',
  };

  const sheetPayloadItem = mapExamPackageToSheetPaket(pkg);
  assert.equal(sheetPayloadItem.kodeAkses, 'MTK6A');
  assert.deepEqual(sheetPayloadItem.soalIds, ['mtk-1', 'mtk-3', 'mtk-5']);

  const restored = mapSheetPaketToExamPackage(
    sheetPayloadItem as unknown as Record<string, unknown>,
    0
  );
  assert.ok(restored);
  assert.equal(restored.id, 'pkg-sync-1');
  assert.equal(restored.judul, 'Ulangan Harian Pecahan SD');
  assert.equal(restored.durasiMenit, 50);
  assert.equal(restored.bobotBenar, 5);
  assert.equal(restored.bobotSalah, -1);
  assert.equal(restored.acakSoal, false);
  assert.equal(restored.acakOpsi, true);
  assert.equal(restored.izinkanLihatPembahasan, false);
  assert.equal(restored.deteksiPindahTab, true);
  assert.equal(restored.kodeAkses, 'MTK6A');
  assert.deepEqual(restored.kelasAkses, ['Kelas 6A', 'Kelas 6B']);
  assert.deepEqual(restored.soalIds, ['mtk-1', 'mtk-3', 'mtk-5']);
  assert.equal(restored.status, 'terbit');
});

test('mapSheetPackages parses snake_case cells, stringified booleans, comma-separated soal_ids, and statuses', () => {
  const rawRows = [
    {
      id: 'pkg-sheet-draft',
      judul: 'Tryout IPA Rahasia',
      mapel: 'IPA Terpadu',
      deskripsi: 'Masih disusun',
      durasi_menit: '35',
      bobot_benar: '4',
      bobot_salah: '0',
      bobot_kosong: '0',
      acak_soal: 'FALSE',
      acak_opsi: 'TRUE',
      izinkan_lihat_pembahasan: 'FALSE',
      deteksi_pindah_tab: 'TRUE',
      kelas_akses: 'Kelas 6A, Kelas 6B',
      token: 'IPA2026',
      soal_ids: 'ipa-1, ipa-2',
      status: 'Draft',
      pembuat_nama: 'Pak Budi',
    },
    {
      id: 'pkg-sheet-closed',
      judul: 'Tryout Bahasa Indonesia Lama',
      mapel: 'bahasa_indonesia',
      soal_ids: '["bind-1"]',
      status: 'Ditutup',
    },
    {
      id: 'pkg-sheet-published',
      judul: 'Tryout Matematika Terbit',
      mapel: 'matematika',
      pengaturan_json: JSON.stringify({ durasiMenit: 75, acakSoal: false }),
      soalIds: ['mtk-1', 'mtk-2'],
      status: 'Terbit',
    },
  ];

  const mapped = mapSheetPackages(rawRows);
  assert.equal(mapped.length, 3);
  assert.equal(mapped[0].status, 'draft');
  assert.equal(mapped[0].acakSoal, false);
  assert.equal(mapped[0].acakOpsi, true);
  assert.equal(mapped[0].izinkanLihatPembahasan, false);
  assert.equal(mapped[0].kodeAkses, 'IPA2026');
  assert.deepEqual(mapped[0].soalIds, ['ipa-1', 'ipa-2']);
  assert.deepEqual(mapped[0].kelasAkses, ['Kelas 6A', 'Kelas 6B']);

  assert.equal(mapped[1].status, 'ditutup');
  assert.deepEqual(mapped[1].soalIds, ['bind-1']);

  assert.equal(mapped[2].status, 'terbit');
  assert.equal(mapped[2].durasiMenit, 75);
  assert.equal(mapped[2].acakSoal, false);
});

test('reconcilePackagesFromSheet preserves teacher curated soalIds subset instead of expanding all subject questions', () => {
  const sheetQuestions: Question[] = ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4'].map((id) => ({
    id,
    mapelId: 'matematika',
    topik: 'Bilangan',
    paketUjian: 'Paket Kurasi Guru',
    tingkatKesulitan: 'mudah',
    modelSoal: 'pilgan',
    teksSoal: `Soal ${id}`,
    pembahasan: '',
    pembuatId: 'u1',
    pembuatNama: 'Guru',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }));

  const curatedPkg: ExamPackage = {
    id: 'pkg-curated',
    judul: 'Paket Kurasi Guru',
    mapelId: 'matematika',
    deskripsi: 'Hanya 2 soal pilihan',
    durasiMenit: 30,
    bobotBenar: 4,
    bobotSalah: 0,
    bobotKosong: 0,
    acakSoal: false,
    acakOpsi: true,
    waktuBuka: '2026-01-01T00:00:00Z',
    waktuTutup: '2026-12-31T23:59:00Z',
    kelasAkses: ['semua'],
    soalIds: ['mtk-4', 'mtk-2'],
    status: 'terbit',
    izinkanLihatPembahasan: true,
    deteksiPindahTab: true,
    pembuatId: 'u1',
    pembuatNama: 'Guru',
    createdAt: '2026-01-01T00:00:00Z',
  };

  const emptyPkg: ExamPackage = {
    ...curatedPkg,
    id: 'pkg-empty-ids',
    judul: 'Paket Tanpa Daftar ID',
    soalIds: [],
  };

  const reconciled = reconcilePackagesFromSheet([curatedPkg, emptyPkg], sheetQuestions);
  assert.deepEqual(reconciled[0].soalIds, ['mtk-4', 'mtk-2']);
  assert.deepEqual(reconciled[1].soalIds, ['mtk-1', 'mtk-2', 'mtk-3', 'mtk-4']);
});

test('mergePackagesWithPendingLocal applies offline additions/edits/deletes without resurrecting removed server packages', () => {
  const basePkg: ExamPackage = {
    id: 'pkg-1',
    judul: 'Server Old Title',
    mapelId: 'matematika',
    deskripsi: '',
    durasiMenit: 45,
    bobotBenar: 4,
    bobotSalah: 0,
    bobotKosong: 0,
    acakSoal: true,
    acakOpsi: true,
    waktuBuka: '2026-01-01T00:00:00Z',
    waktuTutup: '2026-12-31T23:59:00Z',
    kelasAkses: ['semua'],
    soalIds: ['mtk-1'],
    status: 'terbit',
    izinkanLihatPembahasan: true,
    deteksiPindahTab: true,
    pembuatId: 'u1',
    pembuatNama: 'Guru',
    createdAt: '2026-01-01T00:00:00Z',
  };

  const serverPackages: ExamPackage[] = [
    basePkg,
    { ...basePkg, id: 'pkg-deleted-locally', judul: 'Akan Dihapus Offline' },
    { ...basePkg, id: 'pkg-deleted-on-server', judul: 'Dihapus Guru Lain Di Server' },
  ];

  const localPackages: ExamPackage[] = [
    { ...basePkg, id: 'pkg-new-offline', judul: 'Paket Baru Offline' },
    { ...basePkg, id: 'pkg-1', judul: 'Server Edited Locally' },
    { ...basePkg, id: 'pkg-deleted-on-server', judul: 'Dihapus Guru Lain Di Server' },
  ];

  const merged = mergePackagesWithPendingLocal(
    serverPackages,
    localPackages,
    new Set(['pkg-1', 'pkg-new-offline']),
    new Set(['pkg-deleted-locally'])
  );

  assert.deepEqual(
    merged.map((p) => p.id),
    ['pkg-new-offline', 'pkg-1', 'pkg-deleted-on-server']
  );
  assert.equal(merged[1].judul, 'Server Edited Locally');
});

test('filterPublishedPackages only exposes status === terbit to student views', () => {
  const base: ExamPackage = {
    id: 'pkg-1',
    judul: 'Terbit',
    mapelId: 'matematika',
    deskripsi: '',
    durasiMenit: 45,
    bobotBenar: 4,
    bobotSalah: 0,
    bobotKosong: 0,
    acakSoal: true,
    acakOpsi: true,
    waktuBuka: '2026-01-01T00:00:00Z',
    waktuTutup: '2026-12-31T23:59:00Z',
    kelasAkses: ['semua'],
    soalIds: ['mtk-1'],
    status: 'terbit',
    izinkanLihatPembahasan: true,
    deteksiPindahTab: true,
    pembuatId: 'u1',
    pembuatNama: 'Guru',
    createdAt: '2026-01-01T00:00:00Z',
  };

  const visible = filterPublishedPackages([
    base,
    { ...base, id: 'pkg-2', judul: 'Draft', status: 'draft' },
    { ...base, id: 'pkg-3', judul: 'Ditutup', status: 'ditutup' },
  ]);

  assert.equal(visible.length, 1);
  assert.equal(visible[0].id, 'pkg-1');
});



