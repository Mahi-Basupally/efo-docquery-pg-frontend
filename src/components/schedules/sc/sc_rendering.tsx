'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleCApi, ScheduleCResponse } from '@/lib/api/sc';

export interface SCRendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SC_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'lenderName',
    field: 'lenderName',
    label: "Lender's Name",
    width: '15%',
    render: (row) =>
      row.lenderName ??
      ([row.lenderFirstName, row.lenderMiddleName, row.lenderLastName]
        .filter(Boolean)
        .join(' ') || '-'),
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '12%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '11%' },
  { key: 'city', field: 'city', label: 'City', width: '8%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '7%' },
  { key: 'originalAmount', field: 'originalAmount', label: 'Original Amount', width: '8%', align: 'right', format: 'currency' },
  { key: 'paidToDate', field: 'paidToDate', label: 'Payment to Date', width: '8%', align: 'right', format: 'currency' },
  { key: 'balance', field: 'balance', label: 'Balance', width: '8%', align: 'right', format: 'currency' },
  { key: 'dateIncurred', field: 'dateIncurred', label: 'Date Incurred', width: '8%', format: 'date' },
  { key: 'dateDue', field: 'dateDue', label: 'Date Due', width: '8%', format: 'date' },
  { key: 'interestRate', field: 'interestRate', label: 'Interest Rate', width: '6%' },
  { key: 'securedIndicator', field: 'securedIndicator', label: 'Secured', width: '6%' },
  { key: 'personalFundsIndicator', field: 'personalFundsIndicator', label: 'Personal Funds', width: '6%' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '15%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function SCRenderer({ reportId, lineNumber = '9', perPage = 10 }: SCRendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleCResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleCApi.getScheduleCData(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule C.');
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
      title="LOANS"
      columns={SC_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule C transactions found."
    />
  );
}
