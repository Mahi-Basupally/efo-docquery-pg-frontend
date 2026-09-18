'use client';

import { ReactNode, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import { stripTrailingColon } from '@/lib/basicFormattingUtils';
import SARenderer from '@/components/schedules/sa/sa_rendering';
import SBRenderer from '@/components/schedules/sb/sb_rendering';
import SERenderer from '@/components/schedules/se/se_rendering';
import SFRenderer from '@/components/schedules/sf/sf_rendering';
import H3Renderer from '@/components/schedules/h3/h3_rendering';
import H4Renderer from '@/components/schedules/h4/h4_rendering';
import H5Renderer from '@/components/schedules/h5/h5_rendering';
import H6Renderer from '@/components/schedules/h6/h6_rendering';

type LineDefinition = {
  lineNumber?: string;
  label?: string;
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  note?: string;
  valueType?: string;
  linkId?: string;
};

// href (e.g. F99's PDF Attachment line, linking to /fecimg/?{imageNumber})
// makes `value` a clickable link out to that URL instead of plain text -
// unused by every other line/form.
type FormDetailLine = { lineNumber?: string; label?: string; value?: string | number | null; href?: string };
type FinancialLine = {
  lineId: string;
  lineNumber?: string;
  lineDescription?: string;
  thisPeriod?: number | string | null;
  yearToDate?: number | string | null;
  // Third amount (e.g. F3S/F3PS's efo.supsum total) - present only on
  // sections that carry one; absent (not present as a key) everywhere else.
  totalForReportingPeriod?: number | string | null;
};
type Line = FormDetailLine | FinancialLine;

export interface FinancialReportData {
  metadata?: { formType?: string; reportId?: string | number; formTitle?: string; formSubTitle?: string };
  // The actual, reliable form-type field on every current backend contract -
  // metadata.formType above is never populated by any of them. See its use
  // in ReportSummaryPage.tsx's resolvedFormType.
  form?: { formType?: string; hasAdditionalSummary?: boolean };
  committee?: { id?: string; name?: string; address?: Record<string, string> };
  // Newer form contracts carry reportId here rather than under metadata -
  // see the reportId derivation in FinancialReportRenderer below.
  report?: { reportId?: string | number };
  // Single-section forms (F5, F6, F7, F9, F10, F13, F24, F99) return this one
  // named key instead of a sections array - see the derivation below.
  formDetails?: { lines: Line[] };
  sections?: Array<{ id: string; title: string; subtitle?: string; lines: Line[] }>;
}

// Schedule types embeddable inline via the hasSchedule/scheduleType line
// metadata. SA/SB/SE/SF are filtered to one paper-form line; the H3-H6
// (non-federal/Levin/allocated/FEA) schedules have no per-line filter.
const SCHEDULE_TYPES = new Set(['SA', 'SB', 'SE', 'SF', 'SH3', 'SH4', 'SH5', 'SH6']);

export interface FinancialReportRendererProps {
  data: FinancialReportData;
  definitions: Record<string, LineDefinition>;
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

// F3P's "Allocation of Primary Expenditures by State" is keyed by state, not
// a paper-form line number, so it has no "Line #" column.
const allocationColumns: ReportTableColumn[] = [
  { key: 'lineDescription', label: 'State', align: 'left', width: '55%' },
  { key: 'thisPeriod', label: 'ALLOCATION\nThis Period', align: 'right', width: '22.5%' },
  { key: 'yearToDate', label: 'TOTAL ALLOCATION\nTo Date', align: 'right', width: '22.5%' },
];

// Cash Summary is a single cash-flow walk (beginning balance, receipts,
// subtotal, disbursements, ending balance) - a point-in-time progression,
// not a this-period-vs-year-to-date comparison, so it has one amount column
// instead of the usual two.
const cashSummaryColumns: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', align: 'left', width: '15%' },
  { key: 'lineDescription', label: 'Description', align: 'left', width: '55%' },
  { key: 'thisPeriod', label: 'Amount', align: 'right', width: '30%' },
];

// Used for any section whose lines carry a third amount (e.g. F3S/F3PS's
// efo.supsum total) beyond thisPeriod/yearToDate - detected per-section from
// the data itself (see hasColumnC below), not hardcoded per form.
const columnsWithC: ReportTableColumn[] = [
  { key: 'lineNumber', label: 'Line #', align: 'left', width: '8%' },
  { key: 'lineDescription', label: 'Description', align: 'left', width: '37%' },
  { key: 'thisPeriod', label: 'COLUMN A\nTotal This Period', align: 'right', width: '18.33%' },
  { key: 'yearToDate', label: 'COLUMN B\nElection Cycle Total as of✽\n(date of general election)', align: 'right', width: '18.33%' },
  { key: 'columnC', label: 'COLUMN C\nTotal for✽\n(date after general election)\nthrough✽\n(last day of reporting period)', align: 'right', width: '18.34%' },
];

const isFinancial = (line: Line): line is FinancialLine => 'lineId' in line;
const padding = (indent?: number) => (indent ? '    '.repeat(indent) : '');
// Backend lineNumber values are FEC's human-readable form ("11(a)(i)"), but
// the schedule tables' own line_num column (and the schedule renderers'
// lineNumber prop/default, e.g. SARenderer's '11AI') use the flat FEC
// schedule-coding format - strip the parens and uppercase to match.
const toScheduleLineNumber = (value?: string) => value ? value.replace(/[()]/g, '').toUpperCase() : undefined;
const money = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
};

