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

export const F3_LINE_DEFINITIONS: Record<string, F3LineDefinition> = {
  'f3-line-6-order-1': { note: 'Other than loans' },
  'f3-line-6a-order-2': { indent: 1, note: '(Other than loans) (From Line 11(e))', linkId: 'f3-line-11e-order-21' },
  'f3-line-6b-order-3': { indent: 1, note: 'From Line 20(d)', linkId: 'f3-line-20d-order-40' },
  'f3-line-6c-order-4': { indent: 1, isTotal: true, calculation: 'Subtract Line 6(b) From Line 6(a)', linkId: 'f3-line-6a-order-2' },
  'f3-line-7-order-5': {},
  'f3-line-7a-order-6': { indent: 1, note: 'From Line 17', linkId: 'f3-line-17-order-30' },
  'f3-line-7b-order-7': { indent: 1, note: 'From Line 14', linkId: 'f3-line-14-order-27' },
  'f3-line-7c-order-8': { indent: 1, isTotal: true, calculation: 'Subtract Line 7(b) From Line 7(a)', linkId: 'f3-line-7a-order-6' },
  'f3-line-8-order-9': { isTotal: true, note: 'from Line 27', linkId: 'f3-line-27-order-47' },
  'f3-line-9-order-10': { note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3-line-10-order-11': { note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3-line-11-order-13': { valueType: 'header' },
  'f3-line-11a-order-14': { indent: 1, valueType: 'header' },
  'f3-line-11ai-order-15': { indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
  'f3-line-11aii-order-16': { indent: 2 },
  'f3-line-11aiii-order-17': { indent: 2, isTotal: true },
  'f3-line-11b-order-18': { indent: 1 },
  'f3-line-11c-order-19': { indent: 1, note: 'Such as PACs' },
  'f3-line-11d-order-20': { indent: 1 },
  'f3-line-11e-order-21': { indent: 1, isTotal: true, calculation: 'Add Lines 11(a)(iii), 11(b), 11(c), and 11(d)', note: 'other than loans' },
  'f3-line-12-order-22': {},
  'f3-line-13-order-23': { valueType: 'header' },
  'f3-line-13a-order-24': { indent: 1 },
  'f3-line-13b-order-25': { indent: 1 },
  'f3-line-13c-order-26': { indent: 1, isTotal: true, calculation: 'Add Lines 13(a) and 13(b)' },
  'f3-line-14-order-27': { note: 'Refunds, Rebates, etc.' },
  'f3-line-15-order-28': { note: 'Dividends, Interest, etc.' },
  'f3-line-16-order-29': { isTotal: true, calculation: 'Add Lines 11(e), 12, 13(c), 14, and 15', note: 'Carry Total to Line 24', linkId: 'f3-line-24-order-44' },
  'f3-line-17-order-30': { hasSchedule: true, scheduleType: 'SB' },
  'f3-line-18-order-31': {},
  'f3-line-19-order-32': { valueType: 'header' },
  'f3-line-19a-order-33': { indent: 1 },
  'f3-line-19b-order-34': { indent: 1 },
  'f3-line-19c-order-35': { indent: 1, isTotal: true, calculation: 'Add Lines 19(a) and 19(b)' },
  'f3-line-20-order-36': { valueType: 'header' },
  'f3-line-20a-order-37': { indent: 1 },
  'f3-line-20b-order-38': { indent: 1 },
  'f3-line-20c-order-39': { indent: 1, note: 'Such as PACs' },
  'f3-line-20d-order-40': { indent: 1, isTotal: true, calculation: 'Add Lines 20(a), 20(b), and 20(c)' },
  'f3-line-21-order-41': {},
  'f3-line-22-order-42': { isTotal: true, calculation: 'Add Lines 17, 18, 19(c), 20(d), and 21' },
  'f3-line-23-order-43': {},
  'f3-line-24-order-44': { note: 'From Line 16', linkId: 'f3-line-16-order-29' },
  'f3-line-25-order-45': { isTotal: true, calculation: 'Add Line 23 and Line 24', linkId: 'f3-line-13-order-23' },
  'f3-line-26-order-46': { note: 'From Line 22', linkId: 'f3-line-22-order-42' },
  'f3-line-27-order-47': { isTotal: true, calculation: 'Subtract Line 26 from Line 25' },
};
