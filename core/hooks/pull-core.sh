#!/usr/bin/env bash
# Pull the latest harness at session start. Never blocks the session.
# Updates apply from the next session (Claude Code needs a restart to load new plugin versions).
{
  claude plugin marketplace update harness >/dev/null 2>&1 &&
  claude plugin update harness-core@harness >/dev/null 2>&1
  claude plugin update harness-work@harness >/dev/null 2>&1
} || true
echo "harness: checked for updates (new versions load next session)"
exit 0
