# Token meter mod: screens

One surface: the token meter bar, drawn above the prompt. Visual reference: `screens/states.png` (built by `screens/build.py` into `screens/states.html`). Tokens and component states: `design-system.md`.

## Layout

### Laptop (desktop app, chat column about 780px)
One row, 28px, on a `bar-bg` strip (radius 8, 4px / 10px padding):

`[ring] 5h 78% ▲14 1h 48m` · 16px · `[ring] Week 34% Thu 09:00` · flexible space · `[toggle] Keep warm $0.003 per ping · $0.04 so far, est.`

- Rings 20px. Reset time: under 24 hours, a countdown ("1h 48m"); otherwise day and time ("Thu 09:00").
- Narrow (below about 600px): drop the cost, then the weekly reset, then the 5-hour reset. Rings, % values and the toggle always stay.

### Phone (mobile app, 375px)
Two rows on one `bar-bg` strip, 13px text:
1. 28px: `[ring] 5h 78% ▲14 1h 48m` on the left, `[ring] Wk 34% Thu 09:00` on the right. Rings 24px.
2. 44px, with a 1px divider above: `[toggle] Keep warm` on the left, the status ("off in 42 min", "5h at 95%", "retry in 1 min") on the right. The whole row toggles.
3. 28px, with a 1px divider above: "$0.003 per ping · $0.04 so far, est." Visible whenever keep warm has run this session.
- Weekly reset shows "Thu 09:00". It shortens to "Thu" only when a ▲ makes the first row too long.

### Terminal (no Svg)
One line of Text, no rings: `5h 78% ▲ 1h48m · wk 34% · warm on $0.04 est.`. The ▲ appears when usage is ahead of pace. % text uses the theme's `warning` / `error` keys at the same thresholds.

## States
Each row below is drawn in `screens/states.png` for laptop. Phone draws S2, S3, S4, S5, S7 (reset), S6 and S9.

| # | State | 5h gauge | Week gauge | Keep warm |
| --- | --- | --- | --- | --- |
| S1 | Normal, warm off | 42%, green | 34%, green | Off, no cost |
| S2 | Warning, warm on | 78%, amber | 34% | On, per-ping and total cost |
| S3 | Danger, pinging | 93%, red | 71%, amber | On, "pinging… · off in 40 min", knob dimmed |
| S4 | Limit reached | "Limit reached", full red ring, reset kept | 76% | "Paused at 5h limit (95%+)"; pressing turns it off |
| S5 | Ping failed | 61% | 34% | "Ping failed · retrying in 1 min · off in 38 min" in red |
| S6 | No reading | "–", empty ring, no tick | "–" | Disabled, 40% opacity |
| S7 | Window just reset | "0%" muted, tick at 12 o'clock | 34% | Focused: 2px focus ring |
| S8 | About to stop | 52% | 34% | On, "off in 3 min" |
| S9 | Stopped after idle | 52% | 34% | Off, "Turned off after 60 min idle · $0.07 est." |

## Behaviour the visuals depend on
- Readings update after each reply (`session.measure`), not on a timer. The countdown text updates once a minute from `resetsAt`.
- Keep warm pings when the cache has been idle for 4 minutes 30 seconds, ahead of a 5-minute cache expiry. **Not yet confirmed:** the cache expiry for this account. `elephant-plan` must check it.
- **Idle stop (decided 2026-11-27):** keep warm turns itself off after 60 minutes with no message from Yousuf. The countdown ("off in 42 min") shows while it's on. Any message resets the 60 minutes. It also stops when the session closes.
- **Auto-pause (decided 2026-11-27):** keep warm pauses by itself when the 5-hour window reaches 95%, and resumes after the reset. Pressing the toggle while paused turns keep warm off.
- Worst case at 60 minutes: about 13 pings (one every 4 min 30 s).
- The toggle always starts off in a new session, so a forgotten toggle can't carry over. The running total resets with each session.

## To confirm in the mod API before the spec (from review)
`elephant-plan` must check each item. If one is missing, the fallback here is what gets built.
- Hover text on a Box (`BoxHoverProps` exists in the API): the gauge sentence. Fallback: `Svg` `alt` only.
- `$.ui.toast` reaching screen readers. Fallback: put the change in the toggle label, where it is read on focus.
- A drawn switch inside `Button`, with a custom focus outline. Fallback: a `Button` labelled "Keep warm: on" / "Keep warm: off" using the app's own focus ring.
- Reduced-motion detection. Fallback: no ring animation.

## Copy
- Labels: "5h", "Week" (phone "Wk"), "Keep warm".
- Hover on a gauge: "5-hour window: 78% used, 64% of the time gone. Resets 14:32 (in 1h 48m)."
- Hover on cost: "Estimated at API list price. On your subscription, pings use your plan, not money."
- Disabled hover: "Starts after your first reply."
