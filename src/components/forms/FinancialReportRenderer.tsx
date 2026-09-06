'use client';

import { ReactNode, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';

type LineDefinition = {
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  note?: string;
  valueType?: string;
  linkId?: string;
};

type FormDetailLine = { lineNumber?: string; label?: string; value?: string | number | null };
type FinancialLine = {
  lineId: string;
  lineNumber?: string;
  lineDescription?: string;
  thisPeriod?: number | string | null;
  yearToDate?: number | string | null;
};
type Line = FormDetailLine | FinancialLine;

export interface FinancialReportData {
  metadata?: { formType?: string; reportId?: string | number; formTitle?: string; formSubTitle?: string };
  committee?: { id?: string; name?: string; address?: Record<string, string> };
  sections: Array<{ id: string; title: string; subtitle?: string; lines: Line[] }>;
}

export interface FinancialReportRendererProps {
  data: FinancialReportData;
  definitions: Record<string, LineDefinition>;
  formPrefix: string;
}

const columns: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', align: 'left', width: '10%' },
  { key: 'lineDescription', label: 'Description', align: 'left', width: '45%' },
  { key: 'thisPeriod', label: 'COLUMN A\nTotal This Period', align: 'right', width: '22.5%' },
  { key: 'yearToDate', label: 'COLUMN B\nCalendar Year-To-Date', align: 'right', width: '22.5%' },
];

const detailColumns: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', align: 'left', width: '10%' },
  { key: 'label', label: 'Description', align: 'left', width: '60%' },
  { key: 'value', label: 'Value', align: 'left', width: '30%' },
];

const isFinancial = (line: Line): line is FinancialLine => 'lineId' in line;
const padding = (indent?: number) => (indent ? '\u00a0\u00a0\u00a0\u00a0'.repeat(indent) : '');
const money = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
};

export default function FinancialReportRenderer({ data, definitions, formPrefix }: FinancialReportRendererProps) {
  const orderedSections = [...data.sections].sort((a, b) => a.id.localeCompare(b.id));
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(orderedSections.map(s => [s.id, true])));

  const goToLine = (lineId: string) => {
    setTimeout(() => {
      const row = document.getElementById(lineId);
      if (!row) return;
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const cells = Array.from(row.children) as HTMLElement[];
      const originals = cells.map(c => ({ background: c.style.background, boxShadow: c.style.boxShadow, transition: c.style.transition }));
      cells.forEach(c => {
        c.style.transition = 'background 250ms ease, box-shadow 250ms ease';
        c.style.background = 'linear-gradient(180deg, rgba(255,255,255,.55), rgba(0,94,168,.18) 45%, rgba(0,94,168,.32))';
        c.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,.8), inset 0 -1px 0 rgba(0,94,168,.25)';
      });
      window.setTimeout(() => cells.forEach((c, i) => {
        c.style.background = originals[i].background;
        c.style.boxShadow = originals[i].boxShadow;
        c.style.transition = originals[i].transition;
      }), 2200);
    }, 50);
  };

  const linkButton = (linkId?: string) => linkId ? (
    <button type="button" onClick={() => goToLine(linkId)} className="ml-2 inline-flex items-center rounded text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500" title={`Go to ${linkId}`} style={{ padding: '2px 6px', fontSize: 12 }}>
      <ExternalLink size={14} />
    </button>
  ) : null;

  const renderDescription = (line: Line): ReactNode => {
    if (!isFinancial(line)) return line.label || '';
    const d = definitions[line.lineId] || {};
    return <div>
      <span style={{ fontSize: 14 }}>{padding(d.indent)}{line.lineDescription || ''}{linkButton(d.linkId)}</span>
      {d.calculation && <><br /><span style={{ fontSize: '0.85em', color: '#6b7280' }}>{padding(d.indent)}({d.calculation})</span></>}
      {d.note && <><br /><span style={{ fontSize: '0.85em', color: '#6b7280' }}>{padding(d.indent)}({d.note})</span></>}
      {d.hasSchedule && d.scheduleType && <><br /><span style={{ fontSize: '0.85em', color: '#6b7280' }}>Schedule {d.scheduleType}</span></>}
    </div>;
  };

  const buildRow = (line: Line, formDetails: boolean): ReportTableRow => {
    if (!isFinancial(line) || formDetails) {
      return { id: `form-${line.lineNumber || 'detail'}-${line.label || ''}`, cells: {
        lineNumber: line.lineNumber || '', label: renderDescription(line), value: line.value ?? ''
      }};
    }
    const d = definitions[line.lineId] || {};
    return { id: line.lineId, className: d.isTotal ? 'font-semibold' : undefined, style: d.isTotal ? { backgroundColor: '#f3f4f6', fontWeight: 600 } : undefined, cells: {
      lineNumber: <span style={{ fontWeight: 'bold' }}>{line.lineNumber || ''}</span>,
      lineDescription: renderDescription(line),
      thisPeriod: money(line.thisPeriod),
      yearToDate: money(line.yearToDate),
    }};
  };

  return <>{orderedSections.map(section => {
    const formDetails = section.id === 'formDetails';
    return <div key={section.id}>
      <ReportTable id={section.id} title={section.title} subtitle={section.subtitle} columns={formDetails ? detailColumns : columns} rows={section.lines.map(line => buildRow(line, formDetails))} expanded={expanded[section.id]} onToggleExpanded={() => setExpanded(p => ({ ...p, [section.id]: !p[section.id] }))} />
      <br />
    </div>;
  })}</>;
}
