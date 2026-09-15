'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import { F3_LINE_DEFINITIONS } from './f3Definition';

export interface F3ReportProps {
  data: F3ReportData;
}

/**
 * F3 accepts the new report contract while retaining compatibility with the
 * existing sections-based response during the backend rollout. No shared
 * renderer changes are required for other forms.
 */
export type F3ReportData = FinancialReportData & {
  schemaVersion?: string;
  schemaType?: string;
  form?: { type?: string; title?: string; subTitle?: string; formType?: string };
  report?: Record<string, unknown>;
  formDetails?: Record<string, unknown> | Array<Record<string, unknown>>;
  financials?: {
    sections?: Array<F3ApiSection>;
    [key: string]: unknown;
  };
  receipts?: Array<Record<string, unknown>>;
  disbursements?: Array<Record<string, unknown>>;
  cashSummary?: Array<Record<string, unknown>>;
};

type F3ApiLine = Record<string, unknown>;
type F3ApiSection = {
  id?: string;
  title?: string;
  subtitle?: string;
  lines?: F3ApiLine[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const stableLineId = (value: unknown): string =>
  String(value ?? '').replace(/-order-\d+$/, '');

const normalizeLine = (line: F3ApiLine): F3ApiLine => ({
  ...line,
  lineId: stableLineId(line.lineId ?? line.id),
  lineNumber: line.lineNumber ?? line.line_number ?? '',
  lineDescription: line.lineDescription ?? line.label ?? line.description ?? '',
});

const normalizeLines = (lines: unknown): F3ApiLine[] =>
  Array.isArray(lines) ? lines.filter(isRecord).map(normalizeLine) : [];

const section = (id: string, title: string, lines: unknown, subtitle = ''): F3ApiSection => ({
  id,
  title,
  subtitle,
  lines: normalizeLines(lines),
});

const formDetailLines = (details: unknown): F3ApiLine[] => {
  if (Array.isArray(details)) return normalizeLines(details);
  if (!isRecord(details)) return [];

  const labelMap: Record<string, string> = {
    committeeName: 'Committee Name',
    committeeId: 'FEC Committee ID',
    candidateId: 'Candidate ID',
    candidateName: 'Candidate Name',
    electionState: 'Election State',
    electionDistrict: 'Election District',
    treasurerName: 'Treasurer',
    dateSigned: 'Date Signed',
    filedDate: 'Filed Date',
    reportType: 'Report Type',
    amendmentIndicator: 'Amendment Indicator',
    coveragePeriod: 'Coverage Period',
  };

  return Object.entries(details)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => ({
      lineId: `f3-detail-${key}`,
      lineNumber: '',
      label: labelMap[key] ?? key,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
    }));
};

const normalizeF3Data = (input: F3ReportData): FinancialReportData => {
  // Current/legacy response: already in the renderer contract.
  if (Array.isArray(input.sections)) {
    return {
      metadata: input.metadata,
      committee: input.committee,
      sections: input.sections.map(s => ({
        ...s,
        lines: s.lines.map(line =>
          'lineId' in line
            ? normalizeLine(line as F3ApiLine) as typeof line
            : line,
        ),
      })),
    };
  }

  const api = input as F3ReportData;
  const financialSections = api.financials?.sections ?? [];
  const sections: F3ApiSection[] = [];

  if (api.formDetails) {
    sections.push(section('formDetails', 'Form Details', formDetailLines(api.formDetails)));
  }

  if (financialSections.length) {
    sections.push(...financialSections.map(s => ({
      id: s.id ?? '',
      title: s.title ?? s.id ?? '',
      subtitle: s.subtitle ?? '',
      lines: normalizeLines(s.lines),
    })));
  } else {
    if (api.receipts) sections.push(section('receipts', 'I. Receipts', api.receipts));
    if (api.disbursements) sections.push(section('disbursements', 'II. Disbursements', api.disbursements));
    if (api.cashSummary) sections.push(section('cashSummary', 'III. Cash Summary', api.cashSummary));
  }

  return {
    metadata: {
      formType: api.form?.type ?? api.form?.formType ?? 'F3',
      reportId: api.report?.reportId as string | number | undefined,
      formTitle: api.form?.title,
      formSubTitle: api.form?.subTitle,
    },
    committee: api.committee,
    sections: sections
      .filter(s => !!s.id && !!s.lines?.length)
      .map(s => ({ id: s.id!, title: s.title ?? s.id!, subtitle: s.subtitle, lines: s.lines as never[] })),
  };
};

export default function F3Report({ data }: F3ReportProps) {
  const normalized = normalizeF3Data(data);
  return (
    <FinancialReportRenderer
      data={normalized}
      definitions={F3_LINE_DEFINITIONS}
      formPrefix="f3-line-"
    />
  );
}
