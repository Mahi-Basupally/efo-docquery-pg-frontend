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
  linkId?: string;
}

export const F3X_LINE_DEFINITIONS: Record<string, F3XLineDefinition> = {
'f3x-line-6a-order-1': { indent: 1 },
'f3x-line-6b-order-2': { indent: 1 },
'f3x-line-6c-order-3': { indent: 1, note: 'From line 19', linkId: 'f3x-line-19-order-29' },
'f3x-line-6d-order-4': { indent: 1, isTotal: true, calculation: '6(b) + 6(c) for A, 6(a) + 6(c) for Column B' },
'f3x-line-7-order-5': {},
'f3x-line-8-order-6': { isTotal: true, calculation: 'Subtract Line 7 from Line 6(d)' },
'f3x-line-9-order-7': { note: 'Itemize all on Schedule C and/or Schedule D' },
'f3x-line-10-order-9': { note: 'Itemize all on Schedule C and/or Schedule D' },
'f3x-line-11-order-11': { valueType: 'header' },
'f3x-line-11a-order-12': { indent: 1, valueType: 'header' },
'f3x-line-11ai-order-13': { indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
'f3x-line-11aii-order-14': { indent: 2 },
'f3x-line-11aiii-order-15': { indent: 2, isTotal: true, calculation: 'Add Lines 11(a)(i) and (ii)' },
'f3x-line-11b-order-16': { indent: 1 },
'f3x-line-11c-order-17': { indent: 1, note: 'Such as PACs' },
'f3x-line-11d-order-18': { indent: 1, isTotal: true, calculation: 'Add Lines 11(a)(iii), (b), and (c)) (Carry Totals to Line 33' },
'f3x-line-12-order-19': {},
'f3x-line-13-order-20': {},
'f3x-line-14-order-21': { note: 'Carry Totals to Line 37', linkId: 'f3x-line-37-order-61' },
'f3x-line-15-order-22': { note: 'Refunds, Rebates, etc.' },
'f3x-line-16-order-23': {},
'f3x-line-17-order-24': { note: 'Dividends, Interest, etc.' },
'f3x-line-18-order-25': { valueType: 'header' },
'f3x-line-18a-order-26': { indent: 1, hasSchedule: true, scheduleType: 'SH3', note: 'From Schedule H3' },
'f3x-line-18b-order-27': { indent: 1, hasSchedule: true, scheduleType: 'SH5', note: 'From Schedule H5' },
'f3x-line-18c-order-28': { indent: 1, calculation: 'Add 18(a) and 18(b)' },
'f3x-line-19-order-29': { calculation: 'Add Lines 11(d), 12, 13, 14, 15, 16, 17, and 18(c)' },
'f3x-line-20-order-30': { calculation: 'Subtract Line 18(c) from Line 19)' },
'f3x-line-21-order-31': { valueType: 'header' },
'f3x-line-21a-order-32': { indent: 1, valueType: 'header', scheduleType: 'SH4' },
'f3x-line-21ai-order-33': { indent: 2, hasSchedule: true, scheduleType: 'SH4', note: 'From Schedule H4' },
'f3x-line-21aii-order-34': { indent: 2 },
'f3x-line-21b-order-35': { indent: 1, hasSchedule: true, scheduleType: 'SB' },
'f3x-line-21c-order-36': { indent: 1, isTotal: true, calculation: 'Add 21(a)(i), 21(a)(ii), and 21(b)' },
'f3x-line-22-order-37': {},
'f3x-line-23-order-38': {},
'f3x-line-24-order-39': { hasSchedule: true, scheduleType: 'SE', note: 'Use Schedule E' },
'f3x-line-25-order-40': { hasSchedule: true, scheduleType: 'SF', note: '(52 U.S.C. § 30116(d)) (use Schedule F)' },
'f3x-line-26-order-41': {},
'f3x-line-27-order-42': {},
'f3x-line-28-order-43': { valueType: 'header' },
'f3x-line-28a-order-44': { indent: 1 },
'f3x-line-28b-order-45': { indent: 1 },
'f3x-line-28c-order-46': { indent: 1, note: 'Such as PACs' },
'f3x-line-28d-order-47': { indent: 1, calculation: 'Add 28(a), (b), and (c)' },
'f3x-line-29-order-48': { note: 'Including Non-Federal Donations' },
'f3x-line-30-order-49': { valueType: 'header', note: '52 U.S.C. § 30101(20)' },
'f3x-line-30a-order-50': { indent: 1, valueType: 'header', note: 'From Schedule H6' },
'f3x-line-30ai-order-51': { indent: 1, note: 'From Schedule H6' },
'f3x-line-30aii-order-52': { indent: 2 },
'f3x-line-30b-order-53': { indent: 2, note: 'Federal Funds Only' },
'f3x-line-30c-order-54': { indent: 1, calculation: 'Add 30(a)(i), 30(a)(ii), and 30(b)' },
'f3x-line-31-order-55': { calculation: 'Add Lines 21(c), 22, 23, 24, 25, 26, 27, 28(d), 29, and 30(c)' },
'f3x-line-32-order-56': { calculation: 'Subtract Line 21(a)(ii) and Line 30(a)(ii) from Line 31' },
'f3x-line-33-order-57': { note: '(Other than loans) From Line 11(d)', linkId: 'f3x-line-11d-order-18' },
'f3x-line-34-order-58': { note: '(Other than loans) From Line 28(d)', linkId: 'f3x-line-28d-order-47' },
'f3x-line-35-order-59': { isTotal: true, calculation: 'Subtract Line 34 from Line 33' },
'f3x-line-36-order-60': { calculation: 'Add Line 21(a)(i) and Line 21(b)' },
'f3x-line-37-order-61': { note: 'From Line 15', linkId: 'f3x-line-15-order-22' },
'f3x-line-38-order-62': { isTotal: true, calculation: 'Subtract Line 37 from Line 36', linkId: 'f3x-line-36-order-60' }
};

export const F3X_SECTION_DEFINITIONS: Record<string, { order: number; categoryType: string }> = {
  formDetails: { order: 1, categoryType: 'FORM_DETAILS' },
  summary: { order: 2, categoryType: 'SUMMARY' },
  receipts: { order: 3, categoryType: 'RECEIPTS' },
  disbursements: { order: 4, categoryType: 'DISBURSEMENTS' },
  contributionExpenditures: { order: 5, categoryType: 'CONTRIBUTION_EXPENDITURES' },
};
