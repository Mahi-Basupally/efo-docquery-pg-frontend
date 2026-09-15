'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import { F3_LINE_DEFINITIONS } from './f3Definition';

export interface F3ReportProps {
  data: F3ReportData;
}

/**
 * F3 API contract.
 *
 * The backend owns report data. F3-specific presentation metadata remains in
 * f3Definition.ts. This adapter converts the F3 API contract into the shared
 * FinancialReportRenderer contract without changing any other form.
 */
export type F3ReportData = Omit<FinancialReportData, 'sections'> & {
  sections?: FinancialReportData['sections'];
  schemaVersion?: string;
  schemaType?: string;
  form?: {
    formType?: string;
    formVersion?: string;
    formName?: string;
    formTitle?: string;
    formSubTitle?: string;
  };
  report?: {
    reportId?: string | number;
    committeeId?: string;
    reportNumber?: string | number | null;
    reportCode?: string;
    reportType?: string;
    reportTypeDescription?: string;
    amendmentIndicator?: string;
    fileNumber?: string | number | null;
    filedDate?: string | null;
    coveragePeriod?: {
      from?: string | null;
      through?: string | null;
    };
    election?: {
      state?: string | null;
      district?: string | null;
    };
    treasurer?: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
    dateSigned?: string | null;
    [key: string]: unknown;
  };
  committee?: {
    id?: string;
    name?: string;
    address?: Record<string, string | null>;
    changeOfAddress?: boolean;
  };
  summary?: F3ApiSection;
  receipts?: F3ApiSection;
  disbursements?: F3ApiSection;
  cashSummary?: F3ApiSection;
  financials?: {
    sections?: F3ApiSection[];
    [key: string]: unknown;
  };
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

const normalizeFinancialLine = (line: F3ApiLine): F3ApiLine => {
  const lineId = stableLineId(line.lineId ?? line.id);
  const definition = F3_LINE_DEFINITIONS[lineId];

  return {
    ...line,
    lineId,
    lineNumber: line.lineNumber ?? line.line_number ?? '',
    lineDescription:
      line.lineDescription ??
      line.label ??
      line.description ??
      definition?.label ??
      '',
  };
};

const normalizeFinancialLines = (lines: unknown): F3ApiLine[] =>
  Array.isArray(lines) ? lines.filter(isRecord).map(normalizeFinancialLine) : [];

const section = (
  id: string,
  title: string,
  source: unknown,
  subtitle = '',
): F3ApiSection => {
  const lines = isRecord(source) ? source.lines : source;

  return {
    id,
    title,
    subtitle,
    lines: normalizeFinancialLines(lines),
  };
};

const normalizeF3Data = (input: F3ReportData): FinancialReportData => {
  // Legacy/current sections-based response remains supported during rollout.
  if (Array.isArray(input.sections)) {
    return {
      metadata: input.metadata,
      committee: input.committee
        ? {
            id: input.committee.id,
            name: input.committee.name,
            address: input.committee.address as Record<string, string> | undefined,
          }
        : undefined,
      sections: input.sections.map(s => ({
        ...s,
        lines: s.lines.map(line =>
          'lineId' in line
            ? (normalizeFinancialLine(line as F3ApiLine) as typeof line)
            : line,
        ),
      })),
    };
  }

  const financialSections = input.financials?.sections ?? [];
  const sections: F3ApiSection[] = [];

  // Preferred F3 contract: each financial section is a top-level object with
  // a lines[] array. This keeps the API JSON easy to consume and avoids a
  // generic financials.sections wrapper.
  if (input.summary) {
    sections.push(section('summary', 'Summary', input.summary));
  }

  if (input.receipts) {
    sections.push(section('receipts', 'I. Receipts', input.receipts));
  }

  if (input.disbursements) {
    sections.push(section('disbursements', 'II. Disbursements', input.disbursements));
  }

  if (input.cashSummary) {
    sections.push(section('cashSummary', 'III. Cash Summary', input.cashSummary));
  }

  // Backward compatibility for the intermediate backend contract.
  if (!sections.length && financialSections.length) {
    sections.push(
      ...financialSections.map(s => ({
        id: s.id ?? '',
        title: s.title ?? s.id ?? '',
        subtitle: s.subtitle ?? '',
        lines: normalizeFinancialLines(s.lines),
      })),
    );
  }

  const formType = input.form?.formType ?? input.form?.formName ?? 'F3';
  const reportId = input.report?.reportId;

  return {
    metadata: {
      formType,
      reportId,
      formTitle:
        input.form?.formTitle ??
        input.form?.formName ??
        'Report of Receipts and Disbursements',
      formSubTitle: input.form?.formSubTitle ?? 'For An Authorized Committee',
    },
    committee: input.committee
      ? {
          id: input.committee.id,
          name: input.committee.name,
          address: input.committee.address as Record<string, string> | undefined,
        }
      : undefined,
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
