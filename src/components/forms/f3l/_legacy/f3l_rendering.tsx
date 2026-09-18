'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';

export interface F3LReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

// F3L is a single Form Details section (no financial lines), so there's
// nothing per-line to define - but it does carry a full committee/report
// object (f3l_service.py), so it gets the same header as F3P/F3S/F3X.
export default function F3LReport({ data }: F3LReportProps) {
  return (
    <>
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer data={data} definitions={{}} />
    </>
  );
}
