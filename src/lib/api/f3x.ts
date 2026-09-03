/**
 * F3X ("Report of Receipts and Disbursements") report types and API client.
 *
 * The backend (efo-docquery-pg-backend app/services/f3x_service.py) currently
 * returns a single JSON payload that mixes real report data (committee,
 * metadata, line labels/values/amounts) with frontend rendering instructions
 * (columns, section/line order, indent, isTotal, calculation, hasSchedule,
 * scheduleType, linkTo, note). Until that endpoint is split, this module:
 *
 *  - Types that raw wire payload explicitly as F3XRawReportData/F3XRawSection/
 *    F3XRawLine (superset types, so the API boundary is never `unknown`/`any`).
 *  - Defines the target data-only contract (F3XReportData/F3XSection/F3XLine)
 *    that the backend should eventually return directly.
 *  - Provides toF3XReportData() to derive the clean, data-only shape from the
 *    raw payload today.
 *
 * All rendering decisions (which columns to show, section/line ordering,
 * indentation, totals styling, links, schedule presentation) belong to
 * src/components/forms/f3x_rendering.tsx, not to these types.
 */

import { apiClient } from './client';
import type { Committee, Metadata } from './types';

// ============================================================================
// Data-only contract (target shape)
// ============================================================================

export interface F3XLine {
  lineNumber?: string;
  label?: string;
  value?: string | number | null;
  columnA?: number | string | null;
  columnB?: number | string | null;
}

export interface F3XSection {
  id: string;
  title: string;
  subtitle?: string;
  lines: F3XLine[];
}

export interface F3XReportData {
  metadata: Metadata;
  committee?: Committee;
  sections: F3XSection[];
}

// ============================================================================
// Raw wire contract (what the API currently returns for F3X)
// ============================================================================

export type F3XRawLineType = 'text' | 'merge';
export type F3XRawSectionLayout = 'three_columns' | 'four_columns';

export interface F3XRawColumn {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'number' | 'date' | 'merge';
}

export interface F3XRawLine extends F3XLine {
  type?: F3XRawLineType;
  lineOrder?: number;
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  linkTo?: string;
  note?: string;
}

export interface F3XRawSection extends Omit<F3XSection, 'lines'> {
  type: F3XRawSectionLayout;
  sectionOrder: number;
  columns: F3XRawColumn[];
  lines: F3XRawLine[];
}

export interface F3XRawReportData extends Omit<F3XReportData, 'sections'> {
  sections: F3XRawSection[];
}

export interface F3XReportResponse {
  data: F3XRawReportData;
}

// ============================================================================
// Raw -> data-only mapping
// ============================================================================

export function toF3XReportData(raw: F3XRawReportData): F3XReportData {
  return {
    metadata: raw.metadata,
    committee: raw.committee,
    sections: raw.sections.map((section) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      lines: section.lines.map((line) => ({
        lineNumber: line.lineNumber,
        label: line.label,
        value: line.value,
        columnA: line.columnA,
        columnB: line.columnB,
      })),
    })),
  };
}

// ============================================================================
// API client
// ============================================================================

export const f3xApi = {
  getReport: async (reportId: string): Promise<F3XReportResponse> => {
    const response = await apiClient.get<F3XReportResponse>(`/reports/${reportId}`);
    return response.data;
  },
};
