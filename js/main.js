/* =========================================================
   PALLSTON — MAIN SCRIPT
   No frameworks. Small, deliberate behaviors only:
   nav, menu, quiet reveals, field drawing, the form.
   ========================================================= */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Theme ----------------
     One palette, two arrangements. The pre-paint script in <head>
     resolves the initial theme; this only handles the toggle. */
  var root = document.documentElement;
  var THEME_KEY = 'pallston-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#23272F' : '#F7F8F9');
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* private mode */ }
  });

  /* ---------------- Nav scroll behavior ---------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);

      if (y > lastY && y > 140) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  /* ---------------- Mobile menu ---------------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  var menuClose = document.querySelector('.mobile-menu__close');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    document.body.classList.add('menu-is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    // Focus the nav wrapper, not the first link: keyboard users start
    // from the top; touch users don't get a stray focus ring on "Home".
    var nav = mobileMenu.querySelector('.mobile-menu__links');
    if (nav) nav.focus({ preventScroll: true });
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.focus();
  }
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) { closeMenu(); } else { openMenu(); }
    });
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------------- Decision Fields: draw on arrival ----------------
     Each field draws itself the first time it enters the viewport —
     lines radiating outward from the origin, slowly. Reduced motion
     gets fully drawn fields via CSS; the class is then inert. */
  var fields = document.querySelectorAll('.field');
  if (fields.length) {
    if ('IntersectionObserver' in window && !reducedMotion) {
      var fieldObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-drawn');
            fieldObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      fields.forEach(function (f) { fieldObserver.observe(f); });
    } else {
      fields.forEach(function (f) { f.classList.add('is-drawn'); });
    }
  }

  /* ---------------- Quiet reveals ----------------
     Blocks rise 14px as they enter view, staggered gently within
     their group. Nothing moves that the reader hasn't reached. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
  if (revealEls.length) {
    var groupCounts = new Map();
    revealEls.forEach(function (el) {
      var parent = el.parentNode;
      var idx = groupCounts.get(parent) || 0;
      groupCounts.set(parent, idx + 1);
      el.style.setProperty('--rv-d', ((idx % 6) * 85) + 'ms');
    });

    if ('IntersectionObserver' in window && !reducedMotion) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------------- Perspectives: progressive reveal ---------------- */
  var perspGrid = document.getElementById('perspGrid');
  var perspMore = document.getElementById('perspMore');
  if (perspGrid && perspMore) {
    var allItems = Array.prototype.slice.call(perspGrid.querySelectorAll('.persp-item'));
    var PER_PAGE = 6;
    var shown = PER_PAGE;

    allItems.forEach(function (item, i) { item.hidden = i >= shown; });
    if (shown >= allItems.length) perspMore.hidden = true;

    perspMore.addEventListener('click', function () {
      var next = allItems.slice(shown, shown + PER_PAGE);
      next.forEach(function (item) { item.hidden = false; });
      shown += next.length;
      if (shown >= allItems.length) perspMore.hidden = true;

      var firstNew = next[0] && next[0].querySelector('a');
      if (firstNew) firstNew.focus({ preventScroll: true });
    });
  }

  /* ---------------- Contact form (Netlify Forms, AJAX) ---------------- */
  var form = document.querySelector('[data-netlify-form]');
  if (form) {
    var successEl = document.querySelector('[data-form-success]');

    var encode = function (data) {
      return Object.keys(data).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var requiredFields = form.querySelectorAll('[required]');
      var valid = true;
      requiredFields.forEach(function (field) {
        var wrap = field.closest('.field');
        if (!field.value.trim()) {
          valid = false;
          if (wrap) wrap.classList.add('field--error');
        } else if (wrap) {
          wrap.classList.remove('field--error');
        }
      });
      if (!valid) return;

      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload)
      }).then(function () {
        form.classList.add('is-hidden');
        if (successEl) {
          successEl.classList.add('is-visible');
          successEl.setAttribute('tabindex', '-1');
          successEl.focus();
        }
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
        alert('Something went wrong sending your message. Please email contact@pallston.com directly.');
      });
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        var wrap = field.closest('.field');
        if (wrap && field.value.trim()) wrap.classList.remove('field--error');
      });
    });
  }
})();
