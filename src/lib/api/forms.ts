/**
 * Form types for FEC filing data
 */

import { apiClient } from './client';

// Matches app/services/reports_service.py's get_cand_cmte_reports
// (GET /reports/{cand_cmte_id}/filings) - same FIELD_MAP as
// lib/api/reports.ts's BasicInfo/Filing.
export interface Form {
  reportId: number;
  formType: string;
  amendmentIndicator: string;
  formCategory: 'reports' | 'notices' | 'statements' | 'other';
  committeeId: string;
  committeeName: string;
  filedDate: string | null;
  timestamp: string | null;
  coverageFromDate: string | null;
  coverageThroughDate: string | null;
  md5Hash: string;
  supercededReportId: string | null;
  previousReportId: string | null;
  reportType: string;
  formatVersion: string;
  reportNumber: string | null;
  startingImageNumber: number | null;
  endingImageNumber: number | null;
}

export interface FormsResponse {
  data: Form[];
  meta: {
    committeeId: string;
    count: number;
    total: number;
    limit: number;
    offset: number;
  };
}

export interface FormsError {
  error: string;
}

/**
 * Type guard to check if response is an error
 */
export function isFormsError(response: FormsResponse | FormsError): response is FormsError {
  return 'error' in response;
}

/**
 * Form category labels for display
 */
export const FORM_CATEGORY_LABELS: Record<Form['formCategory'], string> = {
  reports: 'Reports',
  notices: 'Notices',
  statements: 'Statements',
  other: 'Other',
};

/**
 * Form category descriptions
 */
export const FORM_CATEGORY_DESCRIPTIONS: Record<Form['formCategory'], string> = {
  reports: 'Financial reports (F3 series)',
  notices: 'Notices of contributions and expenditures (F24, F5, F6)',
  statements: 'Registration statements (F1, F2)',
  other: 'Other filing types',
};

// ======================================================
// API METHODS
// ======================================================

export const formsApi = {
  /**
   * Get forms filed by a candidate/committee ID
   */
  getForms: async (candCmteId: string, limit = 25, offset = 0): Promise<FormsResponse> => {
    const response = await apiClient.get<FormsResponse>(`/reports/${candCmteId}/filings`, {
      params: { limit, offset },
    });
    return response.data;
  },
};