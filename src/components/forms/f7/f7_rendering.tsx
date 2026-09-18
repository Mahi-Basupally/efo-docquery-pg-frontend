'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';

export interface F7ReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

// F7 is a single Form Details section (no financial lines), so there's
// nothing per-line to define.
export default function F7Report({ data }: F7ReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <FinancialReportRenderer data={data} definitions={{}} />
    </div>
  );
}
