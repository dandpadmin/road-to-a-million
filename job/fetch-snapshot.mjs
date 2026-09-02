/* The helper. Runs on a private timer — never in the web tier.
 * Reads TESSIE_TOKEN + TESSIE_VIN from the environment, calls Tessie, and
 * writes the embargoed, town-rounded snapshot to odometer.json.
 *
 * Local test:  TESSIE_TOKEN=… TESSIE_VIN=… node job/fetch-snapshot.mjs
 */

async function main() {
  const { writeFile } = await import('node:fs/promises');
  const { shape } = await import('../tessie.js');

  const TOKEN = process.env.TESSIE_TOKEN;
  const VIN = process.env.TESSIE_VIN;
  const OUT = process.env.OUT || 'odometer.json';
  if (!TOKEN || !VIN) { console.error('Missing TESSIE_TOKEN or TESSIE_VIN'); process.exit(1); }

  const H = { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' };
  const q = 'distance_format=km&timezone=America/Winnipeg';

  const get = async (path) => {
    const res = await fetch(`https://api.tessie.com/${VIN}/${path}`, { headers: H });
    if (!res.ok) throw new Error(`${path} → ${res.status} ${res.statusText}`);
    return res.json();
  };

  const [state, drives, charges] = await Promise.all([
    get('state'),
    get(`drives?${q}&limit=400`),
    get(`charges?${q}&limit=2000`).catch((e) => { console.warn('charges unavailable:', e.message); return null; }),
  ]);

  const chargeList = charges ? (charges.results || charges) : [];

  if (chargeList.length) {
    const sample = chargeList[chargeList.length - 1];
    console.log('charge record fields:', Object.keys(sample).join(', '));
    console.log('network-ish values:', JSON.stringify({
      is_supercharger: sample.is_supercharger,
      is_fast_charger: sample.is_fast_charger,
      fast_charger_brand: sample.fast_charger_brand,
      location: sample.location,
      site_name: sample.site_name,
    }));
  }

  const snapshot = shape({
    state,
    drives: drives.results || drives,
    charges: chargeList,
  });

  await writeFile(OUT, JSON.stringify(snapshot, null, 2));
  if (!snapshot.odometer) console.warn('WARNING: odometer read as 0 — check the /state payload shape');
  if (snapshot.day === null) console.warn('WARNING: day index null — DEPARTURE in tessie.js is not a valid date');
  console.log(`wrote ${OUT} — odometer ${snapshot.odometer} km, as at ${snapshot.asOf}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
