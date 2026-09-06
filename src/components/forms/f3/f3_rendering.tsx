'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import { F3_LINE_DEFINITIONS } from './f3Definition';

export interface F3ReportProps { data: FinancialReportData; }

export default function F3Report({ data }: F3ReportProps) {
  return <FinancialReportRenderer data={data} definitions={F3_LINE_DEFINITIONS} formPrefix="f3-line-" />;
}
