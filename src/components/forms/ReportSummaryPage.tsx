'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import FormCommitteeBasicInfo from '@/components/forms/FormCommitteeBasicInfo';
import { reportsApi, BasicInfo } from '@/lib/api/reports';
import type { FinancialReportData } from './FinancialReportRenderer';
import F1Report, { F1ReportData } from './f1/f1_rendering';
import F1MReport, { F1MReportData } from './f1m/f1m_rendering';
import F2Report, { F2ReportData } from './f2/f2_rendering';
import F3Report from './f3/f3_rendering';
import F3PReport from './f3p/f3p_rendering';
import F3PSReport from './f3ps/f3ps_rendering';
import F3SReport from './f3s/f3s_rendering';
import F4Report from './f4/f4_rendering';
import F5Report from './f5/f5_rendering';
import F6Report from './f6/f6_rendering';
import F7Report from './f7/f7_rendering';
import F9Report from './f9/f9_rendering';
import F10Report from './f10/f10_rendering';
import F13Report from './f13/f13_rendering';
import F24Report from './f24/f24_rendering';
import F99Report from './f99/f99_rendering';
import SummaryDetailPage from '@/components/reports/SummaryDetailPage';
import { getFormTypeLabel } from '@/lib/formTypeUtils';

// F1, F1M and F2 are all data-only (see f1_service.py/f1m_service.py/
// f2_service.py) but their sections have their own semantically-named
// fields per section (joint fundraiser participants, connected
// organizations, authorized committees, candidates contributed to, etc.)
// rather than one shared shape - too heterogeneous for
// FinancialReportRenderer's fixed line shapes, so each gets its own bespoke
// renderer (f1/f1_rendering.tsx, f1m/f1m_rendering.tsx, f2/f2_rendering.tsx)
// instead.
const FORM_RENDERERS: Record<string, (data: FinancialReportData) => JSX.Element> = {
  F1: (data) => <F1Report data={data as unknown as F1ReportData} />,
  F1M: (data) => <F1MReport data={data as unknown as F1MReportData} />,
  F2: (data) => <F2Report data={data as unknown as F2ReportData} />,
  F3: (data) => <F3Report data={data} />,
  F3S: (data) => <F3SReport data={data} />,
  F3P: (data) => <F3PReport data={data} />,
  F3PS: (data) => <F3PSReport data={data} />,
  F4: (data) => <F4Report data={data} />,
  F5: (data) => <F5Report data={data} />,
  F6: (data) => <F6Report data={data} />,
  F7: (data) => <F7Report data={data} />,
  F9: (data) => <F9Report data={data} />,
  F10: (data) => <F10Report data={data} />,
  F13: (data) => <F13Report data={data} />,
  F24: (data) => <F24Report data={data} />,
  F99: (data) => <F99Report data={data} />,
};

const FINANCIAL_REPORT_FORM_TYPES = Object.keys(FORM_RENDERERS);

// Report summary page for every form type: the types in FORM_RENDERERS each
// render through their own component (F1/F2 bespoke, the rest through
// FinancialReportRenderer); any other form type falls back to the generic
// SummaryDetailPage (still on the older type/columns/sectionOrder/lineOrder
// contract).
export default function ReportSummaryPage() {
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const reportId = params.rep_id as string;
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [formType, setFormType] = useState<string | null>(null);
  const [data, setData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [committeeMismatch, setCommitteeMismatch] = useState(false);
  const [mismatchEntityId, setMismatchEntityId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!reportId) return;
      try {
        setLoading(true);
        setCommitteeMismatch(false);
        setMismatchEntityId(null);
        const basicInfoResponse = await reportsApi.getBasicInfo(reportId);
        if (cancelled) return;

        // Every filing-info report belongs to exactly one committee -
        // guard against a report ID being viewed under the wrong
        // committee's URL (e.g. a stale link, or a typo'd cand_cmte_id).
        if (committeeId && basicInfoResponse.data.committeeId && basicInfoResponse.data.committeeId !== committeeId) {
          setCommitteeMismatch(true);
          setMismatchEntityId(basicInfoResponse.data.committeeId);
          return;
        }

        setBasicInfo(basicInfoResponse.data);
        const type = String(basicInfoResponse.data.formType || '').toUpperCase();
        setFormType(type);

        if (FINANCIAL_REPORT_FORM_TYPES.includes(type)) {
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
  }, [reportId, committeeId]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading report...</div>;
  }

  if (committeeMismatch) {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="message message--error">
          <h2 className="message__title">Missmatch </h2>
          <p>Report FEC-{reportId} does not belong to committee/candidate {committeeId}.</p>
          <div className="message--alert__bottom">
            <ul className="list--buttons">
              <li>
                <Link className="button--standard" href={mismatchEntityId ? `/forms/${mismatchEntityId}` : '/forms'}>
                  Go to the correct committee
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-red-600">{error}</div>;
  }

  // basicInfo.formType (GET /filing-info, reports_service.get_basic_info)
  // never resolves to F3PS/F3S - the supsum-based override that turns an
  // F3P/F3 filing into F3PS/F3S only happens in get_summary_details, so it
  // only shows up in the /summary response we already fetched. Use that
  // resolved value to pick the renderer instead of the earlier basicInfo
  // guess, or an F3PS report would render through F3PReport (wrong
  // definitions, and its supplemental Column C silently dropped).
  const resolvedFormType = String(data?.metadata?.formType || formType || '').toUpperCase();
  const renderForm = FORM_RENDERERS[resolvedFormType] ?? FORM_RENDERERS[formType ?? ''];

  // Every renderer above gets the same page chrome as every other [rep_id]
  // page (breadcrumbs, committee header, sidenav) - FinancialReportRenderer
  // is content-only and has none of its own.
  if (formType && FINANCIAL_REPORT_FORM_TYPES.includes(formType) && data && basicInfo && renderForm) {
    const breadcrumbItems = [
      { label: 'Home', href: 'https://www.fec.gov' },
      { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
      { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
      { label: committeeId, href: `/forms/${committeeId}` },
      { label: 'Report Summary', href: '' },
    ];

    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="u-padding--left u-padding--right tab-interface" style={{ overflow: 'visible' }}>
          <FormCommitteeBasicInfo
            name={basicInfo.committeeName}
            id={basicInfo.committeeId}
            reportId={basicInfo.reportId}
            reportType={basicInfo.reportType}
          />

          <div className="data-container__wrapper">
            <ScheduleSidenav reportId={reportId} />

            <section id="section-1" className="tab-content" role="tabpanel">
              <h2 id="section-1-heading">
                {getFormTypeLabel(resolvedFormType)} (FEC-{basicInfo.reportId})
              </h2>
              {renderForm(data)}
            </section>
          </div>

          <footer className="mt-16 bg-white border-t border-gray-200"></footer>
        </div>
      </>
    );
  }

  return <SummaryDetailPage />;
}
