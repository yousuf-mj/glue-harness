#!/usr/bin/env python3
"""Log request and tool timings to Glue, one JSON line per event.

Called by Claude Code hooks (see hooks.json) with one argument:
  prompt   UserPromptSubmit  - a request starts
  pre      PreToolUse        - a tool call starts
  post     PostToolUse       - a tool call ends
  stop     Stop              - the reply is finished

Writes to $GLUE_DIR/telemetry/YYYY-MM-DD.jsonl (London date).
GLUE_DIR defaults to ~/glue. If that folder does not exist, it does nothing.
Set GLUE_TELEMETRY_PROMPT=0 to stop logging the first 60 characters of each prompt.

It must never break a session: every error is swallowed and it always exits 0.
"""
import json
import os
import sys
import time
from datetime import datetime

try:
    from zoneinfo import ZoneInfo
    LONDON = ZoneInfo("Europe/London")
except Exception:  # very old Python: fall back to local time
    LONDON = None


def main() -> None:
    event = sys.argv[1] if len(sys.argv) > 1 else "unknown"
    glue = os.path.expanduser(os.environ.get("GLUE_DIR", "~/glue"))
    if not os.path.isdir(glue):
        return

    try:
        data = json.load(sys.stdin)
    except Exception:
        data = {}
    if not data:  # nothing useful to log
        return

    now = datetime.now(LONDON) if LONDON else datetime.now()
    line = {
        "ts": now.isoformat(timespec="milliseconds"),
        "ms": int(time.time() * 1000),
        "event": event,
        "session": data.get("session_id"),
    }
    if event in ("pre", "post"):
        line["tool"] = data.get("tool_name")
        line["id"] = data.get("tool_use_id")
    if event == "prompt" and os.environ.get("GLUE_TELEMETRY_PROMPT", "1") != "0":
        prompt = " ".join(str(data.get("prompt", "")).split())
        line["prompt"] = prompt[:60]

    folder = os.path.join(glue, "telemetry")
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, now.strftime("%Y-%m-%d") + ".jsonl")
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(line, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
