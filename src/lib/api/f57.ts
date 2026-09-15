import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F57Transaction {
  entityType?: string | null;
  payeeLastName?: string | null;
  payeeFirstName?: string | null;
  payeeMiddleName?: string | null;
  payeePrefix?: string | null;
  payeeSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  expenditurePurposeDescription?: string | null;
  disseminationDate?: string | null;
  amount?: string | number | null;
  supportOpposeCode?: string | null;
  payeeCandidateId?: string | null;
  payeeCommitteeId?: string | null;
  supportOpposeCandidateId?: string | null;
  supportOpposeCandidateLastName?: string | null;
  supportOpposeCandidateFirstName?: string | null;
  supportOpposeCandidateMiddleName?: string | null;
  supportOpposeCandidatePrefix?: string | null;
  supportOpposeCandidateSuffix?: string | null;
  supportOpposeCandidateOffice?: string | null;
  supportOpposeCandidateState?: string | null;
  supportOpposeCandidateDistrict?: string | number | null;
  candidateName?: string | null;
  candidateOffice?: string | null;
  candidateState?: string | null;
  candidateDistrict?: string | number | null;
  conduitName?: string | null;
  conduitStreetAddress1?: string | null;
  conduitStreetAddress2?: string | null;
  conduitCity?: string | null;
  conduitState?: string | null;
  conduitZipCode?: string | null;
  transactionId?: string | null;
  categoryCode?: string | null;
  transactionCode?: string | null;
  yearToDate?: string | number | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F57Response {
  data: F57Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f57Api = {
  // F57 has no real line number (see f57_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api.
  getF57Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F57Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F57Response>(
      `/reports/${repid}/schedules/F57${query ? `?${query}` : ''}`      
    );
    return response.data;
  },
};

export default f57Api;
