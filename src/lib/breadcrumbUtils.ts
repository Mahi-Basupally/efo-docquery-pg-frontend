import { BreadcrumbItem } from './BreadcrumbsFlexible'

interface CommitteeDetails {
  committeeId: string
  committeeName: string
}

interface ScheduleDetails {
  reportId?: string
  scheduleType?: string
  line?: string
}

interface BreadcrumbData {
  committeeDetails?: CommitteeDetails
  scheduleDetails?: ScheduleDetails
}

/**
 * Builds breadcrumb items from committee and schedule data
 * Matches the logic from the JSP template
 */
export function buildBreadcrumbs(data?: BreadcrumbData): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: 'https://www.fec.gov',
    },
    {
      label: 'Campaign finance data',
      href: 'https://www.fec.gov/data/',
    },
    {
      label: 'Committee profile',
      href: 'https://www.fec.gov/help-candidates-and-committees/filing-reports/',
    },
  ]

  if (!data) return items

  const { committeeDetails, scheduleDetails } = data

  // Add committee name if available
  if (committeeDetails?.committeeName && committeeDetails?.committeeId) {
    items.push({
      label: committeeDetails.committeeName,
      href: `/forms/${committeeDetails.committeeId}`,
    })
  }

  // Add Summary (report) if available
  if (scheduleDetails?.reportId && committeeDetails?.committeeId) {
    items.push({
      label: 'Summary',
      href: `/forms/${committeeDetails.committeeId}/${scheduleDetails.reportId}`,
    })
  }

  // Add schedule type if available
  if (
    scheduleDetails?.scheduleType &&
    committeeDetails?.committeeId &&
    scheduleDetails?.reportId
  ) {
    items.push({
      label: scheduleDetails.scheduleType,
      href: `/forms/${committeeDetails.committeeId}/${scheduleDetails.reportId}/${scheduleDetails.scheduleType}`,
    })
  }

  // Add line if available (no href, just text)
  if (scheduleDetails?.line) {
    items.push({
      label: scheduleDetails.line,
    })
  }

  return items
}
