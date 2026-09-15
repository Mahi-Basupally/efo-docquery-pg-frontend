'use client';

import FinancialReportRenderer, { FinancialReportData } from '../FinancialReportRenderer';
import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import { F3_LINE_DEFINITIONS } from './f3Definition';

export interface F3ReportProps {
  data: F3ReportData | F3ReportResponse;
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

/** API response envelope returned by the production F3 endpoint. */
export interface F3ReportResponse {
  data: F3ReportData;
}

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

/**
 * Normalize the endpoint envelope once at the F3 boundary.
 * The backend contract is { data: { ...F3ReportData } }, while older callers
 * may still pass the inner object directly.
 */
const unwrapF3Data = (input: F3ReportData | F3ReportResponse): F3ReportData => {
  if (isRecord(input) && isRecord(input.data)) {
    return input.data as F3ReportData;
  }
  return input as F3ReportData;
};

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

const committeeColumns: ReportTableColumn[] = [
  { key: 'label', label: 'Description', align: 'left', width: '35%' },
  { key: 'value', label: 'Value', align: 'left', width: '65%' },
];

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

  const rows: ReportTableRow[] = [
    {
      id: 'committee-name',
      cells: { label: 'Committee name:', value: displayValue(committee?.name) },
    },
    {
      id: 'mailing-address',
      cells: {
        label: 'Mailing address:',
        value: (
          <>
            <span className="block">{displayValue(addressLine1)}</span>
            <span className="block">{displayValue(addressLine2)}</span>
          </>
        ),
      },
    },
    {
      id: 'treasurer',
      cells: { label: 'Treasurer:', value: formatTreasurerName(treasurer) },
    },
    {
      id: 'committee-id',
      cells: { label: 'Committee ID:', value: displayValue(committee?.id) },
    },
    {
      id: 'election',
      cells: { label: 'Election:', value: election },
    },
    {
      id: 'report-id',
      cells: { label: 'Report ID:', value: displayValue(report?.reportId) },
    },
    {
      id: 'report-code',
      cells: { label: 'Report code:', value: displayValue(report?.reportCode ?? report?.reportType) },
    },
    {
      id: 'amendment',
      cells: { label: 'Amendment:', value: displayValue(report?.amendmentIndicator) },
    },
    {
      id: 'filed-date',
      cells: { label: 'Filed date:', value: formatDate(report?.filedDate) },
    },
    {
      id: 'coverage-period',
      cells: { label: 'Coverage period:', value: coveragePeriod },
    },
    {
      id: 'date-signed',
      cells: { label: 'Date signed:', value: formatDate(report?.dateSigned) },
    },
  ];

  if (committee?.changeOfAddress) {
    rows.push({
      id: 'change-of-address',
      cells: { label: 'Change of address:', value: 'Yes' },
    });
  }

  return (
    <div className="mb-8">
      <ReportTable
        id="f3-committee-information"
        title="Committee information"
        columns={committeeColumns}
        rows={rows}
        collapsible={false}
      />
    </div>
  );
};

const normalizeF3Data = (input: F3ReportData | F3ReportResponse): FinancialReportData => {
  const source = unwrapF3Data(input);

  if (Array.isArray(source.sections)) {
    return {
      metadata: source.metadata,
      committee: source.committee
        ? {
            id: source.committee.id,
            name: source.committee.name,
            address: source.committee.address as Record<string, string> | undefined,
          }
        : undefined,
      sections: source.sections.map(s => ({
        ...s,
        lines: s.lines.map(line =>
          'lineId' in line
            ? (normalizeFinancialLine(line as F3ApiLine) as typeof line)
            : line,
        ),
      })),
    };
  }

  const financialSections = source.financials?.sections ?? [];
  const sections: F3ApiSection[] = [];

  if (source.summary) {
    sections.push(section('summary', 'Summary', source.summary));
  }

  if (source.receipts) {
    sections.push(section('receipts', 'I. Receipts', source.receipts));
  }

  if (source.disbursements) {
    sections.push(section('disbursements', 'II. Disbursements', source.disbursements));
  }

  if (source.cashSummary) {
    sections.push(section('cashSummary', 'III. Cash Summary', source.cashSummary));
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

  const formType = source.form?.formType ?? source.form?.formName ?? 'F3';
  const reportId = source.report?.reportId;

  return {
    metadata: {
      formType,
      reportId,
      formTitle:
        source.form?.formTitle ??
        source.form?.formName ??
        'Report of Receipts and Disbursements',
      formSubTitle: source.form?.formSubTitle ?? 'For An Authorized Committee',
    },
    committee: source.committee
      ? {
          id: source.committee.id,
          name: source.committee.name,
          address: source.committee.address as Record<string, string> | undefined,
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
  const reportData = unwrapF3Data(data);
  const normalized = normalizeF3Data(reportData);

  return (
    <>
      <F3ReportHeader data={reportData} />
      <FinancialReportRenderer
        data={normalized}
        definitions={F3_LINE_DEFINITIONS}
        formPrefix="f3-line-"
      />
    </>
  );
}
