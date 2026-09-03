'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { committeeApi, CommitteeDetail } from '@/lib/api/committees';
import { candidateApi, CandidateDetail } from '@/lib/api/candidates';
import { Form, formsApi } from '@/lib/api/forms';

// Type guard to check if ID is committee
const isCommitteeId = (id: string): boolean => id?.startsWith('C');

// Helper functions
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch {
    return 'N/A';
  }
};

const getCommitteeTypeName = (type: string): string => {
  const types: Record<string, string> = {
    H: 'House',
    S: 'Senate',
    P: 'Presidential',
    N: 'PAC - Nonqualified',
    Q: 'PAC - Qualified',
    I: 'Independent Expenditure',
    O: 'Super PAC',
    U: 'Single Candidate Independent Expenditure',
    V: 'PAC with Non-Contribution Account - Nonqualified',
    W: 'PAC with Non-Contribution Account - Qualified',
    X: 'Party - Nonqualified',
    Y: 'Party - Qualified',
    Z: 'National Party Nonfederal Account',
  };
  return types[type] || type;
};

const getFilingFrequency = (code: string): string => {
  const frequency: Record<string, string> = {
    Q: 'Quarterly',
    M: 'Monthly',
    A: 'Terminated',
    T: 'Terminated',
  };
  return frequency[code] || code;
};

