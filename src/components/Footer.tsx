'use client'

import { useEffect } from 'react'

export default function Footer() {
  useEffect(() => {
    // Set global config when component mounts
    (window as any).BASE_PATH = '/';
    (window as any).FEC_APP_URL = '/data';
    (window as any).API_LOCATION = 'https://api.open.fec.gov';
    (window as any).API_VERSION = 'v1';
    (window as any).API_KEY_PUBLIC = 'cz84p9LVOQQch2oyxt7jFhm1b9kb5vqykejTJd6G';
    (window as any).API_KEY_PUBLIC_CALENDAR = 'cz84p9LVOQQch2oyxt7jFhm1b9kb5vqykejTJd6G';
    (window as any).CALENDAR_DOWNLOAD_PUBLIC_API_KEY = 'None';
    (window as any).CANONICAL_BASE = 'https://www.fec.gov';

    // Legacy jQuery/jQuery-UI/FEC script loading lives in ScriptLoader.tsx
    // only (rendered once in the root layout). This component used to load
    // its own overlapping copy of that same script sequence in a second,
    // unsynchronized effect, racing ScriptLoader's - the two uncoordinated
    // loaders were the cause of "$(...).dialog is not a function" (a
    // conflicting standalone widget-factory script from one loader's chain
    // could execute before jQuery UI's own from the other's). Do not
    // reintroduce a second script loader here.
  }, []);

  return (
    <>
      <nav className="footer-links">
        <div className="container">
          <div className="grid grid--6-wide">
            <div className="grid__item">
              <ul>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/about/">
                    About
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/about/careers/">
                    Careers
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/press/">
                    Press
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/contact/">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid__item"></div>

            <div className="grid__item"></div>

            <div className="grid__item">
              <ul>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/about/privacy-and-security-policy">
                    Privacy and security policy
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/about/plain-language/">
                    Plain language
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/about/no-fear-act/">
                    No FEAR Act
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer"
                    href="https://www.fec.gov/about/reports-about-fec/strategy-budget-and-performance/"
                  >
                    Strategy, budget and performance
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid__item">
              <ul>
                <li>
                  <a rel="noopener noreferrer" href="https://www.data.gov/open-gov/">
                    Open government
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.usa.gov/">
                    USA.gov
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/fecig/fecig.shtml">
                    Inspector General
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://www.fec.gov/freedom-information-act/">
                    FOIA
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid__item">
              <ul>
                <li>
                  <a rel="noopener noreferrer" href="https://api.open.fec.gov">
                    OpenFEC API
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="https://github.com/18F/fec">
                    GitHub repository
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer"
                    href="https://github.com/18F/FEC/blob/master/release_notes/release_notes.md"
                  >
                    Release notes
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <footer className="footer">
        <div className="container">
          <div className="seal">
            <img
              className="seal__img"
              width="140"
              height="140"
              src="/img/seal--inverse.svg"
              alt="Seal of the Federal Election Commission | United States of America"
            />
            <p className="address__title">Federal Election Commission</p>
          </div>

          <div className="address">
            <ul className="social-media">
              <li>
                <div className="i icon--twitter">
                  <a rel="noopener noreferrer" href="https://twitter.com/fec">
                    <span className="u-visually-hidden">The FEC&apos;s Twitter page</span>
                  </a>
                </div>
              </li>
              <li>
                <div className="i icon--youtube">
                  <a rel="noopener noreferrer" href="https://www.youtube.com/user/FECTube">
                    <span className="u-visually-hidden">The FEC&apos;s YouTube page</span>
                  </a>
                </div>
              </li>
            </ul>

            <a
              rel="noopener noreferrer"
              href="https://public.govdelivery.com/accounts/USFEC/subscriber/topics?qsp=CODE_RED"
              target="_blank"
            >
              <button className="button--standard button--envelope">Sign up for FECMail</button>
            </a>
          </div>
        </div>
      </footer>

      {/* Scripts are loaded via useEffect hook above */}
    </>
  )
}