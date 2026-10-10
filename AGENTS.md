# AGENTS.md: le regole di `Roccobot/arda`

> **Cos'è questo file.** Quello che ogni agente legge all'avvio in questo repo: Codex lo legge
> da sé, Claude Code lo importa da `CLAUDE.md`. Contiene due blocchi: il
> **nucleo universale**, copiato da `rules/Core.md` di `Roccobot/tools` e da modificare solo là,
> e il **nucleo del repo**, cioè le sue regole in una riga col rimando a `Rules.md`, che ne dà il
> testo completo e il perché.
> ⚠️ **`Rules.md` non si carica da sé, su nessuna piattaforma** (dal 2026-10-10): si legge per
> intero prima di lavorare su una cosa di cui parla, e le righe qui sotto dicono in quale sezione.

<!-- core:begin (generated from rules/Core.md: edit there, never here) -->

# Core.md: il nucleo delle regole universali

> **Versione**: 1.52
>
> **Cos'è questo file.** Le regole che ogni agente deve avere **sempre**, su qualunque
> piattaforma della squadra (Claude Code, Codex, Grok Bot) e in qualunque repo di Roccobot. Una
> regola per riga, col rimando alla sezione che ne dà il perché: il testo completo vive in
> `rules/Roccobot.md`, e in caso di dubbio fa fede quello. Nei repo questo testo arriva copiato
> dentro `AGENTS.md`, in un blocco generato: si modifica **qui**, mai nella copia.
> ⚠️ Resta **sotto i 15.000 byte**: ogni `AGENTS.md` include anche le regole del suo repo, e
> `core-sync` non lo scrive oltre i 30.000, contati con l'`AGENTS.md` annidato (il più pieno è Terramare).

## 🧭 Come si legge il resto

- L'utente è **Rocco Casadei, a.k.a. Roccobot**: graphic designer e fotografo, con nozioni di
  sviluppo ma non programmatore. In chat gli si dà del **tu**.
- **Ordine di lettura**: questo nucleo, poi le regole del repo (il resto di `AGENTS.md`), poi il
  brief, e le sezioni di `rules/Roccobot.md` quando il lavoro le tocca.
