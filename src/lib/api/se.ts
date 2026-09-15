import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleETransaction {
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
  transactionDescription?: string | null;
  transactionDate?: string | null;
  amount?: string | number | null;
  electionCode?: string | null;
  electionOtherDescription?: string | null;
  supportOpposeCandidateId?: string | null;
  supportOpposeCandidateLastName?: string | null;
  supportOpposeCandidateFirstName?: string | null;
  supportOpposeCandidateMiddleName?: string | null;
  supportOpposeCandidatePrefix?: string | null;
  supportOpposeCandidateSuffix?: string | null;
  supportOpposeCandidateOffice?: string | null;
  supportOpposeCandidateState?: string | null;
  supportOpposeCandidateDistrict?: string | number | null;
  payeeCommitteeId?: string | null;
  supportOpposeCode?: string | null;
  completingLastName?: string | null;
  completingFirstName?: string | null;
  completingMiddleName?: string | null;
  completingPrefix?: string | null;
  completingSuffix?: string | null;
  signedDate?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  categoryCode?: string | null;
  transactionCode?: string | null;
  ytdAmount?: string | number | null;
  imageNumber?: number | null;
  createdDate?: string | null;
  disseminationDate?: string | null;
  [key: string]: unknown;
}

export interface ScheduleEResponse {
  data: ScheduleETransaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleEApi = {
  getScheduleEData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleEResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleEResponse>(
      `/reports/${repid}/schedules/SE/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
