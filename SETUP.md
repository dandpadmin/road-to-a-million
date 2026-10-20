# Looking after the tracker: plain-English guide

No coding needed for anything here. Technical detail is in `README.md`.

The public page is **https://driveprotected.com/pages/road-to-a-million**. It shows the dashboard
from GitHub Pages in a frame, so anything that updates the dashboard updates that page too.

## What runs, in words

```
Tessie  ->  helper (holds the key, holds location back 24h, rounds to town)  ->  odometer.json  ->  dashboard
```

About every 2 hours, a helper on GitHub asks Tessie for the car's numbers, keeps anything that
shows a location at least 24 hours old and only to the nearest town, and saves the result as
`odometer.json` and a few history files. The dashboard reads only those files. It never sees
the Tessie key, and there's no route from the public website to the car.

The helper only reads what Tessie has already stored. It never wakes the car or sends it a
command, and a check stops any run that could.

## The Tessie key

The key can control the car, not just read it, and Tessie doesn't offer a read-only version.
So it lives only in GitHub's secret store as `TESSIE_TOKEN` (with the car's `TESSIE_VIN`).
Secrets are write-only: once saved, nobody can read them back.

- Never paste the key into code, email or chat, including to Claude.
- Keep Tessie's **Virtual Key** off the car. Without it, the car refuses commands no matter
  what the key says. (This also switches off Tessie's own remote buttons in its app.)
- To replace the key: create a new one in Tessie (**Settings → API**), then on GitHub go to
  **Settings → Secrets and variables → Actions** and update `TESSIE_TOKEN`.

## Pausing it

On GitHub: **Settings → Secrets and variables → Actions → Variables**. Create or edit
`SNAPSHOT_PAUSED` and set it to `true`. Every run is skipped before anything talks to Tessie.
Set it to `false` (or delete it) to resume. The dashboard keeps showing the last snapshot.

## Running it now

On GitHub: **Actions → Odometer snapshot → Run workflow**. Or from a terminal:

```sh
gh workflow run snapshot.yml
```

## Checking it's healthy

On GitHub, **Actions** lists recent runs; a green tick means the snapshot landed. From a terminal:

```sh
gh run list -L 5
```

```sh
gh run view --log-failed
```

The second prints why the latest failed run failed.

## The schedule

The helper is set to run every 2 hours. GitHub treats schedules as "best effort" and skips
some when its servers are busy, so expect roughly 8 to 12 runs a day. The dashboard's top bar
says how fresh the numbers are. Every run adds a commit and rebuilds the site, which is why
it isn't more frequent.

## The 24-hour location delay

Anything showing where the car is stays at least 24 hours old and rounded to the nearest town.
That floor is built into the code; no setting can lower it. A solo driver crossing a continent
in a recognisable car, with a public page saying where he is, is a real risk to him and the car.

The delay only holds if Ron's own posts hold it: a same-day story naming his town cancels it out.

## Things Tessie can't give us

- **The daily note** ("front tyres swapped", "off the road, motor inspection"). Someone types those.
- **Battery health** is only worth checking a couple of times a year, so it isn't on the dashboard.

## If something looks wrong

- **Numbers stop updating:** check Actions for a red cross, and check `SNAPSHOT_PAUSED` isn't `true`.
- **A run fails at "Check the credentials":** a secret is missing or mistyped. Re-save it.
- **A run fails at "Read-only check":** someone changed the helper in a way that could wake or
  command the car. Don't work around it; undo that change.
- **Numbers in miles instead of km:** the helper asks Tessie for km; something changed in the request.
