/** Frontend-only F3 presentation metadata. Backend supplies report data. */

export interface F3LineDefinition {
  label?: string;
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
// This file owns F3 presentation metadata; the backend owns report values.
export const F3_LINE_DEFINITIONS: Record<string, F3LineDefinition> = {
  'f3-line-6': { label: 'Contributions', note: 'Other than loans' },
  'f3-line-6a': { label: 'Total Contributions', indent: 1, note: '(Other than loans) (From Line 11(e))', linkId: 'f3-line-11e' },
  'f3-line-6b': { label: 'Total Contribution Refunds', indent: 1, note: 'From Line 20(d)', linkId: 'f3-line-20d' },
  'f3-line-6c': { label: 'Net Contributions', indent: 1, isTotal: true, calculation: 'Subtract Line 6(b) From Line 6(a)', linkId: 'f3-line-6a' },

  'f3-line-7': { label: 'Net Operating Expenditures' },
  'f3-line-7a': { label: 'Operating Expenditures', indent: 1, note: 'From Line 17', linkId: 'f3-line-17' },
  'f3-line-7b': { label: 'Offsets to Operating Expenditures', indent: 1, note: 'From Line 14', linkId: 'f3-line-14' },
  'f3-line-7c': { label: 'Net Operating Expenditures', indent: 1, isTotal: true, calculation: 'Subtract Line 7(b) From Line 7(a)', linkId: 'f3-line-7a' },
  'f3-line-8': { label: 'Cash on Hand at Close of Reporting Period', isTotal: true, note: 'From Line 27', linkId: 'f3-line-27' },
  'f3-line-9': { label: 'Debts Owed to the Committee', note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3-line-10': { label: 'Debts Owed by the Committee', note: 'Itemize all on Schedule C and/or Schedule D' },

  'f3-line-11': { label: 'Receipts', valueType: 'header' },
  'f3-line-11a': { label: 'Contributions', indent: 1, valueType: 'header' },
  'f3-line-11ai': { label: 'Individuals/Persons Other Than Political Committees', indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
  'f3-line-11aii': { label: 'Political Party Committees', indent: 2 },
  'f3-line-11aiii': { label: 'Total Contributions', indent: 2, isTotal: true },
  'f3-line-11b': { label: 'Political Party Committees', indent: 1 },
  'f3-line-11c': { label: 'Other Political Committees (PACs)', indent: 1, note: 'Such as PACs' },
  'f3-line-11d': { label: 'The Candidate', indent: 1 },
  'f3-line-11e': { label: 'Total Contributions', indent: 1, isTotal: true, calculation: 'Add Lines 11(a)(iii), 11(b), 11(c), and 11(d)', note: 'other than loans' },
  'f3-line-12': { label: 'Transfers From Other Authorized Committees' },
  'f3-line-13': { label: 'All Other Loans Received', valueType: 'header' },
  'f3-line-13a': { label: 'Loans Made or Guaranteed by the Candidate', indent: 1 },
  'f3-line-13b': { label: 'All Other Loans', indent: 1 },
  'f3-line-13c': { label: 'Total Loans', indent: 1, isTotal: true, calculation: 'Add Lines 13(a) and 13(b)' },
  'f3-line-14': { label: 'Offsets to Operating Expenditures', note: 'Refunds, Rebates, etc.' },
  'f3-line-15': { label: 'Other Federal Receipts', note: 'Dividends, Interest, etc.' },
  'f3-line-16': { label: 'Total Receipts', isTotal: true, calculation: 'Add Lines 11(e), 12, 13(c), 14, and 15', note: 'Carry Total to Line 24', linkId: 'f3-line-24' },

  'f3-line-17': { label: 'Operating Expenditures', hasSchedule: true, scheduleType: 'SB' },
  'f3-line-18': { label: 'Transfers to Other Authorized Committees' },
  'f3-line-19': { label: 'Loans Made', valueType: 'header' },
  'f3-line-19a': { label: 'Loans to Other Political Committees', indent: 1 },
  'f3-line-19b': { label: 'Loans to Other Candidates', indent: 1 },
  'f3-line-19c': { label: 'Total Loans Made', indent: 1, isTotal: true, calculation: 'Add Lines 19(a) and 19(b)' },
  'f3-line-20': { label: 'Contributions Refunds', valueType: 'header' },
  'f3-line-20a': { label: 'Individuals/Persons Other Than Political Committees', indent: 1 },
  'f3-line-20b': { label: 'Political Party Committees', indent: 1 },
  'f3-line-20c': { label: 'Other Political Committees (PACs)', indent: 1, note: 'Such as PACs' },
  'f3-line-20d': { label: 'Total Contribution Refunds', indent: 1, isTotal: true, calculation: 'Add Lines 20(a), 20(b), and 20(c)' },
  'f3-line-21': { label: 'Other Disbursements' },
  'f3-line-22': { label: 'Total Disbursements', isTotal: true, calculation: 'Add Lines 17, 18, 19(c), 20(d), and 21' },
  'f3-line-23': { label: 'Cash on Hand at Beginning of Reporting Period' },
  'f3-line-24': { label: 'Total Receipts', note: 'From Line 16', linkId: 'f3-line-16' },
  'f3-line-25': { label: 'Subtotal', isTotal: true, calculation: 'Add Line 23 and Line 24' },
  'f3-line-26': { label: 'Total Disbursements', note: 'From Line 22', linkId: 'f3-line-22' },
  'f3-line-27': { label: 'Cash on Hand at Close of Reporting Period', isTotal: true, calculation: 'Subtract Line 26 from Line 25' },
};
