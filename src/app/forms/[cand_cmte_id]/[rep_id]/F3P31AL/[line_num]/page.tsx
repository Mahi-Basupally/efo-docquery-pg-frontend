'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { ScheduleF3P31ALApi, ScheduleF3P31ALResponse } from '@/lib/api/f3p31al';

export default function F3P31ALPage() {
  const router = useRouter();
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;
  const lineNum = '31'; // Fixed line number for F3P31AL

  const [scheduleData, setScheduleData] = useState<ScheduleF3P31ALResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await ScheduleF3P31ALApi.getScheduleF3P31ALData(repId, lineNum, {
          page: currentPage,
          perPage: perPage,
        });

        setScheduleData(response);
      } catch (err) {
        console.error('Error fetching F3P31AL schedule data:', err);
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
    const committeeName = scheduleData?.meta?.committeeDetails?.committeeName;

    if (committeeName) {
      document.title = `${committeeName} - F3P31AL - EFO DocQuery`;
    } else {
      document.title = 'F3P31AL - EFO DocQuery';
    }

    return () => {
      document.title = 'EFO DocQuery';
    };
  }, [scheduleData]);

  const formatValue = (value: any, description: string): string => {
    if (value === null || value === undefined) return '-';

    // Format currency columns
    if (description.toLowerCase().includes('amount') ||
        description.toLowerCase().includes('aggregate') ||
        description.toLowerCase().includes('($)')) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (!isNaN(numValue)) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(numValue);
      }
    }

    // Format date columns
    if (description.toLowerCase().includes('date')) {
      try {
        const dateStr = String(value);
        if (dateStr.length === 8) {
          // Format YYYYMMDD to MM/DD/YYYY
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          return `${month}/${day}/${year}`;
        }
      } catch (e) {
        return String(value);
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

  const handleExportJSON = () => {
    if (!data) return;

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `F3P31AL_${committeeId}_${repId}_page_${currentPage}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!data || !columns) return;

    // Create CSV header
    const headers = columns.map(col => col.description).join(',');

    // Create CSV rows
    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col.apiFieldName];
        const formattedValue = formatValue(value, col.description);
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(formattedValue).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',');
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `F3P31AL_${committeeId}_${repId}_page_${currentPage}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    { label: 'Schedule A - Line 31(a)(i)', href: '' },
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
              {committeeDetails.formType} (FEC-{committeeDetails.reportId})
            </h2>

            <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
              <div className="row content__section">
                <div className="entity__figure row">

                  <div className="u-float-right" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="button button--cta button--export"
                        onClick={handleExportJSON}
                        title="Export as JSON"
                      >
                        Export JSON
                      </button>
                      <button
                        type="button"
                        className="button button--cta button--export"
                        onClick={handleExportCSV}
                        title="Export as CSV"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="heading--section heading--with-action">
                    <h3 className="entity__title">
                      DESCRIPTION OF ITEMS ON HAND TO BE LIQUIDATED (Line 31)
                    </h3>
                    <p className="t-sans" style={{ marginTop: '0.5rem', color: '#666' }}>
                      Contributions from Individuals/Persons Other Than Political Committees
                    </p>
                  </div>



                  {/* Data Table */}
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table
                      className="data-table data-table--heading-borders data-table--entity dataTable"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      <thead>
                        <tr>
                          {columns.map((col, index) => (
                            <th
                              key={index}
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
                              No transactions found for Line 31(a)(i).
                            </td>
                          </tr>
                        ) : (
                          data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {columns.map((col, colIndex) => {
                                const value = row[col.apiFieldName];
                                const isNumeric =
                                  col.description.toLowerCase().includes('amount') ||
                                  col.description.toLowerCase().includes('aggregate') ||
                                  col.description.toLowerCase().includes('($)');

                                return (
                                  <td
                                    key={colIndex}
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

                  {/* Pagination Controls */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '2rem',
                      paddingBottom: '2rem',
                      width: '100%',
                      flexWrap: 'wrap',
                      gap: '1rem'
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <span className="t-sans">
                        Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
                        {Math.min(pagination.page * pagination.perPage, pagination.totalRecords)} of{' '}
                        {pagination.totalRecords.toLocaleString()} entries
                      </span>

                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={!pagination.hasPrev}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: pagination.hasPrev ? '#fff' : '#f5f5f5',
                            cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
                            opacity: pagination.hasPrev ? 1 : 0.5,
                          }}
                          aria-label="First page"
                          title="First page"
                        >
                          ««
                        </button>

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
                          title="Previous page"
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
                          title="Next page"
                        >
                          ►
                        </button>

                        <button
                          onClick={() => handlePageChange(pagination.totalPages)}
                          disabled={!pagination.hasNext}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: pagination.hasNext ? '#fff' : '#f5f5f5',
                            cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
                            opacity: pagination.hasNext ? 1 : 0.5,
                          }}
                          aria-label="Last page"
                          title="Last page"
                        >
                          »»
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