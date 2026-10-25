# Removed.md: le cose tolte da 'I Grandi di Arda', e come si recuperano

> **Cos'è questo file.** L'archivio di quello che è uscito dal sito: per ogni cosa tolta, che cosa
> faceva, quando è stata spenta e tolta, e da quale commit si recupera. Si legge su richiesta,
> quando qualcuno vuole riportare indietro una cosa o capire dove viveva.
> ⚠️ **Nei file di regole resta solo la decisione** (che la cosa non c'è più, e perché): ogni
> appunto su come recuperarla vive qui, corto o lungo che sia (regola universale in
> `rules/Roccobot.md` di `Roccobot/tools`, § '🗄️ Le cose tolte vivono in Removed.md').
> Il repo non ha tag: il rimando va al commit del ramo `main` che ha tolto la cosa, e la versione
> che la conteneva ancora è il suo genitore (`<commit>^`). Fino alla `15.70` il sito era la
> cartella `top/` del repo dell'hub, e i percorsi dei commit di allora cominciano con `top/`.
> Le voci vanno dalla più recente alla più vecchia.

## 🔤 I sei file di `Cinzel Decorative`

- **Che cosa facevano**: erano il carattere `Cinzel Decorative` (pesi 400, 700 e 900, sottoinsiemi
  latin e latin-ext), quello degli svolazzi sulle maiuscole, che oggi è uscito dalla pagina a
  favore di `Cinzel` (`Rules.md` § '🔤 I caratteri sono in casa, e sono due famiglie').
- **Spenti dalla `15.73`**, quando nessuna pagina li chiedeva più (scelta A2 dell'utente,
  2026-10-04), **tolti dal repo con la `15.85`** (2026-10-04).
- **Si recupera dal commit `c9c2964`** del ramo `main`, che li ha tolti. Dove vivevano: nella
  cartella `fonts/`, coi nomi `CinzelDecorative-400-latin.woff2`,
  `CinzelDecorative-400-latin-ext.woff2`, `CinzelDecorative-700-latin.woff2`,
  `CinzelDecorative-700-latin-ext.woff2`, `CinzelDecorative-900-latin.woff2` e
  `CinzelDecorative-900-latin-ext.woff2`.
- Il comando che riporta un file com'era: `git show c9c2964^:fonts/CinzelDecorative-400-latin.woff2 > CinzelDecorative-400-latin.woff2`.

## 🌐 Google Fonts, e le misure fatte senza i caratteri veri

- **Che cosa faceva**: fino alla `15.72` la pagina chiedeva i caratteri al foglio di Google Fonts
  (`Cinzel Decorative`, `Cinzel` ed `EB Garamond`, con un `preconnect` a `fonts.googleapis.com`).
  Nell'ambiente Claude Code le webfont NON si caricavano da sole: il foglio di Google Fonts risponde
  `ERR_CONNECTION_RESET` al browser di test, che non passa dal proxy come `curl`. Il browser
  ripiegava su **Georgia**, e ogni misura di larghezza, a-capo o altezza di riga era **di un altro
  font**.
- **Tolto nella `15.73`** (2026-10-04), quando i caratteri sono entrati in `fonts/`: il foglio
  bloccava il primo disegno sul telefono dell'utente per più di un secondo (`Rules.md` § '🔤 I
  caratteri sono in casa, e sono due famiglie').
- **Si recupera dal commit `d44b3d5`** del ramo `main`. Dove viveva: i due `<link>` in testa a
  `index.src.html`.
- ⚠️ **Una copia di confronto fino alla `15.72` chiede ancora Google Fonts**: si serve con
  `.memo/scripts/realfont.js` dell'hub, che dirotta il foglio sui file locali, e la spia attesa sulle
  versioni di allora la dice il commento in testa allo script (`Rules.md` § '🔬 Misure tipografiche:
  servire i font REALI ai test').
- Il comando che mostra la pagina di allora: `git show d44b3d5^:index.src.html`.

## 🗺️ Il campo `paese`

- **Che cosa faceva**: niente, in questo sito. Valeva `gb` su tutte le 360 voci e nessun codice lo
  leggeva (zero occorrenze nella pagina e nel Worker). Veniva dalla pagina `legion50`, capostipite
  del motore: là `paese` era un codice ISO che pescava una bandiera.
- **Tolto nella `15.12`** (2026-08-23), su richiesta dell'utente: era uniforme su tutte le voci, e
  nessuno lo leggeva.
- **La prova di allora**: per `paese` è stato verificato prima, e dopo si è rifatta la prova:
  stesso numero di voci, e l'unica chiave di differenza era quella tolta.
- **Si recupera dal commit `0b43b02`** del ramo `main`. Dove viveva: una chiave di ogni voce di
  `dati.js`, che allora era nella cartella `top/` (il percorso di allora è nel comando qui sotto).
- Il comando che mostra i dati di allora: `git show 0b43b02^:top/dati.js`.

## 📲 La variante oro su blu dell'icona dell'app

- **Che cosa faceva**: era l'icona dell'app installata per il tema scuro, oro su blu, con la sua
  versione maskable, accanto a quella del tema chiaro.
- **Tolta nella `15.04`** (2026-08-14): con lo splash turchese nei due temi, la questione delle due
  icone per tema era decaduta.
- **Si rifà col generatore** (`scripts/pwaicons.js`) cambiando due valori, oppure **si recupera dal
  commit `be78ecd`** del ramo `main`. Dove viveva: nella cartella `top/pwa/`, coi nomi
  `app-dark.svg`, `app-dark-192.png`, `app-dark-512.png`, `app-dark-maskable.svg`,
  `app-dark-maskable-192.png` e `app-dark-maskable-512.png`.
- Il comando che mostra il disegno di allora: `git show be78ecd^:top/pwa/app-dark.svg`.

## 🌫️ L'effetto `fade`, i bordi della lista in dissolvenza

- **Che cosa faceva**: era uno degli effetti della Console (allora il pannello 'Feature flag'),
  `Bordi lista in dissolvenza` / `Fading list edges`: con la classe `fx-fade` su `<html>` la lista
  sfumava per 26px in cima e in fondo, con una `mask-image` a gradiente su `#rank-list`, invece di
  troncarsi.
- **Nato nella `v12.24`** (2026-07-25, commit `aedd15d`) coi primi effetti grafici, **tolto nella
  `v12.39`** (2026-07-25), sostituito dal riflettore (`spot`) su richiesta dell'utente. Nei dati
  salvati era già spento (`"fade":false`).
- **Si recupera dal commit `cb11715`** del ramo `main`. Dove viveva: in `top/index.html`, la regola
  `html.fx-fade #rank-list`, le voci `fade` di `SITE_FLAGS_DEFAULT` e di `SITE_FLAG_CLASS`, e la sua
  riga nell'elenco degli effetti del pannello; nei dati, la chiave `fade` di `siteFlags` in
  `dati.js`, che allora era nella cartella `top/`.
- ⚠️ **Il nome è stato riusato**: dalla `v14.43` `fade` è una manopola della trama (`pat`), che non
  ha niente a che fare con questo effetto.
- Il comando che mostra la pagina di allora: `git show cb11715^:top/index.html`.

## 🏅 L'icona del badge della morte in battaglia

- **Che cosa faceva**: era l'icona del badge proposto 'morì in battaglia', caricata dall'utente il
  2026-07-04 (commit `7f3b51c`).
- **Tolta nella `v3.93`** (2026-07-04), insieme al badge, bocciato: circa 70 portatori su 306,
  troppo diffuso per un badge 'eccezionale' (`Rules.md` § '🏅 Criteri editoriali dei badge').
- **Si recupera dal commit `4f45780`** del ramo `main`. Dove viveva: `top/icons/Morte.png`.
- ⚠️ **Il nome `Morte` è stato riusato**: dalla `v6.84` (2026-07-13) è l'icona del badge
  `suicidio`, oggi `icons/Morte.webp`. L'icona tolta si prende solo da un commit anteriore.
- Il comando che la riporta com'era: `git show 4f45780^:top/icons/Morte.png > Morte.png`.
