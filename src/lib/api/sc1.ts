import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleC1Transaction {
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  entityType?: string | null;
  lenderName?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  amount?: string | number | null;
  interestRate?: string | number | null;
  dateIncurred?: string | null;
  dateDue?: string | null;
  restructuredIndicator?: string | null;
  originalLoanDate?: string | null;
  creditAmountThisDraw?: string | number | null;
  balance?: string | number | null;
  othersLiable?: string | null;
  collateralIndicator?: string | null;
  collateralDescription?: string | null;
  collateralValue?: string | number | null;
  perfectedInterestIndicator?: string | null;
  futureIncomeIndicator?: string | null;
  futureIncomeDescription?: string | null;
  estimatedValue?: string | number | null;
  depositoryAccountDate?: string | null;
  depositoryAccountName?: string | null;
  depositoryStreetAddress1?: string | null;
  depositoryStreetAddress2?: string | null;
  depositoryCity?: string | null;
  depositoryState?: string | null;
  depositoryZipCode?: string | null;
  depositoryAccountAuthDate?: string | null;
  basisOfLoanDescription?: string | null;
  treasurerLastName?: string | null;
  treasurerFirstName?: string | null;
  treasurerMiddleName?: string | null;
  treasurerPrefix?: string | null;
  treasurerSuffix?: string | null;
  treasurerSignedDate?: string | null;
  authorizedLastName?: string | null;
  authorizedFirstName?: string | null;
  authorizedMiddleName?: string | null;
  authorizedPrefix?: string | null;
  authorizedSuffix?: string | null;
  authorizedTitle?: string | null;
  authorizedSignedDate?: string | null;
  imageNumber?: number | null;
  [key: string]: unknown;
}

export interface ScheduleC1Response {
  data: ScheduleC1Transaction[];
  meta: {
    reportId: string | number;
    committeeId: string | null;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleC1Api = {
  getScheduleC1Data: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleC1Response> => {
    const queryParams = new URLSearchParams();
    queryParams.set('lineNumber', lineNum);
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const response = await apiClient.get<ScheduleC1Response>(
      `/reports/${repid}/schedules/SC1?${queryParams.toString()}`
    );
    return response.data;
  },
};
