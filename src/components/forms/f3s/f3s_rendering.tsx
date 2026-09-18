'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F3S_LINE_DEFINITIONS } from './f3sDefinition';

export interface F3SReportData {
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
    // district is always null for F3S (efo.f3s has no district column) -
    // kept in the type for parity with F3's same-shaped election object.
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
  netContributions?: { lines: unknown[] };
  netOperatingExpenditures?: { lines: unknown[] };
  cashSummary?: { lines: unknown[] };
}

export interface F3SReportProps {
  data: F3SReportData;
}


const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  netContributions: 'III. Net Contributions',
  netOperatingExpenditures: 'IV. Net Operating Expenditures',
  cashSummary: 'V. Cash Summary',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const normalizeF3SData = (data: F3SReportData): FinancialReportData => {
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

export default function F3SReport({ data }: F3SReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF3SData(data)}
        definitions={F3S_LINE_DEFINITIONS}
      />
    </div>
  );
}
