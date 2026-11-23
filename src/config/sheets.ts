/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const URL_DATABASE =
  'https://script.google.com/macros/s/AKfycbywaLc18c6Y2h_cWgrWtkNIpPxPdl6DHs3BOVmRVI9t-AcueKDg-fHNlJiJxug308DL/exec';

/**
 * Header wajib untuk semua POST ke Google Apps Script agar terhindar dari preflight CORS block.
 */
export const SHEETS_POST_HEADERS: Record<string, string> = {
  'Content-Type': 'text/plain;charset=utf-8',
};
