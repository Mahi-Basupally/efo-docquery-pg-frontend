import { apiClient } from './client';

// ======================================================
// Interfaces
// ======================================================

export interface Committee {
  committeeId: string;
  committeeName: string;
  committeeFilingFrequency: string;
}

export interface CommitteeDetail extends Committee {
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
  phone?: string;
  treasurerName?: string;
  committeeEmail?: string;
  committeeType?: string;
  committeeDesignation?: string;
}

export interface CommitteeSearchResponse {
  data: Committee[];
  meta: {
    count: number;
    limit: number;
    offset: number;
    query: string;
  };
}

export interface CommitteeDetailResponse {
  data: CommitteeDetail;
}

export interface CommitteeError {
  error: string;
}

// ======================================================
// Type Guards
// ======================================================

/**
 * Type guard to check if response is an error
 */
export function isCommitteeError(
  response: CommitteeSearchResponse | CommitteeDetailResponse | CommitteeError
): response is CommitteeError {
  return 'error' in response;
}

// ======================================================
// Constants
// ======================================================

/**
 * Committee filing frequency labels
 */
export const FILING_FREQUENCY_LABELS: Record<string, string> = {
  M: 'Monthly',
  Q: 'Quarterly',
  T: 'Terminated',
  W: 'Waived',
  A: 'Administratively Terminated',
  D: 'Debt',
};

/**
 * Committee type labels
 */
export const COMMITTEE_TYPE_LABELS: Record<string, string> = {
  H: 'House',
  S: 'Senate',
  P: 'Presidential',
  X: 'Party - Nonqualified',
  Y: 'Party - Qualified',
  Z: 'National Party Nonfederal',
  N: 'PAC - Nonqualified',
  Q: 'PAC - Qualified',
  I: 'Independent Expenditure',
  O: 'Super PAC',
  U: 'Single Candidate Independent Expenditure',
  V: 'PAC with Non-Contribution Account - Nonqualified',
  W: 'PAC with Non-Contribution Account - Qualified',
};

/**
 * Committee designation labels
 */
export const COMMITTEE_DESIGNATION_LABELS: Record<string, string> = {
  A: 'Authorized by a candidate',
  J: 'Joint fundraising committee',
  P: 'Principal campaign committee',
  U: 'Unauthorized',
  B: 'Lobbyist/Registrant PAC',
  D: 'Leadership PAC',
};

// ======================================================
// Helper Functions
// ======================================================

/**
 * Get display label for filing frequency
 */
export function getFilingFrequencyLabel(frequency: string): string {
  return FILING_FREQUENCY_LABELS[frequency] || frequency;
}

/**
 * Get display label for committee type
 */
export function getCommitteeTypeLabel(type: string): string {
  return COMMITTEE_TYPE_LABELS[type] || type;
}

/**
 * Get display label for committee designation
 */
export function getCommitteeDesignationLabel(designation: string): string {
  return COMMITTEE_DESIGNATION_LABELS[designation] || designation;
}

/**
 * Check if committee is active based on filing frequency
 */
export function isCommitteeActive(frequency: string): boolean {
  return frequency === 'M' || frequency === 'Q';
}

// ======================================================
// API METHODS
// ======================================================

export const committeeApi = {
  /**
   * Search committees - returns committeeId, committeeName, and committeeFilingFrequency
   */
  searchCommittees: async (query: string, limit = 5, offset = 0): Promise<CommitteeSearchResponse> => {
    const response = await apiClient.get<CommitteeSearchResponse>('/committees/search', {
      params: { query, limit, offset },
    });
    return response.data;
  },

  /**
   * Get committee by ID - returns full details
   */
  getCommitteeById: async (comid: string): Promise<CommitteeDetail> => {
    const response = await apiClient.get<CommitteeDetailResponse>(`/committees/${comid}`);
    return response.data.data;
  },
};