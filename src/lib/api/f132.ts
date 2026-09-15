import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F132Transaction {
  entityType?: string | null;
  contributorOrganizationName?: string | null;
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
  donationDate?: string | null;
  donationAmount?: string | number | null;
  donationAggregateAmount?: string | number | null;
  memoCode?: string | null;
  memoText?: string | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F132Response {
  data: F132Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f132Api = {
  // F132 has no real line number (see f132_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api.
  getF132Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F132Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F132Response>(
      `/reports/${repid}/schedules/F132${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f132Api;
