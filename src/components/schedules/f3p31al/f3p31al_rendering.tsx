'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f3p31alApi, F3P31ALResponse } from '@/lib/api/f3p31al';

export interface F3P31ALRendererProps {
  reportId: string;
  perPage?: number;
}

const F3P31AL_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'entity', field: 'entityType', label: 'Entity', width: '7%' },
  {
    key: 'contributorName',
    field: 'contributorLastName',
    label: "Contributor's Name",
    width: '15%',
    // lname doubles as the contributor organization name when entityType
    // is a committee (see f3p31al_service.py) - fall back to it if the
    // individual name parts are all empty.
    render: (row) =>
      [row.contributorFirstName, row.contributorMiddleName, row.contributorLastName].filter(Boolean).join(' ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '11%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '10%' },
  { key: 'city', field: 'city', label: 'City', width: '9%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '7%' },
  { key: 'electionCode', field: 'electionCode', label: 'Election Code', width: '7%' },
  { key: 'employer', field: 'employer', label: 'Employer', width: '8%' },
  { key: 'occupation', field: 'occupation', label: 'Occupation', width: '8%' },
  { key: 'contributionDate', field: 'contributionDate', label: 'Date', width: '7%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '8%', align: 'right', format: 'currency' },
  { key: 'transactionDescription', field: 'transactionDescription', label: 'Description', width: '10%' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '10%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function F3P31ALRenderer({ reportId, perPage = 50 }: F3P31ALRendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/F65.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F3P31ALResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f3p31alApi.getF3P31ALData(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule F3P31AL.');
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
      title="SCHEDULE F3P31AL - LINE 31 ITEMIZATION"
      columns={F3P31AL_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No transactions found for this report."
    />
  );
}
