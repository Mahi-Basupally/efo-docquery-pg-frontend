/**
 * F3S line presentation metadata, generated from
 * GET /api/v1/ui/form-definition?schema=EFO&tableName=F3S
 * (app/services/ui_service.py, sourced from efo.ref_summary_line_num_desc).
 * Regenerate from that endpoint rather than hand-editing.
 */

export interface F3SLineDefinition {
  lineNumber?: string;
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

export const F3S_LINE_DEFINITIONS: Record<string, F3SLineDefinition> = {
  'f3s-line-6': { lineNumber: '6', label: 'Net Contributions', note: 'Other than loans' },
  'f3s-line-6a': { lineNumber: '6(a)', label: 'Total Contributions', indent: 1, note: '(Other than loans) (From Line 11(e))', linkId: 'f3s-line-11e' },
  'f3s-line-6b': { lineNumber: '6(b)', label: 'Total Contribution Refunds', indent: 1, note: 'From Line 20(d)', linkId: 'f3s-line-20d' },
  'f3s-line-6c': { lineNumber: '6(c)', label: 'Net Contributions', indent: 1, isTotal: true, calculation: 'Subtract Line 6(b) From Line 6(a)', linkId: 'f3s-line-6a' },
  'f3s-line-7': { lineNumber: '7', label: 'Net Operating Expenditures' },
  'f3s-line-7a': { lineNumber: '7(a)', label: '(a) Total Operating Expenditures', indent: 1, note: 'From Line 17', linkId: 'f3s-line-17' },
  'f3s-line-7b': { lineNumber: '7(b)', label: 'Total Offsets to Operating Expenditures', indent: 1, note: 'From Line 14', linkId: 'f3s-line-14' },
  'f3s-line-7c': { lineNumber: '7(c)', label: 'Net Operating Expenditures', indent: 1, isTotal: true, calculation: 'Subtract Line 7(b) From Line 7(a)', linkId: 'f3s-line-7a' },
  'f3s-line-8': { lineNumber: '8', label: 'Cash on Hand at Close of Reporting Period', isTotal: true, note: 'from Line 27', linkId: 'f3s-line-27' },
  'f3s-line-9': { lineNumber: '9', label: 'Debts and Obligations Owed TO the Committee', note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3s-line-10': { lineNumber: '10', label: 'Debts and Obligations Owed BY the Committee', note: 'Itemize all on Schedule C and/or Schedule D' },
  'f3s-line-11': { lineNumber: '11', label: 'CONTRIBUTIONS (other than loans) FROM', valueType: 'header' },
  'f3s-line-11a': { lineNumber: '11(a)', label: 'Individuals/Persons Other Than Political Committee', indent: 1, valueType: 'header' },
  'f3s-line-11ai': { lineNumber: '11(a)(i)', label: 'Itemized', indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
  'f3s-line-11aii': { lineNumber: '11(a)(ii)', label: 'Unitemized', indent: 2 },
  'f3s-line-11aiii': { lineNumber: '11(a)(iii)', label: 'TOTAL of contributions from individuals', indent: 2, isTotal: true },
  'f3s-line-11b': { lineNumber: '11(b)', label: 'Political Party Committees', indent: 1 },
  'f3s-line-11c': { lineNumber: '11(c)', label: 'Other Political Committees', indent: 1, note: 'Such as PACs' },
  'f3s-line-11d': { lineNumber: '11(d)', label: 'The Candidate', indent: 1 },
  'f3s-line-11e': { lineNumber: '11(e)', label: 'TOTAL CONTRIBUTIONS', indent: 1, isTotal: true, calculation: 'Add Lines 11(a)(iii), 11(b), 11(c), and 11(d)', note: 'other than loans' },
  'f3s-line-12': { lineNumber: '12', label: 'TRANSFERS FROM OTHER AUTHORIZED COMMITTEES' },
  'f3s-line-13': { lineNumber: '13', label: 'LOANS', valueType: 'header' },
  'f3s-line-13a': { lineNumber: '13(a)', label: 'Made or Guaranteed by the Candidate', indent: 1 },
  'f3s-line-13b': { lineNumber: '13(b)', label: 'All Other Loans', indent: 1 },
  'f3s-line-13c': { lineNumber: '13(c)', label: 'TOTAL LOANS', indent: 1, isTotal: true, calculation: 'Add Lines 13(a) and 13(b)' },
  'f3s-line-14': { lineNumber: '14', label: 'OFFSETS TO OPERATING EXPENDITURES', note: 'Refunds, Rebates, etc.' },
  'f3s-line-15': { lineNumber: '15', label: 'OTHER RECEIPTS', note: 'Dividends, Interest, etc.' },
  'f3s-line-iii': { label: 'NET CONTRIBUTIONS' },
  'f3s-line-16': { lineNumber: '16', label: 'TOTAL RECEIPTS', isTotal: true, calculation: 'Add Lines 11(e), 12, 13(c), 14, and 15', note: 'Carry Total to Line 24', linkId: 'f3s-line-24' },
  'f3s-line-17': { lineNumber: '17', label: 'OPERATING EXPENDITURES', hasSchedule: true, scheduleType: 'SB' },
  'f3s-line-iv': { label: 'NET OPERATING EXPENDITURES' },
  'f3s-line-18': { lineNumber: '18', label: 'TRANSFERS TO OTHER AUTHORIZED COMMITTEES' },
  'f3s-line-19': { lineNumber: '19', label: 'LOAN REPAYMENTS', valueType: 'header' },
  'f3s-line-19a': { lineNumber: '19(a)', label: 'Of Loans Made or Guaranteed by the Candidate', indent: 1 },
  'f3s-line-19b': { lineNumber: '19(b)', label: 'Of All Other Loans', indent: 1 },
  'f3s-line-19c': { lineNumber: '19(c)', label: 'TOTAL LOAN REPAYMENTS', indent: 1, isTotal: true, calculation: 'Add Lines 19(a) and 19(b)' },
  'f3s-line-20': { lineNumber: '20', label: 'REFUNDS OF CONTRIBUTIONS TO', valueType: 'header' },
  'f3s-line-20a': { lineNumber: '20(a)', label: 'Individuals/Persons Other Than Political Committees', indent: 1 },
  'f3s-line-20b': { lineNumber: '20(b)', label: 'Political Party Committees', indent: 1 },
  'f3s-line-20c': { lineNumber: '20(c)', label: 'Other Political Committees', indent: 1, note: 'Such as PACs' },
  'f3s-line-20d': { lineNumber: '20(d)', label: 'TOTAL CONTRIBUTION REFUNDS', indent: 1, isTotal: true, calculation: 'Add Lines 20(a), 20(b), and 20(c)' },
  'f3s-line-21': { lineNumber: '21', label: 'OTHER DISBURSEMENTS' },
  'f3s-line-22': { lineNumber: '22', label: 'TOTAL DISBURSEMENTS', isTotal: true, calculation: 'Add Lines 17, 18, 19(c), 20(d), and 21' },
  'f3s-line-23': { lineNumber: '23', label: 'CASH ON HAND AT BEGINNING OF REPORTING PERIOD' },
  'f3s-line-24': { lineNumber: '24', label: 'TOTAL RECEIPTS THIS PERIOD', note: 'From Line 16', linkId: 'f3s-line-16' },
  'f3s-line-25': { lineNumber: '25', label: 'SUBTOTAL', isTotal: true, calculation: 'Add Line 23 and Line 24', linkId: 'f3s-line-23' },
  'f3s-line-26': { lineNumber: '26', label: 'TOTAL DISBURSEMENTS THIS PERIOD', note: 'From Line 22', linkId: 'f3s-line-22' },
  'f3s-line-27': { lineNumber: '27', label: 'CASH ON HAND AT CLOSE OF REPORTING PERIOD', isTotal: true, calculation: 'Subtract Line 26 from Line 25' },
};
