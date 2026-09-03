import { apiClient } from './client';
import {
  CommitteeDetails,
  ErrorResponse
} from './types';

// Schedule C1 transaction data - properly typed for loans and lines of credit
export interface ScheduleC1Transaction {
  reportId?: string;
  lineNumber?: string;
  relatedLineNumber?: number;
  transactionId?: string;
  referenceId?: string;
  committeeId?: string;
  entityType?: string;
  lenderName?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  loanAmount?: number;
  interestRate?: string;
  dateIncurred?: string;
  dateDue?: string;
  restructured?: string;
  originalLoanDate?: string;
  creditLineSecuredAmount?: string;
  loanBalance?: number;
  othersLiable?: string;
  collateralIndicator?: string;
  collateralDescription?: string;
  collateralValue?: number;
  perfectedInterest?: string;
  futureIncomeIndicator?: string;
  futureIncomeDescription?: string;
  estimatedValue?: number;
  accountEstablishedDate?: string;
  depositorName?: string;
  depositorStreet1?: string;
  depositorStreet2?: string;
  depositorCity?: string;
  depositorState?: string;
  depositorZipCode?: string;
  accountDate?: string;
  basisOfLoanDescription?: string;
  treasurerLastName?: string;
  treasurerFirstName?: string;
  treasurerMiddleName?: string;
  treasurerPrefix?: string;
  treasurerSuffix?: string;
  treasurerSignedDate?: string;
  authorizedLastName?: string;
  authorizedFirstName?: string;
  authorizedMiddleName?: string;
  authorizedPrefix?: string;
  authorizedSuffix?: string;
  authorizedTitle?: string;
  authorizedDate?: string;
  amendmentIndicator?: string;
  imageNumber?: string;
}

// Response metadata (no pagination for C1)
export interface ScheduleC1Meta {
  reportId: string;
  lineNumber: string;
  totalRecords: number;
  committeeDetails: CommitteeDetails;
  version: number | null;
}

// Main response interface
export interface ScheduleC1Response {
  data: ScheduleC1Transaction[];
  meta: ScheduleC1Meta;
}

// Re-export shared types for convenience
export type {
  CommitteeDetails,
  ErrorResponse
};

// Schedule C1 API methods
export const scheduleC1Api = {
  /**
   * Get Schedule C1 transaction data (no pagination)
   * @param repid - Report ID
   * @param lineNum - Line number
   * @returns Promise with Schedule C1 transaction data and metadata
   */
  getScheduleC1Data: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleC1Response> => {
    const response = await apiClient.get<ScheduleC1Response>(
      `/sc1/${repid}/${lineNum}`
    );
    return response.data;
  },
};