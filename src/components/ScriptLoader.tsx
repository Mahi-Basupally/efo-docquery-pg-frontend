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

    // Load scripts in exact order
    const loadScriptsSequentially = async () => {
      try {
        // Load jQuery first (required for all other scripts)
        await loadScript('https://code.jquery.com/jquery-3.7.1.js');
        console.log('jQuery loaded');

        // Load jQuery UI
        await loadScript('https://code.jquery.com/ui/1.13.2/jquery-ui.js');
        console.log('jQuery UI loaded');

        // Load vendors.js (may contain jQuery plugins)
        await loadScript('/js/vendors.js');
        console.log('Vendors loaded');

        // Load global.js (now document.body is available)
        await loadScript('/js/global.js');
        console.log('Global loaded');

        // Load additional jQuery UI components
        await loadScript('/js/jquery-ui.js');
        console.log('jQuery UI custom loaded');

        await loadScript('/js/jquery.ui.widget.js');
        console.log('jQuery UI widget loaded');

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
