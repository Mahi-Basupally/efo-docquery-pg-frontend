'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3P_LINE_DEFINITIONS } from './f3pDefinition';

export interface F3PReportData {
  metadata?: { formTitle?: string; formSubTitle?: string };
  form?: { formType?: string; formatVersion?: string };
  committee?: {
    id?: string;
    name?: string;
    address?: {
      street1?: string | null;
      street2?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
    };
    changeOfAddress?: boolean;
  };
  report?: {
    reportId?: string | number;
    committeeId?: string;
    reportType?: string;
    amendmentIndicator?: string;
    filedDate?: string | null;
    coveragePeriod?: { startDate?: string | null; endDate?: string | null };
    election?: { state?: string | null; date?: string | null };
    treasurer?: {
      lastName?: string | null;
      firstName?: string | null;
      middleName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
    dateSigned?: string | null;
    imageNumber?: string | number | null;
  };
  summary?: { lines: unknown[] };
  netElectionCycleContributions?: { lines: unknown[] };
  receipts?: { lines: unknown[] };
  disbursements?: { lines: unknown[] };
  contributionExpenditures?: { lines: unknown[] };
  allocation?: { lines: unknown[] };
}

export interface F3PReportProps {
  data: F3PReportData;
}

// Titles derived from the actual line content of each key (verified against
// a live report), not guessed: summary/netElectionCycleContributions
// together cover lines 6-15 (the Summary Page recap), receipts/
// disbursements are the Detailed Summary Page's numbered sections,
// contributionExpenditures is just line 31 ("Items on Hand to be
// Liquidated"), and allocation is the state-by-state
// primary-expenditure-limit table (efo.f3p31al).
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  netElectionCycleContributions: 'Net Contributions/Operating Expenditures',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  contributionExpenditures: 'Items on Hand to Be Liquidated',
  allocation: 'Allocation of Expenditures by State',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeF3PData = (data: F3PReportData): FinancialReportData => {
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
    form: data.form,
    committee: data.committee as unknown as FinancialReportData['committee'],
    report: data.report,
    sections: sections as FinancialReportData['sections'],
  };
};

export default function F3PReport({ data }: F3PReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3PData(data)}
        definitions={F3P_LINE_DEFINITIONS}
      />
    </div>
  );
}
