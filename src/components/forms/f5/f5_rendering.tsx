'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';

export interface F5ReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

// F5 is a single Form Details section (no financial lines), so there's
// nothing per-line to define.
export default function F5Report({ data }: F5ReportProps) {
  return <FinancialReportRenderer data={data} definitions={{}} formPrefix="f5-line-" />;
}
