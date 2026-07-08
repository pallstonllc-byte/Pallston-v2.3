const { ARTICLES, getArticle, getNext, getRelated } = require('./articles');
const { renderField } = require('./decision-fields');

// One perspective, as an editorial index entry. The title is the link;
// the whole entry is clickable via the stretched link.
function renderItem(article, headingTag) {
  const h = headingTag || 'h3';
  return `      <article class="persp-item" data-rv>
        <p class="persp-item__cat">${article.category}</p>
        <${h} class="persp-item__title"><a class="stretch-link" href="article-${article.slug}.html">${article.title}</a></${h}>
        <p class="persp-item__excerpt">${article.excerpt}</p>
        <span class="persp-item__more" aria-hidden="true">Continue reading</span>
      </article>`;
}

function renderPerspectivesBatches() {
  // All 18 entries rendered into one index; JS reveals 6 at a time.
  return `    <div class="persp-index" id="perspGrid">\n${ARTICLES.map(a => renderItem(a, 'h2')).join('\n')}\n    </div>`;
}

// The three most recent perspectives, surfaced on the homepage as an
// editorial list. Uses existing titles only — no new copy.
function renderFeatured() {
  const rows = ARTICLES.slice(0, 3).map(a => `      <li class="feat-item" data-rv>
        <a class="feat-item__link" href="article-${a.slug}.html">
          <span class="feat-item__cat">${a.category}</span>
          <span class="feat-item__title">${a.title.replace(/\.$/, '')}</span>
          <span class="feat-item__arrow" aria-hidden="true">&rarr;</span>
        </a>
      </li>`).join('\n');
  return `    <ol class="feat-list">\n${rows}\n    </ol>`;
}

function renderArticlePage(article) {
  const related = getRelated(article);
  const relatedHtml = related.map(a => renderItem(a, 'h3')).join('\n');
  const next = getNext(article.slug);
  const [lede, ...rest] = article.body;

  return `<article class="page-hero article-hero">
  <div class="container">
    <div class="page-hero__content article-hero__content">
      <p class="article-back-row"><a class="article-back" href="perspectives.html">&larr; Back to Perspectives</a></p>
      <h1>${article.title.replace(/\.$/, '')}<span class="brand-glyph" aria-hidden="true"></span></h1>
      <div class="article-meta">
        <span>${article.category}</span>
        <span aria-hidden="true">&middot;</span>
        <span>${article.date}</span>
        <span aria-hidden="true">&middot;</span>
        <span>${article.readingTime}</span>
        <span aria-hidden="true">&middot;</span>
        <span>Pallston Advisory Team</span>
      </div>
    </div>
  </div>
</article>

<section class="section section--rule">
  <div class="container">
    <div class="article-body">
      <p class="lede">${lede}</p>
      <div class="article-divider" aria-hidden="true">${renderField('divider')}</div>
      ${rest.map(p => `<p>${p}</p>`).join('\n      ')}
    </div>

    <div class="article-related">
      <h2 class="article-related__title">Related perspectives</h2>
      <div class="persp-index persp-index--related">
${relatedHtml}
      </div>
    </div>

    <div class="article-next">
      <span class="article-next__label">Next perspective</span>
      <a class="article-next__link" href="article-${next.slug}.html">${next.title.replace(/\.$/, '')} <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</section>

<section class="section section--rule">
  <div class="container">
    <div class="closing" data-rv>
      <h2>Bring clarity to what matters next<span class="brand-glyph" aria-hidden="true"></span></h2>
      <p>Have a question this perspective didn't answer? Start a conversation directly.</p>
      <div class="cta-row closing__cta">
        <a class="btn btn--primary" href="contact.html">Let's Talk</a>
      </div>
    </div>
  </div>
</section>
`;
}

module.exports = { renderPerspectivesBatches, renderArticlePage, renderFeatured, ARTICLES };
