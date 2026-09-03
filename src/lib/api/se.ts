import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule E transaction data - dynamic keys based on camelCase field names
export type ScheduleETransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleEMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleEResponse {
  data: ScheduleETransaction[];
  meta: ScheduleEMeta;
}

// Column metadata only response
export interface ScheduleEColumnsResponse {
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

// Schedule E API methods
export const scheduleEApi = {
  /**
   * Get Schedule E transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "24", "24A")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule E transaction data and metadata
   */
  getScheduleEData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleEResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/se/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleEResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule E transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "24", "24A")
   * @returns Promise with column metadata
   */
  getScheduleEColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleEColumnsResponse> => {
    const response = await apiClient.get<ScheduleEColumnsResponse>(
      `/se/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
