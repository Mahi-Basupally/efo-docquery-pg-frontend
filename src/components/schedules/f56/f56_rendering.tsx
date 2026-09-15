'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f56Api, F56Response } from '@/lib/api/f56';

export interface F56RendererProps {
  reportId: string;
  perPage?: number;
}

const F56_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'entity',
    field: 'entity',
    label: 'Entity',
    width: '8%',
  },
  {
    key: 'name',
    field: 'lastName',
    label: 'Name',
    width: '17%',
    render: (row) => [row.lastName, row.firstName, row.middleName].filter(Boolean).join(', ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '13%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '12%' },
  { key: 'city', field: 'city', label: 'City', width: '10%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'employer', field: 'employer', label: 'Employer', width: '10%' },
  { key: 'occupation', field: 'occupation', label: 'Occupation', width: '8%' },
  { key: 'contributionDate', field: 'contributionDate', label: 'Date', width: '8%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '8%', align: 'right', format: 'currency' },
  {
    key: 'payeeId',
    field: 'payeeCommitteeId',
    label: 'Payee Cand./Cmte. ID',
    width: '9%',
    render: (row) => (row.payeeCommitteeId ?? row.payeeCandidateId ?? '-') as string,
  },
];

export default function F56Renderer({ reportId, perPage = 50 }: F56RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F56Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f56Api.getF56Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 56.');
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
      title="Form 56"
      columns={F56_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 56 records found."
    />
  );
}
