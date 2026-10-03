# CLAUDE.md: le regole di `arda` per Claude

@AGENTS.md
@Rules.md

> Le regole di questo repo valgono per tutti gli agenti e vivono in `AGENTS.md` (il nucleo) e in
> `Rules.md` (il testo completo): Claude Code le carica tutte e due con le due righe qui sopra.
> Qui resta solo quello che vale per Claude.

- Il protocollo di avvio di Claude (permessi, hook, domande iniziali, brief) vive in `Rules.md`
  del repo `roccobot.github.io`, che è l'hub, § '🚀 Protocollo di avvio'.
- Gli hook di `.claude/settings.json` chiamano il dispatcher `.memo/scripts/hooks.py` dell'hub:
  confrontano il badge di `index.src.html` con `datiVersion` e bloccano il commit se differiscono,
  ma l'entità del bump resta una scelta di chi lavora.
- Le regole del Worker arrivano da `worker/CLAUDE.md` quando si legge un file di quella cartella.
