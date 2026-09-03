/**
 * Shared types and interfaces for FEC DocQuery API
 */

// Committee details interface - used across all schedule types
export interface CommitteeDetails {
  candidateFirstName: string | null;
  candidateLastName: string | null;
  candidateMiddleName: string | null;
  candidatePrefixName: string | null;
  candidateSuffixName: string | null;
  city: string;
  committeeId: string;
  committeeName: string;
  entity: string;
  filingType: string;
  formType: string;
  reportId: number;
  state: string;
  streetAddress1: string;
  streetAddress2: string | null;
  zipCode: string;
}

// Pagination metadata interface - used across all schedule types
export interface PaginationMeta {
  page: number;
  perPage: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Column metadata interface - used across all schedule types
export interface ScheduleColumn {
  apiFieldName: string;
  description: string;
  position: number;
}

// Error response interface - used across all API endpoints
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: {
    owner?: string;
    tableName?: string;
    lineNumber?: string;
  };
}

// Query parameters for pagination - used across all schedule types
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

// ============================================================================
// Report summary types
//
// These are the centralized types for the generic report-detail view used by
// ReportDetailPage (src/components/reports/ReportDetailPage.tsx). They cover
// both real report data (committee, candidate, metadata, line values) and,
// for form types other than F3X, backend-supplied rendering hints
// (columns/type/lineOrder/sectionOrder/indent/isTotal/etc.) that the generic
// renderer still relies on today. F3X has moved off this generic rendering
// path and onto its own data/rendering split - see src/lib/api/f3x.ts and
// src/components/forms/f3x_rendering.tsx.
// ============================================================================

export type SectionType =
  | 'two_columns'
  | 'three_columns'
  | 'four_columns'
  | 'multi_columns';

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Committee {
  id: string;
  name: string;
  address: Address;
}

export interface Candidate {
  candidateId: string;
  candidateName: string;
  district?: number;
  electionYear?: string;
  office?: string;
  party?: string;
  state?: string | null;
}

export interface Metadata {
  reportId: number;
  formType: string;
  formTitle?: string;
  formSubTitle?: string;
  amendmentIndicator?: string;
  filedDate?: string;
  imageNumber?: number;
}

export interface Column {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'number' | 'date' | 'merge';
}

export interface SectionLine {
  lineNumber?: string;
  label?: string;
  value?: string | number | null;
  type?: 'text' | 'currency' | 'number' | 'date' | 'merge';
  lineOrder?: number;
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  linkTo?: string;
  note?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  sectionOrder: number;
  columns?: Column[];
  lines: SectionLine[];
}

export interface SummaryData {
  metadata: Metadata;
  committee?: Committee;
  candidate?: Candidate;
  sections: Section[];
}

export interface SummaryResponse {
  data: SummaryData;
}
