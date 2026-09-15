'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';

// F1's data-only contract (app/services/forms/f1_service.py): sections carry
// no type/columns/sectionOrder and lines carry no lineOrder - the backend
// already emits everything pre-sorted. Unlike F3/F3X/F4/etc. each section
// here has its own semantically-named fields rather than one shared
// lineNumber/label/value or lineId/lineDescription/thisPeriod/yearToDate
// shape, so this component (not FinancialReportRenderer) knows every
// section's columns by its id.

export interface F1InfoLine { lineNumber?: string; description: string; value?: string | number | null; }
export interface F1JointFundraiserLine { lineNumber: string; jfCommitteeId?: string; jfCommitteeName?: string; jfCommitteeType?: string; }
export interface F1AffiliatedLine { lineNumber: string; connectedCmteOrgId?: string; connectedCmteOrgName?: string; connectedCmteOrgAddress?: string; connectedCmteOrgRelationship?: string; }
export interface F1CustodianLine { lineNumber: string; custodianTitle?: string; custodianName?: string; custodianAddress?: string; custodianPhoneNumber?: string; }
export interface F1TreasurerLine { lineNumber: string; treasurerTitle?: string; treasurerName?: string; treasurerAddress?: string; treasurerPhoneNumber?: string; }
export interface F1BankLine { lineNumber: string; bankName?: string; bankAddress?: string; }
export interface F1SignatureLine { description: string; value?: string | null; }

export type F1Line =
  | F1InfoLine
  | F1JointFundraiserLine
  | F1AffiliatedLine
  | F1CustodianLine
  | F1TreasurerLine
  | F1BankLine
  | F1SignatureLine;

export interface F1Section {
  id: string;
  title: string;
  subtitle?: string;
  // Only set for joint_fundraiser today (the "this committee collects
  // contributions..." legal text for committee type I/J) - rendered as a
  // full-width row above the data rows rather than a fake table row.
  note?: string;
  lines: F1Line[];
}

export interface F1ReportData {
  metadata?: { formType?: string; reportId?: string | number; formTitle?: string; formSubTitle?: string };
  committee?: { id?: string; name?: string; address?: Record<string, string> };
  sections: F1Section[];
}

export interface F1ReportProps {
  data: F1ReportData;
}

const infoColumns: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', width: '10%' },
  { key: 'description', label: 'Description', width: '60%' },
  { key: 'value', label: 'Value', width: '30%' },
];

const SECTION_COLUMNS: Record<string, ReportTableColumn[]> = {
  committee_information: infoColumns,
  committee_type: infoColumns,
  joint_fundraiser: [
    { key: 'lineNumber', label: 'Line #', width: '10%' },
    { key: 'jfCommitteeId', label: 'Committee ID', width: '20%' },
    { key: 'jfCommitteeName', label: 'Committee Name', width: '45%' },
    { key: 'jfCommitteeType', label: 'Committee Type', width: '25%' },
  ],
  affiliated_committee: [
    { key: 'lineNumber', label: 'Line #', width: '10%' },
    { key: 'connectedCmteOrgId', label: 'ID', width: '15%' },
    { key: 'connectedCmteOrgName', label: 'Name', width: '30%' },
    { key: 'connectedCmteOrgAddress', label: 'Address', width: '30%' },
    { key: 'connectedCmteOrgRelationship', label: 'Relationship', width: '15%' },
  ],
  custodian: [
    { key: 'lineNumber', label: 'Line #', width: '10%' },
    { key: 'custodianTitle', label: 'Title', width: '15%' },
    { key: 'custodianName', label: 'Name', width: '25%' },
    { key: 'custodianAddress', label: 'Address', width: '35%' },
    { key: 'custodianPhoneNumber', label: 'Telephone Number', width: '15%' },
  ],
  treasurer: [
    { key: 'lineNumber', label: 'Line #', width: '10%' },
    { key: 'treasurerTitle', label: 'Title', width: '15%' },
    { key: 'treasurerName', label: 'Name', width: '25%' },
    { key: 'treasurerAddress', label: 'Address', width: '35%' },
    { key: 'treasurerPhoneNumber', label: 'Telephone Number', width: '15%' },
  ],
  banks: [
    { key: 'lineNumber', label: 'Line #', width: '15%' },
    { key: 'bankName', label: 'Bank Name', width: '35%' },
    { key: 'bankAddress', label: 'Address', width: '50%' },
  ],
  signature: [
    { key: 'description', label: 'Description', width: '50%' },
    { key: 'value', label: 'Value', width: '50%' },
  ],
};

const cellText = (value: unknown): string => (value === null || value === undefined || value === '' ? '-' : String(value));

function buildRows(section: F1Section, columns: ReportTableColumn[]): ReportTableRow[] {
  const rows: ReportTableRow[] = [];

  if (section.note) {
    rows.push({
      id: `${section.id}-note`,
      fullWidth: { content: section.note, contentColSpan: columns.length },
      style: { fontStyle: 'italic', fontWeight: 400 },
    });
  }

  section.lines.forEach((line, idx) => {
    const record = line as unknown as Record<string, unknown>;
    rows.push({
      id: `${section.id}-${idx}`,
      cells: Object.fromEntries(
        columns.map((col) => [col.key, <span style={{ whiteSpace: 'pre-line' }}>{cellText(record[col.key])}</span>])
      ),
    });
  });

  return rows;
}

export default function F1Report({ data }: F1ReportProps) {
  return (
    <div>
      {data.sections.map((section) => {
        const columns = SECTION_COLUMNS[section.id] ?? infoColumns;
        return (
          <ReportTable
            key={section.id}
            id={section.id}
            title={section.title}
            subtitle={section.subtitle}
            columns={columns}
            rows={buildRows(section, columns)}
            emptyMessage="No data available."
          />
        );
      })}
    </div>
  );
}
