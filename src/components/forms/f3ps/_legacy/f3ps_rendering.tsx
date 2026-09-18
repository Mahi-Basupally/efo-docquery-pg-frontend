'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3PS_LINE_DEFINITIONS } from './f3psDefinition';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// F3PS shares F3P's section-key shape (f3ps_service.py mirrors
// f3p_service.py) - same titles, derived from the actual line content of
// each key on a live report, not guessed. See f3p_rendering.tsx.
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  netElectionCycleContributions: 'Net Contributions/Operating Expenditures',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  contributionExpenditures: 'Items on Hand to Be Liquidated',
  allocation: 'Allocation of Expenditures by State',
};

export interface F3PSReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

const normalizeF3PSData = (data: F3PSReportProps['data']): FinancialReportData => {
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

export default function F3PSReport({ data }: F3PSReportProps) {
  return (
    <>
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3PSData(data)}
        definitions={F3PS_LINE_DEFINITIONS}
      />
    </>
  );
}
