#!/usr/bin/env python3
# harness-scripts-version: 0.1.8
"""Turn a day's telemetry log into a short speed review (markdown).

Usage: telemetry_report.py <path to YYYY-MM-DD.jsonl>

A request runs from a 'prompt' event to the next 'stop' event in the same session.
Tool time is the sum of pre -> post pairs (matched by tool_use_id) inside it.
Model time is the rest: thinking and writing, which is often the slow part.
Session "cowork" lines come from the Claude app (mark.py): no tool split, and a lower bound.
"""
import json
import sys
from collections import defaultdict


def secs(ms: int) -> str:
    s = ms / 1000
    if s >= 60:
        return f"{int(s // 60)}m {int(s % 60):02d}s"
    return f"{s:.0f}s" if s >= 10 else f"{s:.1f}s"


def load(path):
    events = []
    with open(path, encoding="utf-8") as f:
        for raw in f:
            try:
                events.append(json.loads(raw))
            except Exception:
                continue
    events.sort(key=lambda e: e.get("ms", 0))
    return events


def build_requests(events):
    open_req = {}      # session -> request being built
    open_tool = {}     # tool_use_id -> pre event
    requests = []
    last = {}          # session -> ms of its latest event
    for e in events:
        s, kind = e.get("session"), e.get("event")
        if kind == "prompt":
            if s in open_req:  # previous request never stopped (interrupted)
                req = open_req.pop(s)
                # App requests have no events between prompts, so end at the last one seen.
                req["end"] = last.get(s, e["ms"]) if s == "cowork" else e["ms"]
                req["interrupted"] = True
                requests.append(req)
            open_req[s] = {"start": e["ms"], "time": e["ts"][11:16],
                           "prompt": e.get("prompt", ""), "tools": [], "interrupted": False,
                           "app": s == "cowork"}
        elif kind == "pre":
            open_tool[e.get("id")] = e
        elif kind == "post":
            pre = open_tool.pop(e.get("id"), None)
            dur = e["ms"] - pre["ms"] if pre else 0
            if s in open_req:
                open_req[s]["tools"].append((e.get("tool") or "?", dur))
        elif kind == "stop" and s in open_req:
            req = open_req.pop(s)
            req["end"] = e["ms"]
            requests.append(req)
        last[s] = e.get("ms", 0)
    for req in requests:
        req["total"] = req["end"] - req["start"]
        req["tool_ms"] = sum(d for _, d in req["tools"])
        req["model_ms"] = max(req["total"] - req["tool_ms"], 0)
    return requests


def short_tool(name: str) -> str:
    # mcp__Slack__slack_read_user_profile -> Slack.slack_read_user_profile
    if name.startswith("mcp__"):
        parts = name.split("__")
        return ".".join(parts[1:3]) if len(parts) >= 3 else name
    return name


def report(requests) -> str:
    if not requests:
        return "## Speed\n\nNo timed requests today.\n"
    total = sum(r["total"] for r in requests)
    tool_ms = sum(r["tool_ms"] for r in requests)
    calls = sum(len(r["tools"]) for r in requests)
    out = ["## Speed", ""]
    out.append(f"**Requests:** {len(requests)} · **Total:** {secs(total)} · "
               f"**Tool time:** {secs(tool_ms)} ({tool_ms * 100 // max(total, 1)}%) · "
               f"**Model time:** {secs(sum(r['model_ms'] for r in requests if not r.get('app')))} · "
               f"**App (no split):** {secs(sum(r['total'] for r in requests if r.get('app')))} · **Tool calls:** {calls}")
    out += ["", "**Slowest requests**", "",
            "| Time | Request | Total | Tools | Model | Calls |",
            "| --- | --- | --- | --- | --- | --- |"]
    for r in sorted(requests, key=lambda r: r["total"], reverse=True)[:5]:
        flag = (" (app, lower bound)" if r.get("app") else "") + (" (interrupted)" if r["interrupted"] else "")
        prompt = (r["prompt"] or "-").replace("|", "/")
        tools, model = ("-", "-") if r.get("app") else (secs(r["tool_ms"]), secs(r["model_ms"]))
        out.append(f"| {r['time']} | {prompt}{flag} | {secs(r['total'])} | "
                   f"{tools} | {model} | {len(r['tools'])} |")

    per_tool = defaultdict(lambda: [0, 0])
    for r in requests:
        for name, d in r["tools"]:
            per_tool[short_tool(name)][0] += 1
            per_tool[short_tool(name)][1] += d
    out += ["", "**Tools by time**", "",
            "| Tool | Calls | Total | Average |", "| --- | --- | --- | --- |"]
    for name, (n, d) in sorted(per_tool.items(), key=lambda kv: kv[1][1], reverse=True)[:8]:
        out.append(f"| {name} | {n} | {secs(d)} | {secs(d // max(n, 1))} |")
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: telemetry_report.py <YYYY-MM-DD.jsonl>")
    try:
        print(report(build_requests(load(sys.argv[1]))))
    except FileNotFoundError:
        print("## Speed\n\nNo telemetry file for today.\n")
