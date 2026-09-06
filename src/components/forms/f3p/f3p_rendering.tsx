'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';
import { F3P_LINE_DEFINITIONS } from './f3pDefinition';

export interface F3PReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

export default function F3PReport({ data }: F3PReportProps) {
  return (
    <FinancialReportRenderer
      data={data}
      definitions={F3P_LINE_DEFINITIONS}
      formPrefix="f3p-line-"
    />
  );
}
