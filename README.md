# Live odometer dashboard

The public run-tracker: distance to a million, pace, daily log.

- `Panels.jsx` — `Metric` (a `Plate` wrapping a `StatReadout`), `DistanceBars` (bars on a single hairline baseline; the latest day is the only cyan bar), `LogRow` (day · date · province · note · distance).
- `data.js` — **illustrative figures.** Nothing here is a real reading; the footer says so on the page. The kit loads this so the card renders without a network call.
- `tessie.js` — **the live feed adapter.** Shapes the Tessie API into `RTAM_DATA`, and documents the snapshot architecture that keeps the credential off the website. Not loaded by the card; wire it up when the dashboard goes on the site.

**Non-developer setup: read `SETUP.md` instead of this file.** It walks the same
architecture in plain language, and `job/` holds the ready-to-run helper script
and GitHub Actions timer. This file is the technical rationale.

## Putting this on the site

The dashboard is a static page plus one JSON file. **The website never talks to Tessie.**

**1. A scheduled job pulls and publishes.** A cron job / GitHub Action / Lambda — somewhere private, not the web tier — calls Tessie every few minutes and writes a static `odometer.json` to the CDN. The exact calls and the shaping function are in `tessie.js`. Only two GET paths are ever hit.

**2. The page reads the file.** Replace the `data.js` script tag with `tessie.js` and call `mount()`. It polls every five minutes and falls back to the static figures if the snapshot is missing, so the page never renders empty.

Why a snapshot rather than a live proxy route: a Tessie access token is a **single full-access credential — there is no read-only token**. Keeping it out of the web tier entirely means a total compromise of the website yields a stale JSON file. It also removes rate-limit pressure and stops the car being woken on every page view.

### Driver safety — the feed is embargoed

**Everything published is held back 24 hours and rounded to town level.** `EMBARGO_HOURS` in `tessie.js` sets the lag. Treat 24 as a floor, not a default to tune down. A live public tracker for a solo driver crossing a continent in a recognisable car is a real risk to him and to the vehicle, and the dashboard is not worth it.

What that means concretely:

- Drives that ended inside the embargo window are **excluded entirely** — not blurred, not rounded, absent.
- The hero odometer is **reconstructed as at the cutoff** by subtracting held distance from the live reading. It is never `state.odometer`. A live odometer plus a known route is itself a position, so don't "simplify" that line.
- Addresses are reduced to town: `654 Main Street, Morris, MB` publishes as `Morris, MB`.
- The snapshot carries `asOf` and `embargoHours` — **put the lag on the page.** "Positions shown are at least 24 hours old" is both honest and a deterrent.

The page should read as a log, not a tracker. If someone can work out where the car is *now* from what's on screen, the embargo has failed.

### Locking it to read-only

The token can't be scoped, but the permission behind it can. Two settings, both outside this repo, and neither costs anything:

- **At tesla.com → account → third-party apps:** grant Tessie vehicle *data* scopes and withhold the command scopes. Tessie then cannot send a command to the car regardless of what any token says.
- **Don't pair Tessie's Tesla Virtual Key.** 2021-and-later vehicles reject unsigned commands, so without the key installed the car itself refuses them. Trade-off: this also disables Tessie's own in-app remote controls, so only do it if the driver doesn't use them.

With the snapshot architecture plus withheld command scopes, there is no path from the public internet to the vehicle.

### Caveats

**Field names.** The mapping in `tessie.js` follows the published shape of `GET /{vin}/state` and `GET /{vin}/drives` — `odometer_distance`, `energy_used`, `autopilot_distance`, `started_at`, `ending_location`. Confirm each against developer.tessie.com before shipping; it was written from the docs, not against a live account. Pass `distance_format=km` or every figure arrives in miles.

**What Tessie cannot give you.** The `note` field on each log row — what broke, what got replaced, why it was a rest day — has no API equivalent. That stays hand-written. Charge counts come from `GET /{vin}/charges` and are split Tesla-network vs other by matching "supercharg" in the site name — confirm that field before trusting the split. `batteryHealth` is gone from the panels (checkable roughly twice a year, so not dashboard material). `dayMap` needs plotted points and the job has no projection, so it ships empty and the card keeps its placeholder corridor.

**Set `DEPARTURE`** in `tessie.js` to the real day 1 or every day number will be wrong.

**Cross-check the social posts.** The embargo only holds if Ron's same-day Instagram and X posts don't undercut it. A daily post naming today's town defeats a 24-hour dashboard lag. Worth agreeing what he can caption in real time.

## Notes

Every number is mono with tabular figures so counters do not jitter as they tick. Cyan appears exactly twice — the status dot and the latest day's bar — holding the 5% accent budget. The hero odometer is the one place a number is set in the display face at 128px, and it is furniture, not data the viewer reads precisely; the remaining-distance figure beside it is mono.
