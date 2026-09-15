import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleBTransaction {
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  entityType?: string | null;
  payeeName?: string | null;
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
  transactionDate?: string | null;
  amount?: string | number | null;
  semiAnnualRefundedBundledAmount?: string | number | null;
  transactionDescription?: string | null;
  categoryCode?: string | null;
  beneficiaryCommitteeId?: string | null;
  beneficiaryCommitteeName?: string | null;
  beneficiaryCandidateId?: string | null;
  beneficiaryCandidateLastName?: string | null;
  beneficiaryCandidateFirstName?: string | null;
  beneficiaryCandidateMiddleName?: string | null;
  beneficiaryCandidatePrefix?: string | null;
  beneficiaryCandidateSuffix?: string | null;
  beneficiaryCandidateOffice?: string | null;
  beneficiaryCandidateState?: string | null;
  beneficiaryCandidateDistrict?: string | number | null;
  conduitName?: string | null;
  conduitStreetAddress1?: string | null;
  conduitStreetAddress2?: string | null;
  conduitCity?: string | null;
  conduitState?: string | null;
  conduitZipCode?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  accountReferenceCode?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface ScheduleBResponse {
  data: ScheduleBTransaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleBApi = {
  getScheduleBData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleBResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleBResponse>(
      `/reports/${repid}/schedules/SB/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
