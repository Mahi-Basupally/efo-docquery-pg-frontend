'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    // Set global config first
    (window as any).BASE_PATH = '/';
    (window as any).FEC_APP_URL = '/data';
    (window as any).API_LOCATION = 'https://api.open.fec.gov';
    (window as any).API_VERSION = 'v1';
    (window as any).API_KEY_PUBLIC = 'cz84p9LVOQQch2oyxt7jFhm1b9kb5vqykejTJd6G';
    (window as any).API_KEY_PUBLIC_CALENDAR = 'cz84p9LVOQQch2oyxt7jFhm1b9kb5vqykejTJd6G';
    (window as any).CALENDAR_DOWNLOAD_PUBLIC_API_KEY = 'None';
    (window as any).CANONICAL_BASE = 'https://www.fec.gov';

    // Function to load scripts sequentially
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Important: ensures execution order
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    // Load scripts in exact order. This is the ONLY place FEC's legacy
    // jQuery/jQuery-UI scripts get loaded - Footer.tsx used to load its own
    // overlapping copy of this same sequence in a second, unsynchronized
    // useEffect, racing this one (removed from Footer.tsx entirely).
    //
    // vendors.js/global.js are FEC.gov's own webpack chunks and bundle
    // their own internal copy of jQuery (vendors.js literally contains
    // node_modules/jquery/dist/jquery.js). When they execute they reassign
    // window.$/jQuery to that bundled copy as a side effect, which has no
    // jQuery UI methods. So they MUST load - and be allowed to finish
    // clobbering window.$ - BEFORE the real jQuery + jQuery UI CDN scripts,
    // not after: loading them after (the previous order here) meant
    // vendors.js silently reset window.$ back to a UI-less jQuery right
    // before modals.js/ajaxcalls.js/custom.js ran, producing
    // "$(...).dialog is not a function" the moment any of them called
    // .dialog() (confirmed via a live stack trace: custom.js's
    // $(document).ready(...) callback fired through vendors.js's own
    // bundled jQuery, not the CDN one). vendors.js/global.js are
    // self-contained webpack chunks - they don't need a global jQuery to
    // already exist to load themselves, so loading them first is safe.
    const loadScriptsSequentially = async () => {
      try {
        // FEC.gov's own webpack chunks - load first; each bundles its own
        // internal jQuery copy and will reassign window.$ as a side effect.
        await loadScript('/js/vendors.js');
        console.log('Vendors loaded');

        await loadScript('/js/global.js');
        console.log('Global loaded');

        // Real jQuery + full jQuery UI (dialog included) - load last, so
        // this is the copy still on window.$ when the legacy scripts below
        // run, not vendors.js's UI-less one.
        await loadScript('https://code.jquery.com/jquery-3.7.1.js');
        console.log('jQuery loaded');

        await loadScript('https://code.jquery.com/ui/1.13.2/jquery-ui.js');
        console.log('jQuery UI loaded');

        // FEC legacy page scripts - depend on jQuery + jQuery UI above
        await loadScript('/js/modals.js');
        await loadScript('/js/ajaxcalls.js');
        await loadScript('/js/custom.js');
        console.log('FEC legacy scripts loaded');

        console.log('All scripts loaded successfully');
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScriptsSequentially();

    // Cleanup function
    return () => {
      // Optional: Remove scripts on unmount if needed
      // Note: Usually not necessary for global scripts
    };
  }, []);

  return null; // This component doesn't render anything
}
