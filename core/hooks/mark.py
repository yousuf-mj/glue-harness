#!/usr/bin/env python3
# harness-scripts-version: 0.1.8
"""Log a Claude app request's start or end to Glue telemetry (spec 002).

Usage: mark.py <glue> prompt "<text>" | mark.py <glue> stop
Same line format as telemetry.py, with session "cowork". Times are a lower bound:
Claude writes 'prompt' in its first tool call of a request and 'stop' in its last.
Never fails: does nothing when <glue> is missing, always exits 0.
"""
import json, os, sys, time
from datetime import datetime
try:
    from zoneinfo import ZoneInfo
    LONDON = ZoneInfo("Europe/London")
except Exception:
    LONDON = None

def main():
    if len(sys.argv) < 3 or not os.path.isdir(sys.argv[1]):
        return
    glue, event = sys.argv[1], sys.argv[2]
    now = datetime.now(LONDON) if LONDON else datetime.now()
    line = {"ts": now.isoformat(timespec="milliseconds"), "ms": int(time.time() * 1000),
            "event": event, "session": "cowork"}
    if event == "prompt":
        line["prompt"] = " ".join((sys.argv[3] if len(sys.argv) > 3 else "").split())[:60]
    folder = os.path.join(glue, "telemetry")
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, now.strftime("%Y-%m-%d") + ".jsonl"), "a", encoding="utf-8") as f:
        f.write(json.dumps(line, ensure_ascii=False) + "\n")

try:
    main()
except Exception:
    pass
