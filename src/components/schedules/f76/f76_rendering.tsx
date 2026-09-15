'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f76Api, F76Response } from '@/lib/api/f76';

export interface F76RendererProps {
  reportId: string;
  perPage?: number;
}

// SO = "support/oppose" - supportOpposeCode is support/oppose, and the
// supportOpposeCandidate* fields are the candidate the communication
// supports or opposes.
const SUPPORT_OPPOSE_LABELS: Record<string, string> = {
  S: 'Support',
  O: 'Oppose',
};

const F76_COLUMNS: ScheduleColumnConfig[] = [
  { key: 'communicationType', field: 'communicationType', label: 'Communication Type', width: '10%' },
  { key: 'communicationTypeOtherDescription', field: 'communicationTypeOtherDescription', label: 'Type - Other Description', width: '14%' },
  { key: 'communicationClass', field: 'communicationClass', label: 'Communication Class', width: '10%' },
  { key: 'communicationDate', field: 'communicationDate', label: 'Communication Date', width: '9%', format: 'date' },
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
    width: '15%',
    render: (row) =>
      [row.supportOpposeCandidateFirstName, row.supportOpposeCandidateMiddleName, row.supportOpposeCandidateLastName]
        .filter(Boolean)
        .join(' ') || '-',
  },
  { key: 'supportOpposeCandidateId', field: 'supportOpposeCandidateId', label: 'S/O Candidate ID', width: '9%' },
  { key: 'supportOpposeCandidateOffice', field: 'supportOpposeCandidateOffice', label: 'Office', width: '6%' },
  { key: 'supportOpposeCandidateState', field: 'supportOpposeCandidateState', label: 'State', width: '5%' },
  { key: 'supportOpposeCandidateDistrict', field: 'supportOpposeCandidateDistrict', label: 'District', width: '5%' },
  { key: 'electionCode', field: 'electionCode', label: 'Election Code', width: '7%' },
  { key: 'communicationCost', field: 'communicationCost', label: 'Cost ($)', width: '8%', align: 'right', format: 'currency' },
];

export default function F76Renderer({ reportId, perPage = 50 }: F76RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F76Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f76Api.getF76Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 76.');
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
      title="Form 76"
      columns={F76_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 76 records found."
    />
  );
}
