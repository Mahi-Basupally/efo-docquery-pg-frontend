'use client';

import FinancialReportRenderer from '../FinancialReportRenderer';
import { F3PS_LINE_DEFINITIONS } from './f3psDefinition';

export interface F3PSReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

export default function F3PSReport({ data }: F3PSReportProps) {
  return (
    <FinancialReportRenderer
      data={data}
      definitions={F3PS_LINE_DEFINITIONS}
      formPrefix="f3ps-line-"
    />
  );
}
