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

test('TKA Bahasa Indonesia SD 2026 seed integrity: 29 questions with valid keys, stimuli, and existing images', () => {
  const bindQuestions = INITIAL_QUESTIONS.filter((q) => q.mapelId === 'bahasa_indonesia');
  assert.equal(bindQuestions.length, 29, 'Harus ada tepat 29 soal Bahasa Indonesia TKA SD 2026');

  const ids = bindQuestions.map((q) => q.id);
  for (let i = 1; i <= 29; i++) {
    assert.ok(ids.includes(`bind-${i}`), `Soal bind-${i} harus tersedia`);
  }

  const stimulusMap = new Map(INITIAL_STIMULI.map((s) => [s.id, s]));
  const assetRefs: string[] = [];

  for (const s of INITIAL_STIMULI.filter((st) => st.id.startsWith('stm-bind-'))) {
    assert.ok(s.judul.trim().length > 0, `${s.id} judul tidak boleh kosong`);
    assert.ok(s.teks.trim().length > 0, `${s.id} teks tidak boleh kosong`);
    if (s.gambarUrl) assetRefs.push(s.gambarUrl);
  }

  for (const q of bindQuestions) {
    assert.ok(q.teksSoal.trim().length > 0, `${q.id} teksSoal tidak boleh kosong`);
    assert.ok(q.pembahasan.trim().length > 0, `${q.id} pembahasan tidak boleh kosong`);
    assert.ok(q.stimulusId && stimulusMap.has(q.stimulusId), `${q.id} harus merujuk ke stimulusId valid`);
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
      q.pilganOptions.forEach((o) => {
        if (o.gambarUrl) assetRefs.push(o.gambarUrl);
      });
    } else if (q.modelSoal === 'mcma') {
      assert.ok(q.mcmaOptions && q.mcmaOptions.length >= 3, `${q.id} harus punya minimal 3 opsi mcma`);
      assert.ok(q.mcmaKunci && q.mcmaKunci.length >= 1, `${q.id} harus punya kunci mcma`);
      q.mcmaKunci.forEach((k) => {
        assert.ok(
          q.mcmaOptions!.some((o) => o.label === k),
          `${q.id} kunci MCMA ${k} harus ada di mcmaOptions`
        );
      });
      q.mcmaOptions.forEach((o) => {
        if (o.gambarUrl) assetRefs.push(o.gambarUrl);
      });
    } else if (q.modelSoal === 'kategori') {
      assert.ok(q.kategoriLabels && q.kategoriLabels.length === 2, `${q.id} harus punya 2 label kategori`);
      assert.ok(q.kategoriPernyataan && q.kategoriPernyataan.length >= 3, `${q.id} harus punya min 3 pernyataan`);
      q.kategoriPernyataan.forEach((stmt) => {
        assert.ok(
          q.kategoriLabels!.includes(stmt.kunciJawaban),
          `${q.id} pernyataan ${stmt.id} kunciJawaban harus cocok kategoriLabels`
        );
        if (stmt.gambarUrl) assetRefs.push(stmt.gambarUrl);
      });
    }
  }

  // Ensure every referenced /assets/bind_tka_2026/*.png file exists on disk and is non-empty
  const uniqueAssets = Array.from(new Set(assetRefs));
  assert.equal(uniqueAssets.length, 15, 'Harus mereferensikan tepat 15 gambar resmi PDF Bahasa Indonesia');
  for (const relUrl of uniqueAssets) {
    assert.ok(relUrl.startsWith('/assets/bind_tka_2026/'), `Asset path tidak valid: ${relUrl}`);
    const fullPath = path.resolve(process.cwd(), 'public', relUrl.slice(1));
    assert.ok(fs.existsSync(fullPath), `File gambar hilang: ${fullPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 500, `File gambar terlalu kecil / rusak: ${fullPath}`);
  }
});

test('pkg-2 contains all 29 TKA Bahasa Indonesia questions and achieves 100% with keys', () => {
  const pkg2 = INITIAL_PACKAGES.find((p) => p.id === 'pkg-2');
  assert.ok(pkg2, 'pkg-2 harus ada');
  assert.equal(pkg2.soalIds.length, 29);

  const bindMap = new Map(
    INITIAL_QUESTIONS.filter((q) => q.mapelId === 'bahasa_indonesia').map((q) => [q.id, q])
  );
  const pkgQuestions = pkg2.soalIds.map((id) => bindMap.get(id)!);
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

  const summary = evaluateExamSession(pkgQuestions, perfectAnswers, pkg2);
  assert.equal(summary.jumlahBenar, 29);
  assert.equal(summary.jumlahSalah, 0);
  assert.equal(summary.jumlahKosong, 0);
  assert.equal(summary.persentaseNilai, 100);
});

test('Bahasa Indonesia sample sessions reference valid bind-1..bind-29 IDs', () => {
  const bindIds = new Set(
    INITIAL_QUESTIONS.filter((q) => q.mapelId === 'bahasa_indonesia').map((q) => q.id)
  );
  const bindSessions = INITIAL_SESSIONS.filter((s) => s.mapelId === 'bahasa_indonesia');
  assert.equal(bindSessions.length, 4);
  for (const ses of bindSessions) {
    assert.equal(ses.shuffledSoalIds.length, 29);
    for (const id of ses.shuffledSoalIds) {
      assert.ok(bindIds.has(id), `${ses.id} merujuk ${id} yang tidak ada`);
    }
  }
});

test('Google Sheets sync round-trip preserves all 29 Bahasa Indonesia questions, keys, stimuli, and images', () => {
  const bindQuestions = INITIAL_QUESTIONS.filter((q) => q.mapelId === 'bahasa_indonesia');
  const rows = bindQuestions.map((q) =>
    mapQuestionToSheetSoal(q, INITIAL_PACKAGES, INITIAL_STIMULI)
  );

  rows.forEach((row, idx) => {
    const orig = bindQuestions[idx];
    const parsed = mapSheetSoalToQuestion(row as unknown as Record<string, unknown>, idx);
    assert.ok(parsed, `Round-trip gagal untuk ${orig.id}`);
    assert.equal(parsed.question.id, orig.id);
    assert.equal(parsed.question.gambarUrl, orig.gambarUrl);
    assert.equal(parsed.question.stimulusId, orig.stimulusId);
    assert.ok(parsed.extractedStimulus, `${orig.id} harus menyertakan stimulus dalam opsi_json`);
    assert.equal(parsed.extractedStimulus?.id, orig.stimulusId);

    if (orig.modelSoal === 'pilgan') {
      assert.equal(parsed.question.pilganKunci, orig.pilganKunci);
      assert.equal(parsed.question.pilganOptions?.length, 4);
      orig.pilganOptions?.forEach((o, oIdx) => {
        assert.equal(parsed.question.pilganOptions?.[oIdx]?.gambarUrl, o.gambarUrl);
      });
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
