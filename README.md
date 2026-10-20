# Road to a Million: live odometer dashboard

The public tracker for Ron's Model 3 run to 1,000,000 km: distance, pace, daily log, route
and charging. Day 1 was 2026-09-02.

- Public page: https://driveprotected.com/pages/road-to-a-million. The Shopify page embeds the
  dashboard in an iframe with `tools/shopify-embed.liquid`; share this link, not the one below.
- Dashboard itself: https://dandpadmin.github.io/road-to-a-million/ (GitHub Pages, from `main`)

**Looking after it without code: read `SETUP.md`.** This file is the technical rationale.

## How it fits together

```
Tessie API -> job/fetch-snapshot.mjs (GitHub Action, every 2 hours)
           -> odometer.json, history.json, archive/, ledger/, route.json (committed by odometer-bot)
           -> index.html and archive.html read those files
```

**The website never talks to Tessie.** A Tessie access token is a single full-access
credential with no read-only version, so it lives only in the Action's secrets. A total
compromise of the website yields a stale JSON file and no path to the car.

| File | What it is |
| --- | --- |
| `app.jsx`, `Panels.jsx`, `Nerd.jsx`, `RouteMap.jsx`, `styles.css` | Page sources |
| `index.html` | Self-unpacking bundle of the sources. Rebuild with `python3 tools/rebundle.py`; never hand-edit. |
| `archive.html` | Month-by-month archive page (uses `_ds_bundle.js` and `styles.css`) |
| `data.js` | Illustrative fallback figures so the page never renders empty. Not real readings. |
| `tessie.js` | Shapes Tessie data into the published snapshot. All embargo logic lives here. |
| `job/fetch-snapshot.mjs` | The scheduled job: reads Tessie, writes the snapshot files |
| `job/check-readonly.mjs` | Fails a run if the job could wake or command the car |
| `.github/workflows/snapshot.yml` | The timer and commit step |
| `ledger/`, `archive/`, `history.json`, `route.json` | Published history, written by the job |
| `basemap.json` | Map outline for the route |
| `tools/check.mjs` | Offline test of everything above. Run before pushing. |

## Driver safety: two clocks

`tessie.js` publishes on two separate clocks.

- **Location clock (`LOCATION_EMBARGO_HOURS`):** anything that says where (towns, provinces,
  the plotted route) is at least 24 hours old and rounded to town. The floor is hard-coded and
  no setting can lower it. Drives that ended inside the window are left out entirely.
- **Distance clock (`EMBARGO_HOURS`, a repo Actions variable):** distance, daily km and charge
  counts. It is set to 0, so km are as fresh as the last snapshot (every 2 hours or so), and the
  page labels them that way.

Running km ahead of location is a deliberate choice. Bear in mind that up-to-date km plus
yesterday's town narrows down where the car is now, and that Ron's own same-day posts can undo
the location delay. Revisit both if the situation changes.

## The car's battery comes first

The job may only read data Tessie has already stored. It must never wake the car, keep it
awake or send it a command.

- Every request goes through `get()` in `job/fetch-snapshot.mjs`: GET only, to the `READ_ONLY`
  allowlist (`state`, `drives`, `charges`, `path`, `battery_health`). `/state` always asks for
  `use_cache=true`.
- `job/check-readonly.mjs` runs before every snapshot and fails the run on any wake call,
  command, non-GET request, `use_cache=false`, or Tessie call outside `get()`.
- Off switch: set the repo Actions variable `SNAPSHOT_PAUSED` to `true` and every run is
  skipped before anything talks to Tessie.
- Belt and braces, outside this repo: Tessie's Tesla Virtual Key is not installed on the car,
  so the car itself rejects commands.

## Schedule

The workflow is set to run at minute 17 of every second hour. GitHub runs schedules on a
best-effort basis and skips some when busy, so expect roughly 8 to 12 runs a day. Each run is
a commit and a Pages rebuild, so a shorter interval mostly grows the repo. If more reliable
timing is ever needed, trigger `workflow_dispatch` from an outside scheduler instead.

## Data notes

- Tessie timestamps arrive as Unix seconds and the `/state` odometer is nested and in miles;
  `tessie.js` converts both. Requests pass `distance_format=km`.
- Charges are split Tesla network vs other by matching "supercharg" in the site name.
- Charging cost is in the published data; the page hides it with `SHOW_COST` in `app.jsx`.
- The daily note (what broke, what got replaced, rest days) has no API field and is written by hand.

## Design notes

Every number is mono with tabular figures so counters don't jitter as they tick. Cyan appears
exactly twice, the status dot and the latest day's bar, holding the 5% accent budget.