export default function CommitteeFormsPage() {
  const router = useRouter();
  const params = useParams();
  const candCmteId = params.cand_cmte_id as string;

  // State
  const [forms, setForms] = useState<Form[]>([]);
  const [committeeDetail, setCommitteeDetail] = useState<CommitteeDetail | null>(null);
  const [candidateDetail, setCandidateDetail] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);

  const isCommittee = isCommitteeId(candCmteId);

  // Fetch entity details
  const fetchEntityDetails = useCallback(async () => {
    try {
      if (isCommittee) {
        const result = await committeeApi.getCommitteeById(candCmteId);
        setCommitteeDetail(result);
      } else {
        const result = await candidateApi.getCandidateById(candCmteId);
        setCandidateDetail(result);
      }
    } catch (err) {
      console.warn('Error fetching entity details:', err);
    }
  }, [candCmteId, isCommittee]);

  // Fetch forms
  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * pageSize;
      const data = await formsApi.getForms(candCmteId, pageSize, offset);
      setForms(data.data);
      setTotalRecords(data.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [candCmteId, currentPage, pageSize]);

  // Effects
  useEffect(() => {
    if (candCmteId) {
      fetchEntityDetails();
      fetchForms();
    }
  }, [candCmteId, fetchEntityDetails, fetchForms]);

  // Update document title
  useEffect(() => {
    const entityName = committeeDetail?.committeeName || candidateDetail?.candidateName || candCmteId;
    document.title = `${entityName} - EFO DocQuery`;

    return () => {
      document.title = 'EFO DocQuery';
    };
  }, [committeeDetail, candidateDetail, candCmteId]);

  // Event handlers
  const handlePerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  }, []);

  const handleFormClick = useCallback(
    (reportId: number) => {
      router.push(`/forms/${candCmteId}/${reportId}`);
    },
    [router, candCmteId]
  );

  const handleExport = useCallback(() => {
    const jsonStr = JSON.stringify(forms, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forms_${candCmteId}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [forms, candCmteId]);

  // Computed values
  const totalPages = Math.ceil(totalRecords / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const entityName = committeeDetail?.committeeName || candidateDetail?.candidateName || candCmteId;

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    { label: 'Committee profiles', href: '/docquery' },
    { label: entityName, href: `/forms/${candCmteId}` },
  ];

  // Filter forms by category
  const reportForms = forms.filter((f) => f.formCategory === 'reports');
  const noticeForms = forms.filter((f) => f.formCategory === 'notices');
  const statementForms = forms.filter((f) => f.formCategory === 'statements');
  const otherForms = forms.filter((f) => f.formCategory === 'other');

  // Render table rows
  const renderFormRow = (form: Form) => (
    <tr
      key={form.reportId}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => handleFormClick(form.reportId)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{form.formType}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-xs text-gray-500">{form.reportId}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(form.filedDate)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(form.fromDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(form.throughDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-mono text-gray-900">{form.reportCode || 'N/A'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-mono text-gray-900">{form.startingImageNumber || 'N/A'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFormClick(form.reportId);
          }}
          className="text-primary-600 hover:text-primary-900 inline-flex items-center"
        >
          View Details
          <Download className="w-4 h-4 ml-1" />
        </button>
      </td>
    </tr>
  );

  // Render forms table
  const renderFormsTable = (formsList: Form[], sectionId: string, title: string) => {
    return (
      <div id={sectionId} className="entity__figure row">
        <div className="heading--section heading--with-action">
          <h3 className="heading__left">{title}</h3>
        </div>
        {formsList.length === 0 ? (
          <div className="panel__main">
            <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No {title.toLowerCase()} available</p>
            </div>
          </div>
        ) : (
          <div className="panel__main">
            <table className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FEC ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coverage Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coverage End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image Number
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formsList.map(renderFormRow)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="u-padding--left u-padding--right tab-interface">
        <header className="main">
          <h1 className="entity__name content__section--narrow">{entityName}</h1>
          <div className="heading--section">
            {isCommittee && committeeDetail?.committeeFilingFrequency && (
              <>
                <span className="t-data t-bold entity__type">
                  <span
                    className={
                      committeeDetail.committeeFilingFrequency === 'M' ||
                      committeeDetail.committeeFilingFrequency === 'Q'
                        ? 'is-active-status'
                        : 'is-terminated-status'
                    }
                  >
                    {committeeDetail.committeeFilingFrequency === 'M' ||
                    committeeDetail.committeeFilingFrequency === 'Q'
                      ? 'Active'
                      : 'Terminated'}
                    {' - '}
                    {getFilingFrequency(committeeDetail.committeeFilingFrequency)}
                  </span>
                </span>
                {committeeDetail.committeeType && (
                  <span className="t-data t-bold entity__type">
                    {getCommitteeTypeName(committeeDetail.committeeType)}
                  </span>
                )}
              </>
            )}

            {!isCommittee && candidateDetail && (
              <>
                {candidateDetail.candidateDistrict && (
                  <span className="t-data t-bold entity__type">
                    District: {candidateDetail.candidateDistrict}
                  </span>
                )}
                {candidateDetail.candidateOfficeState && (
                  <>
                    {candidateDetail.candidateDistrict && ' | '}
                    <span className="t-data t-bold entity__type">
                      Office State: {candidateDetail.candidateOfficeState}
                    </span>
                  </>
                )}
              </>
            )}
            <span className="t-data t-bold entity__type">ID: {candCmteId}</span>
          </div>
        </header>

        <div className="data-container__wrapper">
          <nav className="sidebar side-nav-alt">
            <ul className="tablist" role="tablist" data-name="tab">
              <li className="side-nav__item" role="presentation">
                <a
                  className="side-nav__link"
                  role="tab"
                  data-name="filings"
                  tabIndex={0}
                  aria-controls="panel1"
                  href="#section-1"
                  aria-selected="true"
                >
                  Filings
                </a>
                <ul>
                  <li>
                    <a href="#reports">Regularly filed reports</a>
                  </li>
                  <li>
                    <a href="#notices">24- and 48-hour reports</a>
                  </li>
                  <li>
                    <a href="#statements">Statements of organization</a>
                  </li>
                  <li>
                    <a href="#other">Other documents</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Error Loading Forms</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600">Loading forms...</p>
              </div>
            </div>
          )}

          {!loading && !error && forms.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Forms Found</h3>
                <p className="text-gray-600">No forms are available for {candCmteId}</p>
              </div>
            </div>
          )}

          {!loading && !error && forms.length > 0 && (
            <section id="section-1">
              <h2 id="section-1-heading" className="text-lg font-semibold text-gray-900">
                Electronic Filings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete electronic filing history for this committee
              </p>
              <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
                <div className="u-float-right" style={{ marginBottom: '1rem' }}>
                  <button
                    type="button"
                    className="button button--cta button--export"
                    onClick={handleExport}
                  >
                    Export
                  </button>
                </div>

                {renderFormsTable(reportForms, 'reports', 'Regularly filed reports')}
                {renderFormsTable(noticeForms, 'notices', '24- and 48-hour reports')}
                {renderFormsTable(statementForms, 'statements', 'Statements of organization')}
                {renderFormsTable(otherForms, 'other', 'Other documents')}

                {/* Pagination Controls */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="t-sans">Results per page:</span>
                    <select
                      value={pageSize}
                      onChange={handlePerPageChange}
                      style={{
                        padding: '0.5rem 2rem 0.5rem 0.75rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px',
                        minWidth: '80px',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="t-sans">
                      Showing {(currentPage - 1) * pageSize + 1} to{' '}
                      {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
                    </span>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={!hasPrevPage}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          background: hasPrevPage ? '#fff' : '#f5f5f5',
                          cursor: hasPrevPage ? 'pointer' : 'not-allowed',
                          opacity: hasPrevPage ? 1 : 0.5,
                        }}
                        aria-label="Previous page"
                      >
                        ◄
                      </button>

                      <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={!hasNextPage}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          background: hasNextPage ? '#fff' : '#f5f5f5',
                          cursor: hasNextPage ? 'pointer' : 'not-allowed',
                          opacity: hasNextPage ? 1 : 0.5,
                        }}
                        aria-label="Next page"
                      >
                        ►
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
        <footer className="mt-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              EFO DocQuery - Federal Election Commission
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}