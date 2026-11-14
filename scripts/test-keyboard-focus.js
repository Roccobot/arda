// Keyboard focus bench for the twin sites ('I Grandi di Arda', 'I Grandi di Terramare').
// Rule: Roccobot.md, section 'La navigazione con la tastiera non si vede' (owner's choices
// Tastiera-01, Accessibilità-01, Ambito-01): a control reached with Tab shows NO ring
// (no outline, no focus box-shadow), and it changes like on mouse hover, so it is still
// recognisable (WCAG 2.4.7).
//
// The bench presses REAL Tab keys through the page, the Panel, the site search, the
// character modal and the 'Risorse e note' modal, and for every focused element:
//   1. no outline drawn while focused (on the element and on its neighbours: the Panel
//      checkbox draws its sign on the next sibling);
//   2. no box-shadow that appears only with the focus (reported, a ring drawn with
//      box-shadow is still a ring);
//   3. with every outline suppressed, the focused element differs on the PIXELS from the
//      same element at rest (blurred). Text inputs are exempt: the caret is the sign.
// Scrollable containers that Chrome puts in the Tab order are checked for the ring only.
//
// USE: serve the folder that contains the site folder over HTTP (real fonts), then
//   PROVA_URL=http://127.0.0.1:8770/arda/index.html NODE_PATH=/opt/node22/lib/node_modules node test-keyboard-focus.js
// Optional: PROVA_SHOTS=<dir> saves the Panel screenshots (DPR 2) with a focused
// checkbox and a focused legend row.
// Author: Rocco Casadei, a.k.a. Roccobot

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = process.env.PROVA_URL || 'http://127.0.0.1:8770/arda/index.html';
const SHOTS = process.env.PROVA_SHOTS || '';
const WIDTHS = [1280, 390];
const THEMES = ['dark', 'light'];

let failed = 0;
const lines = [];
function report(ok, text) {
  if (!ok) failed++;
  lines.push(`${ok ? 'OK     ' : 'FALLITO'}  ${text}`);
}

// Read the focused element and its neighbours: outline and box-shadow, plus the box
// used for the pixel comparison.
function readState() {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  const pick = (e) => {
    if (!e || e.nodeType !== 1) return null;
    const cs = getComputedStyle(e);
    const ow = parseFloat(cs.outlineWidth) || 0;
    const oc = cs.outlineColor;
    const transparent = /rgba\([^)]*,\s*0\)$/.test(oc) || oc === 'transparent';
    return {
      outline: cs.outlineStyle !== 'none' && ow > 0 && !transparent ? `${cs.outlineStyle} ${cs.outlineWidth} ${oc}` : '',
      shadow: cs.boxShadow,
    };
  };
  const group = [el, el.nextElementSibling, el.previousElementSibling, el.parentElement,
    el.parentElement && el.parentElement.parentElement, ...Array.from(el.children).slice(0, 4)];
  let box = el.getBoundingClientRect();
  let host = el;
  if (box.width < 4 || box.height < 4) {
    host = el.closest('label') || el.parentElement;
    box = host.getBoundingClientRect();
  }
  // Covered by another layer (the Panel's sheet over the FAB on a phone): no style can be
  // seen there, and the bench says so apart.
  const top = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
  const covered = !!top && !host.contains(top) && !top.contains(host)
    && box.y >= 0 && box.y + box.height <= innerHeight;
  const tag = el.tagName.toLowerCase();
  const type = (el.getAttribute('type') || '').toLowerCase();
  const textual = tag === 'textarea' || (tag === 'input' && !['checkbox', 'radio', 'range', 'button', 'submit', 'color'].includes(type));
  const cs = getComputedStyle(el);
  const scroller = !['button', 'a', 'input', 'select', 'textarea', 'summary'].includes(tag)
    && !el.hasAttribute('role') && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
    && /(auto|scroll)/.test(cs.overflowY + cs.overflowX);
  // Ids numbered per entry (the admin editor fields) would make every field a new kind.
  const sig = tag + (el.id && !/\d|^sf-/.test(el.id) ? '#' + el.id : '') + (el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\s+/).filter((c) => !/^(cc-|type-|on$|leg-disabled|rk-in)/.test(c)).slice(0, 3).join('.') : '')
    + (type ? `[${type}]` : '');
  return {
    sig, textual, scroller, fv: el.matches(':focus-visible'),
    covered: covered ? (top.tagName.toLowerCase() + (top.id ? '#' + top.id : '') + (typeof top.className === 'string' && top.className ? '.' + top.className.split(' ')[0] : '')) : '',
    group: group.map(pick),
    box: { x: box.x, y: box.y, w: box.width, h: box.height },
    label: (el.getAttribute('aria-label') || el.textContent || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 40),
  };
}

