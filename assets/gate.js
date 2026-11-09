/* Password gate for the Evals Market View site.
   A client-side check: it keeps casual visitors out, but it is NOT security. The files stay public,
   and anyone who reads the repository or this page's source can get at the content.
   To change the password, generate a new SALT and HASH (see README, "Password") and bump ?v= on the script tags. */
(() => {
  'use strict';
  const SALT = '67495a7d1ba69745aae00804659a708a';
  const HASH = 'd6c24ab53150c0bba30d60e8e652d15d00f8065ed29928e88cc3444da80584e6';
  const ITER = 310000;
  const KEY = 'evals-view-access';

  const root = document.documentElement;
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked: ask again on the next page */ } };
  if (read() === HASH) return;                          // already unlocked

  root.style.visibility = 'hidden';                     // hide the page before it paints
  let overlay = null;
  const reveal = () => {
    if (overlay) overlay.remove();
    root.style.removeProperty('visibility');
  };
  // an unlock in another tab or in the page around an embedded document reveals this one too
  addEventListener('storage', (e) => { if (e.key === KEY && e.newValue === HASH) reveal(); });

  let framed;
  try { framed = window.self !== window.top; } catch (e) { framed = true; }
  if (framed) return;                                   // an embedded document waits for the page around it

  const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  async function derive(pw) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    const salt = Uint8Array.from(SALT.match(/../g), (h) => parseInt(h, 16));
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, key, 256));
  }

  function build() {
    const css = document.createElement('style');
    css.textContent =
      '#gate{position:fixed;inset:0;z-index:2147483647;visibility:visible;display:grid;place-items:center;padding:24px;' +
      'background:#f8f7f3;color:#1b1d1f;font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:16px;line-height:1.5}' +
      '#gate form{width:min(320px,100%);display:flex;flex-direction:column;gap:12px;text-align:center}' +
      '#gate h1{font-family:inherit;font-weight:300;font-size:30px;line-height:1.2;letter-spacing:-.022em;margin:0 0 8px;color:inherit}' +
      '#gate input{box-sizing:border-box;width:100%;padding:12px 14px;border:1px solid rgba(20,23,25,.28);border-radius:0;background:#fff;color:#1b1d1f;font:inherit}' +
      '#gate button{padding:13px 14px;border:0;border-radius:0;background:#141719;color:#fff;font:inherit;font-weight:500;cursor:pointer}' +
      '#gate button:disabled{opacity:.6;cursor:wait}' +
      '#gate input:focus-visible,#gate button:focus-visible{outline:2px solid #0100f4;outline-offset:2px}' +
      '#gate p{min-height:1.5em;margin:0;font-size:14px;color:#b4421f}' +
      '@media (prefers-color-scheme:dark){#gate{background:#121315;color:#e8e8e4}#gate input{background:#1c1e21;color:#e8e8e4;border-color:rgba(255,255,255,.3)}' +
      '#gate button{background:#e8e8e4;color:#121315}#gate p{color:#f08a6b}#gate input:focus-visible,#gate button:focus-visible{outline-color:#8ea2ff}}';

    overlay = document.createElement('div');
    overlay.id = 'gate';
    const form = document.createElement('form');
    const h1 = document.createElement('h1');
    h1.textContent = 'Password Protected';
    const label = document.createElement('label');
    label.htmlFor = 'gate-pw';
    label.textContent = 'Password';
    label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
    const input = document.createElement('input');
    input.id = 'gate-pw';
    input.type = 'password';
    input.placeholder = 'Enter password...';
    input.autocomplete = 'current-password';
    input.required = true;
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Unlock';
    const msg = document.createElement('p');
    msg.setAttribute('role', 'alert');
    form.append(h1, label, input, button, msg);
    overlay.append(css, form);
    root.append(overlay);
    input.focus();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      if (!window.crypto || !crypto.subtle) { msg.textContent = 'This page needs a secure (https) connection.'; return; }
      button.disabled = true;
      let ok = false;
      try { ok = (await derive(input.value)) === HASH; } catch (err) { msg.textContent = 'Could not check the password.'; }
      button.disabled = false;
      if (ok) { write(HASH); reveal(); return; }
      if (!msg.textContent) msg.textContent = 'Incorrect password.';
      input.select();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
