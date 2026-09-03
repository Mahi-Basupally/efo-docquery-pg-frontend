import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// H6 transaction data - dynamic keys based on camelCase field names
export type H6Transaction = Record<string, string | number | null>;

// Response metadata
export interface H6Meta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface H6Response {
  data: H6Transaction[];
  meta: H6Meta;
}

// Column metadata only response
export interface H6ColumnsResponse {
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

// H6 API methods
export const h6Api = {
  /**
   * Get H6 transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with H6 transaction data and metadata
   */
  getH6Data: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<H6Response> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/h6/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<H6Response>(url);
    return response.data;
  },

  /**
   * Get column metadata for H6 transactions
   * @param repid - Report ID
   * @param lineNum - Line number
   * @returns Promise with column metadata
   */
  getH6Columns: async (
    repid: string,
    lineNum: string
  ): Promise<H6ColumnsResponse> => {
    const response = await apiClient.get<H6ColumnsResponse>(
      `/h6/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};