'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// Navigation menu configuration
const NAVIGATION_MENUS = {
  data: {
    id: 'data',
    title: 'Campaign finance data',
    ariaLabel: 'Campaign finance data menu',
  },
  help: {
    id: 'help',
    title: 'Help for candidates and committees',
    ariaLabel: 'Help for candidates and committees menu',
  },
  legal: {
    id: 'legal',
    title: 'Legal resources',
    ariaLabel: 'Legal resources menu',
  },
  about: {
    id: 'about',
    title: 'About',
    ariaLabel: 'About the FEC menu',
  },
} as const;

type MenuId = keyof typeof NAVIGATION_MENUS;

export default function Header() {
  const [govBannerExpanded, setGovBannerExpanded] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<MenuId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGovBanner = useCallback(() => {
    setGovBannerExpanded((prev) => !prev);
  }, []);

  const toggleGlossary = useCallback(() => {
    setGlossaryOpen((prev) => !prev);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const toggleSubmenu = useCallback((submenu: MenuId, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSubmenu((prev) => (prev === submenu ? null : submenu));
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        const searchUrl = `https://www.fec.gov/search?type=candidates&type=committees&type=site&query=${encodeURIComponent(
          searchQuery
        )}`;
        window.location.href = searchUrl;
      }
    },
    [searchQuery]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <>
      <a href="#main" className="skip-nav">
        skip navigation
      </a>

      {/* Government Banner */}
      <header className="usa-banner">
        <div className="js-accordion accordion--neutral" data-content-prefix="gov-banner">
          <button
            type="button"
            className="usa-banner-header js-accordion-trigger accordion__button"
            aria-controls="gov-banner"
            aria-expanded={govBannerExpanded}
            onClick={toggleGovBanner}
          >
            <span className="u-visually-hidden">Here&apos;s how you know</span>
            <img
              className="flag"
              src="https://www.fec.gov/static/img/us_flag_small.png"
              alt="US flag signifying that this is a United States Federal Government website"
              width="16"
              height="11"
            />
            <p className="t-inline-block">An official website of the United States government</p>
            <p className="t-inline-block usa-banner-button">Here&apos;s how you know</p>
          </button>
          <div
            className="usa-banner-content usa-grid usa-accordion-content accordion-content"
            id="gov-banner"
            aria-hidden={!govBannerExpanded}
            style={{ display: govBannerExpanded ? 'block' : 'none' }}
          >
            <div className="usa-banner-guidance-gov usa-width-one-half">
              <img
                className="usa-banner-icon usa-media_block-img"
                src="https://www.fec.gov/static/img/icon-dot-gov.svg"
                alt="Dot gov"
                width="38"
                height="38"
              />
              <div className="usa-media_block-body">
                <p>
                  <strong>Official websites use .gov</strong>
                  <br />
                  A <strong>.gov</strong> website belongs to an official government organization in the United States.
                </p>
              </div>
            </div>
            <div className="usa-banner-guidance-ssl usa-width-one-half">
              <img
                className="usa-banner-icon usa-media_block-img"
                src="https://www.fec.gov/static/img/icon-https.svg"
                alt="SSL"
                width="38"
                height="38"
              />
              <div className="usa-media_block-body">
                <p>
                  <strong>Secure .gov websites use HTTPS</strong>
                  <br />
                  A <strong>lock</strong> (
                  <svg
                    xmlns="https://www.w3.org/2000/svg"
                    width="10"
                    height="15"
                    viewBox="0 0 52 64"
                    className="usa-banner__lock-image"
                    role="img"
                    aria-labelledby="banner-lock-title banner-lock-description"
                  >
                    <title id="banner-lock-title">Lock</title>
                    <desc id="banner-lock-description">A locked padlock</desc>
                    <path
                      fill="#000000"
                      fillRule="evenodd"
                      d="M26 0c10.493 0 19 8.507 19 19v9h3a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V32a4 4 0 0 1 4-4h3v-9C7 8.507 15.507 0 26 0zm0 8c-5.979 0-10.843 4.77-10.996 10.712L15 19v9h22v-9c0-6.075-4.925-11-11-11z"
                    />
                  </svg>
                  ) or <strong>https://</strong> means you&apos;ve safely connected to the .gov website. Share sensitive
                  information only on official, secure websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Site Header */}
      <header className="site-header">
        <div className="masthead">
          <div className="site-title--print"></div>
          <a
            title="Home"
            href="https://www.fec.gov/"
            className="site-title"
            rel="home noopener noreferrer"
          >
            <span className="u-visually-hidden">Federal Election Commission | United States of America</span>
          </a>
          <ul className="utility-nav list--flat">
            <li className="utility-nav__item">
              <a rel="noopener noreferrer" href="https://www.fec.gov/calendar/">
                Calendar
              </a>
            </li>
            <li className="utility-nav__item">
              <button
                className="js-glossary-toggle glossary__toggle"
                aria-expanded={glossaryOpen}
                onClick={toggleGlossary}
              >
                Glossary
              </button>
            </li>

            <li className="utility-nav__search">
              <form
                acceptCharset="UTF-8"
                action="https://www.fec.gov/search"
                id="search_form"
                className="combo"
                method="get"
                role="search"
                onSubmit={handleSearch}
              >
                <input type="hidden" name="type" value="candidates" />
                <input type="hidden" name="type" value="committees" />
                <input type="hidden" name="type" value="site" />
                <label className="u-visually-hidden" htmlFor="query">
                  Search
                </label>
                <div className="combo combo--search">
                  <input
                    className="js-site-search combo__input"
                    autoComplete="off"
                    id="query"
                    name="query"
                    type="text"
                    aria-label="Search FEC.gov"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button type="submit" className="button--standard combo__button button--search">
                    <span className="u-visually-hidden">Search</span>
                  </button>
                </div>
              </form>
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <nav className="site-nav js-site-nav" aria-label="Site navigation">
          <button
            className="js-nav-toggle site-nav__button"
            aria-controls="site-menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            Menu
          </button>

          <div
            id="site-menu"
            className="site-nav__container"
            aria-label="Site-wide navigation"
            role="navigation"
            style={{ display: menuOpen ? 'block' : '' }}
          >
            <ul className="site-nav__panel site-nav__panel--main">
              <li>
                <h2 className="site-nav__title u-under-lg-only">Menu</h2>
              </li>
              <li className="site-nav__item u-under-lg-only">
                <a className="site-nav__link" href="https://www.fec.gov/" rel="home noopener noreferrer">
                  <span className="site-nav__link__title">Home</span>
                </a>
              </li>

              {/* Campaign finance data menu */}
              <li className="site-nav__item" data-submenu="data">
                <a
                  className="site-nav__link"
                  href="#0"
                  tabIndex={0}
                  id="mega-menu-data"
                  aria-haspopup="true"
                  aria-controls="mega-menu-data-content"
                  aria-expanded={activeSubmenu === 'data'}
                  onClick={(e) => toggleSubmenu('data', e)}
                >
                  <span className="site-nav__link__title">Campaign finance data</span>
                </a>
                <div
                  className="mega-container"
                  id="mega-menu-data-content"
                  role="group"
                  aria-expanded={activeSubmenu === 'data'}
                  aria-hidden={activeSubmenu !== 'data'}
                  aria-labelledby="mega-menu-data"
                >
                  <div className="mega">
                    <div className="mega__inner">
                      <div className="row">
                        <div className="u-padding-left d-sm-none d-md-none col-lg-1">&nbsp;</div>
                        <div className="u-padding--left col-lg-6">
                          <ul className="t-sans list--1-2-2-3-columns u-padding--top">
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/">
                                All data
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=raising">
                                Raising
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=spending">
                                Spending
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=loans-debts">
                                Loans and debts
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=filings">
                                Filings and reports
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=candidates">
                                Candidates
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=committees">
                                Committees
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=bulk-data">
                                Bulk data
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/browse-data/?tab=statistics">
                                Campaign finance statistics
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="u-padding--left col-lg-4">
                          <div className="icon-heading icon-heading--person-location-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/elections/">
                                Find elections. Search by state or ZIP code
                              </a>
                            </p>
                          </div>
                          <div className="icon-heading icon-heading--individual-contributions-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/receipts/individual-contributions/">
                                Look up contributions from specific individuals
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Help for candidates and committees menu */}
              <li className="site-nav__item site-nav__item--secondary" data-submenu="help">
                <a
                  href="#0"
                  className="site-nav__link is-parent"
                  tabIndex={0}
                  id="mega-menu-help"
                  aria-haspopup="true"
                  aria-controls="mega-menu-help-content"
                  aria-expanded={activeSubmenu === 'help'}
                  onClick={(e) => toggleSubmenu('help', e)}
                >
                  <span className="site-nav__link__title">Help for candidates and committees</span>
                </a>
                <div
                  className="mega-container"
                  id="mega-menu-help-content"
                  role="group"
                  aria-expanded={activeSubmenu === 'help'}
                  aria-hidden={activeSubmenu !== 'help'}
                  aria-labelledby="mega-menu-help"
                >
                  <div className="mega mega--secondary">
                    <div className="mega__inner">
                      <div className="row">
                        <div className="d-sm-none d-md-none col-lg-1">&nbsp;</div>
                        <div className="u-padding--left col-lg-6">
                          <ul className="t-sans list--2-columns u-padding--top">
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/">
                                All compliance resources
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/guides/">
                                Guides
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/forms/">
                                Forms
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/dates-and-deadlines/">
                                Dates and deadlines
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/trainings/">
                                Trainings
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="u-padding--left col-lg-5">
                          <div className="icon-heading icon-heading--checklist-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/filing-reports/electronic-filing/">
                                Learn about electronic filing
                              </a>
                            </p>
                          </div>
                          <div className="icon-heading icon-heading--question-bubble-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/help-candidates-and-committees/question-rad/">
                                Find and contact your committee&apos;s analyst
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Legal resources menu */}
              <li className="site-nav__item" data-submenu="legal">
                <a
                  href="#0"
                  className="site-nav__link"
                  tabIndex={0}
                  id="mega-menu-legal"
                  aria-haspopup="true"
                  aria-controls="mega-menu-legal-content"
                  aria-expanded={activeSubmenu === 'legal'}
                  onClick={(e) => toggleSubmenu('legal', e)}
                >
                  <span className="site-nav__link__title">Legal resources</span>
                </a>
                <div
                  className="mega-container"
                  id="mega-menu-legal-content"
                  role="group"
                  aria-expanded={activeSubmenu === 'legal'}
                  aria-hidden={activeSubmenu !== 'legal'}
                  aria-labelledby="mega-menu-legal"
                >
                  <div className="mega">
                    <div className="mega__inner">
                      <div className="row">
                        <div className="d-sm-none d-md-none col-lg-1">&nbsp;</div>
                        <div className="u-padding--left col-md-4 col-lg-6">
                          <ul className="t-sans list--1-2-2-2-columns u-padding--top">
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/">
                                All legal resources
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/legal/advisory-opinions/">
                                Advisory opinions
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/enforcement/">
                                Enforcement
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/data/legal/statutes/">
                                Statutes
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/legislation/">
                                Legislation
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/regulations/">
                                Regulations
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/court-cases/">
                                Court cases
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/policy-other-guidance/">
                                Policy and other guidance
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="u-padding--left col-md-3 col-lg-4">
                          <div className="icon-heading icon-heading--magnifying-glass-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/">
                                Search across all legal resources
                              </a>
                            </p>
                          </div>
                          <div className="icon-heading icon-heading--magnifying-glass-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/legal-resources/policy-and-other-guidance/guidance-documents/">
                                Search guidance documents
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* About menu */}
              <li className="site-nav__item site-nav__item--secondary" data-submenu="about">
                <a
                  href="#0"
                  className="site-nav__link"
                  tabIndex={0}
                  id="mega-menu-about"
                  aria-haspopup="true"
                  aria-controls="mega-menu-about-content"
                  aria-expanded={activeSubmenu === 'about'}
                  onClick={(e) => toggleSubmenu('about', e)}
                >
                  <span className="site-nav__link__title">About</span>
                </a>
                <div
                  className="mega-container"
                  id="mega-menu-about-content"
                  role="group"
                  aria-expanded={activeSubmenu === 'about'}
                  aria-hidden={activeSubmenu !== 'about'}
                  aria-labelledby="mega-menu-about"
                >
                  <div className="mega mega--secondary">
                    <div className="mega__inner">
                      <div className="row">
                        <div className="u-padding--left d-sm-none d-md-none col-lg-1">&nbsp;</div>
                        <div className="u-padding--left col-lg-6">
                          <ul className="t-sans list--1-2-2-3-columns u-padding--top">
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/about/">
                                All about the FEC
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/updates/">
                                News and announcements
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/meetings/">
                                Commission meetings
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/about/mission-and-history/">
                                Mission and history
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/about/leadership-and-structure/">
                                Leadership and structure
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/about/reports-about-fec/">
                                Reports about the FEC
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/about/careers/">
                                Careers
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/about/#working-with-the-fec">
                                Working with the FEC
                              </a>
                            </li>
                            <li className="mega__item">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/contact/">
                                Contact
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="u-padding--left col-lg-4">
                          <div className="icon-heading icon-heading--election-circle">
                            <p className="t-sans t-small icon-heading__text">
                              <a rel="noopener noreferrer" href="https://www.fec.gov/introduction-campaign-finance/">
                                Introduction to campaign finance and elections
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <a
            rel="noopener noreferrer"
            title="Home"
            href="https://www.fec.gov/"
            className="site-title"
          >
            <span className="u-visually-hidden">Federal Election Commission | United States of America</span>
          </a>
        </nav>
      </header>

      {/* Glossary modal */}
      <div
        id="glossary"
        className="glossary"
        aria-describedby="glossary-result"
        aria-hidden={!glossaryOpen}
        style={{ display: glossaryOpen ? 'block' : 'none' }}
      >
        <button
          title="Close glossary"
          className="button button--close--inverse toggle js-glossary-close"
          onClick={toggleGlossary}
        >
          <span className="u-visually-hidden">Hide glossary</span>
        </button>
        <h2>Glossary</h2>
        <label htmlFor="glossary-search" className="label">
          Search terms
        </label>
        <input id="glossary-search" className="glossary__search js-glossary-search" type="search" />
        <span className="t-note t-sans search__example">Examples: receipt; Hybrid PAC</span>
        <div className="glossary__content" id="glossary-result">
          <ul className="glossary__list js-glossary-list accordion--inverse"></ul>
        </div>
      </div>
    </>
  );
}