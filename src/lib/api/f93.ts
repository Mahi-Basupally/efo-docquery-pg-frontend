import { apiClient } from './client';
import type { PaginationMeta } from './types';

// Form 94 (candidate identification) has no standalone page of its own -
// its rows are attached inline to their parent F93 transaction below
// (f93_service.py joins on f94.br_tran_id = f93.tran_id server-side).
export interface F93LinkedCandidate {
  candidateId?: string | null;
  candidateLastName?: string | null;
  candidateFirstName?: string | null;
  candidateMiddleName?: string | null;
  candidatePrefix?: string | null;
  candidateSuffix?: string | null;
  candidateOffice?: string | null;
  candidateState?: string | null;
  candidateDistrict?: string | number | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F93Transaction {
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
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  expenditureDate?: string | null;
  amount?: string | number | null;
  expenditurePurposeDescription?: string | null;
  payeeEmployer?: string | null;
  payeeOccupation?: string | null;
  communicationDate?: string | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  imageNumber?: number | null;
  candidates?: F93LinkedCandidate[];
  [key: string]: unknown;
}

export interface F93Response {
  data: F93Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f93Api = {
  // F93 has no real line number (see f93_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api.
  getF93Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F93Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F93Response>(
      `/reports/${repid}/schedules/F93${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f93Api;
