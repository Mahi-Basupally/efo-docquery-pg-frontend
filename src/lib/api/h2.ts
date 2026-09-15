import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface H2Transaction {
  transactionId?: string | null;
  event?: string | null;
  fundraisingIndicator?: string | null;
  exemptIndicator?: string | null;
  directIndicator?: string | null;
  ratioCode?: string | null;
  federalPercentage?: string | number | null;
  nonFederalPercentage?: string | number | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface H2Response {
  data: H2Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const h2Api = {
  // H2 has no real line number (see h2_service.py) - calls the line-less
  // form of the endpoint directly rather than passing a synthetic value.
  getH2Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<H2Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<H2Response>(
      `/reports/${repid}/schedules/H2${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
