# Design register

One row per screen. `current/` holds the one current design for each screen. Old versions are deleted; git history is the archive.

## Design system
- Token meter mod: `token-meter-ui/design-system.md`, `token-meter-ui/tokens.json` (dark-only tokens, contrast checked by `token-meter-ui/check_contrast.py`)

## Screens

| Screen | Area | File | Status | Spec / saga | Last checked | Note |
|---|---|---|---|---|---|---|
| Token meter bar (all states, laptop and phone) | Claude app (mod) | `current/claude-app/token-meter-bar.png` | 🟢 Live | spec 005 (`specs/token-meter/005-token-meter.md`) | 2026-11-27 | Built in `mods/token-meter/`. Checked in the desktop app by Yousuf. Copy changed from the design: "Ping failed · retrying" (was "retrying in 1 min") and a new "waiting for your next reply" state. Working folder: `token-meter-ui/` |

## Not screen designs (left out of the register)
- `work-harness.md`: design doc for the harness
- `work-harness-shape/pitch.md`: shape pitch
