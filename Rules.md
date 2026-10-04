# Rules.md: 'I Grandi di Arda' (repo `Roccobot/arda`)

> **Cos'è questo file.** Il testo completo delle regole del progetto **'I Grandi di Arda'**
> (<https://roccobot.github.io/arda/>): aspetto, struttura dei dati, canone, badge, asset e note.
> Vale per **tutti gli agenti**: il nucleo, cioè ogni regola in una riga, vive in `AGENTS.md`, e
> questo file ne dà il perché. Claude Code lo carica da sé, perché `CLAUDE.md` lo importa.
> ⚠️ **Fino al 2026-09-27 questo testo era il `CLAUDE.md` del repo**: una nota che nomina il
> `CLAUDE.md` del repo `Roccobot/arda` per una di queste sezioni parla di questo file.
> Le regole **trasversali** (avvio, priorità, non derogabili, lingua, git e go-live) vivono nel
> `Rules.md` dell'hub `Roccobot/roccobot.github.io`, che questo file non sostituisce.
> ⚠️ **Dalla `15.70` il sito vive in un repo suo, ramo `main`, coi file alla radice**: il prefisso
> `arda/top/` di testi e commit vecchi è di quando era una cartella dell'hub. `res/` ha conservato i
> suoi indirizzi, e in `top/` resta una paginetta che rimanda al nuovo indirizzo conservando
> parametri e ancora, per i link salvati e le app installate: non si toglie.

## ⚠️⚠️⚠️ SI MODIFICANO `index.src.html` E `admin.src.js`: `index.html` E `admin.js` SONO GENERATI

Dalla `15.64`. Il sorgente commentato è **`index.src.html`**, il codice dell'amministrazione vive in
**`admin.src.js`**; `index.html` e `admin.js` li genera l'Action `.github/workflows/arda-minify.yml`
(con `.github/scripts/minify.mjs .`) a ogni push su `main` che tocca i sorgenti, e li committa
`github-actions[bot]`. Il perché è il peso: i commenti erano una parte grossa del codice servito.

- ⚠️⚠️ **In tutto questo file 'index.html' vuol dire il SORGENTE**, e i numeri di riga citati
  valgono in `index.src.html`. Una modifica fatta sul generato la cancella il build successivo.
- **Il badge di ripiego si scrive nel sorgente**, e `datiVersion` resta in `dati.js`: il bump tocca
  `index.src.html` e `dati.js`, e `index.html` lo segue da sé. Leggono il sorgente anche il controllo
  del badge (`.memo/scripts/hooks.py` dell'hub), `scripts/favicon.js` e `scripts/pwaicons.js`.
- ⚠️⚠️ **Il codice admin si scarica al PRIMO INGRESSO**: nel sorgente resta il segnaposto
  `openAdminGate`, che con `caricaAdmin` carica `admin.js` una volta sola. Una funzione nuova
  dell'amministrazione va in `admin.src.js`; se il codice pubblico ne chiamasse direttamente
  un'altra, serve un secondo segnaposto. Le variabili che fotografano la configurazione al
  caricamento (`*_SAVED`) restano nel sorgente principale.
  - ⚠️ **L'area admin si prova sulla pagina GENERATA**: il sorgente carica comunque `admin.js`,
    quindi un banco su `index.src.html` guarda il codice admin vecchio.
- **In locale** si genera con `node .github/scripts/minify.mjs .` dalla radice (con esbuild), e si
  serve la cartella come sempre.
- ⚠️⚠️ **Dalla `15.72` il generato carica gli script DIFFERITI, e lo script principale vive in
  `app.js`** (caricamento progressivo, priorità dell'utente del 2026-10-04). Nel sorgente lo
  script principale resta in linea dopo `<script src="dati.js">` sincrono, e il parser si fermava
  su 616 KB di dati prima di disegnare qualcosa: nel generato `dati.js` ha `defer` e lo script
  principale esce in `app.js`, anch'esso `defer`, con la versione del sito nell'indirizzo
  (`app.js?v=15.72`, letta dal badge del sorgente), così un `index.html` nuovo non gira mai con un
  `app.js` vecchio preso dalla cache. L'Action committa anche `app.js`.
  - ⚠️ **`app.js` è uno script classico, non un modulo**: funzioni e `let` di primo livello restano
    globali, come li aspettano `admin.js` e i gestori nel markup. Il sorgente aperto da sé funziona
    uguale, perché i suoi script sono già in fondo al body.
  - ⚠️ **`dati.js` non prende il `?v=`**: lo riscrive il Worker a ogni salvataggio, quando il
    minificatore non gira, e il flusso dati non si tocca.
  - ⚠️ **Il minificatore riconosce lo script principale come il più lungo di quelli in linea**
    (sopra i 50.000 caratteri) e si ferma con errore se non lo trova: chi aggiunge un secondo
    script in linea grande guardi quel criterio.

## ↕️ Anti-jitter al cambio lingua

Decisione dell'utente: l'anti-jitter **verticale** al cambio lingua c'è anche qui, perché passa
spesso da una lingua all'altra e non vuole che gli oggetti si muovano. Il meccanismo viene da
Terramare, e le sue trappole generali vivono in `earthsea/Rules.md`, § 'L'ANTI-JITTER, e perché una
misura sola diceva zero mentre l'occhio vedeva muoversi'; qui restano quelle di questo sito.

- ⚠️⚠️ **SOLO VERTICALE: NELLE CARD NESSUNA RISERVA ORIZZONTALE** (decisione dell'utente). Etichette
  e nome sono larghi quanto il **loro** testo, e passando da 'Uomo' a 'Man' la pastiglia si
  restringe.
  - ⚠️ **Misura scartata: la gemella IMPILATA della `15.67`**, cioè testo visibile e altra lingua
    nella stessa cella di griglia, che prendeva la misura maggiore anche in **larghezza**: etichette
    inglesi larghe quanto le italiane col vuoto dentro, e un buco fra il nome e le etichette che
    `freeNames` non chiudeva sempre.
  - ⚠️⚠️ **E per il COSTO**: col DOM quasi doppio trascinare il bordo della finestra costava circa
    cinque volte la `15.66`, con tre misure complete dopo ogni ridimensionamento, e l'utente l'ha
    bocciata per la lentezza. **Vincolo**: il trascinamento costa come la `15.66`, e la misura parte
    **una volta**, a larghezza ferma.
- **Com'è fatto**: ogni testo che diverge (nome, etichette, pill 'Solo HoME', `.rank-desc`,
  `.rank-subtitle`, `.rank-title`) contiene la `.gemella` dell'altra lingua in `display:none`, quindi
  la pagina si dispone come la `15.66`. `misuraCard`, dentro una funzione sincrona, mette
  `.lingua-altra` sulle card e misura anche l'altra lingua; poi:
  1. ogni lingua prende le **sue** decisioni (`name-tight`, a capo bipartito, `apo-wrap`), e quelle
     della lingua che non si vede aspettano col suffisso `-m`;
  2. ⚠️⚠️ **SE UNA LINGUA VA A CAPO, CI VA ANCHE L'ALTRA**, anche senza bisogno (regola
     dell'utente): nella riga del nome la più corta manda a capo le etichette (`nm-giu`) o le icone
     (`nm-giu-f`, solo desktop) nello stesso punto della più lunga; in una riga bipartita va a capo
     sul `|`;
  3. quello che resta diverso lo pareggia un **`min-height`** sulla riga, pari alla maggiore delle
     due, anche per i centesimi: sotto il mezzo pixel una card non si vede muovere, ma la somma
     degli scarti sposta il fondo della lista.
- ⚠️⚠️ **La cache delle misure (livello 1, approvata dall'utente)**: la misura decide già per le due
  lingue, quindi il cambio lingua riapplica classi e altezze coi ruoli scambiati, senza misurare. Una
  **verifica** rifà le misure vere a blocchi di 20 card quando il browser è libero, e
  `window.__verificaCache` deve valere zero.
- **Criterio di accettazione**: nessuna card cambia altezza al cambio lingua, a nessuna larghezza,
  anche dopo un ridimensionamento, nel tema chiaro e in Modalità XL; nessuna riga finisce col `|`;
  etichette, frecce, icone e simbolo di genere restano alla quota della `15.66`.
  - ⚠️ **Il metro di confronto è il caricamento diretto nella lingua**: la `15.66`, dopo un cambio
    lingua, teneva in qualche card il `name-tight` della lingua di prima.
- ⚠️⚠️ **Le misure si scrivono in PX DI LAYOUT (`zoomDi`)**: `getBoundingClientRect` li dà
  moltiplicati per lo zoom della Modalità XL, e un'altezza scritta così vale 1,3 volte il vero. Per
  la stessa ragione `reflowRows` ripareggia anche il **titolone** dopo il tasto `Z`.
- **Tre trappole di questo sito**:
  1. **La gemella di un'etichetta fa lo STESSO ripiego della faccia**: dove `tipo_label` ha meno
     segmenti del tipo, il segmento mancante lo dà il tipo, o la seconda etichetta resta senza
     gemella.
  2. **Le immagini appena create sono larghe ZERO**, anche in cache, finché il browser non le
     decodifica: servono gli attributi `width` e `height` di `ICON_DIM`, e i **file** delle icone
     non si toccano.
  3. **Il clone di `riservaTesta` tiene l'id**, al contrario di Terramare: `#footer-text` ha un corpo
     suo nel blocco mobile, e senza id il clone misurava un'altezza falsa.
- ⚠️ **Sul telefono la lingua si cambia DAL PANNELLO**, quindi anche lui resta fermo: la nota in
  fondo ha la sua gemella impilata. ⚠️ Il Pannello usa ancora `.bil`, la griglia: là la riserva
  orizzontale è voluta, e le card non usano più quella classe.
- ⚠️⚠️ **Dalla `15.72` la misura gira A LOTTI, un fotogramma per volta** (richiesta dell'utente
  del 2026-10-04: *considero di primaria importanza il caricamento progressivo*): `reflowRows`
  ordina le card con `perVista` (prima quelle in vista, poi le altre per distanza dallo schermo)
  e `inLotti` passa a `misuraCard` il primo lotto in modo sincrono (`LOTTO_PRIMO`, dodici) e gli
  altri (`LOTTO`, sedici) con `requestAnimationFrame`. È lecito per la stessa ragione della
  verifica in ozio: le card dipendono dalla sola larghezza della lista, non l'una dall'altra.
  - ⚠️ **`_reflowChiave` resta vuota finché l'ultimo lotto non è passato**: un ridimensionamento o
    `fonts.ready` arrivati a metà rifanno tutto, e la fotografia del cambio lingua si scarta da sé.
  - ⚠️ **`reflowRows()` non è più sincrona sulle card fuori vista**: un banco che misura subito
    dopo vede assestate le sole card in vista, e aspetta (il banco di certificazione aspetta 1,2 s
    per larghezza). L'animazione di comparsa è delle sole dodici card del primo lotto (`.rk-in`).
  - Il perché per esteso, e le misure di partenza, vivono in `earthsea/Rules.md` § 'La misura gira A
    LOTTI, e le card in vista vengono prima': il meccanismo è lo stesso sui due siti.
- **Costo dichiarato e accettato**: la misura completa dopo un ridimensionamento costa circa due
  volte e mezzo la `15.66`, perché misura due lingue; il cambio lingua costa come la `15.66`, grazie
  alla cache.
- **Che cosa si muove ancora, ed è dichiarato**: in orizzontale tutto quello che cambia larghezza
  con la lingua (scelta dell'utente); sopra i 900px la nota con l'asterisco resta ferma solo perché
  il sottotitolo va a capo nello stesso punto nelle due lingue; a 320px la citazione del footer va a
  capo in un altro punto, dentro un blocco fermo.

## 🧩 `innerHTML`: non ne resta NESSUNO

Zero `innerHTML` e zero `insertAdjacentHTML` nei due sorgenti, contati con l'AST (istruzione
dell'utente: *converti tutto*). Gli strumenti vivono accanto a `svgNodo`, uno per **provenienza**
del testo:

| strumento | per che cosa | perché è sicuro |
|---|---|---|
| **`nodo(tag, attributi, ...figli)`** | tutto ciò che contiene DATI: la lista, la scheda, l'area admin | una stringa figlia diventa un nodo di testo, per costruzione |
| **`htmlCostante(markup)`** | le COSTANTI del codice: icone di `BADGE_ICON` e `GENDER_ICON`, righe di `i18n`, note, Pannello | è `svgNodo` per l'HTML, e ci passa solo il sorgente |
| **`nodiRistretti(markup)`** | le due convenzioni di testo del dataset: il vero nome in grassetto, `<br>`/`<em>`/`**` della descrizione | conosce solo quei tre tag e le entità di `escapeHtml`, il resto resta testo |

- ⚠️⚠️ **Il Pannello passa da `htmlCostante` perché è fatto di sole costanti e stati** (filtri,
  badge, conteggi). L'unico testo che viene da fuori è la **versione**, da `dati.js`: le due caselle
  nascono vuote e `riempiPannello` ci scrive il numero come testo. Un testo del dataset aggiunto al
  Pannello si scrive allo stesso modo, mai nel markup.
- ⚠️⚠️ **Il corpo di una nota passa dal parser coi marcatori `#{Nome}#` ANCORA TESTO**, e
  `renderNoteBody` li sostituisce dopo, dentro i nodi di testo: indice della voce e tinta della sua
  famiglia, che vengono da `dati.js`, diventano attributi e mai markup.
- ⚠️ **`replaceChildren` scrive `null` come testo**, mentre `nodo` e `appendiA` lo saltano.
- ⚠️ **`bilingue` riceve una funzione e una CHIAVE per lingua**, non i nodi già fatti: a chiavi
  uguali la riga si costruisce una volta sola. Scartato il confronto delle due lingue con
  `isEqualNode`: stesso DOM, ma costava il 10-20% del cambio lingua. ⚠️ Nella chiave della
  descrizione la lingua entra **solo se ci sono i genitori**, perché 'Figlio di' lo scrive il codice.
- **`htmlCostante` e `svgNodo` tengono il modello e lo clonano**: scartato un parser per icona, che
  costava più della lista.

## 🏷️ Come si chiama questo progetto

**Tre nomi equivalenti** (istruzione dell'utente): **'Arda Top'** (dalla vecchia cartella
`arda/top/`), **'I Grandi di Arda'** (il titolo del sito) e **'Arda'**. Sono sinonimi, e nessuno dei
tre si corregge quando l'utente usa l'altro.

- **Nei testi pubblicati** resta 'I Grandi di Arda', il titolo dell'opera: la libertà riguarda il
  modo di **parlarne**.
- ⚠️ **'Arda' da solo è ambiguo**, perché è anche il mondo di cui il sito parla: vale come nome del
  progetto quando si parla del lavoro ('metto mano ad Arda'), non dei contenuti ('i Vala di Arda').
  Nel dubbio decide il contesto.
- ⚠️ **'Grimorio' non è un quarto sinonimo**: è terminologia morta, e non si usa mai (`Rules.md`
  dell'hub, § '🏷️ Nomi dei progetti (terminologia condivisa)').

## 🔢 Versione del sito

**Com'è fatto.** **Fonte unica: `var datiVersion` in testa a `dati.js`.** `setVersionBadge` la scrive
nel badge della testata, e gli specchi del Pannello la **ereditano dal badge**. Il numero scritto nel
badge HTML è solo il **ripiego** se `dati.js` non carica. ⚠️ **Mai un secondo numero 'vivo'
altrove**: un pannello è rimasto fermo per mesi a un numero vecchio.

**Sonda di pubblicazione**: quel campo su <https://roccobot.github.io/arda/dati.js>, letto con
`Cache-Control: no-cache` (l'indirizzo non ha più `top`).

**Schema SlimVer `x.xx`**, con le regole di bump in `Roccobot.md`, § '🌿 Workflow git e versioni'.
Specifico di qui: nessun codice confronta le versioni per ordine, solo l'uguaglianza fra badge e
`datiVersion` nei guard, e ⚠️ **nessun prefisso `r`**, che romperebbe quei guard.

**Il numero è anche l'accesso all'area admin**: dal badge in testata e dalla versione del Pannello,
desktop e mobile, il click porta **dritto all'editor**, chiudendo prima il pannello dove serve.

### ⚠️ Gate W3C

- **A ogni release da +0,1 in su** (non ai +0,01), **prima di aprire la PR**: Nu Html Checker su
  **tutte le pagine modificate**, a **0 errori E 0 warning**, compresi gli `info` con
  `subType:"warning"` (pulizia totale voluta dall'utente). La regola madre, col 'se il validatore non
  è disponibile si annota il salto e si procede', vive in `Roccobot.md` § '🧪 Test e verifiche (siti
  e app web)'; qui si aggiunge che il salto non si recupera con tentativi in background, ma al giro
  successivo.
  - **Evidenza sostitutiva** quando si salta: il **diff della porzione NON-JS** rispetto all'ultima
    versione validata 0/0. Se cambia solo il numero del badge il rischio è nullo, perché il Nu non
    ispeziona JS e CSS iniettato.
- ⚠️ **La proprietà CSS `d` dell'animazione del glifo di chiusura è iniettata via JS**, perché il Nu
  non la riconosce: nel CSS statico tornano 4 errori.

### ⚠️ Trappole

- **Controllo di freschezza del progetto**, il passo in più **dopo** il confronto dei ref, che resta
  il primo (`Roccobot.md` § '🌿 Workflow git e versioni'):

  ```bash
  git pull origin main && grep -oE 'vb-v">v</span>[0-9.]+' index.src.html | head -1
  ```

  Se dopo il pull la versione è più vecchia dell'attesa, ci si ferma. Si legge il **sorgente**, come
  gli hook, per non dipendere dal minificatore. ⚠️ Il pattern deve attraversare lo **span della
  `v`**: il vecchio `version-badge">v[0-9.]+` non trova più niente, e un `grep` vuoto si legge come
  'nessun disallineamento', il falso negativo peggiore.
- ⚠️ **Il numero di versione da solo non basta**: un salvataggio admin può toccare `dati.js` senza
  che il badge lo mostri, quindi per sapere **se e di quanto** si è indietro serve il confronto dei
  ref.
- ⚠️ **Gli hook intercettano solo il DISALLINEAMENTO** fra badge e `datiVersion` (avviso a inizio
  sessione, blocco del commit): l'entità del bump resta una scelta di chi lavora.
- ⚠️ **La `v` del badge è allineata OTTICAMENTE alla `r` di roccobot.me**: a padding uguali
  l'inchiostro partiva 0,5px più a sinistra, misurato sul font reale. Se cambiano font o corpo, si
  rimisura.
- ⚠️ **`setVersionBadge` ricompone il badge a nodi**: `textContent` butterebbe via lo span della `v`,
  e `innerHTML` è vietato. Gli specchi del Pannello leggono il `textContent`, che concatena i due
  nodi.
- ⚠️ **Il badge è `position:fixed` solo sopra i 768px**, come il cambio lingua: su mobile la colonna
  delle schede occupa tutta la larghezza, e un testo fisso le passerebbe sopra. Là il badge è
  nascosto, e l'admin si apre dal numero nel Pannello.
- ⚠️ **Scorrendo, il numero dissolve e prende `pointer-events:none`**: è cliccabile solo in cima. Il
  suo listener è **a sé**, perché quello dei tasti salto esce prima in più casi e si porterebbe
  dietro il numero.

### Decisioni dell'utente da non ridiscutere

- **`roccobot.me` sopra, versione sotto**, incolonnati nell'angolo (mockup dell'utente): in cima si
  vedono entrambi, scorrendo resta il solo `roccobot.me`, fisso.
- **I salvataggi admin bumpano di +0,01**, quindi la versione è un contatore di revisioni dei
  contenuti; +0,1 e +1,0 li decidono solo i commit di codice. Come il Worker applica il bump lo dice
  `worker/Rules.md`, § '🔌 Il Worker `arda-admin-proxy`'.
- **Il bivio modale sul tap della versione mobile è stato tolto**, perché su mobile il riordino si
  attivava ma non si poteva salvare: tutti gli accessi vanno dritti all'editor.

## 📲 App installabile (PWA)

**Com'è fatto.** `manifest.webmanifest` (nome **'Arda Roccobot'**, `short_name` 'Arda',
`display: standalone`, scope e `start_url` su `/arda/`), **due** icone in `pwa/` (192 e 512, con
`purpose: "any maskable"`), `apple-touch-icon` per iOS, che il manifest non guarda, e `sw.js`. Le
icone sono il **glifo del FAB**, estratto dalla pagina e rasterizzato da `scripts/pwaicons.js` coi
colori del FAB reale.

- ⚠️⚠️ **L'icona è ADATTIVA, quindi NON ha una forma propria** (istruzione dell'utente): un
  quadrato **pieno** col glifo nella **zona sicura** (l'80% centrale), e la forma la decide il
  launcher. ⚠️ **Scartato lo squircle rasterizzato**: su un launcher che ritaglia in tondo si vede la
  forma **dentro** la forma.
  - Un **solo set** con `purpose: "any maskable"`: l'icona adattiva serve anche i contesti che non
    ritagliano, e due set sarebbero due cose da tenere allineate.
- **Lo splash è uniforme perché il fondo dell'icona COINCIDE col `background_color`**, turchese nei
  due temi (richiesta dell'utente): lo splash di sistema è `background_color` più l'icona centrata,
  e la dimensione dell'icona non è governabile, quindi il riquadro scompare e resta il glifo.
  - ⚠️ **`theme_color` del manifest e `<meta name="theme-color">` sono DUE canali**: il primo colora
    l'app installata, il secondo lo governa la pagina a runtime secondo il tema.
- ⚠️⚠️ **Il service worker NON ha cache, ed è voluto**: esiste solo perché Chromium offra 'Installa
  app', e il suo handler `fetch` lascia passare tutto in rete. Una cache servirebbe la classifica
  vecchia (`dati.js` cambia a ogni salvataggio) col deploy verde e la sonda che conferma la
  pubblicazione, cioè con tutte le spie a posto.
  - ⚠️ **Un worker registrato sopravvive alla cancellazione del file**: togliendolo si fa anche
    l'unregister, o continua a governare lo scope nei browser altrui.
- ⚠️ **Due icone per due temi di sistema NON sono possibili**: il manifest non conosce
  `prefers-color-scheme`, e Android fissa l'icona all'installazione. La variante oro su blu è stata
  tolta, e il generatore la rifà cambiando due valori.
- ⚠️ **Il glifo si posiziona con `<g transform>`, non con un `<svg>` innestato**, che eredita le
  regole CSS su `svg` e si ridimensiona.
- ⚠️ **Icona dell'app e favicon sono due cose distinte**, anche se condividono il glifo: quadrato
  turchese pieno col glifo bianco la prima, simbolo nudo su trasparente la seconda.
- ⚠️ **Dopo un cambio di icona l'app va disinstallata e reinstallata**: Android tiene quella fissata
  all'installazione.

## 🔖 Favicon

**Com'è fatta.** Il **glifo del FAB** su trasparente, senza tondo né fondo, generato da
`scripts/favicon.js`: `favicon.svg` più i PNG **48, 32 e 16** come ripiego, tutti referenziati in
testa alla pagina. Colore **`#ce9d3b`**.

- ⚠️⚠️ **La tinta l'ha SCELTA L'UTENTE A OCCHIO, e non si ritocca per contrasto**: fra otto candidate
  rese a dimensione reale sulle sue barre dei preferiti vere, `#edeeed` e `#292929`. Il criterio è la
  **parentela con l'oro del sito**, non il massimo contrasto: sotto il 3:1 su barra chiara è una
  scelta informata.
  - **Misure scartate**: l'oro nudo `#d2b25c` (1,76:1 su chiaro, quasi svaniva); `#b87323`, giudicata
    troppo scura; il gradino intermedio fra le due, bocciato.
- ⚠️⚠️ **Il '4:1 su entrambe le barre' è IMPOSSIBILE, e la domanda non si riapre**: il contrasto WCAG
  dipende solo dalla luminanza, e con quelle due barre le due condizioni si escludono. Il massimo
  simultaneo è **3,54:1**, a `#b16e22`; la finestra che tiene il **3:1** su entrambe va da `#c27825` a
  `#a0641f`, e là nessuna tinta piaceva all'utente.
  - ⚠️ **La favicon vive nella chrome del browser**: non entra in axe né nel gate W3C, e non intacca
    l'AA del sito, che resta un vincolo per tutto ciò che è dentro la pagina.
- ⚠️ **Le misure si fanno sulle barre REALI, non su bianco puro**: su `#ffffff` la stessa tinta
  guadagna un terzo di punto di contrasto. Le due misure vivono anche nel commento di `favicon.js`,
  sopra la costante: chi cambia la tinta le riscrive tutte e due.
- ⚠️ **Cambiando la tinta si bumpa il `?v=` dei quattro link** della pagina, o la cache del browser,
  tenace sulle icone, mostra la vecchia e fa credere a un deploy mancato.
- **Area massimizzata, senza ritaglio**: il bbox del glifo, misurato dal browser, coincide col
  viewBox, quindi il margine morto è zero e il glifo è solo scalato a filo del riquadro. La regola
  'icone as-is' resta intatta.
- **Maschera di contrasto sull'ALFA**, solo per i raster: su un glifo monocromatico è l'alfa a
  definire la forma (sfocatura 3x3, poi `alfa + 0,35 * (alfa - sfocato)`). L'SVG non applica questa maschera,
  perché il browser lo rasterizza nitido.
- ⚠️ **`favicon.png` non è stata toccata e resta in cartella**, non referenziata: la copre la regola
  non derogabile sulle immagini esistenti (§ '🧹 Asset del progetto').
- **La verifica si fa a dimensione reale, DPR 1**: un'anteprima a DPR 3 ridotta dal visualizzatore
  inganna. Si guardano anche i segnalibri **senza nome**, dove la leggibilità pesa di più.

## 🔎 Modalità ingrandita

Ingrandimento del sito al **130%**, per la leggibilità su desktop. **Scartato il 140%** ('l'ho
sparata troppo grossa').

- **Meccanismo: `html.zoom-big { zoom:1.3 }`**, la proprietà `zoom`: scala in modo uniforme anche i
  valori in px (il passo delle righe del Pannello, lo slot del tag, i filetti), quindi gli
  allineamenti reggono. ⚠️ **Scartata la variante che scala il `font-size` di root**: il testo
  cresce e il passo resta fermo. Non si reintroduce.
- Il fattore vive in **due punti allineati**: la regola CSS e la costante `ZOOM_BIG_FACTOR`, solo di
  riferimento (le misure rilevano lo zoom da sé).
- **Due livelli, da non confondere** (impianto voluto dall'utente):
  1. **default di SITO**: il flag `zoomBig` della **Console**, in `siteFlags`, per desktop e tablet.
     ⚠️ **Sui telefoni (≤480px) non si applica** (scelta dell'utente: la XL è per il desktop):
     `applySiteFlags` lo spegne quando `ZOOM_PHONE_MQ` è attiva, con un listener `change`, senza
     lavoro a ogni resize;
  2. **preferenza PERSONALE**: il tasto **`Z`**, su desktop. Vale solo su quel browser, non tocca il
     sito, si ricorda in `localStorage` (`arda-zoom-big`) coi valori `'1'`/`'0'` **espliciti**
     (chiave assente vuol dire 'segui il sito') e scavalca il default di sito nei due sensi.
  - Regola di `applySiteFlags()`: `mine === null ? (flag di sito && !telefono) : mine === '1'`.
- ⚠️⚠️ **Sul telefono la Modalità XL non serve, ed è accettato che un telefono non abbia più un
  comando per accenderla** (decisione dell'utente). Dalla `15.25` il tocco lungo sul FAB apre la
  **ricerca** (§ 'La ricerca del sito, dal tocco lungo sul FAB'), mentre prima commutava questa
  preferenza: davanti al conflitto l'utente ha scelto la ricerca. Senza tastiera il tasto `Z` non
  c'è, quindi su un telefono la XL resta solo come valore già salvato in `localStorage`.
- **Toast** (testi dell'utente): 'Modalità XL' / 'Modalità normale', in inglese 'XL Mode' /
  'Standard mode'. In UI la voce si chiama 'Modalità XL' / 'XL Mode'.
- ⚠️ **Nessun pulsante nel Pannello** (tolto su richiesta dell'utente): lo zoom si comanda col tasto
  `Z` (personale) e dalla Console (sito).
- **Il tocco lungo sul FAB ha cambiato padrone, non meccanica**: tolleranza di movimento ~8px, click
  al rilascio consumato una volta (`lpFired`), `contextmenu` preventato, callout iOS soppressi
  inline sul solo FAB. Chi modifica quel codice lascia quelle guardie. ⚠️ La guardia 'solo input
  touch' è caduta nella `15.35`, perché la pressione lunga vale anche col mouse: un
  `e.pointerType === 'touch'` in un commit vecchio è superato.
- **Ripristino in due fasi**, perché `dati.js` si carica dopo il blocco iniziale: il blocco in testa
  allo script riapplica subito la sola preferenza personale (niente lampo alla dimensione
  sbagliata); `applySiteFlags()`, dopo il caricamento di `dati.js`, ricalcola col flag di sito prima
  di `renderList`, quindi senza sfarfallio.
- **Linee mediane sotto zoom (`placeMidlinesFor`)**: `getBoundingClientRect` dà px già scalati,
  mentre `off` è in px di layout, e `--mid` si riapplica nel contesto zoomato. Formula:
  **`mid = (baseY - hostTop)/z - off`**, dove si divide solo la differenza dei rect; `z` si rileva
  come `rect.width / offsetWidth`, quindi vale per ogni zoom futuro. In XL resta un residuo di circa
  mezzo pixel, ininfluente su uno strumento admin.
- **Criterio di verifica con lo zoom**: nessuno scroll orizzontale da 320 a 1600px, modali ed
  elementi fissi dentro il viewport, axe 0 nei due temi, W3C 0/0. Il Nu accetta `zoom`, quindi la
  regola può vivere nel CSS statico.

## 🔎 Zoom a una mano nel visualizzatore: doppio tocco e trascina

Portato dal gemello di Terramare su richiesta dell'utente: le mappe di `res/` si consultano col
telefono in **una mano sola**, e il pinch ne chiede due. È il gesto di Google Maps: due tocchi, e al
secondo si **trascina senza staccare il dito**, verso il basso per ingrandire.

- **Da dove vengono i tre numeri**: `300ms` fra i tocchi è la finestra classica del doppio tocco;
  `30px` è il margine oltre il quale due tocchi sono in posti diversi; `200px` di trascinamento per
  **raddoppiare** è la misura di una trascinata comoda, col tetto del viewer a **8x**, cioè tre
  raddoppi.
- ⚠️ **La scala cresce in modo esponenziale** (`2^(dy/200)`), perché lo zoom è moltiplicativo: a
  incrementi costanti il gesto sarebbe scattoso da ingrandito e inerte da rimpicciolito.
- **Il centro è il punto del SECONDO tocco e resta fermo** per tutto il gesto, così il dettaglio
  resta sotto il dito.
- ⚠️⚠️ **Il browser manda un `dblclick` dopo il secondo tocco**, e il viewer lo tratta a modo suo
  (salto a **2,5x**, o ritorno al fit sopra 1,4x), annullando il gesto. `dblSkip` lo lascia cadere
  **solo** se il dito si è mosso, così il doppio tocco **secco** conserva il salto.
  - ⚠️ Il flag si azzera al tocco successivo che non apre un gesto, o mangerebbe il doppio clic buono
    dopo.
- ⚠️ **Durante il gesto il punto in `pts` si aggiorna lo stesso**, anche se il pan non si applica:
  lasciandolo indietro, il primo movimento dopo il gesto recupererebbe tutto il tragitto in un salto.
- ⚠️ **Solo per il dito** (`pointerType === 'touch'`): col mouse restano rotella e doppio clic, e il
  trascinamento col tasto resta pan. Un **secondo dito** annulla il gesto e passa al pinch.
- ⚠️⚠️ **Il banco `test-zoom-gesture.js` serve i DUE siti, e per questo vive in `.memo/scripts/`
  dell'hub**: una copia per sito divergerebbe al primo ritocco. Sceglie il soggetto con `PROVA_IMG`,
  e usa eventi touch **veri** via CDP: i sintetici non bastano, perché il viewer chiama
  `setPointerCapture` a ogni `pointerdown`, e quel metodo rifiuta un `pointerId` che il browser non
  conosce.
  - **Il soggetto di prova predefinito è l'icona PWA** (`pwa/app-512.png`), non una mappa: il gesto
    non guarda che cosa c'è nel viewer, quindi la prova vale uguale. Con i file del sito alla radice
    del repo, accanto a `res/`, anche una mappa è raggiungibile dal server del banco.

## 🔍 La ricerca del sito, dal tocco lungo sul FAB

Dalla `15.25`: un **tocco lungo sul FAB** apre la ricerca, il tocco breve continua ad aprire il
Pannello. È nata perché nella PWA installata il 'trova nella pagina' del browser non c'è, e la
classifica è lunga.

- ⚠️⚠️ **È di SOLA CONSULTAZIONE** (istruzione dell'utente): trova, svela e porta alla card, e non
  apre l'editor né tocca niente. Qui pesa più che sul gemello, perché i suoi mattoni vengono dalla
  ricerca dell'editor admin.
- ⚠️⚠️ **Interroga il DATASET, non il DOM**: vede anche le voci che i filtri del visitatore tengono
  fuori, categorie spente comprese, e gli **Apocrifi**, visibilità a sé spenta di default
  (§ 'Struttura dati'). È la ragione per cui l'utente l'ha voluta al posto di una ricerca sulla
  vista.
- **I mattoni sono quelli dell'editor admin, promossi a globali** (`computeMatches`, `fold`,
  `foldFind`, `SEARCH_FIELDS`, `FIELD_LABEL`): due copie divergerebbero al primo campo nuovo.
- ⚠️⚠️ **I CAMPI SI RICAVANO DAL DATASET, e `SEARCH_FIELDS` è solo l'ORDINE di preferenza.**
  ⚠️ **Scartato l'elenco scritto a mano**: teneva fuori `fonte`, `fonte_en` e `tipo_label`, e
  cercare il titolo di un'opera non dava niente. Condividere l'elenco fra i due chiamanti non
  bastava: non divergono fra loro, ma divergono dal dataset appena nasce un campo.
  - ⚠️⚠️ **Qui i badge possono essere STRINGHE**: valgono `true` oppure `'presunto'` (il badge al
    50%), quindi si escludono leggendo **`ICON_ORDER`**, l'elenco che il progetto già mantiene per
    disegnarli. Un badge nuovo entra là per forza, o non si disegna, e resta fuori dalla ricerca da
    sé. ⚠️ **Scartato il filtro sui valori-flag** (`true`/`false`/`1`/`0`), che lasciava passare
    `'presunto'`: la fonte è l'elenco che il codice usa già, non una lista nuova.
  - **Per NOME restano fuori i campi tecnici**: `genere`, le due tinte della card, `tipo_color`, lo
    slug di Tolkien Gateway (`tg`), `aratar` e `apocrifo`. ⚠️ `apocrifo` anche per una ragione
    editoriale: quella parola qualifica una **fonte**, e per regola non compare nelle card.
  - ⚠️ **Cercare `true` dà riscontri giusti** in `descrizione_en` e `citazione_en`, dove è una
    parola inglese: un'attesa di zero è sbagliata.
- ⚠️⚠️ **Una voce che nessun filtro mostra si SVELA per INDICE, senza spegnere il filtro**
  (`svelate`, letto in cima a `isVisibile`): gli altri filtri restano come li ha messi chi guarda.
  Senza il ridisegno il salto finirebbe su una card che non esiste.
  - **Una riga di risultato che porta a una voce apocrifa lo dichiara** con un tag, o chi la sceglie
    non capirebbe perché compare una card nuova.
  - ⚠️ **La voce svelata resta in classifica fino al ricaricamento**: deroga consapevole al 'i filtri
    non si toccano', perché l'alternativa toglieva la card sotto gli occhi di chi la legge.
- ⚠️⚠️ **Il click del rilascio cade sul velo appena comparso** e passerebbe per un clic fuori dalla
  modale, chiudendo la ricerca nell'istante in cui si apre: la guardia è una finestra di **400ms**
  dalla comparsa. ⚠️ Il consumo di `lpFired` non lo copre: guarda il FAB, e quando il gesto è
  cominciato il velo non esisteva.
- ⚠️ **L'evidenza del riscontro si compone a NODI** (`conEvidenza`, con `createTextNode` e un
  `<mark>` vero): `snippet()` dell'editor torna una stringa di markup, che finirebbe in un
  `innerHTML`.
- **Il tetto è `SS_CAP` (40 righe disegnate), ma il CONTEGGIO resta quello vero**, e chi arriva al
  tetto legge una riga che glielo dice.
- ⚠️ **Il fuoco si dà DOPO l'animazione di entrata** (220ms): dato subito, su iOS, fa salire la
  tastiera mentre la modale si muove.
- **Il guscio è quello della scheda personaggio** (`buildStdModal`), perché la ricerca la vede il
  visitatore (§ 'Note e Note editoriali'); da qui anche il velo **senza tinta**. Quello tinto resta
  alla ricerca admin, che è un'altra modale.
- ⚠️ **Il campo di ricerca NON ha anello di fuoco**: in un campo di testo l'indicatore è il caret, e i
  browser trattano gli input di testo come sempre `focus-visible`, quindi l'anello comparirebbe
  anche aprendo col dito. ⚠️⚠️ **Non vale per i RISULTATI**: `.ss-hit:focus-visible` resta, perché là
  il fondo è l'unico segno della riga raggiunta col Tab.
- ⚠️⚠️ **Su TOUCH la × non c'è** (istruzione dell'utente, come su Terramare): il velo basta a
  chiudere, e il tasto occupava l'angolo di una modale già stretta. Il percorso della decisione e la
  strada scartata (chiudere dalla cornice della modale) vivono in `earthsea/Rules.md`, § 'E su TOUCH
  non c'è nemmeno la ×'.
  - ⚠️ **Il discriminante è la CAPACITÀ DEL PUNTATORE, non una soglia in px**: una finestra desktop
    stretta ha il mouse e tiene la ×. È il criterio di `FX_PTR`, cioè 'questo browser fa hover?'.
  - ⚠️ **La media query si legge in JS**, e mette `ss-senza-x` su `#site-search`: dal CSS questa
    modale non si distinguerebbe dalle altre, che la × la tengono.
  - ⚠️ **`display:none` e non `visibility`**: la × è in posizione assoluta e non c'è spazio da
    riservare, e così il tasto lascia anche la **tabulazione**.
- ⚠️⚠️ **Su DESKTOP la via è la PRESSIONE LUNGA COL MOUSE** (istruzione dell'utente, per i due siti).
  ⚠️ **Il tasto lente in toolbar è stato offerto e RIFIUTATO dall'utente**: non si ripropone, e la
  richiesta nuova chiede il gesto, non il tasto.
  - ⚠️⚠️ **Le soglie sono due, 500ms col dito e 700 col mouse**: col mouse un click 'lento'
    aprirebbe la ricerca al posto del Pannello, e un click deliberato dura meno di ~400ms.
  - ⚠️⚠️ **Si guarda `e.button`, o il gesto scatta col tasto DESTRO**: `pointerdown` lo emette, e qui
    il menu contestuale è preventato. Col dito `button` vale 0, quindi la guardia non tocca il touch.
- ⚠️⚠️ **Il banco è `test-site-search.js`, in `.memo/scripts/` dell'hub perché serve i due siti**,
  con eventi touch **veri** via CDP, perché un evento sintetico non sveglia il tocco lungo. Prova
  insieme gesto, ricerca e voci nascoste, perché il difetto tipico è **un risultato che manca**, e
  sceglie la voce nascosta dal **dataset**, non dal testo delle card, dove una stringa può comparire
  in un altro campo. Fra i due siti cambia solo **come** una voce è tenuta fuori: un flag di sito
  là, l'interruttore degli Apocrifi qui.
  - ⚠️ **Nei banchi dei gesti i 'no' contano quanto i 'sì'**: click breve, click lento a 550ms, tasto
    destro, pressione trascinata; su touch la controprova che il velo chiude e il campo no. Un
    viewport solo non distingue il puntatore, quindi si provano le due piattaforme.

### ✨ Il velo ORO sulla card raggiunta, e il canale che il Bagliore occupava

Istruzione dell'utente, per i due siti: il risultato toccato arriva **evidenziato in oro**, e il
segno **sfuma in due secondi**. Lo scorrimento con la centratura non si tocca: l'utente l'ha
dichiarato perfetto.

- ⚠️⚠️ **Il canale `box-shadow` qui è OCCUPATO dal Bagliore**, che dipinge una lista di ombre a
  lunghezza e ordine fissi (trappola nella sezione della **Console**, voce sulla lista di ombre). Il
  vecchio anello `ss-trovata` la **sostituiva**, e spegneva il bagliore sulla card appena raggiunta
  senza che nessuno lo notasse. Il velo vive in un **`::after`**, uno strato suo.
- ⚠️⚠️ **L'oro si scrive come colore PROPRIO**: dopo la neutralizzazione della tavolozza i token
  `--gold*` di questo sito sono **grigi** (`--gold-bright` è grigio), e il nome della variabile
  inganna chi cerca l'oro.
- ⚠️ **Il velo va SOTTO il contenuto** (`z-index:-1`), o abbassa il contrasto del testo nell'istante
  in cui lo si legge. ⚠️ Con le **linee mediane** accese il velo non si vede su quella card: i due usi
  del `::after` si escludono e vince la riga rossa, ed è voluto, perché le linee sono uno strumento
  di misura momentaneo.
- ⚠️⚠️ **Il rapporto WCAG da solo SOTTOSTIMA un velo oro**: guarda la sola luminanza, mentre il fondo
  si sposta anche di **tinta**, e quello l'occhio lo vede. La visibilità si giudica col rapporto **e**
  lo scostamento sRGB insieme: in chiaro il rapporto è più basso e lo scostamento più alto, e il
  velo si vede nei due temi. Chi guarda un numero solo conclude che in un tema non si veda.
- ⚠️⚠️ **In CHIARO visibilità e contrasto del testo si OPPONGONO per costruzione**: un velo oro
  scurisce un fondo chiaro sotto un testo scuro. ⚠️ **Misura scartata: il pareggio esatto**, con
  l'alfa centrale a 0,42, che pareggiava la visibilità dello scuro ma sul gemello portava il nome a
  **4,80:1**, troppo vicino alla soglia AA di un vincolo non derogabile.
- ⚠️ **Perciò l'alfa chiara è più ALTA della scura, ed è voluto**: 0,34 contro 0,30 al centro del
  gradiente, il filetto 0,68 contro 0,60. Uniformarle toglierebbe al chiaro la sua compensazione.
- ⚠️⚠️ **La curva tiene il velo pieno per il primo 18%, poi scende lineare.** ⚠️ **Scartato
  l'`ease-out`**, la scelta ovvia per una dissolvenza: perdeva quasi due terzi del segno nel primo
  secondo, e della gradualità chiesta restava la sola coda tenue.
  - ⚠️ **La curva si legge dall'ANIMAZIONE**: `getAnimations({subtree:true})` prende anche quella
    dello pseudo-elemento, e portandola a un `currentTime` scelto si legge l'opacità a quell'istante.
- **Il timeout JS è 2100ms**, subito dopo la fine dell'animazione di 2s. ⚠️ Col **movimento ridotto**
  l'animazione non gira e il velo resta pieno, perché trasmette un'informazione (dove si è arrivati): si
  toglie il movimento, non il segno, e la durata la dà il timeout.
- ⚠️⚠️ **Nei banchi il fondo si campiona sui PIXEL, non da `getComputedStyle`**, che dà il colore
  dichiarato, mentre il fondo vero della card è un composito di strati: è la stessa trappola del
  fondo di riferimento dell'AA.
- ⚠️⚠️ **La centratura si misura a scorrimento FINITO**: lo scorrimento è `smooth`, e una misura
  presa prima della fine accusa codice che non è stato toccato. Vale per ogni prova che dipende da
  un'animazione.

## ✨ Feature flag dell'aspetto (la Console)

Il pannello dell'**aspetto del sito**, valido per **tutti i visitatori**: la Modalità XL e otto
effetti grafici, a costo zero sul layout.

**Com'è fatto.** I flag vivono in **`var siteFlags`** di `dati.js`, scritti dal Worker come
`cardColors` e `badgeAdjust`, con ripiego `SITE_FLAGS_DEFAULT`. Un flag è un booleano o un oggetto
piatto `{on, ...manopole}`. Accesso giusto: **`flagOn`** per sapere se è acceso, **`fxCfg`** per la
config in pagina, **`fxTh`** per una manopola per tema, **`fxActiveSfx`** per la variante attiva;
l'accesso diretto a `SITE_FLAGS` è riservato agli editor. Due assi **ortogonali** di suffissi:
**`_m`** sull'effetto (piattaforma), **`_d`/`_l`** sulla manopola (tema). Fonti uniche: **`FX_RANGE`**
per scale e limiti, **`FX_SEL`** per i valori a scelta, **`normSiteFlags`** per normalizzare. Le
regole vivono in **`injectFxRules`**, scoped alla classe di flag su `<html>`, con le formule
condivise con l'anteprima. In UI: tap sulla versione, sblocco, 'Area admin', quinto pulsante
(`showSiteFlagsEditor`); la regolazione è `showFxConfigEditor`. Salvataggio con
`saveSiteFlagsToRepo`, **senza bump di versione**.

**Gli otto effetti** (chiave e label): `glow` Bagliore, `nums` Numeri colorati, `spot` Riflettore,
`press` Incisione, `vig` Alone sfumato, `podium` Effetto podio, `hov` Colore schede, `pat` Trama.
⚠️ `spot` e `pat` sono **`FX_UNI`/`noMob`**: config unica, nessuna `_m`, e fuori dalla tab Mobile.

### ⚠️ Trappole

- ⚠️⚠️ **I valori delle manopole a scelta vivono in `FX_SEL`, SOPRA i default, mai in `FX_KNOBS`**:
  la normalizzazione gira durante il parsing, e una costante definita più in basso dà un TypeError
  che lascia la **classifica VUOTA**. Il difetto è arrivato in produzione e si vede solo al **primo
  salvataggio dal pannello**: un test che non salva la config non lo trova.
- ⚠️ **Le manopole a stringa sono DUE tipi**, scelta fra voci e colore: con un controllo unico i
  colori ricadevano sul default, e il sito mostrava una tinta diversa da quella del file.
- ⚠️ **La lista di ombre del bagliore ha lunghezza e ordine FISSI**, con le parti spente in **alpha
  0**: il browser interpola le `box-shadow` per posizione, e togliere una voce fa slittare le altre
  (il 'lampo' su una manopola che non c'entrava, anche nell'anteprima).
- ⚠️ **La migrazione delle config salvate (`FX_LEGACY`) è obbligatoria**, o una config senza
  suffissi di tema ripiega sul default e la taratura dell'utente è persa.
- ⚠️ **Quando una manopola diventa per-tema, il fattore di tema si toglie dalla formula**, o si
  moltiplica due volte.
- ⚠️ **Tetto di 40 manopole per effetto**: si contano **prima** di progettare un effetto nuovo,
  perché superarlo tocca il Worker, e con lui arriva la race di deploy.
- ⚠️ **Go-live che tocca sito E Worker: prima di salvare dal pannello si aspetta la spia `rev`**, o la
  config nuova non viene scritta e quella vecchia si perde. La regola completa vive in
  `worker/Rules.md`, § '⚠️ Trappole', che è la casa del Worker.
- ⚠️ **Due criteri conviventi e una sola coppia di tab**: la piattaforma si decide sulla larghezza,
  ma `FX_PTR` (oggi il solo `hov`) e il gate del riflettore sulla **capacità del puntatore**, quindi
  su un dispositivo 'a metà' la variante che si regola può divergere da quella che si vede. Senza tab
  il suffisso è **per-riga** e vale la variante attiva; con le tab, l'avviso in fondo dice quali voci
  non le seguono. ⚠️ Il pannello **senza tab non è 'il pannello mobile'**: il codice non lo assume.
- ⚠️⚠️ **Tablet con mouse: quel browser non fa hover**, lo applica al clic e lo lascia appiccicato.
  `FX_PTR` chiede **'questo browser fa hover?'**, che è la domanda giusta, quindi la variante 'A
  tocco' là è corretta, e la taratura desktop non si vede: non è un difetto.
- ⚠️ **`hov` su mobile ESISTE e vale da selezione**: il tap applica `:hover` e lo lascia appiccicato.
  Ha la sua `_m` ed è nella tab Mobile.
- ⚠️ **L'interruttore di `hov` governa ATTIVAMENTE**: il fondo al passaggio è una funzione base del
  sistema cardcolor, quindi serve un ramo che riporti `:hover` al fondo di riposo. Togliere la
  regola non basta: sotto ci sono le vecchie regole di Classe, mute solo grazie a un `!important`.
- ⚠️ **Il `:focus-within` non dipende dall'interruttore**: è l'indicatore di focus da tastiera (WCAG
  2.4.7), e un effetto estetico non lo governa.
- ⚠️ **Un colore semitrasparente va riportato in sRGB**, non lasciato in `oklch()`: Chromium lo
  compone in oklab, e il fondo si spostava di qualche unità su un canale anche con le manopole
  neutre. Il colore opaco non ha il problema.
- ⚠️⚠️ **Podio: le posizioni delle fermate sono LOGICHE**, e si rimappano sulla fascia che il glifo
  intercetta, perché le percentuali corrono sul box del numero, molto più largo della cifra: senza,
  una manopola non cambiava niente. Si misura col **metodo delle bande** (20 bande nette da 5% sul
  numero, pixel per banda), l'unica prova diretta di che cosa arriva sull'inchiostro, e si rimisura
  se cambia la geometria. ⚠️ L'anteprima ha una **fascia propria**, perché le sue card finte hanno un
  numero proporzionato in un altro modo.
- ⚠️ **Il colore misurato subito dopo un cambio di flag è INTERMEDIO**: è la transizione di
  `.rank-num`, e si attendono ~400-600ms. Ha fatto sembrare che `nums` scavalcasse il podio.
- ⚠️ **`nums` e `podium` hanno la stessa specificità**: il podio vince perché è emesso **dopo**. Non
  si inverte l'ordine dei blocchi.
- ⚠️ **Trama: il confronto A/B si fa fra trama visibile e INVISIBILE** (opacità 0) con la classe
  attiva, non fra effetto acceso e spento: la sola presenza dello strato sposta l'antialiasing in
  punti isolati, e sui massimi dà falsi allarmi.
- ⚠️ **La banda sgombra in cima alla trama è un vincolo di ACCESSIBILITÀ**: i controlli fissi in alto
  sono tarati esattamente su 4.5:1, quindi qualunque velo dietro di loro li porta sotto soglia. Si
  rimisura se cambiano colore o opacità di `.home-link` e `.lang-switch`, o l'altezza della banda.
- ⚠️ **In vista divisa il box della trama si stringe all'area del contenuto**, o la trama finisce
  sopra le schede e l'anteprima, che in dock è la pagina stessa, mente.
- ⚠️ **Nei test i valori degli effetti si impostano SEMPRE esplicitamente**: la config salvata è la
  taratura dell'utente e cambia quando lui usa il pannello, e un test che si affida ai default ha già
  dato falsi FAIL. Prima di cercare una regressione si legge `var siteFlags`.
- ⚠️ **axe non prova il contrasto sulle card**, quindi i limiti delle manopole sono prudenti: la
  ragione e il metodo vivono in '🧭 Vocabolario strutturale' → '🎨 Colore card', voce sulle
  trappole.
- ⚠️ **Caso chiuso, non è un difetto: 'spento su mobile, e lo trovo spento anche su desktop'.** Il
  Pannello scrive sempre e solo la variante giusta; l'equivoco nasce perché non mostra lo stato
  dell'altra. Se ricapita, si ricostruisce la storia delle due chiavi con
  `git show <commit>:dati.js` (per i commit prima della `15.70`,
  `git show <commit>:arda/top/dati.js`), l'unica prova diretta di che cosa ha scritto un
  salvataggio.
- ⚠️ **`fade` (bordi lista in dissolvenza) non esiste più**, sostituito dal riflettore su richiesta
  dell'utente: non si reintroduce, ed è altra cosa dalla manopola `fade` della trama.
- ⚠️ **Il fondo per l'AA di un testo su strati semitrasparenti si COMPONE**: riquadro, card con
  l'alpha dello stato corrente e non di riposo, velo della pill. Stimato su un solo strato, scendeva
  sotto soglia dove le card sono accese.
- ⚠️ **Tetti in `vh` sotto Modalità XL**: le unità viewport risolvono in px di layout, e il tasto di
  chiusura finiva fuori dal viewport. I tetti si dividono per il fattore di zoom esposto al CSS, e
  l'overlay si ancora in alto con margini automatici, perché con la centratura flex la parte alta
  diventa irraggiungibile.
- ⚠️ **Le etichette del Pannello restano su UNA riga nel caso peggiore** (320px in Modalità XL,
  colonna della label larga **102px**), perché un a capo raddoppia l'altezza di una riga che deve
  restare uguale alle altre. Si verifica nelle due lingue e col font reale.
- ⚠️ **Il numero di posizione va SOPRA il bagliore**, o la sfumatura vela i metalli del podio.
- ⚠️ **I tasti salto si rivelano col focus da tastiera**: a opacità 0 ma nella tabulazione, il focus
  ci finiva invisibile (WCAG 2.4.7, che axe non intercetta). Serve `!important`, perché la
  dissolvenza usa uno stile inline. Scelta di merito: rivelarli, non toglierli dalla tabulazione,
  perché servono a chi naviga senza mouse.
- ⚠️ **L'emulazione non riproduce il touch reale**: il trascinamento del pallino di un
  `input[type=range]` non è verificabile con eventi sintetici, e il test fallisce identico prima e
  dopo. Prima di accusare una modifica si rifà la prova sulla versione precedente.

### 🎨 Estetica e vincoli

- **Niente sollevamento né ombra grigia sulla card**: sono card 'virtuali', e il lift del mockup è
  stato scartato apposta.
- **Le fughe del bagliore hanno spread negativo**, per uscire solo dal proprio lato: senza,
  avvolgevano la card con l'effetto neon, scartato. Il blur è `1.6b` e non `2b`, con cui la coda
  traboccava sul perimetro: da lì l'aura come manopola separata.
- **A destra nessuna striscia colorata**, solo il bagliore (scelta dell'utente).
- **L'argento del podio ha molte fermate**, perché con due 'sembrava un numero normale'; scartati i
  metalli chiari troppo scuri della serie `v12.28-52`.
- **Podio, da non rompere.** La saturazione dei riflessi sale **in proporzione a quella del
  metallo**: scartate la spinta assoluta, che rendeva blu il lampo dell'argento chiaro, e la spinta
  ridotta, che sporcava di grigio i lampi caldi. L'ultima fermata, scura, **non dipende dalle
  manopole**, perché tiene il bordo del glifo. L'asimmetria storica (lampo solo sull'argento) non è
  riproducibile con manopole condivise, e l'utente l'ha accettato.
- **Nitidezza del riflesso**: la sagoma è una banda a larghezza **fissa**, sempre presente, e la
  manopola ne sfuma il bordo. ⚠️ **Scartata la rampa stretta attorno a una fermata singola** della
  `v13.38`, che assottigliava la sagoma: non era l'idea dell'utente, e non si riprova.
- ⚠️ **Anteprima del podio sui numeri 1 e 2, ORO e ARGENTO**, perché l'argento ha più bisogno
  d'occhio. Gli altri editor usano le posizioni 4 e 5, fuori dal podio, o l'anteprima mentirebbe.
- **Contrasto dei controlli**: la tab inattiva è a **0,78 e non 0,45**, con cui il testo scendeva a
  2,85:1 in chiaro; una riga disabilitata resta a **0,5 e non meno**, perché va letta.
- ⚠️ **I limiti di luminosità di `nums` sono di ACCESSIBILITÀ**: in scuro serve L alta, in chiaro L
  bassa, quindi i due temi non possono condividerli. Non si allargano senza rimisurare.
- **Trama: motivi deliberatamente NON narrativi.** Niente **Albero Bianco** (Gondor, quindi Uomini),
  niente iscrizione dell'**Unico Anello** in tengwar (Sauron): non sono elfici, e i tengwar non si
  inventano. Niente **emblemi araldici** di J.R.R. Tolkien ricostruiti a memoria, che produrrebbero
  inesattezze: se ne prende la **grammatica** (losanga come cornice, rosone al centro, punti negli
  interstizi).
  - ⚠️ **Un motivo nuovo è una RETE CONNESSA**, non una figura ripetuta, con le linee che proseguono
    da un tile all'altro **con la stessa tangente**. Scartati per il difetto opposto un ottagramma a
    contorno e un rosone isolato.
  - ⚠️ **Scartato l'ESAGRAMMA**: benché figura araldica, si legge come Stella di David, simbolo
    estraneo al Legendarium. Non si ripropone.
- ⚠️ **Trama: scartata l'ancoratura al DOCUMENTO**: funziona e non costa, ma la banda sgombra
  seguirebbe il documento e non proteggerebbe i controlli fissi, che è il vincolo decisivo.
- ⚠️ **Nell'anteprima su card finte il confinamento della trama non è riproducibile**: là il motivo
  si mostra dappertutto, e la nota della manopola dice dove finirà.
- **Etichette: le misure scartate.** 'Colore al passaggio' e 'Colore delle schede' non entravano
  nella colonna da 102px; in inglese 'Coloured numbers' sforava e 'Tinted numbers' aveva un margine
  troppo sottile, mentre 'Numbers' da solo si leggerebbe 'mostra i numeri'. Nel piè della
  sotto-modale 'Predefiniti' occupava quasi tutto lo spazio, e 'Standard' ci entrava ma dice uno
  **stato** dove gli altri tasti dicono un'**azione**.
- **Anteprima FISSA in alto**, con respiro dinamico **solo per il bagliore**, l'unico effetto che
  disegna fuori dalla card: quanto trabocca dipende dalle manopole.
- ⚠️ **Le didascalie descrittive sono state tolte ovunque**, superflue per l'utente: il pannello è
  una lista pulita di interruttori. Non si reintroducono.
- **Segno di spunta minimale, esteso a tutto il sito.** Il bersaglio di tocco resta la **label da
  24px**; il focus da tastiera ha un anello proprio, perché spegnendo il disegno nativo spariva anche
  quello; fondo e colore del segno restano quelli storici, così i contrasti verificati non si
  muovono. `accent-color` non basta: cambia la tinta, non la forma. ⚠️ Nell'editor personaggi i
  margini della casella restano quelli dell'UA, o si stringe la griglia dei badge.
- **Bersagli di tocco da 24px** (WCAG 2.5.8): sugli slider cresce solo la zona sensibile, e il binario
  resta disegnato com'era.

### Decisioni dell'utente da non ridiscutere

- **Nome in UI: 'Console'**, uguale nelle due lingue; il nome interno resta `siteFlags`. ⚠️ **Il
  rename toglie una COLLISIONE**: il nome vecchio conteneva 'Pannello', che è la modale del FAB dei
  visitatori. Su Terramare la stessa confusione è costata due versioni (`earthsea/Rules.md`,
  § "'Senza nome proprio': dalla Console al Pannello").
- **Nomi e ordine delle voci:** Modalità XL, Bagliore, Numeri colorati, Riflettore, Incisione, Alone
  sfumato, Effetto podio, Colore schede, Trama. Etichette brevi, di una parola dove si può.
- **'Attiva' / 'Enable'**, non 'Effetto attivo': prima voce di ogni sotto-modale.
- Le manopole numeriche del bagliore **non sono per-lato**: il lato destro resta separato solo come
  accensione.
- La casella **'Ai lati'** è la vecchia 'Anche fuori dalla card', che l'utente non capiva.
- **Le voci del bagliore sono raggruppate in SEZIONI**, con etichette volutamente generiche e
  ripetute: è la sezione a disambiguarle, e i nomi lunghi rendevano l'elenco confuso.
- **Le caselle disabilitano le impostazioni che governano.**
- **'Contorno più nitido': sì/no e nient'altro**, non per tema, subito dopo 'Attiva'.
- **Le varianti di `hov` si chiamano 'Col mouse' / 'A tocco'**, perché è l'asse reale su cui si
  dividono; le **tab del Pannello** restano Desktop/Mobile, perché governano tutti gli effetti.
- **Riflettore tolto da mobile.**
- **La trama non passa MAI sopra o sotto le schede né sulla testata**: la manopola che lo permetteva
  è stata tolta, un valore residuo nei dati è ignorato, e per questo i tetti di opacità si sono
  potuti alzare.
- **'Azzera' / 'Reset'** riporta alla resa con cui l'effetto è nato, **'Ultimo salvato'** a ciò che è
  sul repo; il **doppio clic su uno slider** azzera la sola manopola. 'Ultimo salvato' su due righe
  va bene così.
- **Slider 'solo pallino'**: niente salto al punto cliccato sul binario; il valore si cambia
  trascinando, da tastiera o dal campo numerico.
- **'Contrasto'** e non 'Intensità del metallo': la manopola regola lo stacco chiaro/scuro e alza
  anche la cromia percepita.
- **Le manopole del podio sono per tema**, perché i metalli hanno gradienti diversi nei due temi.
- **Un riquadro d'anteprima** se l'effetto ha manopole per tema (quello in modifica, che cambia con
  la tab), **due** se la config è unica. Con due: tema chiaro per primo, niente etichette
  'Scuro'/'Chiaro', card sempre in hover, padding sinistro abbondante.
- **Anteprima anche nel Pannello, solo in tab Mobile**, in panoramica, perché la pagina è desktop sia
  in vista divisa sia dietro la modale. ⚠️ Gli effetti che quella variante non ha si escludono, o
  l'anteprima mentirebbe.
- **Salvare i flag non bumpa la versione** ('accendere un effetto non è una modifica di contenuto'):
  il controllo di freschezza regge sui ref git.

## 🪟 Vista divisa degli editor dell'aspetto (dock)

**Com'è fatto.** Su desktop largo gli editor dell'aspetto non aprono una modale: si ancorano in una
**colonna a sinistra**, e la **pagina vera**, spostata a destra col margine del body, fa da anteprima
dinamica. Stesso DOM, nessun doppio stato. Impianto voluto dall'utente: **'il sito stesso è
l'anteprima'**. Sullo stesso telaio vivono la Console con le sue sotto-modali, l'editor colori e i
micro-aggiustamenti, ognuno con la **propria larghezza di colonna**; sotto soglia si apre la modale
di sempre, e un **resize a metà modifica** commuta il telaio conservando tab, scroll, sotto-modale
aperta e regolazioni non salvate.

### ⚠️ Trappole

- ⚠️ **`clientWidth` NON si riduce sotto `zoom`** (misurato): resta la larghezza della finestra,
  quindi il fattore della Modalità XL si divide a mano nel calcolo della soglia.
- ⚠️ **La colonna si dimensiona con gli inset (`top`/`bottom`), MAI in `vh`**, perché sotto zoom XL
  le unità viewport non scattano.
- ⚠️ **Spostare la pagina col margine non fa scattare `resize`**: il ricalcolo delle righe si chiama
  a mano all'apertura e alla chiusura, o a-capo dei nomi e righe bipartite restano misurati sulla
  larghezza vecchia.
- ⚠️ **In dock NIENTE blocco dello scroll**: la pagina è l'anteprima e resta **viva**, con scroll e
  hover, senza i quali bagliore e riflettore non si vedono. Il **focus trap del `Tab`** funziona
  anche in dock, perché agisce sulla modale più in alto e non sul blocco dello scroll.
- ⚠️ **Lo scudo dei click si rimuove SEMPRE alla chiusura**: è un listener in capture che spegne i
  click sulla pagina (consentiti solo colonne, tasti salto e cambio lingua), e lasciato appeso rende
  il sito inerte.
- ⚠️⚠️ **I rebuild TECNICI non ripristinano né animano**: tasto `L`, cambio di telaio al resize e
  'Ultimo salvato' non sono chiusure dell'utente, e senza il flag apposito un cambio lingua
  butterebbe via le regolazioni non salvate. Passano da un helper che alza il flag e lo riabbassa in
  `finally`.
  - ⚠️ **Anche 'Ultimo salvato' è un rebuild tecnico**: ripristina i valori e poi chiude e riapre, e
    senza il flag riporterebbe il sito al tema d'apertura. Vale per **ogni futura via** che chiude e
    riapre l'editor senza che l'utente ne esca.
- ⚠️ **La baseline del tema è una GLOBALE**, perché sopravvive ai rebuild tecnici: senza, la
  riapertura scambierebbe il tema della tab per la baseline, e alla chiusura il sito resterebbe
  scuro. Si azzera solo alla **chiusura vera**.
- ⚠️ **La larghezza della colonna si CONGELA inline prima di animare l'uscita**: il rilascio del dock
  porta via la variabile da cui dipende, e il box in uscita si allargherebbe a tutta pagina.
- ⚠️ **I due editor chiamano in testa l'iniezione del CSS del dock**, perché quel CSS serve anche
  quando si apre per primo uno di loro.
- ⚠️⚠️ **USCIRE SENZA SALVARE = ANNULLA, in TUTTI i telai** (istruzione dell'utente: la × non salva
  niente, nemmeno in `localStorage`). La ×, il clic sul velo ed `Esc`, che passa dalla ×, chiamano la
  **stessa** funzione del tasto Annulla.
  - ⚠️ **Quella funzione NON si sposta dentro `close`**: da `close` passano anche i rebuild tecnici,
    dove le regolazioni non salvate devono sopravvivere.
  - ⚠️ **Qui la funzione non ridisegna la lista**: su Terramare sì, perché là un effetto tocca il
    markup, e qui sarebbe un ridisegno sprecato a ogni chiusura.
  - **Dalla Console non parte nessuna scrittura in `localStorage`** (l'unica chiave vicina è la
    preferenza di zoom, che scrive il tasto `Z`), e il banco confronta l'intero `localStorage` prima
    e dopo.
  - La tab del tema in dock non è toccata da questa regola: continua a commutare il tema del sito, e
    alla chiusura vera torna quello d'apertura.

### 🎨 Estetica e vincoli

- **In dock le anteprime su card finte SPARISCONO** (richiesta dell'utente): con la pagina vera
  accanto sono ridondanti. Sono nascoste via CSS e non smontate, così il cambio di telaio a metà
  modifica non ha casi speciali, e sotto soglia ricompaiono da sé.
  - ⚠️ **Eccezione: se la variante in modifica non è quella ATTIVA, l'anteprima RESTA anche in
    dock**, perché la pagina accanto mostra l'altra variante. ⚠️ La condizione **non è 'siamo in dock
    e la variante è mobile'**: su un **tablet touch** il caso è l'opposto, ed è la tab Desktop a
    lavorare alla cieca.
- **Le anteprime interne dell'editor colori e dei micro-aggiustamenti RESTANO anche in dock**: in
  dock le schede vere non si aprono (i click sono spenti), e i micro-aggiustamenti mostrano campioni
  col badge in modifica e la linea mediana rossa, che la pagina non garantisce, perché il badge può
  essere fuori dal viewport.
- **In dock la colonna entra da sinistra e il box NON si anima**: sollevare una colonna a piena
  altezza sarebbe fuori luogo.
- Il corpo a due colonne dei micro-aggiustamenti **si impila** in dock, perché era pensato per una
  modale molto più larga.

### Decisioni dell'utente da non ridiscutere

- **Click spenti fuori dalle colonne**: la pagina risponde a scroll e hover, ma i click non aprono
  niente. Consentiti i tasti salto (solo scroll) e il cambio lingua, che equivale al tasto `L`.
- **'Torna al punto di partenza se non si salva'**: chiudere la colonna ripristina l'ultimo salvato;
  dopo un salvataggio riuscito è un no-op, perché lo snapshot è già sincronizzato.
- **La tab del tema commuta il TEMA DEL SITO, solo in dock**, e alla chiusura vera il tema torna a
  quello d'apertura.
- ⚠️ **Il 'top del top'** (solo il contenuto scuro, pannello chiaro) **non è praticabile a costo
  sano**: tutto il CSS del tema dipende dall'attributo sulla radice, e non si circoscrive a un
  sottoalbero.
- **Le tab Chiaro/Scuro restano anche in dock**, perché scelgono quali manopole si editano; per
  vedere l'altro tema in pagina c'è il tasto `T`.

## 🏷️ Il titolone: le due lingue sullo STESSO numero di righe

Istruzione dell'utente, per i due siti: dove una lingua manda il titolo a capo e l'altra no,
l'intestazione cambia altezza al cambio lingua e la pagina scorre sotto gli occhi. Le due lingue
rendono lo **stesso** numero di righe: si **forza l'a-capo** su quella che ne fa di meno, e
`pareggiaTitolo()` decide misurando.

- ⚠️ **Qui la premessa della richiesta era rovesciata**: l'utente descriveva l'italiano più lungo,
  mentre è l'inglese (`The Great Ones of Arda`) a fare più righe. La regola vale letta come lui la
  intendeva.
- ⚠️⚠️ **Su 'I Grandi di Terramare' il meccanismo c'è e non si accende mai**: i due titoli sono stati
  riscritti con la stessa struttura (`earthsea/Rules.md`, § 'Il TITOLO del sito è cambiato, e ha
  chiuso il salto dell'intestazione'). Il codice è **identico** sui due siti, perché una regola
  messa da una parte sola divergerebbe, e si accende da sé il giorno in cui quel titolo cambia.
- **Il punto di rottura preferito è STRUTTURALE**: prima della preposizione, col soggetto sopra e il
  mondo sotto (`I Grandi` / `di Arda`, `The Great Ones` / `of Arda`). È la preferenza dell'utente
  (*dopo 'Ones'*) scritta come regola generale, quindi un titolo nuovo della stessa forma non chiede
  codice nuovo.
- ⚠️⚠️ **Il ripiego serve davvero, sotto i 360px**: là il taglio preferito farebbe uscire
  `The Great Ones` dal riquadro, e `puntiTaglio` offre gli altri spazi, ordinati per **vicinanza al
  centro**.
- ⚠️ **Una metà fuori dal riquadro è peggio di una riga in più**: dove nessuna coppia di tagli
  pareggia senza sbordare, si torna al libero.
- ⚠️⚠️ **Il `nowrap` serve QUANTO il `display:block`**: senza, una metà lunga si spezza da sé e la riga
  in più torna.
- ⚠️⚠️ **Nessuna soglia in px**: la larghezza a cui un titolo va a capo dipende dal font reso e dallo
  zoom del visitatore, quindi si misura sul posto, come fanno già `freeNames` e `alignVoci`.
- ⚠️⚠️ **La misura dell'ALTRA lingua si fa SUL TITOLO STESSO, non su un clone**: la tipografia del
  titolone vive in regole appese a `#title`, e un clone senza quell'id renderebbe con un altro
  carattere. Le scritture avvengono nello stesso frame di layout, quindi nessuno vede il titolo
  nella lingua sbagliata, e un `finally` lo rimette anche se una misura va in errore.
- ⚠️ **Si richiama in TRE punti**: `document.fonts.ready` (una misura fatta prima dei font vale per un
  altro carattere), il `resize` con lo stesso debounce di `reflowRows`, e `setLang`.

### ⚠️ Le trappole di misura, che sono tre e valgono oltre il caso

1. ⚠️⚠️ **`Range.getClientRects()` sul contenuto conta anche i box dei BLOCCHI**: con l'a-capo forzato
   dichiarava tre righe su un titolo che ne rende due. Le righe si contano sui rettangoli dei soli
   **nodi di testo**, camminati con un `TreeWalker`.
2. ⚠️⚠️ **Il bounding box di uno span SPEZZATO abbraccia due righe che cominciano a x diversi**, e su
   un titolo centrato dichiara uno sbordo che non esiste: lo sbordo si misura sul rettangolo di
   **riga** più largo.
3. ⚠️ **Lo sbordo si giudica solo dove la classe è ACCESA**: un titolo che già non entrava da libero
   non è una regressione di questa modifica.

- ⚠️ **Il banco del cambio lingua sotto i 768px non può cliccare `#lang-switch`**, nascosto dal flag
  `langSwitchMobile`: là la via vera è `Ctrl+L`, o il banco va in timeout e sembra un difetto del
  sito.

## 💬 Il messaggio del salvataggio dell'ordine

Il toast dice `Ordine dei personaggi` / `aggiornato e salvato.` su **due righe** (istruzione
dell'utente).

- ⚠️⚠️ **È un testo CONDIVISO col sito gemello**: stringa e stile del toast sono identici in 'I
  Grandi di Terramare', e si cambiano nei due insieme, o divergono senza che nessuna prova lo dica.
  La nota completa, col perché dell'a capo, vive in `earthsea/Rules.md`, § 'Il messaggio del
  salvataggio dell'ordine'.
- ⚠️ **L'a capo vuole `white-space:pre-line` sul toast**: `textContent` da solo non lo rende, e
  `innerHTML` resta vietato.

## 🔐 Admin e segreti

- **Selezione del testo e tasto destro SPENTI per i visitatori, attivi per l'admin** (richiesta
  dell'utente): la classe **`no-pick`** su `<html>` si mette all'avvio, si toglie allo sblocco
  (`setPickLock(false)` in `showPasswordModal`), e una sessione scaduta (401) la rimette.
  - Tre pezzi: `user-select:none` sotto la classe, e un listener **`contextmenu`** e uno
    **`copy`/`cut`** in **capture** su `document`, così arrivano prima di ogni altro gestore, modali
    comprese.
  - ⚠️ **I CAMPI DI TESTO sono SEMPRE esenti** (`input, textarea, select, [contenteditable]`), o la
    modale della parola d'ordine diventa inservibile. Il bersaglio di `copy` può non essere un
    elemento, da cui il controllo su `closest` in `pickInField`.
  - ⚠️ **`user-select` si EREDITA, e il `none` sul body non basta** dove una regola lo dichiara
    sull'elemento: **`.rank-item`** è un `<button>` con un `user-select:text` esplicito, e si spegne
    in modo altrettanto esplicito.
  - ⚠️ **`-webkit-touch-callout` è INIETTATA a runtime**, fuori dal foglio che il Nu ispeziona,
    perché il gate è 0 errori **e** 0 warning.
  - ⚠️ **È un DETERRENTE, non una protezione**, e va detto: il testo resta nel sorgente, leggibile da
    'visualizza sorgente', dagli strumenti per sviluppatori o a JavaScript spento.
  - ⚠️ Nel visualizzatore mappe il tasto destro è bloccato come altrove, quindi da visitatore niente
    'salva immagine': è una conseguenza voluta.
- **La parola d'ordine admin è validata SOLO lato server** dal Worker (secret `ADMIN_PASSWORD`): mai
  nel sorgente del sito, né in chiaro né in base64.
- **Il PAT GitHub vive solo come secret del Worker** (`GITHUB_PAT`): mai nel client, nel
  `localStorage`, nel codice o nelle variabili d'ambiente dell'ambiente cloud.
- ⚠️ **Rate limiting, spia `rev` e ridistribuzione del Worker vivono in `worker/Rules.md`**:
  riguardano il Worker, e una seconda copia qui sarebbe una seconda fonte di verità.

## 🧭 Vocabolario strutturale (Tipo, Categoria, Classe, Badge)

Termini interni **ufficiali**, fissati dall'utente per parlare in fretta degli elementi strutturali
di una voce (il glossario dei contenuti, più sotto, nomina invece i campi testuali).

- **`Tipo`**: l'**etichetta** colorata sulla riga del nome (campo `tipo`), come `Vala`, `Sinda`,
  `Hobbit`, `Troll`.
- **`Categoria`**: la **razza in senso esteso**, ed è il **filtro principale** della pagina: le voci
  di `CATS`, decise da `categoria()`, che governano Pannello e permalink.
- **`Classe`**: concetto **storico** che definiva lo sfondo della card. Oggi lo sfondo dipende dalla
  **famiglia `cardcolor`**, e le regole di sfondo delle Classi sono sovrascritte con `!important`.
  ⚠️ **Ma i nomi CSS sono ancora assegnati da `renderList`, e NON sono codice morto**: restano per
  compatibilità e per un eventuale ripristino. L'unica parte **viva** è l'elenco degli **Esseri
  crepuscolari**, che `isDarkBg` usa per forzare la famiglia `demon`.
- **`Badge`**: le icone di merito o di evento accanto al nome (chiavi in `ICON_ORDER`).

`Tipo`, `Categoria` e `Classe` sono **assi indipendenti**: Melkor e Manwë hanno la stessa Categoria
ma Tipo e Classe diversi. Unica sovrapposizione totale: Classe **Animali** = Categoria `animal`.

### 🎨 Colore card (sistema cardcolor)

**Com'è fatto.** Sfondo card e bordino sinistro derivano dalla stessa **famiglia colore**, non dalla
Classe, quindi ricolorare un gruppo vuol dire cambiare **una terna**. Fonte **`var cardColors` in
`dati.js`**, letta in `CARDCOLORS` (famiglia e coppia di hex per tema, più la mappa dalle `type-*`
alle famiglie), con ripiego interno. Funzione **unica** **`familyOf(p)`**, usata dalla lista e dalla
scheda, che risolve in quest'ordine: colore individuale, `isDarkBg`, `p.cardcolor`, mappa dello
`stripClass`, `man`. Ogni famiglia definisce la terna **`--ccrgb`** (default per lo scuro, override
per il chiaro). Il bordino è una **striscia assoluta**, non un bordo, quindi il cambio di spessore
non sposta il contenuto. Colore individuale in `p.cardrgb` (famiglia `custom`, per tema,
normalizzata da **`customPair`**), e il testo della scheda è reso AA da **`ccAaText`** in
`--cctext`.

- ⚠️ **Nessun elenco di famiglie qui**: l'admin le crea, rinomina e sposta dall'editor, quindi un
  elenco scritto invecchierebbe al primo salvataggio. Si guardano in `dati.js`.

### ⚠️ Trappole

- ⚠️⚠️ **Le regole che mettono `var()` dentro `rgba()` sono INIETTATE via JS**, perché il Nu non le sa
  parsare e dà un falso errore; le **terne restano statiche**. Lo stesso vale per le regole
  dell'accento della scheda e del rimando 'Leggi anche'. Nel CSS statico tornerebbero gli errori
  W3C.
- ⚠️⚠️ **La famiglia può DIVERGERE fra italiano e inglese**, perché `tipoClass` deduce dalle **parole
  del `tipo`**: una parola presente in un campo e non nell'altro manda la stessa voce in due
  famiglie. Casi già visti: la resa inglese dei Peredhil, non uniforme (da cui il match sul prefisso
  `half-el`), `Gondoriano`/`of Gondor` e `Cane`/`Dog`. ⚠️ **Ogni modifica a `tipoClass` si verifica
  nelle DUE lingue**, confrontando `familyOf` voce per voce.
- ⚠️ **Nomi di famiglia = nomi di GRUPPO, non di colore**: la stirpe dominante, in inglese e al
  singolare, così se le tinte cambiano i nomi non mentono. ⚠️ **Mai caratteri accentati**
  (`numenorean`). I nomi sono **misti per costruzione**, ed è il raggruppamento voluto dall'utente.
- ⚠️ **`setModalAccent` si richiama anche al cambio di TEMA a scheda aperta**: il colore del testo è
  calcolato sul fondo di un tema, e resterebbe quello dell'altro, magari fuori soglia.
- ⚠️ **Il fondo di riferimento dell'AA è quello REALE delle modali**: se cambia, si cambia anche là
  **e** nella mini-scheda dell'anteprima.
- ⚠️ **Nell'editor colori l'anteprima è SOLO DOM: mai toccare `p.cardrgb`.** I salvataggi inviano
  **tutto** (`dati` e colori), quindi un'anteprima non salvata non deve vivere negli oggetti che un
  altro salvataggio invierebbe. La famiglia che si abbandona torna all'ultimo salvato.
- ⚠️ **L'editor colori si ricostruisce su `L` ma NON su `T`**: al cambio tema si ricolora da sé e
  l'anteprima mostra già i due temi, mentre un rebuild perderebbe un colore scelto e non salvato. Le
  statistiche si ricostruiscono su tutti e due, conservando tab e scroll.
- ⚠️ **I colori di partenza restano mostrati finché non se ne sceglie uno nuovo**, così aprire e
  salvare non altera un colore intoccato.
- ⚠️ **Nelle statistiche la colonna del nome è RESPONSIVE**: una larghezza fissa sfora il box sui
  telefoni. Si ricalcola sullo spazio disponibile con una barra minima, e il nome va a capo.
- ⚠️⚠️ **axe, sulle card, NON valuta il contrasto**: con un `::before`/`::after` sull'elemento rinuncia
  a determinare il fondo e dà tutto `incomplete`, quindi i vecchi 'axe 0 violazioni' sulle card
  erano **vacui**. La verifica si fa **sui pixel**, campionando il fondo dallo screenshot e
  componendo il testo con la sua opacità efficace.
- ⚠️ **`nums` senza ripiego esplicito va bene**: se la sintassi relativa di OKLCH non è supportata,
  vale la resa grigia storica, corretta e AA-safe.
- ⚠️ **Scartato `color-mix` per desaturare a luminosità costante**: un grigio fisso tira il colore
  verso la **propria** luminosità. La formula dei numeri usa OKLCH con la sintassi relativa, che
  tiene la luminosità, e riscrive cromia e luminosità lasciando intatta la tinta.
- ⚠️ **Il callback async di 'Rinomina e salva' chiude solo se l'overlay è ancora agganciato**, per non
  sbloccare lo scroll di un editor già ricostruito da un `L` in corso.

### 🎨 Estetica e vincoli

- **Le opacità di sfondo, hover e bordino sono i valori BASE del sistema**, e da questi 'Colore
  schede' prende i suoi default: cambiandoli si sposta anche l'effetto.
- **Bordino 4px, 8px per le tre in cima**, e il contenuto non si muove fra podio e non-podio.
- **Sfondo pagina neutro**, al posto del vecchio fondo pergamena caldo, così le tinte di famiglia non
  litigano con lo sfondo. Fondi e accenti di testata, footer e modali sono neutralizzati col **grigio
  a pari luminanza relativa** dell'originale, così i contrasti non si muovono. **Non toccati**:
  etichette tipo, famiglie `cardcolor`, simboli di genere e fondali a bassa opacità.
- ⚠️ **Il crest 'Roccobot presenta' è NEUTRO nei due temi**, mentre il **link del footer**, che
  condivideva gli stessi hex, resta virato verso il colore del FAB del tema, con un contrasto di
  circa 6:1.
- ⚠️ **Le due righe tenui in tema scuro non si schiariscono oltre `#cfcfcf`**, o si avvicinano troppo
  al Nome: la gerarchia la fanno **corpo e peso**. Il corsivo di genealogia e titoli ha lo stesso
  valore, e lo distingue il corsivo.
- **Peso 400 nei due temi**: il 500 del tema chiaro è più largo e cambiava gli a-capo.
- **Titolone**: gradiente e alone, con tinte per tema. ⚠️ In chiaro il fondo del gradiente dà
  **3,20:1** e non si schiarisce. L'alone va con `filter: drop-shadow`, non `text-shadow`, perché
  col `background-clip:text` deve seguire la forma delle lettere. **Scartati**: letterpress inciso,
  contorno con profondità, metallico.
  - ⚠️ **Glifi tagliati in basso**: col `background-clip:text` il gradiente riempie solo il box di
    riga, e gli svolazzi bassi del font restavano trasparenti. Il rimedio estende il box e compensa
    col margine. ⚠️ Il difetto si vede **solo col font reale**.
- **Simbolo di genere**: un gruppo a sé (stato anagrafico, non merito), separato otticamente dai
  badge, coi cerchi al centro-maiuscoletto del nome. Posizione e dimensione sulle card si cambiano
  dall'editor micro-aggiustamenti, non qui.
  - `Femmina.png` è **ritagliata ai lati** (aveva circa il 27% di trasparente orizzontale, che dava
    spazio fantasma): è una deroga dichiarata alla regola 'icone as-is', con altezza e allineamento
    verticale invariati.

### Decisioni dell'utente da non ridiscutere

- **`cardcolor` è scritto esplicitamente su tutte le voci** ('il colore va scritto e memorizzato per
  personaggio'): l'appartenenza è stabile e scollegata dal `tipo`, e la derivazione dal tipo resta
  solo come ripiego per le voci future.
- **Anche la scheda tiene il colore individuale** (segnalato dall'utente su Lúthien): il meccanismo
  AA dinamico ha reso inutile il ripiego sull'accento neutro.
- **I numeri di posizione prendono la tinta della card**, perché il grigio stonava col sito colorato.
  Taratura dell'utente: cromia bassa, luminosità alta in scuro e bassa in chiaro.
- **Le famiglie si gestiscono dall'editor**: imposta colore, **rinomina** (aggiorna la mappa e in
  blocco il `cardcolor` delle voci, lasciando intatte le `custom`) e **sposta per tipo**. Dal picker
  le due varianti di tema sono derivate, in sola lettura.
- **I salvataggi colore NON bumpano la versione**: vanno live subito senza gonfiare `datiVersion`, e
  il controllo di freschezza regge sui ref git.
- **La rete 'ultimo colore salvato'** sono due quadratini che ripristinano il colore **committato** in
  `dati.js`, non l'anteprima.
- **Le statistiche leggono dati e colori al volo a ogni apertura.** Una voce con più etichette conta
  in più Tipi, quindi il totale delle etichette supera il numero di voci: non è un errore di
  conteggio.

## 🗒️ Glossario dei contenuti (nomi colloquiali)

Nomi con cui si designano nel dialogo gli elementi testuali delle card, **a prescindere dai nomi nel
codice o nei dati**:

- **`Nome`** o **`nome principale`**: il nome scritto in grande (campi `nome`/`nome_en`); non sempre
  è il vero nome.
- **`Icone`** o **`badge`**: le immaginette che segnano alcuni punti chiave della storia del
  personaggio (chiavi come `west`, `aratar`).
- **`Etichette`**, **`etichette tipo`** o **`label`**: le etichette colorate di razze, stirpi,
  progenie o tipi di creatura (campo `tipo`, resa `.rank-tipi`).
- **`Info`**: la descrizione breve nella card (campo `info`), come per Melkor
  `Il più potente degli Ainur, fonte di ogni corruzione di Arda`. **Non** include genealogia, nomi alternativi, titoli né
  fonte.
- **`Genealogia`** o **`genitori`**: padre e madre, uno dei due o nessuno (campi `padre`/`madre`),
  sulla riga della Info dopo `|`.
- **`Nomi`** o **`nomi alternativi`**: i nomi e soprannomi del personaggio (campo
  `nomi_alternativi`), col vero nome in grassetto; può essere vuota.
- **`Titoli`** o **`onorificenze`**: titoli nobiliari, onorifici o politici (campo `appellativi`),
  sulla riga dei Nomi dopo `|`; può essere vuoto.
- **`Fonte`**: l'opera di riferimento, ultimo elemento della scheda (campo `fonte`).
- **`Descrizione`**, **`descrizione completa`**, **`scheda`** o, riferito a un testo, **`modale`**: il
  testo completo nella modale del personaggio, col link a Tolkien Gateway (campo `descrizione`).
- **`Campi scheda`**: `Nome`, `Info`, `Genealogia`, `Nomi`, `Titoli` e per esteso `Fonte`, cioè i
  campi testuali visibili nella card prima di ogni clic; la `Descrizione` è esclusa.
- ⚠️ **Fino alla `v3.63` i campi `descrizione` e `info` erano INVERTITI** (`descrizione` era la Info,
  `info` la scheda): da tenere a mente leggendo commit e diff vecchi.

### 🧹 Regola della non-ripetizione: ogni cosa nel suo campo

Ogni elemento che ha un campo apposito (Nomi, Titoli, Genitori) vive **solo lì** e non si ripete
nella Info, che si riformula senza quelle parti.

- Gli **attributi** che non sono veri nomi o titoli (`Prima Regina Regnante di Númenor`,
  `fratello di Gwaihir`, `Capostipite della Casa di Bëor`) vivono SOLO nella Info.
- **I Titoli sono la carica NUDA: i qualificatori non ne fanno mai parte**, anche quando sono veri.
  Il titolo è `Re di Gondor`, non `Ultimo Re di Gondor`; `Signore di Dol Amroth`, non
  `Primo Signore di Dol Amroth`. Il fatto va semmai nella Info, dove la ripetizione del titolo è utile.
  - **Eccezioni per merito eccezionale, decise dall'utente**: `Primo Re di Númenor` (Elros) e
    `Il Primo dei Quendi` (Imin), dove l'essere il primo è la sostanza della figura.
  - Falso positivo da non toccare: `Grande Porta` di Ecthelion, dove `Grande` è parte del nome
    proprio (Great Gate).
- Le **genealogie** (`figlio/figlia di ...`) non sono mai fra Nomi o Titoli, perché ci sono i campi
  Genitori. Eccezione: `Figlia del Fiume` di Baccador, epiteto canonico.
- Gli **epiteti genuini** vanno nei Nomi e non si narrano nella Info (niente `detto X`), salvo quando
  la narrazione ha valore proprio (origine del soprannome: `Labadal` di Sador, `il Capo` di Lotho).
- Sono lecite le **sovrapposizioni solo apparenti**: la Info descrive con parole comuni ciò che
  un'etichetta o un titolo dicono formalmente.

## 🗃️ Struttura dati

**Com'è fatto.** L'array `dati` vive in **`dati.js`** (`var dati = [...]`), caricato **prima** dello
script principale, sincrono e bloccante. Nello stesso file, una riga ciascuna, tre config scritte dal
Worker e **preservate** dai salvataggi che non le inviano: `cardColors`, `badgeAdjust`, `siteFlags`.
Serializzazione: `datiVersion` in prima riga, poi **una voce JSON per riga**, così i diff su GitHub
sono per personaggio, identica a mano e dal Worker. I salvataggi passano dal **Worker**
`worker/arda-admin-proxy.js`: il browser invia `dati` e la parola d'ordine, il Worker valida, legge
lo SHA e riscrive l'intero file con un PUT race-safe. ⚠️ Il Worker scrive nel repo `Roccobot/arda`
sul `dati.js` alla radice (`REPO`, `FILE_PATH`): **se il file dati si sposta, si riallinea là**.
L'URL del Worker è in `ADMIN_PROXY_URL_DEFAULT` (non segreto), sovrascrivibile dal campo 'Proxy'
dell'editor; la parola d'ordine vive **solo in memoria** per la sessione. Deploy e secret in
`worker/README.md`.

### 🧹 Il campo paese è uscito dal dataset

Il campo `paese` è stato tolto su richiesta dell'utente: era uniforme su tutte le voci, e nessuno lo
leggeva.

- **Da dove veniva**: dalla pagina **`legion50`**, capostipite di questo motore, che vive nella
  storia git dell'hub (cartella `artifacts`): là `paese` era un codice ISO che pescava una bandiera.
  ⚠️ **Un campo inspiegabile si cerca LÀ** prima di dedurne il significato.
- ⚠️⚠️ **Perché valeva toglierlo**: un campo presente su ogni voce, uniforme e senza lettori, somiglia
  a un campo libero, e sul gemello un dato vi è finito dentro (`earthsea/Rules.md`, § 'Il campo
  origine').
- **Perché era sicuro**: il Worker serializza ogni voce con `JSON.stringify(d)` e valida il solo
  `nome`, e l'editor lavora su una copia profonda dell'array, quindi non esiste un elenco di campi da
  tenere allineato.
- ⚠️⚠️ **Una scheda admin già APERTA riscrive tutte le voci come le ha in memoria**, campi tolti
  compresi, senza conflitti né errori. Dopo una bonifica del dataset **si ricarica l'editor admin**
  prima di salvare.

### ⚠️ Trappole

- ⚠️⚠️ **Omonimi in classifica** (Galdor, Rúmil): l'ordine è una lista di **nomi**, quindi da nome a
  voce si passa da **`orderByNames`** (coda per nome), **mai da `find()`**, che in un salvataggio del
  riordino ha collassato gli omonimi, duplicando due voci e perdendone due.
- ⚠️ **Dedup delle aggiunte in blocco: sempre PER-LINGUA, mai per voce.** Le due lingue possono
  divergere, e scartare l'aggiunta perché coincide una lingua butta via il miglioramento
  nell'altra: si aggiunge il valore di una lingua se in **quella** lingua è nuovo.
- ⚠️ **Asimmetrie bilingui legittime, da NON segnalare negli audit.** Un campo compilato in una
  lingua sola quando il dato esiste solo lì: **Will Piedebianco**, soprannome inglese
  `Flourdumpling`, che la traduzione italiana ha soppresso. E **due rese in una lingua sola**, da
  tenere entrambe: **Halfast Gamgee**, IT `Al, Hal` (prima e dopo la revisione S.T.I., non un
  anglicismo da bonificare), e **Círdan**, IT `il Carpentiere, il Fabbricante di Navi` in
  quest'ordine, mentre l'EN resta il solo `the Shipwright`.
- ⚠️ **Il controllo dei campi dimenticati scatta solo sul lato COMPLETAMENTE vuoto.** ⚠️ Scartata la
  soglia 'un lato >3 caratteri e l'altro ≤3': dava falsi positivi su traduzioni corte valide (`Elf`,
  `Orc`, `Man`) che, confermate vuote, venivano cancellate.
- ⚠️ **L'editor admin non espone `padre_en`/`madre_en`, ma li PRESERVA** (copia profonda): si
  modificano dal repo.
- ⚠️ **'Etichette sempre a capo' vale SOLO per le card apocrife**, per non collidere con la pill: su
  tutte mandava a capo anche dove c'era spazio.
- ⚠️ **Compensazione di contrasto delle apocrife, solo tema chiaro**: la velatura porta etichette e
  pill sotto la soglia AA, e un blocco di override usa colori più scuri. Una voce apocrifa futura con
  un `tipo` non coperto riceve lì la sua compensazione.
- ⚠️ **L'audit axe delle apocrife si lancia a pagina assestata**, dopo l'animazione di comparsa
  (~2s), o segnala centinaia di falsi positivi da opacità transitoria.
- ⚠️ **La riga del nome è in flusso INLINE, non flex**: così le etichette proseguono dopo l'ultima
  parola del nome, mentre in un flex il nome a capo occupava tutta la larghezza e spingeva
  l'etichetta su una riga nuova. I due motori (inline su mobile, `display:contents` più `order` su
  desktop) **non si fondono**: sono la logica di wrapping.
- ⚠️ **`.name-tight` si tiene SOLO se guadagna una riga intera**, e tocca solo le spaziature, **mai** il
  corpo del font: il recupero è di circa il 3%, e oltre la riga in più è spazio davvero mancante. È
  dinamica per necessità, perché quali card sforano dipende da viewport e font.
- ⚠️ **`.bp-break` si tiene solo se non aumenta le righe totali**, e a parità vince l'a-capo pieno.
  Serve a evitare la 'testa vedova' (`... | Figlia` a fine riga e il resto sotto), e non è
  tutto-o-niente: una parte 2 lunga continua a spezzarsi al suo interno.
- ⚠️ **Gli Apocrifi NON sono una categoria**: non entrano in `CATS` né nel bitmask, e 'Tutti' agisce
  **solo sulle categorie**. La classifica è identica, solo più lunga: le posizioni non cambiano.
- ⚠️ **La label 'Apocrifi' resta leggibile a interruttore spento** (richiesta dell'utente): un
  override per il tema chiaro la rendeva invisibile, perché là quel token è il colore di sfondo, ed è
  stato tolto.
- ⚠️ **I permalink sono in forma BARE** (la query è il token, senza `cat=`), e le categorie non sono
  persistite: l'URL le scavalca **solo all'avvio**, ed è questo a rendere il link idempotente. Le
  forme legacy (`?cat=...`, `?tutte`, `?all`, `?a=1`, `ainur` alias di `ainu`) **restano lette** per
  i link storici, ma non si emettono più.
- Le regole dei filtri badge vivono in § 'Filtri badge del Pannello'.

### 🎨 Estetica e vincoli

- **Lo slot del tag riserva l'altezza anche vuoto**, così il tag compare e sparisce senza reflow e il
  blocco Categorie non si sposta. Righe categoria e legenda condividono un passo verticale esplicito,
  quindi restano in fase.
- ⚠️ **Il suggerimento in corsivo sotto le Categorie è stato tolto**: riempiva il vuoto della colonna
  sinistra, era ridondante e sotto la soglia AA in chiaro. Non si reintroduce.
- **Card apocrife**: sfondo grigio molto tenue, bordo sinistro grigio, opacità 0,8 piena all'hover e
  al focus, e in alto a destra una **pill contornata** 'Solo HoME' / 'HoME-only'.
- **Il FAB flottante del riordino non ha etichetta di testo sull'Esporta**: scelta deliberata, non si
  reintroduce.
- **L'export PDF non ha dipendenze esterne**: è la stampa nativa del browser, col `<thead>` ripetuto
  su ogni pagina e `break-inside:avoid` sulle card, mai tagliate fra due pagine A4.
- **Nel footer solo il TESTO è cliccabile**; i due `✦` sono decorativi.

### Decisioni dell'utente da non ridiscutere

- **Il riordino è DESKTOP-ONLY**: su mobile si attivava ma non si poteva salvare, quindi il tap sulla
  versione va dritto all'editor admin. `showActionChoiceModal` e la macchina del riordino **restano
  nel codice**, non più richiamate, per un eventuale ripristino: non sono codice morto.
- Nel trivio del riordino i tre esiti sono **Conferma** (commit sul repo), **Chiudi** (bozza locale)
  e **Scarta** (ripristino dell'ordine del server dallo snapshot preso prima della bozza). Su desktop
  il trascinamento resta senza password.
- **Il tasto 'Tutti' non tocca gli Apocrifi**, che sono una visibilità a sé, spenta di default.
- ⚠️ **La parola 'Apocrifo' compare SOLO nell'etichetta dell'interruttore**, perché qualifica una
  **fonte** e non un personaggio: mai nella card, mai nei testi delle voci.
- **Nome identico in ITA ed ENG: si compilano ENTRAMBI i campi.** Il ripiego di resa resta come rete
  di sicurezza. ⚠️ Fino alla `v10.4.x` valeva la regola opposta, invertita su richiesta dell'utente.
- **`nomi_alternativi` = NOMI, `appellativi` = TITOLI**, separati da ` | ` sulla riga sotto il nome,
  col separatore solo se ci sono entrambe le parti. Nella notazione di dialogo: `info | genitori` ⤶
  `nomi | titoli`.
- **Nomi alternativi: mai ripetere il nome principale**, si tiene l'epiteto nudo (`Saruman il Bianco`
  → `Il Bianco`, `Galdor dei Porti` → `Dei Porti`), anche nelle forme con preposizione.
- **Il nome vero va in grassetto fra gli alternativi, nella LINGUA MADRE** del personaggio, perché la
  traduzione di un nome è equiparata a un appellativo (criterio B, scelta definitiva): quenya per i
  Noldor, telerin per i Teleri, e il nome originario coperto da un epiteto (`**Mairon**`,
  `**Artanis**`, `**Elwë**`).
  - ⚠️ **Celeborn: NON si usa `Teleporno`.** Sarebbe il vero nome solo nella linea narrativa in cui è
    un Elfo di Valinor, versione **scartata dal progetto** perché genera incoerenze che J.R.R.
    Tolkien non ha mai risolto. Per 'I Grandi di Arda' vale la versione **Sindarin**: `Teleporno`
    non si aggiunge, e Celeborn **non rientra** fra i casi di grassetto.
- **Voci flaggate `apocrifo`: chi sono lo dice il campo in `dati.js`**, non un elenco qui. ⚠️ **NON
  apocrifi benché solo-HoME**, per esplicita scelta dell'utente: **Argon**, **Anairë** ed **Elenwë**
  (caso 'note tardive = canone'; Elenwë tiene il badge Helcaraxë al 50%), mentre **Eldalótë**, dello
  stesso volume, resta apocrifa.
- **Editor admin, scelte in UI**: doppio campo nome IT/EN, entrambi salvati; `appellativi` si chiama
  **'Titoli e onorificenze'** ed è sotto i 'Nomi alternativi', per tenere unita la coppia NOMI e
  TITOLI (`id` e chiave dati **non cambiano**); indicatore arancio sui **campi toccati** nella
  sessione, solo visivo e solo sui campi testo; casella **'Apocrifo'** nella griglia dei flag-badge.
- **La traduzione automatica al salvataggio è stata tolta**, in favore della modale di conferma dei
  campi dimenticati; il tasto manuale resta dietro `FEATURES.adminTranslate`.
- **Le immagini delle Risorse sono in `res/`** e si aprono nel visualizzatore zoomabile; aggiungerne
  una è una riga sola nell'elenco.

## ✒️ Convenzioni tipografiche dei dati (`dati.js`)

Stile uniforme per **tutti** i campi testuali delle voci, deciso dall'utente. I caratteri vietati
(trattini lunghi, apici curvi, ellissi a carattere unico) e il trattino breve anche negli intervalli
d'anno (`1954-55`, senza spazi) sono regole universali, che valgono in ogni output: `Roccobot.md`
§ 'Caratteri' e il `Rules.md` dell'hub, § '✒️ Caratteri vietati'. Qui restano le convenzioni **del
dataset**.

- **Virgolette: sempre l'apice dritto SINGOLO.** Ogni tipo di virgoletta (caporali, doppie curve,
  doppie dritte) si rende con `'`, nelle citazioni come nelle glosse interne.
- **Maiuscola iniziale** su ogni campo-riga mostrato nella card (`descrizione`, `nomi_alternativi`,
  `appellativi`, IT ed EN), anche sugli epiteti nudi (`Il Bianco`, `L'Alto`, `The Old`). Vale per la
  prima lettera della riga; gli elementi successivi di un elenco seguono le regole normali.
- **Nomi comuni di creatura in minuscolo se discorsivi** (`drago`/`dragon`), nelle due lingue.
  Maiuscola solo a inizio riga o frase, nei nomi propri (`Elmo-di-Drago`, `Drago Verde`), nei titoli
  ed epiteti (`Padre dei Draghi`, `Uccisore del Drago`) e nei composti propri inglesi
  (`Dragon-helm`, `Dragon-sickness`).
- **'Terra di Mezzo' con l'articolo**: in italiano sempre **'nella Terra di Mezzo'** (e della, alla,
  dalla), **mai** la forma nuda 'in Terra di Mezzo'. L'inglese resta 'in Middle-earth'.
- **'Legendarium' sempre con l'iniziale maiuscola**: è regola di canone in `rules/JRRT.md`
  (§ '⚙️ Integrazioni operative (armonizzazione con le sezioni sopra)'), e qui vale in ogni campo,
  nelle due lingue e nelle note editoriali.
- **'Nargothrond': regno con l'articolo, città senza**, e il senso si ricava **dal contesto caso per
  caso**. È il primo toponimo del progetto con l'articolo che dipende dal contesto.
  - **Regno, con articolo**: titoli di sovrano (`Re/Principe/Signore del Nargothrond`), genitivi
    riferiti al regno (`popolo/tesoro/fedeli del Nargothrond`) e i locativi dello stare o del
    muoversi entro il regno (`nel`, `sul`, `cacciato dal`).
  - **Città, senza articolo**: raggiungere fisicamente la città (`a Nargothrond`), le sue
    rovine, e la città come soggetto o oggetto di saccheggio o caduta, con la concordanza al
    **femminile**: `Nargothrond fu saccheggiata`, `Nargothrond cadde`.
  - **In inglese niente articolo**, nei due sensi.

### Filtri badge del Pannello

Ogni riga della legenda è un interruttore; le selezioni multiple valgono in **unione** e si
incrociano con le categorie attive. I filtri non sono persistiti, sono **ignorati dagli URL
condivisi** e si **azzerano entrando nel riordino**. Un tag sotto le Categorie dice quanti badge
sono attivi, e il click li azzera.

- ⚠️ **Una riga senza portatori nelle categorie attive è DISABILITATA ma resta cliccabile**: il clic
  non filtra e fa solo una **scossina**. Le righe già **attive** non sono mai disabilitate, perché si
  devono poter spegnere.
- ⚠️ **Il criterio è PER-RIGA sulle categorie attive.** ⚠️ Scartato 'accenderla svuoterebbe il
  totale?': coi badge in unione aggiungerne uno non svuota mai, e con quel criterio, dopo un filtro,
  tutte le righe prima spente tornavano attivabili. Col criterio giusto il messaggio di lista vuota
  resta un ripiego teorico.
- ⚠️ **Al cambio di categoria un filtro attivo che perde i portatori si pota da sé**
  (`pruneBadgeFilter`), o la lista resta vuota e il filtro non si riesce più a togliere.

### ✨ Il bagliore intorno al Pannello

Portato da 'I Grandi di Terramare' su richiesta dell'utente: un alone a 34px più un filo di bordo
illuminato, **solo sul tema scuro**, nella variabile `--pan-glow`, che il tema chiaro spegne con
un'ombra **nulla** e non con `none`, così resta una voce valida della `box-shadow` composta e
l'ombra portata non si riscrive due volte.

- **Perché serve solo allo scuro**: è la controparte scura dell'ombra portata, che sul fondo nero non
  si vede. È il pareggio di un'asimmetria, non una decorazione.
- ⚠️⚠️ **La TINTA non si copia dal gemello**: là l'alone è freddo (`rgba(150,200,235)`), perché freddo
  è tutto quel sito; qui la tavolozza è neutra e il fondo del Pannello è caldo, e un alone azzurro
  sembrerebbe la luce di un altro ambiente. Qui è la luce calda-neutra della pergamena,
  `rgba(232,226,212)`.
- ⚠️⚠️ **L'alfa è MISURATA**: **0,12/0,10**, più bassa di quella del gemello, perché a parità di alfa
  una luce quasi bianca rende di più di una tinta satura. ⚠️ Scartato 0,13, con cui il bagliore
  batteva quello di Terramare a ridosso del bordo.
- ⚠️ **Come si misura**: **A/B sullo stesso sito**, nello stesso fotogramma, spegnendo la sola
  `--pan-glow` da console e misurando la differenza di luminanza pixel per pixel nell'anello, a più
  distanze dal bordo. ⚠️ **Scartato il confronto col 'fondo lontano'**: il fondo dei due siti non è
  uniforme, e il delta resta dentro il rumore (su Terramare dava un bagliore negativo). Fanno fede i
  **3px e 10px**: a 22px il valore torna nel rumore.

### Hover e layout del Pannello

- ⚠️ **L'hover delle righe NON transita**: la dissolvenza di 0,15s, in entrata e in uscita, l'utente
  la sentiva come ritardo, e costava rendering. È stata tolta.
  - ⚠️ **Non erano la sfocatura né l'ombra del Pannello**, i primi sospetti: misurate, non cambiavano
    niente. **Prima di sospettare il blur si contano i frame delle transizioni.**
  - La dissolvenza **resta sui cambi di STATO** (accensione di un filtro badge, spunta di una
    casella); il passaggio del puntatore non transita in nessun verso.
- ⚠️ **DUE layout e UNA sola soglia: 768px.** Sopra, due colonne affiancate; da 768px in giù la
  bottom-sheet a colonna singola, sempre.
  - **Tolto il ramo intermedio 640-768px** a due colonne dentro la sheet: quel layout non entrava in
    nessun punto del suo stesso intervallo (chiedeva circa 790px), misurato col font reale nelle due
    lingue.
  - **Perché nessuno se n'era accorto**: fra 640 e 768px non passa nessun telefono, e il ramo è
    diventato insufficiente col tempo, allungando etichette e legenda. Lezione: un layout tarato su
    una fascia che nessun dispositivo comune occupa non si accorge di rompersi.
  - ⚠️ **Oltre i telefoni la colonna singola non si STIRA**, o i tasti SOLO e TUTTI finiscono lontani
    dalle etichette: fra 481 e 768px il blocco prende una larghezza massima **COSTANTE** e si
    centra. ⚠️ Scartato `fit-content`, con cui il blocco slittava di 5px al cambio lingua, perché la
    legenda ha larghezze diverse nelle due lingue. Se la legenda si allunga, si rimisura.
  - ⚠️ **Sotto i 481px non si tocca**: sui telefoni la larghezza piena è la misura naturale, e
    intervenire rimetterebbe in gioco lo scivolamento orizzontale.
- ⚠️ Per il **tablet con mouse**, che spiega insieme l'assenza di hover nel Pannello e la variante 'A
  tocco' del Colore schede, vale la voce della Console: è lo stesso fatto.

### Elfi ed etichette senza stirpe attestata

- **Erestor e Lindir**: la stirpe non è attestata, quindi l'etichetta resta `Elfo`/`Elfa` (niente
  invenzioni), ma il **colore** suggerisce l'appartenenza più probabile, per scelta dell'utente. Non
  sono anomalie da ripulire: gli override sono **deliberati**.
- **Re-Stregone di Angmar**: stessa logica, etichetta `Uomo`/`Man` e colore númenóreano come indizio.
  Il `?` della vecchia forma è stato tolto, perché allargava l'etichetta e rompeva la riga singola di
  nome e badge.
- ⚠️ **Diverso da Berúthiel** `Donna (Númenóreana Nera?)`, dove il `?` **resta voluto**, perché lì la
  confidenza dell'utente sulla stirpe è più alta pur senza ufficialità: **non si uniformano i due
  casi.**

## 📚 Nuovi personaggi e canone

- ⚠️ **Verifica delle fonti sempre, e alla lettera TRAMITE grep.** Per ogni voce nuova o modificata
  non si scrive niente di incerto (testi, citazioni, genealogie, tipi, badge). Ogni conferma è una
  **ricerca di stringa concreta** sulle fonti scaricabili elencate in `JRRT.md`, **mai a memoria**,
  né su Tolkien Gateway né su conoscenza pregressa. Una verifica mirata è un task singolo; una ampia
  o sistematica è una ricerca multi-agente con report, **previa conferma** dell'utente. Un dato non
  attestato si omette o si segnala, mai si inventa: **alla peggio, si chiede.**
  - **Ricerca a prova di diacritici, in DUE passaggi**: prima la forma esatta (`Helcaraxë`), poi,
    **solo se non trova**, quella ripulita (`helcaraxe`), perché la stessa parola ha grafie legittime
    diverse fra edizioni (`Númenóreano` nel Silmarillion, `Numenoreano` nel SdA).
- ⚠️ **Ogni audit dei contenuti include la conformità dei nomi propri alla resa STI**, come
  dimensione a sé. Un nome inglese lasciato in un campo italiano (`Pippin` → `Pipino`, `Brandybuck`
  → `Brandibuck`, `Dale` → `la Conca`) non è un errore di grammatica né di canone, e sfugge a un audit
  di sola qualità del testo: si confronta voce per voce con le corrispondenze in `JRRT.md`, e con
  TP/STI per i casi non elencati. Vale anche per i controlli automatici.
- **Posizioni in classifica.** Claude colloca da sé le voci nuove (un altro agente lo fa dentro il
  suo cancello 'modifica X'), e a fine lavoro **riferisce sempre le loro posizioni**, calcolate **con
  tutte le categorie attive**.
- ⚠️ **L'accessibilità WCAG AA è un vincolo permanente del sito**: ogni modifica a grafica, colori o
  opacità resta conforme, e i valori tarati sulla soglia non si alzano senza rimisurare. Sulle card
  axe non valuta il contrasto, e la verifica si fa sui pixel ('🎨 Colore card (sistema cardcolor)',
  voce sulle trappole).
- ⚠️ **L'audit axe si esegue con TUTTE le categorie attive**: due sono spente di default, e i badge di
  quelle categorie resterebbero fuori.

### Scelte di canone da non ridiscutere

- **'La nuova ombra' (*The New Shadow*, HoME XII) è ESCLUSA dal progetto.** Il seguito ambientato
  nella Quarta Era è appena abbozzato e fu abbandonato da J.R.R. Tolkien: i suoi personaggi **non si
  inseriscono**.
- **Ent e Ucorni NON sono animali**: vanno fra gli esseri arcani e semi-divini, e i casi-limite
  editoriali (il Vecchio Uomo Salice, 'Spirito della foresta') restano là.
- **Troll**: tassonomicamente non sono Orchi, ma il sito non ha una categoria 'mostri', quindi per
  scelta dell'utente sono nella categoria degli Orchi, la cui legenda recita **'Orchi e Troll'**. La
  decisione è di **merito canonico ed editoriale**, non dettata dalla visibilità di default.
- **Schede di Ent, Aquile e Vecchio Uomo Salice.** ⚠️ Riguarda la **card** (sfondo, bordo, hover) e
  **NON l'etichetta tipo**, che resta ai colori automatici: cambiare le etichette al posto delle
  schede è un errore già fatto una volta. Tutti gli Ent e tutte le Grandi Aquile prendono la scheda
  verde delle Creature primordiali; il Vecchio Uomo Salice, l'Osservatore nell'Acqua e i Guardiani
  di Cirith Ungol sono fra gli **Esseri crepuscolari**, e **non** sono Entità angeliche. ⚠️ Per
  Fimbrethil il `tipo` è normalizzato a 'Ent' (genere invariato), così rientra nel match.
- ⚠️ **Ordinale dei figli di Finarfin: Angrod SECONDO, Aegnor TERZO**, conseguenza coerente della
  scelta di fare di **Orodreth un figlio di Angrod** (caso 'note tardive = canone'). Un audit sul
  Silmarillion pubblicato li segnalerà come sbagliati: **non lo sono.**
- ⚠️ **Anche la genealogia di Indis (padre Ingwë, madre Ilwen) viene da NoME**: non è un errore da
  correggere, e una correzione in questo senso è già stata respinta.
- **Bandobras → Brandobras** (con la R) in italiano, mentre l'inglese resta `Bandobras Took`. Il
  soprannome ha **due rese ITA attestate**, tenute entrambe. Il monte degli Orchi è **Monte Gram**,
  mai 'Monte Gramma', forma errata da fandom.

### ⚠️ Esiti degli audit: cose che un audit futuro segnalerà DI NUOVO a torto

Esiti di due audit semantici multi-agente su tutte le voci, ogni rilievo verificato via grep sulle
fonti locali:

- **Nomi alternativi attestati in PE17** (fonte ammessa): `Gaerdil` per Eärendil, `Elerondo` per
  Elrond, `Laicolassë` per Legolas. Un audit che non peschi PE17 li dirà non attestati: **lo sono**.
- **Éomund 'Primo Maresciallo del Mark'**: resa ITA ufficiale tenuta di proposito, benché le fonti
  usino 'chief/Sommo Maresciallo' ('la abbracciamo così com'è').
- **`Pietraforata`** è la resa IT voluta di `Michel Delving`, di fatto la 'capitale' della Contea, e
  `Sindaco di Pietraforata` è **sinonimo** di `Sindaco della Contea`.
- **Epiteti rimossi perché non attestati**: Isildur 'Tagliatore dell'Anello', Balin 'il Più Anziano',
  Helm 'il Difensore', Bilbo 'il Ritrovatore dell'Anello', più i nomi apocrifi di Alatar e Pallando.
  **Corretto** Arwen 'Stella della Sera' (inventato) in **'Stella del Vespro'**, che traduce
  Evenstar. **Tenuti apposta:** Imrahil 'il Bello' (verbatim, SdA V.6), Bilbo 'il Magnifico'
  (epiteto di Thranduil, fine dello Hobbit) e Arwen 'Gioiello degli Elfi'.

## 🔬 Misure tipografiche: servire i font REALI ai test

**Riferimenti em del sito**, da riverificare al momento perché dipendono dal corpo del testo su cui
si misura: desktop `1em ≈ 25.6px` CSS **sulla riga nome** della card, mobile `1em ≈ 16.19px`. La
conversione dei pixel forniti dall'utente vive nel `Rules.md` dell'hub, § '📐 Misure in pixel →
unità relative'.

⚠️ **Nell'ambiente Claude Code le webfont NON si caricano da sole**: il foglio di Google Fonts
risponde `ERR_CONNECTION_RESET` al browser di test, che non passa dal proxy come `curl`. Il browser
ripiega su **Georgia**, e ogni misura di larghezza, a-capo o altezza di riga è **di un altro font**.
La precondizione, la spia giusta (`document.fonts.size`, mai `document.fonts.check()`, che mente),
che cosa dipende dal font e il conteggio delle righe vivono in `Roccobot.md` § '🧪 Test e verifiche
(siti e app web)'.

- **L'aggancio è COMMITTATO: `.memo/scripts/realfont.js`** dell'hub, che serve anche Terramare.
  Istruzioni, spia attesa ed `executablePath: rf.chromiumPath()` sono nel commento in testa allo
  script; se cambiano le famiglie di font del sito si riallinea la sua costante `GF`.
- La pagina si serve via HTTP (da `file://` i font sono bloccati) dalla **cartella che contiene i
  repo**, allo stesso indirizzo di produzione, sotto `arda/`.

## 🚩 Feature flag (elementi disattivati, ma non rimossi)

Oggetto **`FEATURES`** in testa allo script: interruttori per spegnere elementi senza cancellarli.
⚠️ **Non sono bug né codice morto**, sono scelte deliberate, ed è per questo che sono elencati qui.

- **`genderLegendPill`** (spento): la pill 'Maschio | Femmina' in fondo alla legenda, spenta per
  risparmiare spazio su un'informazione ovvia. Si riaccende se nasceranno funzioni legate al genere.
  ⚠️ I simboli di genere sulle card non dipendono dal flag, e restano sempre.
- **`langSwitchMobile`** (spento): il cambio lingua in alto a destra **solo su mobile**, dove la
  lingua si cambia dal Pannello. Su desktop il tasto resta sempre visibile.
- **`oneRing`**: un **selettore di variante** per l'icona dell'Unico Anello, con contorno o senza; i
  due file restano in cartella apposta.
- **`adminTranslate`** (spento): la traduzione automatica nell'editor admin, spenta su richiesta
  dell'utente in favore della modale dei campi dimenticati.
- **`istariFiveIcons`** (spento): la riga di legenda Istari con le cinque icone in fila; riguarda
  **solo la legenda**, e sulle card le icone per mago restano sempre.
- **`jumpMobileCircle`** (spento): il tondo dei tasti salto su mobile. ⚠️⚠️ **Dalla `15.60` non governa
  niente di visibile**, perché su mobile la colonna dei due tasti ha ceduto il posto al glifo del FAB
  (§ 'Il salto in cima e in fondo, sul glifo del FAB'): il suo blocco CSS resterebbe inerte anche a
  `true`. Non è stato tolto perché la colonna su desktop è viva, e il flag ne descrive il contratto.
  - Su **desktop** il tondo c'è sempre. ⚠️ Il blocco CSS mobile è **dopo** l'override chiaro apposta:
    stessa specificità, sorgente più in basso, quindi vince senza `!important`.
  - ⚠️ **Opacità di riposo e hover sono sul SINGOLO tasto**, non sul contenitore, dove l'hover
    accendeva tutti e due i tasti.
- ⚠️ **Lo scorrimento di pagina NON è un flag**: la funzione condivisa ha due modi fissi (scelta
  dell'utente), fluido per i **tasti flottanti** e istantaneo per le **scorciatoie da tastiera**.
  ⚠️ Il ramo istantaneo forza `scroll-behavior:auto`, o il CSS globale animerebbe anche un semplice
  set di `scrollTop`.

### ⌨️ Scorciatoie da tastiera

Un unico listener, con `preventDefault` per scavalcare l'azione del browser; le scorciatoie con
modificatore sono spente in modalità admin.

- **Ctrl+L**: commuta la lingua all'istante, e se una scheda è aperta la ricarica nella nuova
  lingua.
- **Ctrl (o Cmd) + freccia su/giù**: in cima o in fondo, istantaneo. ⚠️ Su macOS `⌃↑`/`⌃↓` sono del
  sistema e non arrivano al browser: funziona `⌘↑`/`⌘↓`, e il listener accetta tutti e due.
- **`P`** (tasto nudo): apre e chiude il Pannello. ⚠️ **Fn e Win/Super non sono catturabili da una
  pagina web** (Fn non genera eventi, Win/Super è dell'OS): non si riprova, e si è ripiegato su un
  tasto lettera, come fa YouTube.
- **`Z`** (tasto nudo): la Modalità XL come preferenza personale, che non tocca il sito.
- **`.`** (punto, solo admin): mostra e nasconde le **linee mediane** sulla pagina reale, la stessa
  riga rossa dell'editor micro-aggiustamenti. Si spegne da sé al refresh, ed è voluto.
- ⚠️ **Politica dei tasti nudi nelle modali** (regola dell'utente): **`T` e `L` valgono in TUTTE le
  modali**, con le eccezioni documentate (campo di testo attivo; editor colori solo `L`); **`P` e `Z`
  solo a modali chiuse.**
  - ⚠️ La guardia dei campi blocca **solo dove si scrive**: checkbox, radio, range, button e color
    **non** bloccano, perché dopo un click su una casella il focus resta lì, e `L`/`T` devono
    rispondere.
  - ⚠️ Una modale **sopra** un'altra conserva l'hook di lingua precedente, su `L` ricostruisce
    **prima il livello sotto** e poi sé stessa, e alla chiusura lo ripristina: azzerarlo lascerebbe il
    livello sotto senza `L`. Ogni rebuild conserva scroll, tab e selezioni.

### ⚠️ Trappole delle linee mediane

- ⚠️ **La riga si disegna con `height:1px` e `translateY(-50%)`, NON con `border-top`**: un bordo si
  disegna mezzo pixel sotto la coordinata, e a DPR alto lo snapping lo spostava in modo non lineare,
  con la linea ~0,5px troppo in basso **pur con la coordinata giusta**.
- ⚠️ **Il centro del maiuscoletto si misura con uno *strut***: un `inline-block` ad altezza 0 con
  `vertical-align:baseline`, in testa al nome, siede **esattamente** sulla baseline del layout. Il
  centro è poi la baseline meno una frazione del corpo, misurata **a pixel sul font reale** e messa
  in cache per peso e famiglia, quindi indipendente dalla scala. Si lavora in **batch** (tutti gli
  strut, poi i rect in un solo reflow, poi la rimozione), per non forzare centinaia di reflow a ogni
  ridisegno.
  - ⚠️ **Tentativi scartati**: una formula con `fontBoundingBox` e half-leading cadeva ~0,85px troppo
    in basso, e `measureText` dava sub-pixel diversi a dimensioni diverse. Il metodo attuale è
    verificato a pixel, con errore ~0, in pagina e nell'editor.

## ⏫ Il salto in cima e in fondo, sul glifo del FAB

- ⚠️⚠️ **Su mobile i due tasti di salto non ci sono: porta in cima e in fondo il FAB, il cui glifo
  diventa un chevron**, uno per volta e nel verso dello scorrimento (richiesta dell'utente, per i due
  siti: *uno per volta, solo quello che va nel verso dello scorrimento, e soprattutto NEL FAB, al posto
  del logo*). Il FAB non sparisce mai dallo schermo: cambia il disegno dentro un tasto che c'era già.
- ⚠️⚠️ **Il motore viene dall'app AIV** (`Jump.kt`), e i numeri vengono da quella sorgente e dal
  mockup animato che l'utente ha approvato: chi li ritocca li stacca da lì. ⚠️ **La CORSA invece è
  nata su questi siti** (l'easing quintico e la durata con tetto di `pageScrollTo`) e fu copiata in
  AIV: le due corse sono la stessa cosa, e vanno tenute tali.
- **Le costanti, e che cosa governano**:
  - `JUMP_HAUL` è la corsa piena che porta il logo al chevron: una **corsa**, non una soglia, quindi il
    disegno segue il dito invece di scattare;
  - `JUMP_SWERVE` è quanto serve nel verso opposto per girare il chevron: ⚠️⚠️ senza, un rimbalzo di
    pochi pixel girerebbe il disegno a ogni gesto, e il glifo sfarfallerebbe;
  - `JUMP_QUIET_MS` è la quiete che dichiara fermo il dito a corsa incompleta;
  - `JUMP_WAIT_MS` è l'attesa prima del rientro a tasto armato;
  - `JUMP_BACK_MS` è la durata del rientro del logo.
- ⚠️ **Cambiare verso non fa ricominciare la corsa**: il chevron si gira sul posto, e quello che è stato
  fatto resta.
- ⚠️⚠️ **L'esponente del crossfade è minore di uno** (`JUMP_FULL`): con due opacità lineari incrociate,
  a metà corsa il tasto resterebbe quasi vuoto. Il banco lo verifica.
- ⚠️ **A distinguere i due disegni è la SCALA** (`JUMP_ZOOM`), perché si incrociano per tutta la corsa.
- ⚠️⚠️ **A tasto armato il tocco fa il salto e non apre il Pannello**, e il tratto finisce da sé un
  secondo dopo l'ultimo pixel scorso.
  - ⚠️ **Il tocco lungo resta la ricerca, e nel gestore l'ordine conta**: il tocco lungo si consuma per
    primo, perché è un gesto già concluso, mentre il salto è un comando che il click deve ancora
    eseguire. Invertendoli, una pressione lunga a tasto armato farebbe il salto sotto la ricerca appena
    aperta.

### ⚠️ Le due divergenze VOLUTE da AIV, e perché non sono sviste

1. ⚠️⚠️ **Il cambio di verso è un RIBALTAMENTO ANIMATO, dove in AIV è secco**, perché qui l'utente lo
   chiede. Si può fare perché i due glifi della colonna erano l'uno il ribaltamento dell'altro attorno
   a `y=12`: basta `scaleY(-1)` su un nodo solo, invece di una dissolvenza fra due disegni.
   - ⚠️ **La transizione vive sul NODO INTERNO, non sul contenitore**: la scala del crossfade la
     riscrive il JS a ogni fotogramma, e sullo stesso nodo verrebbe animata anche lei.
   - ⚠️ **Il primo verso non si anima**: la transizione nasce spenta e si riaccende dopo una lettura di
     `offsetWidth`, o il chevron si girerebbe mentre arriva.
2. ⚠️⚠️ **Al bordo della pagina il chevron se ne va SUBITO, dove in AIV resta armato un secondo**: là
   una lista pigra non sa dove finisce, qui `scrollTop` lo dice. Un tasto armato al bordo non farebbe
   niente e non aprirebbe il Pannello, che è il peggiore dei due mondi.

### ⚠️ Che cosa NON serve, e la misura che lo dice

- ⚠️⚠️ **Nessuna guardia esclude la corsa del salto dal conto del gesto**: il salto muove la pagina nel
  verso che il chevron indica già, quindi i suoi eventi confermano il verso armato, e sono proprio loro
  a rimandare il rientro. Una riga senza un caso è codice morto, e una prova che la presidiasse sarebbe
  verde con e senza di lei.
- ⚠️ **Sul web i segni sono uno solo** (`scrollY` cresce verso il fondo), mentre in AIV puntatore e
  lista contano al rovescio l'uno dell'altra: chi porta indietro una riga da `Jump.kt` gira il segno.

### ⚠️ Le due trappole del banco

1. ⚠️⚠️ **`html{scroll-behavior:smooth}` è globale su questi siti**, quindi un banco che scorre con
   `scrollTop +=` fa animare ogni passo, la pagina resta indietro, e il banco accusa il motore al posto
   del proprio metro. Si forza `scroll-behavior:auto` per la durata del gesto, come fa `pageScrollTo`.
2. ⚠️ **Lo stato del motore è chiuso nello scope, e va bene così**: il banco misura quello che si
   **vede** (la presenza del chevron, le opacità, il verso del ribaltamento nel `transform` calcolato,
   l'etichetta del FAB, dove finisce la pagina), che è anche il metro giusto: leggere le variabili
   proverebbe l'implementazione, non il comportamento.

- **I 'no' contano quanto i 'sì'**: a metà corsa il FAB non annuncia ancora il salto, un rimbalzo
  piccolo non gira il chevron, e su desktop non succede niente. Il banco serve i due siti, e il sito
  da provare lo sceglie `PROVA_SITO`.

### 🕳️ Che cosa se n'è andato con la colonna

- **Su DESKTOP la colonna dei due tasti resta quella di sempre**: `.jump-fabs` è nascosto nella sola
  media query mobile, perché là il FAB non ha nessuno scorrimento da assecondare col dito.
- ⚠️ **Il prezzo è dichiarato, e l'utente l'ha chiesto sapendolo**: i due versi non sono più
  disponibili insieme, e chi vuole l'altro scorre un momento nell'altro senso.

## 🎨 Etichette tipo (colori e bordo)

- **Bordo del riquadro = colore del testo all'80%**: ogni etichetta `.type-*` usa per il bordo lo
  stesso RGB del testo con opacità 0,8 (`border: rgba(R,G,B,0.8)`), in **tutte** le etichette e nei
  due temi. Ogni etichetta nuova segue lo stesso schema.
- **Contrasto**: il colore del testo di un'etichetta nuova si verifica sul suo sfondo, nei due temi.
- **Niente `/Calaquendë` nelle etichette tipo**: l'informazione 'vide gli Alberi' la indica il
  **badge** `calaquende` (§ 'Criteri editoriali dei badge'), e la classe `type-calaquendi` non esiste
  più.
- **Teleri di Beleriand = etichetta `Sinda`, non `Teler` generico**: i Teleri rimasti nella Terra di
  Mezzo sono Sindar (`Elfo/Elfa (Sinda)`), e `type-sinda` condivide il colore di `type-teler`.
  - **Eccezione, per volontà dell'utente**: **Lúthien** resta `Elfa (Teler)` come seconda
    etichetta, caso unico di figlia di un Sinda e di una Maia.
  - Restano legittimamente `Teler` le etichette **secondarie d'eredità** dei figli di Finarfin, per
    parte di Eärwen.
- **Etichetta `Falmar`** (`type-falma`) per **Olwë** ed **Eärwen**, i Teleri rimasti in Aman: un
  azzurro leggermente più ceruleo del teleri, che li distingue restando **ramo teleri** e **categoria
  elfi** (`categoria()` li mappa via `elfo|elfa`). Scelta dell'utente.

## 🏅 Criteri editoriali dei badge

L'ordine di resa, di legenda e dell'editor vive in **`ICON_ORDER`**; i raggruppamenti di filtro in
**`BADGE_ROWS`**. Chi ha un badge lo dicono i dati: qui vivono **i criteri e le esclusioni
motivate**, perché nei dati un'esclusione è indistinguibile da una dimenticanza.

### I criteri

- **Aman** ('Attraversò il Mare'): segna la **partenza individuale e definitiva** verso Aman di chi
  si era stabilito nella Terra di Mezzo. **Escluse le migrazioni primordiali** degli Anni degli
  Alberi (viaggio degli ambasciatori con Oromë e Grande Viaggio). Il criterio è volutamente **NON
  spiegato in legenda**, per semplicità. Casi decisi dall'utente: **Finwë, Thingol e Ingwë senza
  badge**; Melian, Eärendil, Elwing, Tuor e Idril lo tengono. **Eönwë lo tiene** benché Maia nativo
  di Aman: un audit canonico ne aveva proposto la rimozione, **respinta**.
- **Ambasciatori** (`envoy`): il **viaggio primordiale degli ambasciatori degli Eldar con Oromë**,
  evento unico. In legenda compare solo come gruppo secondario della riga Aman, e l'eccezionalità
  dell'evento **non si spiega in pagina**.
- **Helcaraxë**: l'oste di Fingolfin, **Orodreth incluso** perché qui è figlio di Angrod, nato a
  Valinor. ⚠️ **NON** lo attraversarono i **Fëanoriani**, giunti con le navi, né **Finarfin**,
  tornato a Valinor. **Elenwë** lo ha al 50% con **etichetta dedicata** ('Morì nella traversata
  dell'Helcaraxë'): è l'unica Elfa con nome noto a perire nei ghiacci, e lì il dimezzamento segna la
  **morte durante** la traversata, non un dato presunto.
- **`incarnazione`** ('Riebbe il corpo dopo le Aule di Mandos'), **solo Elfi**. **Míriel** vi rientra
  per una nota tardiva. ⚠️ **Lúthien esclusa** per scelta dell'utente: il suo è un caso a parte
  (rinascita completa con natura diversa, mortale), non una reincarnazione. Beren è fuori per
  definizione: è un Uomo.
- **`est`**: **traversata IN NAVE** dalle Terre Imperiture alla Terra di Mezzo, quindi la Guerra
  d'Ira, i 5 Istari e le navi di Losgar. ⚠️ **Ingwë escluso**: la sua partecipazione alla Guerra d'Ira
  non è attestata (i testi nominano il figlio Ingwion), e il viaggio degli ambasciatori non avvenne
  in nave, perché **le navi non esistevano**.
- **`drago`** ('Uccise un Drago'). ⚠️ **Azaghâl escluso**: ferì soltanto Glaurung.
- **`balrog`** ('Uccise un Balrog'). **Ecthelion ha un tooltip dedicato** ('Uccise Gothmog, signore
  dei Balrog'), perché non uccise un Balrog qualunque ma il loro signore. ⚠️ **Tuor escluso**: uccide
  Balrog solo ne 'Il libro dei racconti perduti II', versione superata del Legendarium.
- **`suicidio`** ('Si tolse la vita'). ⚠️ **Distinzione dell'utente: 'togliersi la vita' non è
  'rendere la vita'.** Il badge marca il **gesto estremo** (violenza, disperazione, rogo), quindi ne
  restano **esclusi** i mortali che *si lasciano andare* alla morte alla maniera dei re di Númenor:
  **Aragorn II** e **Arwen** non lo hanno. **Míriel** è l'unica eccezione, perché è un'**Elfa** che
  rinuncia alla vita in Aman, atto innaturale per la sua stirpe. Casi da giustificare: **Húrin** (le
  fonti dicono 'si dice') e **Aerin** (attestazione **implicita**, tenuta per scelta dell'utente).
  Esclusi verificati: **Elwing** (Ulmo la salva, non muore), **Maglor** (nel Silm pubblicato non si
  uccide; il 'took his own life' è solo HoME IV e riferito a Maedhros), **Saeros** e **Amroth**
  (morti accidentali, non deliberate).
- **`guerradira`** ('Combattè nella Guerra d'Ira'): **solo la schiera attaccante dei Valar**.
  ⚠️ **Definizione soggettiva dell'utente**: 'combattere' la Guerra d'Ira è un'azione **attiva**,
  mentre chi si *difendeva* dall'armata di Valinor faceva un'altra cosa, quindi **Melkor e Ancalagon
  sono esclusi** benché presenti alla battaglia. **Esclusi per attestazione** (Silm cap. 24, 'among
  them went none of those Elves who had dwelt... in the Hither Lands'): Gil-galad, Círdan, Maedhros,
  Maglor, Elrond ed Elros non marciarono con la schiera, e Maedhros e Maglor vennero **dopo** la
  guerra, per i Silmaril.
- **`calaquende`** ('vide la Luce dei Due Alberi'): chi vide di persona gli Alberi, cioè visse o
  soggiornò in Aman prima dell'oscuramento. È **subito prima di `silmaril`**, così i due badge della
  Luce sono vicini e gli Alberi vengono prima dei loro frutti. ⚠️ Fra i Rúmil vale **il Noldo, non il
  Silvano omonimo**. **Thingol** è l'unico Sinda, con **tooltip dedicato** (vide gli Alberi come
  ambasciatore, 'non annoverato tra i Moriquendi'). I portatori al 50% sono Calaquendi solo
  sull'assunto 'Esule nato in Aman', col luogo di nascita non attestato; ⚠️ **Glorfindel è invece
  CERTO**. ⚠️ **`Celeborn` ESCLUSO** benché altre liste lo contino: quello presume la versione
  *Teleporno*, scartata dal progetto, e il nostro Celeborn è Sinda della Terra di Mezzo.
- **`aratar` di Melkor al 50%**, con etichetta dedicata sotto la chiave del suo `nome` e non
  dell'epiteto: dopo la caduta 'Melkor non è più annoverato tra i Valar' (*Valaquenta*), dunque
  nemmeno tra gli Aratar. Il dimezzamento segna questo **status conteso**, non un dato presunto.
- **`sette`** (Sette Anelli dei Nani): **Durin III**, il primo, l'anello capofila della stirpe di
  Durin, per tradizione dei Nani donato dagli Elfi-fabbri e non da Sauron, e **Thráin II**, l'ultimo,
  a cui Sauron lo strappò a Dol Guldur. NB: 'unico anello **noto** dei Nani', non l'Unico.
- **Ingwion NON è apocrifo** benché assente dal Silmarillion pubblicato: Christopher Tolkien
  riconobbe che l'omissione fu un errore del padre, caso 'note tardive = canone'. **Ilwen**, sposa di
  Ingwë, è attestata solo in NoME.
- ⚠️ **Convenzione dei titoli 'Re Supremo' e 'Alto Re'.** In inglese è sempre **High King**; in
  italiano il progetto distingue: il **Re Supremo** governa su tutto il suo popolo, su qualunque
  sponda del Mare, l'**Alto Re** nella Terra di Mezzo. Perciò in inglese i due si **collassano**, ed è
  un'**asimmetria bilingue legittima**. I badge seguono la stessa logica.

### ⚠️ Trappole

- ⚠️ **Il badge semitrasparente è SCOLLEGATO dall'idea di 'presunto'.** Rende l'icona al 50% ed è solo
  un segnale di 'stato a sé': **nessun** suffisso automatico nel tooltip. Il significato si dà caso
  per caso, e **se non si è certi di cosa scrivere si chiede all'utente**.
- ⚠️ **Due badge sono card-only, come EASTER EGG**: `morgoth` (solo Fingolfin) e il Re 'in carica'
  (solo Finarfin). Restano in `ICON_ORDER`, quindi si disegnano sulla card col loro tooltip, ma sono
  **saltati in legenda e nella griglia admin**, e non sono filtrabili. ⚠️ Il valore si **preserva al
  salvataggio**, proprio perché la casella è assente.
- ⚠️ **`morgoth` badge, `.type-morgoth` etichetta e `.divine.morgoth` sfondo sono TRE cose distinte**
  che condividono il nome.
- ⚠️ **La riga Re della legenda è testo INLINE**, e i **tooltip delle card non cambiano**, per non
  rompere la convenzione 'Re Supremo' e 'Alto Re'. Il filtro di quella riga accende tutti i Re,
  **incluso** quello che manca dalla legenda.
- ⚠️ **I tooltip dei singoli anelli restano distinti**, anche se in legenda gli Anelli sono su una
  riga sola con didascalia unica.
- ⚠️ Una voce può avere **più chiavi** nello stesso oggetto di override dei tooltip (Ecthelion ne ha
  due): aggiungendone una, **non si sostituisce** quella che c'è.

### 🎨 Estetica e vincoli

- **Allineamento delle seconde icone nelle righe a due colonne**: la prima colonna ha una **larghezza
  fissa unica**, così le seconde icone sono incolonnate allo stesso x e restano immobili al cambio
  lingua. ⚠️ Il valore è la **più lunga delle stringhe** di colonna 1 in IT ed EN, più respiro: **se
  cambiano quelle stringhe, si rimisura.**
- **Il simbolo di genere è staccato dal cluster dei badge** con un margine extra, perché è un gruppo a
  sé.
- ⚠️ **Se si riaccende la legenda Istari a cinque icone**, i vincoli tarati allora sono: cluster a
  larghezza **fissa**, perché il testo delle righe multi-icona parta dallo stesso x delle altre, gap
  **positivo** e dimensionamento **per altezza**, così i PNG verticali restano vicini **senza
  sovrapporsi**, che era il difetto da cui tutto era partito.
- **Gandalf è l'unico Istar con due icone**, Grigio poi Bianco: fu l'uno e l'altro.

### Decisioni dell'utente da non ridiscutere

- **Badge 'morì in battaglia': BOCCIATO.** Aveva circa 70 portatori, troppo diffuso per un badge
  'eccezionale'. **Non si ripropone**; l'icona è stata tolta, e resta recuperabile da git.
- **Tutti gli Anelli su un'unica riga di legenda in coda**, con didascalia unica 'Portatore di uno
  degli Anelli del Potere'.
- **Riga Re unica a due colonne**, al posto del Re 'in carica', che è diventato easter egg.
- La PNG di `morgoth` **conserva il padding trasparente** su richiesta dell'utente, e il box ha
  l'aspetto del canvas, così l'immagine lo riempie senza letterbox.

## 🖼️ L'anteprima social (Open Graph)

`og-image.jpg`, **1200x630**, fornita dall'utente. ⚠️ Sostituendo l'immagine si riscrive anche
`og:image:alt`, che descrive il **disegno**: lasciarlo com'era mentirebbe a chi usa uno screen
reader.

⚠️⚠️ **L'URL contiene un `?v=` da BUMPARE a ogni sostituzione**, in **entrambi** i meta, `og:image` e
`twitter:image`: la cache dell'anteprima è dei **server dei social**, non del browser, e un file
sostituito con lo stesso nome mostrerebbe la versione vecchia per giorni, senza modo di svuotarla dal
lato del sito.

- **Formato JPEG o PNG, non WebP**: diversi client social non lo mostrano, e un'anteprima non
  degrada, sparisce.
- ⚠️⚠️ **Il tetto è 300 KB** (istruzione dell'utente: *comprimi esattamente come Terramare*): WhatsApp
  tende a non mostrare l'anteprima oltre. Il procedimento è quello di Terramare: la qualità più alta
  sotto i 300.000 byte fra i tre sottocampionamenti, scegliendo il PSNR migliore, in JPEG progressivo
  e col profilo colore conservato.

## 🧹 Asset del progetto

### 🖼️ Rendering delle icone-badge sulle card

**Com'è fatto.** Modello unico deciso dall'utente: le icone si disegnano su un canvas alto 256px e si
usano **as-is**, col padding trasparente che l'autore ha lasciato; sulla card hanno **altezza
uniforme e larghezza automatica**, con una regola scoped che scavalca le classi per icona **solo
sulle card**. ⚠️ **Non tocca la legenda**, né il wrapping di nomi ed etichette: quelle logiche
restano separate.

- **Due strumenti di correzione, divisi per ASSE, ed è una convenzione.**
  - **ORIZZONTALE: `margin`, SEMPRE A CASCATA** (modello 'caratteri consecutivi'): il margine di
    un'icona sposta lei e tutte quelle che la **seguono**, e **a sinistra niente si muove**.
    ⚠️ **Vietate le compensazioni**, cioè le coppie `margin-left`/`margin-right` di segno opposto per
    isolare il movimento su una sola icona.
  - **VERTICALE: nudge (`translateY`)**: sposta **solo** quell'icona, senza toccare le vicine né il
    layout della riga, ed è l'**unico** strumento che lo fa, perché un margine verticale in flex
    sposterebbe l'allineamento dell'intera riga.
  - ⚠️ **I due non si riducono a uno.** Scartata la conversione a `margin` di **tutto** il nudge delle
    corone, **alzata verticale compresa**: l'intento dell'utente era eliminare i soli nudge
    **orizzontali**. Il nudge verticale serve in legenda e come posizionamento intrinseco degli
    anelli, che allinea la **fascia** dell'anello agli altri cerchi.
  - La regola universale preferisce il `transform` per spostare un elemento senza toccare i vicini;
    qui, nella **spaziatura** di una fila di icone, il default è il `margin`, che è ciò che regola i
    gap.
- ⚠️ **I due motori di layout NON si fondono**: desktop a flex con `display:contents`, mobile a blocco
  col contenitore delle icone in `inline-flex`. Sono la logica di wrapping, e la coerenza fra i due si
  cerca nella **convenzione delle correzioni**.
- **Segnaposto per un'immagine che NON carica.** Un badge il cui file manca mostrerebbe il
  placeholder del browser col corpo grande del nome. Un listener `error` in **capture** (gli eventi
  `error` non fanno bubbling) lo marca, e il CSS lo riduce a un quadratino con `font-size:0`, che
  **nasconde il testo `alt` lasciandolo nel DOM** per gli screen reader.

### 🎚️ Editor 'Micro-aggiustamenti icone badge' (admin)

**Com'è fatto.** Regola margini, nudge verticale e **scala** di ogni unità (icona singola o gruppo a
variante di colore con un solo controllo), con anteprima live su schede reali nei due temi.
⚠️ **Riguarda SOLO le card**: la legenda del Pannello non è toccata, e si modifica a mano. La fonte è
**`var badgeAdjust`** in `dati.js`, con un ripiego seminato **coi valori attuali** nella pagina, così
le trasformazioni già fatte restano modificabili; l'iniezione gira **sempre** al load, perché il
ripiego vive nel client. Un'icona futura chiede una voce nell'elenco delle unità e una nel ripiego,
e compare da sé nell'editor.

- ⚠️ **Le etichette dei pulsanti sono nomi di DISPLAY**, scollegati da nomi di file e di classe e
  ridefiniti dall'utente: cambiarle non tocca né i badge né la logica.
- ⚠️ **I simboli di genere sono l'UNICA deroga al modello di dimensionamento**: niente altezza
  uniforme e larghezza automatica, ma **dimensioni base proprie** che la scala moltiplica mantenendo
  l'aspetto. Il seme riproduce esatto il CSS statico, quindi nessun cambio visivo; la classe la mette
  il render della lista, e la **legenda non è toccata**.
- ⚠️ Nel seme dei **gruppi con valori misti** si è scelto un valore unico, accettando scarti minimi.
- **La scala non tocca il PNG**: è l'equivalente a runtime di rimpicciolire il contenuto e ripaddare
  il canvas. Cambiando l'altezza cambia anche l'ingombro orizzontale, coerente col modello 'caratteri
  consecutivi'.
- **Nell'anteprima la linea mediana rossa passa a metà del maiuscoletto** del nome, è il riferimento
  dell'allineamento ottico ed è disegnata **sotto** le icone; l'icona in modifica è marcata da una
  **freccina**, non da un box. La tabella riepilogo resta **sempre visibile** e si aggiorna in-place
  durante il trascinamento, per non perdere lo scroll.
- **`L` ricostruisce l'editor** (le etichette), **`T` no**, perché la modale si ricolora da sé e
  l'anteprima mostra già i due temi.
- **Il salvataggio bumpa** (+0,01), a differenza di colori e flag: qui si toccano le icone, che sono
  contenuto.

### 🗜️ Ottimizzazione immagini

**Due strade ammesse**: ricompressione **lossless**, a impatto zero sui pixel, oppure **WebP
'visually lossless'** a q85 o simile, se il risultato è indistinguibile. WebP non è a palette e il
suo lossy è DCT, quindi non dà il banding a scalini della quantizzazione. Le icone badge sono in WebP,
coi PNG originali conservati come backup non referenziato.

- ⚠️⚠️ **La quantizzazione a palette è VIETATA** (`PIL .quantize()`, `pngquant`, riduzione a 256
  colori o meno), come ogni passo che dia **banding o posterizzazione**: le navi elfiche quantizzate
  avevano banding evidente, e sono state ripristinate. Nel dubbio si verifica a occhio prima di
  committare, soprattutto sulle icone coi gradienti (vele, anelli).
- ⚠️⚠️ **Le immagini del visualizzatore NON si toccano MAI**: i file in `res/` non si modificano,
  ridimensionano, comprimono né ottimizzano per nessun motivo, perché sono materiale di consultazione
  a piena qualità. La regola su `res/` è universale (`Roccobot.md` § '🧹 Bonifica e ottimizzazione
  degli asset'); qui copre anche `favicon.png` e le altre immagini esistenti, che restano come sono,
  salvo richiesta esplicita.
- A ogni **main release** si verifica che tutti gli asset siano bonificati secondo la regola
  universale, e si ripulisce prima di rilasciare quello che non lo è.
- Criteri estetici di consulenza: colori troppo saturi rispetto agli altri badge, e dettagli SVG
  troppo fini per la dimensione reale di circa 22px (la spilla della Compagnia, l'occhio di Sauron).

## 📝 Note e Note editoriali (modale 'Risorse e note')

**Com'è fatto.** Approfondimenti bilingui in **un'unica modale**, con due accessi: il link nel footer
e il tasto Info. Le note vivono nell'array **`EDITORIAL_NOTES`**, accanto a `openResourcesModal`; il
viewer è `openNoteViewer`. Aggiungere una nota è aggiungere un oggetto, e pulsante e viewer si
generano da soli; ogni oggetto ha titolo pieno, **etichetta breve per mobile (obbligatoria)**, la
categoria `'lore'` o `'editorial'` e i due corpi HTML. Note, Risorse e Info condividono il **guscio
della scheda personaggio** (`buildStdModal` e `activateStdModal`); il contenuto tipografico è nelle
classi del viewer, private delle proprietà di box, perché larghezza e scroll li governa il guscio.

**Tre sezioni, in quest'ordine:** **Risorse** (le mappe nel visualizzatore più la mappa interattiva
esterna: non sono note, e non sono nell'array), **Note** (pura lore in-universe) e **Note
editoriali** (le scelte editoriali e il modo in cui la pagina presenta i dati). ⚠️ **Discrimine,
regola dell'utente**: se spiega il **mondo** va in Note; se riguarda una **sua scelta** o **come il
sito rende i dati** va in Note editoriali.

### 🔗 Permalink di note e risorse

**Com'è fatto.** Ogni nota, la nota sulla traduzione, le due mappe e la modale stessa hanno un
**indirizzo proprio** in forma **bare**, come i permalink delle categorie: `?res`, `?glorfindel`,
`?peredhil`, `?celeborn`, `?badge`, `?ita`, `?eldar`, `?quendi`. Aprire un overlay lo scrive nella
barra degli indirizzi, chiuderlo restituisce l'URL della vista; arrivando da un link l'overlay si
apre **sopra la pagina normale**, quindi chiudendolo si resta sul sito. La tabella **`SHARE_ROUTES`**
è l'unica fonte, e si popola da sé dal campo `slug` delle note e da `RES_MAPS`: per rendere
condivisibile una nota nuova basta quel campo.

- ⚠️⚠️ **Lo slug è UNO SOLO per nota, quindi la parola è UNIVERSALE** (istruzione dell'utente): nomi
  propri (`glorfindel`, `celeborn`), termini elfici (`peredhil`, `eldar`, `quendi`) o abbreviazioni
  internazionali (`res`, `ita`, `badge`). ⚠️ **Mai una parola di una lingua sola**: scartati gli slug
  italiani della prima tornata (come `?mezzelfi`), perché su un link che serve anche i lettori
  inglesi dichiarano una lingua che il contenuto non ha; `?half-elven` avrebbe il difetto
  rovesciato.
- **Bare e non `?note=`**: è la convenzione di casa, e le due famiglie non collidono, perché i token
  delle note sono parole e i bitmask delle categorie sono cifre. Un token sconosciuto apre la vista
  di default.
- ⚠️⚠️ **Chiudere l'overlay NON basta a ripulire l'indirizzo**, per la trappola del tasto Indietro:
  impila una voce di cronologia all'apertura e la consuma con `history.back()` alla chiusura,
  tornando a una voce che era stata riscritta col permalink. Da qui la risincronizzazione nel
  `popstate` della trappola; senza, in barra resta il link a una nota chiusa.
- ⚠️ **Il permalink si azzera anche nelle TRANSIZIONI**, non solo alle chiusure vere: la destinazione
  riscrive il suo, e una nota che passa la mano alla scheda di un personaggio (che permalink non ha)
  lascerebbe un indirizzo sbagliato.
- ⚠️ **Nel visualizzatore mappe il 'copia link' va PRIMA della X**: il tasto Indietro chiude
  quell'overlay cliccando l'**ultimo** `.imgv-btn` della barra.
- **La lingua NON viaggia nel link** (scelta di default, in assenza di una risposta dell'utente): il
  link è uno per nota, e chi lo riceve la legge nella propria lingua.
- **Due vie per copiarlo, tutte e due volute** (istruzione dell'utente): la barra degli indirizzi e
  un **tasto discreto** nella nota aperta, perché sul telefono la barra è scomoda. Il tasto riusa
  `copyShareLink`, e ne eredita la conferma visiva.
  - **Discreto vuol dire contorno e non riempimento**, corpo piccolo, centrato sotto il titolo: è un
    comando di servizio, e non compete col testo della nota.
  - ⚠️ **L'opacità è 0,88 e non 0,8**: a 0,8, in chiaro, l'AA passava per due centesimi.

### ⚠️ Trappole

- ⚠️ **Lo scroll vive nel corpo della modale, clippato dal `border-radius`**, così la barra non tocca
  l'angolo: per questo le note non usano più `.fab-modal-box`. Le **altre** `.fab-modal-*`
  (password, trivio del riordino, conferma dei campi) restano invariate.
- ⚠️ **`id` e classe `dyn-modal` si tolgono SUBITO, prima di animare**: le funzioni che aprono un
  editor si proteggono controllando l'id, e i selettori di 'modale aperta' ragionano sugli stessi
  id, quindi un fantasma bloccherebbe una riapertura immediata, e lascerebbe la pagina inerte e i
  tasti nudi zitti per tutta la dissolvenza.
- ⚠️⚠️ **UN SOLO VELO IN SCENA, E SEMPRE PIENO.** Chi entra mostra il velo, istantaneo; chi esce lo
  **perde** e tiene il solo box, che le passa sopra e dissolve. Tre dettagli indispensabili: **ombra
  spenta** sul box che esce, o il suo alone si somma a quello della modale sotto; **sfocatura
  spenta**, o sfoca il contenuto di chi entra; la classe di uscita si toglie **con l'animazione
  disattivata più un reflow**, o il velo della scheda ricompare per poi sfumare. ⚠️ Gli **`z-index`
  sono indispensabili**: a pari livello l'ordine di pittura segue il DOM, e la scheda, statica in
  pagina, finirebbe sotto una nota appena creata.
- ⚠️ **Tre tentativi scartati**: dissolvere **entrambe** le modali (due veli semitrasparenti
  sovrapposti compongono meno di uno pieno, e la pagina dietro si schiarisce); togliere di colpo la
  vecchia (un lampo senza nessuna finestra); lasciarla piena col suo velo (i veli si sommano, e il
  fondo scurisce).
- ⚠️ **Un passaggio si verifica coi FOTOGRAMMI, non col DOM**: una sonda su `getComputedStyle` non vede
  la pittura, e diceva 'nessun buco' mentre l'utente vedeva il lampo. Si registra uno screencast via
  CDP, un file per fotogramma, e si misura la luminanza media al centro del box, che separa
  nettamente il box in scena dal solo velo.
- ⚠️ **Anche una CHIUSURA CHE RITORNA è un passaggio**: il `×` di una nota aperta da una scheda torna
  alla scheda, e lo stesso fa il visualizzatore mappe; trattate come chiusure vere, sfumavano due
  veli insieme. ⚠️ In quel caso **lo scroll non si sblocca**, perché lo riblocca la destinazione, e uno
  sblocca-riblocca fa comparire e sparire la barra.
- ⚠️ **La dimensione del testo del viewer è FORZATA** a quella dell'elenco, per tutte le note e nei due
  temi: senza, erediterebbe corpo piccolo e opacità ridotta di `.fab-modal-box p`.
- ⚠️⚠️ **NON si desatura l'accento delle modali**: una release l'aveva reso grigio leggendo 'in tema
  scuro le modali sono gialle' come riferito ai **testi**, mentre l'utente parlava dello **SFONDO**.
  Regola: **tutto ciò che è cliccabile e non è un personaggio è sull'oro del tema** (titolo,
  sottotitoli, note collegate e ogni altro collegamento), i personaggi sulla propria tinta.
- ⚠️⚠️ **Il velo delle modali NON ha tinta, per un'illusione ottica misurata**: contro un velo freddo
  il fondo della modale, grigio puro, sembrava **giallo** (contrasto simultaneo), ed era questo che
  l'utente segnalava. I grigi nuovi sono a pari luminanza relativa dei vecchi, e la pagina dietro
  resta com'era.
- ⚠️ **Gli altri tre veli RESTANO TINTI, per decisione dell'utente**: modali admin in tema chiaro,
  visualizzatore immagini, ricerca admin. Non si ripropone. Se si torna sul tema, l'overlay della
  ricerca admin non si apre da script, e si confronta per campioni di colore calcolati, non per
  screenshot.
- ⚠️ **L'inertizzazione di sfondo si applica SOLO con una MODALE aperta**, non col solo Pannello,
  perché l'elenco degli elementi extra contiene il Pannello stesso. ⚠️ In **uscita** l'elenco si
  ripulisce sempre, o un `inert` appeso rende il FAB inservibile, e per la stessa ragione
  l'inertizzazione gira **prima** della guardia anti-doppio-lock.
  - **Inertizzare header, main e footer non basta**: FAB, tasti salto e cambio lingua sono fuori, e
    col `Tab` si raggiungevano attraverso il velo. Da qui l'elenco extra.
  - **Il focus trap vero serve comunque**: dall'ultimo elemento il `Tab` uscirebbe verso la chrome del
    browser. Agisce sulla modale **più in alto in ordine di documento**, che coincide con l'ordine di
    apertura, così le modali annidate funzionano da sé; ⚠️ i focusabili si filtrano per
    **visibilità**, o il giro si incastra sui controlli delle tab non attive.
- ⚠️ **L'audit axe con una scheda aperta si fa in un tema NATIVO** (aprendo già in quel tema):
  cambiare tema a scheda aperta non è raggiungibile dall'utente, perché il comando vive nel
  Pannello, coperto dalla scheda, e in test dà falsi rilievi transitori.
- ⚠️ **L'accento della nota vive in DUE proprietà, una per tema**: il tasto `T` non ricostruisce la
  nota aperta, e l'accento resterebbe quello del tema sbagliato. Passando di nota in nota l'accento
  del personaggio di provenienza resta per tutta la lettura.

### 🎨 Estetica e vincoli

- **Regola di stile: UTENTE = colorato, ADMIN = minimale**, e il discrimine è il **pubblico**, non il
  contenuto. ⚠️ Le modali di **riordino restano minimali** (decisione dell'utente): sono di servizio.
  Il visualizzatore mappe è un overlay a sé, fuori dalla dicotomia.
- **Tutte le modali entrano ed escono con lo stesso movimento** (richiesta dell'utente): stessa
  geometria, curve opposte, **0,2s per tutto**, velo, box e colonna, utente e admin. L'impianto resta
  doppio (transizioni per le modali utente, animazioni per le admin, che nascono già visibili), ma
  non si vede. ⚠️ **Le due animazioni sono una coppia speculare**: cambiando una durata si cambia la
  gemella.
- **Unica eccezione voluta: il cross-fade dei passaggi**, a 0,08s, **senza movimento**, perché il
  movimento scompari/riappari dà fastidio.
- ⚠️ **I rebuild TECNICI non animano** (cambio lingua, 'Ultimo salvato', cambio di telaio), o la
  colonna lampeggia: passano da un helper che alza il flag e lo riabbassa in `finally`, così una
  riapertura andata male non lo lascia acceso a sabotare la chiusura dopo.
- **I nomi di personaggio cliccabili prendono la tinta della famiglia di DESTINAZIONE, desaturata al
  55%**: la famiglia si riconosce e il colpo d'occhio resta quieto. ⚠️ Scartati il 100% e il 30%, dove
  Noldor e Mezzelfi diventavano indistinguibili. La desaturazione è estetica: l'aggiustamento AA
  viene dopo.
- **Un solo livello di intensità** (scelta dell'utente): la gerarchia la fanno corpo e peso. ⚠️ Sotto
  il **75%** di opacità il tema chiaro scende sotto soglia: per più stacco si agisce sul **peso**.
- ⚠️ **In tinta va SOLO il titolo del rimando**: `Leggi anche` / `See also` resta del colore del testo,
  e cliccabile resta tutta la riga.
- **Formato dei rimandi interni:** `Leggi anche → <strong>Titolo</strong>`, prefisso normale, titolo
  in grassetto, **allineati a sinistra** (richiesta dell'utente).
- **Il fondo del Pannello del FAB in tema scuro ha la saturazione DIMEZZATA**, a luminosità identica
  ('può restare un vago sentore di tinta gialla'): è l'unica superficie ampia con una tinta calda in
  scuro, e il chiaro non è toccato.

### Decisioni dell'utente da non ridiscutere

- **Protocollo quando l'utente passa una NUOVA nota** (regola durevole): si aggiunge la voce e si
  formatta **sul modello della nota dei Mezzelfi**.
  - **Personaggi in grassetto e cliccabili**, col marcatore `#{Nome}#` (o
    `#{Testo mostrato|NomeDati}#` se il nome in classifica differisce). Se il nome non è in
    classifica, ripiega sul grassetto semplice. ⚠️ Si marcano **tutte le occorrenze** di ciascun personaggio,
    **tranne** i nomi dentro i titoletti, che restano testo piano.
  - **Opere citate in CORSIVO**, e le righe fonte nella forma `(Fonte: <em>...</em>)`.
  - ⚠️ **L'inglese rispecchia l'italiano**: stesse spaziature, stessi a-capo, stessi titoletti, stesso
    ordine di paragrafi e fonti.
  - **Tipografia:** apici dritti e niente trattini lunghi, come per `dati.js`.
- **Doppia collocazione ammessa**: una nota può vivere sia nel viewer sia altrove, come 'Ascendenza e
  origine di Celeborn', replicata anche in calce alla sua descrizione.
