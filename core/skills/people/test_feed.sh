#!/usr/bin/env bash
# Tests for spec 001 (people profiles). Run: bash core/skills/people/test_feed.sh
set -u
here="$(cd "$(dirname "$0")" && pwd)"
fails=0
ok()   { echo "ok   - $1"; }
bad()  { echo "FAIL - $1"; fails=$((fails+1)); }
check(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (want [$3] got [$2])"; fi; }

new_glue() { g="$(mktemp -d)"; echo "$g"; }

# T3 -> AC-01.2, AC-01.3: create makes the slug file from the template, copies _template.md, never overwrites
g="$(new_glue)"
out="$(bash "$here/create.sh" "$g" "Sam Smith")"
f="$g/resources/people/sam-smith.md"
check "T3 create makes slug file" "$([ -f "$f" ] && echo yes)" "yes"
check "T3 name filled" "$(sed -n 's/^name: //p' "$f")" "Sam Smith"
check "T3 first name is an alias" "$(sed -n 's/^aliases: //p' "$f")" "[sam]"
check "T3 empty sections show -" "$(grep -c '^-$' "$f")" "9"
check "T3 _template.md copied" "$([ -f "$g/resources/people/_template.md" ] && echo yes)" "yes"
echo "edited" >> "$f"
out="$(bash "$here/create.sh" "$g" "Sam Smith")"; rc=$?
check "T3 refuses to overwrite (exit 1)" "$rc" "1"
check "T3 file unchanged" "$(tail -1 "$f")" "edited"

# T1 -> AC-01.4: name or alias match appends a dated line; no match prints unmatched
g="$(new_glue)"
bash "$here/create.sh" "$g" "Sam Smith" >/dev/null
bash "$here/create.sh" "$g" "Alex Jones" >/dev/null
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Spoke to SAM and Alex about hiring")"
check "T1 alias match appends (case-insensitive)" "$(tail -1 "$g/resources/people/sam-smith.md")" "- 2026-11-25 · Spoke to SAM and Alex about hiring"
check "T1 every matching profile gets the line" "$(tail -1 "$g/resources/people/alex-jones.md")" "- 2026-11-25 · Spoke to SAM and Alex about hiring"
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Coffee with Alex Jones")"
check "T1 full name match appends once" "$(grep -c 'Coffee with Alex Jones' "$g/resources/people/alex-jones.md")" "1"
before="$(cat "$g/resources/people/sam-smith.md")"
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Spoke to Samsung support")"
check "T1 whole word only: prints unmatched" "$out" "unmatched"
check "T1 no match leaves file unchanged" "$(cat "$g/resources/people/sam-smith.md")" "$before"
out="$(bash "$here/feed.sh" "$(new_glue)" 2026-11-25 "Spoke to Sam")"
check "T1 no people folder prints unmatched" "$out" "unmatched"

# T2 -> AC-01.5: two profiles share alias -> ambiguous, both unchanged
g="$(new_glue)"
bash "$here/create.sh" "$g" "Sam Smith" >/dev/null
bash "$here/create.sh" "$g" "Sam Jones" >/dev/null
a="$(cat "$g/resources/people/sam-smith.md")"; b="$(cat "$g/resources/people/sam-jones.md")"
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "Spoke to Sam")"
check "T2 prints ambiguous with slugs" "$out" "ambiguous: sam-jones sam-smith"
check "T2 first unchanged" "$(cat "$g/resources/people/sam-smith.md")" "$a"
check "T2 second unchanged" "$(cat "$g/resources/people/sam-jones.md")" "$b"

# T4 -> AC-01.7: --check reports the match result without writing
g="$(new_glue)"
bash "$here/create.sh" "$g" "Sam Smith" >/dev/null
before="$(cat "$g/resources/people/sam-smith.md")"
check "T4 --check matched prints matched" "$(bash "$here/feed.sh" --check "$g" "Spoke to Sam")" "matched: sam-smith"
check "T4 --check unmatched prints unmatched" "$(bash "$here/feed.sh" --check "$g" "Spoke to Alex")" "unmatched"
check "T4 --check writes nothing" "$(cat "$g/resources/people/sam-smith.md")" "$before"

# Review fixes
g="$(new_glue)"
bash "$here/create.sh" "$g" "Tom & Jerry" >/dev/null
check "T3 ampersand name kept" "$(sed -n 's/^name: //p' "$g/resources/people/tom-&-jerry.md")" "Tom & Jerry"
bash "$here/create.sh" "$g" "../evil" >/dev/null 2>&1; rc=$?
check "T3 path name refused (exit 2)" "$rc" "2"
check "T3 nothing written outside people/" "$(ls "$g/resources")" "people"
g="$(new_glue)"
bash "$here/create.sh" "$g" "Sam Smith" >/dev/null
printf '%s\n' 'Budget $500k with Sam "quoted" `x`' | bash "$here/feed.sh" "$g" 2026-11-25 - >/dev/null
check "T1 text from stdin kept as-is" "$(tail -1 "$g/resources/people/sam-smith.md")" '- 2026-11-25 · Budget $500k with Sam "quoted" `x`'
bash "$here/create.sh" "$g" "Sam Jones" >/dev/null
bash "$here/create.sh" "$g" "Alex Lee" >/dev/null
out="$(bash "$here/feed.sh" "$g" 2026-11-25 "1:1 with Sam Smith and Alex")"
check "T2 full name settles a shared alias" "$(tail -1 "$g/resources/people/sam-smith.md")" "- 2026-11-25 · 1:1 with Sam Smith and Alex"
check "T2 other person still fed" "$(tail -1 "$g/resources/people/alex-lee.md")" "- 2026-11-25 · 1:1 with Sam Smith and Alex"
check "T2 --check reports ambiguous" "$(bash "$here/feed.sh" --check "$g" "Spoke to Sam")" "ambiguous: sam-jones sam-smith"
f="$g/resources/people/alex-lee.md"; sed -i.bak 's/^name: .*/name: "Alex Lee"/' "$f"; rm -f "$f.bak"
check "T1 quoted name in front matter matches" "$(bash "$here/feed.sh" --check "$g" "Lunch with alex lee")" "matched: alex-lee"

echo; [ "$fails" = 0 ] && echo "all passed" || { echo "$fails failed"; exit 1; }
