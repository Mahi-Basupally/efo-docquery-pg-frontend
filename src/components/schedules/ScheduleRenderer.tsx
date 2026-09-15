'use client';

import { ReactNode, useEffect, useState } from 'react';
import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import type { PaginationMeta } from '@/lib/api/types';

export type ScheduleCellFormat = 'text' | 'currency' | 'date';

export interface ScheduleColumnConfig extends ReportTableColumn {
  field: string;
  format?: ScheduleCellFormat;
  render?: (row: Record<string, unknown>) => ReactNode;
}

export interface ScheduleRendererProps {
  title: string;
  subtitle?: string;
  columns: ScheduleColumnConfig[];
  data: Record<string, unknown>[];
  pagination?: PaginationMeta;
  loading?: boolean;
  error?: string | null;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  emptyMessage?: string;
  // Optional per-row child content (e.g. F93's linked F94 candidates) -
  // rendered as its own full-width row immediately under the parent row,
  // one per returned node. Unused by every schedule that doesn't pass it.
  getSubRows?: (row: Record<string, unknown>) => ReactNode[];
}

const formatCurrency = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (value: unknown): string => {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatValue = (value: unknown, format: ScheduleCellFormat = 'text'): ReactNode => {
  if (value === null || value === undefined || value === '') return '-';
  if (format === 'currency') return formatCurrency(value);
  if (format === 'date') return formatDate(value);
  return String(value);
};

const buildRows = (
  data: Record<string, unknown>[],
  columns: ScheduleColumnConfig[],
  getSubRows?: (row: Record<string, unknown>) => ReactNode[]
): ReportTableRow[] => {
  const rows: ReportTableRow[] = [];

  data.forEach((row, index) => {
    const id = String(row.transactionId ?? row.tran_id ?? row.tranId ?? `${index}`);

    rows.push({
      id,
      cells: Object.fromEntries(
        columns.map((column) => [
          column.key,
          column.render ? column.render(row) : formatValue(row[column.field], column.format),
        ])
      ),
    });

    getSubRows?.(row).forEach((content, subIndex) => {
      rows.push({
        id: `${id}-sub-${subIndex}`,
        fullWidth: { content, contentColSpan: columns.length },
        style: { backgroundColor: '#f9fafb', fontStyle: 'italic' },
      });
    });
  });

  return rows;
};

export default function ScheduleRenderer({
  title,
  subtitle,
  columns,
  data,
  pagination,
  loading = false,
  error = null,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  emptyMessage = 'No schedule data available.',
  getSubRows,
}: ScheduleRendererProps) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setExpanded(true);
  }, [title, subtitle]);

  if (error) {
    return (
      <div className="py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  const rows = buildRows(data, columns, getSubRows);

  return (
    <section className="w-full">
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading {title}...</div>
      ) : (
        <ReportTable
          id={`schedule-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          title={title}
          subtitle={subtitle}
          columns={columns}
          rows={rows}
          expanded={expanded}
          onToggleExpanded={() => setExpanded((value) => !value)}
          emptyMessage={emptyMessage}
        />
      )}

      {pagination && !loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingBottom: '2rem',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="t-sans">Results per page:</span>
            <select
              value={pagination.perPage}
              onChange={(event) => onPerPageChange?.(Number(event.target.value))}
              style={{
                padding: '0.5rem 2rem 0.5rem 0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px',
                minWidth: '80px',
                cursor: 'pointer',
                appearance: 'none',
                backgroundColor: 'white',
              }}
            >
              {perPageOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="t-sans">
              Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
              {Math.min(pagination.page * pagination.perPage, pagination.totalRecords)} of{' '}
              {pagination.totalRecords} entries
            </span>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: pagination.hasPrev ? '#fff' : '#f5f5f5',
                  cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasPrev ? 1 : 0.5,
                }}
                aria-label="Previous page"
              >
                ◄
              </button>

              <button
                type="button"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.hasNext}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: pagination.hasNext ? '#fff' : '#f5f5f5',
                  cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                  opacity: pagination.hasNext ? 1 : 0.5,
                }}
                aria-label="Next page"
              >
                ►
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
