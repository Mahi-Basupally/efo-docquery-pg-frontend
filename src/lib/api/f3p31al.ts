import { apiClient } from './client';
import type { PaginationMeta } from './types';

// f3p31al_service.py's FIELD_MAP, camelCased.
export interface F3P31ALTransaction {
  entityType: string | null;
  contributorLastName: string | null;
  contributorFirstName: string | null;
  contributorMiddleName: string | null;
  contributorPrefix: string | null;
  contributorSuffix: string | null;
  streetAddress1: string | null;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  electionCode: string | null;
  employer: string | null;
  occupation: string | null;
  contributionDate: string | null;
  amount: number | string | null;
  reportCode: string | null;
  transactionDescription: string | null;
  memoCode: string | null;
  memoText: string | null;
  transactionId: string | null;
  imageNumber: number | null;
  [key: string]: unknown;
}

export interface F3P31ALResponse {
  data: F3P31ALTransaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f3p31alApi = {
  // F3P31AL has no real line number (see f3p31al_service.py) - calls the
  // line-less form of the endpoint directly rather than passing a synthetic
  // value.
  getF3P31ALData: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F3P31ALResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F3P31ALResponse>(
      `/reports/${repid}/schedules/F3P31AL${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f3p31alApi;
