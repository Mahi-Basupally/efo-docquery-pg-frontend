'use client';

import { useCallback, useEffect, useState } from 'react';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleBApi, ScheduleBResponse } from '@/lib/api/sb';

export interface SBRendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SB_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'disbursementName', field: 'disbursementName', label: 'Disbursement To', width: '16%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '13%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '12%' },
  { key: 'city', field: 'city', label: 'City', width: '9%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'electionType', field: 'electionType', label: 'Election Type', width: '10%' },
  { key: 'disbursementDate', field: 'disbursementDate', label: 'Date of Disbursement', width: '10%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount', width: '9%', align: 'right', format: 'currency' },
  { key: 'extraDescription', field: 'extraDescription', label: 'Extra Description', width: '13%' },
  { key: 'memoText', field: 'memoText', label: 'Memo Text', width: '12%' },
  { key: 'memoCode', field: 'memoCode', label: 'Memo', width: '6%' },
];

export default function SBRenderer({ reportId, lineNumber = '21B', perPage = 10 }: SBRendererProps) {
  const [response, setResponse] = useState<ScheduleBResponse | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(perPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleBApi.getScheduleBData(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule B.');
    } finally {
      setLoading(false);
    }
  }, [reportId, lineNumber, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScheduleRenderer
      title="Schedule B"
      subtitle={lineNumber ? `Line ${lineNumber}` : undefined}
      columns={SB_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={setPage}
      onPerPageChange={(value) => {
        setPageSize(value);
        setPage(1);
      }}
      emptyMessage="No Schedule B transactions found."
    />
  );
}
