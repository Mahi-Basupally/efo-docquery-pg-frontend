import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleDTransaction {
  transactionId?: string | null;
  entityType?: string | null;
  creditorName?: string | null;
  creditorLastName?: string | null;
  creditorFirstName?: string | null;
  creditorMiddleName?: string | null;
  creditorPrefix?: string | null;
  creditorSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  natureOfDebt?: string | null;
  beginningBalance?: string | number | null;
  incurredAmount?: string | number | null;
  paymentAmount?: string | number | null;
  balance?: string | number | null;
  creditorCommitteeId?: string | null;
  creditorCandidateId?: string | null;
  creditorCandidateLastName?: string | null;
  creditorCandidateOffice?: string | null;
  creditorCandidateState?: string | null;
  creditorCandidateDistrict?: string | number | null;
  conduitName?: string | null;
  conduitStreetAddress1?: string | null;
  conduitStreetAddress2?: string | null;
  conduitCity?: string | null;
  conduitState?: string | null;
  conduitZipCode?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface ScheduleDResponse {
  data: ScheduleDTransaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleDApi = {
  getScheduleDData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleDResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleDResponse>(
      `/reports/${repid}/schedules/SD/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
