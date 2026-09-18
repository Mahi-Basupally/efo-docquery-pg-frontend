'use client'

import React, { useEffect, useState } from 'react';
import { scheduleApi, Schedule, SchedulesResponse } from '@/lib/api/schedules';
import { getFormSummarySections } from '@/lib/formSideNavSections';
import { useRouter, usePathname, useParams } from 'next/navigation';

const SUMMARY_TAB = 'SUMMARY';

// Mirrors app/routes/schedules.py's SCHEDULES_WITHOUT_REQUIRED_LINE_NUMBER -
// these schedules have no real per-report line (their totals query reports
// back a synthetic line equal to the schedule code itself, e.g. 'H2'), and
// their route folders are flat page.tsx (no [line_num] segment), so their
// links must not include a line segment either.
const SCHEDULES_WITHOUT_REQUIRED_LINE_NUMBER = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'F91', 'F56', 'F57', 'F65', 'F76', 'F92', 'F93', 'F132', 'F133', 'F3P31AL',
]);

// F94 (candidate identification) has no standalone page - its rows render
// inline under their parent F93 transaction instead (f93_rendering.tsx),
// so it's filtered out here rather than linking to a page that no longer
// exists.
const HIDDEN_SCHEDULES = new Set(['F94']);

// FEC's own CSS has no complete sticky-sidebar rule to reuse (only a bare
// .sidebar__inside-sticky-side padding/background helper, no position, and
// no JS scroll-listener for it either). The .docquery-sidenav class
// (globals.css) applies position:sticky only once .data-container__wrapper
// actually puts this nav beside the content column (a >=53.75em breakpoint,
// not .side-nav-alt's own >=40em table-cell switch - see globals.css for
// why those differ) - below that the nav is a normal stacked block above
// the content, so sticky there would just pin it over the page while
// scrolling. Kept as a CSS class (not inline styles) because inline styles
// can't express the media query.
const SIDENAV_CLASS_NAME = 'sidebar side-nav-alt docquery-sidenav';

// sessionStorage key used to hand off "scroll to this section" across a
// full page navigation. Deliberately NOT a URL #hash: global.js (FEC's own
// bundle, loaded in ScriptLoader.tsx) runs `$(window.location.hash)
// .offset().top` on page load whenever the URL has a hash, before React
// has fetched/rendered the summary page's sections - the selector matches
// nothing yet, .offset() returns undefined on the empty jQuery set, and
// .top throws. ReportSummaryPage.tsx reads this key itself once its own
// data has actually rendered, instead.
export const SUMMARY_SCROLL_TARGET_KEY = 'docquery:scrollToSection';

interface ScheduleSidenavProps {
  reportId: string;
}

