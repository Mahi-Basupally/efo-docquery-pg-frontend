'use client';

import { ReactNode, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import type { F3XFinancialLine, F3XFormDetailLine, F3XLine, F3XReportData, F3XSection } from '@/lib/api/f3x';
import { F3X_LINE_DEFINITIONS, F3X_SECTION_DEFINITIONS } from './f3xDefinition';

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
  { key: 'lineDescription', label: 'Description', align: 'left', width: '45%', format: 'text' },
  { key: 'thisPeriod', label: 'COLUMN A\nTotal This Period', align: 'right', width: '22.5%', format: 'currency' },
  { key: 'yearToDate', label: 'COLUMN B\nCalendar Year-To-Date', align: 'right', width: '22.5%', format: 'currency' },
];

const SUMMARY_COLUMNS: F3XColumnConfig[] = [
  FINANCIAL_COLUMNS[0],
  FINANCIAL_COLUMNS[1],
  { key: 'thisPeriod', label: 'COLUMN A\nThis Period', align: 'right', width: '22.5%', format: 'currency' },
  { key: 'yearToDate', label: 'COLUMN B\nCalendar Year-To-Date', align: 'right', width: '22.5%', format: 'currency' },
];

const F3X_SECTION_COLUMNS: Record<string, F3XColumnConfig[]> = {
  formDetails: FORM_DETAILS_COLUMNS,
  summary: SUMMARY_COLUMNS,
  receipts: FINANCIAL_COLUMNS,
  disbursements: FINANCIAL_COLUMNS,
  contributionExpenditures: FINANCIAL_COLUMNS,
};

const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
};

const formatCellValue = (value: unknown, format?: 'text' | 'currency'): string => {
  if (value === null || value === undefined || value === '') return '-';
  return format === 'currency' ? formatCurrency(value as string | number) : String(value);
};

const getIndentPadding = (indent?: number): string =>
  indent ? '\u00a0\u00a0\u00a0\u00a0'.repeat(indent) : '';

const isFinancialLine = (line: F3XLine): line is F3XFinancialLine =>
  'lineId' in line;

export interface F3XReportProps {
  data: F3XReportData;
}

export default function F3XReport({ data }: F3XReportProps) {
  const orderedSections = [...data.sections].sort((a, b) => {
    const orderA = F3X_SECTION_DEFINITIONS[a.id]?.order ?? 0;
    const orderB = F3X_SECTION_DEFINITIONS[b.id]?.order ?? 0;
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
    const sectionTarget = orderedSections.some((section) => section.id === target);
    if (sectionTarget) {
      setExpandedSections((prev) => ({ ...prev, [target]: true }));
    }

    setTimeout(() => {
      const element = document.getElementById(target);
      if (!element) return;

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const row = element.tagName.toLowerCase() === 'tr' ? element : element.closest('tr');
      if (!row) return;

      const cells = Array.from(row.children) as HTMLElement[];
      const original = cells.map((cell) => ({
        backgroundImage: cell.style.backgroundImage,
        backgroundColor: cell.style.backgroundColor,
        transition: cell.style.transition,
        boxShadow: cell.style.boxShadow,
      }));

      cells.forEach((cell) => {
        cell.style.transition = 'background 250ms ease, box-shadow 250ms ease';
        cell.style.backgroundImage =
          'linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(0,94,168,0.16) 45%, rgba(0,94,168,0.30) 100%)';
        cell.style.backgroundColor = '#e5f1fa';
        cell.style.boxShadow =
          'inset 0 1px 0 rgba(255,255,255,0.80), inset 0 -1px 0 rgba(0,94,168,0.24)';
      });

      window.setTimeout(() => {
        cells.forEach((cell, index) => {
          const previous = original[index];
          cell.style.backgroundImage = previous.backgroundImage;
          cell.style.backgroundColor = previous.backgroundColor;
          cell.style.transition = previous.transition;
          cell.style.boxShadow = previous.boxShadow;
        });
      }, 2200);
    }, sectionTarget ? 150 : 50);
  };

  const renderLinkToButton = (linkId?: string) => {
    if (!linkId) return null;
    return (
      <button
        type="button"
        onClick={() => scrollToTarget(linkId)}
        className="ml-2 inline-flex items-center rounded text-blue-700 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={`Go to ${linkId}`}
        style={{ padding: '2px 6px', fontSize: '12px' }}
      >
        <ExternalLink size={14} className="inline" />
      </button>
    );
  };

  const getDefinition = (line: F3XLine) =>
    isFinancialLine(line) ? F3X_LINE_DEFINITIONS[line.lineId] ?? {} : {};

  const buildDescriptionCell = (line: F3XLine): ReactNode => {
    const definition = getDefinition(line);
    const description = isFinancialLine(line) ? line.lineDescription : line.label;

    return (
      <div>
        <span style={{ fontSize: '14px' }}>
          {isFinancialLine(line) && getIndentPadding(definition.indent)}
          {description || '-'}
          {isFinancialLine(line) && renderLinkToButton(definition.linkId)}
        </span>
        {isFinancialLine(line) && definition.calculation && (
          <>
            <br />
            <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
              {getIndentPadding(definition.indent)}({definition.calculation})
            </span>
          </>
        )}
        {isFinancialLine(line) && definition.note && (
          <>
            <br />
            <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
              {getIndentPadding(definition.indent)}({definition.note})
            </span>
          </>
        )}
        {isFinancialLine(line) && definition.hasSchedule && definition.scheduleType && (
          <>
            <br />
            <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
              Schedule {definition.scheduleType}
            </span>
          </>
        )}
      </div>
    );
  };

  const buildRow = (line: F3XLine, columns: F3XColumnConfig[]): ReportTableRow => {
    if (!isFinancialLine(line)) {
      const cells: Record<string, ReactNode> = {};
      columns.forEach((column) => {
        if (column.key === 'label') {
          cells[column.key] = buildDescriptionCell(line);
        } else if (column.key === 'lineNumber') {
          cells[column.key] = line.lineNumber ?? '';
        } else {
          cells[column.key] = formatCellValue(line[column.key as keyof F3XFormDetailLine], column.format);
        }
      });
      return {
        id: `form-${line.lineNumber || 'detail'}-${line.label}`,
        cells,
      };
    }

    const definition = getDefinition(line);
    const rowStyle: React.CSSProperties | undefined = definition.isTotal
      ? { backgroundColor: '#f3f4f6', fontWeight: 600 }
      : undefined;

    const cells: Record<string, ReactNode> = {};
    columns.forEach((column) => {
      if (column.key === 'lineNumber') {
        cells[column.key] = <span style={{ fontWeight: 'bold' }}>{line.lineNumber || ''}</span>;
      } else if (column.key === 'lineDescription') {
        cells[column.key] = buildDescriptionCell(line);
      } else {
        cells[column.key] = formatCellValue(
          line[column.key as keyof F3XFinancialLine],
          column.format
        );
      }
    });

    return {
      id: line.lineId,
      cells,
      style: rowStyle,
    };
  };

  const renderSection = (section: F3XSection) => {
    const columns = F3X_SECTION_COLUMNS[section.id] || [];

    return (
      <div key={section.id}>
        <ReportTable
          id={section.id}
          title={section.title}
          subtitle={section.subtitle}
          columns={columns}
          rows={section.lines.map((line) => buildRow(line, columns))}
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
