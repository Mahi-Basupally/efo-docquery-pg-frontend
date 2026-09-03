import { apiClient } from './client';
import type { SummaryResponse } from './types';

export interface Report {
  reportId: string;
  formType: string;
  committeeId: string;
  committeeName: string;
  filedDate: string;
  coverageFromDate: string;
  coverageThroughDate: string;
  reportCode: string;
  superceded: string;
  version?: string;
}

export interface ReportDetail extends Report {
  amendmentInd: string;
  timestamp: string;
  reportType: string;
  reportNumber: string;
  startingImageNumber: string;
  endingImageNumber: string;
  md5Hash: string;
  previousReportId: string;
  excludeIndicator: string;
}

// Re-exported for backward compatibility with existing imports.
export type { SummaryData, SummaryResponse } from './types';

export interface SearchReportsParams {
  query: string;
  form?: string;
  limit?: number;
  offset?: number;
}

export interface GetReportsByCommitteeParams {
  form?: string;
  limit?: number;
  offset?: number;
}

export const reportsApi = {
  searchReports: async (params: SearchReportsParams) => {
    const response = await apiClient.get('/reports/search', { params });
    return response.data;
  },

  getReportById: async (reportId: string): Promise<{ data: Report }> => {
    const response = await apiClient.get<{ data: Report }>(`/reports/${reportId}`);
    return response.data;
  },

  getReportsByCommittee: async (
    committeeId: string,
    params?: GetReportsByCommitteeParams
  ) => {
    const response = await apiClient.get(
      `/reports/committee/${committeeId}`,
      { params }
    );
    return response.data;
  },

  getSummaryLines: async (reportId: string): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse>(`/reports/${reportId}`);
    return response.data;
  },
};
