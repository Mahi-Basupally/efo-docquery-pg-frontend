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
type F3Treasurer = NonNullable<NonNullable<F3ReportData['report']>['treasurer']>;

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

const displayValue = (value: unknown, fallback = '—'): string => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const formatDate = (value: unknown): string => {
  if (!value) return '—';
  const text = String(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : text;
};

const formatTreasurerName = (treasurer?: F3Treasurer): string => {
  if (!treasurer) return '—';

  const parts = [
    treasurer.prefix,
    treasurer.firstName,
    treasurer.middleName,
    treasurer.lastName,
    treasurer.suffix,
  ]
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(String);

  return parts.length ? parts.join(' ') : '—';
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
    <dd className="mt-1 break-words text-sm font-medium text-gray-900">{value}</dd>
  </div>
);

const F3ReportHeader = ({ data }: { data: F3ReportData }) => {
  const committee = data.committee;
  const report = data.report;
  const address = committee?.address;

  const addressLine = [address?.street1, address?.street2]
    .filter(Boolean)
    .map(String)
    .join(', ');
  const cityStateZip = [address?.city, address?.state, address?.zipCode]
    .filter(Boolean)
    .map(String)
    .join(', ')
    .replace(/, ([A-Z]{2}), /, ' $1 ');

  return (
    <div className="mb-8 space-y-4" aria-label="F3 report details">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
            Committee Details
          </h3>
          <dl className="grid grid-cols-1 gap-3">
            <DetailItem label="Committee ID" value={displayValue(committee?.id)} />
            <DetailItem label="Committee Name" value={displayValue(committee?.name)} />
            <DetailItem label="Address" value={displayValue(addressLine)} />
            <DetailItem label="City / State / ZIP" value={displayValue(cityStateZip)} />
            {committee?.changeOfAddress && (
              <DetailItem label="Change of Address" value="Yes" />
            )}
          </dl>
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
            Report Details
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <DetailItem label="Report ID" value={displayValue(report?.reportId)} />
            <DetailItem label="Form" value={displayValue(data.form?.formType, 'F3')} />
            <DetailItem label="Report Code" value={displayValue(report?.reportCode ?? report?.reportType)} />
            <DetailItem label="Amendment" value={displayValue(report?.amendmentIndicator)} />
            <DetailItem label="Filed Date" value={formatDate(report?.filedDate)} />
            <DetailItem
              label="Election"
              value={
                report?.election?.state && report?.election?.district
                  ? `${report.election.state}-${report.election.district}`
                  : displayValue(report?.election?.state ?? report?.election?.district)
              }
            />
            <div className="col-span-2">
              <DetailItem
                label="Coverage Period"
                value={`${formatDate(report?.coveragePeriod?.from)} – ${formatDate(report?.coveragePeriod?.through)}`}
              />
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-4 border-b border-gray-100 pb-2 text-base font-semibold text-gray-900">
            Treasurer Details
          </h3>
          <dl className="grid grid-cols-1 gap-3">
            <DetailItem label="Treasurer" value={formatTreasurerName(report?.treasurer)} />
            <DetailItem label="Date Signed" value={formatDate(report?.dateSigned)} />
          </dl>
        </section>
      </div>
    </div>
  );
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
    <>
      <F3ReportHeader data={data} />
      <FinancialReportRenderer
        data={normalized}
        definitions={F3_LINE_DEFINITIONS}
        formPrefix="f3-line-"
      />
    </>
  );
}
