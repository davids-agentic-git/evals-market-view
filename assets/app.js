/* Small vanilla script: mobile menu, tabs, and the optional settings in data/site.json. */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);

  // Mobile menu
  const menuBtn = $('.menu-btn');
  const nav = $('#nav');
  if (menuBtn && nav) {
    const close = () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
    menuBtn.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // Tabs (methodology). The hash picks the tab, so a tab can be linked to.
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, { focus = false, updateHash = true } = {}) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      if (updateHash) history.replaceState(null, '', '#' + tab.dataset.tab);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select(tabs[(next + tabs.length) % tabs.length], { focus: true });
      });
    });
    const fromHash = tabs.find((t) => t.dataset.tab === location.hash.slice(1));
    select(fromHash || tabs[0], { updateHash: false });
  });

  // Optional settings
  fetch('data/site.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((site) => {
      if (!site) return;
      if (site.github) document.querySelectorAll('[data-github]').forEach((a) => { a.href = site.github; a.hidden = false; });
      if (site.snapshot) document.querySelectorAll('[data-snapshot]').forEach((n) => { n.textContent = site.snapshot; });
    })
    .catch(() => {});
})();
