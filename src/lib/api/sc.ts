import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule C transaction data - dynamic keys based on camelCase field names
export type ScheduleCTransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleCMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleCResponse {
  data: ScheduleCTransaction[];
  meta: ScheduleCMeta;
}

// Column metadata only response
export interface ScheduleCColumnsResponse {
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

// Schedule C API methods
export const scheduleCApi = {
  /**
   * Get Schedule C transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "9", "10", "11", "12")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule C transaction data and metadata
   */
  getScheduleCData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleCResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/sc/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleCResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule C transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "9", "10", "11", "12")
   * @returns Promise with column metadata
   */
  getScheduleCColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleCColumnsResponse> => {
    const response = await apiClient.get<ScheduleCColumnsResponse>(
      `/sc/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
