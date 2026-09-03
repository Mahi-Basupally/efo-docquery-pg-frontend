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

    // Ensure document.body exists
    if (!document.body) {
      console.error('document.body is null - this should not happen in useEffect');
      return;
    }

    console.log('Footer mounted, body exists, loading scripts...');

    const scripts = [
      '/js/vendors.js',
      //'/js/global.js',  // Changed from global-38e367885d565f4a2430.js
      '/js/jquery-ui.js',
      '/js/jquery.ui.widget.js',
      '/js/modals.js',
      '/js/ajaxcalls.js',
      '/js/custom.js',
      //'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=FEC'
    ];

    const loadScript = (src: string) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.defer = true; // Use defer to wait for DOM
        script.onload = () => {
          console.log(`✓ ${src.split('/').pop()}`);
          resolve(src);
        };
        script.onerror = () => {
          console.warn(`⚠ ${src.split('/').pop()} failed`);
          resolve(src);
        };
        document.body.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      for (const src of scripts) {
        await loadScript(src);
        // Add tiny delay between scripts
        await new Promise(r => setTimeout(r, 50));
      }
      console.log('✓ All FEC scripts loaded');
    };

    // Small delay to ensure React has fully rendered
    setTimeout(() => {
      loadAllScripts();
    }, 100);

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