async function decode(cmp, buf) {
  return cmp.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    return Array.from(g.getImageData(0, 0, c.width, c.height).data);
  }, buf.toString('base64'));
}

function diffCount(a, b) {
  if (a.length !== b.length) return Infinity;
  let n = 0;
  for (let i = 0; i < a.length; i += 4) {
    const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
    if (d > 2) n++;
  }
  return n;
}

async function measure(page, cmp, scenario, seen, ctxName) {
  const st = await page.evaluate(readState);
  if (!st) return;
  const key = scenario + '|' + st.sig;
  if (seen.has(key)) return;
  seen.add(key);
  const vp = page.viewportSize();
  const pad = 4;
  const clip = {
    x: Math.max(0, st.box.x - pad), y: Math.max(0, st.box.y - pad),
  };
  clip.width = Math.min(vp.width - clip.x, st.box.w + 2 * pad);
  clip.height = Math.min(vp.height - clip.y, st.box.h + 2 * pad);
  const visible = clip.width > 2 && clip.height > 2 && st.box.y + st.box.h > 0 && st.box.y < vp.height;
  // Pixels with every outline suppressed: a ring must not count as the visible change.
  await page.evaluate(() => {
    const s = document.createElement('style');
    s.id = 'prova-no-outline';
    s.textContent = '*,*::before,*::after{outline:none!important}';
    document.head.appendChild(s);
  });
  let focusedPx = null, restPx = null;
  if (visible) focusedPx = await decode(cmp, await page.screenshot({ clip }));
  const rest = await page.evaluate(() => {
    const el = document.activeElement;
    window.__provaEl = el;
    el.blur();
    return true;
  });
  await page.waitForTimeout(40);
  const restState = await page.evaluate(() => {
    const el = window.__provaEl;
    const pick = (e) => {
      if (!e || e.nodeType !== 1) return null;
      const cs = getComputedStyle(e);
      return { shadow: cs.boxShadow };
    };
    return [el, el.nextElementSibling, el.previousElementSibling, el.parentElement,
      el.parentElement && el.parentElement.parentElement, ...Array.from(el.children).slice(0, 4)].map(pick);
  });
  if (visible) restPx = await decode(cmp, await page.screenshot({ clip }));
  await page.evaluate(() => {
    document.getElementById('prova-no-outline').remove();
    window.__provaEl.focus({ preventScroll: true });
  });
  await page.waitForTimeout(30);
  void rest;

  const ring = st.group.map((g) => g && g.outline).filter(Boolean);
  const shadowAdded = st.group.map((g, i) => g && restState[i] && g.shadow !== restState[i].shadow
    ? g.shadow : '').filter(Boolean);
  const diff = visible ? diffCount(focusedPx, restPx) : -1;
  const where = `${ctxName} ${scenario}: ${st.sig} '${st.label}'${st.fv ? '' : ' (senza :focus-visible)'}`;
  report(ring.length === 0, `${where} nessun anello${ring.length ? ' -> ' + ring.join(' | ') : ''}`);
  if (shadowAdded.length) report(false, `${where} ombra comparsa col fuoco -> ${shadowAdded.join(' | ')}`);
  if (st.textual) {
    lines.push(`nota     ${where} campo di testo: il segno è il caret`);
  } else if (st.scroller) {
    lines.push(`nota     ${where} contenitore che scorre (pixel cambiati: ${diff})`);
  } else if (st.covered && diff < 12) {
    lines.push(`nota     ${where} coperto da ${st.covered}: il fuoco finisce sotto un altro strato (pixel cambiati: ${diff})`);
  } else if (!visible) {
    lines.push(`nota     ${where} fuori schermo, pixel non confrontati`);
  } else {
    report(diff >= 12, `${where} cambia al fuoco come al passaggio del mouse (pixel diversi: ${diff})`);
  }
}

