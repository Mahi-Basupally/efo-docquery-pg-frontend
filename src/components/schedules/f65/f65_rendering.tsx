'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f65Api, F65Response } from '@/lib/api/f65';

export interface F65RendererProps {
  reportId: string;
  perPage?: number;
}

const F65_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'entity',
    field: 'entityType',
    label: 'Entity',
    width: '8%',
  },
  {
    key: 'contributorName',
    field: 'contributorLastName',
    label: 'Contributor Name',
    width: '18%',
    render: (row) =>
      [row.contributorFirstName, row.contributorMiddleName, row.contributorLastName].filter(Boolean).join(' ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '13%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '12%' },
  { key: 'city', field: 'city', label: 'City', width: '10%' },
  { key: 'state', field: 'state', label: 'State', width: '6%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '8%' },
  { key: 'employer', field: 'employer', label: 'Employer', width: '10%' },
  { key: 'occupation', field: 'occupation', label: 'Occupation', width: '8%' },
  { key: 'contributionDate', field: 'contributionDate', label: 'Date', width: '8%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '9%', align: 'right', format: 'currency' },
  {
    key: 'contributorId',
    field: 'contributorCommitteeId',
    label: 'Contributor Cand./Cmte. ID',
    width: '9%',
    render: (row) => (row.contributorCommitteeId ?? row.contributorCandidateId ?? '-') as string,
  },
];

export default function F65Renderer({ reportId, perPage = 50 }: F65RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F65Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f65Api.getF65Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 65.');
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
      title="Form 65"
      columns={F65_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 65 records found."
    />
  );
}
