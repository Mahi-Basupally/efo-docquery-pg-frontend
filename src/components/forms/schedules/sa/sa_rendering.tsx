'use client';

import { useCallback, useEffect, useState } from 'react';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleAApi, ScheduleAResponse } from '@/lib/api/sa';

export interface SARendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SA_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'contributorName', field: 'contributorName', label: "Contributor's Name", width: '15%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '13%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '12%' },
  { key: 'city', field: 'city', label: 'City', width: '10%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'employer', field: 'employer', label: 'Employer', width: '10%' },
  { key: 'occupation', field: 'occupation', label: 'Occupation', width: '10%' },
  { key: 'transactionDescription', field: 'transactionDescription', label: 'Description', width: '12%' },
  { key: 'transactionDate', field: 'transactionDate', label: 'Date', width: '8%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '8%', align: 'right', format: 'currency' },
  { key: 'ytdAmount', field: 'ytdAmount', label: 'Aggregate ($)', width: '9%', align: 'right', format: 'currency' },
  { key: 'isLimit', field: 'isLimit', label: 'Limits', width: '7%' },
  { key: 'memoCode', field: 'memoCode', label: 'Memo', width: '6%' },
  { key: 'memoText', field: 'memoText', label: 'Memo Text', width: '12%' },
];

export default function SARenderer({ reportId, lineNumber = '11AI', perPage = 10 }: SARendererProps) {
  const [response, setResponse] = useState<ScheduleAResponse | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(perPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleAApi.getScheduleAData(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule A.');
    } finally {
      setLoading(false);
    }
  }, [reportId, lineNumber, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScheduleRenderer
      title="Schedule A"
      subtitle={lineNumber ? `Line ${lineNumber}` : undefined}
      columns={SA_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={setPage}
      onPerPageChange={(value) => {
        setPageSize(value);
        setPage(1);
      }}
      emptyMessage="No Schedule A transactions found."
    />
  );
}
