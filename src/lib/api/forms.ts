/**
 * Form types for FEC filing data
 */

import { apiClient } from './client';

export interface Form {
  reportId: number;
  formType: string;
  formCategory: 'reports' | 'notices' | 'statements' | 'other';
  committeeId: string;
  committeeName: string;
  filedDate: string | null;
  timestamp: string | null;
  fromDate: string | null;
  throughDate: string | null;
  md5: string;
  superceded: number | null;
  previousId: number | null;
  reportCode: string;
  version: string;
  reportNumber: number;
  startingImageNumber: number;
  endingImageNumber: number;
  createDate: string | null;
  excludeIndicator: string | null;
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
    const response = await apiClient.get<FormsResponse>(`/filings/${candCmteId}`, {
      params: { limit, offset },
    });
    return response.data;
  },
};