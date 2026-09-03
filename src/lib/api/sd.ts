import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule D transaction data - dynamic keys based on camelCase field names
export type ScheduleDTransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleDMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleDResponse {
  data: ScheduleDTransaction[];
  meta: ScheduleDMeta;
}

// Column metadata only response
export interface ScheduleDColumnsResponse {
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

// Schedule D API methods
export const scheduleDApi = {
  /**
   * Get Schedule D transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "9", "10", "11", "12")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule D transaction data and metadata
   */
  getScheduleDData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleDResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/sd/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleDResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule D transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "9", "10", "11", "12")
   * @returns Promise with column metadata
   */
  getScheduleDColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleDColumnsResponse> => {
    const response = await apiClient.get<ScheduleDColumnsResponse>(
      `/sd/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
