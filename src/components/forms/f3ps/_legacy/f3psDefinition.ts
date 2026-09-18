/**
 * F3PS line presentation metadata, generated from
 * GET /api/v1/ui/form-definition?schema=EFO&tableName=F3PS
 * (app/services/ui_service.py, sourced from efo.ref_summary_line_num_desc).
 * Regenerate from that endpoint rather than hand-editing.
 *
 * F3PS's Summary/Net Election Cycle-to-Date lines aren't in this table
 * (they come from efo.f3p's own cash-on-hand/totals columns - see
 * f3ps_service.py), so they have no entries here.
 */

export interface F3PSLineDefinition {
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

export const F3PS_LINE_DEFINITIONS: Record<string, F3PSLineDefinition> = {
  'f3ps-line-16': { lineNumber: '16', label: 'FEDERAL FUNDS (Itemize on Schedule A-P)' },
  'f3ps-line-17': { lineNumber: '17', label: 'CONTRIBUTIONS (other than loans) FROM:', valueType: 'header' },
  'f3ps-line-17a': { lineNumber: '17(a)', label: 'Individuals/Persons Other Than Political Committees', indent: 1, valueType: 'header' },
  'f3ps-line-17ai': { lineNumber: '17(a)(i)', label: 'itemized', indent: 2, hasSchedule: true, scheduleType: 'SA' },
  'f3ps-line-17aii': { lineNumber: '17(a)(ii)', label: 'unitemized', indent: 2 },
  'f3ps-line-17aiii': { lineNumber: '17(a)(iii)', label: 'Total contributions', indent: 2, isTotal: true },
  'f3ps-line-17b': { lineNumber: '17(b)', label: 'Political Party Committees', indent: 1 },
  'f3ps-line-17c': { lineNumber: '17(c)', label: 'Other Political Committees', indent: 1 },
  'f3ps-line-17d': { lineNumber: '17(d)', label: 'The Candidate', indent: 1 },
  'f3ps-line-17e': { lineNumber: '17(e)', label: 'Total Contributions (other than loans)', indent: 1, isTotal: true, calculation: 'Add 17(a), 17(b), 17(c) and 17(d)' },
  'f3ps-line-18': { lineNumber: '18', label: 'TRANSFERS FROM OTHER AUTHORIZED COMMITTEES' },
  'f3ps-line-19': { lineNumber: '19', label: 'LOANS RECEIVED:', valueType: 'header' },
  'f3ps-line-19a': { lineNumber: '19(a)', label: 'Loans Received From or Guaranteed by Candidate', indent: 1 },
  'f3ps-line-19b': { lineNumber: '19(b)', label: 'Other Loans', indent: 1 },
  'f3ps-line-19c': { lineNumber: '19(c)', label: 'TOTAL LOANS', indent: 1, isTotal: true, calculation: 'Add 19(a) and 19(b)' },
  'f3ps-line-20': { lineNumber: '20', label: 'OFFSETS TO EXPENDITURES (Refunds, Rebates, etc.):', valueType: 'header' },
  'f3ps-line-20a': { lineNumber: '20(a)', label: 'Operating', indent: 1 },
  'f3ps-line-20b': { lineNumber: '20(b)', label: 'Fundraising', indent: 1 },
  'f3ps-line-20c': { lineNumber: '20(c)', label: 'Legal and Accounting', indent: 1 },
  'f3ps-line-20d': { lineNumber: '20(d)', label: 'TOTAL OFFSETS TO EXPENDITURES', indent: 1, isTotal: true, calculation: 'Add 20(a), 20(b) and 20(c)' },
  'f3ps-line-21': { lineNumber: '21', label: 'OTHER RECEIPTS (Dividends, Interest, etc.)' },
  'f3ps-line-22': { lineNumber: '22', label: 'TOTAL RECEIPTS', isTotal: true, calculation: 'Add 16, 17(e), 18, 19(c), 20(d) and 21' },
  'f3ps-line-23': { lineNumber: '23', label: 'OPERATING EXPENDITURES', hasSchedule: true, scheduleType: 'SB' },
  'f3ps-line-24': { lineNumber: '24', label: 'TRANSFERS TO OTHER AUTHORIZED COMMITTEES' },
  'f3ps-line-25': { lineNumber: '25', label: 'FUNDRAISING DISBURSEMENTS' },
  'f3ps-line-26': { lineNumber: '26', label: 'EXEMPT LEGAL AND ACCOUNTING DISBURSEMENTS' },
  'f3ps-line-27': { lineNumber: '27', label: 'LOAN REPAYMENTS MADE:', valueType: 'header' },
  'f3ps-line-27a': { lineNumber: '27(a)', label: 'Repayments of Loans made or Guaranteed by Candidate', indent: 1 },
  'f3ps-line-27b': { lineNumber: '27(b)', label: 'Other Repayments', indent: 1 },
  'f3ps-line-27c': { lineNumber: '27(c)', label: 'TOTAL LOAN REPAYMENTS MADE', indent: 1, isTotal: true, calculation: 'Add 27(a) and 27(b)' },
  'f3ps-line-28': { lineNumber: '28', label: 'REFUNDS OF CONTRIBUTIONS TO:', valueType: 'header' },
  'f3ps-line-28a': { lineNumber: '28(a)', label: 'Individuals/Persons Other Than Political Committees', indent: 1 },
  'f3ps-line-28b': { lineNumber: '28(b)', label: 'Political Party Committees', indent: 1 },
  'f3ps-line-28c': { lineNumber: '28(c)', label: 'Other Political Committees', indent: 1 },
  'f3ps-line-28d': { lineNumber: '28(d)', label: 'TOTAL CONTRIBUTION REFUNDS', indent: 1, isTotal: true, calculation: 'Add 28(a), 28(b) and 28(c)' },
  'f3ps-line-29': { lineNumber: '29', label: 'OTHER DISBURSEMENTS' },
  'f3ps-line-30': { lineNumber: '30', label: 'TOTAL DISBURSEMENTS', isTotal: true, calculation: 'Add 23, 24, 25, 26, 27(c), 28(d) and 29' },
  'f3ps-line-31': { lineNumber: '31', label: 'ITEMS ON HAND TO BE LIQUIDATED (Attach List)' },
  'f3ps-line-al': { label: 'Alabama' },
  'f3ps-line-ak': { label: 'Alaska' },
  'f3ps-line-az': { label: 'Arizona' },
  'f3ps-line-ar': { label: 'Arkansas' },
  'f3ps-line-ca': { label: 'California' },
  'f3ps-line-co': { label: 'Colorado' },
  'f3ps-line-ct': { label: 'Connecticut' },
  'f3ps-line-de': { label: 'Delaware' },
  'f3ps-line-dc': { label: 'District Of Columbia' },
  'f3ps-line-fl': { label: 'Florida' },
  'f3ps-line-ga': { label: 'Georgia' },
  'f3ps-line-hi': { label: 'Hawaii' },
  'f3ps-line-id': { label: 'Idaho' },
  'f3ps-line-il': { label: 'Illinois' },
  'f3ps-line-in': { label: 'Indiana' },
  'f3ps-line-ia': { label: 'Iowa' },
  'f3ps-line-ks': { label: 'Kansas' },
  'f3ps-line-ky': { label: 'Kentucky' },
  'f3ps-line-la': { label: 'Louisiana' },
  'f3ps-line-me': { label: 'Maine' },
  'f3ps-line-md': { label: 'Maryland' },
  'f3ps-line-ma': { label: 'Massachusetts' },
  'f3ps-line-mi': { label: 'Michigan' },
  'f3ps-line-mn': { label: 'Minnesota' },
  'f3ps-line-ms': { label: 'Mississippi' },
  'f3ps-line-mo': { label: 'Missouri' },
  'f3ps-line-mt': { label: 'Montana' },
  'f3ps-line-ne': { label: 'Nebraska' },
  'f3ps-line-nv': { label: 'Nevada' },
  'f3ps-line-nh': { label: 'New Hampshire' },
  'f3ps-line-nj': { label: 'New Jersey' },
  'f3ps-line-nm': { label: 'New Mexico' },
  'f3ps-line-ny': { label: 'New York' },
  'f3ps-line-nc': { label: 'North Carolina' },
  'f3ps-line-nd': { label: 'North Dakota' },
  'f3ps-line-oh': { label: 'Ohio' },
  'f3ps-line-ok': { label: 'Oklahoma' },
  'f3ps-line-or': { label: 'Oregon' },
  'f3ps-line-pa': { label: 'Pennsylvania' },
  'f3ps-line-ri': { label: 'Rhode Island' },
  'f3ps-line-sc': { label: 'South Carolina' },
  'f3ps-line-sd': { label: 'South Dakota' },
  'f3ps-line-tn': { label: 'Tennessee' },
  'f3ps-line-tx': { label: 'Texas' },
  'f3ps-line-ut': { label: 'Utah' },
  'f3ps-line-vt': { label: 'Vermont' },
  'f3ps-line-va': { label: 'Virginia' },
  'f3ps-line-wa': { label: 'Washington' },
  'f3ps-line-wv': { label: 'West Virginia' },
  'f3ps-line-wi': { label: 'Wisconsin' },
  'f3ps-line-wy': { label: 'Wyoming' },
  'f3ps-line-pr': { label: 'Puerto Rico' },
  'f3ps-line-gu': { label: 'Guam' },
  'f3ps-line-vi': { label: 'Virgin Islands' },
  'f3ps-line-': { label: 'Totals' },
};
