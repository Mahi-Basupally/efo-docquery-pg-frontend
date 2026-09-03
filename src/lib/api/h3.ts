import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// H3 transaction data - dynamic keys based on camelCase field names
export type H3Transaction = Record<string, string | number | null>;

// Response metadata
export interface H3Meta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface H3Response {
  data: H3Transaction[];
  meta: H3Meta;
}

// Column metadata only response
export interface H3ColumnsResponse {
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

// H3 API methods
export const h3Api = {
  /**
   * Get H3 transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with H3 transaction data and metadata
   */
  getH3Data: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<H3Response> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/h3/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<H3Response>(url);
    return response.data;
  },

  /**
   * Get column metadata for H3 transactions
   * @param repid - Report ID
   * @param lineNum - Line number
   * @returns Promise with column metadata
   */
  getH3Columns: async (
    repid: string,
    lineNum: string
  ): Promise<H3ColumnsResponse> => {
    const response = await apiClient.get<H3ColumnsResponse>(
      `/h3/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};