/**
 * Superseded: the active F3X renderer (src/components/forms/f3x/
 * f3x_rendering.tsx) now declares its own F3XReportData locally, matching
 * the verified real f3x_service.py contract (named section keys, no
 * `sections` array - the shape below never actually matched the backend).
 * This file is kept only because f3x/_legacy/f3x_rendering.tsx (the
 * archived pre-rewrite version) still imports it.
 */

import type { Committee, Metadata } from './types';

export interface F3XFormDetailLine {
  lineNumber?: string;
  label: string;
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
  // Backend's actual reportId field (f3x_service.py) - metadata.reportId is
  // never populated despite the Metadata type declaring it required.
  report?: { reportId?: string | number };
  sections: F3XSection[];
}
