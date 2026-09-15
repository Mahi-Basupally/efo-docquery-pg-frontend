'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { scheduleC1Api, ScheduleC1Response } from '@/lib/api/sc1';

export interface SC1RendererProps {
  reportId: string;
  lineNumber?: string;
  perPage?: number;
}

const SC1_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'lenderName', field: 'lenderName', label: "Lender's Name", width: '14%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '10%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '9%' },
  { key: 'city', field: 'city', label: 'City', width: '7%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '6%' },
  { key: 'amount', field: 'amount', label: 'Loan Amount', width: '8%', align: 'right', format: 'currency' },
  { key: 'interestRate', field: 'interestRate', label: 'Interest Rate', width: '6%' },
  { key: 'dateIncurred', field: 'dateIncurred', label: 'Date Incurred', width: '7%', format: 'date' },
  { key: 'dateDue', field: 'dateDue', label: 'Date Due', width: '7%' },
  { key: 'balance', field: 'balance', label: 'Total Balance', width: '8%', align: 'right', format: 'currency' },
  { key: 'collateralIndicator', field: 'collateralIndicator', label: 'Collateral?', width: '6%' },
  { key: 'basisOfLoanDescription', field: 'basisOfLoanDescription', label: 'Basis of Loan', width: '9%' },
  {
    key: 'authorizedName',
    field: 'authorizedLastName',
    label: 'Authorized By',
    width: '10%',
    render: (row) =>
      [row.authorizedFirstName, row.authorizedMiddleName, row.authorizedLastName]
        .filter(Boolean)
        .join(' ') || '-',
  },
  { key: 'authorizedTitle', field: 'authorizedTitle', label: 'Title', width: '8%' },
];

export default function SC1Renderer({ reportId, lineNumber = '9', perPage = 10 }: SC1RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<ScheduleC1Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId || !lineNumber) return;
    try {
      setLoading(true);
      setError(null);
      const result = await scheduleC1Api.getScheduleC1Data(reportId, lineNumber, {
        page,
        perPage: pageSize,
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule C-1.');
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
      title="LOAN AGREEMENT"
      columns={SC1_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Schedule C-1 transactions found."
    />
  );
}
