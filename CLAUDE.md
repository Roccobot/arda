# CLAUDE.md: le regole di `arda` per Claude

@AGENTS.md

> Le regole di questo repo valgono per tutti gli agenti e vivono in `AGENTS.md` (il nucleo) e in
> `Rules.md` (il testo completo). Claude Code carica da sé il solo `AGENTS.md`, con la riga qui
> sopra: `Rules.md` si legge per intero prima di lavorare su una cosa di cui parla, e i rimandi del
> nucleo dicono in quale sezione (scelta C1 dell'utente, 2026-10-10: prima lo caricava sempre, in
> ogni sessione che montava il repo, anche quando il lavoro era altrove).
> Qui resta solo quello che vale per Claude.

- Il protocollo di avvio di Claude (permessi, hook, domande iniziali, brief) vive in `Rules.md`
  del repo `roccobot.github.io`, che è l'hub, § '🚀 Protocollo di avvio'.
- Gli hook di `.claude/settings.json` chiamano il dispatcher `.memo/scripts/hooks.py` dell'hub:
  confrontano il badge di `index.src.html` con `datiVersion` e bloccano il commit se differiscono,
  ma l'entità del bump resta una scelta di chi lavora.
- Le regole del Worker arrivano da `worker/CLAUDE.md` quando si legge un file di quella cartella.
