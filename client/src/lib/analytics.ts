// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.VITE_GA_MEASUREMENT_ID || '', {
    page_title: title || document.title,
    page_location: url,
  });
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track PDF generation
export const trackPDFGeneration = (invoiceNumber: string) => {
  trackEvent('pdf_generated', 'invoice', invoiceNumber);
};

// Track signature creation
export const trackSignatureCreated = () => {
  trackEvent('signature_created', 'invoice');
};

// Track invoice creation
export const trackInvoiceCreated = () => {
  trackEvent('invoice_created', 'invoice');
};
