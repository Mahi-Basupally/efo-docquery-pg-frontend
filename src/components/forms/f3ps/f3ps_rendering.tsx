'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3PS_LINE_DEFINITIONS } from './f3psDefinition';

// Matches the real f3ps_service.py contract exactly (verified against a
// live report) - no sections array, no {data: ...} envelope
// (ReportSummaryPage.tsx already unwraps that before this component ever
// sees the data). F3PS has no candidate (same as F3P - a presidential
// committee isn't tied to a single House/Senate-style candidate record)
// and, unlike F3P, its committee object never carries changeOfAddress at
// all (efo.f3p has no amend_addr column reachable from the F3PS query).
export interface F3PSReportData {
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

export interface F3PSReportProps {
  data: F3PSReportData;
}

// Same title derivation as F3P (identical section-key shape) - see
// f3p_rendering.tsx.
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

const normalizeF3PSData = (data: F3PSReportData): FinancialReportData => {
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

export default function F3PSReport({ data }: F3PSReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3PSData(data)}
        definitions={F3PS_LINE_DEFINITIONS}
      />
    </div>
  );
}
