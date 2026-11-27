# Token meter

A Claude app mod that draws one thin dark bar above the prompt.

- **5-hour and weekly rings:** % used and time to reset. Green below 70%, amber from 70%, red from 90%. A tick marks an even pace through the window, and "▲N" appears when you are more than 5 points ahead of it.
- **Keep warm:** a toggle that pings the session's prompt cache 30 seconds before it would expire, so your next turn reads the cache instead of rewriting it. It turns itself off after 60 minutes with no message, pauses at 95% of the 5-hour limit, and shows the estimated cost per ping and in total. It always starts off.

Load it with `claude --plugin-dir mods/token-meter`, or add the folder to `CLAUDE_CODE_PLUGIN_DIRS`.

Spec: `specs/token-meter/005-token-meter.md`. Design: `docs/designs/token-meter-ui/`.
