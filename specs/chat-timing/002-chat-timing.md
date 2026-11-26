# 002 · Time Claude app requests

Status: done
Route: feature
Depends on: 001 (stacked on its branch: shares the `$G/.harness/` install step)

## Scope
In the Claude app, Claude writes the same `prompt` and `stop` telemetry lines the Claude Code hooks write, so the journal's Speed review covers chat requests too. Times are a lower bound: from the first tool call to the last.

## Out of scope
- Timing replies that use no tools
- Per-tool timing in the app (`pre`/`post` events)
- Reading the app's own request timers

## Acceptance criteria
- AC-02.1 `mark.py <glue> prompt "<text>"` and `mark.py <glue> stop` append one JSON line to `$G/telemetry/YYYY-MM-DD.jsonl` (London date) with `ts`, `ms`, `event` and `session: "cowork"`; `prompt` lines add `prompt` (first 60 characters, whitespace squashed). Quotes and newlines in the text never break the JSON.
- AC-02.2 `mark.py` does nothing and exits 0 when `<glue>` doesn't exist, like `telemetry.py`.
- AC-02.3 The `me` skill's "Make time visible" rule says: in the Claude app, when Glue is a folder, run `mark.py … prompt` in the first device shell call of a request and `mark.py … stop` in the last, inside commands already being run (no extra calls).
- AC-02.4 `telemetry_report.py` marks `cowork` requests with " (app, lower bound)" and shows `-` for Tools and Model.
- AC-02.5 A `cowork` request with no `stop` ends at the last `cowork` event before the next `prompt` (not at the next prompt), and is still marked interrupted.
- AC-02.6 In the Claude app, `mark.py` and `telemetry_report.py` are installed into `$G/.harness/telemetry/` the same way as the people scripts (refreshed when their `harness-scripts-version` line changes); the journal's Speed review runs the report from there.

## Tests (seam: the scripts against a temp Glue folder, `core/hooks/test_telemetry.sh`)
- T1 → AC-02.1, AC-02.2: prompt with quotes and a newline, then stop → two valid JSON lines; missing Glue → no file, exit 0
- T2 → AC-02.4, AC-02.5: a report over cowork prompt/stop, plus a cowork prompt with no stop followed later by another prompt
- AC-02.3, AC-02.6: hand check in one real app request

## Contracts
Telemetry line, unchanged schema: `{"ts", "ms", "event", "session", "prompt"?}`; `session` is `"cowork"` for app requests.

## Files likely to change
- `core/hooks/mark.py`, `core/hooks/test_telemetry.sh` (new)
- `core/hooks/telemetry_report.py`, `core/skills/me/SKILL.md`, `core/skills/journal/SKILL.md`
- `CHANGELOG.md`, `core/.claude-plugin/plugin.json` (0.1.8)

## Docs and guides to update
- `README.md` Claude app section: add "Chat requests are timed from the first to the last tool call (a lower bound)."

## Default states
None (no UI).
