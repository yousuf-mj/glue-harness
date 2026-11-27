# Token meter mod: design system

Direction chosen: **A · Menu-bar meters, with ring gauges and a pace tick** (2026-11-27). Picked because it was the quietest and closest to the iStat-style reference. Yousuf asked for rings instead of bars and kept the pace tick from Direction C. **Ping once** was dropped: the keep-warm toggle covers it.

## How the bar is built (mod constraints)
- Drawn by a `ui.render` hook on `AbovePrompt`. Elements: `Box`, `Text`, `Button`, `Svg` from `$.ui.resolve(e)`.
- Rings are `Svg` (desktop, mobile, VS Code). The terminal has no `Svg`, so it gets the text fallback (see screens.md).
- An `Svg` is drawn as an image and can't read the app's CSS, so every colour below is a fixed hex value. The bar is always dark, even when the app is in light mode. That is deliberate: the brief asks for a dark bar.
- **Change from the directions:** the bar now has its own `bar-bg` strip (radius 8) so it stays dark on a light app. On the dark app it reads as a slightly deeper band.

## Colour tokens (dark only)
Components use these semantic tokens only. Scales (50-950, OKLCH, even lightness steps) are in `tokens.json`.

| Token | Hex | OKLCH | Job |
| --- | --- | --- | --- |
| `bar-bg` | #181613 | 0.20 0.006 70 | The strip behind the bar |
| `track` | #373532 | 0.33 0.006 70 | Unfilled part of a ring |
| `text` | #f3f1ee | 0.96 0.005 80 | Values (78%, Keep warm) |
| `text-muted` | #aeaaa5 | 0.74 0.008 70 | Labels, reset times, cost |
| `fill-normal` | #4eb068 | 0.68 0.14 150 | Ring fill and % text below 70% (green, darker than amber so 70% reads as a step up in brightness, not only a hue change) |
| `fill-warning` | #f4af41 | 0.80 0.145 75 | Ring fill and % text, 70-89.9% |
| `fill-danger` | #ff6870 | 0.71 0.185 20 | Ring fill and % text, 90% and over; failed ping |
| `pace-tick` | #f9f8f6 | 0.98 0.003 80 | Pace tick, with a 1.5px `bar-bg` halo |
| `toggle-on` | #c1bdb8 | 0.80 0.008 70 | Toggle track when on (light grey: only usage states get colour) |
| `toggle-paused` | #78746f | 0.56 0.008 70 | Toggle track when paused at the limit |
| `toggle-knob-on` | #181613 | 0.20 0.006 70 | Toggle knob when on |
| `toggle-knob-off` | #ffffff | - | Toggle knob when off |
| `toggle-off` | #44423f | 0.38 0.006 70 | Toggle track when off |
| `toggle-off-border` | #898581 | 0.62 0.008 70 | Toggle outline when off |
| `focus-ring` | #8fd5fd | 0.84 0.09 235 | 2px focus outline, 2px offset |

**How much colour:** every gauge always shows its state colour: green when fine, amber when close, red near the limit (changed 2026-11-27 at Yousuf's request; was neutral grey when fine). The toggle is light grey when on (changed after review: clay looked too close to the red danger colour). Colour is never decoration.

### Contrast (computed in code, `check_contrast.py`, run `python3 check_contrast.py tokens.json`, WCAG 2.x formula)
| Pair | Ratio | Needs | Result |
| --- | --- | --- | --- |
| text on bar-bg | 16.12 | 4.5 | pass |
| text-muted on bar-bg | 7.84 | 4.5 | pass |
| fill-warning (as % text) on bar-bg | 9.51 | 4.5 | pass |
| fill-danger (as % text) on bar-bg | 6.44 | 4.5 | pass |
| fill-normal vs track | 4.50 | 3 | pass |
| fill-warning vs track | 6.42 | 3 | pass |
| fill-danger vs track | 4.35 | 3 | pass |
| fill-normal (ring and % text) on bar-bg | 6.66 | 4.5 | pass |
| toggle-on on bar-bg | 9.69 | 3 | pass |
| toggle-knob-on on toggle-on | 9.69 | 3 | pass |
| toggle-paused on bar-bg, and knob on toggle-paused | 3.89 | 3 | pass |
| toggle-off-border on bar-bg | 4.97 | 3 | pass |
| focus-ring on bar-bg | 11.26 | 3 | pass |
| pace-tick on bar-bg / track | 17.1 / 11.54 | 3 | pass |

The pace tick crosses the coloured fill, where white on amber would fail (about 1.6:1). The 1.5px `bar-bg` halo around the tick fixes this: the tick is always judged against the halo (17:1).

## Type
One size per device. Labels and values differ by colour and weight, not size.

| Size | Job | Laptop | Phone |
| --- | --- | --- | --- |
| 12px / 16px line, tabular numerals | Every piece of text in the bar | yes | - |
| 13px / 18px line, tabular numerals | Every piece of text in the bar | - | yes (phone text needs to be bigger) |

Weights: regular for labels and times; medium for % values; semibold for % values in warning or danger. Font: the app's own UI font (the mod doesn't set one).

