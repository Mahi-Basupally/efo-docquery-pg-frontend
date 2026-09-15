import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface H4Transaction {
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
  accountEventIdentifier?: string | null;
  expenditureDate?: string | null;
  totalFederalNonFederalAmount?: string | number | null;
  federalShare?: string | number | null;
  nonFederalShare?: string | number | null;
  ytdAmount?: string | number | null;
  transactionCode?: string | null;
  expenditurePurposeDescription?: string | null;
  categoryCode?: string | null;
  // Which of the admin/fundraising/exempt/gen_vote/voter_drive/support/
  // activity_pc flags was set on the row, resolved server-side (h4_schedule.sql)
  // into one label rather than seven separate indicator columns.
  allocatedActivityEvent?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface H4Response {
  data: H4Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const h4Api = {
  // H4 has no real line number (see h4_service.py) - calls the line-less
  // form of the endpoint directly rather than passing a synthetic value.
  getH4Data: async (
    repid: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<H4Response> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<H4Response>(
      `/reports/${repid}/schedules/H4${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
