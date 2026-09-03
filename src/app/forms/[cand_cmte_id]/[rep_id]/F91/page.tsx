'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { f91Api, F91Response, F91Column } from '@/lib/api/f91';

export default function F91Page() {
  const router = useRouter();
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;

  const [scheduleData, setScheduleData] = useState<F91Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await f91Api.getF91Data(repId, {
          page: currentPage,
          per_page: perPage,
        });

        setScheduleData(response);
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

  const formatValue = (value: any, columnName: string): string => {
    if (value === null || value === undefined) return '-';

    // Format currency columns
    if (columnName.toLowerCase().includes('amount') ||
        columnName.toLowerCase().includes('aggregate') ||
        columnName.toLowerCase().includes('($)')) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numValue)) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(numValue);
      }
    }

    return String(value);
  };

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

  if (error || !scheduleData) {
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
  const { columns, pagination, committeeDetails } = meta;

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
    { label: committeeId, href: `/forms/${committeeId}` },
    { label: 'Report Summary', href: `/forms/${committeeId}/${repId}` },
    { label: 'Form F91', href: '' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="u-padding--left u-padding--right tab-interface">
        <header className="main">
          <h1 className="entity__name content__section--narrow">
            {committeeDetails.cmte_name}
          </h1>
          <div className="heading--section">
            <span className="t-data t-bold entity__type">
              ID: {committeeDetails.comid}
            </span>
            <span className="t-data t-bold entity__type">
              Report Id: FEC-{committeeDetails.repid}
            </span>
          </div>
        </header>

        <div className="data-container__wrapper">
          <ScheduleSidenav reportId={repId} />

          <section id="section-1" className="tab-content" role="tabpanel">
            <h2 id="section-1-heading">
              {committeeDetails.form_type}(FEC-{committeeDetails.repid})
            </h2>

            <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
              <div className="row content__section">
                <div className="entity__figure row">
                  {/* Pagination Controls - Top */}
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
                          a.download = `form_F91_${repId}_page_${currentPage}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="heading--section heading--with-action">
                    <h3 className="entity__title">Form F91</h3>
                  </div>

                  {/* Data Table */}
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table
                      className="data-table data-table--heading-borders data-table--entity dataTable"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      <thead>
                        <tr>
                          {columns.map((col) => (
                            <th
                              key={col.column_name}
                              style={{
                                textAlign: col.description.toLowerCase().includes('amount') ||
                                          col.description.toLowerCase().includes('aggregate') ||
                                          col.description.toLowerCase().includes('($)')
                                  ? 'right'
                                  : 'left',
                                whiteSpace: 'nowrap',
                                padding: '0.75rem 0.5rem',
                              }}
                            >
                              {col.description}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {!data || data.length === 0 ? (
                          <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                              No transactions found.
                            </td>
                          </tr>
                        ) : (
                          data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {columns.map((col) => {
                                // Access data using lowercase description as the key
                                const value = row[col.description.toLowerCase()];
                                const isNumeric =
                                  col.description.toLowerCase().includes('amount') ||
                                  col.description.toLowerCase().includes('aggregate') ||
                                  col.description.toLowerCase().includes('($)');

                                return (
                                  <td
                                    key={col.column_name}
                                    style={{
                                      textAlign: isNumeric ? 'right' : 'left',
                                      padding: '0.75rem 0.5rem',
                                    }}
                                  >
                                    {formatValue(value, col.description)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

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
                        <span
                          style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            fontSize: '12px',
                            color: '#666',
                          }}
                        >
                          ▼
                        </span>
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