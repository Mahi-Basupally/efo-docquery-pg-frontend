'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ScheduleSidenav from '@/components/SideNav';
import { ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { reportsApi, Report } from '@/lib/api/reports';
import type { Column, Section, SectionLine, SummaryData } from '@/lib/api/types';
import type { F3XRawReportData } from '@/lib/api/f3x';
import F3XReport from '@/components/forms/f3x_rendering';

// ============================================================================
// Components
// ============================================================================

const ChevronToggle = ({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-1 hover:bg-gray-200 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-expanded={isExpanded}
    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
  >
    {isExpanded ? (
      <ChevronUp size={20} className="text-gray-700" />
    ) : (
      <ChevronDown size={20} className="text-gray-700" />
    )}
  </button>
);

interface MessageModal {
  isOpen: boolean;
  title: string;
  content: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function ReportDetailPage() {
  const params = useParams();
  const repId = params.rep_id as string;

  const [report, setReport] = useState<Report | null>(null);
  // Generic (non-F3X) report-summary state. Rendered via the legacy inline
  // section renderers below - unchanged behavior, still used by F1 and every
  // other form type that hasn't been split out yet.
  const [summary, setSummary] = useState<SummaryData | null>(null);
  // F3X-only report data/rendering split - see src/lib/api/f3x.ts and
  // src/components/forms/f3x_rendering.tsx.
  const [f3xData, setF3xData] = useState<F3XRawReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [messageModal, setMessageModal] = useState<MessageModal>({
    isOpen: false,
    title: '',
    content: '',
  });

  const isF3X = f3xData !== null;

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        const reportResponse = await reportsApi.getReportById(repId);
        setReport(reportResponse.data);

        try {
          // Both getReportById and getSummaryLines hit the same report-detail
          // endpoint. formType is only known once this response arrives, so
          // it (not the earlier getReportById call) decides the F3X branch.
          const summaryResponse = await reportsApi.getSummaryLines(repId);
          const summaryData = summaryResponse.data;

          if (summaryData?.metadata?.formType === 'F3X') {
            // The raw wire payload for F3X is a stricter subset of the
            // generic SummaryData shape (see src/lib/api/f3x.ts) - this
            // narrowing is safe once formType is confirmed at runtime.
            setF3xData(summaryData as unknown as F3XRawReportData);
          } else if (summaryData?.sections) {
            const sortedSections = [...summaryData.sections].sort((a, b) => {
              const orderA = Number(a.sectionOrder) || 0;
              const orderB = Number(b.sectionOrder) || 0;
              return orderA - orderB;
            });

            summaryData.sections = sortedSections.map((section: Section) => {
              const sortedLines = [...section.lines].sort((a, b) => {
                const orderA = Number(a.lineOrder) || 0;
                const orderB = Number(b.lineOrder) || 0;
                return orderA - orderB;
              });

              return {
                ...section,
                lines: sortedLines,
              };
            });

            const expanded: Record<string, boolean> = {};
            summaryData.sections.forEach((section: Section) => {
              expanded[section.id] = true;
            });
            setExpandedSections(expanded);
            setSummary(summaryData);
          } else {
            setSummary(summaryData);
          }
        } catch (summaryError) {
          console.error('Error fetching summary:', summaryError);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (repId) {
      fetchReportData();
    }
  }, [repId]);

  useEffect(() => {
    const name = summary?.candidate?.candidateName || summary?.committee?.name || f3xData?.committee?.name || report?.committeeName;
    document.title = name ? `${name} - EFO DocQuery` : 'EFO DocQuery';
    return () => {
      document.title = 'EFO DocQuery';
    };
  }, [summary?.candidate?.candidateName, summary?.committee?.name, f3xData?.committee?.name, report?.committeeName]);

  // ============================================================================
  // Utility Functions (generic/legacy rendering path - unchanged, used by
  // every form type other than F3X)
  // ============================================================================

  const formatCurrency = (value: number | null | undefined | string): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatValue = (value: unknown, type: string = 'text'): string => {
    if (value === null || value === undefined || value === '') return '-';

    switch (type) {
      case 'currency':
        return formatCurrency(value as number | string);
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      case 'date':
        return String(value);
      case 'text':
      default:
        return String(value);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleExportJson = () => {
    const exportPayload = isF3X ? f3xData : summary;
    if (!exportPayload) return;
    const jsonString = JSON.stringify(
      { exportDate: new Date().toISOString(), ...exportPayload },
      null,
      2
    );
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FEC-${exportPayload.metadata?.reportId || repId}-summary.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getIndentPadding = (indent?: number): string => {
    if (!indent) return '';
    return '    '.repeat(indent);
  };

  const getLineId = (lineNumber?: string): string | undefined => {
    if (!lineNumber) return undefined;
    return `line-${lineNumber.replace(/[()]/g, '-').replace(/--+/g, '-').replace(/-$/, '')}`;
  };

  const scrollToTarget = (target: string) => {
    const section = summary?.sections?.find(s => s.id === target);
    if (section) {
      setExpandedSections(prev => ({ ...prev, [target]: true }));
    }

    setTimeout(() => {
      let element = document.getElementById(target);

      if (!element) {
        element = document.getElementById(`line-${target.replace(/[()]/g, '-').replace(/--+/g, '-').replace(/-$/, '')}`);
      }

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.style.backgroundColor = '#fef3c7';
        setTimeout(() => {
          element!.style.backgroundColor = '';
        }, 2000);
      }
    }, 100);
  };

  const renderLinkToButton = (linkTo?: string) => {
    if (!linkTo) return null;
    return (
      <button
        onClick={() => scrollToTarget(linkTo)}
        className="ml-2 text-blue-600 hover:text-blue-800"
        title={`Go to ${linkTo}`}
        style={{ padding: '2px 6px', fontSize: '12px' }}
      >
        <ExternalLink size={14} className="inline" />
      </button>
    );
  };

  // ============================================================================
  // Section Rendering Functions (generic/legacy path)
  // ============================================================================

  const renderTableCells = (line: SectionLine, columns: Column[]) => {
    const cells: JSX.Element[] = [];
    const cellPadding = '8px';
    const cellFontSize = '14px';

    if (line.type === 'merge') {
      const lineNumberCol = columns.find(col => col.key === 'lineNumber');

      if (lineNumberCol) {
        cells.push(
          <td key="lineNumber" style={{ textAlign: 'left', fontWeight: 'bold', padding: cellPadding, fontSize: cellFontSize }}>
            {line.lineNumber || ''}
          </td>
        );

        const remainingColSpan = columns.length - 1;
        const mergedContent = columns
          .filter(col => col.key !== 'lineNumber')
          .map(col => line[col.key])
          .filter(val => val !== null && val !== undefined && val !== '')
          .join(' ');

        cells.push(
          <td key="merged" colSpan={remainingColSpan} style={{ textAlign: 'left', fontWeight: 'bold', padding: cellPadding, fontSize: cellFontSize }}>
            {mergedContent}
          </td>
        );
      } else {
        cells.push(
          <td key="merged" colSpan={columns.length} style={{ textAlign: 'left', fontWeight: 'bold', padding: cellPadding, fontSize: cellFontSize }}>
            {columns
              .map(col => line[col.key])
              .filter(val => val !== null && val !== undefined && val !== '')
              .join(' ')}
          </td>
        );
      }

      return cells;
    }

    let skipNext = 0;

    columns.forEach((col, colIdx) => {
      if (skipNext > 0) {
        skipNext--;
        return;
      }

      const isColumn2 = colIdx === 1;

      if (col.type === 'merge') {
        const lineNumberColIndex = columns.findIndex(c => c.key === 'lineNumber');
        const isLineNumberCol = lineNumberColIndex >= 0;

        const colSpan = columns.length - colIdx;

        const mergedValues = columns
          .slice(colIdx)
          .filter(c => c.key !== 'lineNumber')
          .map(c => line[c.key])
          .filter(v => v !== null && v !== undefined && v !== '');

        cells.push(
          <td
            key={colIdx}
            colSpan={colSpan}
            style={{ textAlign: 'left', padding: cellPadding }}
            id={getLineId(line.lineNumber)}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'nowrap',
              gap: '16px',
            }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: cellFontSize }}>
                  {getIndentPadding(line.indent)}
                  {formatValue(line[col.key], 'text')}
                  {isColumn2 && renderLinkToButton(line.linkTo)}
                </span>
                {isColumn2 && line.calculation && (
                  <>
                    <br />
                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      {getIndentPadding(line.indent)}({line.calculation})
                    </span>
                  </>
                )}
                {isColumn2 && line.note && (
                  <>
                    <br />
                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      {getIndentPadding(line.indent)}({line.note})
                    </span>
                  </>
                )}
              </div>
              {mergedValues.length > 1 && (
                <span style={{ fontWeight: 600, fontSize: cellFontSize, whiteSpace: 'nowrap' }}>
                  {formatValue(mergedValues[mergedValues.length - 1], 'currency')}
                </span>
              )}
            </div>
          </td>
        );

        skipNext = colSpan - 1;
      } else {
        cells.push(
          <td
            key={colIdx}
            style={{
              textAlign: col.type === 'currency' ? 'right' : 'left',
              fontWeight: col.key === 'lineNumber' ? 'bold' : 'normal',
              padding: cellPadding,
              fontSize: cellFontSize,
            }}
            id={col.key === 'lineNumber' ? getLineId(line.lineNumber) : undefined}
          >
            {col.key === 'lineNumber' ? (
              line.lineNumber || ''
            ) : (
              <div>
                <span>
                  {isColumn2 && getIndentPadding(line.indent)}
                  {formatValue(line[col.key], col.type)}
                  {isColumn2 && renderLinkToButton(line.linkTo)}
                </span>
                {isColumn2 && line.calculation && (
                  <>
                    <br />
                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      {getIndentPadding(line.indent)}({line.calculation})
                    </span>
                  </>
                )}
                {isColumn2 && line.note && (
                  <>
                    <br />
                    <span style={{ fontSize: '0.85em', color: '#6b7280' }}>
                      {getIndentPadding(line.indent)}({line.note})
                    </span>
                  </>
                )}
              </div>
            )}
          </td>
        );
      }
    });

    return cells;
  };

  const renderTwoColumnSection = (section: Section) => {
    const isExpanded = expandedSections[section.id];
    const columns = section.columns || [];

    return (
      <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
        <table
          key={section.id}
          id={section.id}
          style={{ width: '100%', fontSize: '16px', tableLayout: 'fixed' }}
          className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer"
        >
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#aeb0b5' }}>
              <th colSpan={columns.length}>
                <span style={{ whiteSpace: 'pre-line', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                  <ChevronToggle isExpanded={isExpanded} onClick={() => toggleSection(section.id)} />
                  {section.title?.toUpperCase()}
                </span>
              </th>
            </tr>
            {section.subtitle && (
              <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
                <th colSpan={columns.length} style={{ whiteSpace: 'pre-line', textAlign: 'left', fontStyle: 'italic', padding: '8px', fontSize: '14px' }}>
                  {section.subtitle}
                </th>
              </tr>
            )}
            <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    whiteSpace: 'pre-line',
                    width: '50%',
                    textAlign: col.type === 'currency' ? 'right' : 'left',
                    padding: '8px',
                    fontSize: '14px',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ display: isExpanded ? '' : 'none' }}>
            {section.lines.map((line, idx) => (
              <tr key={idx} style={line.isTotal ? { backgroundColor: '#f3f4f6', fontWeight: 600 } : {}}>
                {renderTableCells(line, columns)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderThreeColumnSection = (section: Section) => {
    const isExpanded = expandedSections[section.id];
    const columns = section.columns || [];

    const getColumnWidth = (columnIndex: number): string => {
      if (columnIndex === 0) return '10%';
      if (columnIndex === 1) return '60%';
      if (columnIndex === 2) return '30%';
      return '50%';
    };

    return (
      <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
        <table
          key={section.id}
          id={section.id}
          style={{ width: '100%', fontSize: '16px' }}
          className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer"
        >
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#aeb0b5' }}>
              <th colSpan={columns.length}>
                <span style={{ whiteSpace: 'pre-line', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                  <ChevronToggle isExpanded={isExpanded} onClick={() => toggleSection(section.id)} />
                  {section.title?.toUpperCase()}
                </span>
              </th>
            </tr>
            {section.subtitle && (
              <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
                <th colSpan={columns.length} style={{ whiteSpace: 'pre-line', textAlign: 'left', fontStyle: 'italic', padding: '8px', fontSize: '14px' }}>
                  {section.subtitle}
                </th>
              </tr>
            )}
            <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    whiteSpace: 'pre-line',
                    width: getColumnWidth(idx),
                    textAlign: col.type === 'currency' ? 'right' : 'left',
                    padding: '8px',
                    fontSize: '14px',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ display: isExpanded ? '' : 'none' }}>
            {section.lines.map((line, idx) => (
              <tr key={idx} style={line.isTotal ? { backgroundColor: '#f3f4f6', fontWeight: 600 } : {}}>
                {renderTableCells(line, columns)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFourColumnSection = (section: Section) => {
    const isExpanded = expandedSections[section.id];
    const columns = section.columns || [];

    const getColumnWidth = (columnIndex: number): string => {
      if (columnIndex === 0) return '10%';
      if (columnIndex === 1) return '45%';
      if (columnIndex === 2) return '20%';
      return '25%';
    };

    return (
      <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
        <table
          key={section.id}
          id={section.id}
          style={{ width: '100%', fontSize: '16px' }}
          className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer"
        >
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#aeb0b5' }}>
              <th colSpan={columns.length}>
                <span style={{ whiteSpace: 'pre-line', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                  <ChevronToggle isExpanded={isExpanded} onClick={() => toggleSection(section.id)} />
                  {section.title?.toUpperCase()}
                </span>
              </th>
            </tr>
            {section.subtitle && (
              <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
                <th colSpan={columns.length} style={{ whiteSpace: 'pre-line', textAlign: 'left', fontStyle: 'italic', padding: '8px', fontSize: '14px' }}>
                  {section.subtitle}
                </th>
              </tr>
            )}
            <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    width: getColumnWidth(idx),
                    textAlign: col.type === 'currency' ? 'right' : 'left',
                    padding: '8px',
                    fontSize: '14px',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ display: isExpanded ? '' : 'none' }}>
            {section.lines.map((line, idx) => (
              <tr key={idx} style={line.isTotal ? { backgroundColor: '#f3f4f6', fontWeight: 600 } : {}}>
                {renderTableCells(line, columns)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMultiColumnSection = (section: Section) => {
    const isExpanded = expandedSections[section.id];
    const columns = section.columns || [];

    const getColumnWidth = (columnIndex: number): string => {
      if (columnIndex === 0) return '10%';
      if (columnIndex === 1) return '45%';
      if (columnIndex === 2) return '20%';
      if (columnIndex === 3) return '20%';
      return '25%';
    };

    return (
      <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'block' }}>
        <table
          key={section.id}
          id={section.id}
          style={{ width: '100%', fontSize: '16px' }}
          className="data-table data-table--heading-borders data-table--entity u-margin--top dataTable no-footer"
        >
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: '#aeb0b5' }}>
              <th colSpan={columns.length}>
                <span style={{ whiteSpace: 'pre-line', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                  <ChevronToggle isExpanded={isExpanded} onClick={() => toggleSection(section.id)} />
                  {section.title?.toUpperCase()}
                </span>
              </th>
            </tr>
            {section.subtitle && (
              <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
                <th colSpan={columns.length} style={{ whiteSpace: 'pre-line', textAlign: 'left', fontStyle: 'italic', padding: '8px', fontSize: '14px' }}>
                  {section.subtitle}
                </th>
              </tr>
            )}
            <tr style={{ textAlign: 'left', backgroundColor: '#d6d7d9' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    textAlign: col.type === 'currency' ? 'center' : 'left',
                    padding: '8px',
                    fontSize: '14px',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ display: isExpanded ? '' : 'none' }}>
            {section.lines.map((line, idx) => (
              <tr key={idx} style={line.isTotal ? { backgroundColor: '#f3f4f6', fontWeight: 600 } : {}}>
                {renderTableCells(line, columns)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSection = (section: Section) => {
    const sectionType = section.type;

    switch (sectionType) {
      case 'two_columns':
        return renderTwoColumnSection(section);
      case 'three_columns':
        return renderThreeColumnSection(section);
      case 'four_columns':
        return renderFourColumnSection(section);
      case 'multi_columns':
        return renderMultiColumnSection(section);
      default:
        console.warn(`Unknown section type: ${sectionType}, falling back to two_columns`);
        return renderTwoColumnSection(section);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Report not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const metadata = isF3X ? f3xData?.metadata : summary?.metadata;
  const committee = isF3X ? f3xData?.committee : summary?.committee;
  const candidate = isF3X ? undefined : summary?.candidate;

  const displayName = candidate?.candidateName || committee?.name || report?.committeeName || '';
  const displayId = candidate?.candidateId || committee?.id || report?.committeeId || '';
  const reportId = metadata?.reportId || report?.reportId;

  const breadcrumbItems = [
    { label: 'Home', href: 'https://www.fec.gov' },
    { label: 'Campaign finance data', href: 'https://www.fec.gov/data/' },
    {
      label: committee ? 'Committee profile' : 'Candidate profile',
      href: committee
        ? `https://www.fec.gov/data/committee/${displayId}/?tab=about-committee`
        : `https://www.fec.gov/data/candidate/${displayId}/`,
    },
    { label: displayName, href: `/forms/${displayId}` },
    { label: 'Summary', href: `/forms/${displayId}/${repId}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="u-padding--left u-padding--right tab-interface">
        <header className="main">
          <h1 className="entity__name content__section--narrow">
            {displayName}
          </h1>
          <div className="heading--section">
            <span className="t-data t-bold entity__type">ID: {displayId}</span>
            <span className="t-data t-bold entity__type">Report ID: FEC-{reportId}</span>
          </div>
        </header>

        <div className="data-container__wrapper">
          {reportId && <ScheduleSidenav reportId={String(reportId)} />}

          <section id="section-1" className="tab-content" role="tabpanel">
            <h2 id="section-1-heading">
              {metadata?.formType || 'FORM'} (FEC-{reportId})
            </h2>
            <div className="slab slab--inline slab--neutral u-padding--left u-padding--right">
              <div className="row content__section">
                <div id="report" className="entity__figure row" style={{ overflowX: 'visible' }}>
                  <div className="u-float-right">
                    <button
                      type="button"
                      id="exportJson"
                      className="js-export button button--cta button--export"
                      onClick={handleExportJson}
                    >
                      Export
                    </button>
                  </div>
                  <div className="heading--section heading--with-action">
                    <h3 className="entity__title">
                      {metadata?.formTitle || 'Report of Receipts and Disbursements'}
                    </h3>
                    <h3 className="entity__title">
                      {metadata?.formSubTitle || ''}
                    </h3>
                  </div>

                  <div
                    id="summary"
                    className="entity__figure entity__figure--narrow"
                    style={{ overflowX: 'visible', maxWidth: '100%' }}
                  >
                    {isF3X ? (
                      f3xData ? (
                        <F3XReport data={f3xData} />
                      ) : (
                        <div className="slab slab--neutral u-padding--left u-padding--right">
                          <p className="text-gray-500 text-center py-8">
                            No summary data available for this report.
                          </p>
                        </div>
                      )
                    ) : summary?.sections && summary.sections.length > 0 ? (
                      summary.sections.map((section) => (
                        <div key={section.id}>
                          {renderSection(section)}
                          <br />
                        </div>
                      ))
                    ) : (
                      <div className="slab slab--neutral u-padding--left u-padding--right">
                        <p className="text-gray-500 text-center py-8">
                          No summary data available for this report.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-16 bg-white border-t border-gray-200"></footer>
      </div>

      {/* Message Modal */}
      {messageModal.isOpen && typeof document !== 'undefined' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
            onClick={() => setMessageModal({ isOpen: false, title: '', content: '' })}
          />
          <div
            style={{
              position: 'relative',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100000,
            }}
          >
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                {messageModal.title}
              </h3>
              <button
                onClick={() => setMessageModal({ isOpen: false, title: '', content: '' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                {messageModal.content}
              </div>
            </div>
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setMessageModal({ isOpen: false, title: '', content: '' })}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#164f85',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1a6bb5')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#164f85')}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
