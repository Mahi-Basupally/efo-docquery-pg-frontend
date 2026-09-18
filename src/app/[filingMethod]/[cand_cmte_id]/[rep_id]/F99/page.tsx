'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { reportsApi, BasicInfo } from '@/lib/api/reports';
import type { SummaryData } from '@/lib/api/types';
import F99Report from '@/components/forms/f99/f99_rendering';
import FormCommitteeBasicInfo from '@/components/forms/FormCommitteeBasicInfo';
import { getFormTypeLabel } from '@/lib/formTypeUtils';

// F99 (Miscellaneous Electronic Submission) can be attached to any report,
// not just one whose own primary form is F99 (e.g. an F1A that also filed
// misc text under the same repid) - so this fetches it directly via
// reportsApi.getF99 rather than going through the generic ReportSummaryPage/
// getSummaryLines dispatch, which is gated on the report's own form type.
export default function F99Page() {
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;
  const filingMethod = params.filingMethod as string;

  const [report, setReport] = useState<BasicInfo | null>(null);
  const [f99Data, setF99Data] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const [reportResponse, f99Response] = await Promise.allSettled([
          reportsApi.getBasicInfo(repId),
          reportsApi.getF99(repId),
        ]);

        if (reportResponse.status === 'fulfilled') {
          setReport(reportResponse.value.data);
        } else {
          throw reportResponse.reason;
        }

        if (f99Response.status === 'fulfilled') {
          setF99Data(f99Response.value.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching F99 data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (repId) {
      fetchData();
    }
  }, [repId]);

  useEffect(() => {
    if (report?.committeeName) {
      document.title = `${report.committeeName} - EFO DocQuery`;
    } else {
      document.title = 'EFO DocQuery';
    }

    return () => {
      document.title = 'EFO DocQuery';
    };
  }, [report]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Report not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
    { label: committeeId, href: `/${filingMethod}/${committeeId}` },
    { label: 'Report Summary', href: `/${filingMethod}/${committeeId}/${repId}` },
    { label: 'Form 99', href: '' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="u-padding--left u-padding--right tab-interface" style={{ overflow: 'visible' }}>
        <FormCommitteeBasicInfo name={report.committeeName} id={report.committeeId} reportId={report.reportId} reportType={report.reportType} />

        <div className="data-container__wrapper">
          <ScheduleSidenav reportId={repId} />

          <section id="section-1" className="tab-content" role="tabpanel">
            <h2 id="section-1-heading">
              {getFormTypeLabel(report?.formType)} (FEC-{report.reportId})
            </h2>

            <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
              <div className="row content__section">
                <div className="entity__figure row">
                  {notFound || !f99Data ? (
                    <p className="text-gray-500 text-center py-8">No Form 99 submission found for this report.</p>
                  ) : (
                    <F99Report data={f99Data as unknown as Parameters<typeof F99Report>[0]['data']} />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-16 bg-white border-t border-gray-200"></footer>
      </div>
    </>
  );
}
