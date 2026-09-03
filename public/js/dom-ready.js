// DOM Ready Wrapper for FEC Scripts
// This ensures document.body exists before other scripts run

(function() {
  'use strict';
  
  // Check if DOM is already ready
  function isDOMReady() {
    return document.readyState === 'complete' || 
           document.readyState === 'interactive';
  }

  // Wait for DOM to be ready
  function onDOMReady(callback) {
    if (isDOMReady()) {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
      // Fallback
      window.addEventListener('load', callback);
    }
  }

  // Make it globally available
  window.onDOMReady = onDOMReady;
  
  console.log('DOM Ready wrapper loaded');
})();
