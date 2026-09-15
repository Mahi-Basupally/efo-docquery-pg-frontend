'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import { F3_LINE_DEFINITIONS } from './f3Definition';

export interface F3ReportProps {
  data: F3ReportData;
}

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

const FigureRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <tr>
    <td className="w-1/4 align-top px-3 py-2 text-sm font-semibold text-gray-700">
      {label}
    </td>
    <td className="align-top px-3 py-2 text-sm text-gray-900">
      {children}
    </td>
  </tr>
);

const F3ReportHeader = ({ data }: { data: F3ReportData }) => {
  const committee = data.committee;
  const report = data.report;
  const address = committee?.address;
  const treasurer = report?.treasurer;

  const addressLine1 = [address?.street1, address?.street2]
    .filter(Boolean)
    .map(String)
    .join(', ');
  const addressLine2 = [address?.city, address?.state, address?.zipCode]
    .filter(Boolean)
    .map(String)
    .join(', ')
    .replace(/, ([A-Z]{2}), /, ' $1 ');

  const election =
    report?.election?.state && report?.election?.district
      ? `${report.election.state} - ${report.election.district}`
      : displayValue(report?.election?.state ?? report?.election?.district);

  const coveragePeriod = `${formatDate(report?.coveragePeriod?.from)} – ${formatDate(
    report?.coveragePeriod?.through,
  )}`;

  return (
    <div className="entity__figure row mb-8">
      <h3 className="heading--section mb-3 text-lg font-semibold text-gray-900">
        Committee information
      </h3>

      <div className="overflow-x-auto">
        <table className="t-sans w-full max-w-4xl border-collapse text-left">
          <tbody>
            <FigureRow label="Committee name:">
              {displayValue(committee?.name)}
            </FigureRow>

            <FigureRow label="Mailing address:">
              <span className="t-block block">{displayValue(addressLine1)}</span>
              <span className="t-block block">{displayValue(addressLine2)}</span>
            </FigureRow>

            <FigureRow label="Treasurer:">
              {formatTreasurerName(treasurer)}
            </FigureRow>

            <FigureRow label="Committee ID:">
              {displayValue(committee?.id)}
            </FigureRow>

            <FigureRow label="Election:">
              {election}
            </FigureRow>

            <FigureRow label="Report ID:">
              {displayValue(report?.reportId)}
            </FigureRow>

            <FigureRow label="Report code:">
              {displayValue(report?.reportCode ?? report?.reportType)}
            </FigureRow>

            <FigureRow label="Amendment:">
              {displayValue(report?.amendmentIndicator)}
            </FigureRow>

            <FigureRow label="Filed date:">
              {formatDate(report?.filedDate)}
            </FigureRow>

            <FigureRow label="Coverage period:">
              {coveragePeriod}
            </FigureRow>

            <FigureRow label="Date signed:">
              {formatDate(report?.dateSigned)}
            </FigureRow>

            {committee?.changeOfAddress && (
              <FigureRow label="Change of address:">Yes</FigureRow>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const normalizeF3Data = (input: F3ReportData): FinancialReportData => {
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
