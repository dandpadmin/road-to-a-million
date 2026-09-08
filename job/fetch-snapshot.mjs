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
  const { writeFile, readFile } = await import('node:fs/promises');
  const { shape } = await import('../tessie.js');

  const TOKEN = process.env.TESSIE_TOKEN;
  const VIN = process.env.TESSIE_VIN;
  const OUT = process.env.OUT || 'odometer.json';
  const HIST = process.env.HISTORY || 'history.json';
  if (!TOKEN || !VIN) { console.error('Missing TESSIE_TOKEN or TESSIE_VIN'); process.exit(1); }

  const H = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' };
  const q = 'distance_format=km&timezone=America/Winnipeg';

  const get = async (path) => {
    const res = await fetch(`https://api.tessie.com/${VIN}/${path}`, { headers: H });
    if (!res.ok) throw new Error(`${path} → ${res.status} ${res.statusText}`);
    return res.json();
  };
  /* Optional endpoints must never take the odometer down with them. */
  const soft = (path) => get(path).catch((e) => { console.warn(`${path} unavailable:`, e.message); return null; });

  const [state, drives, charges, health] = await Promise.all([
    get('state'),
    get(`drives?${q}&limit=400`),
    soft(`charges?${q}&limit=2000`),
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

  const snapshot = shape({
    state,
    drives: drives.results || drives,
    charges: chargeList,
    health,
    history,
  });

  await writeFile(OUT, JSON.stringify(snapshot, null, 2));
  await writeFile(HIST, JSON.stringify(history, null, 2));
  if (!snapshot.odometer) console.warn('WARNING: odometer read as 0 — check the /state payload shape');
  if (snapshot.day === null) console.warn('WARNING: day index null — DEPARTURE in tessie.js is not a valid date');
  if (!snapshot.nerd.efficiency.points.length) console.warn('NOTE: no efficiency points — check the drives payload carries energy and outside temperature');
  console.log(`wrote ${OUT} — odometer ${snapshot.odometer} km, as at ${snapshot.asOf}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
