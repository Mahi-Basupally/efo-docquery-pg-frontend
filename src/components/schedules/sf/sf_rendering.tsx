'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleFApi, ScheduleFResponse } from '@/lib/api/sf';

export interface SFRendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SF_COLUMNS: ScheduleColumnConfig[] = [
  // sf_service.py composes payeeName for IND/CAN rows too (via format_name),
  // same as sd_service.py/se_service.py - no frontend fallback needed.
  { key: 'payeeName', field: 'payeeName', label: "Payee's Name", width: '13%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '9%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '8%' },
  { key: 'city', field: 'city', label: 'City', width: '7%' },
  { key: 'state', field: 'state', label: 'State', width: '4%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '5%' },
  { key: 'transactionDescription', field: 'transactionDescription', label: 'Purpose', width: '11%' },
  { key: 'transactionDate', field: 'transactionDate', label: 'Date', width: '6%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount', width: '6%', align: 'right', format: 'currency' },
  { key: 'aggregateGeneralElectionExpenditure', field: 'aggregateGeneralElectionExpenditure', label: 'Aggregate General Election', width: '8%', align: 'right', format: 'currency' },
  {
    key: 'payeeCandidateName',
    field: 'payeeCandidateLastName',
    label: 'Payee Candidate',
    width: '10%',
    render: (row) =>
      [row.payeeCandidateFirstName, row.payeeCandidateMiddleName, row.payeeCandidateLastName]
        .filter(Boolean)
        .join(' ') || '-',
  },
  { key: 'payeeCandidateOffice', field: 'payeeCandidateOffice', label: 'Office', width: '4%' },
  { key: 'designatingCommitteeName', field: 'designatingCommitteeName', label: 'Designating Committee', width: '11%' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '13%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function SFRenderer({ reportId, lineNumber = '25', perPage = 10 }: SFRendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleFResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleFApi.getScheduleFData(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule F.');
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
      title="COORDINATED PARTY EXPENDITURES"
      columns={SF_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule F transactions found."
    />
  );
}
