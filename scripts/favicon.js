// favicon.js - rigenera la favicon di 'I Grandi di Arda'.
//
// PERCHÉ ESISTE: come le icone PWA, la favicon non è un disegno a parte ma IL
// GLIFO DEL FAB, estratto da `index.src.html` (il sorgente: `index.html` è generato). Se il simbolo cambia, la
// favicon si rifà invece di divergere in silenzio. Vive in `scripts/` del repo del
// sito, come `pwaicons.js`: dal 2026-09-27 ogni script di un solo progetto vive nel suo
// repo (prima era in `.memo/scripts/` del repo `Roccobot/roccobot.github.io`).
//
// USO:  NODE_PATH=/opt/node22/lib/node_modules node scripts/favicon.js
//
// ⚠️ Serve `playwright`, che in questo ambiente è già installato globalmente: basta
// indicarlo con NODE_PATH, senza nessun `npm i`. Il browser preinstallato si passa con
// executablePath, perché `chromium.launch()` nudo cerca una build che non c'è.
//
// DUE SCELTE DA NON DISFARE, entrambe volute dall'utente (2026-08-17):
// 1) AREA MASSIMIZZATA: il bbox del glifo sta a filo del riquadro, non al 94%
//    come la prima passata. ⚠️ Il bbox si MISURA col browser e non si assume dai
//    valori nominali del viewBox: qui coincidono (margine morto zero), quindi non
//    c'è niente da ritagliare, e il glifo si scala e basta. Nessun pixel spostato
//    nel canvas: la regola 'icone as-is' resta intatta.
// 2) MASCHERA DI CONTRASTO sull'ALFA, leggera (0,35): su un glifo monocromatico su
//    trasparente è l'alfa a portare la forma, quindi è l'unico canale da
//    irrigidire. Serve solo alle misure raster piccole; l'SVG è vettoriale e il
//    browser lo rasterizza nitido da sé.
const { chromium } = require('playwright');
// Tutti i percorsi qui sotto sono relativi alla radice del repo, qualunque sia la cartella
// da cui si lancia lo script.
process.chdir(require('path').join(__dirname, '..'));
const fs = require('fs');
const HTML = fs.readFileSync('index.src.html', 'utf8');
// ⚠️ Il glifo si legge da `fabPath.setAttribute('d', ...)`: dalla `15.60` il FAB si costruisce
// a nodi e non più da una stringa HTML, e il vecchio pattern (`<path fill="currentColor" d=`)
// non trovava più niente, quindi lo script andava in errore alla prima riga.
const D = HTML.match(/fabPath\.setAttribute\('d', '([^']+)'\)/)[1];

// Non l'oro del FAB (#d2b25c), che sulla barra dei preferiti chiara stava a 1,76:1 e
// quasi svaniva: un gradino sotto, SCELTO A OCCHIO dall'utente fra otto tinte rese a
// dimensione reale sulle sue due barre (#edeeed e #292929), dove misura 2,12:1 su
// chiaro e 5,90:1 su scuro. ⚠️ Sotto il 3:1 su chiaro, ed è deliberato: la finestra
// conforme su entrambe le barre esiste (3,54:1 al massimo, con #b16e22) ma là nessuna
// tinta gli piaceva. Non 'correggerlo' senza chiederglielo.
const COL = '#ce9d3b';
const MISURE = [16, 32, 48];
const AMOUNT = 0.35;

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 400, height: 200 }, deviceScaleFactor: 1 });
  await p.setContent('<!doctype html><meta charset="utf-8"><body>');

  const bb = await p.evaluate((d) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pa = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pa.setAttribute('d', d); s.appendChild(pa); document.body.appendChild(s);
    const r = pa.getBBox(); s.remove();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }, D);

  // l'altezza è il vincolo: il glifo è più alto che largo
  const sc = 16 / bb.h;
  const tx = ((16 - bb.w * sc) / 2 - bb.x * sc).toFixed(4), ty = (-bb.y * sc).toFixed(4);
  // ⚠️ <g transform>, non un <svg> innestato: stessa trappola di pwaicons.js
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">\n'
    + '<g transform="translate(' + tx + ' ' + ty + ') scale(' + sc.toFixed(6) + ')">'
    + '<path fill="' + COL + '" d="' + D + '"/></g></svg>\n';
  fs.writeFileSync('favicon.svg', svg);
  console.log('favicon.svg : glifo ' + (bb.w * sc).toFixed(2) + 'x16 nel riquadro 16x16');

  const png = await p.evaluate(async ({ svg, misure, amount }) => {
    const fatti = {};
    for (const lato of misure) {
      const img = new Image();
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        svg.replace('<svg ', '<svg width="' + lato + '" height="' + lato + '" '));
      await img.decode();
      const cv = document.createElement('canvas'); cv.width = cv.height = lato;
      const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, lato, lato);
      const dati = cx.getImageData(0, 0, lato, lato);
      const n = lato * lato, a = new Float32Array(n), bl = new Float32Array(n);
      for (let i = 0; i < n; i++) a[i] = dati.data[i * 4 + 3];
      // sfocatura gaussiana 3x3, poi alfa + amount * (alfa - sfocato)
      const K = [1, 2, 1, 2, 4, 2, 1, 2, 1];
      for (let y = 0; y < lato; y++) for (let x = 0; x < lato; x++) {
        let s = 0, w = 0, k = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++, k++) {
          const yy = y + dy, xx = x + dx;
          if (yy < 0 || yy >= lato || xx < 0 || xx >= lato) continue;
          s += a[yy * lato + xx] * K[k]; w += K[k];
        }
        bl[y * lato + x] = s / w;
      }
      let tocchi = 0;
      for (let i = 0; i < n; i++) {
        const v = Math.max(0, Math.min(255, Math.round(a[i] + amount * (a[i] - bl[i]))));
        if (v !== dati.data[i * 4 + 3]) tocchi++;
        dati.data[i * 4 + 3] = v;
      }
      cx.putImageData(dati, 0, 0);
      fatti[lato] = { uri: cv.toDataURL('image/png'), tocchi };
    }
    return fatti;
  }, { svg: svg, misure: MISURE, amount: AMOUNT });

  for (const lato of MISURE) {
    const buf = Buffer.from(png[lato].uri.split(',')[1], 'base64');
    fs.writeFileSync('favicon-' + lato + '.png', buf);
    console.log('favicon-' + lato + '  : ' + buf.length + ' B, pixel ritoccati dalla maschera '
      + png[lato].tocchi + '/' + lato * lato);
  }
  await b.close(); process.exit(0);
})();
