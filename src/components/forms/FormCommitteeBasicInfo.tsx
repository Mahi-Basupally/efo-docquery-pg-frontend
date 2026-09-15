'use client';

import { getReportTypeLabel } from '@/lib/reportTypeUtils';

export interface FormCommitteeBasicInfoProps {
  /** Committee or candidate display name. */
  name: string;
  /** Committee or candidate FEC ID. */
  id: string;
  reportId?: string | number;
  /** Report type code (e.g. "Q1") - rendered via getReportTypeLabel. */
  reportType?: string | null;
}

/**
 * Page header used across every [rep_id] page (report summary, schedules,
 * ...): entity name, entity ID, report ID, and report type. Purely
 * presentational - each page still derives `name`/`id`/`reportType` itself
 * (report summary pages fall back across F3X/candidate/committee/report
 * data; schedule pages use the report's committee directly), this just
 * avoids re-declaring the same markup in every one.
 */
export default function FormCommitteeBasicInfo({ name, id, reportId, reportType }: FormCommitteeBasicInfoProps) {
  return (
    <header className="main">
      <h1 className="entity__name content__section--narrow">{name}</h1>
      <div className="heading--section">
        <span className="t-data t-bold entity__type">ID: {id}</span>
        <span className="t-data t-bold entity__type">Report ID: FEC-{reportId}</span>
        {reportType && (
          <span className="t-data t-bold entity__type">Report Type: {getReportTypeLabel(reportType)}</span>
        )}
      </div>
    </header>
  );
}
