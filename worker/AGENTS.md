# AGENTS.md: le regole di `worker/` (Worker di amministrazione)

> **Cos'è questo file.** Il nucleo delle regole del Worker `arda-admin-proxy`, una per riga col
> rimando a `worker/Rules.md`, che ne dà il testo completo e il perché. Il nucleo universale non
> è ripetuto qui: arriva dall'`AGENTS.md` alla radice del repo, che si legge prima di
> questo. Claude Code lo importa da `worker/CLAUDE.md`.

## 🧭 Il nucleo di `worker/`

- **I Worker sono due, uno per sito, e la separazione è la salvaguardia**: `arda-admin-proxy`
  vive qui e scrive il solo `dati.js` alla radice di questo repo; il gemello
  `earthsea-admin-proxy` vive in `worker/` del repo `Roccobot/earthsea`, con una copia di queste
  regole. Chi corregge un difetto in uno guarda se c'è anche nell'altro, e chi corregge una copia
  delle regole guarda l'altra (`worker/Rules.md` § '⚠️⚠️ I Worker sono DUE, e la separazione è la
  salvaguardia').
- **Le quattro differenze volute non si uniformano**: `FILE_PATH`, `DATI_MIN` (50 qui, 5 su
  Terramare), il bump bi-formato qui contro la sola SlimVer là, e la riscrittura di Terramare che
  conserva i commenti. Anche l'action `translate` è solo di questo Worker, e non si copia
  sull'altro.
- **Come salva**: valida, legge lo SHA di `dati.js` con un GET e riscrive l'intero file con un PUT
  sulla Contents API, race-safe. `REPO` e `FILE_PATH` puntano al `dati.js` alla radice di
  `Roccobot/arda`: se il file si sposta, si riallineano qui (`worker/Rules.md` § '🔌 Il Worker
  `arda-admin-proxy`').
- **Una config che il salvataggio non invia si preserva**, una malformata si rifiuta con un 400
  parlante; il Worker controlla la forma, i limiti veri li applica il client. Il formato del file
  vive in `Rules.md` alla radice, § '🗃️ Struttura dati'.
- **Bump**: +0,01 con riporto, bi-formato per il vecchio SemVer; i salvataggi di colori e flag
  passano `keepVersion` e la versione non si muove.
- **`rev` si alza a ogni modifica sostanziale**: è il solo modo di sapere quale codice è attivo.
  Il valore corrente non si scrive nelle regole, si legge con un GET.
- **Si ridistribuisce da sé** via la Git integration di Cloudflare a ogni push su `main` che tocca
  `worker/`, coi percorsi osservati limitati a `worker/*`, o ogni salvataggio admin
  ricostruirebbe il Worker; `wrangler deploy` resta solo come ripiego manuale.
- **L'autenticazione è fail-closed**: secret assente o vuoto -> `no-admin-password` e 500, mai un
  `ok`. Si prova con un POST `{"action":"auth","password":""}`, non leggendo il codice
  (`worker/Rules.md` § '🔓 La serratura è FAIL-CLOSED, e si è imparato sul campo').
- **Il rate limiter è fail-open, ed è voluto**: le due politiche rispondono a domande diverse e non
  si uniformano.
- **Segreti**: `ADMIN_PASSWORD` e `GITHUB_PAT` vivono solo come secret del Worker in dashboard,
  la parola d'ordine si confronta a tempo costante e solo lato server; l'URL del Worker non è un
  segreto. Da non confondere con `rules-proxy`, che vive in `Roccobot/tools` (`worker/Rules.md`
  § '🔐 Segreti').
- **La spia diagnostica**: un GET risponde `{ok:false, error:'method', rev, rl, pw, pat, gem}`, coi
  secret come soli booleani, mai un pezzo del valore né la lunghezza; `gem:false` spegne solo la
  traduzione. Fra i due gemelli distingue la spia `site` (`worker/Rules.md` § '⚠️ Trappole').
- **Il limitatore è un Durable Object** (`RateLimiter`, 20 richieste in 60 s per IP): il binding
  nativo `ratelimit` sotto Workers Builds non fa niente, un contatore in KV è troppo lento e uno in
  memoria non conta. Non si riprovano.
- **Race di deploy fra sito e Worker**: dopo un merge che tocca tutti e due, prima di salvare dal
  pannello si verifica la spia `rev`, o la config nuova non si scrive e la vecchia si perde. Il
  commento 'Deployment successful' del bot Cloudflare su una PR è la build del branch.
- **Toccare il Worker è una modifica pesante**: si concorda prima di farla.
