/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_PACKAGES, INITIAL_QUESTIONS, INITIAL_SESSIONS, INITIAL_STIMULI } from '../data/seedData';
import { evaluateExamSession } from './examScoring';
import { mapQuestionToSheetSoal, mapSheetSoalToQuestion } from './sheetsSync';
import { StudentAnswerItem } from '../types';

test('TKA IPAS SD 2026 seed integrity: 30 questions with valid keys and existing images', () => {
  const ipaQuestions = INITIAL_QUESTIONS.filter((q) => q.mapelId === 'ipa');
  assert.equal(ipaQuestions.length, 30, 'Harus ada tepat 30 soal IPA/IPAS TKA SD 2026');

  const ids = ipaQuestions.map((q) => q.id);
  for (let i = 1; i <= 30; i++) {
    assert.ok(ids.includes(`ipa-${i}`), `Soal ipa-${i} harus tersedia`);
  }

  const assetRefs: string[] = [];

  for (const q of ipaQuestions) {
    assert.ok(q.teksSoal.trim().length > 0, `${q.id} teksSoal tidak boleh kosong`);
    assert.ok(q.pembahasan.trim().length > 0, `${q.id} pembahasan tidak boleh kosong`);
    if (q.gambarUrl) assetRefs.push(q.gambarUrl);

    if (q.modelSoal === 'pilgan') {
      assert.ok(q.pilganOptions && q.pilganOptions.length === 4, `${q.id} harus punya tepat 4 opsi pilgan (A-D)`);
      assert.deepEqual(
        q.pilganOptions.map((o) => o.label),
        ['A', 'B', 'C', 'D'],
        `${q.id} harus berlabel A, B, C, D`
      );
      assert.ok(
        q.pilganOptions.some((o) => o.label === q.pilganKunci),
        `${q.id} pilganKunci ${q.pilganKunci} harus ada di pilganOptions`
      );
      const uniqueOptTexts = new Set(q.pilganOptions.map((o) => o.teks.trim().toLowerCase()));
      assert.equal(uniqueOptTexts.size, 4, `${q.id} keempat opsi harus unik`);
    } else if (q.modelSoal === 'mcma') {
      assert.ok(q.mcmaOptions && q.mcmaOptions.length >= 3, `${q.id} harus punya minimal 3 opsi mcma`);
      assert.ok(q.mcmaKunci && q.mcmaKunci.length >= 2, `${q.id} harus punya minimal 2 kunci mcma`);
      q.mcmaKunci.forEach((k) => {
        assert.ok(
          q.mcmaOptions!.some((o) => o.label === k),
          `${q.id} kunci MCMA ${k} harus ada di mcmaOptions`
        );
      });
    } else if (q.modelSoal === 'kategori') {
      assert.ok(q.kategoriLabels && q.kategoriLabels.length === 2, `${q.id} harus punya 2 label kategori`);
      assert.ok(q.kategoriPernyataan && q.kategoriPernyataan.length === 3, `${q.id} harus punya 3 pernyataan`);
      q.kategoriPernyataan.forEach((stmt) => {
        assert.ok(
          q.kategoriLabels!.includes(stmt.kunciJawaban),
          `${q.id} pernyataan ${stmt.id} kunciJawaban harus cocok kategoriLabels`
        );
      });
    }
  }

  // Ensure every referenced /assets/ipas_tka_2026/*.png file exists on disk and is non-empty
  const uniqueAssets = Array.from(new Set(assetRefs));
  assert.equal(uniqueAssets.length, 23, 'Harus mereferensikan tepat 23 gambar resmi PDF IPAS');
  for (const relUrl of uniqueAssets) {
    assert.ok(relUrl.startsWith('/assets/ipas_tka_2026/'), `Asset path tidak valid: ${relUrl}`);
    const fullPath = path.resolve(process.cwd(), 'public', relUrl.slice(1));
    assert.ok(fs.existsSync(fullPath), `File gambar hilang: ${fullPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 500, `File gambar terlalu kecil / rusak: ${fullPath}`);
  }
});

test('pkg-3 contains all 30 TKA IPAS questions and achieves 100% with keys', () => {
  const pkg3 = INITIAL_PACKAGES.find((p) => p.id === 'pkg-3');
  assert.ok(pkg3, 'pkg-3 harus ada');
  assert.equal(pkg3.soalIds.length, 30);

  const ipaMap = new Map(
    INITIAL_QUESTIONS.filter((q) => q.mapelId === 'ipa').map((q) => [q.id, q])
  );
  const pkgQuestions = pkg3.soalIds.map((id) => ipaMap.get(id)!);
  assert.ok(pkgQuestions.every(Boolean));

  const perfectAnswers: Record<string, StudentAnswerItem> = {};
  for (const q of pkgQuestions) {
    if (q.modelSoal === 'pilgan') {
      perfectAnswers[q.id] = {
        questionId: q.id,
        modelSoal: 'pilgan',
        state: 'sudah_dijawab',
        pilganAnswer: q.pilganKunci,
      };
    } else if (q.modelSoal === 'mcma') {
      perfectAnswers[q.id] = {
        questionId: q.id,
        modelSoal: 'mcma',
        state: 'sudah_dijawab',
        mcmaAnswer: q.mcmaKunci,
      };
    } else if (q.modelSoal === 'kategori') {
      const map: Record<string, string> = {};
      q.kategoriPernyataan?.forEach((s) => {
        map[s.id] = s.kunciJawaban;
      });
      perfectAnswers[q.id] = {
        questionId: q.id,
        modelSoal: 'kategori',
        state: 'sudah_dijawab',
        kategoriAnswer: map,
      };
    }
  }

  const summary = evaluateExamSession(pkgQuestions, perfectAnswers, pkg3);
  assert.equal(summary.jumlahBenar, 30);
  assert.equal(summary.jumlahSalah, 0);
  assert.equal(summary.jumlahKosong, 0);
  assert.equal(summary.persentaseNilai, 100);
});

test('IPA sample sessions reference valid ipa-1..ipa-30 IDs', () => {
  const ipaIds = new Set(
    INITIAL_QUESTIONS.filter((q) => q.mapelId === 'ipa').map((q) => q.id)
  );
  const ipaSessions = INITIAL_SESSIONS.filter((s) => s.mapelId === 'ipa');
  assert.equal(ipaSessions.length, 4);
  for (const ses of ipaSessions) {
    assert.equal(ses.shuffledSoalIds.length, 30);
    for (const id of ses.shuffledSoalIds) {
      assert.ok(ipaIds.has(id), `${ses.id} merujuk ${id} yang tidak ada`);
    }
  }
});

test('Google Sheets sync round-trip preserves all 30 IPA questions, keys, and images', () => {
  const ipaQuestions = INITIAL_QUESTIONS.filter((q) => q.mapelId === 'ipa');
  const rows = ipaQuestions.map((q) =>
    mapQuestionToSheetSoal(q, INITIAL_PACKAGES, INITIAL_STIMULI)
  );

  rows.forEach((row, idx) => {
    const orig = ipaQuestions[idx];
    const parsed = mapSheetSoalToQuestion(row as unknown as Record<string, unknown>, idx);
    assert.ok(parsed, `Round-trip gagal untuk ${orig.id}`);
    assert.equal(parsed.question.id, orig.id);
    assert.equal(parsed.question.gambarUrl, orig.gambarUrl);

    if (orig.modelSoal === 'pilgan') {
      assert.equal(parsed.question.pilganKunci, orig.pilganKunci);
      assert.equal(parsed.question.pilganOptions?.length, 4);
    } else if (orig.modelSoal === 'mcma') {
      assert.deepEqual(parsed.question.mcmaKunci, orig.mcmaKunci);
    } else if (orig.modelSoal === 'kategori') {
      assert.deepEqual(
        parsed.question.kategoriPernyataan?.map((s) => s.kunciJawaban),
        orig.kategoriPernyataan?.map((s) => s.kunciJawaban)
      );
    }
  });
});
