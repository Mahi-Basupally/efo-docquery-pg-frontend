'use client';

import { Filing } from '@/lib/api';
import { FileText, Calendar, Hash, FileCheck, AlertCircle } from 'lucide-react';

interface FilingsListProps {
  filings: Filing[];
  loading: boolean;
  comid: string;
}

export default function FilingsList({ filings, loading, comid }: FilingsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No filings found</h3>
        <p className="text-gray-500">No filings found for COMID: {comid}</p>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFormBadgeColor = (form: string) => {
    const formColors: { [key: string]: string } = {
      'F3': 'bg-blue-100 text-blue-800',
      'F3X': 'bg-purple-100 text-purple-800',
      'F3P': 'bg-green-100 text-green-800',
      'F24': 'bg-yellow-100 text-yellow-800',
      'F99': 'bg-red-100 text-red-800',
    };
    return formColors[form] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (filed: string, superceded: string) => {
    if (superceded === 'Y') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Superseded
        </span>
      );
    }
    if (filed === 'Y') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FileCheck className="w-3 h-3 mr-1" />
          Filed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {filings.map((filing) => (
        <div
          key={filing.REPID}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {filing.COM_NAME}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormBadgeColor(filing.FORM)}`}>
                        {filing.FORM}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Report ID: {filing.REPID}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(filing.FILED, filing.SUPERCEDED)}
                {filing.EF === 'Y' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Electronic Filing
                  </span>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              {/* Filed Date */}
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Filed Date
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(filing.FILED_DATE)}
                </div>
              </div>

              {/* Coverage Period */}
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Coverage Period
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(filing.FROM_DATE)} - {formatDate(filing.THROUGH_DATE)}
                </div>
              </div>

              {/* Report Number */}
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Hash className="w-4 h-4 mr-1" />
                  Report Number
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {filing.RPTNUM || 'N/A'}
                </div>
              </div>

              {/* Report Code */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Report Code</div>
                <div className="text-sm font-medium text-gray-900">
                  {filing.RPTCODE || 'N/A'}
                </div>
              </div>

              {/* Version */}
              <div>
                <div className="text-sm text-gray-500 mb-1">Version</div>
                <div className="text-sm font-medium text-gray-900">
                  {filing.VERSION || 'N/A'}
                </div>
              </div>

              {/* Last Updated */}
              {filing.LAST_UPDATE_DATE && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(filing.LAST_UPDATE_DATE)}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info (Collapsible) */}
            {filing.PREVID && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Previous Report ID: <span className="font-mono">{filing.PREVID}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
