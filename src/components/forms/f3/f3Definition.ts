/** Frontend-only F3 presentation metadata. Backend supplies report data. */

export interface F3LineDefinition {
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  note?: string;
  valueType?: string;
  linkId?: string;
}

// Stable F3 line IDs intentionally do not contain display/order information.
// The backend owns line order; this file only owns F3 presentation metadata.
export const F3_LINE_DEFINITIONS: Record<string, F3LineDefinition> = {
  'f3-line-6': { note: 'Other than loans' },
  'f3-line-6a': { indent: 1, note: '(Other than loans) (From Line 11(e))', linkId: 'f3-line-11e' },
  'f3-line-6b': { indent: 1, note: 'From Line 20(d)', linkId: 'f3-line-20d' },
  'f3-line-6c': { indent: 1, isTotal: true, calculation: 'Subtract Line 6(b) From Line 6(a)', linkId: 'f3-line-6a' },
  'f3-line-7': {},
  'f3-line-7a': { indent: 1, note: 'From Line 17', linkId: 'f3-line-17' },
  'f3-line-7b': { indent: 1, note: 'From Line 14', linkId: 'f3-line-14' },
  'f3-line-7c': { indent: 1, isTotal: true, calculation: 'Subtract Line 7(b) From Line 7(a)', linkId: 'f3-line-7a' },
  'f3-line-8': { isTotal: true, note: 'from Line 27', linkId: 'f3-line-27' },
  'f3-line-9': { note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3-line-10': { note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3-line-11': { valueType: 'header' },
  'f3-line-11a': { indent: 1, valueType: 'header' },
  'f3-line-11ai': { indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
  'f3-line-11aii': { indent: 2 },
  'f3-line-11aiii': { indent: 2, isTotal: true },
  'f3-line-11b': { indent: 1 },
  'f3-line-11c': { indent: 1, note: 'Such as PACs' },
  'f3-line-11d': { indent: 1 },
  'f3-line-11e': { indent: 1, isTotal: true, calculation: 'Add Lines 11(a)(iii), 11(b), 11(c), and 11(d)', note: 'other than loans' },
  'f3-line-12': {},
  'f3-line-13': { valueType: 'header' },
  'f3-line-13a': { indent: 1 },
  'f3-line-13b': { indent: 1 },
  'f3-line-13c': { indent: 1, isTotal: true, calculation: 'Add Lines 13(a) and 13(b)' },
  'f3-line-14': { note: 'Refunds, Rebates, etc.' },
  'f3-line-15': { note: 'Dividends, Interest, etc.' },
  'f3-line-16': { isTotal: true, calculation: 'Add Lines 11(e), 12, 13(c), 14, and 15', note: 'Carry Total to Line 24', linkId: 'f3-line-24' },
  'f3-line-17': { hasSchedule: true, scheduleType: 'SB' },
  'f3-line-18': {},
  'f3-line-19': { valueType: 'header' },
  'f3-line-19a': { indent: 1 },
  'f3-line-19b': { indent: 1 },
  'f3-line-19c': { indent: 1, isTotal: true, calculation: 'Add Lines 19(a) and 19(b)' },
  'f3-line-20': { valueType: 'header' },
  'f3-line-20a': { indent: 1 },
  'f3-line-20b': { indent: 1 },
  'f3-line-20c': { indent: 1, note: 'Such as PACs' },
  'f3-line-20d': { indent: 1, isTotal: true, calculation: 'Add Lines 20(a), 20(b), and 20(c)' },
  'f3-line-21': {},
  'f3-line-22': { isTotal: true, calculation: 'Add Lines 17, 18, 19(c), 20(d), and 21' },
  'f3-line-23': {},
  'f3-line-24': { note: 'From Line 16', linkId: 'f3-line-16' },
  'f3-line-25': { isTotal: true, calculation: 'Add Line 23 and Line 24' },
  'f3-line-26': { note: 'From Line 22', linkId: 'f3-line-22' },
  'f3-line-27': { isTotal: true, calculation: 'Subtract Line 26 from Line 25' },
};
