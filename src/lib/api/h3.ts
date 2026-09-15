import { apiClient } from './client';
import type { PaginationMeta } from './types';

// h3_service.py's FIELD_MAP, camelCased.
export interface H3Transaction {
  accountName: string | null;
  event: string | null;
  eventType: string | null;
  receiptDate: string | null;
  transferAmount: number | string | null;
  totalAmountTransferred: number | string | null;
  memoCode: string | null;
  memoText: string | null;
  [key: string]: unknown;
}

export interface H3Response {
  data: H3Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const h3Api = {
  // H3 has no real line number (see h3_service.py) - calls the line-less
  // form of the endpoint directly rather than passing a synthetic value.
  getH3Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<H3Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<H3Response>(
      `/reports/${repid}/schedules/H3${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default h3Api;
