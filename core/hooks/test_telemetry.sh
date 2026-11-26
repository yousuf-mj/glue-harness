#!/usr/bin/env bash
# Tests for spec 002 (time Claude app requests). Run: bash core/hooks/test_telemetry.sh
set -u
here="$(cd "$(dirname "$0")" && pwd)"
fails=0
check(){ if [ "$2" = "$3" ]; then echo "ok   - $1"; else echo "FAIL - $1 (want [$3] got [$2])"; fails=$((fails+1)); fi; }
day="$(TZ=Europe/London date +%F)"

# T1 -> AC-02.1, AC-02.2
g="$(mktemp -d)"
python3 "$here/mark.py" "$g" prompt 'Say "hi"
and   bye'
python3 "$here/mark.py" "$g" stop
f="$g/telemetry/$day.jsonl"
check "T1 two lines" "$(wc -l < "$f" | tr -d ' ')" "2"
check "T1 valid JSON, cowork, squashed prompt" "$(python3 -c '
import json,sys
a=[json.loads(l) for l in open(sys.argv[1])]
print(a[0]["event"], a[0]["session"], a[0]["prompt"], a[1]["event"], "prompt" in a[1], a[1]["ms"]>=a[0]["ms"])' "$f")" 'prompt cowork Say "hi" and bye stop False True'
python3 "$here/mark.py" "$g/nope" prompt "x"; rc=$?
check "T1 missing Glue exits 0" "$rc" "0"
check "T1 missing Glue writes nothing" "$([ -e "$g/nope" ] && echo yes || echo no)" "no"

# T2 -> AC-02.4, AC-02.5
t="$(mktemp -d)/day.jsonl"
cat > "$t" <<'J'
{"ts":"2026-11-26T09:00:00.000","ms":1000000,"event":"prompt","session":"cowork","prompt":"build it"}
{"ts":"2026-11-26T09:01:00.000","ms":1060000,"event":"stop","session":"cowork"}
{"ts":"2026-11-26T10:00:00.000","ms":4600000,"event":"prompt","session":"cowork","prompt":"forgot stop"}
{"ts":"2026-11-26T22:00:00.000","ms":47800000,"event":"prompt","session":"cowork","prompt":"next day-ish"}
{"ts":"2026-11-26T22:00:30.000","ms":47830000,"event":"stop","session":"cowork"}
J
r="$(python3 "$here/telemetry_report.py" "$t")"
check "T2 app row flagged, dashes" "$(echo "$r" | grep -c '| build it (app, lower bound) | 1m 00s | - | - |')" "1"
check "T2 no stop ends at its last event (0s, not 12h)" "$(echo "$r" | grep 'forgot stop' | grep -c 'interrupted.*| 0.0s |')" "1"
echo; [ "$fails" = 0 ] && echo "all passed" || { echo "$fails failed"; exit 1; }
