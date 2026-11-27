# Token meter mod: research

Source: Mobbin is not connected in this session, so the references below come from the products' own sites and repos. The descriptions are from my knowledge of each product and I did not re-check them against live screenshots in this session.

| Reference | Link | Why it works | What we borrow |
| --- | --- | --- | --- |
| iStat Menus (macOS) | https://bjango.com/mac/istatmenus/ | Meters about as tall as a line of text, each with a short label and a number. They stay readable in a 22 px menu bar. | Height budget and a small label above or beside each meter |
| Stats (open-source macOS) | https://github.com/exelban/stats | Per-module mini bar or number, colour only changes with load. Users pick bar, line or text per module. | Neutral fill that turns amber and red only past thresholds |
| btop (terminal monitor) | https://github.com/aristocratic-olle/btop | Segmented block meters with a fixed colour gradient, so the position of the fill tells you the zone. | Segmented cells as an option (Direction B) |
| Vercel usage page | https://vercel.com/docs/limits/usage | Flat thin bars on dark, a number and limit on the right, almost no colour. | Restraint: one row, no card or border |
| Apple Screen Time / Fitness rings | https://support.apple.com/guide/iphone/screen-time | Shows progress against a goal and against time of day together. | "Pace" marker: where you would be if usage were spread evenly across the window (Direction C) |

## Synthesis
- **Borrow:** menu-bar scale (meters 4-6 px tall), tabular numerals, colour only for state, reset time next to each gauge.
- **Stand out:** a pace marker. The useful question is "am I burning faster than the window refills?", not just "how full is it?". No reference above answers that for rate limits.
- **Avoid:** a card or box around the bar, round dials (no arc primitive, and they cost height), a green "all good" colour that is on all the time, and stat tiles that all look the same.
