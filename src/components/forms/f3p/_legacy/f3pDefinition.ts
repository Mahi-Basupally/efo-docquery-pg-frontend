/**
 * F3P line presentation metadata, generated from
 * GET /api/v1/ui/form-definition?schema=EFO&tableName=F3P
 * (app/services/ui_service.py, sourced from efo.ref_summary_line_num_desc).
 * Regenerate from that endpoint rather than hand-editing.
 *
 * F3P's Summary/Net Election Cycle-to-Date lines aren't in this table (they
 * come from efo.f3p's own cash-on-hand/totals columns - see f3p_service.py),
 * so they have no entries here.
 */

export interface F3PLineDefinition {
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

export const F3P_LINE_DEFINITIONS: Record<string, F3PLineDefinition> = {
  'f3p-line-16': { lineNumber: '16', label: 'FEDERAL FUNDS (Itemize on Schedule A-P)' },
  'f3p-line-17': { lineNumber: '17', label: 'CONTRIBUTIONS (other than loans) FROM:', valueType: 'header' },
  'f3p-line-17a': { lineNumber: '17(a)', label: 'Individuals/Persons Other Than Political Committees', indent: 1, valueType: 'header' },
  'f3p-line-17ai': { lineNumber: '17(a)(i)', label: 'itemized', indent: 2, hasSchedule: true, scheduleType: 'SA' },
  'f3p-line-17aii': { lineNumber: '17(a)(ii)', label: 'unitemized', indent: 2 },
  'f3p-line-17aiii': { lineNumber: '17(a)(iii)', label: 'Total contributions', indent: 2, isTotal: true },
  'f3p-line-17b': { lineNumber: '17(b)', label: 'Political Party Committees', indent: 1 },
  'f3p-line-17c': { lineNumber: '17(c)', label: 'Other Political Committees', indent: 1 },
  'f3p-line-17d': { lineNumber: '17(d)', label: 'The Candidate', indent: 1 },
  'f3p-line-17e': { lineNumber: '17(e)', label: 'Total Contributions (other than loans)', indent: 1, isTotal: true, calculation: 'Add 17(a), 17(b), 17(c) and 17(d)' },
  'f3p-line-18': { lineNumber: '18', label: 'TRANSFERS FROM OTHER AUTHORIZED COMMITTEES' },
  'f3p-line-19': { lineNumber: '19', label: 'LOANS RECEIVED:', valueType: 'header' },
  'f3p-line-19a': { lineNumber: '19(a)', label: 'Loans Received From or Guaranteed by Candidate', indent: 1 },
  'f3p-line-19b': { lineNumber: '19(b)', label: 'Other Loans', indent: 1 },
  'f3p-line-19c': { lineNumber: '19(c)', label: 'TOTAL LOANS', indent: 1, isTotal: true, calculation: 'Add 19(a) and 19(b)' },
  'f3p-line-20': { lineNumber: '20', label: 'OFFSETS TO EXPENDITURES (Refunds, Rebates, etc.):', valueType: 'header' },
  'f3p-line-20a': { lineNumber: '20(a)', label: 'Operating', indent: 1 },
  'f3p-line-20b': { lineNumber: '20(b)', label: 'Fundraising', indent: 1 },
  'f3p-line-20c': { lineNumber: '20(c)', label: 'Legal and Accounting', indent: 1 },
  'f3p-line-20d': { lineNumber: '20(d)', label: 'TOTAL OFFSETS TO EXPENDITURES', indent: 1, isTotal: true, calculation: 'Add 20(a), 20(b) and 20(c)' },
  'f3p-line-21': { lineNumber: '21', label: 'OTHER RECEIPTS (Dividends, Interest, etc.)' },
  'f3p-line-22': { lineNumber: '22', label: 'TOTAL RECEIPTS', isTotal: true, calculation: 'Add 16, 17(e), 18, 19(c), 20(d) and 21' },
  'f3p-line-23': { lineNumber: '23', label: 'OPERATING EXPENDITURES', hasSchedule: true, scheduleType: 'SB' },
  'f3p-line-24': { lineNumber: '24', label: 'TRANSFERS TO OTHER AUTHORIZED COMMITTEES' },
  'f3p-line-25': { lineNumber: '25', label: 'FUNDRAISING DISBURSEMENTS' },
  'f3p-line-26': { lineNumber: '26', label: 'EXEMPT LEGAL AND ACCOUNTING DISBURSEMENTS' },
  'f3p-line-27': { lineNumber: '27', label: 'LOAN REPAYMENTS MADE:', valueType: 'header' },
  'f3p-line-27a': { lineNumber: '27(a)', label: 'Repayments of Loans made or Guaranteed by Candidate', indent: 1 },
  'f3p-line-27b': { lineNumber: '27(b)', label: 'Other Repayments', indent: 1 },
  'f3p-line-27c': { lineNumber: '27(c)', label: 'TOTAL LOAN REPAYMENTS MADE', indent: 1, isTotal: true, calculation: 'Add 27(a) and 27(b)' },
  'f3p-line-28': { lineNumber: '28', label: 'REFUNDS OF CONTRIBUTIONS TO:', valueType: 'header' },
  'f3p-line-28a': { lineNumber: '28(a)', label: 'Individuals/Persons Other Than Political Committees', indent: 1 },
  'f3p-line-28b': { lineNumber: '28(b)', label: 'Political Party Committees', indent: 1 },
  'f3p-line-28c': { lineNumber: '28(c)', label: 'Other Political Committees', indent: 1 },
  'f3p-line-28d': { lineNumber: '28(d)', label: 'TOTAL CONTRIBUTION REFUNDS', indent: 1, isTotal: true, calculation: 'Add 28(a), 28(b) and 28(c)' },
  'f3p-line-29': { lineNumber: '29', label: 'OTHER DISBURSEMENTS' },
  'f3p-line-30': { lineNumber: '30', label: 'TOTAL DISBURSEMENTS', isTotal: true, calculation: 'Add 23, 24, 25, 26, 27(c), 28(d) and 29' },
  'f3p-line-31': { lineNumber: '31', label: 'ITEMS ON HAND TO BE LIQUIDATED (Attach List)' },
  'f3p-line-al': { label: 'Alabama' },
  'f3p-line-ak': { label: 'Alaska' },
  'f3p-line-az': { label: 'Arizona' },
  'f3p-line-ar': { label: 'Arkansas' },
  'f3p-line-ca': { label: 'California' },
  'f3p-line-co': { label: 'Colorado' },
  'f3p-line-ct': { label: 'Connecticut' },
  'f3p-line-de': { label: 'Delaware' },
  'f3p-line-dc': { label: 'District Of Columbia' },
  'f3p-line-fl': { label: 'Florida' },
  'f3p-line-ga': { label: 'Georgia' },
  'f3p-line-hi': { label: 'Hawaii' },
  'f3p-line-id': { label: 'Idaho' },
  'f3p-line-il': { label: 'Illinois' },
  'f3p-line-in': { label: 'Indiana' },
  'f3p-line-ia': { label: 'Iowa' },
  'f3p-line-ks': { label: 'Kansas' },
  'f3p-line-ky': { label: 'Kentucky' },
  'f3p-line-la': { label: 'Louisiana' },
  'f3p-line-me': { label: 'Maine' },
  'f3p-line-md': { label: 'Maryland' },
  'f3p-line-ma': { label: 'Massachusetts' },
  'f3p-line-mi': { label: 'Michigan' },
  'f3p-line-mn': { label: 'Minnesota' },
  'f3p-line-ms': { label: 'Mississippi' },
  'f3p-line-mo': { label: 'Missouri' },
  'f3p-line-mt': { label: 'Montana' },
  'f3p-line-ne': { label: 'Nebraska' },
  'f3p-line-nv': { label: 'Nevada' },
  'f3p-line-nh': { label: 'New Hampshire' },
  'f3p-line-nj': { label: 'New Jersey' },
  'f3p-line-nm': { label: 'New Mexico' },
  'f3p-line-ny': { label: 'New York' },
  'f3p-line-nc': { label: 'North Carolina' },
  'f3p-line-nd': { label: 'North Dakota' },
  'f3p-line-oh': { label: 'Ohio' },
  'f3p-line-ok': { label: 'Oklahoma' },
  'f3p-line-or': { label: 'Oregon' },
  'f3p-line-pa': { label: 'Pennsylvania' },
  'f3p-line-ri': { label: 'Rhode Island' },
  'f3p-line-sc': { label: 'South Carolina' },
  'f3p-line-sd': { label: 'South Dakota' },
  'f3p-line-tn': { label: 'Tennessee' },
  'f3p-line-tx': { label: 'Texas' },
  'f3p-line-ut': { label: 'Utah' },
  'f3p-line-vt': { label: 'Vermont' },
  'f3p-line-va': { label: 'Virginia' },
  'f3p-line-wa': { label: 'Washington' },
  'f3p-line-wv': { label: 'West Virginia' },
  'f3p-line-wi': { label: 'Wisconsin' },
  'f3p-line-wy': { label: 'Wyoming' },
  'f3p-line-pr': { label: 'Puerto Rico' },
  'f3p-line-gu': { label: 'Guam' },
  'f3p-line-vi': { label: 'Virgin Islands' },
  'f3p-line-': { label: 'Totals' },
};
