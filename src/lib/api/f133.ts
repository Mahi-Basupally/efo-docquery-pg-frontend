import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F133Transaction {
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
  refundDate?: string | null;
  refundAmount?: string | number | null;
  memoCode?: string | null;
  memoText?: string | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F133Response {
  data: F133Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f133Api = {
  // F133 has no real line number (see f133_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api.
  getF133Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F133Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F133Response>(
      `/reports/${repid}/schedules/F133${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f133Api;
