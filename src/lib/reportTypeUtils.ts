/**
 * FEC report type code -> description (e.g. "Q1" -> "APRIL QUARTERLY").
 * Mirrors app/utils/functions.py's get_report_type_description on the
 * backend. Shared across every page that shows a report type.
 */
export const REPORT_TYPE_LABELS: Record<string, string> = {
  '48': '48 HOUR NOTIFICATION',
  '24': '24 HOUR NOTIFICATION',
  '12S': 'PRE-SPECIAL',
  '30S': 'POST-SPECIAL',
  M1: 'JANUARY MONTHLY',
  M2: 'FEBRUARY MONTHLY',
  M3: 'MARCH MONTHLY',
  Q1: 'APRIL QUARTERLY',
  '12P': 'PRE-PRIMARY',
  '12C': 'PRE-CONVENTION',
  '12R': 'PRE-RUN-OFF',
  '30P': 'POST-PRIMARY',
  '30R': 'POST-RUN-OFF',
  M4: 'APRIL MONTHLY',
  M5: 'MAY MONTHLY',
  M6: 'JUNE MONTHLY',
  M7: 'JULY MONTHLY',
  M7S: 'JULY MONTHLY / SEMI-ANNUAL',
  Q2: 'JULY QUARTERLY',
  Q2S: 'JULY QUARTERLY / SEMI-ANNUAL',
  MY: 'MID-YEAR REPORT',
  MSA: 'MONTHLY SEMI-ANNUAL (MY)',
  QSA: 'QUARTERLY SEMI-ANNUAL (MY)',
  MYS: 'MONTHLY YEAR END / SEMI-ANNUAL',
  QMS: 'QUARTERLY MID-YEAR / SEMI-ANN',
  M8: 'AUGUST MONTHLY',
  M9: 'SEPTEMBER MONTHLY',
  Q3: 'OCTOBER QUARTERLY',
  M10: 'OCTOBER MONTHLY',
  '12G': 'PRE-GENERAL',
  '30G': 'POST-GENERAL',
  M11: 'NOVEMBER MONTHLY',
  M12: 'DECEMBER MONTHLY',
  '30D': 'POST-ELECTION',
  '60D': 'POST-CONVENTION',
  YE: 'YEAR-END',
  MSY: 'MONTHLY SEMI-ANNUAL (YE)',
  QYS: 'QUARTERLY YEAR END / SEMI-ANN',
  QYE: 'QUARTERLY SEMI-ANNUAL (YE)',
  TER: 'TERMINATION REPORT',
  CA: 'COMPREHENSIVE AMEND',
  ADJ: 'COMP ADJUST AMEND',
  '10D': 'PRE-ELECTION',
  '10G': 'PRE-GENERAL',
  '10P': 'PRE-PRIMARY',
  '10R': 'PRE-RUN-OFF',
  '10S': 'PRE-SPECIAL',
  '90D': 'POST INAUGURAL',
  '90S': 'POST INAUGURAL SUPPLEMENT',
};

/**
 * Description for a report type code, falling back to the raw code if it
 * isn't a known one, and to '' if no code was given - matches the backend's
 * get_report_type_description exactly (lookup is case-insensitive/trimmed,
 * but an unmatched code is returned as originally given, not normalized).
 */
export function getReportTypeLabel(code?: string | null): string {
  if (!code) return '';
  const normalized = String(code).trim().toUpperCase();
  return REPORT_TYPE_LABELS[normalized] ?? code;
}
