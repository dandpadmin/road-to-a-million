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
 * DRIVER SAFETY — locations are embargoed on their own clock.
 * Distance may run live; anything that reveals a PLACE is held back at least
 * LOCATION_EMBARGO_HOURS (24, floored) and rounded to town, so
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

/* SPLIT EMBARGO. Two clocks, deliberately different.
 *
 *   EMBARGO_HOURS          — the DISTANCE clock. Settable via env (0 = live).
 *   LOCATION_EMBARGO_HOURS — the LOCATION clock. Floored at 24, always.
 *
 * Distance figures (odometer, daily km, charge counts) publish on the first
 * clock, so they can run live. Anything that says WHERE — towns, provinces,
 * the plotted route — publishes on the second, which no env var can pull below
 * 24 hours. Setting EMBARGO_HOURS=0 now makes the numbers live and leaves the
 * map a day behind, rather than blanking the map. The web tier never reads
 * either value; only the job does. */
const ENV = (typeof process !== 'undefined' && process.env) || {};
/* An unset GitHub Actions variable arrives as '', and Number('') is 0 — which
   would silently disable the embargo. Anything unparseable falls back to 24. */
const RAW_EMBARGO = ENV.EMBARGO_HOURS;
const PARSED_EMBARGO = RAW_EMBARGO === undefined || String(RAW_EMBARGO).trim() === ''
  ? 24 : Number(RAW_EMBARGO);
const EMBARGO_HOURS = Number.isFinite(PARSED_EMBARGO) ? Math.max(0, PARSED_EMBARGO) : 24;
/* Hard floor. Deliberately not derived from EMBARGO_HOURS — a location is the
   one field that can put a person in danger, so it does not take instruction
   from configuration. Raise it here if you want a longer hold; it cannot go
   below 24 from outside this file. */
const LOCATION_EMBARGO_HOURS = Math.max(24, EMBARGO_HOURS);
const LIVE_KM = EMBARGO_HOURS < 24;

const DEPARTURE = '2026-09-02'; // day 1 — Ron departed the morning of Sept 2, 2026
const GOAL = 1000000;
/* How many days get a plotted route. Every plotted day costs ~500 bytes in
   odometer.json, so this is a rolling window rather than the whole trip —
   at 1,000 days the file would otherwise pass half a megabyte. Older days
   keep their log row and their distance, they just stop being clickable. */
const MAP_DAYS = 30;
/* How many days the log lists. */
const LOG_DAYS = 10;

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

/* Format a YYYY-MM-DD day key for display. Built from parts on purpose —
   new Date('2026-09-02') is UTC midnight, which renders as Sep 1 in Winnipeg. */
