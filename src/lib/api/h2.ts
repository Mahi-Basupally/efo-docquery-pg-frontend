import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// H2 transaction data - dynamic keys based on camelCase field names
export type H2Transaction = Record<string, string | number | null>;

// Response metadata
export interface H2Meta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface H2Response {
  data: H2Transaction[];
  meta: H2Meta;
}

// Column metadata only response
export interface H2ColumnsResponse {
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

// H2 API methods
export const h2Api = {
  /**
   * Get H2 transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with H2 transaction data and metadata
   */
  getH2Data: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<H2Response> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/h2/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<H2Response>(url);
    return response.data;
  },

  /**
   * Get column metadata for H2 transactions
   * @param repid - Report ID
   * @param lineNum - Line number
   * @returns Promise with column metadata
   */
  getH2Columns: async (
    repid: string,
    lineNum: string
  ): Promise<H2ColumnsResponse> => {
    const response = await apiClient.get<H2ColumnsResponse>(
      `/h2/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};