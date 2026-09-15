'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';
import { F4_LINE_DEFINITIONS } from './f4Definition';

export interface F4ReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

export default function F4Report({ data }: F4ReportProps) {
  return (
    <FinancialReportRenderer
      data={data}
      definitions={F4_LINE_DEFINITIONS}
      formPrefix="f4-line-"
    />
  );
}
