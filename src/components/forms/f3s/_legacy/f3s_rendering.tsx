'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3S_LINE_DEFINITIONS } from './f3sDefinition';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// F3S's backend contract (f3s_service.py) returns named section keys, each
// { lines: [...] } - not the { id, title, lines } sections array
// FinancialReportRenderer expects. Titles below are derived from the actual
// line content of each key (verified against a live report), not guessed:
// netContributions/netOperatingExpenditures are each a single recap line
// (III/IV), separate from the Summary Page's own recap (lines 6-10).
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  netContributions: 'III. Net Contributions',
  netOperatingExpenditures: 'IV. Net Operating Expenditures',
  cashSummary: 'V. Cash Summary',
};

export interface F3SReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

const normalizeF3SData = (data: F3SReportProps['data']): FinancialReportData => {
  const raw = data as unknown as Record<string, unknown>;
  const sections = Object.entries(SECTION_TITLES)
    .map(([id, title]) => {
      const source = raw[id];
      const lines = isRecord(source) && Array.isArray(source.lines) ? source.lines : [];
      return { id, title, lines };
    })
    .filter(section => section.lines.length > 0);

  return {
    ...data,
    sections: sections as FinancialReportData['sections'],
  };
};

export default function F3SReport({ data }: F3SReportProps) {
  return (
    <>
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3SData(data)}
        definitions={F3S_LINE_DEFINITIONS}
      />
    </>
  );
}
