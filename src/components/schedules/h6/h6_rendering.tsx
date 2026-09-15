'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { h6Api, H6Response } from '@/lib/api/h6';

export interface H6RendererProps {
  reportId: string;
  perPage?: number;
}

const isChecked = (value: unknown): boolean =>
  typeof value === 'string' && (value.trim().toUpperCase() === 'X' || value.trim().toUpperCase() === 'Y');

const H6_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'payeeName', field: 'payeeName', label: "Payee's Name", width: '12%' },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '9%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '9%' },
  { key: 'city', field: 'city', label: 'City', width: '7%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '6%' },
  {
    key: 'activityIndicator',
    field: 'activityIndicator',
    label: 'Activity Is',
    width: '10%',
    // Whichever of voterRegistrationIndicator/gotvIndicator/voterIdIndicator/
    // genericCampaignIndicator is 'X' on the row (see h6_service.py's
    // FIELD_MAP note: gotvIndicator/voterIdIndicator are labeled per the
    // dictionary, not the raw column names, so their labels stay as documented).
    render: (row) =>
      [
        isChecked(row.voterRegistrationIndicator) && 'Voter Registration',
        isChecked(row.gotvIndicator) && 'GOTV',
        isChecked(row.voterIdIndicator) && 'Voter ID',
        isChecked(row.genericCampaignIndicator) && 'Generic Campaign',
      ].filter(Boolean).join(', ') || '-',
  },
  { key: 'expenditureDate', field: 'expenditureDate', label: 'Expenditure Date', width: '8%', format: 'date' },
  { key: 'totalFederalLevinAmount', field: 'totalFederalLevinAmount', label: 'Total Fed-Levin Amount', width: '8%', align: 'right', format: 'currency' },
  { key: 'federalShare', field: 'federalShare', label: 'Federal Share', width: '7%', align: 'right', format: 'currency' },
  { key: 'levinShare', field: 'levinShare', label: 'Levin Share', width: '7%', align: 'right', format: 'currency' },
  { key: 'ytdAmount', field: 'ytdAmount', label: 'Activity/Event Total YTD', width: '8%', align: 'right', format: 'currency' },
  { key: 'expenditureDescription', field: 'expenditureDescription', label: 'Expenditure Purpose Description', width: '10%' },
  {
    key: 'memo',
    field: 'memoText',
    label: 'Memo',
    width: '9%',
    render: (row) => [row.memoCode, row.memoText].filter(Boolean).join(' — ') || '-',
  },
];

export default function H6Renderer({ reportId, perPage = 50 }: H6RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/F56.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<H6Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await h6Api.getH6Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule H6.');
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
      title="ALLOCATED FEDERAL/NON-FEDERAL ACTIVITY RATIO ADJUSTMENTS"
      columns={H6_COLUMNS}
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
