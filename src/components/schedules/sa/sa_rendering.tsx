'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleAApi, ScheduleAResponse } from '@/lib/api/sa';

export interface SARendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SA_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'contributorName',
    field: 'contributorName',
    label: "Contributor's Name",
    width: '15%',
    render: (row) =>
      row.contributorName ??
      ([row.contributorFirstName, row.contributorMiddleName, row.contributorLastName]
        .filter(Boolean)
        .join(' ') || '-'),
  },
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
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '14%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function SARenderer({ reportId, lineNumber = '11AI', perPage = 10 }: SARendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern applied
  // to SB/SC/SC1's renderers.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleAResponse | null>(null);
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

  const updateUrl = (nextPage: number, nextPerPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    params.set('perPage', String(nextPerPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ScheduleRenderer
      title="ITEMIZED RECEIPTS"
      columns={SA_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule A transactions found."
    />
  );
}
