/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSimpanNilaiPayload,
  mapQuestionToSheetSoal,
  mapSheetPesertaToUser,
  mapSheetSoalToQuestion,
  mapUserToSheetPeserta,
  mergeUsersWithAdminFallback,
  reconcilePackagesWithSheetQuestions,
  sanitizeImageUrl,
} from './sheetsSync.ts';
import type { ExamPackage, ExamSession, Question, Stimulus, User } from '../types/index.ts';

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
