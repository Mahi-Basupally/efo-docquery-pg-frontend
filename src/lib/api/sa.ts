import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule A transaction data - dynamic keys based on camelCase field names
export type ScheduleATransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleAMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleAResponse {
  data: ScheduleATransaction[];
  meta: ScheduleAMeta;
}

// Column metadata only response
export interface ScheduleAColumnsResponse {
  data: ScheduleColumn[];
  meta: {
    reportId: string;
    lineNumber: string;
    totalColumns: number;
  };
}

// Re-export shared types for convenience
export type {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
};

// Schedule A API methods
export const scheduleAApi = {
  /**
   * Get Schedule A transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "11AI")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule A transaction data and metadata
   */
  getScheduleAData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleAResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/sa/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleAResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule A transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "11AI")
   * @returns Promise with column metadata
   */
  getScheduleAColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleAColumnsResponse> => {
    const response = await apiClient.get<ScheduleAColumnsResponse>(
      `/sa/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
