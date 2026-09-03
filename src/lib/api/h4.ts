import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// H4 transaction data - dynamic keys based on camelCase field names
export type H4Transaction = Record<string, string | number | null>;

// Response metadata
export interface H4Meta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface H4Response {
  data: H4Transaction[];
  meta: H4Meta;
}

// Column metadata only response
export interface H4ColumnsResponse {
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

// H4 API methods
export const h4Api = {
  /**
   * Get H4 transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with H4 transaction data and metadata
   */
  getH4Data: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<H4Response> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/h4/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<H4Response>(url);
    return response.data;
  },

  /**
   * Get column metadata for H4 transactions
   * @param repid - Report ID
   * @param lineNum - Line number
   * @returns Promise with column metadata
   */
  getH4Columns: async (
    repid: string,
    lineNum: string
  ): Promise<H4ColumnsResponse> => {
    const response = await apiClient.get<H4ColumnsResponse>(
      `/h4/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
