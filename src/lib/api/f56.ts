import { API_BASE_URL } from './config';

export interface F56Column {
  apiFieldName: string;
  description: string;
  position: number;
}

export interface F56CommitteeDetails {
  candidateFirstName: string | null;
  candidateLastName: string | null;
  candidateMiddleName: string | null;
  candidatePrefixName: string | nul;
  candidateSuffixName: string | null;
  city: string;
  committeeId: string;
  committeeName: string | null;
  entity: string | null;
  filingType: string;
  formType: string;
  reportId: number;
  state: string;
  streetAddress1: string;
  streetAddress2: string | null;
  zipCode: string;
}

export interface F56Pagination {
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface F56Meta {
  columns: F56Column[];
  committeeDetails: F56CommitteeDetails;
  lineNumber: string;
  pagination: F56Pagination;
  reportId: string;
}

export interface F56Response {
  data: Record<string, any>[];
  meta: F56Meta;
}

export const f56Api = {
  getF56Data: async (
    repId: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<F56Response> => {
    const { page = 1, perPage = 50 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/f56/${repId}/${lineNum}?${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch F56 data: ${response.statusText}`);
    }

    return response.json();
  },
};
