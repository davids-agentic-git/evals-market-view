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
    // The tab bar is sticky. After switching tab from further down, go back to where the tabs start, so the new
    // tab opens at its top with the bar just under the header.
    const resetScroll = () => {
      const top = list.parentElement.getBoundingClientRect().top + window.scrollY - document.querySelector('.site-header').offsetHeight;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'instant' });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { select(tab); resetScroll(); });
      tab.addEventListener('keydown', (e) => {
        const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select(tabs[(next + tabs.length) % tabs.length], { focus: true });
        resetScroll();
      });
    });
    // A link to a tab (#framework) or to a section inside one (#dim-security) opens that tab, on load and when
    // the hash changes. Links within the open tab are left to the browser.
    const fromHash = (initial) => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      const owner = target && target.closest('[role="tabpanel"]');
      const block = target && target.closest('details');
      if (block) block.open = true;
      const tab = tabs.find((t) => t.dataset.tab === id)
        || (owner && tabs.find((t) => t.getAttribute('aria-controls') === owner.id));
      if (!tab) { if (initial) select(tabs[0], { updateHash: false }); return; }
      if (!initial && tab.getAttribute('aria-selected') === 'true') return;
      select(tab, { updateHash: false });
      if (owner) target.scrollIntoView({ behavior: 'instant' });
      else if (!initial) resetScroll();
    };
    fromHash(true);
    window.addEventListener('hashchange', () => fromHash(false));
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
