/**
 * F3X report data contract and API client.
 *
 * The backend is the source of report data. Presentation metadata is kept in
 * src/components/forms/f3xDefinition.ts and applied by the F3X renderer.
 */

import { apiClient } from './client';
import type { Committee, Metadata } from './types';

export interface F3XLine {
  lineId: string;
  lineNumber?: string;
  lineDescription?: string;
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

/** Temporary wire types for the current backend response. */
export type F3XRawLineType = 'text' | 'merge';
export type F3XRawSectionLayout = 'three_columns' | 'four_columns';

export interface F3XRawColumn {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'number' | 'date' | 'merge';
}

export interface F3XRawLine extends F3XLine {
  /** Legacy backend field retained only at the API boundary. */
  label?: string;
  type?: F3XRawLineType;
  lineOrder?: number;
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  linkTo?: string;
  note?: string;
  valueType?: string;
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

/**
 * Normalize the current wire response into the data-only contract.
 * Rendering metadata is deliberately not copied into the result.
 */
export function toF3XReportData(raw: F3XRawReportData): F3XReportData {
  return {
    metadata: raw.metadata,
    committee: raw.committee,
    sections: raw.sections.map((section) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      lines: section.lines.map((line) => ({
        lineId: line.lineId,
        lineNumber: line.lineNumber,
        lineDescription: line.lineDescription ?? line.label,
        value: line.value,
        columnA: line.columnA,
        columnB: line.columnB,
      })),
    })),
  };
}

export const f3xApi = {
  getReport: async (reportId: string): Promise<F3XReportResponse> => {
    const response = await apiClient.get<F3XReportResponse>(`/reports/${reportId}`);
    return response.data;
  },
};
