'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';

export interface F99ReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

// F99 is a single Form Details section (no financial lines), so there's
// nothing per-line to define.
export default function F99Report({ data }: F99ReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <FinancialReportRenderer data={data} definitions={{}} />
    </div>
  );
}
