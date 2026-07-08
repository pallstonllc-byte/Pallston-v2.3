// Pallston Lab — access-controlled concepts, rendered like the articles
// but with a video block. Gating is enforced at the edge (Netlify Basic
// Auth); these templates are just the pages behind the door.

const fs = require('fs');
const path = require('path');
const { renderField } = require('./decision-fields');

const LAB = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'lab.json'), 'utf8'));

// The video area. Renders a real <video> when a source is configured;
// otherwise a calm, on-brand placeholder frame. Adding a walkthrough later
// is only a matter of setting `video` in lab.json.
function renderVideo(item) {
  if (item.video && item.video.src) {
    const poster = item.video.poster ? ` poster="${item.video.poster}"` : '';
    const type = item.video.type || 'video/mp4';
    return `      <figure class="lab-video" data-rv>
        <div class="lab-video__frame">
          <video controls preload="none"${poster}>
            <source src="${item.video.src}" type="${type}">
          </video>
        </div>
      </figure>`;
  }
  return `      <figure class="lab-video" data-rv>
        <div class="lab-video__frame lab-video__frame--placeholder">
          <span class="lab-video__play" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="21" stroke="currentColor" stroke-width="1.25"/><path d="M20 16.5v15l12-7.5-12-7.5Z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/></svg>
          </span>
          <p class="lab-video__note">Walkthrough in production</p>
        </div>
        <figcaption>A recorded demonstration of ${item.name} will appear here.</figcaption>
      </figure>`;
}

// The six coordinated stages, drawn as one quiet sequence.
function renderStages(item) {
  const steps = item.stages.map(s => `<li class="lab-stage">${s}</li>`).join('\n          ');
  return `      <div class="lab-stages" data-rv>
        <p class="lab-stages__label">${item.stages.length} coordinated stages</p>
        <ol class="lab-stages__flow">
          ${steps}
        </ol>
      </div>`;
}

function renderLabRow(item) {
  return `      <article class="lab-item" data-rv>
        <p class="lab-item__meta"><span class="lab-item__sector">${item.sector}</span><span class="lab-item__status">${item.status}</span></p>
        <h2 class="lab-item__name"><a class="stretch-link" href="/lab/${item.slug}.html">${item.name}</a></h2>
        <p class="lab-item__tagline">${item.tagline}</p>
        <p class="lab-item__summary">${item.summary}</p>
        <span class="lab-item__more" aria-hidden="true">Open the concept</span>
      </article>`;
}

function renderLabIndex() {
  const rows = LAB.map(renderLabRow).join('\n');
  return `<section class="page-hero page-hero--split">
  <div class="container page-hero__grid">
    <div class="page-hero__content">
      <h1>Pallston Lab<span class="brand-glyph" aria-hidden="true"></span></h1>
      <p class="lede">Concepts we're building. Early applied-AI initiatives, shared with the people we invite in. The work here is Pallston confidential — exploratory and evolving — and access is provided to collaborators and prospective clients only.</p>
    </div>
    <div class="page-hero__field" aria-hidden="true">
      ${renderField('lab')}
    </div>
  </div>
</section>

<section class="section section--rule">
  <div class="container">
    <div class="lab-index">
${rows}
    </div>
  </div>
</section>
`;
}

function renderLabPage(item) {
  const idx = LAB.findIndex(x => x.slug === item.slug);
  const next = LAB[(idx + 1) % LAB.length];
  const [lede, ...rest] = item.body;

  return `<article class="page-hero article-hero">
  <div class="container">
    <div class="page-hero__content article-hero__content">
      <p class="article-back-row"><a class="article-back" href="/lab/">&larr; Back to the Lab</a></p>
      <div class="lab-meta">
        <span>${item.sector}</span>
        <span aria-hidden="true">&middot;</span>
        <span>${item.status}</span>
      </div>
      <h1>${item.name}<span class="brand-glyph" aria-hidden="true"></span></h1>
      <p class="lede lab-lead">${item.tagline}</p>
    </div>
  </div>
</article>

<section class="section section--rule">
  <div class="container">
${renderVideo(item)}

    <div class="article-body lab-body">
      <p class="lede">${lede}</p>
      <div class="article-divider" aria-hidden="true">${renderField('divider')}</div>
      ${rest.map(p => `<p>${p}</p>`).join('\n      ')}
    </div>

${renderStages(item)}

    <div class="article-next">
      <span class="article-next__label">Next in the Lab</span>
      <a class="article-next__link" href="/lab/${next.slug}.html">${next.name} <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</section>

<section class="section section--rule">
  <div class="container">
    <div class="closing" data-rv>
      <h2>Want to explore this with us?<span class="brand-glyph" aria-hidden="true"></span></h2>
      <p>These are early concepts. If one maps to a problem you're facing, we'd welcome the conversation.</p>
      <div class="cta-row closing__cta">
        <a class="btn btn--primary" href="/contact.html">Let's Talk</a>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { LAB, renderLabIndex, renderLabPage };
