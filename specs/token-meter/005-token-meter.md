# 005 · Token meter mod

Status: in-progress
Route: feature
Depends on: none

## Scope
A Claude app mod that draws one thin dark bar above the prompt. The bar shows usage against the 5-hour and weekly limits as ring gauges, with a pace marker. It also has a keep-warm toggle that pings the session's prompt cache before the cache expires, stops after 60 minutes idle, and pauses at 95% of the 5-hour limit.

## Out of scope
- Any limit other than `five_hour` and `seven_day` (a gateway's `spend_limit` is ignored)
- History or charts of past usage
- A one-off "Ping once" button (dropped in design)
- Publishing the mod to the organisation's library

## Design
- `docs/designs/current/claude-app/token-meter-bar.png` (every state, laptop and phone)
- Tokens, type, sizes and every component state: `docs/designs/token-meter-ui/design-system.md`. Layout and copy: `docs/designs/token-meter-ui/screens.md`. The build uses those hex values and copy exactly.

## Facts from the mod API (checked 2026-11-27, engine 2.1.331)
- Readings: `$.session.usage().rateLimits[]` gives `{kind, percentUsed, resetsAt}`, refreshed on `session.measure`.
- Cache lifetime: only subagents report `cacheTtl`; the main loop does not (corrected during the build). The mod uses 5 minutes, timed from the end of the last main-loop turn or the last answered ping.
- Ping: `$.model.fork({ prompt })` re-sends the session's own conversation, so it reads the cache and renews it. It returns `usage`, or `reason: 'nothing-to-fork'` before the first reply.
- Drawing: `AbovePrompt` with `Box`, `Text`, `Button` and `Svg` (desktop, mobile, VS Code; not the terminal). A `Button` holds only strings and `Text`, so the switch is an `Svg` beside a plain `Button` whose `label` names the state (corrected during the build).

## Acceptance criteria
- **AC-05.1** After a reply whose `rateLimits` include `five_hour` and `seven_day`, the bar shows, for each: a ring, the label ("5h" / "Week"; "Wk" on mobile), the % used as text, and the reset time. The ring and % are `fill-normal` (green) below 70, `fill-warning` from 70 to 89.9, and `fill-danger` at 90 and over. At 100 the % text reads "Limit reached" ("Limit" on mobile).
- **AC-05.2** Pace % = time elapsed in the window ÷ window length (300 min for `five_hour`, 7 days for `seven_day`), worked out from `resetsAt`. The ring draws a tick at pace %. When % used is more than pace % + 5, "▲N" follows the %, where N = round(used − pace). Otherwise nothing follows it.
- **AC-05.3** When `rateLimits` has no `five_hour` or `seven_day` reading, that gauge shows "–" with an empty ring and no tick. When neither has a reading, the toggle is disabled and the bar shows "Starts after your first reply" as visible text (corrected during the build: visible text instead of hover text, so it works on phone and with a screen reader).
- **AC-05.4** Keep warm always starts off in a new session. While it's on, no turn is running and it isn't paused, the mod calls `$.model.fork` once, 30 seconds before the 5-minute cache lifetime of the last main-loop turn or answered ping ends. The fork has no effort set, and its prompt asks for a one-word reply with no tools. The mod never pings while a turn is running.
- **AC-05.5** Keep warm turns itself off 60 minutes after your last message (a prompt from the composer, the app or Remote Control; scheduled, relayed and meta prompts don't count). Each new message, and turning keep warm on, restarts the 60 minutes. While it's on, the bar shows "off in N min". When it turns itself off, the bar shows "Turned off after 60 min idle · $X est." until the next prompt.
- **AC-05.6** When `five_hour` reaches 95 or more, keep warm sends no pings and shows "Paused at 5h limit (95%+)" on a `toggle-paused` track. It resumes when a later reading is below 95. Pressing the toggle while it's paused turns keep warm off.
- **AC-05.7** Each answered ping's cost is worked out from its `usage` at list price. The bar shows "$A per ping · $B so far, est." (A is the last ping, B the session total). A ping that isn't answered (`api-error` or `empty-reply`) shows "Ping failed · retrying in 1 min" in `fill-danger`, and the mod retries once after 1 minute. `nothing-to-fork` shows nothing and the mod waits for the next reply.
- **AC-05.8** The toggle is a `Button` whose `label` carries its state: "Keep warm, on, turns off in N minutes", "Keep warm, off", or "Keep warm, paused at the 5-hour limit". Each ring's `Svg` `alt` is the full sentence, e.g. "5-hour window 78% used, 14 points ahead of pace, resets in 1 hour 48 minutes". In the terminal surface the bar is one Text line: `5h 78% ▲14 1h48m · wk 34% · warm on $0.04 est.`

## Tests (`claude plugin test mods/token-meter`, through the hooks module with a fake clock and seeded `session.measure` readings)
- T1 → AC-05.1: readings at 42, 78, 93 and 100 give green, amber, red and "Limit reached" in the drawn tree
- T2 → AC-05.2: 78% used with 64% elapsed gives a tick at 64 and "▲14"; 44% used with 41% elapsed (3 ahead) gives no ▲
- T3 → AC-05.3: an empty `rateLimits` gives "–", no tick, and a disabled toggle
- T4 → AC-05.4: toggle on after a turn → one fork at 4 min 30 s; no fork while a turn is running; the toggle is off after a new session starts
- T5 → AC-05.5: a scheduled prompt doesn't restart the hour; a message at minute 50 does; 60 min with no message → toggle off and the idle text shown
- T6 → AC-05.6: `five_hour` at 95 → no fork and the paused text; reading 10 after the reset → pings resume; pressing while paused → off
- T7 → AC-05.7: fork usage gives the per-ping and total text; `api-error` → the failed text, then exactly one retry after 60 s
- T8 → AC-05.8: toggle labels for on, off and paused; `alt` text; terminal surface gives the one-line text

## Contracts
None outside the mod. The mod's own `$.state`: `keepWarm: 'off' | 'on' | 'paused'`, `lastPromptAt: number`, `pings: { count: number, lastUsd: number, totalUsd: number }`, `failedAt: number | null`.

## Default states
- Keep warm: off at session start.
- Gauges: "–" until the first reading.

## Files likely to change
- `mods/token-meter/.claude-plugin/plugin.json`, `hooks/hooks.json`, `hooks/register.tsx`, `hooks/register.test.tsx`, `types/index.d.ts`, `README.md` (how to load it with `--plugin-dir` or `CLAUDE_CODE_PLUGIN_DIRS`)
- Developed in the session's mods folder so it hot-reloads, then copied to `mods/token-meter/` for the PR

## Docs and guides to update
- `docs/designs/REGISTER.md`: the token meter row → 🟢 Live once the build matches the design (design-sync build check)
- `README.md` (repo root): add a `## Mods` section after `## Profiles` with one line: "`mods/token-meter/`: Claude app mod showing usage limits and a keep-warm toggle. Load it with `claude --plugin-dir mods/token-meter`."