export default function FinancialReportRenderer({ data, definitions }: FinancialReportRendererProps) {
  // Section order comes from the backend as-is (formDetails, summary,
  // receipts, disbursements, cashSummary/contributionExpenditures) - there's
  // no per-section order map here the way f3xDefinition.ts has one for F3X,
  // and alphabetically sorting by id (the previous behavior) put
  // "cashSummary" and "disbursements" ahead of "formDetails".
  // Most wrapper components (everything but F3/F3X, which build a sections
  // array themselves) pass their backend response straight through - fall
  // back to the single formDetails key those simpler forms' services return.
  const orderedSections = data.sections ?? (data.formDetails
    ? [{ id: 'formDetails', title: data.metadata?.formTitle || 'Report Details', lines: data.formDetails.lines }]
    : []);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(orderedSections.map(s => [s.id, true])));
  const [activeSchedule, setActiveSchedule] = useState<{ type: string; lineNumber?: string } | null>(null);
  // report.reportId is the newer form contracts' field; metadata.reportId
  // covers F3, whose own normalizer still surfaces it there.
  const reportId = data.report?.reportId ?? data.metadata?.reportId;

  const openSchedule = (scheduleType?: string, lineNumber?: string) => {
    if (!scheduleType || !SCHEDULE_TYPES.has(scheduleType)) return;
    setActiveSchedule(prev =>
      prev?.type === scheduleType && prev.lineNumber === lineNumber ? null : { type: scheduleType, lineNumber },
    );
  };

  const renderScheduleButton = (scheduleType?: string, lineNumber?: string) => {
    if (!scheduleType || !SCHEDULE_TYPES.has(scheduleType)) return null;
    const active = activeSchedule?.type === scheduleType && activeSchedule.lineNumber === lineNumber;
    return (
      <button
        type="button"
        onClick={() => openSchedule(scheduleType, lineNumber)}
        className="ml-2 inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={active}
        title={`${active ? 'Hide' : 'Open'} Schedule ${scheduleType}`}
      >
        Schedule {scheduleType}
      </button>
    );
  };

  const renderActiveSchedule = (): ReactNode => {
    if (!activeSchedule || reportId === undefined) return null;
    const rid = String(reportId);
    const { type, lineNumber } = activeSchedule;
    switch (type) {
      case 'SA': return <SARenderer reportId={rid} lineNumber={lineNumber} />;
      case 'SB': return <SBRenderer reportId={rid} lineNumber={lineNumber} />;
      case 'SE': return <SERenderer reportId={rid} lineNumber={lineNumber} />;
      case 'SF': return <SFRenderer reportId={rid} lineNumber={lineNumber} />;
      case 'SH3': return <H3Renderer reportId={rid} />;
      case 'SH4': return <H4Renderer reportId={rid} />;
      case 'SH5': return <H5Renderer reportId={rid} />;
      case 'SH6': return <H6Renderer reportId={rid} />;
      default: return null;
    }
  };

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
    if (!isFinancial(line)) return stripTrailingColon(line.label);
    const d = definitions[line.lineId] || {};
    // The definitions file owns the display description (d.label) - fall
    // back to the backend's lineDescription only for forms whose
    // definitions file doesn't set one yet. Trailing colons in either
    // source are a paper-form fill-in-the-blank convention that doesn't
    // belong in this table layout.
    const description = stripTrailingColon(d.label || line.lineDescription);
    // Notes/calculations are sub-details of the line above them, so they
    // nest one level deeper than the description's own indent.
    const detailPadding = padding((d.indent || 0) + 1);
    return <div>
      <span style={{ fontSize: 14 }}>
        {padding(d.indent)}{description}{linkButton(d.linkId)}
        {d.hasSchedule && renderScheduleButton(d.scheduleType, toScheduleLineNumber(line.lineNumber))}
      </span>
      {d.calculation && <><br /><span style={{ fontSize: '0.85em', color: '#6b7280', textTransform: 'none' }}>{detailPadding}({d.calculation})</span></>}
      {d.note && <><br /><span style={{ fontSize: '0.85em', color: '#6b7280', textTransform: 'none' }}>{detailPadding}({d.note})</span></>}
    </div>;
  };

  const buildRow = (line: Line, formDetails: boolean): ReportTableRow => {
    if (formDetails || !isFinancial(line)) {
      const detailLine = line as FormDetailLine;
      const href = 'href' in detailLine ? detailLine.href : undefined;
      const value = href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
          {detailLine.value ?? href}
        </a>
      ) : (detailLine.value ?? '');
      return { id: `form-${detailLine.lineNumber || 'detail'}-${detailLine.label || ''}`, cells: {
        lineNumber: detailLine.lineNumber || '', label: renderDescription(detailLine), value
      }};
    }
    const d = definitions[line.lineId] || {};
    // The definitions file owns the display line number (d.lineNumber) -
    // fall back to the backend's lineNumber only for forms whose
    // definitions file doesn't set one yet. The Line # column is
    // left-aligned so every row shares the same starting edge - marginLeft
    // then indents deeper lines a consistent step further right, forming a
    // real staircase (centering the column and nudging from each row's own
    // center, as this used to do, left same-depth numbers misaligned with
    // each other).
    const lineNumber = d.lineNumber || line.lineNumber || '';
    const lineNumberCell = (
      <span style={{ fontWeight: 'bold', display: 'inline-block', marginLeft: d.indent ? `${d.indent * 1.5}em` : 0 }}>
        {lineNumber}
      </span>
    );
    // Uppercase cascades from the row down into every cell's text - the
    // calculation/note sub-text spans above explicitly opt back out
    // (textTransform: 'none') so only the description/line number/values
    // actually get shouted.
    const rowStyle = d.isTotal ? { backgroundColor: '#aeb0b5', fontWeight: 600, textTransform: 'uppercase' as const } : undefined;
    const rowClassName = d.isTotal ? 'font-semibold' : undefined;

    // A "header"/"mergetd" line (e.g. F3's "CONTRIBUTIONS (other than
    // loans) FROM"/"LOANS", F4's "Contributions to Defray Convention
    // Expenses:") is a section label for the detail lines under it, not a
    // line with its own This Period/Year-to-Date/Column C amount - leaving
    // those columns as empty dashes reads oddly, so the row collapses to
    // just Line #/Description, the description spanning every remaining
    // column instead.
    if (d.valueType === 'header' || d.valueType === 'mergetd') {
      return {
        id: line.lineId,
        className: rowClassName,
        style: rowStyle,
        fullWidth: { lead: lineNumberCell, content: renderDescription(line) },
      };
    }

    return { id: line.lineId, className: rowClassName, style: rowStyle, cells: {
      lineNumber: lineNumberCell,
      lineDescription: renderDescription(line),
      thisPeriod: money(line.thisPeriod),
      yearToDate: money(line.yearToDate),
      columnC: money(line.totalForReportingPeriod),
    }};
  };

  // A section gets the 3-column layout when any of its lines actually
  // carries a totalForReportingPeriod amount (e.g. F3S/F3PS's efo.supsum
  // total) - detected from the data itself, not hardcoded per form/section.
  const hasColumnC = (lines: Line[]) =>
    lines.some(line => isFinancial(line) && line.totalForReportingPeriod !== undefined);

  // Cash Summary (F3 and F4 both use this section id) collapses to one
  // amount column only when there's really nothing in Column B to show -
  // checked against the data itself rather than assumed for every form that
  // happens to name a section "cashSummary".
  const hasYearToDate = (lines: Line[]) =>
    lines.some(line => isFinancial(line) && line.yearToDate !== null && line.yearToDate !== undefined);

  return <>
    {orderedSections.map(section => {
      const formDetails = section.id === 'formDetails';
      const sectionColumns = formDetails
        ? detailColumns
        : section.id === 'allocation'
          ? allocationColumns
          : section.id === 'cashSummary' && !hasYearToDate(section.lines)
            ? cashSummaryColumns
            : hasColumnC(section.lines)
              ? columnsWithC
              : columns;
      // Matches fec.gov's own per-card wrapper (e.g. the "Total raised"/
      // "Total spent" panels - confirmed via curl) around each individual
      // table, one level below the shared slab wrapping the whole section.
      return <div key={section.id} className="entity__figure entity__figure--narrow">
        <ReportTable id={section.id} title={section.title} subtitle={section.subtitle} columns={sectionColumns} rows={section.lines.map(line => buildRow(line, formDetails))} expanded={expanded[section.id]} onToggleExpanded={() => setExpanded(p => ({ ...p, [section.id]: !p[section.id] }))} width="100%" />
      </div>;
    })}
    {activeSchedule && reportId !== undefined && (
      <div className="mt-2 mb-6 rounded border border-gray-200 bg-white p-4 shadow-sm">
        {renderActiveSchedule()}
      </div>
    )}
  </>;
}
