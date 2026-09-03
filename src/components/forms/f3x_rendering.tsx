'use client';

import { ReactNode, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import type { F3XRawLine, F3XRawReportData, F3XRawSection } from '@/lib/api/f3x';

/**
 * F3X-only rendering rules: which sections to show, in what order, with what
 * table columns, formatting, indentation, totals, merged rows, and cross-page
 * links. This is the single place F3X presentation decisions live - the
 * backend and ReportTable stay unaware of them.
 */

interface F3XColumnConfig extends ReportTableColumn {
  format?: 'text' | 'currency';
}

const FORM_DETAILS_COLUMNS: F3XColumnConfig[] = [
  { key: 'lineNumber', label: 'Line #', align: 'left', width: '10%', format: 'text' },
  { key: 'label', label: 'Description', align: 'left', width: '60%', format: 'text' },
  { key: 'value', label: 'Value', align: 'left', width: '30%', format: 'text' },
];

const FINANCIAL_COLUMNS: F3XColumnConfig[] = [
  { key: 'lineNumber', label: 'Line #', align: 'left', width: '10%', format: 'text' },
  { key: 'label', label: 'Description', align: 'left', width: '45%', format: 'text' },
  { key: 'columnA', label: 'COLUMN A\nTotal This Period', align: 'right', width: '22.5%', format: 'currency' },
  { key: 'columnB', label: 'COLUMN B\nCalendar Year-To-Date', align: 'right', width: '22.5%', format: 'currency' },
];

const SUMMARY_COLUMNS: F3XColumnConfig[] = [
  FINANCIAL_COLUMNS[0],
  FINANCIAL_COLUMNS[1],
  { key: 'columnA', label: 'COLUMN A\nThis Period', align: 'right', width: '22.5%', format: 'currency' },
  { key: 'columnB', label: 'COLUMN B\nCalendar Year-To-Date', align: 'right', width: '22.5%', format: 'currency' },
];

interface F3XSectionConfig {
  order: number;
  columns: F3XColumnConfig[];
}

const F3X_SECTION_CONFIG: Record<string, F3XSectionConfig> = {
  formDetails: { order: 1, columns: FORM_DETAILS_COLUMNS },
  summary: { order: 2, columns: SUMMARY_COLUMNS },
  receipts: { order: 3, columns: FINANCIAL_COLUMNS },
  disbursements: { order: 4, columns: FINANCIAL_COLUMNS },
  contributionExpenditures: { order: 5, columns: FINANCIAL_COLUMNS },
};

// ============================================================================
// Formatting helpers (F3X presentation only)
// ============================================================================

const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return value;
    value = parsed;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatCellValue = (value: string | number | null | undefined, format?: 'text' | 'currency'): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (format === 'currency') return formatCurrency(value);
  return String(value);
};

const getIndentPadding = (indent?: number): string =>
  indent ? '    '.repeat(indent) : '';

const getLineId = (lineNumber?: string): string | undefined => {
  if (!lineNumber) return undefined;
  return `line-${lineNumber.replace(/[()]/g, '-').replace(/--+/g, '-').replace(/-$/, '')}`;
};

// ============================================================================
// Component
// ============================================================================

export interface F3XReportProps {
  data: F3XRawReportData;
}

