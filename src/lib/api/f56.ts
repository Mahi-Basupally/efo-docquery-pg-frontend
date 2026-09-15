import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F56Transaction {
  entity?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  employer?: string | null;
  occupation?: string | null;
  contributionDate?: string | null;
  amount?: string | number | null;
  payeeCandidateId?: string | null;
  payeeCommitteeId?: string | null;
  [key: string]: unknown;
}

export interface F56Response {
  data: F56Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f56Api = {
  // F56 has no real line number (see f56_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as h1Api.
  getF56Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F56Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F56Response>(
      `/reports/${repid}/schedules/F56${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f56Api;
