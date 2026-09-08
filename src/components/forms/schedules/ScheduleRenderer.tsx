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

const buildRows = (data: Record<string, unknown>[], columns: ScheduleColumnConfig[]): ReportTableRow[] =>
  data.map((row, index) => ({
    id: String(row.transactionId ?? row.tran_id ?? row.tranId ?? `${index}`),
    cells: Object.fromEntries(
      columns.map((column) => [
        column.key,
        column.render ? column.render(row) : formatValue(row[column.field], column.format),
      ])
    ),
  }));

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

  const rows = buildRows(data, columns);

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-2 py-3 text-sm text-gray-600">
          <div>
            {pagination.totalRecords.toLocaleString()} records
            {' '}· Page {pagination.page} of {pagination.totalPages}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="schedule-per-page">Rows:</label>
            <select
              id="schedule-per-page"
              value={pagination.perPage}
              onChange={(event) => onPerPageChange?.(Number(event.target.value))}
              className="rounded border border-gray-300 bg-white px-2 py-1"
            >
              {perPageOptions.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>

            <button
              type="button"
              disabled={!pagination.hasPrev}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={!pagination.hasNext}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
