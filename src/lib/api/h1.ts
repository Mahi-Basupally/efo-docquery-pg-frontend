import { apiClient } from './client';

// Version 4+ Record (DOC_H1_VIEW)
export interface H1RecordV4 {
  transaction_id: string;
  committee_id: string;
  rep_id: number;
  image_no: number;
  rel_line_no: number;
  // Section A - State and Local Party Committees (Fixed Percentage)
  pres_only_yr: string | null;
  pres_sen_yr: string | null;
  sen_only_yr: string | null;
  non_pres_sen_yr: string | null;
  // Section B - Separate Segregated Funds and Nonconnected Committees
  fed_pct: number | null;
  nonfed_pct: number | null;
  min_fed_pct: number | null;
  admin_ratio_appl: string | null;
  gen_vd_ratio_appl: string | null;
  pub_crp_ratio_appl: string | null;
  memo_cd: string | null;
  memo_text: string | null;
  [key: string]: any;
}

// Version 3 Record (Legacy H1 table)
export interface H1RecordV3 {
  repid: number;
  rel_lineno: number;
  comid: string;
  tran_id: string;
  imageno: number;
  amend: string | null;
  // National rate
  nat_rate: number | null;
  // House/Senate minimum
  hs_min: number | null;
  hs_persupport: number | null;
  hs_pernonfed: number | null;
  hs_actsupport: number | null;
  hs_actnonfed: number | null;
  hs_actperfed: number | null;
  // SSF/Non-connected
  est_persupport: number | null;
  est_pernonfed: number | null;
  act_support: number | null;
  act_nonfed: number | null;
  act_perfed: number | null;
  // Ballot composition (State/Local Party)
  pres: string | null;
  sen: string | null;
  hse: string | null;
  subtotal: string | null;
  gov: string | null;
  other_sw: string | null;
  state_sen: string | null;
  state_rep: string | null;
  local: string | null;
  extra: string | null;
  sub: string | null;
  total: string | null;
  fed_per: number | null;
  [key: string]: any;
}

export type H1Record = H1RecordV3 | H1RecordV4;

export interface H1CommitteeDetails {
  filing_type: string;
  repid: number;
  comid: string;
  entity: string;
  cmte_name: string;
  form_type: string;
  cand_last_name: string | null;
  cand_first_name: string | null;
  cand_middle_name: string | null;
  cand_prefix_name: string | null;
  cand_suffix_name: string | null;
  street_1: string | null;
  street_2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface H1Meta {
  committeeDetails: H1CommitteeDetails | null;
  reportId: string;
  totalRecords: number;
  version: number | null;
}

export interface H1Response {
  data: H1Record[];
  meta: H1Meta;
}

export const h1Api = {
  /**
   * Get Schedule H1 allocation method data for a report
   */
  getH1Data: async (repId: string): Promise<H1Response> => {
    const url = `/h1/${repId}`;
    const response = await apiClient.get<H1Response>(url);
    return response;
  },
};

export default h1Api;