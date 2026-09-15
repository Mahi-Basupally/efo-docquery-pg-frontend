'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';
import { F3S_LINE_DEFINITIONS } from './f3sDefinition';

export interface F3SReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

export default function F3SReport({ data }: F3SReportProps) {
  return (
    <FinancialReportRenderer
      data={data}
      definitions={F3S_LINE_DEFINITIONS}
      formPrefix="f3s-line-"
    />
  );
}
