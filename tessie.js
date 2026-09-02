/* Tessie → RTAM_DATA adapter.
 *
 * This file does NOT run in the design system — the kit loads data.js (static
 * figures) so the card renders without a network call. Point the kit at this
 * file instead when you deploy the dashboard to the site.
 *
 * SECURITY MODEL — the website never touches Tessie.
 * A Tessie access token is a single full-access credential; there is no
 * read-only token. So the public site is not given one. Instead a scheduled job
 * (cron / GitHub Action / Lambda) runs `shape()` against Tessie and writes a
 * static odometer.json to the CDN. The site fetches that file and nothing else.
 * A total compromise of the website yields a stale JSON file — there is no
 * credential there to steal and no path from the browser to the car.
 *
 * Belt and braces, both configured outside this repo:
 *   1. At tesla.com → account → third-party apps, grant Tessie vehicle DATA
 *      scopes only and withhold the command scopes. Tessie then cannot send a
 *      command regardless of what any token says.
 *   2. Do not install Tessie's Tesla Virtual Key on the car. 2021+ vehicles
 *      require signed commands; without the key paired, commands are rejected
 *      by the car itself. (This also disables Tessie's in-app remote controls.)
 *
 * DRIVER SAFETY — the feed is embargoed.
 * Everything published is held back EMBARGO_HOURS (24) and rounded to town, so
 * the dashboard can never be used to find the car or the driver. Nothing that
 * reveals a current position leaves this file: the odometer is reconstructed as
 * at the cutoff rather than read live, because a live reading plus a known
 * route is itself a position. Do not "fix" that by using state.odometer
 * directly.
 *
 * Field names below follow developer.tessie.com — confirm them against the live
 * docs before shipping; they were not verified against a real account.
 */

const ENDPOINT = '/odometer.json';
const REFRESH_MS = 15 * 60 * 1000;
const EMBARGO_HOURS = 24; // driver safety — never lower this
const DEPARTURE = '2026-06-01'; // set to the real day 1
const GOAL = 1000000;

/* --- the scheduled job ----------------------------------------------------
 * Runs somewhere private on a timer. Never in the web tier.
 *
 *   import { shape } from './tessie.js';
 *
 *   const H = { Authorization: `Bearer ${process.env.TESSIE_TOKEN}` };
 *   const VIN = process.env.TESSIE_VIN;
 *   const q = 'distance_format=km&timezone=America/Winnipeg';
 *
 *   const state  = await fetch(`https://api.tessie.com/${VIN}/state`, { headers: H }).then(r => r.json());
 *   const drives = await fetch(`https://api.tessie.com/${VIN}/drives?${q}&limit=200`, { headers: H }).then(r => r.json());
 *
 *   await putToCdn('odometer.json', JSON.stringify(shape({ state, drives: drives.results })));
 *
 * Only these two GET paths are ever called. If you would rather run a live
 * proxy route than a snapshot job, allowlist those two paths explicitly so a
 * bug cannot turn the route into a general Tessie passthrough.
 * ------------------------------------------------------------------------ */

const dayIndex = (iso) => Math.floor((new Date(iso) - new Date(DEPARTURE)) / 864e5) + 1;
const km = (n) => Math.round(n || 0);

/* "654 Main Street, Morris, MB" → "Morris, MB". Drops the street line so the
   published position is a town, not an address. */
function town(loc) {
  if (!loc) return '—';
  const parts = String(loc).split(',').map((s) => s.trim()).filter(Boolean);
  return (parts.length > 1 ? parts.slice(1) : parts).join(', ');
}

