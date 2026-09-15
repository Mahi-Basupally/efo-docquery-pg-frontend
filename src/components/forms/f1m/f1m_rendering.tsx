'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';

// F1M's data-only contract (app/services/forms/f1m_service.py): sections
// carry no type/columns/sectionOrder and lines carry no displayOrder - the
// backend already emits everything pre-sorted. Instructional/legal-text
// lines (formerly "type": "merge") are inline {lineNumber?, note} lines
// rather than a section-level note, since committee_info and candidates
// each interleave several of these among their data rows. Like F1/F2, this
// doesn't fit FinancialReportRenderer's fixed line shapes, so this
// component knows each section's columns by its id.

export interface F1MInfoLine { lineNumber?: string; description: string; value?: string | number | null; }
export interface F1MNoteLine { lineNumber?: string; note: string; }
export interface F1MCandidateLine { lineNumber: string; candidateId?: string; candidateName?: string; candidateOffice?: string; contributionDate?: string; }

export type F1MLine = F1MInfoLine | F1MNoteLine | F1MCandidateLine;

export interface F1MSection {
  id: string;
  title: string;
  subtitle?: string;
  lines: F1MLine[];
}

export interface F1MReportData {
  metadata?: { formType?: string; reportId?: string | number; formTitle?: string; formSubTitle?: string };
  committee?: { committeeName?: string; committeeAddress?: string };
  sections: F1MSection[];
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

const SECTION_COLUMNS: Record<string, ReportTableColumn[]> = {
  committee_information: infoColumns,
  candidates: [
    { key: 'lineNumber', label: 'Line #', width: '10%' },
    { key: 'candidateId', label: 'Candidate ID', width: '15%' },
    { key: 'candidateName', label: 'Candidate Name', width: '30%' },
    { key: 'candidateOffice', label: 'Office-State-District', width: '30%' },
    { key: 'contributionDate', label: 'Contribution Date', width: '15%' },
  ],
  signature: twoColumnInfo,
};

const isNoteLine = (line: F1MLine): line is F1MNoteLine => 'note' in line && line.note !== undefined;
const cellText = (value: unknown): string => (value === null || value === undefined || value === '' ? '-' : String(value));

function buildRows(section: F1MSection, columns: ReportTableColumn[]): ReportTableRow[] {
  return section.lines.map((line, idx) => {
    if (isNoteLine(line)) {
      return {
        id: `${section.id}-${idx}`,
        fullWidth: { content: line.note, contentColSpan: columns.length },
        style: { fontStyle: 'italic', fontWeight: 400 },
      };
    }

    const record = line as unknown as Record<string, unknown>;
    return {
      id: `${section.id}-${idx}`,
      cells: Object.fromEntries(
        columns.map((col) => [col.key, <span style={{ whiteSpace: 'pre-line' }}>{cellText(record[col.key])}</span>])
      ),
    };
  });
}

export default function F1MReport({ data }: F1MReportProps) {
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
