/* WRENCH — site behaviour. Vanilla JS, no dependencies.
   Replaces jQuery 1.8.3 + wow.js + stickyNavbar + enllax + waypoints +
   scrollUp + featherlight + lightbox + imagesLoaded. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------ Sticky header + progress */
  var header = $('#siteHeader');
  var progress = $('#scrollProgress');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------ Mobile nav */
  var toggle = $('#navToggle');
  var nav = $('#siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* --------------------------------------- Scrollspy for the one-page nav */
  (function () {
    var list = $('[data-spy-nav]');
    if (!list || !('IntersectionObserver' in window)) return;
    var links = $$('a[href^="#"]', list);
    var map = {};
    var sections = links.map(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) map[el.id] = a;
      return el;
    }).filter(Boolean);
    if (!sections.length) return;

    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      sections.forEach(function (el) { if (visible[el.id] && !current) current = el.id; });
      links.forEach(function (a) {
        a.classList.toggle('is-active', current !== null && a === map[current]);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (el) { spy.observe(el); });
  })();

  /* ------------------------------------------- Progressive "show all" lists
     [data-expand] with [data-expand-initial="N"] keeps the first N
     [data-expand-item]s and hides the rest behind [data-expand-toggle].
     Collapsing is skipped while a filter or search is narrowing the list. */
  function applyExpand(root) {
    if (!root || !root.hasAttribute('data-expand')) return;
    var limit = parseInt(root.getAttribute('data-expand-initial'), 10) || 6;
    var btn = $('[data-expand-toggle]', root);
    var open = root.getAttribute('data-expand-open') === 'true';
    var filtering = root.getAttribute('data-expand-filtering') === 'true';
    var shown = 0, hidden = 0;

    $$('[data-expand-item]', root).forEach(function (item) {
      if (item.hidden) return;                       // already filtered out
      shown++;
      var over = !open && !filtering && shown > limit;
      item.classList.toggle('is-collapsed', over);
      if (over) hidden++;
    });

    if (!btn) return;
    btn.hidden = hidden === 0 && !open;
    if (filtering) btn.hidden = true;
    btn.textContent = open
      ? btn.getAttribute('data-label-less')
      : btn.getAttribute('data-label-more');
  }

  $$('[data-expand]').forEach(function (root) {
    var btn = $('[data-expand-toggle]', root);
    applyExpand(root);
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = root.getAttribute('data-expand-open') === 'true';
      root.setAttribute('data-expand-open', String(!open));
      applyExpand(root);
      if (open) {
        var top = root.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  });
  window.wrenchApplyExpand = applyExpand;

  /* ------------------------------------------------------- Reveal on scroll */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
      /* Safety net: whatever the observer has not reported on within a few
         seconds gets revealed anyway, so content is never stuck invisible. */
      window.setTimeout(function () {
        revealables.forEach(function (el) { el.classList.add('is-visible'); });
      }, 2500);
    }
  }

  /* ------------------------------------------------------------- Count-up */
  var counters = $$('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      if (reduced) { el.textContent = String(target); return; }
      var dur = 1100, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
      /* Same safety net as the reveal: never leave a counter showing 0. */
      window.setTimeout(function () {
        counters.forEach(function (el) {
          if (el.textContent === '0') { cio.unobserve(el); run(el); }
        });
      }, 2500);
    }
  }

  /* ------------------------------------------------------------ Code tabs */
  $$('[data-tabs]').forEach(function (group) {
    var tabs = $$('[data-tab]', group);
    var panes = $$('[data-pane]', group);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-tab');
        tabs.forEach(function (t) { t.classList.toggle('is-active', t === tab); });
        panes.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-pane') === name); });
      });
    });
  });

  /* --------------------------------------------------------- Copy to board */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy');
      var src = sel === 'prev' ? btn.closest('[data-copy-scope]') : $(sel);
      var node = sel === 'prev'
        ? (src ? src.querySelector('pre') : null)
        : src;
      if (!node) return;
      var text = node.innerText.trim();
      var done = function () {
        var label = btn.querySelector('[data-copy-label]');
        var prev = label ? label.textContent : null;
        btn.classList.add('is-done');
        if (label) label.textContent = 'Copied';
        setTimeout(function () {
          btn.classList.remove('is-done');
          if (label && prev !== null) label.textContent = prev;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ------------------------------------------------- Filterable reference lists
     Markup contract:
       [data-filterable]            wrapper
         input[data-filter-search]  free-text search
         [data-filter-chip="value"] toggle chips (value "" = all)
         [data-item] [data-tags]    items, space/pipe separated tag string
         [data-filter-count]        live "N shown" label
         [data-filter-empty]        empty state block
  */
  $$('[data-filterable]').forEach(function (root) {
    var items = $$('[data-item]', root);
    var chips = $$('[data-filter-chip]', root);
    var search = $('[data-filter-search]', root);
    var countEl = $('[data-filter-count]', root);
    var emptyEl = $('[data-filter-empty]', root);
    var active = '';

    function apply() {
      var q = (search && search.value || '').trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var tags = (item.getAttribute('data-tags') || '').toLowerCase();
        var text = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
        var okChip = !active || tags.indexOf('|' + active.toLowerCase() + '|') > -1;
        var okText = !q || text.indexOf(q) > -1;
        var ok = okChip && okText;
        item.hidden = !ok;
        if (ok) shown++;
      });
      if (countEl) countEl.textContent = shown;
      if (emptyEl) emptyEl.hidden = shown !== 0;
      /* While a search or chip is narrowing things down, show every match
         rather than the collapsed preview. */
      root.setAttribute('data-expand-filtering', String(Boolean(q) || Boolean(active)));
      if (window.wrenchApplyExpand) window.wrenchApplyExpand(root);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        active = chip.getAttribute('data-filter-chip') || '';
        chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });
        apply();
      });
    });
    if (search) {
      search.addEventListener('input', apply);
      search.addEventListener('search', apply);
    }
    apply();
  });

  /* ----------------------------------------------------------- Chart.js glue
     Any <canvas data-chart> whose sibling <script type="application/json">
     holds { labels, series:[{label,color,data}], yTitle, xTitle }. */
  window.wrenchChart = function (canvasId, payloadId) {
    var canvas = document.getElementById(canvasId);
    var payloadEl = document.getElementById(payloadId);
    if (!canvas || !payloadEl || typeof Chart === 'undefined') return;
    var cfg = JSON.parse(payloadEl.textContent);

    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#6f7787';

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: cfg.labels,
        datasets: cfg.series.map(function (s) {
          return {
            label: s.label,
            data: s.data,
            backgroundColor: s.color,
            /* 2px surface gap between stacked segments keeps adjacent fills
               separable without drawing an outline around them */
            borderColor: '#ffffff',
            borderWidth: { top: 2, right: 0, bottom: 0, left: 0 },
            borderRadius: 3,
            borderSkipped: false,
            maxBarThickness: 46
          };
        })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: reduced ? false : { duration: 700 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#10141d',
            padding: 11,
            cornerRadius: 8,
            titleFont: { family: "'Space Grotesk', sans-serif", size: 12.5 },
            bodyFont: { size: 12 },
            displayColors: true,
            boxWidth: 9,
            boxHeight: 9,
            boxPadding: 4,
            filter: function (i) { return i.parsed.y > 0; }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { color: '#e6e8f0' },
            title: cfg.xTitle ? { display: true, text: cfg.xTitle, color: '#99a0ad', font: { size: 11 } } : undefined
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: '#f0f2f7' },
            border: { display: false },
            ticks: { precision: 0, padding: 8 },
            title: cfg.yTitle ? { display: true, text: cfg.yTitle, color: '#99a0ad', font: { size: 11 } } : undefined
          }
        }
      }
    });
  };
})();
