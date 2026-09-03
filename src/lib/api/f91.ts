import { apiClient } from './client';

// Column metadata interface
export interface F91Column {
  column_name: string;
  description: string;
  position: number;
}

// Pagination metadata interface
export interface PaginationMeta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Committee details interface
export interface CommitteeDetails {
  filing_type: string;
  repid: string;
  comid: string;
  entity: string;
  cmte_name: string;
  form_type: string;
  cand_last_name: string | null;
  cand_first_name: string | null;
  cand_middle_name: string | null;
  cand_prefix_name: string | null;
  cand_suffix_name: string | null;
  street_1: string;
  street_2: string | null;
  city: string;
  state: string;
  zip: string;
}

// F91 transaction data - dynamic keys based on column descriptions
export type F91Transaction = Record<string, string | number | null>;

// Response metadata
export interface F91Meta {
  reportId: string;
  lineNumber: string;
  owner: string;
  tableName: string;
  committeeDetails: CommitteeDetails;
  columns: F91Column[];
  pagination: PaginationMeta;
}

// Main response interface
export interface F91Response {
  data: F91Transaction[];
  meta: F91Meta;
}

// Column metadata only response
export interface F91ColumnsResponse {
  data: F91Column[];
  meta: {
    reportId: string;
    lineNumber: string;
    owner: string;
    tableName: string;
    totalColumns: number;
  };
}

// Error response interface
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: {
    owner?: string;
    tableName?: string;
    lineNumber?: string;
  };
}

// Query parameters for pagination
export interface F91PaginationParams {
  page?: number;
  per_page?: number;
}

// F91 API methods
export const f91Api = {
  /**
   * Get F91 transaction data with pagination
   * @param repid - Report ID
   * @param params - Optional pagination parameters (page, per_page)
   * @returns Promise with F91 transaction data and metadata
   */
  getF91Data: async (
    repid: string,
    params?: F91PaginationParams
  ): Promise<F91Response> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }

    const queryString = queryParams.toString();
    const url = `/f91/${repid}${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<F91Response>(url);
    return response.data;
  },

  /**
   * Get column metadata for F91 transactions
   * @param repid - Report ID
   * @returns Promise with column metadata
   */
  getF91Columns: async (
    repid: string
  ): Promise<F91ColumnsResponse> => {
    const response = await apiClient.get<F91ColumnsResponse>(
      `/f91/${repid}/columns`
    );
    return response.data;
  },
};