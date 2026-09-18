'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3X_LINE_DEFINITIONS } from './f3xDefinition';

// Matches the real f3x_service.py contract exactly (verified against a live
// report) - no sections array, no {data: ...} envelope
// (ReportSummaryPage.tsx already unwraps that before this component ever
// sees the data). F3X has no candidate/election (party/PAC committee, not
// tied to a candidate race) and uses contributionExpenditures instead of
// cashSummary as its fourth section.
export interface F3XReportData {
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
    qualifiedCommittee?: boolean;
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
  receipts?: { lines: unknown[] };
  disbursements?: { lines: unknown[] };
  contributionExpenditures?: { lines: unknown[] };
}

export interface F3XReportProps {
  data: F3XReportData;
}

const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  contributionExpenditures: 'III. Net Contributions/Operating Expenditures',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

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
    form: data.form,
    committee: data.committee as unknown as FinancialReportData['committee'],
    report: data.report,
    sections: sections as FinancialReportData['sections'],
  };
};

export default function F3XReport({ data }: F3XReportProps) {
  const normalized = normalizeF3XData(data);

  if (!normalized.sections?.length) {
    return (
      <div className="slab slab--neutral u-padding--left u-padding--right">
        <p className="text-gray-500 text-center py-8">No summary data available for this report.</p>
      </div>
    );
  }

  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalized}
        definitions={F3X_LINE_DEFINITIONS}
      />
    </div>
  );
}
