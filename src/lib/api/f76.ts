import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface F76Transaction {
  communicationType?: string | null;
  communicationTypeOtherDescription?: string | null;
  communicationClass?: string | null;
  communicationDate?: string | null;
  supportOpposeCode?: string | null;
  supportOpposeCandidateId?: string | null;
  supportOpposeCandidateLastName?: string | null;
  supportOpposeCandidateFirstName?: string | null;
  supportOpposeCandidateMiddleName?: string | null;
  supportOpposeCandidatePrefix?: string | null;
  supportOpposeCandidateSuffix?: string | null;
  supportOpposeCandidateOffice?: string | null;
  supportOpposeCandidateState?: string | null;
  supportOpposeCandidateDistrict?: string | number | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  communicationCost?: string | number | null;
  transactionId?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface F76Response {
  data: F76Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const f76Api = {
  // F76 has no real line number (see f76_service.py's FIXED_LINE_NUMBER) -
  // calls the line-less form of the endpoint directly, same as f56Api/f57Api/f65Api.
  getF76Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F76Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<F76Response>(
      `/reports/${repid}/schedules/F76${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};

export default f76Api;
