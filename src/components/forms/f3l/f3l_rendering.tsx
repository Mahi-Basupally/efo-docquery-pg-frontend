'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';

// Matches the real f3l_service.py contract exactly (verified against a live
// report) - no {data: ...} envelope (ReportSummaryPage.tsx already unwraps
// that before this component ever sees the data). F3L (Report of
// Contributions Bundled by Lobbyists/Registrants and Lobbyist/Registrant
// PACs) has no summary/receipts/disbursements data - just committee/
// election identity and two bundled-contribution totals - so it carries a
// single formDetails section of plain lineNumber/label/value lines instead
// of the usual financial-line sections. Its election object uses
// state/district (like F3/F3S), not F3P/F3PS's state/date.
export interface F3LReportData {
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
  formDetails?: { lines: unknown[] };
}

export interface F3LReportProps {
  data: F3LReportData;
}

export default function F3LReport({ data }: F3LReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer data={data as unknown as FinancialReportData} definitions={{}} />
    </div>
  );
}
