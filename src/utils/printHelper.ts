/**
 * Print Utility for GrowKins
 * Resolves Chrome/Edge modal blank page issues by rendering content
 * into an isolated offscreen iframe with full stylesheets and Bengali fonts.
 */
export const printElement = (
  elementId: string,
  docTitle: string = 'GrowKins Document',
  pageSize: 'A4' | 'A5' = 'A4'
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Remove any previous print iframe
  const oldFrame = document.getElementById('gk-print-frame');
  if (oldFrame) {
    oldFrame.remove();
  }

  // Create an off-screen print iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'gk-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '1050px';
  iframe.style.height = '1450px';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Grab all stylesheet tags and links from current page so Tailwind & custom styles apply
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(el => el.outerHTML)
    .join('\n');

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <title>${docTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  ${styles}
  <style>
    @page {
      size: ${pageSize} portrait;
      margin: 8mm 12mm;
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #111827 !important;
      font-family: 'Plus Jakarta Sans', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    .gk-print-wrapper {
      width: 100% !important;
      max-width: ${pageSize === 'A5' ? '600px' : '820px'} !important;
      margin: 0 auto !important;
      padding: 12px !important;
      background: #ffffff !important;
    }
    .gk-print-wrapper * {
      visibility: visible !important;
    }
    #growkins-invoice-sheet, #printable-card-content {
      border: none !important;
      box-shadow: none !important;
      max-width: 100% !important;
      width: 100% !important;
      padding: 0 !important;
      margin: 0 auto !important;
    }
  </style>
</head>
<body>
  <div class="gk-print-wrapper">
    ${element.outerHTML}
  </div>
</body>
</html>`);
  iframeDoc.close();

  // Allow browser time to render fonts and styles inside iframe, then trigger print
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print error, falling back to window.print():', e);
      window.print();
    }
  }, 350);
};
