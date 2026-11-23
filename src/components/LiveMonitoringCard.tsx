/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { isMonitoringEntryActive } from '../utils/sheetsSync';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';

export function formatMonitoringClock(iso?: string | null): string {
  if (!iso) return 'Menunggu pembaruan...';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export const LiveMonitoringCard: React.FC = () => {
  const {
    monitoringEntries,
    monitoringLastUpdatedAt,
    isRefreshingMonitoring,
    refreshMonitoring,
    setActiveView,
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

  const activeEntries = monitoringEntries.filter((entry) =>
    isMonitoringEntryActive(entry, nowMs)
  );
  const flaggedCount = activeEntries.filter((e) => e.pindahTab > 0).length;

  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4"
      data-testid="beranda-live-monitoring-card"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Live Monitoring Ujian</span>
            </h2>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {activeEntries.length} Aktif
            </span>
            {flaggedCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="h-3 w-3" />
                <span>{flaggedCount} Pindah Tab</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                Pembaruan terakhir:{' '}
                <strong className="font-mono text-slate-700 dark:text-slate-300">
                  {formatMonitoringClock(monitoringLastUpdatedAt)}
                </strong>
              </span>
            </span>
            <span>·</span>
            <span>Auto-refresh tiap 10 detik</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => void refreshMonitoring(false)}
            disabled={isRefreshingMonitoring}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 ${
                isRefreshingMonitoring ? 'animate-spin' : ''
              }`}
            />
            <span>{isRefreshingMonitoring ? 'Menyegarkan...' : 'Refresh Sekarang'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('admin-monitoring')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Lihat Lengkap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {activeEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeEntries.slice(0, 6).map((entry) => {
            const hasWarning = entry.pindahTab > 0;
            return (
              <div
                key={`${entry.username}-${entry.paketUjian}`}
                className={`rounded-xl border p-3.5 transition-colors flex flex-col justify-between gap-2 ${
                  hasWarning
                    ? 'border-rose-300 dark:border-rose-700 bg-rose-50/70 dark:bg-rose-950/30'
                    : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/15'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {entry.namaSiswa}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        ({entry.kelas})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      @{entry.username} · {entry.paketUjian}
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                    {entry.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-200/70 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/70 dark:border-indigo-800">
                      {entry.progres}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {entry.updateTerakhir}
                    </span>
                  </div>

                  {hasWarning ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold shadow-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Peringatan: {entry.pindahTab}x Pindah Tab</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Fokus</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Belum ada siswa yang sedang aktif mengerjakan ujian dalam 3 menit terakhir. Status akan muncul otomatis saat siswa memulai ujian.
        </div>
      )}
    </div>
  );
};
