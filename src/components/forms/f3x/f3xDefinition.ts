/**
 * F3X line presentation metadata, generated from
 * GET /api/v1/ui/form-definition?schema=EFO&tableName=F3X
 * (app/services/ui_service.py, sourced from efo.ref_summary_line_num_desc).
 * Regenerate from that endpoint rather than hand-editing.
 */

export interface F3XLineDefinition {
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

export const F3X_LINE_DEFINITIONS: Record<string, F3XLineDefinition> = {
'f3x-line-6a': { lineNumber: '6(a)', label: 'Cash on Hand January 1, {REPLACE_YEAR}', indent: 1 },
'f3x-line-6b': { lineNumber: '6(b)', label: 'Cash on hand at Beginning of Reporting Period', indent: 1 },
'f3x-line-6c': { lineNumber: '6(c)', label: 'Total Receipts', indent: 1, note: 'From line 19', linkId: 'f3x-line-19' },
'f3x-line-6d': { lineNumber: '6(d)', label: 'Subtotal', indent: 1, isTotal: true, calculation: '6(b) + 6(c) for A, 6(a) + 6(c) for Column B' },
'f3x-line-7': { lineNumber: '7', label: 'Total Disbursements' },
'f3x-line-8': { lineNumber: '8', label: 'Cash on Hand at Close of Reporting Period', isTotal: true, calculation: 'Subtract Line 7 from Line 6(d)' },
'f3x-line-9': { lineNumber: '9', label: 'Debts and Obligations Owed TO the Committee', note: 'Itemize all on Schedule C and/or Schedule D' },
'f3x-line-10': { lineNumber: '10', label: 'Debts and Obligations Owed BY the Committee', note: 'Itemize all on Schedule C and/or Schedule D' },
'f3x-line-11': { lineNumber: '11', label: 'Contributions (other than loans) From:', valueType: 'header' },
'f3x-line-11a': { lineNumber: '11(a)', label: 'Individuals/Persons Other Than Political Committees', indent: 1, valueType: 'header' },
'f3x-line-11ai': { lineNumber: '11(a)(i)', label: 'Itemized', indent: 2, hasSchedule: true, scheduleType: 'SA', note: 'Use Schedule A' },
'f3x-line-11aii': { lineNumber: '11(a)(ii)', label: 'Unitemized', indent: 2 },
'f3x-line-11aiii': { lineNumber: '11(a)(iii)', label: 'TOTAL', indent: 2, isTotal: true, calculation: 'Add Lines 11(a)(i) and (ii)' },
'f3x-line-11b': { lineNumber: '11(b)', label: 'Political Party Committees', indent: 1 },
'f3x-line-11c': { lineNumber: '11(c)', label: 'Other Political Committees', indent: 1, note: 'Such as PACs' },
'f3x-line-11d': { lineNumber: '11(d)', label: 'Total Contributions', indent: 1, isTotal: true, calculation: 'Add Lines 11(a)(iii), (b), and (c)) (Carry Totals to Line 33' },
'f3x-line-12': { lineNumber: '12', label: 'Transfers from Affiliated/Other Party Committees' },
'f3x-line-13': { lineNumber: '13', label: 'All Loans Received' },
'f3x-line-14': { lineNumber: '14', label: 'Loan Repayments Received', note: 'Carry Totals to Line 37', linkId: 'f3x-line-37' },
'f3x-line-15': { lineNumber: '15', label: 'Offsets to Operating Expenditures', note: 'Refunds, Rebates, etc.' },
'f3x-line-16': { lineNumber: '16', label: 'Refunds of Contributions Made to Federal Candidates and Other Political Committees' },
'f3x-line-17': { lineNumber: '17', label: 'Other Federal Receipts', note: 'Dividends, Interest, etc.' },
'f3x-line-18': { lineNumber: '18', label: 'Transfers from Non-Federal and Levin Funds:', valueType: 'header' },
'f3x-line-18a': { lineNumber: '18(a)', label: 'Non-Federal Account', indent: 1, hasSchedule: true, scheduleType: 'SH3', note: 'From Schedule H3' },
'f3x-line-18b': { lineNumber: '18(b)', label: 'Levin Funds', indent: 1, hasSchedule: true, scheduleType: 'SH5', note: 'From Schedule H5' },
'f3x-line-18c': { lineNumber: '18(c)', label: 'Total Transfers', indent: 1, calculation: 'Add 18(a) and 18(b)' },
'f3x-line-19': { lineNumber: '19', label: 'TOTAL RECEIPTS', calculation: 'Add Lines 11(d), 12, 13, 14, 15, 16, 17, and 18(c)' },
'f3x-line-20': { lineNumber: '20', label: 'Total Federal Receipts', calculation: 'Subtract Line 18(c) from Line 19)' },
'f3x-line-21': { lineNumber: '21', label: 'Operating Expenditures:', valueType: 'header' },
'f3x-line-21a': { lineNumber: '21(a)', label: 'Allocated Federal/Non-Federal Activity', indent: 1, scheduleType: 'SH4', valueType: 'header' },
'f3x-line-21ai': { lineNumber: '21(a)(i)', label: 'Federal Share', indent: 2, hasSchedule: true, scheduleType: 'SH4', note: 'From Schedule H4' },
'f3x-line-21aii': { lineNumber: '21(a)(ii)', label: 'Non-Federal Share', indent: 2 },
'f3x-line-21b': { lineNumber: '21(b)', label: 'Other Federal Operating Expenditures', indent: 1, hasSchedule: true, scheduleType: 'SB' },
'f3x-line-21c': { lineNumber: '21(c)', label: 'Total Operating Expenditures', indent: 1, isTotal: true, calculation: 'Add 21(a)(i), 21(a)(ii), and 21(b)' },
'f3x-line-22': { lineNumber: '22', label: 'Transfers to Affiliated/Other Party Committees' },
'f3x-line-23': { lineNumber: '23', label: 'Contributions to Federal Candidates/Committees and Other Political Committees' },
'f3x-line-24': { lineNumber: '24', label: 'Independent Expenditures', hasSchedule: true, scheduleType: 'SE', note: 'Use Schedule E' },
'f3x-line-25': { lineNumber: '25', label: 'Coordinated Party Expenditures', hasSchedule: true, scheduleType: 'SF', note: '(52 U.S.C. � 30116(d)) (use Schedule F)' },
'f3x-line-26': { lineNumber: '26', label: 'Loan Repayments Made' },
'f3x-line-27': { lineNumber: '27', label: 'Loans Made' },
'f3x-line-28': { lineNumber: '28', label: 'Refunds of Contributions To:', valueType: 'header' },
'f3x-line-28a': { lineNumber: '28(a)', label: 'Individuals/Persons Other Than Political Committees ', indent: 1 },
'f3x-line-28b': { lineNumber: '28(b)', label: 'Political Party Committees', indent: 1 },
'f3x-line-28c': { lineNumber: '28(c)', label: 'Other Political Committees', indent: 1, note: 'Such as PACs' },
'f3x-line-28d': { lineNumber: '28(d)', label: 'Total Contribution Refunds', indent: 1, calculation: 'Add 28(a), (b), and (c)' },
'f3x-line-29': { lineNumber: '29', label: 'Other Disbursements', note: 'Including Non-Federal Donations' },
'f3x-line-30': { lineNumber: '30', label: 'Federal Election Activity', note: '52 U.S.C. � 30101(20)', valueType: 'header' },
'f3x-line-30a': { lineNumber: '30(a)', label: 'Allocated Federal Election Activity', indent: 1, note: 'From Schedule H6', valueType: 'header' },
'f3x-line-30ai': { lineNumber: '30(a)(i)', label: 'Federal Share', indent: 2, note: 'From Schedule H6' },
'f3x-line-30aii': { lineNumber: '30(a)(ii)', label: 'Levin Share', indent: 2 },
'f3x-line-30b': { lineNumber: '30(b)', label: 'Federal Election Activity', indent: 1, note: 'Federal Funds Only' },
'f3x-line-30c': { lineNumber: '30(c)', label: 'Total Federal Election Activity', indent: 1, calculation: 'Add 30(a)(i), 30(a)(ii), and 30(b)' },
'f3x-line-31': { lineNumber: '31', label: 'TOTAL DISBURSEMENTS', calculation: 'Add Lines 21(c), 22, 23, 24, 25, 26, 27, 28(d), 29, and 30(c)' },
'f3x-line-32': { lineNumber: '32', label: 'Total Federal Disbursements', calculation: 'Subtract Line 21(a)(ii) and Line 30(a)(ii) from Line 31' },
'f3x-line-33': { lineNumber: '33', label: 'Total Contributions', note: '(Other than loans) From Line 11(d)', linkId: 'f3x-line-11d' },
'f3x-line-34': { lineNumber: '34', label: 'Total Contribution Refunds', note: '(Other than loans) From Line 28(d)', linkId: 'f3x-line-28d' },
'f3x-line-35': { lineNumber: '35', label: 'Net Contributions', isTotal: true, calculation: 'Subtract Line 34 from Line 33' },
'f3x-line-36': { lineNumber: '36', label: 'Total Federal Operating Expenditures', calculation: 'Add Line 21(a)(i) and Line 21(b)' },
'f3x-line-37': { lineNumber: '37', label: 'Offsets to Operating Expenditures', note: 'From Line 15', linkId: 'f3x-line-15' },
'f3x-line-38': { lineNumber: '38', label: 'Net Operating Expenditures', isTotal: true, calculation: 'Subtract Line 37 from Line 36', linkId: 'f3x-line-36' },
};
