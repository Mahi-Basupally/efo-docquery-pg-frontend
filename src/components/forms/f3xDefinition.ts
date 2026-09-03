/** Frontend-only F3X presentation metadata. Backend supplies report data. */

export interface F3XLineDefinition {
  categoryType?: string;
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  note?: string;
  valueType?: string;
  linkTo?: string;
}

export const F3X_LINE_DEFINITIONS: Record<string, F3XLineDefinition> = {
  'f3x-line-6(a)-order-1': { indent: 1 },
  'f3x-line-6(b)-order-2': { indent: 1 },
  'f3x-line-6(c)-order-3': { indent: 1, linkTo: 'line-19', note: 'From line 19' },
  'f3x-line-6(d)-order-4': { indent: 1, isTotal: true, calculation: '6(b) + 6(c) for A, 6(a) + 6(c) for Column B' },
  'f3x-line-7-order-5': {},
  'f3x-line-8-order-6': { isTotal: true, calculation: 'Subtract Line 7 from Line 6(d)' },
  'f3x-line-9-order-7': { note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3x-line-10-order-9': { note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3x-line-11-order-11': { valueType: 'header' },
  'f3x-line-11(a)-order-12': { indent: 1, valueType: 'header' },
  'f3x-line-11(a)(i)-order-13': { indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
  'f3x-line-11(a)(ii)-order-14': { indent: 2 },
  'f3x-line-11(a)(iii)-order-15': { isTotal: true, calculation: 'Add Lines 11(a)(i) and (ii)' },
  'f3x-line-11(b)-order-16': { indent: 1 },
  'f3x-line-11(c)-order-17': { indent: 1, note: 'Such as PACs' },
  'f3x-line-11(d)-order-18': { isTotal: true, calculation: 'Add Lines 11(a)(iii), (b), and (c)) (Carry Totals to Line 33, page 5)' },
  'f3x-line-12-order-19': { note: 'Transfers from affiliated/other party committees' },
  'f3x-line-13-order-20': {},
  'f3x-line-14-order-21': { linkTo: 'line-37', note: 'Carry Totals to Line 37' },
  'f3x-line-15-order-22': { note: 'Refunds, Rebates, etc.' },
  'f3x-line-16-order-23': {},
  'f3x-line-17-order-24': { note: 'Dividends, Interest, etc.' },
  'f3x-line-18-order-25': { valueType: 'header' },
  'f3x-line-18(a)-order-26': { hasSchedule: true, scheduleType: 'SH3', note: 'From Schedule H3' },
  'f3x-line-18(b)-order-27': { hasSchedule: true, scheduleType: 'SH5', note: 'From Schedule H5' },
  'f3x-line-18(c)-order-28': { isTotal: true, calculation: 'Add 18(a) and 18(b)' },
  'f3x-line-19-order-29': { isTotal: true, calculation: 'Add Lines 11(d), 12, 13, 14, 15, 16, 17, and 18(c)' },
  'f3x-line-20-order-30': { isTotal: true, calculation: 'Subtract 18(c) from Line 19' },
  'f3x-line-21-order-31': { valueType: 'header' },
  'f3x-line-21(a)-order-32': { indent: 1, valueType: 'header', scheduleType: 'SH4' },
  'f3x-line-21(a)(i)-order-33': { indent: 2, hasSchedule: true, scheduleType: 'SH4', note: 'From Schedule H4' },
  'f3x-line-21(a)(ii)-order-34': { indent: 2 },
  'f3x-line-21(b)-order-35': { indent: 1, hasSchedule: true, scheduleType: 'SB' },
  'f3x-line-21(c)-order-36': { indent: 1, isTotal: true, calculation: 'Add 21(a)(i), 21(a)(ii), and 21(b)' },
  'f3x-line-22-order-37': {},
  'f3x-line-23-order-38': {},
  'f3x-line-24-order-39': { hasSchedule: true, scheduleType: 'SE', note: 'Use Schedule E' },
  'f3x-line-25-order-40': { hasSchedule: true, scheduleType: 'SF', note: '(52 U.S.C. § 30116(d)) (use Schedule F)' },
  'f3x-line-26-order-41': {},
  'f3x-line-27-order-42': {},
  'f3x-line-28-order-43': { valueType: 'header' },
  'f3x-line-28(a)-order-44': { indent: 1 },
  'f3x-line-28(b)-order-45': { indent: 1 },
  'f3x-line-28(c)-order-46': { indent: 1, note: 'Such as PACs' },
  'f3x-line-28(d)-order-47': { isTotal: true, calculation: 'Add 28(a), (b), and (c)' },
  'f3x-line-29-order-48': { note: 'Including Non-Federal Donations' },
  'f3x-line-30-order-49': { valueType: 'header' },
  'f3x-line-30(a)-order-50': { indent: 1, valueType: 'header', note: 'From Schedule H6' },
  'f3x-line-30(a)(i)-order-51': { indent: 1, note: 'From Schedule H6' },
  'f3x-line-30(a)(ii)-order-52': { indent: 2 },
  'f3x-line-30(b)-order-53': { indent: 2, note: 'Federal Funds Only' },
  'f3x-line-30(c)-order-54': { indent: 1, isTotal: true },
  'f3x-line-31-order-55': { isTotal: true },
  'f3x-line-32-order-56': { isTotal: true },
  'f3x-line-33-order-57': { linkTo: 'line-11-d', note: '(Other than loans) From Line 11(d)' },
  'f3x-line-34-order-58': { linkTo: 'line-28-d', note: '(Other than loans) From Line 28(d)' },
  'f3x-line-35-order-59': { isTotal: true, calculation: 'Subtract Line 34 from Line 33' },
  'f3x-line-36-order-60': { calculation: 'Add Line 21(a)(i) and Line 21(b)' },
  'f3x-line-37-order-61': { linkTo: 'line-15', note: 'From Line 15' },
  'f3x-line-38-order-62': { isTotal: true, linkTo: 'line-36', calculation: 'Subtract Line 37 from Line 36' },
};

export const F3X_SECTION_DEFINITIONS: Record<string, { order: number; categoryType: string }> = {
  formDetails: { order: 1, categoryType: 'FORM_DETAILS' },
  summary: { order: 2, categoryType: 'SUMMARY' },
  receipts: { order: 3, categoryType: 'RECEIPTS' },
  disbursements: { order: 4, categoryType: 'DISBURSEMENTS' },
  contributionExpenditures: { order: 5, categoryType: 'CONTRIBUTION_EXPENDITURES' },
};
