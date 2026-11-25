---
description: Pull the latest harness from GitHub and update both plugins
allowed-tools: Bash(claude plugin:*)
---

Run these, one after another, and report each result in one line:

1. `claude plugin marketplace update harness`
2. `claude plugin update harness-core@harness`
3. `claude plugin update harness-work@harness`

Then show the installed versions with `claude plugin list`, and remind me to restart Claude Code so the new version loads. If the Claude app also uses these skills, list which skill folders changed so I can re-upload them.
