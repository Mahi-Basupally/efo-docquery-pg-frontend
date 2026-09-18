import { apiClient } from './client';
import type { SummaryResponse } from './types';


interface ReportFields {
  reportId: string | number;
  formType: string;
  amendmentIndicator: string;
  filedDate: string;
  timestamp: string;
  coverageFromDate: string;
  coverageThroughDate: string;
  md5Hash: string;
  supercededReportId: string | null;
  previousReportId: string | null;
  reportType: string;
  formatVersion: string;
  reportNumber: string | null;
  startingImageNumber: number | null;
  endingImageNumber: number | null;
}

// GET /reports/{repid}/filing-info - the flat committee/report identity
// fields every [rep_id] page needs for its header, independent of any
// form-specific summary data.
export interface BasicInfo extends ReportFields {
  committeeId: string;
  committeeName: string;
}

// One row of GET /reports/{cand_cmte_id}/filings (reports_service.py's
// get_cand_cmte_reports) - either committeeId/committeeName or
// candidateId/candidateName is present, depending on whether cand_cmte_id
// is a committee or candidate.
export interface Filing extends ReportFields {
  formCategory: string;
  committeeId?: string;
  committeeName?: string;
  candidateId?: string;
  candidateName?: string;
}

export interface FilingsResponse {
  data: Filing[];
  meta: {
    committeeId?: string;
    candidateId?: string;
    count: number;
    total: number;
    limit: number;
    offset: number;
  };
}

// Re-exported for backward compatibility with existing imports.
export type { SummaryData, SummaryResponse } from './types';

export interface GetFilingsParams {
  limit?: number;
  offset?: number;
}

export const reportsApi = {
  getBasicInfo: async (reportId: string): Promise<{ data: BasicInfo }> => {
    const response = await apiClient.get<{ data: BasicInfo }>(`/reports/${reportId}/filing-info`);
    return response.data;
  },

  // GET /reports/{cand_cmte_id}/filings - all reports for a committee or
  // candidate, paginated.
  getFilings: async (
    candCmteId: string,
    params?: GetFilingsParams
  ): Promise<FilingsResponse> => {
    const response = await apiClient.get<FilingsResponse>(
      `/reports/${candCmteId}/filings`,
      { params }
    );
    return response.data;
  },

  getSummaryLines: async (reportId: string): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse>(`/reports/${reportId}/summary`);
    return response.data;
  },

  // GET /reports/{reportId}/f99 - the F99 (Miscellaneous Electronic
  // Submission) attached to this report, if any. Not gated on the report's
  // own primary form type like getSummaryLines/ /summary is - efo.f99 rows
  // exist both for reports that are themselves a standalone F99 filing and
  // for reports whose primary form is something else entirely (e.g. an F1A
  // that also carries a misc-text attachment under the same repid).
  getF99: async (reportId: string): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse>(`/reports/${reportId}/f99`);
    return response.data;
  },
};
