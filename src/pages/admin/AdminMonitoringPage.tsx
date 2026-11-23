/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../utils/examScoring';
import { isMonitoringEntryActive, safeTimestampMs } from '../../utils/sheetsSync';
import { formatMonitoringClock } from '../../components/LiveMonitoringCard';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  RefreshCw,
  Send,
  Users,
} from 'lucide-react';

export const AdminMonitoringPage: React.FC = () => {
  const {
    monitoringEntries,
    monitoringLastUpdatedAt,
    isRefreshingMonitoring,
    refreshMonitoring,
    activeSession,
    sessions,
    submitExamSession,
    showToast,
  } = useApp();

  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    setNowMs(Date.now());
  }, [monitoringEntries, monitoringLastUpdatedAt]);

  useEffect(() => {
    const ticker = setInterval(() => {
      setNowMs(Date.now());
    }, 5000);
    return () => clearInterval(ticker);
  }, []);

  const handleForceSubmit = () => {
    if (activeSession) {
      submitExamSession();
      showToast('Sesi ujian murid berhasil dikumpulkan secara paksa.', 'info');
    }
  };

  const activeMonitoringStudents = monitoringEntries.filter((entry) =>
    isMonitoringEntryActive(entry, nowMs)
  );
  const flaggedCount = activeMonitoringStudents.filter((e) => e.pindahTab > 0).length;

  const completedSessions = sessions
    .filter((s) => s.status === 'selesai')
    .sort(
      (a, b) =>
        safeTimestampMs(b.waktuSelesai || b.waktuMulai) -
        safeTimestampMs(a.waktuSelesai || a.waktuMulai)
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Activity className="h-6 w-6 text-emerald-500" />
              <span>Live Monitoring Ujian CBT</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pantau secara real-time lintas perangkat peserta yang sedang aktif mengerjakan soal dalam 3 menit terakhir, progres soal, dan peringatan pindah tab.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Auto-refresh tiap 10 detik
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Pembaruan terakhir:{' '}
                  <strong className="font-mono text-slate-800 dark:text-slate-200">
                    {formatMonitoringClock(monitoringLastUpdatedAt)}
                  </strong>
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void refreshMonitoring(false)}
              disabled={isRefreshingMonitoring}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshingMonitoring ? 'animate-spin' : ''}`}
              />
              <span>{isRefreshingMonitoring ? 'Menyegarkan...' : 'Refresh Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Active Exam Sesi Section (Real-Time Cross-Device from Google Sheets) */}
        <div
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4"
          data-testid="live-monitoring-active-section"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Play className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              <span>Peserta Ujian Aktif Real-Time (3 Menit Terakhir)</span>
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {flaggedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-3 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{flaggedCount} Peringatan Pindah Tab</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Users className="h-3.5 w-3.5" />
                <span>{activeMonitoringStudents.length} Peserta Aktif</span>
              </span>
            </div>
          </div>

          {activeMonitoringStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMonitoringStudents.map((entry) => {
                const hasTabWarning = entry.pindahTab > 0;
                return (
                  <div
                    key={`${entry.username}-${entry.paketUjian}`}
                    className={`rounded-xl border p-4 flex flex-col justify-between gap-3 shadow-xs transition-colors ${
                      hasTabWarning
                        ? 'border-rose-400 dark:border-rose-700 bg-rose-50/70 dark:bg-rose-950/30'
                        : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/35 dark:bg-emerald-950/15'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white text-base">
                            {entry.namaSiswa}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({entry.kelas})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Username: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{entry.username}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 pt-0.5">
                          Paket: {entry.paketUjian}
                        </div>
                      </div>

                      <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold">
                        {entry.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                          {entry.progres}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          Update:{' '}
                          <strong className="font-mono text-slate-700 dark:text-slate-300">
                            {entry.updateTerakhir}
                          </strong>
                        </span>
                      </div>

                      {hasTabWarning ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 text-white px-2.5 py-1 text-xs font-bold shadow-xs">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Peringatan: {entry.pindahTab}x Pindah Tab</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Aman (0x Pindah Tab)</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 text-center py-8 px-4 text-xs text-slate-500 dark:text-slate-400">
              Belum ada peserta yang sedang aktif mengerjakan ujian dalam 3 menit terakhir. Siswa yang memulai ujian dari perangkat mana pun akan langsung muncul di sini.
            </div>
          )}

          {/* Fallback lokal jika ada sesi berjalan di browser yang sama */}
          {activeSession && activeSession.status === 'berjalan' && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-amber-800 dark:text-amber-300">
                  Sesi Lokal Peramban Ini: {activeSession.muridNama} ({activeSession.paketJudul})
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  Sisa Waktu: <strong className="font-mono">{formatDuration(activeSession.sisaDetik)}</strong> · Pelanggaran Tab: <strong>{activeSession.jumlahPelanggaranTab}x</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={handleForceSubmit}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Paksa Kumpulkan</span>
              </button>
            </div>
          )}
        </div>

        {/* Recent Completed Sessions Log */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            <span>Riwayat Sesi yang Telah Selesai ({completedSessions.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Paket Soal</th>
                  <th className="py-2.5 px-3 text-center">Benar / Total</th>
                  <th className="py-2.5 px-3 text-center">Pelanggaran Tab</th>
                  <th className="py-2.5 px-3 text-right">Nilai Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedSessions.map((ses) => (
                  <tr key={ses.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {ses.muridNama}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{ses.kelasNama}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {ses.paketJudul}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      {ses.jumlahBenar ?? 0} / {ses.totalSoal ?? ses.shuffledSoalIds.length ?? 0}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {ses.jumlahPelanggaranTab > 0 ? (
                        <span className="font-bold text-rose-600">{ses.jumlahPelanggaranTab}x</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Nihil</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                      {ses.persentaseNilai ?? 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
