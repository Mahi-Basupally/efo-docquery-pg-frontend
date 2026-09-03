'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { scheduleC1Api, ScheduleC1Response, ScheduleC1Transaction } from '@/lib/api/sc1';

export default function SC1Page() {
  const router = useRouter();
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;
  const lineNum = params.line_num as string;

  const [scheduleData, setScheduleData] = useState<ScheduleC1Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await scheduleC1Api.getScheduleC1Data(repId, lineNum);

        setScheduleData(response);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    if (repId && lineNum) {
      fetchScheduleData();
    }
  }, [repId, lineNum]);

  // Update document title when committee data is loaded
  useEffect(() => {
    const committeeName = scheduleData?.meta?.committeeDetails?.committeeName;

    if (committeeName) {
      document.title = `${committeeName} - EFO DocQuery`;
    } else {
      document.title = 'EFO DocQuery';
    }

    return () => {
      document.title = 'EFO DocQuery';
    };
  }, [scheduleData]);

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
  const committeeDetails = meta?.committeeDetails;
  const records: ScheduleC1Transaction[] = Array.isArray(data) ? data : [];

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
    { label: committeeId, href: `/forms/${committeeId}` },
    { label: 'Report Summary', href: `/forms/${committeeId}/${repId}` },
    { label: 'Schedule C1', href: '' },
  ];

  // Format date
  const formatDate = (value: string | null): string => {
    if (!value) return 'N/A';
    // Handle both date string formats
    if (value.includes('GMT')) {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
    // Handle YYYYMMDD format
    if (/^\d{8}$/.test(value)) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      return `${month}/${day}/${year}`;
    }
    return value;
  };

  // Format full name
  const formatName = (
    prefix: string | null,
    fname: string | null,
    mname: string | null,
    lname: string | null,
    suffix: string | null
  ): string => {
    const parts = [prefix, fname, mname, lname, suffix].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'N/A';
  };

  // Export to JSON
  const handleExport = () => {
    if (!records || records.length === 0) return;

    setExporting(true);

    try {
      const jsonStr = JSON.stringify(records, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SC1_${committeeId}_${repId}_Line${lineNum}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  // SC1 Record Card Component - FEC DocQuery Style with expandable panel
  const SC1RecordCard = ({ record, index }: { record: ScheduleC1Transaction; index: number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const rowClass = index % 2 === 0 ? 'odd' : 'even';

    return (
      <>
        <tr
          className={`${rowClass} js-panel-trigger row--has-panel cursor-pointer hover:bg-blue-50 border-b border-gray-200`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <td className="p-2">{record.lenderName}</td>
          <td className="p-2">{record.streetAddress1}<br />{record.city}, {record.state}</td>
          <td className="p-2 text-right">{record.loanAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td className="p-2 text-right">{record.loanBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td className="p-2">{record.interestRate || 'N/A'}</td>
          <td className="p-2">{formatDate(record.dateIncurred)}</td>
          <td className="p-2">{formatDate(record.dateDue)}</td>
          <td className="p-2 text-center">
            <span className={`inline-block transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}>
              ▼
            </span>
          </td>
        </tr>
        {isExpanded && (
          <tr className={`${rowClass}-expand row-panel`}>
            <td colSpan={8} className="bg-gray-50 p-4">
              <div className="text-sm font-mono space-y-1">
                {/* Address */}
                <div className="mb-3">
                  <strong>Lender Address:</strong>
                  <div className="ml-4">
                    {record.streetAddress1}<br />
                    {record.streetAddress2 && <>{record.streetAddress2}<br /></>}
                    {record.city}, {record.state}  {record.zipCode}
                  </div>
                </div>

                {/* IDs */}
                <div><strong>Transaction ID:</strong> {record.transactionId}</div>
                <div><strong>REF-ID:</strong> {record.referenceId || 'N/A'}</div>

                <hr className="my-3 border-gray-300" />

                {/* Loan Status */}
                <div>
                  <strong>Restructured:</strong> {record.restructured === 'Y' ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Line of Credit:</strong> {record.creditLineSecuredAmount || 'None'}
                </div>
                <div>
                  <strong>Original Loan Date:</strong> {formatDate(record.originalLoanDate)}
                </div>

                <hr className="my-3 border-gray-300" />

                {/* Collateral */}
                <div>
                  <strong>Collateral Pledged:</strong> {record.collateralIndicator === 'Y' ? 'Yes' : 'No'}
                </div>
                {record.collateralIndicator === 'Y' && (
                  <div className="ml-4">
                    <div><strong>Description:</strong> {record.collateralDescription}</div>
                    <div><strong>Value:</strong> {record.collateralValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div><strong>Perfected Interest:</strong> {record.perfectedInterest === 'Y' ? 'Yes' : 'No'}</div>
                  </div>
                )}

                {/* Future Income */}
                {record.futureIncomeIndicator === 'Y' && (
                  <>
                    <hr className="my-3 border-gray-300" />
                    <div><strong>Future Income Pledged:</strong> Yes</div>
                    <div className="ml-4">
                      <div><strong>Description:</strong> {record.futureIncomeDescription}</div>
                      <div><strong>Estimated Value:</strong> {record.estimatedValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </>
                )}

                {/* Depository Account */}
                {record.depositorName && (
                  <>
                    <hr className="my-3 border-gray-300" />
                    <div><strong>Depository Account:</strong> {record.depositorName}</div>
                    <div className="ml-4">
                      {record.depositorStreet1}<br />
                      {record.depositorStreet2 && <>{record.depositorStreet2}<br /></>}
                      {record.depositorCity}, {record.depositorState}  {record.depositorZipCode}
                    </div>
                  </>
                )}

                <hr className="my-3 border-gray-300" />

                {/* Signatures */}
                <div className="ml-4">
                  <div>
                    <strong>Committee Treasurer:</strong>
                    <div className="ml-4">
                      {formatName(record.treasurerPrefix, record.treasurerFirstName, record.treasurerMiddleName, record.treasurerLastName, record.treasurerSuffix)}<br />
                      Date signed: {formatDate(record.treasurerSignedDate)}
                    </div>
                  </div>
                  <div>
                    <strong>Authorized Representative:</strong>
                    <div className="ml-4">
                      {formatName(record.authorizedPrefix, record.authorizedFirstName, record.authorizedMiddleName, record.authorizedLastName, record.authorizedSuffix)}<br />
                      Title: {record.authorizedTitle || 'N/A'}<br />
                      Date: {formatDate(record.authorizedDate)}
                    </div>
                  </div>
                </div>

                <hr className="my-3 border-gray-300" />

                <div className="text-xs text-gray-500">
                  Image Number: {record.imageNumber} | Line #: {record.lineNumber}
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  // Calculate totals
  const totalLoanAmount = records.reduce((sum, r) => sum + (r.loanAmount || 0), 0);
  const totalBalance = records.reduce((sum, r) => sum + (r.loanBalance || 0), 0);
  const totalCredit = records.reduce((sum, r) => sum + (r.creditLineSecuredAmount ? parseFloat(r.creditLineSecuredAmount) : 0), 0);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="u-padding--left u-padding--right tab-interface">
        <header className="main">
          <h1 className="entity__name content__section--narrow">
            {committeeDetails?.committeeName || 'Committee'}
          </h1>
          <div className="heading--section">
            <span className="t-data t-bold entity__type">
              ID: {committeeDetails?.committeeId || committeeId}
            </span>
            <span className="t-data t-bold entity__type">
              Report Id: FEC-{committeeDetails?.reportId || repId}
            </span>
          </div>
        </header>

        <div className="data-container__wrapper">
          <ScheduleSidenav reportId={repId} />

          <section id="section-1" className="tab-content" role="tabpanel">
            <h2 id="section-1-heading">
              {committeeDetails?.formType || 'Form'}(FEC-{committeeDetails?.reportId || repId})
            </h2>

            <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
              <div className="row content__section">
                <div className="entity__figure row">

                  <div className="u-float-right" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        type="button"
                        className="button button--cta button--export"
                        disabled={exporting || records.length === 0}
                        onClick={handleExport}
                      >
                        {exporting ? 'Exporting...' : 'Export'}
                      </button>
                    </div>
                  </div>

                  <div className="heading--section heading--with-action">
                    <h3 className="entity__title">LOANS AND LINES OF CREDIT FROM LENDING INSTITUTIONS - SCHEDULE C-1 (Line # {records[0]?.lineNumber || 'N/A'})</h3>
                  </div>

                  {records.length === 0 ? (
                    <div className="text-center p-6 bg-gray-50 rounded">
                      <p className="t-sans text-sm">No loan records found for this report.</p>
                    </div>
                  ) : (
                    <>
                      {/* Data Table */}
                      <div className="overflow-x-auto">
                        <table className="data-table data-table--heading-borders dataTable no-footer w-full text-sm">
                          <thead>
                            <tr>
                              <th className="p-2 text-left bg-gray-100 border-b-2 border-gray-300">Lender</th>
                              <th className="p-2 text-left bg-gray-100 border-b-2 border-gray-300">Location</th>
                              <th className="p-2 text-right bg-gray-100 border-b-2 border-gray-300">Amount</th>
                              <th className="p-2 text-right bg-gray-100 border-b-2 border-gray-300">Balance</th>
                              <th className="p-2 text-left bg-gray-100 border-b-2 border-gray-300">Rate</th>
                              <th className="p-2 text-left bg-gray-100 border-b-2 border-gray-300">Incurred</th>
                              <th className="p-2 text-left bg-gray-100 border-b-2 border-gray-300">Due</th>
                              <th className="p-2 text-center bg-gray-100 border-b-2 border-gray-300 w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="js-panel-toggle">
                            {records.map((record, index) => (
                              <SC1RecordCard key={record.transactionId || record.relatedLineNumber} record={record} index={index} />
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-200 font-bold">
                              <td className="p-2" colSpan={2}>Totals</td>
                              <td className="p-2 text-right">{totalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="p-2 text-right">{totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="p-2" colSpan={4}></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Summary Totals */}
                      <div className="mt-6 space-y-2 text-sm font-mono border-t-2 border-gray-400 pt-4">
                        <div><strong>Total Loan Amount For This Period:</strong> {totalLoanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div><strong>Total Credit For This Period:</strong> {totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div><strong>Total Balance For This Period:</strong> {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    </>
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