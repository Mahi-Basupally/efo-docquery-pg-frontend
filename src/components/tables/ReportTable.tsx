'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface ReportTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

export interface ReportTableRow {
  id: string;
  cells?: Record<string, ReactNode>;
  fullWidth?: {
    lead?: ReactNode;
    leadColSpan?: number;
    content: ReactNode;
    contentColSpan?: number;
  };
  className?: string;
  style?: React.CSSProperties;
}

export interface ReportTableProps {
  id?: string;
  title: string;
  subtitle?: string;
  columns: ReportTableColumn[];
  rows: ReportTableRow[];
  collapsible?: boolean;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  defaultExpanded?: boolean;
  emptyMessage?: string;
}

const cellPadding = '8px';
const cellFontSize = '14px';

export default function ReportTable({
  id,
  title,
  subtitle,
  columns,
  rows,
  collapsible = true,
  expanded,
  onToggleExpanded,
  defaultExpanded = true,
  emptyMessage = 'No data available.',
}: ReportTableProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = expanded !== undefined;
  const isExpanded = isControlled ? expanded : internalExpanded;

  const toggle = () => {
    if (onToggleExpanded) onToggleExpanded();
    if (!isControlled) setInternalExpanded((prev) => !prev);
  };

  const alignOf = (align?: 'left' | 'right' | 'center'): 'left' | 'right' | 'center' =>
    align || 'left';

  return (
    <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
      <table
        id={id}
        style={{ width: '100%', fontSize: '16px' }}
        className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer"
      >
        <thead>
          <tr style={{ textAlign: 'left', backgroundColor: '#aeb0b5' }}>
            <th colSpan={columns.length}>
              <span
                style={{
                  whiteSpace: 'pre-line',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                }}
              >
                {collapsible && (
                  <button
                    onClick={toggle}
                    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                  >
                    {isExpanded ? <ChevronUp size={20} className="text-gray-700" /> : <ChevronDown size={20} className="text-gray-700" />}
                  </button>
                )}
                {title.toUpperCase()}
              </span>
            </th>
          </tr>
          {subtitle && (
            <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
              <th colSpan={columns.length} style={{ whiteSpace: 'pre-line', textAlign: 'left', fontStyle: 'italic', padding: cellPadding, fontSize: cellFontSize }}>
                {subtitle}
              </th>
            </tr>
          )}
          <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
            {columns.map((col) => (
              <th key={col.key} style={{ whiteSpace: 'pre-line', width: col.width, textAlign: alignOf(col.align), padding: cellPadding, fontSize: cellFontSize }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ display: isExpanded ? '' : 'none' }}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: cellPadding, fontSize: cellFontSize, textAlign: 'center', color: '#6b7280' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                // For F3X rows, row.id is the API lineId. Keep the DOM id
                // identical so linkId can target the exact row by lineId.
                id={row.id.startsWith('f3x-line-') ? row.id : undefined}
                className={row.className}
                style={row.style}
              >
                {row.fullWidth ? (
                  <>
                    {row.fullWidth.lead !== undefined && (
                      <td colSpan={row.fullWidth.leadColSpan ?? 1} style={{ textAlign: 'left', fontWeight: 'bold', padding: cellPadding, fontSize: cellFontSize }}>
                        {row.fullWidth.lead}
                      </td>
                    )}
                    <td colSpan={row.fullWidth.contentColSpan ?? columns.length - (row.fullWidth.lead !== undefined ? 1 : 0)} style={{ textAlign: 'left', fontWeight: 'bold', padding: cellPadding, fontSize: cellFontSize }}>
                      {row.fullWidth.content}
                    </td>
                  </>
                ) : (
                  columns.map((col) => (
                    <td key={col.key} style={{ textAlign: alignOf(col.align), padding: cellPadding, fontSize: cellFontSize }}>
                      {row.cells?.[col.key]}
                    </td>
                  ))
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
