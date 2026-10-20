# Road to a Million: live odometer dashboard

Public tracker for Ron's Model 3 ("Myles") run to 1,000,000 km. Day 1 was 2026-09-02.
Served by GitHub Pages at https://dandpadmin.github.io/road-to-a-million/ and embedded
on the Drive Protected Shopify site through `tools/shopify-embed.liquid`.

`README.md` is the technical rationale and `SETUP.md` the plain-language setup.
Where the README and the code disagree about the embargo, the code (`tessie.js`) is current.

## How it fits together

```
Tessie API -> job/fetch-snapshot.mjs (GitHub Action) -> odometer.json, history.json,
              archive/, ledger/, route.json (committed by odometer-bot) -> index.html reads them
```

- `.github/workflows/snapshot.yml` is the live workflow. `job/snapshot.yml` is an identical
  copy kept with the kit; change both or neither.
- The Tessie token and VIN live only in GitHub Actions secrets (`TESSIE_TOKEN`, `TESSIE_VIN`).
  The token can control the car. Never put it in code, logs, chat or a committed file.
- `EMBARGO_HOURS` is a repo Actions variable, not code.

## The car's battery comes first

Nothing in this repo may wake the car, keep it from sleeping, or send it a command.
- All Tessie requests go through `get()` in `job/fetch-snapshot.mjs`: GET only, and only to
  the `READ_ONLY` allowlist of stored-data endpoints. `/state` is always `use_cache=true`.
- `job/check-readonly.mjs` runs before every snapshot and fails the run on any wake call,
  command, non-GET request, `use_cache=false`, or a Tessie call outside `get()`.
- Off switch: set the repo Actions variable `SNAPSHOT_PAUSED` to `true` and every run is
  skipped before anything talks to Tessie.
- Don't add an endpoint, raise the run frequency or change the schedule without Dan's say-so.

## Safety rules (Ron is a solo driver in a recognisable car)

- **Location is always at least 24 hours old and town-level.** `LOCATION_EMBARGO_HOURS` is
  floored at 24 in `tessie.js`. Never lower it, never bypass it, and never publish anything
  finer than a town for anything inside that window.
- The distance clock (`EMBARGO_HOURS`) is separate and is currently 0, so km are live.
  Don't add anything that lets a live figure be combined with the route to place the car now.
- The repo is **public**, so everything committed (including `ledger/`) is published. Check
  new fields against these rules before they go into any committed file, not just the page.
- Ask Dan before changing anything about what is published or when.

## Editing the page

- `index.html` is a self-unpacking bundle. Edit the sources (`app.jsx`, `Panels.jsx`,
  `Nerd.jsx`, `RouteMap.jsx`, `styles.css`), then run `python3 tools/rebundle.py` to pack
  them into `index.html`. Never hand-edit the bundle.
- `data.js` holds illustrative fallback figures so the page never renders empty. They are
  not real readings; don't quote them as facts.
- Charging cost is hidden on the page (`SHOW_COST = false` in `app.jsx`) until Dan decides
  whether to publish it.

## Git

- `odometer-bot` commits snapshots to `main` several times a day, and Pages deploys from
  `main`. Pull before starting work; expect `main` to have moved.
- Do work on a branch and merge when Dan approves. A push to `main` goes live.
- `Claude outputs/` holds screenshots and drafts from earlier sessions. It is not part of the
  site; don't commit it.

## Checking it

- `gh run list -L 5` shows recent snapshot runs; `gh run view <id> --log-failed` shows why one failed.
- `python3 -m http.server` from the repo root serves the page locally at http://localhost:8000.
