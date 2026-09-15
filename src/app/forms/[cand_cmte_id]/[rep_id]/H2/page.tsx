'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { h2Api, H2Response, H2Transaction } from '@/lib/api/h2';
import { reportsApi, BasicInfo } from '@/lib/api/reports';
import { getFormTypeLabel } from '@/lib/formTypeUtils';


const Checkbox = ({ checked }: { checked: boolean }) => (
  <span
    style={{
      display: 'inline-block',
      width: '14px',
      height: '14px',
      border: '1px solid #333',
      backgroundColor: '#fff',
      marginRight: '6px',
      textAlign: 'center',
      lineHeight: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      verticalAlign: 'middle',
    }}
  >
    {checked ? '✓' : ''}
  </span>
);

const isChecked = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return value.toUpperCase() === 'X' || value.toUpperCase() === 'Y';
};


const formatPercent = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
};

export default function H2Page() {
  const router = useRouter();
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;

  const [scheduleData, setScheduleData] = useState<H2Response | null>(null);
  const [report, setReport] = useState<BasicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [response, reportResponse] = await Promise.all([
          h2Api.getH2Data(repId, {
            page: currentPage,
            perPage: perPage,
          }),
          reportsApi.getBasicInfo(repId),
        ]);

        setScheduleData(response);
        setReport(reportResponse.data);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    if (repId) {
      fetchScheduleData();
    }
  }, [repId, currentPage, perPage]);

  // Update document title when committee data is loaded
  useEffect(() => {
    const committeeName = report?.committeeName;

    if (committeeName) {
      document.title = `${committeeName} - EFO DocQuery`;
    } else {
      document.title = 'EFO DocQuery';
    }

    return () => {
      document.title = 'EFO DocQuery';
    };
  }, [report]);

  const handlePageChange = (newPage: number) => {
    if (scheduleData?.meta.pagination) {
      const { totalPages } = scheduleData.meta.pagination;
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !scheduleData || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Schedule data not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const { data, meta } = scheduleData;
  const { pagination } = meta;
  const committeeDetails = {
    committeeName: report.committeeName,
    committeeId: report.committeeId,
    reportId: report.reportId,
    formType: report.formType,
  };

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
    { label: committeeId, href: `/forms/${committeeId}` },
    { label: 'Report Summary', href: `/forms/${committeeId}/${repId}` },
    { label: 'Schedule H2', href: '' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="u-padding--left u-padding--right tab-interface">
        <header className="main">
          <h1 className="entity__name content__section--narrow">
            {committeeDetails.committeeName}
          </h1>
          <div className="heading--section">
            <span className="t-data t-bold entity__type">
              ID: {committeeDetails.committeeId}
            </span>
            <span className="t-data t-bold entity__type">
              Report Id: FEC-{committeeDetails.reportId}
            </span>
          </div>
        </header>

        <div className="data-container__wrapper">
          <ScheduleSidenav reportId={repId} />

          <section id="section-1" className="tab-content" role="tabpanel">
            <h2 id="section-1-heading">              
              {getFormTypeLabel(report?.formType)} (FEC-{report.reportId})
            </h2>

            <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
              <div className="row content__section">
                <div className="entity__figure row">

                  <div className="u-float-right" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        type="button"
                        className="button button--cta button--export"
                        onClick={() => {
                          const jsonStr = JSON.stringify(data, null, 2);
                          const blob = new Blob([jsonStr], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `schedule_H2_${repId}_page_${currentPage}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="heading--section heading--with-action">
                    <h3 className="entity__title">SCHEDULE H2 - ALLOCATION RATIOS</h3>
                  </div>

           
                  {!data || data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <p className="t-sans">No allocation ratio records found for this report.</p>
                    </div>
                  ) : (
                    <div style={{ marginTop: '1rem', border: '1px solid #333' }}>
                      {data.map((row: H2Transaction, index: number) => (
                        <div
                          key={row.transactionId ?? index}
                          style={{
                            display: 'flex',
                            borderTop: index === 0 ? 'none' : '1px solid #333',
                          }}
                        >
                          <div style={{ flex: 1, padding: '0.75rem 1rem', borderRight: '1px solid #333' }}>                           
                            <strong>ACTIVITY OR EVENT IDENTIFIER:</strong>     {row.event || '—'}                        
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>ACTIVITY IS:</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.35rem', marginLeft: '0.5rem' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Checkbox checked={isChecked(row.fundraisingIndicator)} />Fundraising
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Checkbox checked={isChecked(row.exemptIndicator)} />Exempt
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Checkbox checked={isChecked(row.directIndicator)} />Direct Candidate Support
                                </span>
                              </div>
                            </div>

                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong>CHECK IF THE RATIO IS:</strong>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.35rem', marginLeft: '0.5rem' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Checkbox checked={(row.ratioCode || '').toUpperCase() === 'N'} />New
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Checkbox checked={(row.ratioCode || '').toUpperCase() === 'R'} />Revised
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Checkbox checked={(row.ratioCode || '').toUpperCase() === 'S'} />Same as Previously Reported
                                </span>
                              </div>
                            </div>

                            <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '0.6rem' }}>
                              Transaction ID : {row.transactionId || '—'}
                            </div>
                          </div>

                          <div style={{ width: '130px', borderRight: '1px solid #333', padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <strong > FEDERAL %  </strong>
                            <div style={{ border: '1px solid #999', borderRadius: '4px', padding: '0.5rem', fontWeight: 'bold' }}>
                              {formatPercent(row.federalPercentage)}
                            </div>
                          </div>

                          <div style={{ width: '130px', padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                            <strong >
                              NONFEDERAL %
                            </strong >
                            <div style={{ border: '1px solid #999', borderRadius: '4px', padding: '0.5rem', fontWeight: 'bold' }}>
                              {formatPercent(row.nonFederalPercentage)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls - Bottom */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '2rem',
                      paddingBottom: '2rem',
                      width: '100%',
                    }}
                  >
                    {/* Left side - Results per page */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="t-sans">Results per page:</span>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          id="perPageBottom"
                          value={perPage}
                          onChange={handlePerPageChange}
                          style={{
                            padding: '0.5rem 2rem 0.5rem 0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '14px',
                            minWidth: '80px',
                            cursor: 'pointer',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            backgroundColor: 'white',
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>

                    {/* Right side - Showing entries and navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="t-sans">
                        Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
                        {Math.min(pagination.page * pagination.perPage, pagination.totalRecords)} of{' '}
                        {pagination.totalRecords} entries
                      </span>

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: pagination.hasPrev ? '#fff' : '#f5f5f5',
                            cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                            opacity: pagination.hasPrev ? 1 : 0.5,
                          }}
                          aria-label="Previous page"
                        >
                          ◄
                        </button>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.hasNext}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: pagination.hasNext ? '#fff' : '#f5f5f5',
                            cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                            opacity: pagination.hasNext ? 1 : 0.5,
                          }}
                          aria-label="Next page"
                        >
                          ►
                        </button>
                      </div>
                    </div>
                  </div>
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
