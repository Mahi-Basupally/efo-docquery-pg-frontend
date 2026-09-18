'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { reportsApi, BasicInfo } from '@/lib/api/reports';
import SERenderer from '@/components/schedules/se/se_rendering';
import FormCommitteeBasicInfo from '@/components/forms/FormCommitteeBasicInfo';
import { getFormTypeLabel } from '@/lib/formTypeUtils';

export default function ScheduleEPage() {
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;
  const filingMethod = params.filingMethod as string;
  const lineNum = params.line_num as string;

  const [report, setReport] = useState<BasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await reportsApi.getBasicInfo(repId);
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (repId) {
      fetchReport();
    }
  }, [repId]);

  // Update document title when committee data is loaded
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
    { label: `Schedule E - Line ${lineNum}`, href: '' },
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
                  <div className="heading--section heading--with-action">
                    <h3 className="entity__title">Schedule E (Line #{lineNum})</h3>
                  </div>

                  <SERenderer reportId={repId} lineNumber={lineNum} />
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
