'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { committeeApi } from '@/lib/api/committees';
import { candidateApi } from '@/lib/api/candidates';

type SearchResult = {
  id: string;
  name: string;
  type: 'committee' | 'candidate';
  committeeFilingFrequency?: string;
};

export default function FormsSearchPage() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const debounce = <T extends (...args: Parameters<T>) => void>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const searchCommittees = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      // Search both committees and candidates in parallel
      const [committeeResponse, candidateResponse] = await Promise.all([
        committeeApi.searchCommittees(query, 5).catch(() => ({ data: [] })),
        candidateApi.searchCandidates(query, 5).catch(() => ({ data: [] })),
      ]);

      // Combine results - committees first, then candidates
      const combinedResults: SearchResult[] = [
        ...committeeResponse.data.map(c => ({
          id: c.committeeId || c.committee_id,
          name: c.committeeName || c.committee_name,
          type: 'committee' as const,
          committeeFilingFrequency: c.committeeFilingFrequency || c.committee_filing_frequency,
        })),
        ...candidateResponse.data.map(c => ({
          id: c.candidateId || c.candidate_id,
          name: c.candidateName || c.candidate_name,
          type: 'candidate' as const,
        })),
      ];

      setSearchResults(combinedResults);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(searchCommittees, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSelectCommittee = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    router.push(`/forms/${result.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero hero--secondary hero--services" aria-labelledby="hero-heading">
        <div className="hero__image"></div>
        <div className="container">
          <h1 id="hero-heading">Electronic filing documents querying system</h1>
          <div className="hero__content">
            <div className="block-paragraph">
              <p>Document Query - Provide your committee ID or your candidate ID then click View to retrieve your filings.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="main container js-accordion accordion--neutral">
        <section className="content__section">
          {/* Search Box */}
          <div className="grid--1-wide grid--flex">
            <div className="grid__item card t-left-aligned">
              <h2>Look up candidate and committee profiles</h2>
              <div className="combo combo--search combo--search--medium" ref={dropdownRef} style={{ position: 'relative' }}>
                <label htmlFor="search" className="label">Candidate or committee name or ID</label>
                <div className="twitter-typeahead" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    placeholder="Search by committee name or ID..."
                    className="combo__input tt-input"
                    aria-owns="search_listbox"
                    aria-controls="search_listbox"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSearchResults}
                    autoComplete="off"
                  />
                  <button type="submit" className="combo__button button--search button--standard">
                    <span className="u-visually-hidden">Search</span>
                  </button>
                  {/* Search Results Dropdown */}
                  <div
                    role="listbox"
                    className="tt-menu"
                    id="search_listbox"
                    aria-live="polite"
                    aria-expanded={showSearchResults}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 100,
                      display: showSearchResults ? 'block' : 'none',
                    }}
                  >
                    <div role="presentation" className="tt-dataset tt-dataset-committee">
                      {searchLoading ? (
                        <span className="tt-suggestion__header">Searching...</span>
                      ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
                        <span className="tt-suggestion__header">No results found for &quot;{searchQuery}&quot;</span>
                      ) : (
                        <>
                          {/* Committee Results */}
                          {searchResults.filter(r => r.type === 'committee').length > 0 && (
                            <>
                              <span className="tt-suggestion__header">Select a committee:</span>
                              {searchResults
                                .filter(r => r.type === 'committee')
                                .map((result) => (
                                  <span
                                    key={result.id}
                                    className="tt-suggestion__name tt-suggestion tt-selectable"
                                    onClick={() => handleSelectCommittee(result)}
                                  >
                                    {result.name} (<strong className="tt-highlight">{result.id}</strong>)
                                    {result.committeeFilingFrequency && (
                                      <span className={
                                        result.committeeFilingFrequency === 'M' || result.committeeFilingFrequency === 'Q'
                                          ? 'is-active-status'
                                          : 'is-terminated-status'
                                      }>
                                        {result.committeeFilingFrequency === 'M' || result.committeeFilingFrequency === 'Q'
                                          ? 'Active'
                                          : 'Terminated'}
                                      </span>
                                    )}
                                  </span>
                                ))}
                            </>
                          )}

                          {/* Candidate Results */}
                          {searchResults.filter(r => r.type === 'candidate').length > 0 && (
                            <>
                              <span className="tt-suggestion__header">Select a candidate:</span>
                              {searchResults
                                .filter(r => r.type === 'candidate')
                                .map((result) => (
                                  <span
                                    key={result.id}
                                    className="tt-suggestion__name tt-suggestion tt-selectable"
                                    onClick={() => handleSelectCommittee(result)}
                                  >
                                    {result.name} (<strong className="tt-highlight">{result.id}</strong>)
                                  </span>
                                ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span className="t-note t-sans search__example">
                  Examples: Obama for America; C00431445; Bush, George W.; P00003335; or enter an image number for a filing.
                </span>
              </div>
              <p></p><p></p><p></p>
              {/* Quick Tips */}
              <h3>Search Tips</h3>
              <div className="example--primary">
                <ul>
                  <li>• Enter at least 2 characters to search</li>
                  <li>• Search by committee name (e.g., &quot;Biden for President&quot;)</li>
                  <li>• Search by committee ID (e.g., &quot;C00703975&quot;)</li>
                  <li>• Search by treasurer name</li>
                  <li>• Results update as you type</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="mt-16 bg-white border-t border-gray-200"></footer>
      </div>
    </div>
  );
}