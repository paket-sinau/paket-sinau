/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SHEETS_POST_HEADERS, URL_DATABASE } from '../config/sheets';
import { ExamPackage, MonitoringEntry, Question, Stimulus, User } from '../types';
import {
  mapMonitoringRows,
  mapQuestionToSheetSoal,
  mapSheetPesertaToUser,
  mapSheetSoalToQuestion,
  mapUserToSheetPeserta,
  SimpanNilaiPayload,
  SyncPesertaPayload,
  SyncSoalPayload,
  UpdateMonitoringPayload,
} from '../utils/sheetsSync';

export interface SheetsFetchResult {
  users: User[];
  questions: Question[];
  stimuli: Stimulus[];
  rawNilai: Record<string, unknown>[];
  monitoring: MonitoringEntry[];
  rawStatus?: string;
}

export interface SheetsPostResponse {
  ok: boolean;
  status?: string;
  message?: string;
  error?: string;
}

async function postToSheets(payload: unknown): Promise<SheetsPostResponse> {
  const response = await fetch(URL_DATABASE, {
    method: 'POST',
    headers: SHEETS_POST_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} dari server Google Sheets`);
  }

  const text = await response.text();
  if (!text) {
    return { ok: true, status: 'success' };
  }

  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    const statusStr = typeof json.status === 'string' ? json.status.toLowerCase() : '';
    if (statusStr === 'error' || json.ok === false) {
      throw new Error(
        typeof json.message === 'string'
          ? json.message
          : typeof json.error === 'string'
          ? json.error
          : 'Permintaan ditolak oleh Google Apps Script'
      );
    }
    return {
      ok: true,
      status: typeof json.status === 'string' ? json.status : 'success',
      message: typeof json.message === 'string' ? json.message : undefined,
    };
  } catch (err) {
    // Jika respons bukan JSON tetapi HTTP 2xx, anggap berhasil jika bukan error eksplisit
    if (err instanceof SyntaxError) {
      return { ok: true, status: 'success' };
    }
    throw err;
  }
}

/**
 * Mengambil data peserta, bank soal, dan rekap nilai terbaru dari Google Sheets (GET).
 */
export async function fetchSheetsDatabase(): Promise<SheetsFetchResult> {
  const response = await fetch(URL_DATABASE, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Gagal memuat database Google Sheets (HTTP ${response.status})`);
  }

  const rawData = (await response.json()) as Record<string, unknown>;
  const root =
    rawData && typeof rawData.data === 'object' && rawData.data !== null
      ? (rawData.data as Record<string, unknown>)
      : rawData;

  const rawPeserta = Array.isArray(root?.peserta) ? root.peserta : [];
  const rawSoal = Array.isArray(root?.soal) ? root.soal : [];
  const rawNilai = Array.isArray(root?.nilai)
    ? root.nilai.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    : [];
  const rawMonitoring = Array.isArray(root?.monitoring) ? root.monitoring : [];
  const monitoring = mapMonitoringRows(rawMonitoring);

  const users = rawPeserta
    .map((item, idx) =>
      item && typeof item === 'object'
        ? mapSheetPesertaToUser(item as Record<string, unknown>, idx)
        : null
    )
    .filter((u): u is User => Boolean(u));

  const questions: Question[] = [];
  const extractedStimuli: Stimulus[] = [];
  const seenStimuli = new Set<string>();

  rawSoal.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const mapped = mapSheetSoalToQuestion(item as Record<string, unknown>, idx);
    if (!mapped) return;
    questions.push(mapped.question);
    if (mapped.extractedStimulus && !seenStimuli.has(mapped.extractedStimulus.id)) {
      seenStimuli.add(mapped.extractedStimulus.id);
      extractedStimuli.push(mapped.extractedStimulus);
    }
  });

  return {
    users,
    questions,
    stimuli: extractedStimuli,
    rawNilai,
    monitoring,
    rawStatus: typeof rawData?.status === 'string' ? rawData.status : undefined,
  };
}

/**
 * Mengirim seluruh daftar akun pengguna terbaru ke Google Sheets (sync_peserta).
 */
export async function syncPesertaToSheets(users: User[]): Promise<SheetsPostResponse> {
  const payload: SyncPesertaPayload = {
    action: 'sync_peserta',
    peserta: users.map(mapUserToSheetPeserta),
  };
  return postToSheets(payload);
}

/**
 * Mengirim seluruh daftar bank soal terbaru ke Google Sheets (sync_soal).
 */
export async function syncSoalToSheets(
  questions: Question[],
  packages: ExamPackage[],
  stimuli: Stimulus[]
): Promise<SheetsPostResponse> {
  const payload: SyncSoalPayload = {
    action: 'sync_soal',
    soal: questions.map((q) => mapQuestionToSheetSoal(q, packages, stimuli)),
  };
  return postToSheets(payload);
}

/**
 * Mengirim hasil nilai ujian siswa ke Google Sheets (simpan_nilai).
 */
export async function submitNilaiToSheets(
  payload: SimpanNilaiPayload
): Promise<SheetsPostResponse> {
  return postToSheets(payload);
}

/**
 * Mengirim pembaruan status live monitoring ujian siswa ke Google Sheets (update_monitoring).
 */
export async function updateMonitoringToSheets(
  payload: UpdateMonitoringPayload
): Promise<SheetsPostResponse> {
  return postToSheets(payload);
}
