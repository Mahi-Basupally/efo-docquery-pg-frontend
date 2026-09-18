'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3_LINE_DEFINITIONS } from './f3Definition';


export interface F3ReportData {
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
    election?: { state?: string | null; district?: string | null };
    candidate?: {
      id?: string | null;
      lastName?: string | null;
      firstName?: string | null;
      middleName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
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

export interface F3ReportProps {
  data: F3ReportData;
}

const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  cashSummary: 'III. Cash Summary',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeF3Data = (data: F3ReportData): FinancialReportData => {
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

export default function F3Report({ data }: F3ReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3Data(data)}
        definitions={F3_LINE_DEFINITIONS}
      />
    </div>
  );
}
