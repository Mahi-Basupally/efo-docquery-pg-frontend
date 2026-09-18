'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import { getFecImageUrl } from '@/lib/fecImageUtils';
import { formatSignatureName, formatDate } from '@/lib/basicFormattingUtils';



export interface F1InfoLine { lineNumber?: string; description: string; value?: string | number | null; href?: string; }
export interface F1JointFundraiserLine { lineNumber: string; jfCommitteeId?: string; jfCommitteeName?: string; jfCommitteeType?: string; }
export interface F1AffiliatedLine { lineNumber: string; connectedCmteOrgId?: string; connectedCmteOrgName?: string; connectedCmteOrgAddress?: string; connectedCmteOrgRelationship?: string; }
export interface F1CustodianLine { lineNumber: string; custodianTitle?: string; custodianName?: string; custodianAddress?: string; custodianPhoneNumber?: string; }
export interface F1TreasurerLine { lineNumber: string; treasurerTitle?: string; treasurerName?: string; treasurerAddress?: string; treasurerPhoneNumber?: string; }
export interface F1BankLine { lineNumber: string; bankName?: string; bankAddress?: string; }


export interface F1ReportData {
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
    changeOfAddress?: boolean;
    changeOfName?: boolean;
    email?: string | null;
    changeOfEmail?: boolean;
    website?: string | null;
    changeOfWebsite?: boolean;
  };
  report?: {
    reportId?: string | number;
    amendmentIndicator?: string;
    effectiveDate?: string | null;
    dateSigned?: string | null;
    filedDate?: string | null;
    imageNumber?: number | string | null;
    treasurerSignature?: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
  };
  committeeType?: { lines: F1InfoLine[] };
  jointFundraisers?: { lines: F1JointFundraiserLine[]; note?: string };
  affiliatedCommittees?: { lines: F1AffiliatedLine[] };
  custodianOfRecords?: { lines: F1CustodianLine[] };
  treasurer?: { lines: F1TreasurerLine[] };
  banksDepositories?: { lines: F1BankLine[] };
}

export interface F1ReportProps {
  data: F1ReportData;
}

const AMENDMENT_LABELS: Record<string, string> = { N: 'New', A: 'Amendment', T: 'Termination' };


const infoColumns: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', width: '10%' },
  { key: 'description', label: 'Description', width: '60%' },
  { key: 'value', label: 'Value', width: '30%' },
];

interface RenderSection {
  id: string;
  title: string;
  subtitle?: string;
  note?: string;
  columns: ReportTableColumn[];
  lines: unknown[];
}

const buildCommitteeInformationLines = (data: F1ReportData): F1InfoLine[] => {
  const committee = data.committee;
  const report = data.report;
  const lines: F1InfoLine[] = [
    { lineNumber: '1', description: 'Name of Committee', value: committee?.name ?? '' },
  ];

  if (committee?.changeOfName) {
    lines.push({ lineNumber: '', description: 'Change of Committee Name', value: 'Yes' });
  }

  const address = committee?.address;
  const addressLines = [address?.street1, address?.street2].filter(Boolean);
  const cityStateZip = [address?.city, address?.state, address?.zipCode].filter(Boolean).join(', ');
  if (cityStateZip) addressLines.push(cityStateZip);
  lines.push({ lineNumber: '', description: 'Address', value: addressLines.join('\n') });

  if (committee?.changeOfAddress) {
    lines.push({ lineNumber: '', description: 'Change of Address', value: 'Yes' });
  }

  if (committee?.email) {
    lines.push({ lineNumber: '', description: 'Committee Email', value: committee.email });
    if (committee.changeOfEmail) {
      lines.push({ lineNumber: '', description: 'Change of Email', value: 'Yes' });
    }
  }

  lines.push({ lineNumber: '', description: 'Committee Website', value: committee?.website ?? '' });
  if (committee?.changeOfWebsite) {
    lines.push({ lineNumber: '', description: 'Change of Website', value: 'Yes' });
  }

  lines.push({ lineNumber: '2', description: 'Effective Date', value: formatDate(report?.effectiveDate) ?? '' });
  lines.push({ lineNumber: '3', description: 'FEC Committee ID Number', value: committee?.id ?? '' });
  lines.push({
    lineNumber: '4',
    description: 'This Statement is',
    value: report?.amendmentIndicator ? AMENDMENT_LABELS[report.amendmentIndicator] ?? report.amendmentIndicator : '',
  });

  return lines;
};

