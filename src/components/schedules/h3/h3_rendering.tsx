'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { h3Api, H3Response } from '@/lib/api/h3';

export interface H3RendererProps {
  reportId: string;
  perPage?: number;
}

// FEC Schedule H3 event type codes.
const EVENT_TYPE_LABELS: Record<string, string> = {
  AD: 'Administrative',
  GV: 'Generic Voter Drive',
  DF: 'Direct Fundraising',
  DC: 'Direct Candidate Support',
  EA: 'Exempt Activities',
  PC: 'Public Communications Referring Only to Party (made by PAC)',
};

const H3_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'accountName', field: 'accountName', label: 'Account', width: '18%' },
  { key: 'event', field: 'event', label: 'Event', width: '18%' },
  {
    key: 'eventType',
    field: 'eventType',
    label: 'Event Type',
    width: '16%',
    render: (row) => {
      const value = row.eventType;
      if (value === null || value === undefined || value === '') return '-';
      return EVENT_TYPE_LABELS[String(value).toUpperCase()] ?? String(value);
    },
  },
  { key: 'receiptDate', field: 'receiptDate', label: 'Receipt Date', width: '12%', format: 'date' },
  { key: 'transferAmount', field: 'transferAmount', label: 'Transfer Amount ($)', width: '18%', align: 'right', format: 'currency' },
  {
    key: 'totalAmountTransferred',
    field: 'totalAmountTransferred',
    label: 'Total Amount Transferred ($)',
    width: '18%',
    align: 'right',
    format: 'currency',
  },
];

export default function H3Renderer({ reportId, perPage = 50 }: H3RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/F56.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<H3Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await h3Api.getH3Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Schedule H3.');
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
      title="RATIOS FOR ALLOCATED FEDERAL/NON-FEDERAL ACTIVITY"
      columns={H3_COLUMNS}
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
