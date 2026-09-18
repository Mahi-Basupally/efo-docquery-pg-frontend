'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3P_LINE_DEFINITIONS } from './f3pDefinition';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// F3P's backend contract (f3p_service.py) returns named section keys, each
// { lines: [...] } - not the { id, title, lines } sections array
// FinancialReportRenderer expects. Titles below are derived from the actual
// line content of each key (verified against a live report), not guessed:
// summary/netElectionCycleContributions together cover lines 6-15 (the
// Summary Page recap), receipts/disbursements are the Detailed Summary
// Page's numbered sections, contributionExpenditures is just line 31
// ("Items on Hand to be Liquidated"), and allocation is the state-by-state
// primary-expenditure-limit table (efo.f3p31al).
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  netElectionCycleContributions: 'Net Contributions/Operating Expenditures',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  contributionExpenditures: 'Items on Hand to Be Liquidated',
  allocation: 'Allocation of Expenditures by State',
};

export interface F3PReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

const normalizeF3PData = (data: F3PReportProps['data']): FinancialReportData => {
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

export default function F3PReport({ data }: F3PReportProps) {
  return (
    <>
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3PData(data)}
        definitions={F3P_LINE_DEFINITIONS}
      />
    </>
  );
}
