'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleDApi, ScheduleDResponse } from '@/lib/api/sd';

export interface SDRendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SD_COLUMNS: ScheduleColumnConfig[] = [
  // sd_service.py composes creditorName for IND/CAN rows too (via
  // format_name, from creditorFirstName/creditorMiddleName/
  // creditorLastName/creditorPrefix/creditorSuffix) - it's always present,
  // no frontend fallback composition needed here.
  { key: 'creditorName', field: 'creditorName', label: "Creditor's Name", width: '16%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '12%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '11%' },
  { key: 'city', field: 'city', label: 'City', width: '8%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '7%' },
  { key: 'natureOfDebt', field: 'natureOfDebt', label: 'Nature of Debt', width: '15%' },
  { key: 'beginningBalance', field: 'beginningBalance', label: 'Beginning Balance', width: '8%', align: 'right', format: 'currency' },
  { key: 'incurredAmount', field: 'incurredAmount', label: 'Incurred Amount', width: '8%', align: 'right', format: 'currency' },
  { key: 'paymentAmount', field: 'paymentAmount', label: 'Payment Amount', width: '8%', align: 'right', format: 'currency' },
  { key: 'balance', field: 'balance', label: 'Balance at Close', width: '8%', align: 'right', format: 'currency' },
];

export default function SDRenderer({ reportId, lineNumber = '9', perPage = 10 }: SDRendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleDResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleDApi.getScheduleDData(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule D.');
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
      title="DEBTS AND OBLIGATIONS"
      columns={SD_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule D transactions found."
    />
  );
}
