import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F91Transaction {
  controllerLastName?: string | null;
  controllerFirstName?: string | null;
  controllerMiddleName?: string | null;
  controllerPrefix?: string | null;
  controllerSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  controllerEmployer?: string | null;
  controllerOccupation?: string | null;
  transactionId?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F91Response {
  data: F91Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f91Api = {
  // F91 has no real line number (see f91_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api.
  getF91Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F91Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F91Response>(
      `/reports/${repid}/schedules/F91${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f91Api;
