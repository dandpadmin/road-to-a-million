/* The helper. Runs on a private timer — never in the web tier.
 * Reads TESSIE_TOKEN + TESSIE_VIN from the environment, calls Tessie, and
 * writes the embargoed, town-rounded snapshot to odometer.json.
 *
 * Also maintains history.json — the small set of facts Tessie reports only as
 * "now" and never retroactively. Today that is the firmware version. The file
 * is committed alongside odometer.json and grows by a line every few weeks.
 *
 * Local test:  TESSIE_TOKEN=… TESSIE_VIN=… node job/fetch-snapshot.mjs
 */

async function main() {
  const { writeFile, readFile, mkdir } = await import('node:fs/promises');
  const { readdir } = await import('node:fs/promises');
  const { shape, archiveByMonth, ledgerRows, ledgerMonth, ROUTE_START, ROUTE_VERSION, routeCutoff, routeFold, routePublic, dayWindow, dayDriveSpans, dayTrackCells } = await import('../tessie.js');

  const TOKEN = process.env.TESSIE_TOKEN;
  const VIN = process.env.TESSIE_VIN;
  const OUT = process.env.OUT || 'odometer.json';
  const HIST = process.env.HISTORY || 'history.json';
  const ARCHIVE_DIR = process.env.ARCHIVE_DIR || 'archive';
  const LEDGER_DIR = process.env.LEDGER_DIR || 'ledger';
  if (!TOKEN || !VIN) { console.error('Missing TESSIE_TOKEN or TESSIE_VIN'); process.exit(1); }

  const H = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' };
  const q = 'distance_format=km&timezone=America/Winnipeg';

  const get = async (path) => {
    const res = await fetch(`https://api.tessie.com/${VIN}/${path}`, { headers: H });
    if (!res.ok) {
      /* The two failures worth naming: an expired/rotated token and a VIN the
         token can't see. Everything else reads as itself. */
      const why = res.status === 401 || res.status === 403
        ? ' — TESSIE_TOKEN is rejected; regenerate it in Tessie and update the repo secret'
        : res.status === 404
          ? ' — TESSIE_VIN not found on this Tessie account'
          : '';
      throw new Error(`${path} → ${res.status} ${res.statusText}${why}`);
    }
    return res.json();
  };
  /* Optional endpoints must never take the odometer down with them. */
  const soft = (path) => get(path).catch((e) => { console.warn(`${path} unavailable:`, e.message); return null; });

  const [state, drives, charges, health] = await Promise.all([
    get('state'),
    /* A fixed recent window, NOT the whole trip — the request is the same size
       on day 900 as on day 9. ~6 weeks of drives covers the 30 plotted days in
       dayMaps with room to spare; anything older is read from the ledger. */
    get(`drives?${q}&limit=800`),
    soft(`charges?${q}&limit=600`),
    soft('battery_health'),
  ]);

  const chargeList = charges ? (charges.results || charges) : [];

  /* history.json is append-only and must survive a failed read — losing it
     would silently reset the firmware log to empty and commit that. */
  let history = { firmware: [] };
  try {
    const raw = await readFile(HIST, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.firmware)) history = parsed;
  } catch (e) { console.warn('history.json not read, starting fresh:', e.message); }

  const version = (state && (state.car_version || (state.vehicle_state && state.vehicle_state.car_version))) || null;
  if (version) {
    const clean = String(version).split(' ')[0];
    const latest = history.firmware[history.firmware.length - 1];
    if (!latest || latest.version !== clean) {
      history.firmware.push({ version: clean, since: new Date().toISOString().slice(0, 10) });
      console.log(`firmware recorded: ${clean}`);
    }
  }

  const driveList = drives.results || drives;

  /* The ledger: every drive and charge that has cleared the location embargo,
     one file per month per kind, one row per line so a new drive is a
     one-line diff. Read everything, fold this run's window in, and write back
     only the months that changed. A ledger that fails to read aborts the run
     rather than being rewritten from the window — that would silently drop
     every drive older than the window and commit the loss. */
  const ledger = { drives: [], charges: [] };
  let ledgerFiles = [];
  try { ledgerFiles = (await readdir(LEDGER_DIR)).filter((f) => /^(drives|charges)-\d{4}-\d{2}\.json$/.test(f)); }
  catch (e) { console.warn('ledger/ not found, starting it:', e.message); }
  const priorBody = new Map();
  for (const f of ledgerFiles) {
    const raw = await readFile(`${LEDGER_DIR}/${f}`, 'utf8');
    const rows = JSON.parse(raw); // throws → run fails → nothing committed
    if (!Array.isArray(rows)) throw new Error(`${LEDGER_DIR}/${f} is not an array — refusing to overwrite`);
    priorBody.set(f, raw);
    ledger[f.startsWith('drives') ? 'drives' : 'charges'].push(...rows);
  }
  const fresh = ledgerRows({ drives: driveList, charges: chargeList });
  for (const kind of ['drives', 'charges']) {
    const byId = new Map(ledger[kind].map((r) => [r.id, r]));
    for (const r of fresh[kind]) byId.set(r.id, r); // Tessie's latest reading wins
    ledger[kind] = [...byId.values()].sort((a, b) => a.s - b.s);
  }
  const ledgerOut = new Map();
  for (const kind of ['drives', 'charges']) {
    for (const r of ledger[kind]) {
      const f = `${kind}-${ledgerMonth(r)}.json`;
      if (!ledgerOut.has(f)) ledgerOut.set(f, []);
      ledgerOut.get(f).push(r);
    }
  }
  await mkdir(LEDGER_DIR, { recursive: true });
  for (const [f, rows] of ledgerOut) {
    const body = '[\n' + rows.map((r) => JSON.stringify(r)).join(',\n') + '\n]\n';
    if (priorBody.get(f) !== body) {
      await writeFile(`${LEDGER_DIR}/${f}`, body);
      console.log(`ledger: wrote ${LEDGER_DIR}/${f} (${rows.length} rows)`);
    }
  }

  /* The all-time route. Picks up exactly where the last run stopped, so each
     call asks Tessie for ~15 minutes of path once the backlog is cleared.
     Catch-up (first run, or after an outage) walks forward in 3-day chunks,
     a bounded number per run. Optional — a failure leaves the route where it
     was and the next run resumes from the same point. */
  const ROUTE_LEDGER = `${LEDGER_DIR}/route.json`;
  const ROUTE_OUT = process.env.ROUTE_OUT || 'route.json';
  let route = { v: ROUTE_VERSION, until: ROUTE_START, tail: null, lines: [] };
  let routeRaw = null;
  try {
    routeRaw = await readFile(ROUTE_LEDGER, 'utf8');
    const r = JSON.parse(routeRaw); // throws → run fails → nothing overwritten
    /* A ledger from an older parser is rebuilt from departure rather than
       trusted — v1 skipped every point of Tessie's string format and still
       advanced `until`, so it reads as "done" with nothing drawn. */
    if (r && Array.isArray(r.lines) && typeof r.until === 'number' && r.v !== ROUTE_VERSION) console.warn('route ledger is an older version — rebuilding from departure');
    else if (r && Array.isArray(r.lines) && typeof r.until === 'number') route = r;
    else throw new Error(`${ROUTE_LEDGER} is malformed — refusing to overwrite`);
  } catch (e) { if (routeRaw !== null) throw e; console.warn('route ledger not found, starting from departure'); }
  const stopAt = routeCutoff();
  for (let chunk = 0; chunk < 14 && route.until < stopAt; chunk++) {
    const to = Math.min(stopAt, route.until + 3 * 86400);
    try {
      const payload = await get(`path?from=${route.until}&to=${to}&simplify=true`);
      const folded = routeFold(route, payload);
      /* Points came back but none could be read — the payload shape changed.
         Stop without advancing, so nothing is skipped; the warning says why. */
      if (folded.raw > 0 && folded.read === 0) {
        console.warn(`::warning::path returned ${folded.raw} points in an unreadable shape, e.g. ${JSON.stringify((payload.results || payload)[0]).slice(0, 80)} — route not advanced`);
        break;
      }
      route = { v: ROUTE_VERSION, until: to, tail: folded.tail, lines: folded.lines };
    } catch (e) { console.warn('path unavailable:', e.message); break; }
  }
  const routeBody = JSON.stringify(route);
  if (routeBody !== routeRaw) {
    await writeFile(ROUTE_LEDGER, routeBody);
    await writeFile(ROUTE_OUT, JSON.stringify(routePublic(route)));
    console.log(`route: ${route.lines.length} lines, ${route.lines.reduce((s, l) => s + l.length / 2, 0)} cells, through ${new Date(route.until * 1000).toISOString()}`);
  }

  /* Per-day tracks for the day maps. Fetched once per finished day; the day
     still straddling the location cutoff is topped up each run until it
     clears. Backfill is bounded per run so a cold start spreads over a few
     runs rather than hammering Tessie. */
  const dayPaths = {};
  const dpPrior = new Map();
  let dpFiles = [];
  try { dpFiles = (await readdir(LEDGER_DIR)).filter((f) => /^daypaths-\d{4}-\d{2}\.json$/.test(f)); } catch (e) { /* none yet */ }
  for (const f of dpFiles) {
    const raw = await readFile(`${LEDGER_DIR}/${f}`, 'utf8');
    const obj = JSON.parse(raw); // throws → run fails → nothing overwritten
    dpPrior.set(f, raw);
    Object.assign(dayPaths, obj);
  }
  /* The span fetched is that day's drives, first start to last end — the same
     drives the day map pins come from, so the line and the pins agree even
     when a drive runs past midnight. A day is done once the whole calendar
     day has cleared the embargo; until then it is topped up each run. */
  const locCut = routeCutoff();
  const spans = dayDriveSpans(ledger.drives);
  let dpFetches = 0;
  for (const key of Object.keys(spans).sort()) {
    if (dpFetches >= 40) break;
    const sp = spans[key];
    const have = dayPaths[key];
    if (have && have.done && have.to === sp.to) continue;
    const to = Math.min(sp.to, locCut);
    try {
      const payload = await get(`path?from=${sp.from}&to=${to}&simplify=true`);
      dpFetches += 1;
      const t = dayTrackCells(payload);
      if (t.raw > 0 && t.read === 0) { console.warn(`::warning::day path ${key}: unreadable point shape — skipped`); break; }
      dayPaths[key] = { c: t.cells, to: sp.to, done: dayWindow(key).to <= locCut };
    } catch (e) { console.warn(`day path ${key} unavailable:`, e.message); break; }
  }
  const dpOut = new Map();
  for (const key of Object.keys(dayPaths).sort()) {
    const f = `daypaths-${key.slice(0, 7)}.json`;
    if (!dpOut.has(f)) dpOut.set(f, {});
    dpOut.get(f)[key] = dayPaths[key];
  }
  for (const [f, obj] of dpOut) {
    const body = '{\n' + Object.entries(obj).map(([k, v]) => JSON.stringify(k) + ':' + JSON.stringify(v)).join(',\n') + '\n}\n';
    if (dpPrior.get(f) !== body) { await writeFile(`${LEDGER_DIR}/${f}`, body); console.log(`daypaths: wrote ${f} (${Object.keys(obj).length} days)`); }
  }

  const snapshot = shape({
    state,
    drives: driveList,
    charges: chargeList,
    health,
    history,
    ledger,
    dayPaths,
  });

  await writeFile(OUT, JSON.stringify(snapshot, null, 2));
  await writeFile(HIST, JSON.stringify(history, null, 2));
  if (!snapshot.odometer) console.warn('WARNING: odometer read as 0 — check the /state payload shape');
  if (snapshot.day === null) console.warn('WARNING: day index null — DEPARTURE in tessie.js is not a valid date');
  if (!snapshot.nerd.efficiency.points.length) console.warn('NOTE: no efficiency points — check the drives payload carries energy and outside temperature');
  console.log(`wrote ${OUT} — odometer ${snapshot.odometer} km, as at ${snapshot.asOf}`);

  /* Static archive pages. odometer.json only ever ships a recent window of
     dayMaps to stay light — this writes one small file per calendar month,
     covering the whole trip, and never prunes. Recomputed from the same
     drives every run and only written when a month's content actually
     changed, so a job that runs every 15 minutes doesn't spam the history
     with identical commits. */
  const months = archiveByMonth({ drives: driveList, charges: chargeList, dayPaths });
  /* Closed days are frozen. The archive is rebuilt from the recent window, so
     the oldest day in it is only partly covered and older days are not
     covered at all — rewriting from the window alone would shrink or delete
     them. A day already on file and more than FREEZE_DAYS old is kept exactly
     as written; newer days are refreshed so late-arriving records land. */
  const FREEZE_DAYS = 3;
  const freezeBefore = new Date(Date.now() - (24 + FREEZE_DAYS * 24) * 36e5)
    .toLocaleDateString('en-CA', { timeZone: 'America/Winnipeg' });
  let archiveFiles = [];
  try { archiveFiles = (await readdir(ARCHIVE_DIR)).filter((f) => /^\d{4}-\d{2}\.json$/.test(f)); } catch (e) { /* first run */ }
  for (const f of archiveFiles) {
    const monthKey = f.slice(0, 7);
    const prior = JSON.parse(await readFile(`${ARCHIVE_DIR}/${f}`, 'utf8'));
    const merged = new Map((months.get(monthKey) || []).map((d) => [d.key, d]));
    for (const d of prior) {
      const fresh = merged.get(d.key);
      if (!fresh) { merged.set(d.key, d); continue; }
      if (d.key >= freezeBefore) continue; // still settling — take this run's
      /* Frozen. The one exception: the copy on file is the old joined-endpoints
         line and this run can draw the real track. Only the drawing is swapped
         (line, pins, scale) and only when this run saw the whole day — its km
         agrees with the frozen figure — so a day half out of the drive window
         can never shrink the archive. Everything else stays as written. */
      const whole = d.km > 0 && Math.abs(fresh.km - d.km) / d.km < 0.02;
      const ver = (t) => (t === true ? 1 : Number(t) || 0); // v1 wrote `true`
      if (ver(fresh.track) > ver(d.track) && whole) {
        merged.set(d.key, { ...d, path: fresh.path, stops: fresh.stops, kmPerPx: fresh.kmPerPx, plotted: fresh.plotted, track: fresh.track });
      } else merged.set(d.key, d);
    }
    months.set(monthKey, [...merged.values()].sort((a, b) => a.key.localeCompare(b.key)));
  }
  if (months.size) {
    await mkdir(ARCHIVE_DIR, { recursive: true });
    const index = [];
    for (const [monthKey, days] of [...months.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const path = `${ARCHIVE_DIR}/${monthKey}.json`;
      const body = JSON.stringify(days, null, 2);
      let prior = null;
      try { prior = await readFile(path, 'utf8'); } catch (e) { /* first time this month is written */ }
      if (prior !== body) {
        await writeFile(path, body);
        console.log(`archive: wrote ${path} (${days.length} day${days.length === 1 ? '' : 's'})`);
      }
      const [y, m] = monthKey.split('-').map(Number);
      index.push({
        month: monthKey,
        label: new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        days: days.length,
        km: days.reduce((s, d) => s + d.km, 0),
        first: days[0].key,
        last: days[days.length - 1].key,
      });
    }
    index.sort((a, b) => b.month.localeCompare(a.month)); // newest first
    const indexPath = `${ARCHIVE_DIR}/index.json`;
    const indexBody = JSON.stringify(index, null, 2);
    let priorIndex = null;
    try { priorIndex = await readFile(indexPath, 'utf8'); } catch (e) { /* first run */ }
    if (priorIndex !== indexBody) {
      await writeFile(indexPath, indexBody);
      console.log(`archive: wrote ${indexPath} (${index.length} month${index.length === 1 ? '' : 's'})`);
    }
  }
}

main().catch((e) => { console.error(`::error::${e.message}`); process.exit(1); });
