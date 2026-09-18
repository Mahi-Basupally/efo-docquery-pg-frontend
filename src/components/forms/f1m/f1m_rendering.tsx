'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import { getFecImageUrl } from '@/lib/fecImageUtils';
import { formatSignatureName, formatDate } from '@/lib/basicFormattingUtils';

export interface F1MInfoLine { lineNumber?: string; description: string; value?: string | number | null; href?: string; }
export interface F1MNoteLine { lineNumber?: string; note: string; }
export interface F1MCandidateLine { lineNumber: string; candidateId?: string; candidateName?: string; candidateOffice?: string; contributionDate?: string; }

export type F1MLine = F1MInfoLine | F1MNoteLine | F1MCandidateLine;

export interface F1MReportData {
  metadata?: { formTitle?: string; formSubTitle?: string };
  form?: { formType?: string; formatVersion?: string };
  committee?: {
    id?: string;
    name?: string;
    address?: {
      street1?: string | null;
      street2?: string | null;
      city?: string | null;
      state?: string | null;
      zipCode?: string | null;
    };
  };
  report?: {
    reportId?: string | number;
    amendmentIndicator?: string;
    filedDate?: string | null;
    dateSigned?: string | null;
    imageNumber?: number | string | null;
    committeeType?: string;
    affiliationDate?: string | null;
    affiliatedCommitteeId?: string | null;
    affiliatedCommitteeName?: string | null;
    contributor51Date?: string | null;
    originalRegistrationDate?: string | null;
    metRequirementDate?: string | null;
    treasurerSignature?: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
  };
  statusByAffiliation?: { lines: F1MLine[] };
  candidates?: { lines: F1MLine[] };
}

export interface F1MReportProps {
  data: F1MReportData;
}

const infoColumns: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', width: '10%' },
  { key: 'description', label: 'Description', width: '60%' },
  { key: 'value', label: 'Value', width: '30%' },
];

const twoColumnInfo: ReportTableColumn[] = [
  { key: 'description', label: 'Description', width: '50%' },
  { key: 'value', label: 'Value', width: '50%' },
];

interface RenderSection {
  id: string;
  title: string;
  subtitle?: string;
  columns: ReportTableColumn[];
  lines: F1MLine[];
}

const buildCommitteeInformationLines = (data: F1MReportData): F1MInfoLine[] => {
  const committee = data.committee;
  const report = data.report;
  const lines: F1MInfoLine[] = [];

  if (committee?.name) {
    lines.push({ lineNumber: '1. (a)', description: 'Committee Name', value: committee.name });
  }

  const address = committee?.address;
  if (address?.street1) {
    lines.push({ lineNumber: '1. (b)', description: 'Street Address', value: address.street1 });
  }
  if (address?.street2) {
    lines.push({ lineNumber: '', description: 'Street Address Line 2', value: address.street2 });
  }

  const cityStateZip = [address?.city, address?.state, address?.zipCode].filter(Boolean).join(', ');
  if (cityStateZip) {
    lines.push({ lineNumber: '1. (c)', description: 'City, State, ZIP', value: cityStateZip });
  }

  if (committee?.id) {
    lines.push({ lineNumber: '2', description: 'Committee ID', value: committee.id });
  }

  lines.push({ lineNumber: '3', description: 'Committee Type', value: report?.committeeType ?? '' });

  if (report?.affiliationDate) {
    lines.push({ description: 'Affiliation Date', value: formatDate(report.affiliationDate) });
  }
  if (report?.contributor51Date) {
    lines.push({ description: 'Contributor 51 Date', value: formatDate(report.contributor51Date) });
  }
  if (report?.originalRegistrationDate) {
    lines.push({ description: 'Original Registration Date', value: formatDate(report.originalRegistrationDate) });
  }
  if (report?.metRequirementDate) {
    lines.push({ description: 'Met Requirement Date', value: formatDate(report.metRequirementDate) });
  }

  return lines;
};




const buildSignatureLines = (data: F1MReportData): F1MInfoLine[] => {
  const report = data.report;
  const lines: F1MInfoLine[] = [];

  const signedBy = formatSignatureName(report?.treasurerSignature);
  if (signedBy) lines.push({ description: 'Signed By Treasurer', value: signedBy });
  if (report?.dateSigned) lines.push({ description: 'Date Signed', value: formatDate(report.dateSigned) });
  if (report?.filedDate) lines.push({ description: 'Filed Date', value: formatDate(report.filedDate) });
  if (report?.imageNumber) {
    lines.push({ description: 'Image Number', value: report.imageNumber, href: getFecImageUrl(report.imageNumber) });
  }

  return lines;
};

const buildSections = (data: F1MReportData): RenderSection[] => [
  {
    id: 'committeeInformation',
    title: 'Committee Information',
    subtitle: 'Information about the multicandidate committee',
    columns: infoColumns,    
    lines: [...buildCommitteeInformationLines(data), ...(data.statusByAffiliation?.lines ?? [])],
  },
  {
    id: 'candidates',
    title: 'STATUS BY QUALIFICATION',
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '10%' },
      { key: 'candidateId', label: 'Candidate ID', width: '15%' },
      { key: 'candidateName', label: 'Candidate Name', width: '30%' },
      { key: 'candidateOffice', label: 'Office-State-District', width: '30%' },
      { key: 'contributionDate', label: 'Contribution Date', width: '15%' },
    ],
    lines: data.candidates?.lines ?? [],
  },
  {
    id: 'signature',
    title: 'Signature',
    columns: twoColumnInfo,
    lines: buildSignatureLines(data),
  },
];

const isNoteLine = (line: F1MLine): line is F1MNoteLine => 'note' in line && line.note !== undefined;
const cellText = (value: unknown): string => (value === null || value === undefined || value === '' ? '-' : String(value));

function buildRows(section: RenderSection): ReportTableRow[] {
  return section.lines.map((line, idx) => {
    if (isNoteLine(line)) {
      return {
        id: `${section.id}-${idx}`,
        fullWidth: { lead: line.lineNumber || undefined, content: line.note },
        style: { fontStyle: 'italic', fontWeight: 400 },
      };
    }

    const record = line as unknown as Record<string, unknown>;
    const href = 'href' in record ? (record.href as string | undefined) : undefined;
    return {
      id: `${section.id}-${idx}`,
      cells: Object.fromEntries(
        section.columns.map((col) => {
          if (col.key === 'value' && href) {
            return [col.key, (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
                {cellText(record[col.key])}
              </a>
            )];
          }
          const value = col.key === 'contributionDate'
            ? formatDate(record[col.key] as string) || '-'
            : cellText(record[col.key]);
          return [col.key, <span style={{ whiteSpace: 'pre-line' }}>{value}</span>];
        })
      ),
    };
  });
}

export default function F1MReport({ data }: F1MReportProps) {
  return (
    <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
      <div className="entity__figure entity__figure--narrow">      
      {buildSections(data)
        .filter((section) => section.lines.length > 0)
        .map((section) => (
          <ReportTable
            key={section.id}
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            columns={section.columns}
            rows={buildRows(section)}
            emptyMessage="No data available."
          />
        ))}
    </div>
    </div>
  );
}
