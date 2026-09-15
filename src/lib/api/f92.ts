import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F92Transaction {
  entityType?: string | null;
  donorLastName?: string | null;
  donorFirstName?: string | null;
  donorMiddleName?: string | null;
  donorPrefix?: string | null;
  donorSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  employer?: string | null;
  occupation?: string | null;
  yearToDate?: string | number | null;
  receiptDate?: string | null;
  amount?: string | number | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  [key: string]: unknown;
}

export interface F92Response {
  data: F92Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f92Api = {
  // F92 has no real line number (see f92_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api.
  getF92Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F92Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F92Response>(
      `/reports/${repid}/schedules/F92${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f92Api;
