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
 * Belt and braces, configured outside this repo:
 *   Do not install Tessie's Tesla Virtual Key on the car. 2021+ vehicles
 *   require signed commands; without the key paired, commands are rejected by
 *   the car itself. (This also disables Tessie's in-app remote controls.)
 *   Note: Tessie usually does NOT appear under tesla.com → third-party apps,
 *   because it connects via the fleet integration — there is no scope toggle
 *   there to rely on, which is why the Virtual Key is the real control.
 *
 * DRIVER SAFETY — the feed is embargoed.
 * Everything published is held back EMBARGO_HOURS (24) and rounded to town, so
 * the dashboard can never be used to find the car or the driver. Nothing that
 * reveals a current position leaves this file: the odometer is reconstructed as
 * at the cutoff rather than read live, because a live reading plus a known
 * route is itself a position. Do not "fix" that by using state.odometer
 * directly.
 *
 * Field names below follow developer.tessie.com and are confirmed against a
 * live account: timestamps arrive as Unix SECONDS and the /state odometer is
 * nested and in miles. See toDate() and odometerKm().
 */

const ENDPOINT = '/odometer.json';
const REFRESH_MS = 15 * 60 * 1000;

/* TESTING OVERRIDE. Set the EMBARGO_HOURS env var on the snapshot job to see
 * live numbers while wiring things up. Anything below 24 flips LIVE_TEST on,
 * which BLANKS every location field — live km is harmless, a live position is
 * not. Unset the variable to return to the 24-hour default before the
 * dashboard is public. The web tier never reads this; only the job does. */
const ENV = (typeof process !== 'undefined' && process.env) || {};
/* An unset GitHub Actions variable arrives as '', and Number('') is 0 — which
   would silently disable the embargo. Anything unparseable falls back to 24. */
const RAW_EMBARGO = ENV.EMBARGO_HOURS;
const PARSED_EMBARGO = RAW_EMBARGO === undefined || String(RAW_EMBARGO).trim() === ''
  ? 24 : Number(RAW_EMBARGO);
const EMBARGO_HOURS = Number.isFinite(PARSED_EMBARGO) ? Math.max(0, PARSED_EMBARGO) : 24;
const LIVE_TEST = EMBARGO_HOURS < 24;
const WITHHELD = LIVE_TEST ? 'Withheld — live test mode' : null;

const DEPARTURE = '2026-09-02'; // day 1 — Ron departed the morning of Sept 2, 2026
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

const TZ = 'America/Winnipeg';
const MI_TO_KM = 1.609344;
const km = (n) => Math.round(n || 0);

/* Tessie sends timestamps as Unix SECONDS, not ISO strings. Everything that
   touches a date goes through here — a raw `new Date(d.started_at)` yields
   1970 and every derived label reads NaN. */
function toDate(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' || /^\d+$/.test(String(v))) {
    const n = Number(v);
    return new Date(n < 1e12 ? n * 1000 : n);
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/* Local calendar day, not UTC — a 9pm drive belongs to that evening. */
function dayKey(v) {
  const d = toDate(v);
  return d ? d.toLocaleDateString('en-CA', { timeZone: TZ }) : null;
}

function fmtDayKey(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  if (!y || !m || !d) return '-';
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', { day: 'numeric', month: 'short' });
}

function dayIndex(v) {
  const d = toDate(v);
  if (!d) return null;
  return Math.floor((d - new Date(DEPARTURE)) / 864e5) + 1;
}

/* Tessie mirrors Tesla's payload, where the odometer is nested and in MILES.
   Prefer an explicitly-km field if one appears; otherwise convert. */
function odometerKm(state) {
  const s = state || {};
  const v = s.vehicle_state || {};
  const candidates = [
    [s.odometer_km, 'km'], [v.odometer_km, 'km'],
    [s.odometer, 'mi'], [v.odometer, 'mi'],
  ];
  for (const [val, unit] of candidates) {
    if (typeof val === 'number' && val > 0) return unit === 'km' ? val : val * MI_TO_KM;
  }
  return 0;
}

/* "1240 18th St, Brandon, Manitoba R7A 7S1, Canada" → "Brandon, Manitoba".
   Drops the street line, the country, and the postal code — a postal code is a
   few blocks, which defeats the point of rounding to a town. */
function town(loc) {
  if (!loc) return '—';
  let parts = String(loc).split(',').map((s) => s.trim()).filter(Boolean);
  parts = parts.filter((p) => !/^(canada|usa|u\.s\.a\.|united states|mexico)$/i.test(p));
  if (parts.length > 2 || /^\d/.test(parts[0] || '')) parts = parts.slice(1);
  parts = parts.map((p) => p
    .replace(/\s+[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d$/, '')
    .replace(/\s+\d{5}(-\d{4})?$/, '')
    .trim());
  return parts.filter(Boolean).join(', ') || '—';
}

/* Tessie returns one record per drive; the dashboard wants one per day. */
function byDay(drives) {
  const acc = new Map();
  for (const d of drives) {
    const key = dayKey(d.started_at);
    if (!key) continue;
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
function chargeCounts(charges, cutoff, targetDay) {
  const out = { day: 0, daySc: 0, dayOther: 0, life: 0, lifeSc: 0, lifeOther: 0, lastDay: targetDay || null };
  const published = (charges || []).filter((c) => {
    const d = toDate(c.started_at);
    return d && d <= cutoff;
  });
  for (const c of published) {
    out.life += 1;
    if (isSupercharger(c)) out.lifeSc += 1; else out.lifeOther += 1;
  }
  if (!targetDay) return out;
  for (const c of published.filter((c) => dayKey(c.started_at) === targetDay)) {
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
  const at = (d) => toDate(d.ended_at || d.started_at);
  const published = all.filter((d) => { const t = at(d); return t && t <= cutoff; });
  const held = all.filter((d) => { const t = at(d); return t && t > cutoff; });
  const heldKm = held.reduce((s, d) => s + (d.odometer_distance || 0), 0);

  const days = byDay(published);

  /* The dashboard is about the challenge, not the car's whole history. Days
     before departure are dropped — otherwise they render as "Day -15". The
     lifetime odometer stays lifetime; only the daily figures are trip-scoped. */
  const trip = days.filter((d) => (dayIndex(d.date) || 0) >= 1);
  const recent = trip.slice(-8);
  const last = trip[trip.length - 1] || null;
  const dayNo = last ? dayIndex(last.date) : 0;

  /* Position comes from the last published drive whatever its date, so the
     location box isn't blank before day 1 closes. Still town-rounded and still
     behind the embargo. */
  const position = days[days.length - 1] || { date: null, ending: null };

  const odometer = km(odometerKm(state) - heldKm);
  const driving = trip.filter((d) => d.km > 0);
  const ch = chargeCounts(charges, cutoff, last ? last.date : null);

  return {
    odometer,
    goal: GOAL,
    day: dayNo,
    province: WITHHELD || (town(position.ending).split(',').pop().trim() || '—'),
    route: WITHHELD || town(position.ending),
    today: km(last ? last.km : 0),
    best: km(Math.max(0, ...trip.map((d) => d.km))),
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
      label: last ? 'Latest day · Day ' + dayNo : 'Awaiting day 1',
      corridor: WITHHELD || town(position.ending),
      km: km(last ? last.km : 0),
      path: [],
      stops: [],
    },
    asOf: (last && last.date) || position.date || dayKey(cutoff),
    embargoHours: EMBARGO_HOURS,
    liveTest: LIVE_TEST || undefined,
    days: recent.map((d) => ({ label: 'D ' + dayIndex(d.date), km: km(d.km) })),
    log: trip.slice(-5).reverse().map((d) => ({
      day: 'Day ' + dayIndex(d.date),
      date: fmtDayKey(d.date),
      province: WITHHELD || town(d.ending).split(',').pop().trim(),
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
