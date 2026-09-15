'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { h5Api, H5Response } from '@/lib/api/h5';

export interface H5RendererProps {
  reportId: string;
  perPage?: number;
}

// Order/labels match the efo.h5 field dictionary; imageNumber (imageno) and
// amend have no dictionary description, so - like the undocumented columns
// left out of h3/h4/h6 - they're excluded here too.
const H5_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'accountName', field: 'accountName', label: 'Account Name', width: '20%' },
  { key: 'receiptDate', field: 'receiptDate', label: 'Receipt Date', width: '14%', format: 'date' },
  { key: 'voterRegistrationAmount', field: 'voterRegistrationAmount', label: 'Voter Registration Amount', width: '16%', align: 'right', format: 'currency' },
  { key: 'voterIdAmount', field: 'voterIdAmount', label: 'Voter ID Amount', width: '14%', align: 'right', format: 'currency' },
  { key: 'gotvAmount', field: 'gotvAmount', label: 'GOTV Amount', width: '12%', align: 'right', format: 'currency' },
  { key: 'genericCampaignAmount', field: 'genericCampaignAmount', label: 'Generic Campaign Amount', width: '14%', align: 'right', format: 'currency' },
  { key: 'totalAmountTransferred', field: 'totalAmountTransferred', label: 'Total Amount Transferred', width: '14%', align: 'right', format: 'currency' },
];

export default function H5Renderer({ reportId, perPage = 50 }: H5RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/F56.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<H5Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await h5Api.getH5Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule H5.');
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
      title="ALLOCATION OF FEDERAL/NON-FEDERAL ACTIVITY TRANSFERS"
      columns={H5_COLUMNS}
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
