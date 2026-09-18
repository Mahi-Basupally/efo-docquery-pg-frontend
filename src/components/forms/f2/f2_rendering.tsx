'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import { getFecImageUrl } from '@/lib/fecImageUtils';
import { formatSignatureName, formatDate } from '@/lib/basicFormattingUtils';

export interface F2InfoLine { lineNumber?: string; description: string; value?: string | number | null; href?: string; }
export interface F2AuthorizedCommitteeLine { lineNumber: string; committeeId?: string; committeeName?: string; committeeAddress?: string; }

export type F2Line = F2InfoLine | F2AuthorizedCommitteeLine;

export interface F2ReportData {
  metadata?: { formTitle?: string; formSubTitle?: string };
  form?: { formType?: string; formatVersion?: string };
  candidate?: {
    id?: string;
    name?: string;
    office?: string;
    party?: string;
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
    changeOfAddress?: boolean;
    election?: { state?: string | null; district?: string | null; year?: string | number | null };
    candidateSignature?: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
  };
  vicePresident?: { lines: F2InfoLine[] };
  principalCommittee?: { lines: F2InfoLine[]; note?: string };
  authorizedCommittees?: { lines: F2AuthorizedCommitteeLine[]; note?: string };
  personalFundsDeclaration?: { lines: F2InfoLine[] };
}

export interface F2ReportProps {
  data: F2ReportData;
}

const AMENDMENT_LABELS: Record<string, string> = { N: 'New', A: 'Amendment', T: 'Termination' };

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
  note?: string;
  columns: ReportTableColumn[];
  lines: F2Line[];
}

const buildCandidateInformationLines = (data: F2ReportData): F2InfoLine[] => {
  const candidate = data.candidate;
  const report = data.report;
  const lines: F2InfoLine[] = [];

  if (candidate?.name) {
    lines.push({ lineNumber: '1. (a)', description: ' Name of Candidate', value: candidate.name });
  }

  const address = candidate?.address;
  const streetValue = [address?.street1, address?.street2].filter(Boolean).join(', ');
  if (streetValue) {
    lines.push({ lineNumber: '1. (b)', description: 'Street Address', value: streetValue });
  }

  const cityStateZip = [address?.city, address?.state, address?.zipCode].filter(Boolean).join(', ');
  if (cityStateZip) {
    lines.push({ lineNumber: '1. (c)', description: 'City, State, ZIP', value: cityStateZip });
  }

  if (report?.changeOfAddress) {
    lines.push({ lineNumber: '', description: 'Change of Address', value: 'Yes' });
  }

  if (candidate?.id) {
    lines.push({ lineNumber: '2', description: 'Candidate ID Number', value: candidate.id });
  }

  if (report?.amendmentIndicator) {
    lines.push({
      lineNumber: '3',
      description: 'Is This Statement New/Amendment ',
      value: AMENDMENT_LABELS[report.amendmentIndicator] ?? report.amendmentIndicator,
    });
  }

  if (candidate?.party) {
    lines.push({ lineNumber: '4', description: 'Party Affiliation', value: candidate.party });
  }

  if (candidate?.office) {
    lines.push({ lineNumber: '5', description: 'Office Sought', value: candidate.office });
  }

  const election = report?.election;
  if (election?.state || election?.district) {
    lines.push({
      lineNumber: '6',
      description: 'State & District of Candidate',
      value: `${election.state || 'N/A'}, ${election.district || 'N/A'}`,
    });
  }

  return lines;
};


const buildSignatureLines = (data: F2ReportData): F2InfoLine[] => {
  const report = data.report;
  const lines: F2InfoLine[] = [];

  const signedBy = formatSignatureName(report?.candidateSignature);
  if (signedBy) lines.push({ description: 'Signature of Candidate', value: signedBy });
  if (report?.dateSigned) lines.push({ description: 'Signature Date', value: formatDate(report.dateSigned) });
  if (report?.filedDate) lines.push({ description: 'Filed Date', value: formatDate(report.filedDate) });
  if (report?.imageNumber) {
    lines.push({ description: 'Image Number', value: report.imageNumber, href: getFecImageUrl(report.imageNumber) });
  }

  return lines;
};

const buildSections = (data: F2ReportData): RenderSection[] => [
  {
    id: 'candidateInformation',
    title: 'Candidate Information',
    columns: infoColumns,
    lines: buildCandidateInformationLines(data),
  },
  {
    id: 'vicePresident',
    title: 'Vice Presidential Candidate',
    columns: twoColumnInfo,
    lines: data.vicePresident?.lines ?? [],
  },
  {
    id: 'principalCommittee',
    title: 'Designation Of Principal Campaign Committee',
    subtitle: 'Primary Committee Information',
    note: data.principalCommittee?.note,
    columns: infoColumns,
    lines: data.principalCommittee?.lines ?? [],
  },
  {
    id: 'authorizedCommittees',
    title: 'Designation Of Other Authorized Committees',
    subtitle: 'Including Joint Fundraising Representatives',
    note: data.authorizedCommittees?.note,
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '10%' },
      { key: 'committeeId', label: 'Committee ID', width: '20%' },
      { key: 'committeeName', label: 'Committee Name', width: '35%' },
      { key: 'committeeAddress', label: 'Address', width: '35%' },
    ],
    lines: data.authorizedCommittees?.lines ?? [],
  },
  {
    id: 'personalFundsDeclaration',
    title: 'Declaration of Intent to Expend Personal Funds',
    subtitle: 'House or Senate Only - I intend to expend personal funds exceeding the threshold amount (see 11 C.F.R. 400.9) by',
    columns: infoColumns,
    lines: data.personalFundsDeclaration?.lines ?? [],
  },
  {
    id: 'signature',
    title: 'Signature',
    columns: twoColumnInfo,
    lines: buildSignatureLines(data),
  },
];

const cellText = (value: unknown): string => (value === null || value === undefined || value === '' ? '-' : String(value));

function buildRows(section: RenderSection): ReportTableRow[] {
  const rows: ReportTableRow[] = [];

  if (section.note) {
    rows.push({
      id: `${section.id}-note`,
      fullWidth: { content: section.note, contentColSpan: section.columns.length },
      style: { fontStyle: 'italic', fontWeight: 400 },
    });
  }

  section.lines.forEach((line, idx) => {
    const record = line as unknown as Record<string, unknown>;
    const href = 'href' in record ? (record.href as string | undefined) : undefined;
    rows.push({
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
          return [col.key, <span style={{ whiteSpace: 'pre-line' }}>{cellText(record[col.key])}</span>];
        })
      ),
    });
  });

  return rows;
}

export default function F2Report({ data }: F2ReportProps) {
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
    </div></div>
  );
}