async function tabs(page, cmp, scenario, seen, ctxName, n, shift) {
  for (let i = 0; i < n; i++) {
    await page.keyboard.press(shift ? 'Shift+Tab' : 'Tab');
    // The focus scrolls the page smoothly: measure once it has stopped.
    for (let k = 0, last = -1; k < 40; k++) {
      const y = await page.evaluate(() => window.scrollY + ':' + (document.querySelector('.dyn-modal, .fab-modal-overlay, .admin-overlay') || document.documentElement).scrollTop);
      if (y === last) break;
      last = y;
      await page.waitForTimeout(60);
    }
    await measure(page, cmp, scenario, seen, ctxName);
  }
}

async function neutralMouse(page) {
  const vp = page.viewportSize();
  await page.mouse.move(Math.round(vp.width / 2), 2);
}

// Close every modal the way a keyboard user does, then drop the focus.
async function closeAll(page) {
  const isOpen = () => page.evaluate(() => anyModalOpen() || !!document.querySelector('#site-search, .admin-overlay'));
  for (let i = 0; i < 4 && await isOpen(); i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
  }
  // The admin text editor closes from its 'Indietro' button only.
  await page.evaluate(() => {
    const o = document.querySelector('.admin-overlay');
    if (o) { o.remove(); document.documentElement.classList.remove('admin-open'); }
  });
  if (await isOpen()) report(false, 'una modale non si chiude con Esc');
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
  await page.waitForTimeout(150);
}

async function panelShot(page, file) {
  if (!SHOTS) return;
  const box = await page.locator('#ctrl-panel').boundingBox();
  if (box) await page.screenshot({ path: path.join(SHOTS, file), clip: box });
}

