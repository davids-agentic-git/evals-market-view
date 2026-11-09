/* Evals Market View: small vanilla script. All content comes from /data/*.json. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, props = {}, ...kids) => {
    const node = Object.assign(document.createElement(tag), props);
    for (const k of kids) node.append(k);
    return node;
  };
  const getJSON = async (path) => {
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch {
      return null;
    }
  };

  // Mobile menu
  const menuBtn = $('.menu-btn');
  const nav = $('#nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const unique = (rows, key) => [...new Set(rows.map((r) => r[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  async function init() {
    const [site, companies, findings] = await Promise.all([
      getJSON('data/site.json'),
      getJSON('data/companies.json'),
      getJSON('data/findings.json'),
    ]);
    const rows = Array.isArray(companies) ? companies : [];

    // Site settings
    if (site && site.github) {
      document.querySelectorAll('[data-github]').forEach((a) => {
        a.href = site.github;
        a.hidden = false;
      });
    }
    if (site && site.snapshot) {
      document.querySelectorAll('[data-snapshot]').forEach((n) => (n.textContent = site.snapshot));
    }

    renderStats(rows);
    renderFindings(findings);
    renderCount(rows);
    renderDirectory(rows);
  }

  function renderStats(rows) {
    const list = $('#stats');
    if (!list) return;
    const stats = [[rows.length, rows.length === 1 ? 'company in the directory' : 'companies in the directory']];
    const clusters = unique(rows, 'cluster').length;
    const regions = unique(rows, 'hq').length;
    if (clusters) stats.push([clusters, 'market segments']);
    if (regions) stats.push([regions, 'headquarters regions']);
    list.replaceChildren(...stats.map(([n, label]) => el('li', { className: 'chip' }, el('strong', { textContent: n }), ` ${label}`)));
  }

  function renderFindings(data) {
    const host = $('#findings');
    const items = data && Array.isArray(data.items) ? data.items : [];
    if (!host || !items.length) return;
    host.replaceChildren(
      el('ol', { className: 'findings' }, ...items.map((it) =>
        el('li', {}, el('h3', { textContent: it.title }), el('p', { textContent: it.body || '' })))),
    );
  }

  function renderCount(rows) {
    const n = $('#directory-count');
    if (n && rows.length) n.textContent = `${rows.length} companies, filterable by segment, region and status.`;
  }

  const COLUMNS = [
    { key: 'name', label: 'Company', cls: 'name' },
    { key: 'cluster', label: 'Segment' },
    { key: 'hq', label: 'HQ' },
    { key: 'status', label: 'Status' },
    { key: 'funding', label: 'Funding' },
    { key: 'summary', label: 'What it does', cls: 'sum' },
  ];
  const FILTERS = [
    ['cluster', 'All segments'],
    ['hq', 'All regions'],
    ['status', 'All statuses'],
  ];

  function renderDirectory(rows) {
    const root = $('#directory-root');
    if (!root) return;
    if (!rows.length) return; // keeps the static empty state

    const cols = COLUMNS.filter((c) => rows.some((r) => r[c.key]));
    const state = { q: '', filters: {}, sort: null, dir: 1 };

    const search = el('input', { type: 'search', placeholder: 'Search companies', ariaLabel: 'Search companies' });
    const selects = FILTERS.filter(([k]) => rows.some((r) => r[k])).map(([key, all]) => {
      const sel = el('select', { ariaLabel: all }, el('option', { value: '', textContent: all }),
        ...unique(rows, key).map((v) => el('option', { value: v, textContent: v })));
      sel.addEventListener('change', () => { state.filters[key] = sel.value; draw(); });
      return sel;
    });
    const count = el('span', { className: 'count', role: 'status' });
    const tbody = el('tbody');
    const heads = cols.map((c) => {
      const btn = el('button', { type: 'button', textContent: c.label });
      const th = el('th', { scope: 'col' }, btn);
      btn.addEventListener('click', () => {
        state.dir = state.sort === c.key ? -state.dir : 1;
        state.sort = c.key;
        draw();
      });
      return { th, key: c.key };
    });
    const table = el('table', {}, el('thead', {}, el('tr', {}, ...heads.map((h) => h.th))), tbody);

    search.addEventListener('input', () => { state.q = search.value.trim().toLowerCase(); draw(); });

    function cell(c, row) {
      const v = row[c.key] ?? '';
      if (c.key === 'name' && row.url) {
        return el('td', { className: c.cls || '' }, el('a', { href: row.url, rel: 'noopener', textContent: v }));
      }
      return el('td', { className: c.cls || '', textContent: v });
    }

    function draw() {
      let out = rows.filter((r) =>
        Object.entries(state.filters).every(([k, v]) => !v || r[k] === v) &&
        (!state.q || Object.values(r).some((v) => String(v).toLowerCase().includes(state.q))));
      if (state.sort) {
        const k = state.sort;
        out = [...out].sort((a, b) => String(a[k] ?? '').localeCompare(String(b[k] ?? ''), undefined, { numeric: true }) * state.dir);
      }
      heads.forEach((h) => {
        h.th.setAttribute('aria-sort', h.key === state.sort ? (state.dir === 1 ? 'ascending' : 'descending') : 'none');
      });
      tbody.replaceChildren(...out.map((r) => el('tr', {}, ...cols.map((c) => cell(c, r)))));
      count.textContent = `${out.length} of ${rows.length}`;
    }

    root.replaceChildren(
      el('div', { className: 'toolbar' }, search, ...selects, count),
      el('div', { className: 'table-wrap' }, table),
    );
    draw();
  }

  init();
})();
