/**
 * Web Committee Search Types
 * Types for advanced committee/candidate search API
 */

export interface WebCommitteeSearchParams {
  cand_id?: string;
  cand_name?: string;
  cmte_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  party?: string;
  office_state?: string;
  district?: string;
  office?: 'H' | 'S' | 'P'; // House, Senate, President
  limit?: number;
}

export interface CommitteeSearchResult {
  filer_id: string;
  committee_name: string;
  treasurer_name: string | null;
  street_1: string | null;
  street_2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  committee_designation: string | null;
  committee_type: string | null;
  party: string | null;
  office: string | null;
  signature_2: string | null;
  sponsor: string | null;
  candidate_id: string | null;
  max_year: number | null;
  house_state: string | null;
  house_district: string | null;
  table_version: number | null;
}

export interface WebCommitteeSearchResponse {
  data: CommitteeSearchResult[];
  meta: {
    count: number;
    limit: number;
    filters: Record<string, string>;
    total_matches: number;
  };
}

export interface StatePartySearchParams {
  state: string;
  party: string;
  limit?: number;
}

export interface OfficeSearchParams {
  office: 'H' | 'S' | 'P';
  office_state?: string;
  district?: string;
  party?: string;
  limit?: number;
}

export interface NameSearchParams {
  name: string;
  type?: 'committee' | 'candidate' | 'both';
  limit?: number;
}

// UI State types
export interface SearchFormState {
  searchType: 'advanced' | 'name' | 'state-party' | 'office';
  advancedParams: WebCommitteeSearchParams;
  nameParams: NameSearchParams;
  statePartyParams: StatePartySearchParams;
  officeParams: OfficeSearchParams;
}

// Dropdown options
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

export const PARTY_OPTIONS = [
  { value: 'DEM', label: 'Democratic' },
  { value: 'REP', label: 'Republican' },
  { value: 'IND', label: 'Independent' },
  { value: 'LIB', label: 'Libertarian' },
  { value: 'GRE', label: 'Green' },
  { value: 'OTH', label: 'Other' },
];

export const OFFICE_OPTIONS = [
  { value: 'H', label: 'House' },
  { value: 'S', label: 'Senate' },
  { value: 'P', label: 'President' },
];

export const SEARCH_TYPE_OPTIONS = [
  { value: 'committee', label: 'Committee Only' },
  { value: 'candidate', label: 'Candidate Only' },
  { value: 'both', label: 'Both' },
];