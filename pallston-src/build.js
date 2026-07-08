// Pallston static site build script.
// Assembles shared header/footer/meta partials around each page's unique
// content and writes plain, dependency-free static HTML to ../pallston.
// Run with: node generate.js
//
// One theme, one canvas. No toggles, no overlays: the page itself is
// the arrival.

const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const OUT = path.join(__dirname, '..', 'pallston');

function read(p) {
  return fs.readFileSync(path.join(SRC, p), 'utf8');
}

const logo = read('../pallston/assets/logo-horizontal.svg');

const SITE_URL = 'https://www.pallston.com';

// The Lab is an access-controlled section (Netlify edge Basic Auth).
// Build it — and show it in the nav — only when enabled. Set
// LAB_ENABLED=false at build time to remove it from the site entirely.
const LAB_ENABLED = process.env.LAB_ENABLED !== 'false';

// Social presence — one handle, @pallstonllc, across platforms.
// Monochrome glyphs in currentColor; brand mark stays the emerald square.
const SOCIALS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/pallstonllc', path: 'M6.94 5A1.94 1.94 0 1 1 3.06 5a1.94 1.94 0 0 1 3.88 0zM3.33 8.48h3.2V21h-3.2V8.48zM9.34 8.48h3.07v1.71h.04c.43-.81 1.47-1.67 3.03-1.67 3.24 0 3.84 2.13 3.84 4.9V21h-3.2v-5.94c0-1.42-.03-3.24-1.97-3.24-1.98 0-2.28 1.54-2.28 3.13V21h-3.2V8.48z' },
  { name: 'X', href: 'https://x.com/pallstonllc', path: 'M17.53 3h2.94l-6.43 7.35L21.6 21h-5.92l-4.64-6.07L5.73 21H2.79l6.88-7.86L2.4 3h6.07l4.2 5.55L17.53 3zm-1.03 16.24h1.63L7.57 4.67H5.82L16.5 19.24z' },
  { name: 'Facebook', href: 'https://www.facebook.com/pallstonllc', path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94z' },
  { name: 'Threads', href: 'https://www.threads.net/@pallstonllc', path: 'M16.29 11.2l-.24-.11c-.14-2.56-1.54-4.03-3.88-4.05h-.03c-1.4 0-2.57.6-3.28 1.69l1.29.88c.53-.81 1.37-.98 1.99-.98h.02c.77.01 1.35.23 1.72.66.27.31.45.74.54 1.28-.68-.12-1.41-.15-2.19-.11-2.2.13-3.62 1.41-3.52 3.19.05.9.5 1.68 1.26 2.19.65.43 1.48.64 2.35.59 1.14-.06 2.03-.5 2.66-1.29.48-.61.78-1.4.91-2.39.56.34.97.78 1.19 1.32.38.91.4 2.4-.82 3.63-1.07 1.07-2.35 1.53-4.29 1.55-2.16-.02-3.79-.71-4.85-2.06C7.15 15.62 6.64 13.96 6.62 12c.02-1.96.53-3.62 1.52-4.94C9.2 5.71 10.83 5.02 12.99 5h.01c2.17.02 3.83.71 4.94 2.07.54.66.95 1.5 1.22 2.48l1.5-.4c-.33-1.21-.85-2.25-1.55-3.11C17.7 4.32 15.62 3.45 13 3.43h-.01c-2.61.02-4.66.9-6.11 2.6C5.53 7.62 4.82 9.66 4.79 12v.01c.03 2.34.74 4.38 2.09 5.97 1.46 1.7 3.51 2.58 6.1 2.6h.01c2.3-.02 3.92-.62 5.26-1.96 1.75-1.75 1.7-3.94 1.12-5.29-.42-.96-1.21-1.75-2.28-2.13z' },
  { name: 'YouTube', href: 'https://www.youtube.com/@pallstonllc', path: 'M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15V9l5.2 3-5.2 3z' }
];

function renderSocials() {
  const items = SOCIALS.map(s =>
    `<a href="${s.href}" aria-label="Pallston on ${s.name}" rel="noopener me" target="_blank">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${s.path}"/></svg>
        </a>`).join('\n        ');
  return `<div class="site-footer__social">\n        ${items}\n      </div>`;
}

// Absolute hrefs so the same header/footer resolve from any depth,
// including the /lab/ subdirectory.
const NAV_ITEMS = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'capabilities', href: '/capabilities.html', label: 'Capabilities' },
  { key: 'industries', href: '/industries.html', label: 'Industries' },
  { key: 'perspectives', href: '/perspectives.html', label: 'Perspectives' }
];
if (LAB_ENABLED) NAV_ITEMS.push({ key: 'lab', href: '/lab/', label: 'Lab' });

