import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface H6Transaction {
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  entityType?: string | null;
  payeeName?: string | null;
  payeeLastName?: string | null;
  payeeFirstName?: string | null;
  payeeMiddleName?: string | null;
  payeePrefix?: string | null;
  payeeSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  categoryCode?: string | null;
  transactionCode?: string | null;
  accountEventIdentifier?: string | null;
  expenditureDate?: string | null;
  totalFederalLevinAmount?: string | number | null;
  federalShare?: string | number | null;
  levinShare?: string | number | null;
  voterRegistrationIndicator?: string | null;
  gotvIndicator?: string | null;
  voterIdIndicator?: string | null;
  genericCampaignIndicator?: string | null;
  ytdAmount?: string | number | null;
  expenditureDescription?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface H6Response {
  data: H6Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const h6Api = {
  // H6 has no real line number (see h6_service.py) - calls the line-less
  // form of the endpoint directly rather than passing a synthetic value.
  getH6Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<H6Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<H6Response>(
      `/reports/${repid}/schedules/H6${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
