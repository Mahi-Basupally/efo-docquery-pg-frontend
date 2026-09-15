/**
 * Frontend-only F4 presentation metadata. Backend supplies report data.
 * Sourced from efo.ref_summary_line_num_desc (table_name='F4') - the
 * calculation/note/linkId text below is copied verbatim from that table's
 * calculation/note/link_id columns.
 */

export interface F4LineDefinition {
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  note?: string;
  valueType?: string;
  linkId?: string;
}

export const F4_LINE_DEFINITIONS: Record<string, F4LineDefinition> = {
  'f4-line-6a-order-1': {},
  'f4-line-6b-order-2': {},
  'f4-line-6c-order-3': { note: 'From Line 20', linkId: 'f4-line-20-order-38' },
  'f4-line-6d-order-4': { calculation: 'Add Lines 6(b) and 6(c) for Column A and Lines 6(a) and 6(c) for Column B' },
  'f4-line-7-order-5': { note: 'From Line 25', linkId: 'f4-line-25-order-52' },
  'f4-line-8-order-6': { calculation: 'Subtract Line 7 from Line 6(d)', linkId: 'f4-line-6d-order-4' },
  'f4-line-9-order-7': { note: 'Itemize all on Schedule C or Schedule D' },
  'f4-line-10-order-8': { note: 'Itemize all on Schedule C or Schedule D)' },
  'f4-line--order-9': {},
  'f4-line-11-order-11': { note: 'From Line 21(c)', linkId: 'f4-line-21c-order-42' },
  'f4-line-12-order-12': { note: 'From Line 17(c)', linkId: 'f4-line-17c-order-29' },
  'f4-line-12a-order-13': { calculation: 'Subtract Line 12 from Line 11' },
  'f4-line-12b-order-14': {},
  'f4-line-12c-order-15': { calculation: 'Add Lines 12(a) and 12(b)' },
  'f4-line-13-order-16': { note: 'Itemize all on Schedule A' },
  'f4-line-14-order-17': { valueType: 'header' },
  'f4-line-14a-order-18': { note: 'Use Schedule A' },
  'f4-line-14b-order-19': {},
  'f4-line-14c-order-20': { calculation: 'Add Lines 14(a) and 14(b}' },
  'f4-line-15-order-21': {},
  'f4-line-16-order-22': { valueType: 'header', calculation: 'Add Lines 16(a) and 16(b)' },
  'f4-line-16a-order-23': {},
  'f4-line-16b-order-24': {},
  'f4-line-16c-order-25': { calculation: 'Add Lines 17a and 17b' },
  'f4-line-17-order-26': { valueType: 'header' },
  'f4-line-17a-order-27': { note: 'Use Schedule A' },
  'f4-line-17b-order-28': {},
  'f4-line-17c-order-29': {},
  'f4-line-18-order-30': { valueType: 'header' },
  'f4-line-18a-order-31': {},
  'f4-line-18b-order-32': {},
  'f4-line-18c-order-33': { calculation: 'Add Lines 18(a) and 18(b)' },
  'f4-line-19-order-34': { valueType: 'header' },
  'f4-line-19a-order-35': { note: 'Use Schedule A' },
  'f4-line-19b-order-36': {},
  'f4-line-19c-order-37': { calculation: 'Add Lines 19(a) and 19(b)' },
  'f4-line-20-order-38': { calculation: 'Add Lines 13, 14(c), 15, 16(c), 17(c), 18(c) and 19(c)' },
  'f4-line-21-order-39': { valueType: 'header' },
  'f4-line-21a-order-40': { note: 'Use Schedule A' },
  'f4-line-21b-order-41': {},
  'f4-line-21c-order-42': { calculation: '(Add Lines 21 (a) and 21 (b)' },
  'f4-line-22-order-43': {},
  'f4-line-23-order-44': { valueType: 'header' },
  'f4-line-23a-order-45': {},
  'f4-line-23b-order-46': {},
  'f4-line-23c-order-47': {},
  'f4-line-24-order-48': { valueType: 'header' },
  'f4-line-24a-order-49': {},
  'f4-line-24b-order-50': {},
  'f4-line-24c-order-51': { calculation: 'Add Lines 23(a)and 23(b)' },
  'f4-line-25-order-52': { calculation: 'Add Lines 21 (c), 22, 23(c) and 24(c)' },
};
