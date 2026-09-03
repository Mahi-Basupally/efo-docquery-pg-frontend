import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule B transaction data - dynamic keys based on camelCase field names
export type ScheduleBTransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleBMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleBResponse {
  data: ScheduleBTransaction[];
  meta: ScheduleBMeta;
}

// Column metadata only response
export interface ScheduleBColumnsResponse {
  data: ScheduleColumn[];
  meta: {
    reportId: string;
    lineNumber: string;
    totalColumns: number;
  };
}

// Re-export shared types for convenience
export type { CommitteeDetails, PaginationMeta, ScheduleColumn, ErrorResponse, PaginationParams };

// Schedule B API methods
export const scheduleBApi = {
  /**
   * Get Schedule B transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "17", "18")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule B transaction data and metadata
   */
  getScheduleBData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleBResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/sb/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleBResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule B transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "17", "18")
   * @returns Promise with column metadata
   */
  getScheduleBColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleBColumnsResponse> => {
    const response = await apiClient.get<ScheduleBColumnsResponse>(
      `/sb/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
