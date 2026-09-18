'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F4_LINE_DEFINITIONS } from './f4Definition';

// Matches the real f4_service.py contract exactly (verified against a live
// report) - no sections array, no {data: ...} envelope
// (ReportSummaryPage.tsx already unwraps that before this component ever
// sees the data). F4 has no election/candidate (a convention committee
// isn't tied to a candidate race) and no changeOfAddress on committee
// (efo.f4 has no amend_addr column); it carries a committeeType string
// instead (Host/Convention/Other committee).
export interface F4ReportData {
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
    committeeType?: string;
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
  cashSummary?: { lines: unknown[] };
}

export interface F4ReportProps {
  data: F4ReportData;
}

// Matches F3's own title convention for the same
// summary/receipts/disbursements/cashSummary shape.
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  cashSummary: 'III. Cash Summary',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeF4Data = (data: F4ReportData): FinancialReportData => {
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

export default function F4Report({ data }: F4ReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF4Data(data)}
        definitions={F4_LINE_DEFINITIONS}
      />
    </div>
  );
}
