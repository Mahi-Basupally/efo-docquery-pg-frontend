'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';

export interface F24ReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

// F24 is a single Form Details section (no financial lines), so there's
// nothing per-line to define.
export default function F24Report({ data }: F24ReportProps) {
  return <FinancialReportRenderer data={data} definitions={{}} />;
}
