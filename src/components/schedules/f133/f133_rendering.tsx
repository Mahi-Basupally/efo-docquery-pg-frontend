'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f133Api, F133Response } from '@/lib/api/f133';

export interface F133RendererProps {
  reportId: string;
  perPage?: number;
}

const F133_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'entity',
    field: 'entityType',
    label: 'Entity',
    width: '7%',
  },
  {
    key: 'contributorName',
    field: 'contributorLastName',
    label: 'Contributor Name',
    width: '17%',
    render: (row) =>
      row.contributorOrganizationName ??
      ([row.contributorFirstName, row.contributorMiddleName, row.contributorLastName].filter(Boolean).join(' ') || '-'),
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '13%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '11%' },
  { key: 'city', field: 'city', label: 'City', width: '9%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'refundDate', field: 'refundDate', label: 'Refund Date', width: '9%', format: 'date' },
  { key: 'refundAmount', field: 'refundAmount', label: 'Refund Amount ($)', width: '10%', align: 'right', format: 'currency' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '14%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function F133Renderer({ reportId, perPage = 50 }: F133RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F133Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f133Api.getF133Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 13-3.');
    } finally {
      setLoading(false);
    }
  }, [reportId, page, pageSize]);

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
      title="Form 13-3"
      columns={F133_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 13-3 records found."
    />
  );
}