## Spacing, size and shape
- Base unit 4px. Inside a gauge group: 6px. Between groups: 16px. Strip padding: 4px vertical, 10px horizontal.
- Laptop: one row, 28px tall. Phone: two rows, 28px (gauges) and 44px (keep warm).
- Ring: 20px laptop, 24px phone. Stroke 3px, round caps, starts at 12 o'clock, fills clockwise.
- Pace tick: 1.5px wide, crosses the ring from 3px inside to 3px outside, round caps.
- Toggle: 26 x 15px laptop. On phone the whole keep-warm row (44px tall, full width) is the tap target. The cost sits on its own 28px line beneath it, not behind a long-press.
- Radius: strip 8px, toggle 8px (pill). No borders and no shadows.
- Motion: ring fill eases over 300ms when a reading changes. While a ping runs, the toggle knob dims to 60% (no spinner). Motion is off when the OS asks for reduced motion.

## Thresholds and pace
- Normal (green) below 70%, warning 70-89.9%, danger 90% and over. Shown on the ring fill and the % text. The % number is always shown, so colour never carries the meaning alone.
- Pace % = time elapsed in the window ÷ window length. 5-hour window = 300 minutes; weekly window = 7 days. Both are worked out from `resetsAt`.
- "Ahead of pace" means used % is more than pace % + 5. Then "▲14" (the points ahead) follows the %, in the same colour, on every device. When on pace or behind, nothing shows. The hover text and `alt` say it in words.

## Components and states

### Gauge (ring + label + % + reset)
| State | Look |
| --- | --- |
| Normal | `fill-normal` (green) ring, % in `fill-normal` medium |
| Warning | `fill-warning` ring, % in `fill-warning` semibold |
| Danger | `fill-danger` ring, % in `fill-danger` semibold |
| Limit reached (100%) | full `fill-danger` ring, text "Limit reached", reset time stays |
| No reading | empty `track` ring with no tick, % shows "–", reset time hidden. Happens before the first reply, or when not on a subscription |
| Reset passed | ring and tick drawn at 0, % shows "0%" in `text-muted`, until the next reply brings a new reading |
| Hover (desktop) | Box hover shows the full sentence, e.g. "5-hour window: 78% used, 64% of the time gone. Resets 14:32 (in 1h 48m)." |
| Focus | not focusable (read-only). The full sentence is the `Svg` `alt`, e.g. "5-hour window 78% used, 14 points ahead of pace, resets in 1 hour 48 minutes" |

### Keep-warm toggle
| State | Look |
| --- | --- |
| Off | `toggle-off` track, knob left, "Keep warm" in `text-muted`, no cost |
| On, waiting | `toggle-on` track, dark knob, knob right, "Keep warm" in `text`, then "$0.003 per ping · $0.04 so far, est. · off in 42 min" in `text-muted` |
| Stopped after idle | Off look; text "Turned off after 60 min idle · $0.07 est." in `text-muted` until the next message |
| Pinging | as On, knob at 60% opacity, text "pinging… · off in 40 min" (the countdown stays) |
| Ping failed | as On, text "Ping failed · retrying in 1 min · off in 38 min" in `fill-danger` |
| Paused at limit | solid `toggle-paused` track (#78746f, 3.89:1), dark knob right (still on, but held), text "Paused at 5h limit (95%+)" in `text-muted`. Pressing it turns keep warm off. Pinging stops by itself so it can't use the last of your limit |
| Hover | track 8% lighter |
| Focus-visible | 2px `focus-ring` outline, 2px offset, around the toggle and label together |
| Disabled (no reading yet) | 40% opacity, hover text "Starts after your first reply" |

## Screen reader
- The mod's `Button` has no pressed or switch property, so the state goes in the toggle's `label`: "Keep warm, on, turns off in 42 minutes", "Keep warm, off", "Keep warm, paused at the 5-hour limit".
- Changes to "Ping failed", "Paused" and "Turned off after 60 min idle" are also sent as a `$.ui.toast`, so they're announced even when focus is elsewhere.

## Rules
- Never colour alone: every gauge shows its % or a word.
- Cost is always labelled "est." On a subscription, pings come out of your plan, not your bill. The hover text on the cost says so.
- Truncation: the "off in N min" countdown and any ▲ never drop. When the row is too narrow, drop in this order: the per-ping cost, the running total, the weekly reset time down to the day ("Thu"), then the weekly reset time, then the 5-hour reset time. The rings, % values and toggle never drop.
- Touch: 44px minimum targets on phone. Laptop toggle hit area pads to 24px tall.