const ScheduleSidenav: React.FC<ScheduleSidenavProps> = ({ reportId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const filingMethod = params.filingMethod as string;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [committeeId, setCommitteeId] = useState<string>('');
  const [formType, setFormType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data: SchedulesResponse = await scheduleApi.getSchedulesByRepid(reportId);
        const visibleSchedules = data.data.filter((s) => !HIDDEN_SCHEDULES.has(s.schedule.toUpperCase()));
        setSchedules(visibleSchedules);

        if (data.meta?.committeeId) {
          setCommitteeId(data.meta.committeeId);
        }

        setFormType(data.meta?.formType ?? null);

        // No schedules available for this report
        if (visibleSchedules.length === 0) {
          setMessage('No schedules available for this report');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchSchedules();
    }
  }, [reportId]);

  const summarySections = getFormSummarySections(formType);
  const summaryPageUrl = `/${filingMethod}/${committeeId}/${reportId}`;
  const onSummaryPage = pathname === summaryPageUrl;

  // Keep the expanded group in sync with whichever page is actually
  // showing: if the current URL is a schedule's own page (e.g.
  // /{filingMethod}/{cmte}/{repid}/SA/11AI), expand that schedule; otherwise fall
  // back to SUMMARY (if this form type has one) or the first schedule.
  // Re-derived locally (no refetch) whenever the URL or the loaded data
  // changes.
  useEffect(() => {
    const sections = getFormSummarySections(formType);
    if (schedules.length === 0 && sections.length === 0) return;

    const pathSegments = pathname.split('/').filter(Boolean);
    const scheduleFromPath = schedules.find((s) =>
      pathSegments.some((segment) => segment.toUpperCase() === s.schedule.toUpperCase())
    );

    if (scheduleFromPath) {
      setActiveTab(scheduleFromPath.schedule);
    } else if (sections.length > 0) {
      setActiveTab(SUMMARY_TAB);
    } else if (schedules.length > 0) {
      setActiveTab(schedules[0].schedule);
    }
  }, [pathname, schedules, formType]);

  const handleSummaryHeaderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setActiveTab(SUMMARY_TAB);
  };

  const handleSummarySectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveTab(SUMMARY_TAB);

    if (onSummaryPage) {
      // Already on the summary page - just scroll to the section.
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Navigate WITHOUT a #hash (see SUMMARY_SCROLL_TARGET_KEY above) and
    // let ReportSummaryPage.tsx scroll to it once its data has rendered.
    sessionStorage.setItem(SUMMARY_SCROLL_TARGET_KEY, sectionId);
    router.push(summaryPageUrl);
  };

  const handleScheduleClick = (e: React.MouseEvent<HTMLAnchorElement>, scheduleId: string) => {
    e.preventDefault();
    setActiveTab(scheduleId);

    // Smooth scroll to section if it exists
    const targetSection = document.getElementById(`section-${scheduleId.toLowerCase()}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Schedules with no real line number route to a flat page (no
  // [line_num] segment) - see SCHEDULES_WITHOUT_REQUIRED_LINE_NUMBER above.
  const getSubLinkUrl = (schedule: string, lineNum: string) =>
    SCHEDULES_WITHOUT_REQUIRED_LINE_NUMBER.has(schedule.toUpperCase())
      ? `/${filingMethod}/${committeeId}/${reportId}/${schedule}`
      : `/${filingMethod}/${committeeId}/${reportId}/${schedule}/${lineNum}`;

  const handleSubLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, schedule: string, lineNum: string) => {
    e.preventDefault();
    router.push(getSubLinkUrl(schedule, lineNum));
  };

  if (loading) {
    return (
      <nav className={SIDENAV_CLASS_NAME}>
        <div className="loading">Loading schedules...</div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className={SIDENAV_CLASS_NAME}>
        <div className="error">Error: {error}</div>
      </nav>
    );
  }


  // Show message when no schedules are available
    if (schedules.length === 0 && message && summarySections.length === 0) {
      return (
        <nav className={SIDENAV_CLASS_NAME} style={{ paddingRight: '1rem' }}>
          <div className="message" style={{ padding: '1rem' }}>{message}</div>
        </nav>
      );
    }

  return (
    <nav className={SIDENAV_CLASS_NAME}>
      <ul className="tablist" role="tablist" data-name="tab">
        {summarySections.length > 0 && (
          <li className="side-nav__item" role="presentation">
            <a
              className={`side-nav__link ${activeTab === SUMMARY_TAB ? 'active' : ''}`}
              role="tab"
              tabIndex={0}
              aria-selected={activeTab === SUMMARY_TAB}
              href={summaryPageUrl}
              onClick={handleSummaryHeaderClick}
            >
              FORM SUMMARY
            </a>
            <ul>
              {summarySections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`${summaryPageUrl}#${section.id}`}
                    onClick={(e) => handleSummarySectionClick(e, section.id)}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        )}

        {schedules.map((schedule, index) => (
          <li className="side-nav__item" role="presentation" key={schedule.schedule}>
            <a
              className={`side-nav__link ${activeTab === schedule.schedule ? 'active' : ''}`}
              role="tab"
              data-name={schedule.schedule.toLowerCase()}
              tabIndex={0}
              aria-controls={`panel-${index + 1}`}
              aria-selected={activeTab === schedule.schedule}
              href={`#section-${schedule.schedule.toLowerCase()}`}
              onClick={(e) => handleScheduleClick(e, schedule.schedule)}
            >
              {schedule.name}
            </a>
            {schedule.subLinks.length > 0 && (
              <ul>
                {schedule.subLinks.map((subLink) => (
                  <li key={subLink.lineNum}>
                    <a
                      href={getSubLinkUrl(schedule.schedule, subLink.lineNum)}
                      onClick={(e) => handleSubLinkClick(e, schedule.schedule, subLink.lineNum)}
                    >
                      Line {subLink.lineNum}
                      <span className="count"> ({subLink.numOfTrans})</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ScheduleSidenav;
