'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { h1Api, H1Response, H1RecordV3, H1RecordV4 } from '@/lib/api/h1';

export default function H1Page() {
  const router = useRouter();
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const repId = params.rep_id as string;

  const [scheduleData, setScheduleData] = useState<H1Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await h1Api.getH1Data(repId);

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
  }, [repId]);

  // Update document title when committee data is loaded
  useEffect(() => {
    const responseData = (scheduleData as any)?.data || scheduleData;
    const committeeName = responseData?.meta?.committeeDetails?.committeeName;

    if (committeeName) {
      document.title = `${committeeName} - EFO DocQuery`;
    } else {
      document.title = 'EFO DocQuery';
    }

    // Cleanup: restore default title on unmount
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

  // apiClient wraps response in data property
  const responseData = (scheduleData as any)?.data || scheduleData;
  const { data, meta } = responseData;

  const committeeDetails = meta?.committeeDetails;
  const version = meta?.version;
  const records = Array.isArray(data) ? data : [];
  const record = records.length > 0 ? records[0] : null;

  // Export to JSON
  const handleExport = () => {
    if (!records || records.length === 0) return;

    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `H1_${committeeId}_${repId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
    { label: committeeId, href: `/forms/${committeeId}` },
    { label: 'Report Summary', href: `/forms/${committeeId}/${repId}` },
    { label: 'Schedule H1', href: '' },
  ];

  // Checkbox component
  const Checkbox = ({ checked }: { checked: boolean }) => (
    <span style={{
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '1px solid #333',
      backgroundColor: '#fff',
      marginRight: '8px',
      textAlign: 'center',
      lineHeight: '14px',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {checked ? '✓' : ''}
    </span>
  );

  // Helper to check if value is checked (handles "X", "Y", true, etc.)
  const isChecked = (value: string | boolean | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toUpperCase() === 'X' || value.toUpperCase() === 'Y' || value === '1';
    }
    return !!value;
  };

  // Version 3 Layout Component
  const Version3Layout = ({ record }: { record: H1RecordV3 }) => {
    const getPoints = (value: string | null): string => {
      if (value === null || value === '0' || value === '') return '';
      return value;
    };

    const hasPoints = (value: string | null): boolean => {
      return value !== null && value !== '0' && value !== '';
    };

    const formatValue = (value: number | null): string => {
      if (value === null || value === 0) return '';
      return value.toString();
    };

    const formatPercent = (value: number | null): string => {
      if (value === null || value === 0) return '';
      return `${value}%`;
    };

    return (
      <>
        {/* Section A - National Party Committees */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            A. National Party Committees
          </h4>
          <div style={{ marginLeft: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={record.nationalPartyRate === 65} />
              Presidential Year (65%)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={record.nationalPartyRate === 60} />
              Other Year (60%)
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />

        {/* Section B - House and Senate Party Campaign Committees */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            B. House and Senate Party Campaign Committees
          </h4>
          <div className="entity__figure entity__figure--narrow">
            <div style={{ marginBottom: '1rem' }}>
              <Checkbox checked={!!record.houseSenateMinimumPercentage} />
              Minimum Federal Percentage (85%)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={!!(record.houseSenatePercentFederalSupport || record.houseSenatePercentNonFederal)} />
              Funds Expended
            </div>

            <table className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer">
              <thead className="bg-gray-50">
                <tr>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>
                    Description
                  </th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', backgroundColor: '#f5f5f5', width: '120px' }}>
                    Federal
                  </th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', backgroundColor: '#f5f5f5', width: '120px' }}>
                    Non-Federal
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    Estimated Direct Candidate Support
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatValue(record.houseSenatePercentFederalSupport)}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatPercent(record.houseSenatePercentNonFederal)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }} colSpan={3}>
                    Adjustments to Funds Expended:
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    Actual Direct Candidate Support
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatValue(record.houseSenateActualFederalSupport)}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatValue(record.houseSenateActualNonFederal)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    Actual Federal Percentage
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }} colSpan={2}>
                    {formatPercent(record.houseSenateActualPercentFederal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />

        {/* Section C - Separate Segregated Funds and Non-Connected Committees */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            C. Separate Segregated Funds and Non-Connected Committees
          </h4>
          <div className="entity__figure entity__figure--narrow">
            <table className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer">
              <thead className="bg-gray-50">
                <tr>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>
                    Description
                  </th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', backgroundColor: '#f5f5f5', width: '120px' }}>
                    Federal
                  </th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', backgroundColor: '#f5f5f5', width: '120px' }}>
                    Non-Federal
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }} colSpan={3}>
                    Funds Expended:
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    Estimated Direct Candidate Support
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatValue(record.estimatedPercentFederalSupport)}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatPercent(record.estimatedPercentNonFederal)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }} colSpan={3}>
                    Adjustments to Funds Expended:
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    Actual Direct Candidate Support
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatValue(record.actualFederalSupport)}
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {formatValue(record.actualNonFederal)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    Actual Federal Percentage
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }} colSpan={2}>
                    {formatPercent(record.actualPercentFederal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />

        {/* Section D - State and Local Party Committees */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            D. State and Local Party Committees
          </h4>
          <div className="entity__figure entity__figure--narrow">
            <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>
              Ballot Composition: Check all offices appearing on the next General Election Ballot
            </p>

            <table className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer">
              <thead className="bg-gray-50">
                <tr>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'left', backgroundColor: '#f5f5f5' }}>
                    Office
                  </th>
                  <th style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', backgroundColor: '#f5f5f5', width: '100px' }}>
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.presidential)} /> President
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.presidential) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.senate)} /> U.S. Senate
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.senate) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.house)} /> U.S. Congress
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.house) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                    Subtotal Federal
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    {getPoints(record.subtotal) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.governor)} /> Governor
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.governor) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.otherStatewide)} /> Other Statewide Offices
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.otherStatewide) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.stateSenate)} /> State Senate
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.stateSenate) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.stateRepresentative)} /> State Representative
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.stateRepresentative) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.local)} /> Local Candidates
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.local) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px' }}>
                    <Checkbox checked={hasPoints(record.extra)} /> Other Non-Federal Point
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>
                    {getPoints(record.extra) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                    Subtotal Non-Federal
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    {getPoints(record.subTotal) || '—'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #333', padding: '8px', fontWeight: 'bold' }}>
                    Total Points
                  </td>
                  <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    {getPoints(record.total) || '—'}
                  </td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginTop: '1rem' }}>
              <strong>Federal Allocation</strong> (Subtotal Federal ÷ Total Points): {record.federalPercentage !== null ? `${record.federalPercentage}%` : '_____%'}
            </p>
          </div>
        </div>
      </>
    );
  };

  // Version 4+ Layout Component
  const Version4Layout = ({ record }: { record: H1RecordV4 }) => (
    <>
      {/* Section A - State and Local Party Committees */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          A. State and Local Party Committees
        </h4>

        <div style={{ marginLeft: '1.5rem' }}>
          <h5 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Fixed Percentage:</h5>

          <div style={{ marginLeft: '1rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={isChecked(record.presidentialOnlyYear)} />
              Presidential-Only Election Year (28% Federal)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={isChecked(record.presidentialSenateYear)} />
              Presidential and Senate Election Year (36% Federal)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={isChecked(record.senateOnlyYear)} />
              Senate-Only Election Year (21% Federal)
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Checkbox checked={isChecked(record.nonPresidentialSenateYear)} />
              Non-Presidential and Non-Senate Election Year (15% Federal)
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />

      {/* Section B - Separate Segregated Funds and Nonconnected Committees */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          B. Separate Segregated Funds and Nonconnected Committees
        </h4>

        <div style={{ marginLeft: '1.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            Federal ...........{record.federalPercentage !== null ? `${record.federalPercentage}%` : '0%'}
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            Nonfederal ........{record.nonFederalPercentage !== null ? `${record.nonFederalPercentage}%` : '0%'}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>This ratio applies to:</p>
            <div style={{ marginLeft: '1rem' }}>
              <div style={{ marginBottom: '0.25rem' }}>
                <Checkbox checked={isChecked(record.administrativeRatioApplicable)} /> Administrative
              </div>
              <div style={{ marginBottom: '0.25rem' }}>
                <Checkbox checked={isChecked(record.genericVoterDriveRatioApplicable)} /> Generic Voter Drive
              </div>
              <div style={{ marginBottom: '0.25rem' }}>
                <Checkbox checked={isChecked(record.publicCommunicationsRatioApplicable)} /> Public Communications Referencing Party Only
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction ID */}
      {record.transactionId && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Transaction ID:</strong> {record.transactionId}
        </div>
      )}

      {/* Memo Text */}
      {record.memoText && (
        <>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />
          <div style={{ marginBottom: '1rem' }}>
            <strong>Memo:</strong> {record.memoText}
          </div>
        </>
      )}
    </>
  );

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
                        disabled={records.length === 0}
                        onClick={handleExport}
                      >
                        Export
                      </button>
                    </div>
                  </div>

                  <div className="heading--section heading--with-action">
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>
                      {version && version <= 3
                        ? 'METHOD OF ALLOCATION FOR SHARED FEDERAL AND NON-FEDERAL ADMINISTRATIVE EXPENSES AND GENERIC VOTER DRIVE COSTS'
                        : 'METHOD OF ALLOCATION (SCHEDULE H1)'
                      }
                    </h3>
                  </div>

                  {/* Method of Allocation Header */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    {version && version > 3 && (
                      <>
                        <p style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                          * ALLOCATED FEDERAL AND NONFEDERAL ADMINISTRATIVE, GENERIC VOTER DRIVE AND EXEMPT ACTIVITY COSTS
                        </p>
                        <p style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                          * ALLOCATED FEDERAL AND LEVIN FUNDS FEDERAL ELECTION ACTIVITY EXPENSES (State, District and Local Party Committees Only)
                        </p>
                        <p style={{ marginLeft: '1rem', marginBottom: '0.5rem' }}>
                          * ALLOCATED PUBLIC COMMUNICATIONS THAT REFER TO ANY POLITICAL PARTY (BUT NOT A CANDIDATE) (Separate Segregated Funds And Nonconnected Committees Only)
                        </p>
                      </>
                    )}
                  </div>


                  {/* Transaction ID for Version 3 */}
                  {version && version <= 3 && record && (
                    <p style={{ marginBottom: '1rem' }}>
                      <strong>Transaction ID:</strong> {(record as H1RecordV3).transactionId}
                    </p>
                  )}

                  {!record ? (
                    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                      <p className="t-sans">No allocation method records found for this report.</p>
                    </div>
                  ) : version && version <= 3 ? (
                    <Version3Layout record={record as H1RecordV3} />
                  ) : (
                    <Version4Layout record={record as H1RecordV4} />
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