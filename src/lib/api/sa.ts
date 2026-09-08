import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleATransaction {
  filerCommitteeId?: string | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  entityType?: string | null;
  contributorName?: string | null;
  contributorLastName?: string | null;
  contributorFirstName?: string | null;
  contributorMiddleName?: string | null;
  contributorPrefix?: string | null;
  contributorSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  transactionDate?: string | null;
  amount?: string | number | null;
  ytdAmount?: string | number | null;
  isLimit?: string | boolean | null;
  transactionDescription?: string | null;
  employer?: string | null;
  occupation?: string | null;
  donorCommitteeId?: string | null;
  donorCommitteeName?: string | null;
  donorCandidateId?: string | null;
  donorCandidateLastName?: string | null;
  donorCandidateFirstName?: string | null;
  donorCandidateMiddleName?: string | null;
  donorCandidatePrefix?: string | null;
  donorCandidateSuffix?: string | null;
  donorCandidateOffice?: string | null;
  donorCandidateState?: string | null;
  donorCandidateDistrict?: string | number | null;
  conduitName?: string | null;
  conduitStreetAddress1?: string | null;
  conduitStreetAddress2?: string | null;
  conduitCity?: string | null;
  conduitState?: string | null;
  conduitZipCode?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  accountReferenceCode?: string | null;
  [key: string]: unknown;
}

export interface ScheduleAResponse {
  data: ScheduleATransaction[];
  meta: {
    reportId: string | number;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleAApi = {
  getScheduleAData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleAResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleAResponse>(
      `/sa/${repid}/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