export default function F3XReport({ data }: F3XReportProps) {
  const orderedSections = [...data.sections].sort((a, b) => {
    const orderA = F3X_SECTION_CONFIG[a.id]?.order ?? a.sectionOrder ?? 0;
    const orderB = F3X_SECTION_CONFIG[b.id]?.order ?? b.sectionOrder ?? 0;
    return orderA - orderB;
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    orderedSections.forEach((section) => {
      initial[section.id] = true;
    });
    return initial;
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const scrollToTarget = (target: string) => {
    if (orderedSections.some((s) => s.id === target)) {
      setExpandedSections((prev) => ({ ...prev, [target]: true }));
    }

    setTimeout(() => {
      let element = document.getElementById(target);
      if (!element) {
        const lineId = getLineId(target);
        element = lineId ? document.getElementById(lineId) : null;
      }
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const original = element.style.backgroundColor;
        element.style.backgroundColor = '#fef3c7';
        setTimeout(() => {
          element!.style.backgroundColor = original;
        }, 2000);
      }
    }, 100);
  };

  const renderLinkToButton = (linkTo?: string) => {
    if (!linkTo) return null;
    return (
      <button
        onClick={() => scrollToTarget(linkTo)}
        className="ml-2 text-blue-600 hover:text-blue-800"
        title={`Go to ${linkTo}`}
        style={{ padding: '2px 6px', fontSize: '12px' }}
      >
        <ExternalLink size={14} className="inline" />
      </button>
    );
  };

  const buildDescriptionCell = (line: F3XRawLine, isDescriptionColumn: boolean): ReactNode => {
    const raw = line.label ?? '';
    return (
      <div>
        <span style={{ fontSize: '14px' }}>
          {isDescriptionColumn && getIndentPadding(line.indent)}
          {raw || '-'}
          {isDescriptionColumn && renderLinkToButton(line.linkTo)}
        </span>
        {isDescriptionColumn && line.calculation && (
          <>
            <br />
            <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
              {getIndentPadding(line.indent)}({line.calculation})
            </span>
          </>
        )}
        {isDescriptionColumn && line.note && (
          <>
            <br />
            <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
              {getIndentPadding(line.indent)}({line.note})
            </span>
          </>
        )}
      </div>
    );
  };

  const buildRow = (line: F3XRawLine, columns: F3XColumnConfig[]): ReportTableRow => {
    const rowId = getLineId(line.lineNumber) || `${line.label ?? ''}-${line.lineNumber ?? ''}`;
    const rowStyle: React.CSSProperties | undefined = line.isTotal
      ? { backgroundColor: '#f3f4f6', fontWeight: 600 }
      : undefined;

    if (line.type === 'merge') {
      const hasLineNumberColumn = columns.some((c) => c.key === 'lineNumber');
      const mergedContent = columns
        .filter((c) => c.key !== 'lineNumber')
        .map((c) => line[c.key as keyof F3XRawLine])
        .filter((v) => v !== null && v !== undefined && v !== '')
        .join(' ');

      return {
        id: rowId,
        style: rowStyle,
        fullWidth: {
          lead: hasLineNumberColumn ? line.lineNumber || '' : undefined,
          leadColSpan: 1,
          content: mergedContent,
          contentColSpan: hasLineNumberColumn ? columns.length - 1 : columns.length,
        },
      };
    }

    const cells: Record<string, ReactNode> = {};
    columns.forEach((col, idx) => {
      const isDescriptionColumn = idx === 1;
      if (col.key === 'lineNumber') {
        cells[col.key] = (
          <span style={{ fontWeight: 'bold' }} id={getLineId(line.lineNumber)}>
            {line.lineNumber || ''}
          </span>
        );
      } else if (col.key === 'label') {
        cells[col.key] = buildDescriptionCell(line, isDescriptionColumn);
      } else {
        cells[col.key] = formatCellValue(line[col.key as keyof F3XRawLine] as string | number | null, col.format);
      }
    });

    return { id: rowId, cells, style: rowStyle };
  };

  const renderSection = (section: F3XRawSection) => {
    const config = F3X_SECTION_CONFIG[section.id];
    const columns: F3XColumnConfig[] =
      config?.columns ||
      section.columns.map((c): F3XColumnConfig => ({
        key: c.key,
        label: c.label,
        align: c.type === 'currency' ? 'right' : 'left',
        format: c.type === 'currency' ? 'currency' : 'text',
      }));

    const sortedLines = [...section.lines].sort(
      (a, b) => (Number(a.lineOrder) || 0) - (Number(b.lineOrder) || 0)
    );

    const rows = sortedLines.map((line) => buildRow(line, columns));

    return (
      <div key={section.id}>
        <ReportTable
          id={section.id}
          title={section.title}
          subtitle={section.subtitle}
          columns={columns}
          rows={rows}
          expanded={expandedSections[section.id]}
          onToggleExpanded={() => toggleSection(section.id)}
        />
        <br />
      </div>
    );
  };

  if (orderedSections.length === 0) {
    return (
      <div className="slab slab--neutral u-padding--left u-padding--right">
        <p className="text-gray-500 text-center py-8">No summary data available for this report.</p>
      </div>
    );
  }

  return <>{orderedSections.map(renderSection)}</>;
}