/* Tessie returns one record per drive; the dashboard wants one per day. */
function byDay(drives) {
  const acc = new Map();
  for (const d of drives) {
    const key = String(d.started_at).slice(0, 10);
    const row = acc.get(key) || { date: key, km: 0, drives: 0, energy: 0, autopilot: 0, ending: null };
    row.km += d.odometer_distance || 0;
    row.energy += d.energy_used || 0;
    row.autopilot += d.autopilot_distance || 0;
    row.drives += 1;
    row.ending = d.ending_location || row.ending;
    acc.set(key, row);
  }
  return [...acc.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const isSupercharger = (c) =>
  /supercharg/i.test(String(c?.location || c?.site_name || c?.charger_type || ''));

/* Charge sessions, split Tesla-network vs everything else. Published sessions
   only — anything inside the embargo window is held with the drives. */
function chargeCounts(charges, cutoff) {
  const out = { day: 0, daySc: 0, dayOther: 0, life: 0, lifeSc: 0, lifeOther: 0, lastDay: null };
  const published = (charges || []).filter((c) => new Date(c.started_at) <= cutoff);
  for (const c of published) {
    out.life += 1;
    if (isSupercharger(c)) out.lifeSc += 1; else out.lifeOther += 1;
  }
  const last = published[published.length - 1];
  const day = last && String(last.started_at).slice(0, 10);
  out.lastDay = day || null;
  for (const c of published.filter((c) => String(c.started_at).slice(0, 10) === day)) {
    out.day += 1;
    if (isSupercharger(c)) out.daySc += 1; else out.dayOther += 1;
  }
  return out;
}

export function shape({ state, drives, charges }) {
  const all = drives || [];
  const cutoff = Date.now() - EMBARGO_HOURS * 36e5;

  /* Split at the embargo line. Held drives are never published — they are kept
     only to walk the live odometer back to where it stood at the cutoff. */
  const published = all.filter((d) => new Date(d.ended_at || d.started_at) <= cutoff);
  const held = all.filter((d) => new Date(d.ended_at || d.started_at) > cutoff);
  const heldKm = held.reduce((s, d) => s + (d.odometer_distance || 0), 0);

  const days = byDay(published);
  const recent = days.slice(-8);
  const last = days[days.length - 1] || { date: DEPARTURE, km: 0, ending: null };
  const odometer = km((state?.odometer || 0) - heldKm);
  const driving = days.filter((d) => d.km > 0);
  const ch = chargeCounts(charges, cutoff);

  return {
    odometer,
    goal: GOAL,
    day: dayIndex(last.date),
    province: town(last.ending).split(',').pop().trim() || '—',
    route: town(last.ending),
    today: km(last.km),
    best: km(Math.max(0, ...days.map((d) => d.km))),
    avgPerDay: driving.length ? km(driving.reduce((s, d) => s + d.km, 0) / driving.length) : 0,
    chargeSessions: ch.day,
    chargeSupercharger: ch.daySc,
    chargeOther: ch.dayOther,
    chargeLifetime: ch.life,
    chargeLifetimeSupercharger: ch.lifeSc,
    chargeLifetimeOther: ch.lifeOther,
    /* The map needs plotted points; the shaping job has no projection, so the
       card keeps its placeholder corridor until a real one is supplied. */
    dayMap: {
      label: 'Latest day · Day ' + dayIndex(last.date),
      corridor: town(last.ending),
      km: km(last.km),
      path: [],
      stops: [],
    },
    asOf: last.date,
    embargoHours: EMBARGO_HOURS,
    days: recent.map((d) => ({ label: 'D ' + dayIndex(d.date), km: km(d.km) })),
    log: days.slice(-5).reverse().map((d) => ({
      day: 'Day ' + dayIndex(d.date),
      date: new Date(d.date).toLocaleDateString('en-CA', { day: 'numeric', month: 'short' }),
      province: town(d.ending).split(',').pop().trim(),
      km: km(d.km).toLocaleString('en-CA'),
      note: '', // written by hand — Tessie has no field for what broke
    })),
  };
}

/* The browser reads the pre-shaped snapshot — no shaping, no token, no Tessie. */
export async function load() {
  const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('odometer.json ' + res.status);
  return res.json();
}

/* Hydrate in place, then keep it current. Falls back to the static figures in
   data.js if the snapshot is unreachable, so the page never renders empty. */
export function mount(onData) {
  const tick = () => load().then(onData).catch((e) => console.warn('[rtam] odometer feed:', e.message));
  tick();
  setInterval(tick, REFRESH_MS);
}
