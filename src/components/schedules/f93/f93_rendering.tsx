'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ScheduleRenderer, { ScheduleColumnConfig } from '../ScheduleRenderer';
import { f93Api, F93Response } from '@/lib/api/f93';

export interface F93RendererProps {
  reportId: string;
  perPage?: number;
}

// Renders one linked F94 (candidate identification) row as its own
// full-width row directly under the parent F93 transaction - see getSubRows
// below. Form 94 has no page of its own; this is the only place these show up.
function renderCandidateSubRow(candidate: Record<string, unknown>): ReactNode {
  const name =
    [candidate.candidateFirstName, candidate.candidateMiddleName, candidate.candidateLastName]
      .filter(Boolean)
      .join(' ') || '-';
  const office = [candidate.candidateOffice, candidate.candidateState, candidate.candidateDistrict]
    .filter(Boolean)
    .join('/');
  return (
    <>
      {'↳ Candidate: '}
      {name}
      {candidate.candidateId ? ` (${candidate.candidateId})` : ''}
      {office ? ` — ${office}` : ''}
    </>
  );
}

const F93_COLUMNS: ScheduleColumnConfig[] = [
  {
    key: 'entity',
    field: 'entityType',
    label: 'Entity',
    width: '7%',
  },
  {
    key: 'payeeName',
    field: 'payeeLastName',
    label: 'Payee Name',
    width: '15%',
    render: (row) => [row.payeeFirstName, row.payeeMiddleName, row.payeeLastName].filter(Boolean).join(' ') || '-',
  },
  { key: 'streetAddress1', field: 'streetAddress1', label: 'Street 1', width: '11%' },
  { key: 'streetAddress2', field: 'streetAddress2', label: 'Street 2', width: '10%' },
  { key: 'city', field: 'city', label: 'City', width: '8%' },
  { key: 'state', field: 'state', label: 'State', width: '5%' },
  { key: 'zipCode', field: 'zipCode', label: 'Zip', width: '7%' },
  { key: 'expenditurePurposeDescription', field: 'expenditurePurposeDescription', label: 'Purpose', width: '13%' },
  { key: 'payeeEmployer', field: 'payeeEmployer', label: 'Employer', width: '9%' },
  { key: 'payeeOccupation', field: 'payeeOccupation', label: 'Occupation', width: '8%' },
  { key: 'electionCode', field: 'electionCode', label: 'Election Code', width: '6%' },
  { key: 'expenditureDate', field: 'expenditureDate', label: 'Expenditure Date', width: '8%', format: 'date' },
  { key: 'communicationDate', field: 'communicationDate', label: 'Communication Date', width: '8%', format: 'date' },
  { key: 'amount', field: 'amount', label: 'Amount ($)', width: '8%', align: 'right', format: 'currency' },
];

export default function F93Renderer({ reportId, perPage = 50 }: F93RendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // page/perPage live in the URL (not component state) so pagination is
  // shareable/bookmarkable and survives a refresh - same pattern as SA/SB.
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('perPage')) || perPage;

  const [response, setResponse] = useState<F93Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!reportId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await f93Api.getF93Data(reportId, { page, perPage: pageSize });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Form 93.');
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
      title="Disbursement(s) Made or Obligation(s)"
      columns={F93_COLUMNS}
      data={response?.data ?? []}
      pagination={response?.meta.pagination}
      loading={loading}
      error={error}
      onPageChange={(nextPage) => updateUrl(nextPage, pageSize)}
      onPerPageChange={(value) => updateUrl(1, value)}
      emptyMessage="No Form 93 records found."
      getSubRows={(row) =>
        ((row.candidates as Array<Record<string, unknown>> | undefined) ?? []).map(renderCandidateSubRow)
      }
    />
  );
}
