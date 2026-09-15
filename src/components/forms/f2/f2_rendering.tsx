'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';

// F2's data-only contract (app/services/forms/f2_service.py): sections carry
// no type/columns/sectionOrder and lines carry no lineOrder - the backend
// already emits everything pre-sorted. Every section reduces to one of two
// shapes - a generic lineNumber/description/value info line, or the
// authorized-committee table's committeeId/committeeName/committeeAddress -
// so this component (not FinancialReportRenderer, which only knows the
// lineNumber/label/value and lineId/lineDescription/thisPeriod/yearToDate
// shapes) knows each section's columns by its id.

export interface F2InfoLine { lineNumber?: string; description: string; value?: string | number | null; }
export interface F2AuthorizedCommitteeLine { lineNumber: string; committeeId?: string; committeeName?: string; committeeAddress?: string; }

export type F2Line = F2InfoLine | F2AuthorizedCommitteeLine;

export interface F2Section {
  id: string;
  title: string;
  subtitle?: string;
  // Only set for principal_committee / authorized_committee (the "I hereby
  // designate/authorize..." legal text) - rendered as a full-width row
  // above the data rows rather than a fake table row.
  note?: string;
  lines: F2Line[];
}

export interface F2ReportData {
  metadata?: { formType?: string; reportId?: string | number; formTitle?: string; formSubTitle?: string };
  candidate?: { candidateId?: string; candidateName?: string; office?: string; party?: string; state?: string; district?: string; electionYear?: string | number };
  sections: F2Section[];
}

export interface F2ReportProps {
  data: F2ReportData;
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

const SECTION_COLUMNS: Record<string, ReportTableColumn[]> = {
  candidate_information: infoColumns,
  vice_president: twoColumnInfo,
  principal_committee: infoColumns,
  authorized_committee: [
    { key: 'lineNumber', label: 'Line #', width: '10%' },
    { key: 'committeeId', label: 'Committee ID', width: '20%' },
    { key: 'committeeName', label: 'Committee Name', width: '35%' },
    { key: 'committeeAddress', label: 'Address', width: '35%' },
  ],
  personal_funds_declaration: infoColumns,
  signature: twoColumnInfo,
};

const cellText = (value: unknown): string => (value === null || value === undefined || value === '' ? '-' : String(value));

function buildRows(section: F2Section, columns: ReportTableColumn[]): ReportTableRow[] {
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

export default function F2Report({ data }: F2ReportProps) {
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
