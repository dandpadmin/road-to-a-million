# Turning the dashboard on — plain-English setup

No coding. About 30 minutes, all of it clicking and pasting. Nothing here costs money.

## What we're building, in words

Right now the dashboard shows made-up numbers. We want it to show Ron's real ones.

The car's numbers live at Tessie. To get them, you need Tessie's **key** — a long
string of characters that acts like a password. The important thing to understand:
**that key can control the car, not just read from it.** Tessie doesn't offer a
read-only version.

So the key can never go in the webpage. Anything in a webpage can be read by
anyone who opens it — view the page source and there it is.

Instead we put a **helper** in the middle:

```
Tessie  →  helper (holds the key, waits 24h, rounds to town)  →  odometer.json  →  dashboard
```

The helper wakes up every 15 minutes, asks Tessie for the numbers, throws away
anything from the last 24 hours, rounds locations to the nearest town, and saves
the result as one small file called `odometer.json`. The dashboard reads only
that file. It never sees the key, and there's no route from the public website
back to the car.

The helper is the `job/` folder in this kit — already written. You just have to
put it somewhere that runs on a timer.

## Step 1 — Get the Tessie key

1. Go to **tessie.com** → sign in → **Settings → API**.
2. Click to create/reveal an **access token**. Copy it.
3. Also copy the car's **VIN** (17 characters, on the settings page or the
   windshield).

Keep both in your password manager. Don't email them, don't paste them into
chat — including to me.

## Step 2 — Lock the key down so it can't drive the car

One setting, outside this project. Do it before the key goes anywhere.

**Don't install Tessie's "Virtual Key" on the car.** Newer Teslas refuse
commands — unlock, climate, charging, remote start — unless that key is paired
to the vehicle. Without it, Tessie can read the car but physically cannot drive
it, no matter what the token says. Trade-off: this also switches off Tessie's
own remote buttons in their app, so skip it if Ron uses those.

### If tesla.com doesn't list Tessie under Third-Party Apps

That's normal — nothing is wrong. Tessie connects through Tesla's fleet
integration, which often doesn't appear in that list. If Tessie is showing your
car's data, the connection is working. There's nothing to toggle there, which is
why the Virtual Key step above is the real control.

Worst case with a stolen token: someone gets stale mileage figures. That's
acceptable.

## Step 3 — Put the helper somewhere that runs on a timer

Easiest option, free, no server: **GitHub Actions**.

### Terminal version

From the project folder, replacing `you/road-to-a-million` with your repo path:

```sh
mkdir -p .github/workflows
cp ui_kits/odometer/job/snapshot.yml .github/workflows/snapshot.yml

git init
git add .
git commit -m "Odometer dashboard + Tessie snapshot job"
gh repo create you/road-to-a-million --private --source=. --push
```

Then the two secrets (`gh` prompts for each value, so nothing lands in your
shell history):

```sh
gh secret set TESSIE_TOKEN
gh secret set TESSIE_VIN
```

Kick it off and watch it:

```sh
gh workflow run snapshot.yml
gh run watch
```

Requires GitHub CLI (`brew install gh`, then `gh auth login`). If you'd rather
not use `gh`, create the repo on github.com and add the secrets under
**Settings → Secrets and variables → Actions → New repository secret**, then
`git remote add origin …` and `git push -u origin main`.

Secrets are write-only — once saved nobody, including you, can read them back
out, and they never appear in the code.

If it works, a file called `odometer.json` appears in the repo. That's the
finished, safety-filtered data. If it fails, `gh run view --log-failed` prints
why in plain text — send me that and I'll fix it.

**Other hosts work the same way** — Vercel, Netlify, a small Linux box. The
pattern is always: put the key in that host's secrets/environment settings, run
`job/fetch-snapshot.mjs` on a schedule. Tell me which host and I'll adjust.

## Step 4 — Point the dashboard at the real file

One line in `index.html`. Swap:

```html
<script src="data.js"></script>
```

for:

```html
<script type="module">
  import { mount } from './tessie.js';
  mount((d) => { window.RTAM_DATA = d; window.rerender && window.rerender(); });
</script>
```

Say the word and I'll make this change — it's easier for me to do than to
describe. Until then the dashboard keeps showing the sample figures, which is
the right behaviour: it also falls back to them if the file ever goes missing,
so the page never appears broken.

## The 24-hour delay — please don't shorten it

Everything published is at least 24 hours old and rounded to the nearest town.
A solo driver crossing a continent in a recognisable car, with a public page
saying where he is, is a genuine risk to him and to the vehicle. The dashboard
isn't worth that.

The delay is one line in `tessie.js` (`EMBARGO_HOURS = 24`). Treat 24 as the
floor.

One thing worth agreeing with Ron: **the delay only holds if his own posts hold
it.** A same-day Instagram story naming the town he's in cancels out everything
above.

## Two fields Tessie can't give us

- **The daily note** ("front tyres swapped", "off the road — motor inspection").
  There's no such field in the car's data. Someone types those.
- **Battery health.** Not reliably available, and only worth checking a couple
  of times a year — which is why we took that box off the dashboard.

## If something looks wrong

- **Numbers in miles instead of km** — the helper asks for km; tell me and I'll
  check the request.
- **Day numbers wrong** — `DEPARTURE` in `tessie.js` needs to be the real day 1.
  It's currently a placeholder. Tell me the date.
- **Everything zero** — usually the key or VIN secret is mistyped. Re-save them.

The developer-level notes (exact API fields, architecture reasoning) are in
`README.md` if anyone technical ever needs them.
