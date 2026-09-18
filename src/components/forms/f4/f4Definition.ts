/**
 * F4 line presentation metadata, generated from
 * GET /api/v1/ui/form-definition?schema=EFO&tableName=F4
 * (app/services/ui_service.py, sourced from efo.ref_summary_line_num_desc).
 * Regenerate from that endpoint rather than hand-editing.
 *
 * The source table has a handful of known text defects that come through
 * verbatim (not corrected here): f4-line-10's note and f4-line-21c's
 * calculation each have a stray/mismatched paren, f4-line-14c's calculation
 * has a typo'd '}' instead of ')', and f4-line-''s label has a run-on typo
 * ("SUBJECTTO LIM ITATIONS").
 */

export interface F4LineDefinition {
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

export const F4_LINE_DEFINITIONS: Record<string, F4LineDefinition> = {
  'f4-line-6a': { lineNumber: '6 (a)', label: 'Cash On Hand January 1, {REPLACE_YEAR}', indent: 1 },
  'f4-line-6b': { lineNumber: '6 (b)', label: 'Cash On Hand at Beginning Of Reporting Period', indent: 1 },
  'f4-line-6c': { lineNumber: '6 (c)', label: 'Total Receipts', indent: 1, note: 'From Line 20', linkId: 'f4-line-20' },
  'f4-line-6d': { lineNumber: '6 (d)', label: 'Subtotal', indent: 1, calculation: 'Add Lines 6(b) and 6(c) for Column A and Lines 6(a) and 6(c) for Column B' },
  'f4-line-7': { lineNumber: '7', label: 'Total Disbursements', note: 'From Line 25', linkId: 'f4-line-25' },
  'f4-line-8': { lineNumber: '8', label: 'Cash on Hand at Close of Reporting Period', calculation: 'Subtract Line 7 from Line 6(d)', linkId: 'f4-line-6d' },
  'f4-line-9': { lineNumber: '9', label: 'Debts and Obligations Owed TO the Committee', note: 'Itemize all on Schedule C or Schedule D' },
  'f4-line-10': { lineNumber: '10', label: 'Debts and Obligations Owed BY the Committee', note: 'Itemize all on Schedule C or Schedule D)' },
  'f4-line-': { label: 'SECTION B - SUMMARY OF EXPENDITURES SUBJECTTO LIM ITATIONS ', valueType: 'subtitle' },
  'f4-line-11': { lineNumber: '11', label: 'Convention Expenditures', note: 'From Line 21(c)', linkId: 'f4-line-21c' },
  'f4-line-12': { lineNumber: '12', label: 'Refunds, Rebates, Returns Relating to Convention Expenditures', note: 'From Line 17(c)', linkId: 'f4-line-17c' },
  'f4-line-12a': { lineNumber: '12 (a)', label: 'Expenditures Subject To Limitation', indent: 1, calculation: 'Subtract Line 12 from Line 11' },
  'f4-line-12b': { lineNumber: '12 (b)', label: 'Expenditures From Prior Years Subject To Limitation', indent: 1 },
  'f4-line-12c': { lineNumber: '12 (c)', label: 'Total Expenditures Subject To Limitation', indent: 1, calculation: 'Add Lines 12(a) and 12(b)' },
  'f4-line-13': { lineNumber: '13', label: 'Federal Funds', note: 'Itemize all on Schedule A' },
  'f4-line-14': { lineNumber: '14', label: 'Contributions to Defray Convention Expenses:', valueType: 'mergetd' },
  'f4-line-14a': { lineNumber: '14 (a)', label: 'Itemized', indent: 1, note: 'Use Schedule A' },
  'f4-line-14b': { lineNumber: '14 (b)', label: 'Unitemized', indent: 1 },
  'f4-line-14c': { lineNumber: '14 (c)', label: 'Subtotal of Contributions to Defray Convention Expenses', indent: 1, calculation: 'Add Lines 14(a) and 14(b}' },
  'f4-line-15': { lineNumber: '15', label: 'Transfers From Affiliated Committees' },
  'f4-line-16': { lineNumber: '16', label: 'Loans and Loan Repayments Received', calculation: 'Add Lines 16(a) and 16(b)', valueType: 'mergetd' },
  'f4-line-16a': { lineNumber: '16 (a)', label: 'Loans Received', indent: 1 },
  'f4-line-16b': { lineNumber: '16 (b)', label: 'Loan Repayments Received', indent: 1 },
  'f4-line-16c': { lineNumber: '16 (c)', label: 'Subtotal of Loans and Loan Repayments Received ', indent: 1, calculation: 'Add Lines 17a and 17b' },
  'f4-line-17': { lineNumber: '17', label: 'Refunds Rebates, Returns of Deposits Relating to Convention Expenditures:', valueType: 'mergetd' },
  'f4-line-17a': { lineNumber: '17 (a)', label: 'Itemized', indent: 1, note: 'Use Schedule A' },
  'f4-line-17b': { lineNumber: '17 (b)', label: 'Unitemized', indent: 1 },
  'f4-line-17c': { lineNumber: '17 (c)', label: 'Subtotal of Refunds, Rebates, Returns of Deposits Relating to Convention Expenditures:', indent: 1 },
  'f4-line-18': { lineNumber: '18', label: 'Other Refunds, Rebates, Returns of Deposits:', valueType: 'mergetd' },
  'f4-line-18a': { lineNumber: '18 (a)', label: 'Itemized Other Refunds, Rebates, Returns of Deposits', indent: 1 },
  'f4-line-18b': { lineNumber: '18 (b)', label: 'Unitemized Other Refunds, Rebates, Returns of Deposits', indent: 1 },
  'f4-line-18c': { lineNumber: '18 (c)', label: 'Subtotal of Other Refunds, Rebates, Returns of Deposits', indent: 1, calculation: 'Add Lines 18(a) and 18(b)' },
  'f4-line-19': { lineNumber: '19', label: 'Other Income:', valueType: 'mergetd' },
  'f4-line-19a': { lineNumber: '19 (a)', label: 'Itemized', indent: 1, note: 'Use Schedule A' },
  'f4-line-19b': { lineNumber: '19 (b)', label: 'Unitemized', indent: 1 },
  'f4-line-19c': { lineNumber: '19 (c)', label: 'Subtotal of Other Incom', indent: 1, calculation: 'Add Lines 19(a) and 19(b)' },
  'f4-line-20': { lineNumber: '20', label: 'TOTAL RECEIPTS', calculation: 'Add Lines 13, 14(c), 15, 16(c), 17(c), 18(c) and 19(c)' },
  'f4-line-21': { lineNumber: '21', label: 'Convention Expenses:', valueType: 'mergetd' },
  'f4-line-21a': { lineNumber: '21 (a)', label: 'Itemized', indent: 1, note: 'Use Schedule A' },
  'f4-line-21b': { lineNumber: '21 (b)', label: 'Unitemized', indent: 1 },
  'f4-line-21c': { lineNumber: '21 (c)', label: 'Subtotal of Convention Expenditure', indent: 1, calculation: ' (Add Lines 21 (a) and 21 (b)' },
  'f4-line-22': { lineNumber: '22', label: 'Transfers To Affiliated Committees' },
  'f4-line-23': { lineNumber: '23', label: '23. Loans and Loan Repayments Made:', valueType: 'mergetd' },
  'f4-line-23a': { lineNumber: '23 (a)', label: 'Loans Made', indent: 1 },
  'f4-line-23b': { lineNumber: '23 (b)', label: 'Loan Repayments Made', indent: 1 },
  'f4-line-23c': { lineNumber: '23 (c)', label: '(c) Subtotal', indent: 1 },
  'f4-line-24': { lineNumber: '24', label: '24. Other Disbursements:', valueType: 'mergetd' },
  'f4-line-24a': { lineNumber: '24 (a)', label: '(a) Itemized', indent: 1 },
  'f4-line-24b': { lineNumber: '24 (b)', label: '(b) Unitemized', indent: 1 },
  'f4-line-24c': { lineNumber: '24 (c)', label: 'Subtotal of Loans and Loan Repayments Made', indent: 1, calculation: 'Add Lines 23(a)and 23(b)' },
  'f4-line-25': { lineNumber: '25', label: 'TOTAL DISBURSEMENTS', calculation: 'Add Lines 21 (c), 22, 23(c) and 24(c)' },
};
