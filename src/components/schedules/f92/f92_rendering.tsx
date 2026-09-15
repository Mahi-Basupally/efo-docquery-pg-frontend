'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f92Api, F92Response } from '@/lib/api/f92';

export interface F92RendererProps {
  reportId: string;
  perPage?: number;
}

const F92_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'entity',
    field: 'entityType',
    label: 'Entity',
    width: '7%',
  },
  {
    key: 'donorName',
    field: 'donorLastName',
    label: 'Donor Name',
    width: '16%',
    render: (row) => [row.donorFirstName, row.donorMiddleName, row.donorLastName].filter(Boolean).join(' ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '12%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '10%' },
  { key: 'city', field: 'city', label: 'City', width: '9%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '7%' },
  { key: 'employer', field: 'employer', label: 'Employer', width: '9%' },
  { key: 'occupation', field: 'occupation', label: 'Occupation', width: '8%' },
  { key: 'electionCode', field: 'electionCode', label: 'Election Code', width: '6%' },
  { key: 'receiptDate', field: 'receiptDate', label: 'Date Received', width: '7%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '8%', align: 'right', format: 'currency' },
  { key: 'yearToDate', field: 'yearToDate', label: 'YTD ($)', width: '8%', align: 'right', format: 'currency' },
];

export default function F92Renderer({ reportId, perPage = 50 }: F92RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F92Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f92Api.getF92Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 92.');
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
      title="Donation(s) Received"
      columns={F92_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 92 records found."
    />
  );
}
