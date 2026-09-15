import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface H5Transaction {
  transactionId?: string | null;
  accountName?: string | null;
  receiptDate?: string | null;
  totalAmountTransferred?: string | number | null;
  voterRegistrationAmount?: string | number | null;
  voterIdAmount?: string | number | null;
  gotvAmount?: string | number | null;
  genericCampaignAmount?: string | number | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface H5Response {
  data: H5Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const h5Api = {
  // H5 has no real line number (see h5_service.py) - calls the line-less
  // form of the endpoint directly rather than passing a synthetic value.
  getH5Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<H5Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<H5Response>(
      `/reports/${repid}/schedules/H5${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
