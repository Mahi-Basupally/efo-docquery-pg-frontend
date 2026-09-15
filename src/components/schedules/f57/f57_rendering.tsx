'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f57Api, F57Response } from '@/lib/api/f57';

export interface F57RendererProps {
  reportId: string;
  perPage?: number;
}

// SO = "support/oppose" - so is a support/oppose (against) code, and
// so_can_* is the candidate the expenditure supports or opposes.
const SUPPORT_OPPOSE_LABELS: Record<string, string> = {
  S: 'Support',
  O: 'Oppose',
};

const F57_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'payeeName',
    field: 'payeeLastName',
    label: 'Payee Name',
    width: '14%',
    render: (row) =>
      [row.payeeFirstName, row.payeeMiddleName, row.payeeLastName].filter(Boolean).join(' ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '11%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '10%' },
  { key: 'city', field: 'city', label: 'City', width: '8%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '7%' },
  {
    key: 'payeeId',
    field: 'payeeCommitteeId',
    label: 'Payee Cand./Cmte. ID',
    width: '9%',
    render: (row) => (row.payeeCommitteeId ?? row.payeeCandidateId ?? '-') as string,
  },
  { key: 'expenditurePurposeDescription', field: 'expenditurePurposeDescription', label: 'Purpose', width: '12%' },
  { key: 'disseminationDate', field: 'disseminationDate', label: 'Dissemination Date', width: '9%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '8%', align: 'right', format: 'currency' },
  {
    key: 'supportOppose',
    field: 'supportOpposeCode',
    label: 'Support/Oppose',
    width: '9%',
    render: (row) => {
      const code = row.supportOpposeCode as string | null | undefined;
      return code ? (SUPPORT_OPPOSE_LABELS[code.toUpperCase()] ?? code) : '-';
    },
  },
  {
    key: 'supportOpposeCandidate',
    field: 'supportOpposeCandidateLastName',
    label: 'Support/Oppose Candidate',
    width: '17%',
    render: (row) =>
      [row.supportOpposeCandidateFirstName, row.supportOpposeCandidateMiddleName, row.supportOpposeCandidateLastName]
        .filter(Boolean)
        .join(' ') || '-',
  },
];

export default function F57Renderer({ reportId, perPage = 50 }: F57RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F57Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f57Api.getF57Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 57.');
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
      title="Form 57"
      columns={F57_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 57 records found."
    />
  );
}
