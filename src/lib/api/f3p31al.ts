import { apiClient } from './client';
import {
  CommitteeDetails,
  PaginationMeta,
  ScheduleColumn,
  ErrorResponse,
  PaginationParams
} from './types';

// Schedule A transaction data - dynamic keys based on camelCase field names
export type ScheduleF3P31ALTransaction = Record<string, string | number | null>;

// Response metadata
export interface ScheduleF3P31ALMeta {
  reportId: string;
  lineNumber: string;
  columns: ScheduleColumn[];
  committeeDetails: CommitteeDetails;
  pagination: PaginationMeta;
}

// Main response interface
export interface ScheduleF3P31ALResponse {
  data: ScheduleF3P31ALTransaction[];
  meta: ScheduleF3P31ALMeta;
}

// Column metadata only response
export interface ScheduleF3P31ALColumnsResponse {
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

// Schedule A API methods
export const ScheduleF3P31ALApi = {
  /**
   * Get Schedule A transaction data with pagination
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "11AI")
   * @param params - Optional pagination parameters (page, perPage)
   * @returns Promise with Schedule A transaction data and metadata
   */
  getScheduleF3P31ALData: async (
    repid: string,
    lineNum: string,
    params?: PaginationParams
  ): Promise<ScheduleF3P31ALResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.perPage) {
      queryParams.append('perPage', params.perPage.toString());
    }

    const queryString = queryParams.toString();
    const url = `/f3p31al/${repid}/${lineNum}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<ScheduleF3P31ALResponse>(url);
    return response.data;
  },

  /**
   * Get column metadata for Schedule A transactions
   * @param repid - Report ID
   * @param lineNum - Line number (e.g., "11AI")
   * @returns Promise with column metadata
   */
  getScheduleF3P31ALColumns: async (
    repid: string,
    lineNum: string
  ): Promise<ScheduleF3P31ALColumnsResponse> => {
    const response = await apiClient.get<ScheduleF3P31ALColumnsResponse>(
      `/f3p31al/${repid}/${lineNum}/columns`
    );
    return response.data;
  },
};