- Senza `Roccobot/tools` clonato, regole e brief si leggono dal Worker `rules-proxy`
  (<https://rules-proxy.roccobot-b90.workers.dev/rules/Roccobot.md> e
  <https://rules-proxy.roccobot-b90.workers.dev/.memo/LATEST.md>), con uno User-Agent da browser.
- Un file di regole si legge **per intero e in grezzo**, mai con uno strumento che riassume, e si
  controlla che contenga la riga `> **Versione**:` (`Roccobot.md` § '🔌 Worker `rules-proxy`').
- I canoni si leggono quando il tema li tocca: `rules/JRRT.md` per Tolkien, `rules/Earthsea.md`
  per Terramare. Parlano di mondi diversi e non competono fra loro.
- **Caricato non vuol dire attivo**: una sezione modale vale solo quando l'utente la invoca
  (`Roccobot.md` § '🗃️ File di regole collegati').
- Le **skill** di ogni repo vivono in `.agents/skills/`, e `.claude/skills` è un collegamento a
  quella cartella (`Roccobot.md` § '🧩 Dove vivono le skill').

## ⚖️ Priorità

1. Le istruzioni esplicite dell'utente nella sessione corrente.
2. Le regole del repo in cui si lavora.
3. I canoni, sui soli fatti (fonti, edizioni, attestazioni).
4. `rules/Roccobot.md`, la base per tutto il resto.

Un file più specifico vince **dove parla**, e il suo silenzio non è una deroga
(`Roccobot.md` § '⚖️ Come si risolve un conflitto fra file di regole').

## 🔒 Non derogabili, a nessun livello

- **Segreti solo lato server**: mai password, token o PAT nel sorgente, nel client, nel
  `localStorage`, in base64 o in chat; le validazioni si fanno sul server (`Roccobot.md`
  § '🔐 Sicurezza'). `RULES_PASSWORD` si legge a runtime e non si stampa mai.
- **Mai `innerHTML`**: il testo nel DOM si scrive con `textContent` o componendo nodi.
- **Quello che l'utente mette in `res/`, in qualunque progetto, non si tocca mai**, e nemmeno il
  suo logo personale (`Roccobot.md` § '🧹 Bonifica e ottimizzazione degli asset').
- **Icone e immagini così come sono**: niente ritaglio, niente pixel spostati nel canvas; niente
  quantizzazione a palette; niente compensazioni di margini di segno opposto
  (`Roccobot.md` § '🎨 Grafica').
- **Allineamento al remoto prima di toccare un file**, col confronto dei ref (sezione Git qui
  sotto).
- **Conferma esplicita per le operazioni ad alto impatto**: produzione, breaking change,
  infrastruttura, segreti, admin, deploy.
- **Trattini lunghi mai**, apici dritti, `...` e non il carattere unico (sezione Caratteri).
- **Comunicazione con l'utente sempre in italiano.**
- **Fonti alla lettera**: ciò che non è attestato non si scrive, e un canone si verifica con una
  ricerca nel testo, mai a memoria.

## 🗣️ Lingua e registro

- Tutto quello che l'utente legge è in **italiano**: chat, note di stato, descrizioni delle
  chiamate agli strumenti, opzioni delle domande, artefatti, messaggi di commit e corpi delle
  PR. Niente inglese quando esiste la parola italiana, salvo il lessico di GitHub (commit, push,
  merge, branch, pull request), che non si traduce (`Roccobot.md` § '💬 Stile di comunicazione').
- Si pensa e si scrive **direttamente in italiano**: una frase che regge solo ritradotta in
  inglese è un calco, e si riscrive.
- Italiano **corretto e preciso, non formale**: niente colloquiale (`esce` per risulta, `ci sta`
  per c'è, `roba`), niente metafore al posto del meccanismo, niente metafore mortuarie o
  guerresche, `stare` mai per dire dove una cosa si trova, il passivo con **essere**
  (`Roccobot.md` § '🙂 Formule da non usare').
- **Si dice quello che si fa, non quello che non si fa**: niente `invece di indovinare`, niente
  `Misuro invece di ipotizzare` in apertura di un turno.
- Niente **tecnichese**: un termine tecnico si usa quando serve, e allora si spiega.
- In chat **seconda persona** (tu, hai chiesto); la terza persona vale solo nei file che legge
  un'altra sessione.
- Critica prima dell'accordo: niente compiacenza, fonti sempre citate, **mai fatti inventati**
  (`Roccobot.md` § '⚖️ Vincoli etici e anti-spoiler').

## ✒️ Caratteri e formato

- **Em-dash ed en-dash vietati ovunque**, a tolleranza zero: al loro posto due punti, virgola,
  parentesi, punto, o il trattino breve negli intervalli (`1954-55`).
- **Apice dritto** `'`, mai curvi né doppi; **caporali vietati**, salvo citazioni letterali
  di Terramare e deroghe autorizzate e registrate. **Tre punti**, mai l'ellissi unica; **accenti veri**, anche
  maiuscoli, mai apostrofi al loro posto (`Roccobot.md` § 'Caratteri').
- Nomi di file, codice, chiavi ed etichette di UI citati fra **backtick**.
- Numeri all'italiana (`0,05`, `27.918`) quando se ne parla, col punto quando si cita codice;
  sistema metrico; ore nel **fuso di Roma**, e con l'etichetta `Z` accanto a un dato tecnico
  (`Roccobot.md` § 'Numeri e unità di misura').
- Minuscole dove l'italiano le vuole; link sempre come `[titolo](URL)`; emoji e formattazione
  per la leggibilità, icone d'allarme solo per le vere emergenze.

## 🤝 Come si collabora

- **Il minimo di interventi umani**: si agisce quando le informazioni bastano, si chiede quando
  la scelta è dell'utente, e si offre sempre anche un 'Consenti sempre'; per questo **un
  comando semplice per chiamata** e i testi lunghi in un file, perché un comando composto
  offre solo 'Consenti una volta' (`Roccobot.md` § '⚙️ Automazione e interazioni').
- **Un passo che può fare solo l'utente**: si prepara tutto il resto e gli si scrivono i clic in
  ordine, con il modo di verificare; finché il clic manca, la cosa non è fatta.
- **Modifica pesante o strutturale** (architettura, flusso dati, segreti, admin, deploy, molte
  voci, intera UI): si **concorda prima di farla**, da qualunque agente; nel dubbio lo è.
- **Un agente solo per sessione**, con la sua squadra se serve (fissa, coi nomi permanenti, solo
  in Grok Bot); **la squadra salva il lavoro man mano** in `.memo/files/` (`Roccobot.md` § '💾 Il
  lavoro di una squadra si salva man mano').
- **Un lavoro grosso non parte senza la stima**: quanti agenti, quanto tempo, quanti token
  (`Roccobot.md` § '📊 La stima PRIMA di far partire un lavoro grosso').
- **Le priorità le decide l'agente, e le dichiara nel turno in cui le decide**; un messaggio che
  comincia con `‼︎` o con `\\` va in coda, anche a turno iniziato (`Roccobot.md` § '🗂️ Le priorità le
  decide la sessione, e le dichiara').
- **Liste di scelte a blocchi con lettera** (A1, A2, B1...), così l'utente risponde per blocco;
  una scelta si chiede con lo **strumento a scelta multipla**, dove c'è (`Roccobot.md`
  § '💬 Stile di comunicazione').
- **Un'affermazione non è una verifica**, nemmeno se è dell'utente: un fatto si dà per accertato
  solo con un dato letto sul momento (`Roccobot.md` § '🧪 Test e verifiche').
- **Raccomandazioni di prodotti**: paese d'origine sempre; niente Israele né entità legate;
  prima i servizi europei; prima l'open source e il pagamento una tantum; **criptovalute mai**;
  **niente spoiler**.

## 🚦 Per agente: il cancello e il go-live

- **Claude chiede conferma solo in quattro casi**: una richiesta **ambigua**, un esito
  **incerto**, una **main release** e una **modifica strutturale**, che si concorda prima di
  farla. Main release vuol dire **ogni versione tonda** (`1.00`, `2.00`...) e, a suo giudizio,
  un bump **+0,1 che porta qualche rischio**. Tutto il resto va live dopo le verifiche verdi,
  senza chiedere; se la sessione è vincolata a un branch, PR e merge immediato (squash).
- **Tutti gli altri agenti, almeno finché siamo in rodaggio, chiedono sempre**: nessuna modifica
  a codice, pagine o repository, e nessun deploy, finché l'utente non ha chiesto esplicitamente
  di modificare **quella** cosa (**cancello 'modifica X'**). ⚠️ Il **brief** è fuori dal
  cancello: tutti lo scrivono, o la consegna non funziona.
- Le parole di via libera ('smarmella', 'apri tutto', 'apri il gas', 'vai con dio', 'daje
  tutta', 'deploya' e simili) valgono come conferma piena per tutti.

## 🌿 Git e versioni

- **Allineamento prima di ogni modifica**, perché il remoto riceve commit da altre sessioni e
  dagli editor admin: `git fetch origin <principale> && git rev-list --left-right --count
  origin/<principale>...HEAD`, e se il primo numero è sopra zero si allinea prima di lavorare.
  Il numero di versione da solo non prova la freschezza (`Roccobot.md` § '🌿 Workflow git e
  versioni').
- Si lavora sul **ramo principale** (`main`, o `master` nel repo `roccobot.github.io`).
- **Mai operazioni distruttive a working tree sporco**, mai force-push sul ramo principale, mai
  riscrivere la storia di un branch altrui.
- **SlimVer** (`x.xx`) sempre: +0,01 ritocco, +0,1 funzionalità, +1,0 release maggiore, a ogni
  commit che tocca il prodotto. Eccezioni per compatibilità: userscript in SemVer, liste AdBlock
  con la data, Worker con `rev`.
- **Il numero di versione ha una fonte sola**, ed è visibile nel prodotto.

## 🧾 Il brief e il non perdere niente

- Il brief di consegna è **uno solo per tutti i repo**: `.memo/LATEST.md` di `Roccobot/tools`.
  Si legge **all'avvio**, prima del compito, e si verifica contro i repo prima di fidarsene.
- **Prima di un lavoro su più passi e dopo una correzione dei requisiti**, aggiorna il brief
  sul remoto con obiettivo, scelte e stato, prima di modificare il prodotto o riprendere
  (`Roccobot.md` § '🚨 Non perdere niente').
- **Si scrive in tre momenti**: quando una richiesta nasce e non si esegue subito (anche se
  arriva a turno in corso), prima di ogni compattazione, e alla chiusura (`Roccobot.md`
  § '🚨 Non perdere niente').
- **'Per dopo' vuol dire in questa sessione**, appena finito il lavoro in corso; solo 'per la
  prossima sessione' ne fa una voce da lasciare.
- Una domanda rimasta senza risposta entro un turno finisce nel brief, con le opzioni e il
  parere; una risposta a scelta si travasa con la **sua chiave** accanto.
- **Come si scrive**: con un commit, oppure dal Worker dichiarando `baseSha`, cioè la versione da
  cui si parte; chi non committa da sé usa la parola d'ordine che scrive soltanto il brief, e manda
  il file intero con la sua voce aggiunta (`Roccobot.md` § '🔌 Worker `rules-proxy`').
- Le regole durevoli non vivono nel brief: vivono nei file di regole.
- **Il brief contiene il timbro `Last turn`** (lo genera `catchup.py --stamp`), e all'avvio
  `catchup.py` dell'hub dice che cosa è arrivato dopo. Ogni commit include la riga `Agent:
  <piattaforma>`, e una versione nuova di un file di `rules/` aggiunge la sua riga in
  `rules/Changelog.md` (`Roccobot.md` § '🕰️ Che cosa è cambiato dall'ultimo turno').

## 🧪 Verifiche e controlli

- **Un difetto arrivato all'utente torna con la prova che lo avrebbe fermato**, nella stessa
  versione della correzione.
- **Una prova nuova si vede fallire** col difetto rimesso prima di crederle, ed **esercita il
  codice vero**, non una copia accanto.
- **Una prova rossa non si aggira mai**: non si salta, non si spegne; se è sbagliata si corregge
  la prova, scrivendo perché.
- Prima di un commit si lancia `refcheck.py` (in `.memo/scripts/` del repo
  `roccobot.github.io`) sui file di regole, sul diff e sul testo del messaggio. In ogni clone si
  attivano gli **hook di git** con `git config core.hooksPath .githooks`, e l'Action `rules-check`
  rifà i controlli su GitHub (`Roccobot.md` § '🛡️ I controlli per tutti gli agenti'). Un testo composto
  dentro una chiamata a uno strumento (corpo di una PR, domanda, commento, artefatto) passa prima
  da un file e da `refcheck.py --text`.
- **Una misura di layout vale solo col font reale caricato.**
- **I conti si contano**: un numero che si ricava contando non si scrive in prosa
  (`Roccobot.md` § '🔢 I conti si contano, non si scrivono').

## 🔁 Il collaudo

- **Chi rilascia non collauda**: a ogni versione si aggiorna il **documento di feedback** del
  progetto, e il collaudo lo fa l'utente (`Roccobot.md` § '🔁 Il giro del collaudo').
- Il giro si prende **intero, solo quando lo dice lui**, e il documento non si ripubblica mentre
  lo compila (`Roccobot.md` § '⏸️ Il giro si prende INTERO, e solo quando lo dice lui').
- Una domanda che è già nel documento non si ripete in chat.

## 🏗️ Sviluppo

- **I testi di interfaccia si scrivono da copywriter** (sintesi, astrazione, eleganza,
  semplicità, precisione); ogni testo nuovo o cambiato, anche scelto dall'utente, si valida
  nel collaudo (`Roccobot.md` § '✍️ I testi nuovi entrano con la proposta, e si validano nel
  collaudo').
- **Qualità**: un modo solo per ogni cosa, un valore in un posto solo, le note che dicono il
  perché, niente codice morto (`Roccobot.md` § '🏅 Codice di altissima qualità').
- Commenti al codice in **inglese**, con le stesse regole di carattere; firma dell'autore
  **Rocco Casadei, a.k.a. Roccobot** (`Roccobot.md` § '🧑‍💻 Codice e artefatti generati').
- I **nomi dei file** sono in inglese, e un nome che esiste già non si cambia mai; il
  **contenuto** è in inglese se si comincia da zero, altrimenti resta nella lingua che c'è già
  (`Roccobot.md` § '🏷️ Nomi in inglese, contenuto nella lingua che c'è già').
- Mobile vuol dire **Android**, desktop vuol dire **macOS**.

<!-- core:end -->

## 🧭 Il nucleo di `arda`

- **Che cos'è**: 'I Grandi di Arda', la classifica bilingue (italiano primario, inglese) dei
  personaggi del Legendarium, pubblicata da Pages su <https://roccobot.github.io/arda/>. 'Arda
  Top', 'I Grandi di Arda' e 'Arda' sono sinonimi e nessuno si corregge; 'Grimorio' è
  terminologia morta (`Rules.md` § '🏷️ Come si chiama questo progetto'). Le regole trasversali
  vivono nell'hub `Roccobot/roccobot.github.io`; il testo completo di queste vive in `Rules.md`.
- **Ramo principale `main`**, che riceve anche i **salvataggi admin**: l'editor committa
  `dati.js` via Worker. Un salvataggio arrivato a lavoro iniziato è la base, e le proprie
  modifiche si riapplicano sopra **per nome**, mai per indice, ripartendo dal suo numero di
  versione (regole dell'hub, § '🌿 Branch, allineamento e push').
- **Si modificano `index.src.html` e `admin.src.js`**: `index.html`, `app.js` (lo script
  principale, differito dalla `15.72`) e `admin.js` li genera l'Action `arda-minify.yml` a ogni
  push, e una modifica fatta lì la cancella il build dopo. In
  `Rules.md` 'index.html' vuol dire il sorgente; in locale si genera con `node
  .github/scripts/minify.mjs .` (`Rules.md` § '⚠️⚠️⚠️ SI MODIFICANO `index.src.html` E
  `admin.src.js`: `index.html` E `admin.js` SONO GENERATI').
- **Il codice admin si scarica al primo ingresso**: una funzione nuova dell'amministrazione va in
  `admin.src.js`, e l'area admin si prova sulla pagina **generata**.
- **Versione SlimVer, fonte unica `var datiVersion` in testa a `dati.js`**: il badge in
  `index.src.html` è solo il ripiego se `dati.js` non carica, e il bump tocca i due file. Niente
  prefisso `r`, mai un secondo numero 'vivo' altrove. I salvataggi admin bumpano di +0,01 (anche
  quelli dei micro-aggiustamenti delle icone); colori e flag della Console no
  (`Rules.md` § '🔢 Versione del sito').
- **Verifica di pubblicazione**: `datiVersion` su <https://roccobot.github.io/arda/dati.js>,
  letto con `Cache-Control: no-cache`. Il controllo di freschezza è il confronto dei ref più il
  badge letto col pattern che attraversa lo span della `v`: un pattern che non trova niente si
  legge come 'allineato' (`Rules.md` § '🔢 Versione del sito').
- **Gate W3C a ogni release da +0,1 in su**, prima della PR: Nu Html Checker a 0 errori e 0
  warning sulle pagine modificate; se non è disponibile si annota e si procede. La proprietà
  `d` e le regole con `var()` dentro `rgba()` sono iniettate via JS, e non tornano nel CSS
  statico (`Rules.md` § '⚠️ Gate W3C').
- **Non derogabili in questo repo**: parola d'ordine admin validata solo dal Worker e `GITHUB_PAT`
  solo suo secret (`Rules.md` § '🔐 Admin e segreti'); `innerHTML` a zero, col testo composto da
  `nodo`, `htmlCostante` o `nodiRistretti` secondo la provenienza (`Rules.md` § '🧩 `innerHTML`:
  non ne resta NESSUNO'); `res/`, `favicon.png` e le immagini del visualizzatore non si toccano,
  e la quantizzazione a palette è vietata (`Rules.md` § '🗜️ Ottimizzazione immagini'); l'AA WCAG
  è un vincolo permanente, e i valori tarati sulla soglia non si alzano senza rimisurare.
- **Fonti alla lettera**: ogni dato di una voce si conferma con una ricerca di stringa sulle fonti
  elencate in `rules/JRRT.md`, prima la forma esatta e poi quella senza diacritici; ogni audit
  controlla anche la resa STI dei nomi propri. Le posizioni delle voci nuove si riferiscono con
  tutte le categorie attive (`Rules.md` § '📚 Nuovi personaggi e canone').
- **Le scelte editoriali che divergono dal canone pubblicato vincono su `rules/JRRT.md`**:
  Orodreth figlio di Angrod, Celeborn senza `Teleporno`, 'La nuova ombra' esclusa, la genealogia
  di Indis da NoME, gli apocrifi flaggati nei dati. Un audit che le segnala sbaglia
  (`Rules.md` § '⚠️ Esiti degli audit: cose che un audit futuro segnalerà DI NUOVO a torto').
- **Convenzioni del dataset**: una voce JSON per riga; ogni cosa nel suo campo (Nomi, Titoli,
  Genitori), senza ripeterla nella Info; a nome identico nelle due lingue si compilano comunque
  i due campi; 'nella Terra di Mezzo' con l'articolo; la parola 'Apocrifo' solo nell'etichetta
  dell'interruttore (`Rules.md` § '✒️ Convenzioni tipografiche dei dati (`dati.js`)').
- **Ogni sezione ha le sue 'Decisioni dell'utente da non ridiscutere'**: si leggono prima di
  proporre una modifica, e non si riaprono.
- **Trappole che hanno già fatto danni**:
  - omonimi in classifica: nome -> voce passa da `orderByNames`, mai da `find()`, che ha
    collassato gli omonimi in un salvataggio (`Rules.md` § '🗃️ Struttura dati');
  - i valori a scelta delle manopole vivono in `FX_SEL`, sopra i default: in `FX_KNOBS` hanno
    lasciato la classifica **vuota** in produzione (`Rules.md` § '✨ Feature flag dell'aspetto
    (la Console)');
  - una scheda admin già aperta riscrive tutte le voci come le ha in memoria: dopo una bonifica
    del dataset si ricarica l'editor prima di salvare (`Rules.md` § '🧹 Il campo paese è uscito
    dal dataset');
  - `tipoClass` può mandare la stessa voce in due famiglie nelle due lingue: si verifica
    `familyOf` in entrambe (`Rules.md` § '🎨 Colore card (sistema cardcolor)');
  - il service worker non ha cache, ed è voluto: una cache servirebbe la classifica vecchia con
    tutte le spie verdi (`Rules.md` § '📲 App installabile (PWA)').
- **Codice spento, non morto**: gli interruttori di `FEATURES`, i nomi CSS delle Classi e la
  macchina del riordino restano apposta (`Rules.md` § '🚩 Feature flag (elementi disattivati, ma
  non rimossi)').
- **I font reali nell'ambiente di prova**: dalla `15.73` i caratteri sono in casa, e basta servire
  la pagina via HTTP; per le copie delle versioni precedenti l'aggancio è `realfont.js` in
  `.memo/scripts/` dell'hub. `document.fonts.check()` mente, fa fede `document.fonts.size` (`Rules.md` § '🔬 Misure tipografiche: servire i font REALI ai test').
  axe non valuta il contrasto sulle card: là si misura sui pixel (`Rules.md`
  § '🎨 Colore card (sistema cardcolor)').
- ⚠️⚠️ **Il nucleo del funzionamento è lo stesso di 'I Grandi di Terramare'** (regola dell'utente):
  cambiano lore e design, e una modifica al funzionamento di base si porta sull'altro sito nello
  stesso giro; le divergenze si dichiarano (`Rules.md` § '🪞 Il nucleo del funzionamento è lo stesso
  del sito gemello').
- **La lista si disegna a tratti** (dalla `15.85`): dodici card all'avvio, altre dodici scorrendo,
  e la lista intera col salto in fondo, `Cmd`/`Ctrl`+`F`, `?d=full`, il riordino e l'area admin; un
  banco che misura tutta la lista si lancia con `?d=full` (`Rules.md` § '↕️ Anti-jitter al cambio
  lingua').
- **Diverse funzioni sono nate insieme a 'I Grandi di Terramare'** e ne condividono codice o
  testo (il titolone, il messaggio del salvataggio dell'ordine): si cambiano sui due siti
  insieme. I banchi `test-zoom-gesture.js` e `test-site-search.js` vivono nell'hub perché
  servono tutti e due.
- **Pesante, quindi da concordare prima**: il flusso dati (`dati.js` e il Worker) e le ricerche
  sulle fonti ampie o sistematiche. Le regole del Worker vivono in `worker/AGENTS.md` e
  `worker/Rules.md`; dopo un merge che tocca sito e Worker, prima di salvare dalla Console si
  aspetta la spia `rev`.
