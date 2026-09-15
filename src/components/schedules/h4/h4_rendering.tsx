'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { h4Api, H4Response } from '@/lib/api/h4';

export interface H4RendererProps {
  reportId: string;
  perPage?: number;
}

const H4_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'payeeName', field: 'payeeName', label: "Payee's Name", width: '12%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '9%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '9%' },
  { key: 'city', field: 'city', label: 'City', width: '7%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '6%' },
  { key: 'expenditurePurposeDescription', field: 'expenditurePurposeDescription', label: 'Purpose', width: '10%' },
  { key: 'expenditureDate', field: 'expenditureDate', label: 'Date of Event', width: '8%', format: 'date' },
  { key: 'allocatedActivityEvent', field: 'allocatedActivityEvent', label: 'Allocated Activity', width: '9%' },
  { key: 'federalShare', field: 'federalShare', label: 'Federal', width: '7%', align: 'right', format: 'currency' },
  { key: 'nonFederalShare', field: 'nonFederalShare', label: 'Non-Federal', width: '7%', align: 'right', format: 'currency' },
  { key: 'totalFederalNonFederalAmount', field: 'totalFederalNonFederalAmount', label: 'Total', width: '7%', align: 'right', format: 'currency' },
  { key: 'ytdAmount', field: 'ytdAmount', label: 'YTD', width: '7%', align: 'right', format: 'currency' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '9%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
  { key: 'categoryCode', field: 'categoryCode', label: 'Category Code', width: '6%' },
];

export default function H4Renderer({ reportId, perPage = 50 }: H4RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/F56.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<H4Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await h4Api.getH4Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule H4.');
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
      title="DISBURSEMENTS FOR ALLOCATED FEDERAL/NON-FEDERAL ACTIVITY"
      columns={H4_COLUMNS}
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
