'use client';

import ReportTable, { ReportTableColumn, ReportTableRow } from '@/components/tables/ReportTable';
import { getReportTypeLabel } from '@/lib/reportTypeUtils';
import { getFecImageUrl } from '@/lib/fecImageUtils';
import { formatDate, formatSignatureName } from '@/lib/basicFormattingUtils';

export interface ReportDetailsHeaderData {
  committee?: {
    id?: string;
    name?: string;
    address?: Record<string, unknown>;
    changeOfAddress?: boolean;
  };
  report?: {
    reportType?: string;
    amendmentIndicator?: string;
    // Only a few forms (e.g. F24) file on an event trigger rather than a
    // period - this is when an existing filing was amended, distinct from
    // coveragePeriod.
    amendmentDate?: string | null;
    coveragePeriod?: { startDate?: string | null; endDate?: string | null };
    election?: { state?: string | null; district?: string | null };
    candidate?: {
      id?: string | null;
      lastName?: string | null;
      firstName?: string | null;
      middleName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
    treasurer?: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
    // The person who actually signed the report (may be an assistant
    // treasurer or other authorized signer, distinct from the committee's
    // treasurer above) - shown as "Signed By Treasurer:" in the Signature
    // table. Forms that dropped their own bespoke lines-based signature
    // section (F1/F1M/F24) only ever populate this, not treasurer.
    treasurerSignature?: {
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      prefix?: string | null;
      suffix?: string | null;
    };
    dateSigned?: string | null;
    filedDate?: string | null;
    imageNumber?: string | number | null;
  };
}

type Person = NonNullable<NonNullable<ReportDetailsHeaderData['report']>['treasurer']>;

const displayValue = (value: unknown, fallback = '—'): string => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const formatPersonName = (person?: Person): string => {
  if (!person) return '—';

  const parts = [person.prefix, person.firstName, person.middleName, person.lastName, person.suffix]
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(String);

  return parts.length ? parts.join(' ') : '—';
};

const committeeColumns: ReportTableColumn[] = [
  { key: 'number', label: 'Line #', align: 'center', width: '6%' },
  { key: 'label', label: 'Description', align: 'left', width: '29%' },
  { key: 'value', label: 'Value', align: 'left', width: '65%' },
];

const signatureColumns: ReportTableColumn[] = [
  { key: 'label', label: 'Description', align: 'left', width: '50%' },
  { key: 'value', label: 'Value', align: 'left', width: '50%' },
];

/**
 * Detailed "Committee information" table (name, address, FEC ID, amendment
 * flag, report type, coverage period, election, candidate, dates) shown
 * above a form's financial sections, plus its own separate "Signature"
 * table (Signed By Treasurer/Date Signed/Filed Date/Image Number) - every
 * form is signed by its treasurer, so this is unconditional rather than an
 * opt-in, and every form gets the identical signature layout.
 */
export interface ReportDetailsHeaderProps {
  data: ReportDetailsHeaderData;
}

export default function ReportDetailsHeader({ data }: ReportDetailsHeaderProps) {
  const committee = data.committee;
  const report = data.report;
  const address = committee?.address;

  const addressLine1 = [address?.street1, address?.street2]
    .filter(Boolean)
    .map(String)
    .join(', ');
  const addressLine2 = [address?.city, address?.state, address?.zipCode]
    .filter(Boolean)
    .map(String)
    .join(', ')
    .replace(/, ([A-Z]{2}), /, ' $1 ');

  const coveragePeriod = `${displayValue(formatDate(report?.coveragePeriod?.startDate))} – ${displayValue(
    formatDate(report?.coveragePeriod?.endDate),
  )}`;

  // 'N' (new) and 'O' (original) both mean "not an amendment" - anything
  // else (e.g. 'A' amendment, 'T' termination) does. Matches the backend's
  // own is_amendment rule (f3_service.py and siblings).
  const isAmendment = !!report?.amendmentIndicator && !['N', 'O'].includes(report.amendmentIndicator);

  const reportTypeValue = report?.reportType
    ? `${report.reportType} - ${getReportTypeLabel(report.reportType)}`
    : '—';

  const candidate = report?.candidate;
  const candidateName = candidate ? formatPersonName(candidate) : '—';

  // These numbers are FEC-style presentation numbers for the header only.
  // They are intentionally not part of the API contract.
  const rows: ReportTableRow[] = [
    {
      id: 'committee-name',
      cells: { number: '1', label: 'Committee name', value: displayValue(committee?.name) },
    },
    {
      id: 'mailing-address',
      cells: {
        number: '',
        label: 'Address',
        value: (
          <>
            <span className="block">{displayValue(addressLine1)}</span>
            <span className="block">{displayValue(addressLine2)}</span>
          </>
        ),
      },
    },
    {
      id: 'committee-id',
      cells: { number: '2', label: 'FEC Committee ID', value: displayValue(committee?.id) },
    },
    {
      id: 'amendment',
      cells: {
        number: '3',
        label: 'Is This Report An Amendment',
        value: isAmendment ? 'Yes' : 'No',
      },
    },
    {
      id: 'report-type',
      cells: { number: '4', label: 'Report Type', value: reportTypeValue },
    },
    {
      id: 'coverage-period',
      cells: { number: '5', label: 'Coverage Period', value: coveragePeriod },
    },
  ];

  if (report?.amendmentDate) {
    rows.push({
      id: 'amendment-date',
      cells: { number: '', label: 'Amendment Date', value: displayValue(formatDate(report.amendmentDate)) },
    });
  }

  if (report?.election?.state) {
    rows.push({
      id: 'election-state',
      cells: { number: '', label: 'Election State', value: report.election.state },
    });
  }

  if (report?.election?.district) {
    rows.push({
      id: 'election-district',
      cells: { number: '', label: 'Election District', value: report.election.district },
    });
  }

  if (candidate?.id) {
    rows.push(
      { id: 'candidate-id', cells: { number: '', label: 'Candidate ID', value: candidate.id } },
      { id: 'candidate-name', cells: { number: '', label: 'Candidate Name', value: candidateName } },
    );
  }

  if (committee?.changeOfAddress) {
    rows.push({
      id: 'change-of-address',
      cells: { number: '', label: 'Change of Address', value: 'Yes' },
    });
  }

  const signatureRows: ReportTableRow[] = [
    {
      id: 'signed-by',
      cells: { label: 'Signed By Treasurer', value: displayValue(formatSignatureName(report?.treasurerSignature ?? report?.treasurer)) },
    },
    { id: 'date-signed', cells: { label: 'Date Signed', value: displayValue(formatDate(report?.dateSigned)) } },
    { id: 'filed-date', cells: { label: 'Filed Date', value: displayValue(formatDate(report?.filedDate)) } },
  ];

  if (report?.imageNumber) {
    const imageUrl = getFecImageUrl(report.imageNumber);
    signatureRows.push({
      id: 'image-number',
      cells: {
        label: 'Image Number',
        value: imageUrl ? (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline">
            {report.imageNumber}
          </a>
        ) : (
          String(report.imageNumber)
        ),
      },
    });
  }

  return (
    <>
      <div className="entity__figure entity__figure--narrow">
        <ReportTable
          id="formDetails"
          title="Form Details"
          columns={committeeColumns}
          rows={rows}
        />
      </div>
      <div className="entity__figure entity__figure--narrow">
        <ReportTable
          id="signature"
          title="Signature"
          columns={signatureColumns}
          rows={signatureRows}
        />
      </div>
    </>
  );
}
