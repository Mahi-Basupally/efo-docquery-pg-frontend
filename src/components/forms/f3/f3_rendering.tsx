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
export type F3ReportData = Omit<FinancialReportData, 'sections'> & {
  sections?: FinancialReportData['sections'];
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

const normalizeFinancialLine = (line: F3ApiLine): F3ApiLine => ({
  ...line,
  lineId: stableLineId(line.lineId ?? line.id),
  lineNumber: line.lineNumber ?? line.line_number ?? '',
  lineDescription: line.lineDescription ?? line.label ?? line.description ?? '',
});

const normalizeFinancialLines = (lines: unknown): F3ApiLine[] =>
  Array.isArray(lines) ? lines.filter(isRecord).map(normalizeFinancialLine) : [];

const section = (id: string, title: string, lines: unknown, subtitle = ''): F3ApiSection => ({
  id,
  title,
  subtitle,
  lines: normalizeFinancialLines(lines),
});

const formDetailLines = (details: unknown): F3ApiLine[] => {
  if (Array.isArray(details)) {
    return details.filter(isRecord).map(detail => ({ ...detail }));
  }
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
      lineNumber: '',
      label: labelMap[key] ?? key,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
    }));
};

const normalizeF3Data = (input: F3ReportData): FinancialReportData => {
  // Current/legacy response: already in the shared renderer contract.
  if (Array.isArray(input.sections)) {
    return {
      metadata: input.metadata,
      committee: input.committee,
      sections: input.sections.map(s => ({
        ...s,
        lines: s.lines.map(line =>
          'lineId' in line
            ? normalizeFinancialLine(line as F3ApiLine) as typeof line
            : line,
        ),
      })),
    };
  }

  const financialSections = input.financials?.sections ?? [];
  const sections: F3ApiSection[] = [];

  if (input.formDetails) {
    sections.push({
      id: 'formDetails',
      title: 'Form Details',
      subtitle: '',
      lines: formDetailLines(input.formDetails),
    });
  }

  if (financialSections.length) {
    sections.push(...financialSections.map(s => ({
      id: s.id ?? '',
      title: s.title ?? s.id ?? '',
      subtitle: s.subtitle ?? '',
      lines: normalizeFinancialLines(s.lines),
    })));
  } else {
    if (input.receipts) sections.push(section('receipts', 'I. Receipts', input.receipts));
    if (input.disbursements) sections.push(section('disbursements', 'II. Disbursements', input.disbursements));
    if (input.cashSummary) sections.push(section('cashSummary', 'III. Cash Summary', input.cashSummary));
  }

  return {
    metadata: {
      formType: input.form?.type ?? input.form?.formType ?? 'F3',
      reportId: input.report?.reportId as string | number | undefined,
      formTitle: input.form?.title,
      formSubTitle: input.form?.subTitle,
    },
    committee: input.committee,
    sections: sections
      .filter(s => !!s.id && !!s.lines?.length)
      .map(s => ({
        id: s.id!,
        title: s.title ?? s.id!,
        subtitle: s.subtitle,
        lines: s.lines as FinancialReportData['sections'][number]['lines'],
      })),
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
