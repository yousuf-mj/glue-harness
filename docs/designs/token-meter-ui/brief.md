# Token meter mod: UI brief

## What and who
- **What:** a Claude app mod that draws one thin, dark row above the prompt.
- **Who:** Yousuf, on a subscription, working in long sessions in the desktop app (and sometimes the mobile app).
- **The one job:** show at a glance how close I am to the 5-hour limit and the weekly limit, and keep the prompt cache warm when I want it to.

## Contents of the bar
- Gauge: 5-hour window, % used and time until it resets.
- Gauge: weekly (7-day) window, % used and time until it resets.
- Keep warm: an on/off toggle that pings just before the prompt cache expires, plus a **Ping once** button.
- Keep-warm cost: tokens and estimated cost per ping, and total spent on pings this session. Always labelled as an estimate.

## Data the mod can read (confirmed in the mod API)
- `$.session.usage().rateLimits`: `five_hour` and `seven_day` readings from the last API response. Empty off a subscription.
- `$.session.usage().cost.usd`: session cost estimate (no charge inside a subscription plan).
- `$.model.complete(...)` returns `usage` (incl. `cache_read_input_tokens`), so each ping's cost is measurable.
- Surface: `ui.render` on `AbovePrompt`, drawn on `desktop`, `terminal`, `vscode` and `mobile`. Elements are `Box`, `Text`, `Button` from `$.ui.resolve(e)`. No arc or SVG primitive: gauges are built from Boxes (the API says to draw usage-against-a-limit as a bar of Boxes, not `Progress`).

## Taste
- Lean: macOS menu-bar meters (iStat Menus, Stats). Tiny dense meters, number beside each, quiet until something runs high.
- Dark, thin, compact density.
- Colour does one job: state. Neutral when fine, amber when getting close, red when near the limit. No decorative colour.

## Constraints
- WCAG 2.2 AA: text 4.5:1, gauge fill and borders 3:1, never colour alone (always a % number).
- One row on desktop. Phone: may wrap to two short lines; touch targets 44px.
- Must sit inside the app's own dark theme without looking pasted on.

## Principles
1. **Quiet when fine, loud when close.** Colour and weight only rise as a limit approaches.
2. **Numbers beat shapes.** Every gauge shows its % and reset time; the gauge is for the glance, the number is for the decision.
3. **Cost is never hidden.** Keep-warm always shows what it is spending, labelled as an estimate.
4. **One line, no chrome.** No card, no border box, no heading. It reads as part of the app.
