'use client'

import React, { useEffect, useState } from 'react';
import { scheduleApi, Schedule, SchedulesResponse } from '@/lib/api/schedules';
import { useRouter, usePathname } from 'next/navigation';

interface ScheduleSidenavProps {
  reportId: string;
}

const ScheduleSidenav: React.FC<ScheduleSidenavProps> = ({ reportId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [committeeId, setCommitteeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data: SchedulesResponse = await scheduleApi.getSchedulesByRepid(reportId);
        setSchedules(data.data);

        // Safely access committeeId with optional chaining
        if (data.meta?.committeeId) {
          setCommitteeId(data.meta.committeeId);
        }

        // Check if there's a message (when no schedules available)
        if (data.message) {
          setMessage(data.message);
        }

        // Set first schedule as active by default
        if (data.data.length > 0) {
          setActiveTab(data.data[0].schedule);
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

  const handleScheduleClick = (e: React.MouseEvent<HTMLAnchorElement>, scheduleId: string) => {
    e.preventDefault();
    setActiveTab(scheduleId);

    // Smooth scroll to section if it exists
    const targetSection = document.getElementById(`section-${scheduleId.toLowerCase()}`);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, schedule: string, lineNum: string) => {
    e.preventDefault();

    // Build URL with committeeId from meta
    const url = `/forms/${committeeId}/${reportId}/${schedule}/${lineNum}`;
    router.push(url);
  };

  if (loading) {
    return (
      <nav className="sidebar side-nav-alt">
        <div className="loading">Loading schedules...</div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="sidebar side-nav-alt">
        <div className="error">Error: {error}</div>
      </nav>
    );
  }


  // Show message when no schedules are available
    if (schedules.length === 0 && message) {
      return (
        <nav className="sidebar side-nav-alt" style={{ paddingRight: '1rem' }}>
          <div className="message" style={{ padding: '1rem' }}>{message}</div>
        </nav>
      );
    }

  return (
    <nav className="sidebar side-nav-alt">
      <ul className="tablist" role="tablist" data-name="tab">
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
                      href={`/forms/${committeeId}/${reportId}/${schedule.schedule}/${subLink.lineNum}`}
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