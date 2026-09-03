import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule F transaction data - dynamic keys based on camelCase field names
export type ScheduleFTransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleFMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleFResponse {
  data: ScheduleFTransaction[];
  meta: ScheduleFMeta;
}

// Column metadata only response
export interface ScheduleFColumnsResponse {
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

// Schedule F API methods
export const scheduleFApi = {
  /**
   * Get Schedule F transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "24", "25")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule F transaction data and metadata
   */
  getScheduleFData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleFResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/sf/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleFResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule F transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "24", "25")
   * @returns Promise with column metadata
   */
  getScheduleFColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleFColumnsResponse> => {
    const response = await apiClient.get<ScheduleFColumnsResponse>(
      `/sf/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
