'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f91Api, F91Response } from '@/lib/api/f91';

export interface F91RendererProps {
  reportId: string;
  perPage?: number;
}

const F91_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'controllerName',
    field: 'controllerLastName',
    label: 'Controller Name',
    width: '18%',
    render: (row) =>
      [row.controllerFirstName, row.controllerMiddleName, row.controllerLastName].filter(Boolean).join(' ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '14%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '12%' },
  { key: 'city', field: 'city', label: 'City', width: '10%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'controllerEmployer', field: 'controllerEmployer', label: 'Employer', width: '12%' },
  { key: 'controllerOccupation', field: 'controllerOccupation', label: 'Occupation', width: '10%' },
];

export default function F91Renderer({ reportId, perPage = 50 }: F91RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F91Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f91Api.getF91Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 91.');
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
      title="Person(s) Sharing/Exercising Control"
      columns={F91_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 91 records found."
    />
  );
}
