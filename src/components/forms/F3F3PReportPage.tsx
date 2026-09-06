'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { reportsApi } from '@/lib/api/reports';
import type { FinancialReportData } from './FinancialReportRenderer';
import F3Report from './f3/f3_rendering';
import F3PReport from './f3p/f3p_rendering';
import SummaryDetailPage from '@/components/reports/SummaryDetailPage';

export default function F3F3PReportPage() {
  const params = useParams();
  const reportId = params.rep_id as string;
  const [formType, setFormType] = useState<string | null>(null);
  const [data, setData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!reportId) return;
      try {
        setLoading(true);
        const reportResponse = await reportsApi.getReportById(reportId);
        const type = String(reportResponse.data.formType || '').toUpperCase();
        if (cancelled) return;
        setFormType(type);

        if (type === 'F3' || type === 'F3P') {
          const summaryResponse = await reportsApi.getSummaryLines(reportId);
          if (!cancelled) setData(summaryResponse.data as unknown as FinancialReportData);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load report.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [reportId]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading report...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  if (formType === 'F3' && data) return <F3Report data={data} />;
  if (formType === 'F3P' && data) return <F3PReport data={data} />;

  return <SummaryDetailPage />;
}
