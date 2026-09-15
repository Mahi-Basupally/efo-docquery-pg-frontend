import { apiClient } from './client';
import type { PaginationMeta } from './types';

// Older filings ("V3" layout in H1/page.tsx) - efo.h1's nat_rate/hs_*/
// est_*/act_*/pres/sen/hse/subtotal/gov/other_sw/state_*/local/extra/sub/
// total columns, camelCased by h1_service.py's FIELD_MAP.
export interface H1RecordV3 {
  transactionId: string | null;
  memoCode: string | null;
  memoText: string | null;
  nationalPartyRate: number | null;
  houseSenateMinimumPercentage: number | null;
  houseSenatePercentFederalSupport: number | null;
  houseSenatePercentNonFederal: number | null;
  houseSenateActualFederalSupport: number | null;
  houseSenateActualNonFederal: number | null;
  houseSenateActualPercentFederal: number | null;
  estimatedPercentFederalSupport: number | null;
  estimatedPercentNonFederal: number | null;
  actualFederalSupport: number | null;
  actualNonFederal: number | null;
  actualPercentFederal: number | null;
  presidential: string | null;
  senate: string | null;
  house: string | null;
  subtotal: string | null;
  governor: string | null;
  otherStatewide: string | null;
  stateSenate: string | null;
  stateRepresentative: string | null;
  local: string | null;
  extra: string | null;
  subTotal: string | null;
  total: string | null;
  federalPercentage: string | number | null;
  [key: string]: unknown;
}

// Newer filings ("V4+" layout in H1/page.tsx) - efo.h1's slp_*/federal/
// non_federal/admin_ratio/gen_vd_ratio/pub_crp_ratio columns, camelCased
// by h1_service.py's FIELD_MAP.
export interface H1RecordV4 {
  transactionId: string | null;
  memoCode: string | null;
  memoText: string | null;
  presidentialOnlyYear: string | null;
  presidentialSenateYear: string | null;
  senateOnlyYear: string | null;
  nonPresidentialSenateYear: string | null;
  federalPercentage: string | number | null;
  nonFederalPercentage: string | number | null;
  administrativeRatioApplicable: string | null;
  genericVoterDriveRatioApplicable: string | null;
  publicCommunicationsRatioApplicable: string | null;
  [key: string]: unknown;
}

export type H1Record = H1RecordV3 | H1RecordV4;

export interface H1Response {
  data: H1Record[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    version: number | null;
    pagination: PaginationMeta;
  };
}

export const h1Api = {
  // H1 has no real line number (see h1_service.py) - calls the line-less
  // form of the endpoint directly rather than passing a synthetic value.
  getH1Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<H1Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<H1Response>(
      `/reports/${repid}/schedules/H1${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default h1Api;