(async () => {
  const browser = await chromium.launch();
  const cmpCtx = await browser.newContext();
  const cmp = await cmpCtx.newPage();
  for (const width of WIDTHS) {
    for (const theme of THEMES) {
      const ctxName = `${width}px ${theme === 'dark' ? 'scuro' : 'chiaro'}`;
      const seen = new Set();
      const ctx = await browser.newContext({
        viewport: { width, height: width > 500 ? 900 : 844 }, deviceScaleFactor: SHOTS ? 2 : 1,
        colorScheme: theme, locale: 'it-IT', reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      await page.goto(URL, { waitUntil: 'load' });
      await page.waitForSelector('#rank-list .rank-item');
      await page.evaluate(() => document.fonts.ready);
      const cur = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'dark');
      if (cur !== theme) { await page.keyboard.press('t'); await page.waitForTimeout(200); }
      await page.addStyleTag({ content: '*,*::before,*::after{transition-duration:0s!important;transition-delay:0s!important}' });
      await neutralMouse(page);

      // A. the page: forwards from the top, then backwards from the end.
      await tabs(page, cmp, 'pagina', seen, ctxName, 30, false);
      await page.evaluate(() => { document.activeElement && document.activeElement.blur(); });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await tabs(page, cmp, 'pagina (fondo)', seen, ctxName, 10, true);
      await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      await page.waitForTimeout(300);

      // B. the Panel, opened with its key.
      await page.keyboard.press('p');
      await page.waitForTimeout(450);
      await tabs(page, cmp, 'Pannello', seen, ctxName, 60, false);
      if (SHOTS && width === 1280) {
        const tag = theme === 'dark' ? 'scuro' : 'chiaro';
        await page.evaluate(() => document.querySelector('.ctrl-row input').focus());
        await page.waitForTimeout(60);
        await panelShot(page, `pannello-casella-${tag}.png`);
        await page.evaluate(() => document.querySelector('.ctrl-legend-row').focus());
        await page.waitForTimeout(60);
        await panelShot(page, `pannello-legenda-${tag}.png`);
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(450);
      if (await page.locator('#ctrl-panel.open').count()) { await page.keyboard.press('p'); await page.waitForTimeout(450); }

      // C. the site search, from the long press on the FAB (mouse).
      const fab = await page.locator('#ctrl-fab').boundingBox();
      await page.mouse.move(fab.x + fab.width / 2, fab.y + fab.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(850);
      await page.mouse.up();
      await neutralMouse(page);
      await page.waitForTimeout(500);
      if (await page.locator('#site-search').count()) {
        await page.keyboard.type('Fin');
        await page.waitForTimeout(200);
        await measure(page, cmp, 'ricerca', seen, ctxName);
        await tabs(page, cmp, 'ricerca', seen, ctxName, 6, false);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
      } else {
        report(false, `${ctxName}: la ricerca non si apre col tocco lungo`);
      }

      // D. the character modal, opened from a card name with Enter (the name is the
      // card's tab stop).
      await page.evaluate(() => { window.scrollTo(0, 0); document.querySelector('#rank-list .rank-name-text').focus(); });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      await measure(page, cmp, 'scheda', seen, ctxName);
      await tabs(page, cmp, 'scheda', seen, ctxName, 14, false);
      await closeAll(page);

      // E. 'Risorse e note', from the footer link, then the last note (an editorial one).
      const openResources = async () => {
        await page.evaluate(() => document.querySelector('#res-link').focus());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
      };
      await openResources();
      await tabs(page, cmp, 'risorse e note', seen, ctxName, 20, false);
      if (await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('.dyn-modal .fab-modal-confirm')).filter((x) => x.offsetParent);
        if (b.length) b[b.length - 1].focus();
        return b.length > 0;
      })) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(600);
        await tabs(page, cmp, 'nota', seen, ctxName, 12, false);
      }
      await closeAll(page);

      // F. the map viewer, from the first resource.
      await openResources();
      if (await page.evaluate(() => {
        const b = Array.from(document.querySelectorAll('.dyn-modal .fab-modal-confirm')).filter((x) => x.offsetParent);
        if (b.length) b[0].focus();
        return b.length > 0;
      })) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(700);
        await tabs(page, cmp, 'visualizzatore', seen, ctxName, 8, false);
      }
      await closeAll(page);

      // G. the admin area. The Worker cannot be reached from the bench, so the bench
      // loads admin.js and marks the session unlocked, as a successful password does.
      if (width === 1280) {
        await page.evaluate(() => new Promise((ok) => caricaAdmin(ok)));
        await page.evaluate(() => showPasswordModal('Prova', function () {}));
        await page.waitForTimeout(400);
        await measure(page, cmp, 'admin: parola d\'ordine', seen, ctxName);
        await tabs(page, cmp, 'admin: parola d\'ordine', seen, ctxName, 4, false);
        await closeAll(page);
        await page.evaluate(() => { saveUnlocked = true; showAdminChoiceModal(); });
        await page.waitForTimeout(400);
        await tabs(page, cmp, 'admin: bivio', seen, ctxName, 8, false);
        await closeAll(page);
        for (const fn of ['showAdminEditor', 'showSiteFlagsEditor', 'showColorEditor', 'showBadgeAdjustEditor', 'showColorStats']) {
          await page.evaluate((f) => window[f](), fn);
          await page.waitForTimeout(700);
          await tabs(page, cmp, 'admin: ' + fn, seen, ctxName, 70, false);
          // The Console's sub-modal of an effect, from its gear.
          if (fn === 'showSiteFlagsEditor' && await page.evaluate(() => {
            const g = document.querySelector('.fx-gear');
            if (g) g.focus();
            return !!g;
          })) {
            await page.keyboard.press('Enter');
            await page.waitForTimeout(700);
            await tabs(page, cmp, 'admin: Console, effetto', seen, ctxName, 70, false);
          }
          await closeAll(page);
        }
      }

      report(errors.length === 0, `${ctxName}: nessun errore JS in pagina${errors.length ? ' -> ' + errors.join(' | ') : ''}`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(lines.join('\n'));
  console.log(failed ? `\n${failed} prove fallite` : '\nTutte le prove passate');
  process.exit(failed ? 1 : 0);
})();
