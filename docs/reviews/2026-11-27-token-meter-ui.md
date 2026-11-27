# Goldfish review: token meter UI (stage mode, ui-design)

Date: 2026-11-27 · Folder: docs/designs/token-meter-ui/ · No review packs in repo; no second-model CLI available.

## Round 1: design quality + accessibility (one reviewer)
- FIX 6: brief contradicted itself on Svg (doc fixed, the rings are buildable); pace had no words (added ▲N); green and amber equally bright (green darkened); clay toggle looked like danger (grey toggle); toggle state not announced (state in label); phone states missing (added 4, cost made visible).
- CONTEST 2: dark strip reads as a card (Yousuf asked for a dark bar); paused toggle faint (text carries it; superseded in round 2).
- ASK 0. Yousuf approved all six.

## Round 2: blocker re-check
- FIX 3: paused toggle at 2.93:1 (new solid token, 3.89:1); paused copy said 95% while the gauge said 100% (copy now "Paused at 5h limit (95%+)", press turns it off); countdown hidden in some on states (kept).
- ASK 1: auto-pause at 95%. Yousuf said yes.
- Recorded for elephant-plan: the API features to confirm, with fallbacks (screens.md).

**Finding most worth having:** the pace tick had no words, so the design's main idea ("am I burning too fast?") was invisible on phone and to screen readers.