function renderNav(activeKey, withContact) {
  const items = NAV_ITEMS.map(item => {
    const current = item.key === activeKey ? ' aria-current="page"' : '';
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  });
  if (withContact) {
    const contactCurrent = activeKey === 'contact' ? ' aria-current="page"' : '';
    items.push(`<a href="/contact.html"${contactCurrent}>Let's Talk</a>`);
  }
  return items.join('\n          ');
}

function header(activeKey) {
  const contactCurrent = activeKey === 'contact' ? ' aria-current="page"' : '';
  return `  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="/" aria-label="Pallston — home">
        ${logo.trim()}
      </a>
      <nav class="nav__links" aria-label="Primary">
          ${renderNav(activeKey, false)}
      </nav>
      <div class="nav__actions">
        <button class="theme-toggle" data-theme-toggle type="button" aria-pressed="false" aria-label="Switch to dark mode">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 3.75 A6.25 6.25 0 0 1 10 16.25 Z" fill="currentColor"/></svg>
        </button>
        <a class="btn btn--primary btn--nav nav__cta" href="/contact.html"${contactCurrent}>Let's Talk</a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 8h18M3 16h18"/></svg>
          <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu">
    <button class="mobile-menu__close" type="button" aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>
    </button>
    <nav class="mobile-menu__links" aria-label="Mobile" tabindex="-1">
          ${renderNav(activeKey, true)}
    </nav>
  </div>
`;
}

function footer() {
  return `  <footer class="site-footer">
    <div class="container site-footer__top">
      <div class="site-footer__brand">
        <svg class="footer-mark" viewBox="-6 -6 152 208" height="44" aria-label="Pallston" role="img"><path d="M0,14 L77,14 A49,49 0 0 1 77,112 L56,112" fill="none" stroke="currentColor" stroke-width="28" stroke-linecap="butt" stroke-linejoin="miter"></path><rect x="0" y="56" width="28" height="84" fill="currentColor"></rect><rect x="0" y="168" width="28" height="28" fill="#0FAE65"></rect></svg>
        <p class="site-footer__mission">Helping organizations solve complex challenges through modern advisory, disciplined execution, and lasting transformation.</p>
      </div>
      <nav class="site-footer__cols" aria-label="Footer">
        <div class="site-footer__col">
          <h4>Navigate</h4>
          <a href="/">Home</a>
          <a href="/capabilities.html">Capabilities</a>
          <a href="/industries.html">Industries</a>
          <a href="/perspectives.html">Perspectives</a>
          ${LAB_ENABLED ? '<a href="/lab/">Lab</a>\n          ' : ''}<a href="/contact.html">Let's Talk</a>
        </div>
        <div class="site-footer__col">
          <h4>Connect</h4>
          <a href="mailto:contact@pallston.com">contact@pallston.com</a>
          ${renderSocials()}
        </div>
      </nav>
    </div>
    <div class="container site-footer__bottom">
      <div>
        <p>Copyright © 2026 Pallston LLC. All rights reserved.</p>
        <p>Pallston, Confidence Begins with Clarity, and The Pallston Method are trademarks or service marks of Pallston LLC.</p>
      </div>
    </div>
  </footer>
`;
}

function shell({ title, description, ogTitle, ogDescription, canonicalPath, bodyClass, noindex }, activeKey, mainHtml) {
  const ogUrl = `${SITE_URL}/${canonicalPath}`;
  const robots = noindex ? '\n<meta name="robots" content="noindex, nofollow">' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">${robots}
<link rel="canonical" href="${ogUrl}">

<meta property="og:type" content="website">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDescription}">
<meta property="og:url" content="${ogUrl}">
<meta property="og:image" content="${SITE_URL}/assets/og-image.png">
<meta property="og:site_name" content="Pallston">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle}">
<meta name="twitter:description" content="${ogDescription}">
<meta name="twitter:image" content="${SITE_URL}/assets/og-image.png">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#23272F">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/main.css">
<script>
  (function () {
    document.documentElement.classList.add('js');
    // Resolve the theme before first paint: stored choice, else system.
    try {
      var t = localStorage.getItem('pallston-theme');
      if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) t = 'dark';
      if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    } catch (e) {}
  })();
</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(activeKey)}
<main id="main">
${mainHtml}
</main>
${footer()}
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}

module.exports = { shell, read, SRC, OUT, LAB_ENABLED };
