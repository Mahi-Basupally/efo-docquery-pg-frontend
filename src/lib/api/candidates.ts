import { apiClient } from './client';

// ======================================================
// Interfaces
// ======================================================

export interface Candidate {
  candidateId: string;
  candidateName: string;
}

export interface CandidateDetail extends Candidate {
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
  candidateDistrict?: string;
  candidateOfficeState?: string;
  candidateElectionYear?: number | null;
}

export interface CandidateSearchResponse {
  data: Candidate[];
  meta: {
    count: number;
    limit: number;
    offset: number;
    query: string;
  };
}

export interface CandidateDetailResponse {
  data: CandidateDetail;
}

// ======================================================
// API METHODS
// ======================================================

export const candidateApi = {
  // Search candidates - returns only ID and name
  searchCandidates: async (query: string, limit = 5, offset = 0): Promise<CandidateSearchResponse> => {
    const response = await apiClient.get<CandidateSearchResponse>('/candidate/search', {
      params: { query, limit, offset },
    });
    return response.data;
  },

  // Get candidate by ID - returns full details
  getCandidateById: async (filerid: string): Promise<CandidateDetail> => {
    const response = await apiClient.get<CandidateDetailResponse>(`/candidate/${filerid}`);
    return response.data.data;
  },
};
