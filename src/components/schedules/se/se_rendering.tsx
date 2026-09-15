'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleEApi, ScheduleEResponse } from '@/lib/api/se';

export interface SERendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SE_COLUMNS: ScheduleColumnConfig[] = [
  // se_service.py composes payeeName for IND/CAN rows too (via format_name),
  // same as sd_service.py does for creditorName - no frontend fallback needed.
  { key: 'payeeName', field: 'payeeName', label: "Payee's Name", width: '14%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '10%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '9%' },
  { key: 'city', field: 'city', label: 'City', width: '7%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '6%' },
  { key: 'transactionDescription', field: 'transactionDescription', label: 'Purpose', width: '12%' },
  { key: 'transactionDate', field: 'transactionDate', label: 'Date', width: '7%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount', width: '7%', align: 'right', format: 'currency' },
  { key: 'supportOpposeCode', field: 'supportOpposeCode', label: 'S/O', width: '4%' },
  {
    key: 'supportOpposeCandidateName',
    field: 'supportOpposeCandidateLastName',
    label: 'S/O Candidate',
    width: '11%',
    render: (row) =>
      [row.supportOpposeCandidateFirstName, row.supportOpposeCandidateMiddleName, row.supportOpposeCandidateLastName]
        .filter(Boolean)
        .join(' ') || '-',
  },
  { key: 'supportOpposeCandidateOffice', field: 'supportOpposeCandidateOffice', label: 'Office', width: '5%' },
  { key: 'supportOpposeCandidateState', field: 'supportOpposeCandidateState', label: 'State', width: '5%' },
  { key: 'electionCode', field: 'electionCode', label: 'Election', width: '6%' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '13%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function SERenderer({ reportId, lineNumber = '24', perPage = 10 }: SERendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleEResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleEApi.getScheduleEData(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule E.');
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
      title="INDEPENDENT EXPENDITURES"
      columns={SE_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule E transactions found."
    />
  );
}