function fmtDayKey(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  if (!y || !m || !d) return '—';
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
/* Reverse geocoding on a remote stretch often returns the road rather than a
   settlement — "Alaska Highway Frontage Road, British Columbia". A road name is
   not a town and reads as noise on the map, so it is dropped in favour of
   whatever comes after it. */
const ROADISH = /\b(highway|hwy|freeway|expressway|frontage|road|rd|route|rte|street|ave|avenue|drive|lane|boulevard|blvd|trail|parkway|pkwy|access|service)\b/i;

function town(loc) {
  if (!loc) return '—';
  let parts = String(loc).split(',').map((s) => s.trim()).filter(Boolean);
  parts = parts.filter((p) => !/^(canada|usa|u\.s\.a\.|united states|mexico)$/i.test(p));
  if (parts.length > 2 || /^\d/.test(parts[0] || '')) parts = parts.slice(1);
  parts = parts.map((p) => p
    .replace(/\s+[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d$/, '')
    .replace(/\s+\d{5}(-\d{4})?$/, '')
    .trim());
  while (parts.length > 1 && ROADISH.test(parts[0])) parts = parts.slice(1);
  return parts.filter(Boolean).join(', ') || '—';
}

/* Tessie returns one record per drive; the dashboard wants one per day.
   Sorted before folding so `starting` is genuinely the day's first departure
   and `ending` its last arrival — the records do not arrive in order. */
function byDay(drives) {
  const acc = new Map();
  const ordered = [...(drives || [])].sort((a, b) => (toDate(a.started_at) || 0) - (toDate(b.started_at) || 0));
  for (const d of ordered) {
    const key = dayKey(d.started_at);
    if (!key) continue;
    const row = acc.get(key) || { date: key, km: 0, drives: 0, energy: 0, autopilot: 0, starting: null, ending: null };
    row.km += d.odometer_distance || 0;
    row.energy += d.energy_used || 0;
    row.autopilot += d.autopilot_distance || 0;
    row.drives += 1;
    if (row.starting === null) row.starting = d.starting_location || null;
    row.ending = d.ending_location || row.ending;
    acc.set(key, row);
  }
  return [...acc.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/* Tessie flags Tesla-network sessions with a boolean; the text fields are a
   fallback for records that predate it or come from a different shape. Checked
   in order of reliability \u2014 an explicit false is respected, not overridden. */
function isSupercharger(c) {
  if (!c) return false;
  for (const key of ['is_supercharger', 'supercharger', 'is_tesla_charger']) {
    if (typeof c[key] === 'boolean') return c[key];
  }
  const text = [
    c.location, c.site_name, c.site, c.charger_type, c.network,
    c.address, c.name, c.fast_charger_brand, c.conn_charge_cable,
  ].filter(Boolean).join(' ');
  if (/supercharg|tesla/i.test(text)) return true;
  /* A DC fast charge on the Tesla cable is a Supercharger in practice. */
  if (c.is_fast_charger === true && /tesla|tpc/i.test(text)) return true;
  return false;
}

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

/* Town-level rounding for plotted coordinates. 0.05° is roughly 5km — enough
   to draw the day's corridor, far too coarse to locate a car. Applied BEFORE
   anything is normalised, so full-precision coordinates never leave here. */
const GRID = 0.05;
const snap = (n) => Math.round(n / GRID) * GRID;

function coords(o, prefix) {
  const lat = o[prefix + 'latitude'] ?? o.latitude;
  const lon = o[prefix + 'longitude'] ?? o.longitude;
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  if (!lat && !lon) return null;
  return [snap(lat), snap(lon)];
}

/* The viewBox DayMap draws into. Projection needs these to keep one scale on
   both axes, so they live here and must match Panels.jsx. */
const VB_W = 720, VB_H = 300, PAD = 0.08, DEG_KM = 111.0;

/* Project one day's drives into the normalised 0–1 points DayMap plots.

   EQUAL SCALE ON BOTH AXES. An earlier version normalised lat and lon
   independently, which made every day fill the frame regardless of length —
   fine for a single latest-day panel, wrong the moment days can be compared.
   One px-per-degree factor is used for both axes and reported back as
   kmPerPx, so the panel can draw an honest scale bar and a 90km day reads as
   visibly smaller than a 1,300km one.

   Callers must pass only location-embargoed drives — this function does not
   police the clock, it just draws what it is handed. */
function projectDay(drives, charges, targetDay) {
  const empty = { path: [], stops: [], kmPerPx: 0 };
  if (!targetDay) return empty;

  const dayDrives = (drives || [])
    .filter((d) => dayKey(d.started_at) === targetDay)
    .sort((a, b) => (toDate(a.started_at) || 0) - (toDate(b.started_at) || 0));
  if (!dayDrives.length) return empty;

  const raw = [];
  for (const d of dayDrives) {
    const s = coords(d, 'starting_');
    const e = coords(d, 'ending_');
    if (s) raw.push({ ll: s, town: town(d.starting_location) });
    if (e) raw.push({ ll: e, town: town(d.ending_location) });
  }
  /* Snapping collapses consecutive points inside the same 5km cell. */
  const pts = raw.filter((p, i) => !i || p.ll[0] !== raw[i - 1].ll[0] || p.ll[1] !== raw[i - 1].ll[1]);
  if (pts.length < 2) return empty;

  const lats = pts.map((p) => p.ll[0]);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  /* Equirectangular: squeeze longitude by cos(lat) so a degree east covers the
     same ground as a degree north at this latitude. y inverted — north is up. */
  const kx = Math.cos((midLat * Math.PI) / 180);
  const mu = (ll) => [ll[1] * kx, -ll[0]];
  const units = pts.map((p) => mu(p.ll));
  const xs = units.map((m) => m[0]), ys = units.map((m) => m[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  /* Floor matches the 5km snap grid — below it the points are one cell and
     there is nothing real left to magnify. */
  const FLOOR = GRID;
  const boxW = Math.max(maxX - minX, FLOOR), boxH = Math.max(maxY - minY, FLOOR);
  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2;
  /* One factor, both axes: px per degree, whichever axis is tighter. */
  const k = Math.min((VB_W * (1 - PAD * 2)) / boxW, (VB_H * (1 - PAD * 2)) / boxH);
  const at = (m) => [
    Number((0.5 + ((m[0] - midX) * k) / VB_W).toFixed(4)),
    Number((0.5 + ((m[1] - midY) * k) / VB_H).toFixed(4)),
  ];

  const path = units.map(at);

  /* One marker per place. Start and end are placed first so they always win;
     a charge in a town already on the map is counted in chargeStops but does
     not earn a second pin — three "FORT NELSON" labels stacked on each other
     is what this prevents. Coordinates are checked too, since two towns can
     snap into the same 5km cell. */
  const stops = [];
  const coordSeen = new Set(), townSeen = new Set();
  const add = (p, kind) => {
    const [x, y] = at(mu(p.ll));
    const ck = x + ',' + y;
    const tk = String(p.town || '').trim().toLowerCase();
    if (coordSeen.has(ck)) return;
    if (tk && tk !== '—' && townSeen.has(tk)) return;
    coordSeen.add(ck);
    if (tk && tk !== '—') townSeen.add(tk);
    stops.push({ x, y, town: p.town || '—', kind });
  };
  add(pts[0], 'start');
  add(pts[pts.length - 1], 'end');

  /* Charge stops for the day, snapped and matched to the nearest path point so
     a marker always sits on the drawn line. */
  for (const c of (charges || []).filter((c) => dayKey(c.started_at) === targetDay)) {
    const ll = coords(c, 'starting_');
    if (!ll) continue;
    const near = pts.reduce((best, p) => {
      const dist = Math.hypot(p.ll[0] - ll[0], p.ll[1] - ll[1]);
      return !best || dist < best.dist ? { p, dist } : best;
    }, null);
    if (near && near.dist < 0.6) add({ ll: near.p.ll, town: town(c.location) || near.p.town }, 'charge');
  }

  return { path, stops, kmPerPx: Number((DEG_KM / k).toFixed(4)) };
}

/* Tessie mirrors Tesla's field names, which have drifted across firmware and
   are not identical between the drives and charges payloads. Every optional
   figure is read through this rather than a single hard-coded key, so a
   renamed field degrades to "no data" instead of NaN on the page. */
function pick(obj, keys) {
  for (const k of keys) {
    const v = obj && obj[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}

const F_OUTSIDE_TEMP = ['average_outside_temperature', 'outside_temp', 'outside_temperature', 'avg_outside_temp'];
const F_ENERGY_USED = ['energy_used', 'energy_used_kwh', 'kwh_used'];
const F_ENERGY_ADDED = ['energy_added', 'charge_energy_added', 'energy_added_kwh'];
const F_COST = ['cost', 'total_cost', 'charge_cost'];
const F_SOC_END = ['ending_battery', 'end_battery_level', 'battery_level_end', 'ending_battery_level'];
const F_POWER = ['max_charger_power', 'charger_power', 'peak_power_kw'];

/* Everything the nerd section reads. Built from the payloads already fetched
   for the odometer \u2014 no extra Tessie calls except battery health, which the
   job passes in. Anything naming a place is built from locPublished, so the
   province colouring on the scatter is 24h behind like every other location. */
function nerdBlock({ published, locPublished, charges, health, history }) {
  const chargeList = charges || [];

  /* Efficiency. One dot per drive: outside temperature against Wh/km, coloured
     by province. Short hops are dropped \u2014 under 5km the figure is dominated by
     start-up draw and says nothing about the drive. */
  const points = [];
  for (const d of locPublished) {
    const km2 = d.odometer_distance || 0;
    const kwh = pick(d, F_ENERGY_USED);
    const t = pick(d, F_OUTSIDE_TEMP);
    if (km2 < 5 || kwh === null || kwh <= 0 || t === null) continue;
    points.push({
      t: Number(t.toFixed(1)),
      wh: Math.round((kwh * 1000) / km2),
      km: km(km2),
      prov: town(d.ending_location).split(',').pop().trim() || '\u2014',
    });
  }
  /* Newest last, capped \u2014 the whole trip's drives would eventually dominate
     the file, and the pattern is legible long before then. */
  const scatter = points.slice(-600);
  const whVals = scatter.map((p) => p.wh).sort((a, b) => a - b);
  const median = whVals.length ? whVals[Math.floor(whVals.length / 2)] : 0;

  /* Autopilot and energy totals run on the distance clock \u2014 no place in them. */
  let apKm = 0, totalKm = 0, usedKwh = 0;
  for (const d of published) {
    totalKm += d.odometer_distance || 0;
    apKm += d.autopilot_distance || 0;
    const e = pick(d, F_ENERGY_USED);
    if (e !== null && e > 0) usedKwh += e;
  }

  let addedKwh = 0, cost = 0, costSc = 0, costOther = 0, costed = 0;
  const curve = new Map(); // state of charge bucket -> [kW samples]
  for (const c of chargeList) {
    const a = pick(c, F_ENERGY_ADDED);
    if (a !== null && a > 0) addedKwh += a;
    const money = pick(c, F_COST);
    if (money !== null && money > 0) {
      cost += money; costed += 1;
      if (isSupercharger(c)) costSc += money; else costOther += money;
    }
    /* Aggregate charge curve. A session summary gives one peak-power reading at
       one state of charge, so a single session is a dot, not a curve \u2014 pooled
       across every session the shape of the taper appears. Bucketed in 5% steps. */
    const soc = pick(c, F_SOC_END);
    const kw = pick(c, F_POWER);
    if (soc !== null && kw !== null && kw > 0) {
      const b = Math.round(soc / 5) * 5;
      if (!curve.has(b)) curve.set(b, []);
      curve.get(b).push(kw);
    }
  }
  const curvePoints = [...curve.entries()]
    .map(([soc, vals]) => ({ soc, kw: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length), n: vals.length }))
    .sort((a, b) => a.soc - b.soc);

  return {
    efficiency: {
      points: scatter,
      median,
      best: whVals.length ? whVals[0] : 0,
      worst: whVals.length ? whVals[whVals.length - 1] : 0,
      /* Distinct provinces present, so the legend is built from the data. */
      provinces: [...new Set(scatter.map((p) => p.prov))].filter((p) => p && p !== '\u2014'),
    },
    autopilot: {
      km: km(apKm),
      pct: totalKm > 0 ? Number(((apKm / totalKm) * 100).toFixed(1)) : 0,
    },
    energy: {
      used: Math.round(usedKwh),
      added: Math.round(addedKwh),
      /* Charging losses and preconditioning \u2014 added is always the larger. */
      overhead: addedKwh > 0 && usedKwh > 0 ? Number((((addedKwh - usedKwh) / addedKwh) * 100).toFixed(1)) : null,
      whPerKm: totalKm > 0 && usedKwh > 0 ? Math.round((usedKwh * 1000) / totalKm) : 0,
    },
    cost: {
      total: Number(cost.toFixed(2)),
      supercharger: Number(costSc.toFixed(2)),
      other: Number(costOther.toFixed(2)),
      perKm: totalKm > 0 && cost > 0 ? Number((cost / totalKm).toFixed(3)) : 0,
      /* How many sessions actually carried a price \u2014 free chargers and missing
         invoices both show as no cost, and the average lies without this. */
      sessions: costed,
      currency: 'CAD',
    },
    chargeCurve: {
      points: curvePoints,
      sessions: chargeList.length,
      note: 'Peak power per session, pooled by state of charge',
    },
    battery: (() => {
      /* Tessie wraps some endpoints in `results` and the health payload's key
         names vary; normalise here so the panel has no guessing to do. */
      const hb = health && (health.results || health);
      if (!hb || typeof hb !== 'object') return null;
      const healthPct = pick(hb, ['battery_health', 'health', 'health_percent', 'state_of_health']);
      const rangeNow = pick(hb, ['max_range', 'current_max_range', 'rated_range']);
      const rangeOriginal = pick(hb, ['original_max_range', 'original_range', 'as_new_max_range']);
      const degradation = pick(hb, ['degradation', 'degradation_percent']);
      const derived = healthPct !== null ? healthPct
        : degradation !== null ? 100 - degradation
        : rangeNow && rangeOriginal ? Number(((rangeNow / rangeOriginal) * 100).toFixed(1))
        : null;
      if (derived === null && rangeNow === null) return null;
      return { healthPct: derived, rangeNow, rangeOriginal };
    })(),
    firmware: (history && history.firmware) || [],
  };
}

export function shape({ state, drives, charges, health, history }) {
  const all = drives || [];
  const now = Date.now();
  const cutoff = now - EMBARGO_HOURS * 36e5;
  const locCutoff = now - LOCATION_EMBARGO_HOURS * 36e5;

  /* Split at the distance line. Held drives are never published as km — they
     are kept only to walk the live odometer back to the cutoff. */
  const at = (d) => toDate(d.ended_at || d.started_at);
  const published = all.filter((d) => { const t = at(d); return t && t <= cutoff; });
  const held = all.filter((d) => { const t = at(d); return t && t > cutoff; });
  const heldKm = held.reduce((s, d) => s + (d.odometer_distance || 0), 0);

  /* Split again, later, for anything that reveals a place. */
  const locPublished = all.filter((d) => { const t = at(d); return t && t <= locCutoff; });

  const days = byDay(published);
  const locDays = byDay(locPublished);
  /* Which day keys may show a place at all, and the whole row so the log can
     name both ends of the day. A day appears here as soon as some of it clears
     the location window; the locations it carries are drawn from those cleared
     drives, so they are never fresher than the window. */
  const placeOf = new Map(locDays.map((d) => [d.date, d]));

  /* The dashboard is about the challenge, not the car's whole history. Days
     before departure are dropped — otherwise they render as "Day -15". The
     lifetime odometer stays lifetime; only the daily figures are trip-scoped. */
  const trip = days.filter((d) => (dayIndex(d.date) || 0) >= 1);
  const recent = trip.slice(-30);
  const last = trip[trip.length - 1] || null;
  const dayNo = last ? dayIndex(last.date) : 0;

  /* Position comes from the last location-embargoed drive whatever its date, so
     the location box isn't blank before day 1 closes. Town-rounded, and at
     least LOCATION_EMBARGO_HOURS old by construction. */
  const position = locDays[locDays.length - 1] || { date: null, starting: null, ending: null };
  const locTrip = locDays.filter((d) => (dayIndex(d.date) || 0) >= 1);
  const mapDay = locTrip[locTrip.length - 1] || null;

  const odometer = km(odometerKm(state) - heldKm);
  const driving = trip.filter((d) => d.km > 0);
  const ch = chargeCounts(charges, cutoff, last ? last.date : null);
  /* Charge STOPS are plotted, so the maps are built off the location clock and
     the location-side drives — never off `last`, which may be today. One entry
     per day in the rolling window, oldest first, so the page can let the reader
     click back through the trip. */
  const dayMaps = locTrip.slice(-MAP_DAYS).map((d) => {
    const g = projectDay(locPublished, charges, d.date);
    return {
      key: d.date,
      day: dayIndex(d.date),
      label: 'Day ' + dayIndex(d.date) + ' \u00b7 ' + fmtDayKey(d.date),
      km: km(d.km),
      from: town(d.starting),
      to: town(d.ending),
      corridor: town(d.ending),
      /* Counted from the charge records, not the plotted markers — a session
         without coordinates still counts but never gets a pin. */
      chargeStops: chargeCounts(charges, locCutoff, d.date).day,
      note: 'Town level \u00b7 delayed ' + LOCATION_EMBARGO_HOURS + 'h',
      path: g.path,
      stops: g.stops,
      /* km per viewBox pixel — what the panel's scale bar is drawn from. */
      kmPerPx: g.kmPerPx,
      plotted: g.path.length > 1 || undefined,
    };
  });
  const plottedKeys = new Set(dayMaps.filter((m) => m.plotted).map((m) => m.key));

  return {
    odometer,
    goal: GOAL,
    day: dayNo,
    province: town(position.ending).split(',').pop().trim() || '—',
    route: town(position.ending),
    today: km(last ? last.km : 0),
    best: km(Math.max(0, ...trip.map((d) => d.km))),
    avgPerDay: driving.length ? km(driving.reduce((s, d) => s + d.km, 0) / driving.length) : 0,
    chargeSessions: ch.day,
    chargeSupercharger: ch.daySc,
    chargeOther: ch.dayOther,
    chargeLifetime: ch.life,
    chargeLifetimeSupercharger: ch.lifeSc,
    chargeLifetimeOther: ch.lifeOther,
    /* Plotted from the location-embargoed drives, snapped to a 5km grid. Its
       label reports the day it actually shows, which under live km is a day
       behind the odometer above it — say so on the page rather than letting the
       two read as the same day. `dayMap` is the newest plotted day; `dayMaps`
       carries the rolling window the log rows select from. */
    dayMap: dayMaps[dayMaps.length - 1] || {
      label: 'Awaiting day 1',
      corridor: town(position.ending),
      from: '\u2014',
      to: '\u2014',
      km: 0,
      chargeStops: 0,
      note: 'Town level \u00b7 delayed ' + LOCATION_EMBARGO_HOURS + 'h',
      path: [],
      stops: [],
      kmPerPx: 0,
    },
    dayMaps,
    asOf: (last && last.date) || position.date || dayKey(cutoff),
    /* Wall-clock time the job ran. asOf is the day the DATA covers, which only
       moves once a day — this is the only field that proves the feed is alive. */
    updatedAt: new Date().toISOString(),
    embargoHours: EMBARGO_HOURS,
    locationEmbargoHours: LOCATION_EMBARGO_HOURS,
    liveKm: LIVE_KM || undefined,
    nerd: nerdBlock({ published, locPublished, charges, health, history }),
    /* Last 30 days of distance. The page slices this to 8 or shows all 30 — it
       is one honest series either way, not a short one repeated to look long. */
    days: recent.map((d) => ({ key: d.date, label: 'D ' + dayIndex(d.date), km: km(d.km) })),
    log: trip.slice(-LOG_DAYS).reverse().map((d) => {
      const place = placeOf.get(d.date) || null;
      return {
        key: d.date,
        day: 'Day ' + dayIndex(d.date),
        date: fmtDayKey(d.date),
        province: place ? town(place.ending).split(',').pop().trim() : '—',
        /* Both ends of the day, town level. Held on the location clock like
           everything else, so today's row reads "—" until it clears. */
        from: place ? town(place.starting) : '—',
        to: place ? town(place.ending) : '—',
        /* Whether this row has a route to show when clicked. */
        plotted: plottedKeys.has(d.date) || undefined,
        km: km(d.km).toLocaleString('en-CA'),
        note: '', // written by hand — Tessie has no field for what broke
      };
    }),
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
