'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleBApi, ScheduleBResponse } from '@/lib/api/sb';

export interface SBRendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SB_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'payeeName',
    field: 'payeeName',
    label: 'Payee Name',
    width: '16%',
    render: (row) =>
      row.payeeName ??
      ([row.payeeFirstName, row.payeeMiddleName, row.payeeLastName].filter(Boolean).join(' ') || '-'),
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '13%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '12%' },
  { key: 'city', field: 'city', label: 'City', width: '9%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'transactionDescription', field: 'transactionDescription', label: 'Description', width: '13%' },
  { key: 'transactionDate', field: 'transactionDate', label: 'Date of Disbursement', width: '10%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount', width: '9%', align: 'right', format: 'currency' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '14%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function SBRenderer({ reportId, lineNumber = '21B', perPage = 10 }: SBRendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleBResponse | null>(null);
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

  const updateUrl = (nextPage: number, nextPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    params.set('perPage', String(nextPerPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ScheduleRenderer
      title="ITEMIZED DISBURSEMENTS"
      columns={SB_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule B transactions found."
    />
  );
}
