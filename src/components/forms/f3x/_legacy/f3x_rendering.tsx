'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import type { F3XReportData } from '@/lib/api/f3x';
import { F3X_LINE_DEFINITIONS } from './f3xDefinition';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// F3X's backend contract (f3x_service.py) returns named section keys -
// summary/receipts/disbursements/contributionExpenditures, each
// { lines: [...] } - not the { id, title, lines } sections array
// FinancialReportRenderer expects. Build that array here the same way
// f3_rendering.tsx's normalizeF3Data does for F3.
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  contributionExpenditures: 'III. Net Contributions/Operating Expenditures',
};

const normalizeF3XData = (data: F3XReportData): FinancialReportData => {
  const raw = data as unknown as Record<string, unknown>;
  const sections = Object.entries(SECTION_TITLES)
    .map(([id, title]) => {
      const source = raw[id];
      const lines = isRecord(source) && Array.isArray(source.lines) ? source.lines : [];
      return { id, title, lines };
    })
    .filter(section => section.lines.length > 0);

  return {
    metadata: data.metadata,
    committee: data.committee as unknown as FinancialReportData['committee'],
    report: data.report,
    sections: sections as FinancialReportData['sections'],
  };
};

export interface F3XReportProps {
  data: F3XReportData;
}

export default function F3XReport({ data }: F3XReportProps) {
  const normalized = normalizeF3XData(data);

  if (!normalized.sections.length) {
    return (
      <div className="slab slab--neutral u-padding--left u-padding--right">
        <p className="text-gray-500 text-center py-8">No summary data available for this report.</p>
      </div>
    );
  }

  return (
    <>
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalized}
        definitions={F3X_LINE_DEFINITIONS}
      />
    </>
  );
}
