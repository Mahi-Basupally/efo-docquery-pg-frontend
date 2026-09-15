import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleFTransaction {
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  entityType?: string | null;
  coordinatedExpenditureIndicator?: string | null;
  designatingCommitteeId?: string | null;
  designatingCommitteeName?: string | null;
  subordinateCommitteeId?: string | null;
  subordinateCommitteeName?: string | null;
  subordinateStreetAddress1?: string | null;
  subordinateStreetAddress2?: string | null;
  subordinateCity?: string | null;
  subordinateState?: string | null;
  subordinateZipCode?: string | null;
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
  payeeCandidateId?: string | null;
  payeeCandidateLastName?: string | null;
  payeeCandidateFirstName?: string | null;
  payeeCandidateMiddleName?: string | null;
  payeeCandidatePrefix?: string | null;
  payeeCandidateSuffix?: string | null;
  payeeCandidateOffice?: string | null;
  payeeCandidateState?: string | null;
  payeeCandidateDistrict?: string | number | null;
  aggregateGeneralElectionExpenditure?: string | number | null;
  transactionDescription?: string | null;
  transactionDate?: string | null;
  amount?: string | number | null;
  payeeCommitteeId?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  categoryCode?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface ScheduleFResponse {
  data: ScheduleFTransaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleFApi = {
  getScheduleFData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleFResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleFResponse>(
      `/reports/${repid}/schedules/SF/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
