import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleCTransaction {
  transactionId?: string | null;
  entityType?: string | null;
  lenderName?: string | null;
  lenderLastName?: string | null;
  lenderFirstName?: string | null;
  lenderMiddleName?: string | null;
  lenderPrefix?: string | null;
  lenderSuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  originalAmount?: string | number | null;
  paidToDate?: string | number | null;
  balance?: string | number | null;
  dateIncurred?: string | null;
  dateDue?: string | null;
  interestRate?: string | number | null;
  securedIndicator?: string | null;
  personalFundsIndicator?: string | null;
  lenderCommitteeId?: string | null;
  lenderCandidateId?: string | null;
  lenderCandidateLastName?: string | null;
  lenderCandidateFirstName?: string | null;
  lenderCandidateMiddleName?: string | null;
  lenderCandidatePrefix?: string | null;
  lenderCandidateSuffix?: string | null;
  lenderCandidateOffice?: string | null;
  lenderCandidateState?: string | null;
  lenderCandidateDistrict?: string | number | null;
  memoCode?: string | null;
  memoText?: string | null;
  tranId?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface ScheduleCResponse {
  data: ScheduleCTransaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleCApi = {
  getScheduleCData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleCResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleCResponse>(
      `/reports/${repid}/schedules/SC/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
