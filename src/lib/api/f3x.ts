/**
 * F3X report data contract and API client.
 *
 * The backend supplies report data. F3X presentation metadata is kept in
 * src/components/forms/f3xDefinition.ts and applied by the renderer.
 */

import { apiClient } from './client';
import type { Committee, Metadata } from './types';

export interface F3XFormDetailLine {
  lineNumber?: string;
  lineDescription: string;
  value?: string | number | null;
}

export interface F3XFinancialLine {
  lineId: string;
  lineNumber?: string;
  lineDescription: string;
  thisPeriod?: number | string | null;
  yearToDate?: number | string | null;
}

export type F3XLine = F3XFormDetailLine | F3XFinancialLine;

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

export interface F3XReportResponse {
  data: F3XReportData;
}

export const f3xApi = {
  getReport: async (reportId: string): Promise<F3XReportResponse> => {
    const response = await apiClient.get<F3XReportResponse>(`/reports/${reportId}`);
    return response.data;
  },
};
