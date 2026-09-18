'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportDetailsHeader, { ReportDetailsHeaderData } from '../ReportDetailsHeader';
import { F4_LINE_DEFINITIONS } from './f4Definition';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

// F4's backend contract (f4_service.py) returns named section keys -
// summary/receipts/disbursements/cashSummary, each { lines: [...] } - not
// the { id, title, lines } sections array FinancialReportRenderer expects.
// Build that array here, matching F3's own title convention for the same
// summary/receipts/disbursements/cashSummary shape.
const SECTION_TITLES: Record<string, string> = {
  summary: 'Summary',
  receipts: 'I. Receipts',
  disbursements: 'II. Disbursements',
  cashSummary: 'III. Cash Summary',
};

export interface F4ReportProps {
  data: Parameters<typeof FinancialReportRenderer>[0]['data'];
}

const normalizeF4Data = (data: F4ReportProps['data']): FinancialReportData => {
  const raw = data as unknown as Record<string, unknown>;
  const sections = Object.entries(SECTION_TITLES)
    .map(([id, title]) => {
      const source = raw[id];
      const lines = isRecord(source) && Array.isArray(source.lines) ? source.lines : [];
      return { id, title, lines };
    })
    .filter(section => section.lines.length > 0);

  return {
    ...data,
    sections: sections as FinancialReportData['sections'],
  };
};

export default function F4Report({ data }: F4ReportProps) {
  return (
    <>
      <ReportDetailsHeader data={data as unknown as ReportDetailsHeaderData} />
      <FinancialReportRenderer
        data={normalizeF4Data(data)}
        definitions={F4_LINE_DEFINITIONS}
      />
    </>
  );
}
