'use client';

import { useState } from 'react';
import { Search, Building2 } from 'lucide-react';

interface ComidSearchBarProps {
  onSearch: (comid: string) => void;
  loading: boolean;
  currentComid?: string;
}

export default function ComidSearchBar({ onSearch, loading, currentComid }: ComidSearchBarProps) {
  const [comid, setComid] = useState(currentComid || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedComid = comid.trim().toUpperCase();
    if (trimmedComid) {
      onSearch(trimmedComid);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Building2 className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={comid}
          onChange={(e) => setComid(e.target.value.toUpperCase())}
          placeholder="Enter Committee ID (e.g., C00123456)"
          disabled={loading}
          className="block w-full pl-12 pr-32 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
          maxLength={9}
        />
        <button
          type="submit"
          disabled={loading || !comid.trim()}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </span>
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Enter a 9-character Committee ID (starts with C)
      </p>
    </form>
  );
}
