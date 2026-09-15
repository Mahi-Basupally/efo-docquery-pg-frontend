import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F65Transaction {
  entityType?: string | null;
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
  employer?: string | null;
  occupation?: string | null;
  contributionDate?: string | null;
  amount?: string | number | null;
  contributorCandidateId?: string | null;
  contributorCommitteeId?: string | null;
  transactionId?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F65Response {
  data: F65Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f65Api = {
  // F65 has no real line number (see f65_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api.
  getF65Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F65Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F65Response>(
      `/reports/${repid}/schedules/F65${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f65Api;
