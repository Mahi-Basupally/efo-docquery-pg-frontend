'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav, { SUMMARY_SCROLL_TARGET_KEY } from '@/components/SideNav';
import FormCommitteeBasicInfo from '@/components/forms/FormCommitteeBasicInfo';
import { reportsApi, BasicInfo } from '@/lib/api/reports';
import type { FinancialReportData } from './FinancialReportRenderer';
import F1Report, { F1ReportData } from './f1/f1_rendering';
import F1MReport, { F1MReportData } from './f1m/f1m_rendering';
import F2Report, { F2ReportData } from './f2/f2_rendering';
import F3Report from './f3/f3_rendering';
import F3LReport from './f3l/f3l_rendering';
import F3PReport from './f3p/f3p_rendering';
import F3PSReport from './f3ps/f3ps_rendering';
import F3SReport from './f3s/f3s_rendering';
import F3XReport from './f3x/f3x_rendering';
import F4Report from './f4/f4_rendering';
import F5Report from './f5/f5_rendering';
import F6Report from './f6/f6_rendering';
import F7Report from './f7/f7_rendering';
import F9Report from './f9/f9_rendering';
import F10Report from './f10/f10_rendering';
import F13Report from './f13/f13_rendering';
import F24Report from './f24/f24_rendering';
import F99Report from './f99/f99_rendering';
import { getFormTypeLabel } from '@/lib/formTypeUtils';

// Maps a form type to the component that renders its summary.
// F1/F1M/F2 have their own data shapes, so they are cast from the generic report type.
const FORM_RENDERERS: Record<string, (data: FinancialReportData) => JSX.Element> = {
  F1: (data) => <F1Report data={data as unknown as F1ReportData} />,
  F1M: (data) => <F1MReport data={data as unknown as F1MReportData} />,
  F2: (data) => <F2Report data={data as unknown as F2ReportData} />,
  F3: (data) => <F3Report data={data} />,
  F3L: (data) => <F3LReport data={data} />,
  F3S: (data) => <F3SReport data={data} />,
  F3P: (data) => <F3PReport data={data} />,
  F3PS: (data) => <F3PSReport data={data} />,
  F3X: (data) => <F3XReport data={data} />,
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

// Base form type -> supplemental form type, used when the report has an additional summary.
const SUPPLEMENTAL_FORM_TYPES: Record<string, string> = {
  F3: 'F3S',
  F3P: 'F3PS',
};

// Form types that have a renderer; only these fetch summary lines.
const FINANCIAL_REPORT_FORM_TYPES = Object.keys(FORM_RENDERERS);

// Report summary page: loads a report's basic info, then its summary lines,
// and renders them with the renderer for the report's form type.
export default function ReportSummaryPage() {
  const params = useParams();
  const committeeId = params.cand_cmte_id as string;
  const reportId = params.rep_id as string;
  const filingMethod = params.filingMethod as string;
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [formType, setFormType] = useState<string | null>(null);
  const [data, setData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [committeeMismatch, setCommitteeMismatch] = useState(false);
  const [mismatchEntityId, setMismatchEntityId] = useState<string | null>(null);

  // Load report data whenever the report or committee in the URL changes.
  useEffect(() => {
    // Guards against setting state after unmount or after the params changed.
    let cancelled = false;

    const load = async () => {
      if (!reportId) return;
      try {
        setLoading(true);
        setError(null);
        setCommitteeMismatch(false);
        setMismatchEntityId(null);
        const basicInfoResponse = await reportsApi.getBasicInfo(reportId);
        if (cancelled) return;

        // The report must belong to the committee in the URL; otherwise show a mismatch message.
        if (committeeId && basicInfoResponse.data.committeeId && basicInfoResponse.data.committeeId !== committeeId) {
          setCommitteeMismatch(true);
          setMismatchEntityId(basicInfoResponse.data.committeeId);
          return;
        }

        setBasicInfo(basicInfoResponse.data);
        const type = String(basicInfoResponse.data.formType || '').toUpperCase();
        setFormType(type);

        // Summary lines are only needed for form types we can render.
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

  // Set the browser tab title once the committee is known; restore the default on cleanup.
  useEffect(() => {
    if (!basicInfo) return;
    document.title = `${basicInfo.committeeName} - FEC-${basicInfo.reportId} | FEC.gov`;
    return () => { document.title = 'FEC | Docquery'; };
  }, [basicInfo]);

  // After the report renders, scroll to the section chosen in the side nav (if any).
  // The target id is passed through sessionStorage and cleared once used.
  useEffect(() => {
    if (loading || !data) return;
    const sectionId = sessionStorage.getItem(SUMMARY_SCROLL_TARGET_KEY);
    if (!sectionId) return;

    sessionStorage.removeItem(SUMMARY_SCROLL_TARGET_KEY);
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, data]);

  // Download the loaded summary data as a JSON file, stamped with the export date.
  const handleExportJson = () => {
    if (!data) return;
    const exportPayload = { exportDate: new Date().toISOString(), ...data };
    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FEC-${basicInfo?.reportId ?? reportId}-summary.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Early returns: loading, committee mismatch, and error states.
  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading report...</div>;
  }

  if (committeeMismatch) {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="message message--error">
          <h2 className="message__title">Mismatch</h2>
          <p>Report FEC-{reportId} does not belong to committee/candidate {committeeId}.</p>
          <div className="message--alert__bottom">
            <ul className="list--buttons">
              <li>
                <Link className="button--standard" href={mismatchEntityId ? `/${filingMethod}/${mismatchEntityId}` : `/${filingMethod}`}>
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

  // Prefer the form type from the summary data; fall back to the one from basic info.
  const baseFormType = String(data?.form?.formType || formType || '').toUpperCase();
  // If the report has an additional summary, render the supplemental form (F3 -> F3S, F3P -> F3PS).
  const resolvedFormType = data?.form?.hasAdditionalSummary
    ? SUPPLEMENTAL_FORM_TYPES[baseFormType] ?? baseFormType
    : baseFormType;
  const renderForm = FORM_RENDERERS[resolvedFormType] ?? FORM_RENDERERS[formType ?? ''];

  // Happy path: breadcrumbs, committee header, side nav, and the form-specific summary.
  if (formType && FINANCIAL_REPORT_FORM_TYPES.includes(formType) && data && basicInfo && renderForm) {
    const breadcrumbItems = [
      { label: 'Home', href: 'https://www.fec.gov' },
      { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
      { label: 'Committee profile', href: `https://www.fec.gov/data/committee/${committeeId}/?tab=about-committee` },
      { label: committeeId, href: `/${filingMethod}/${committeeId}` },
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
              <div className="u-float-right">
                <button type="button" id="exportJson" className="js-export button button--cta button--export" onClick={handleExportJson}>
                  Export
                </button>
              </div>
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

  // Fallback: unsupported or unknown form type.
  return (
    <div className="py-12 text-center text-gray-500">
      {formType ? `Rendering for form type ${formType} is not yet implemented.` : 'Unable to determine this report\'s form type.'}
    </div>
  );
}
