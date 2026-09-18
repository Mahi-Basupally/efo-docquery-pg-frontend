'use client';

import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';

export interface F24ReportProps {
  data: ReportDetailsHeaderData;
}

// F24 (24 Hour Notice of Independent Expenditure) has no financial lines
// and no formDetails - every fact about it (committee identity, amendment/
// report/coverage info, who signed it and when) is already structured
// under committee/report (see f24_service.py), so the shared
// ReportDetailsHeader is the entire page - there's nothing left for
// FinancialReportRenderer to add.
export default function F24Report({ data }: F24ReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <ReportDetailsHeader data={data} />
    </div>
  );
}
