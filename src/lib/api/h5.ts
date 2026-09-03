import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// H5 transaction data - dynamic keys based on camelCase field names
export type H5Transaction = Record<string, string | number | null>;

// Response metadata
export interface H5Meta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface H5Response {
  data: H5Transaction[];
  meta: H5Meta;
}

// Column metadata only response
export interface H5ColumnsResponse {
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

// H5 API methods
export const h5Api = {
  /**
   * Get H5 transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with H5 transaction data and metadata
   */
  getH5Data: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<H5Response> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/h5/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<H5Response>(url);
    return response.data;
  },

  /**
   * Get column metadata for H5 transactions
   * @param repid - Report ID
   * @param lineNum - Line number
   * @returns Promise with column metadata
   */
  getH5Columns: async (
    repid: string,
    lineNum: string
  ): Promise<H5ColumnsResponse> => {
    const response = await apiClient.get<H5ColumnsResponse>(
      `/h5/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