const buildSignatureLines = (data: F1ReportData): F1InfoLine[] => {
  const report = data.report;
  const lines: F1InfoLine[] = [];

  const signedBy = formatSignatureName(report?.treasurerSignature);
  if (signedBy) lines.push({ description: 'Signed By Treasurer', value: signedBy });
  if (report?.dateSigned) lines.push({ description: 'Date Signed', value: formatDate(report.dateSigned) });
  if (report?.filedDate) lines.push({ description: 'Filed Date', value: formatDate(report.filedDate) });
  if (report?.imageNumber) {
    lines.push({ description: 'Image Number', value: report.imageNumber, href: getFecImageUrl(report.imageNumber) });
  }

  return lines;
};

const buildSections = (data: F1ReportData): RenderSection[] => [
  {
    id: 'committeeInformation',
    title: 'Committee Information',
    columns: infoColumns,
    lines: buildCommitteeInformationLines(data),
  },
  {
    id: 'committeeType',
    title: 'Committee Type',
    columns: infoColumns,
    lines: data.committeeType?.lines ?? [],
  },
  {
    id: 'jointFundraisers',
    title: 'Joint Fundraising Representatives',
    subtitle: 'Committees Participating in Joint Fundraiser',
    note: data.jointFundraisers?.note,
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '10%' },
      { key: 'jfCommitteeId', label: 'Committee ID', width: '20%' },
      { key: 'jfCommitteeName', label: 'Committee Name', width: '45%' },
      { key: 'jfCommitteeType', label: 'Committee Type', width: '25%' },
    ],
    lines: data.jointFundraisers?.lines ?? [],
  },
  {
    id: 'affiliatedCommittees',
    title: 'Connected Organizations or Committee',
    subtitle: 'Any Connected Organization, Affiliated Committee, Joint Fundraising Representative, or Leadership PAC Sponsor',
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '10%' },
      { key: 'connectedCmteOrgId', label: 'ID', width: '15%' },
      { key: 'connectedCmteOrgName', label: 'Name', width: '30%' },
      { key: 'connectedCmteOrgAddress', label: 'Address', width: '30%' },
      { key: 'connectedCmteOrgRelationship', label: 'Relationship', width: '15%' },
    ],
    lines: data.affiliatedCommittees?.lines ?? [],
  },
  {
    id: 'custodianOfRecords',
    title: 'Custodian of Records',
    subtitle: 'Person in possession of committee books and records.',
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '10%' },
      { key: 'custodianTitle', label: 'Title', width: '15%' },
      { key: 'custodianName', label: 'Name', width: '25%' },
      { key: 'custodianAddress', label: 'Address', width: '35%' },
      { key: 'custodianPhoneNumber', label: 'Telephone Number', width: '15%' },
    ],
    lines: data.custodianOfRecords?.lines ?? [],
  },
  {
    id: 'treasurer',
    title: 'Treasurer and any designated agents',
    subtitle: 'Treasurer of the committee; and the name and address of any designated agent (e.g., assistant treasurer)',
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '10%' },
      { key: 'treasurerTitle', label: 'Title', width: '15%' },
      { key: 'treasurerName', label: 'Name', width: '25%' },
      { key: 'treasurerAddress', label: 'Address', width: '35%' },
      { key: 'treasurerPhoneNumber', label: 'Telephone Number', width: '15%' },
    ],
    lines: data.treasurer?.lines ?? [],
  },
  {
    id: 'banksDepositories',
    title: 'Banks/Depositories',
    subtitle: 'Campaign Depository',
    columns: [
      { key: 'lineNumber', label: 'Line #', width: '15%' },
      { key: 'bankName', label: 'Bank Name', width: '35%' },
      { key: 'bankAddress', label: 'Address', width: '50%' },
    ],
    lines: data.banksDepositories?.lines ?? [],
  },
  {
    id: 'signature',
    title: 'Signature',
    columns: [
      { key: 'description', label: 'Description', width: '50%' },
      { key: 'value', label: 'Value', width: '50%' },
    ],
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

export default function F1Report({ data }: F1ReportProps) {
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
