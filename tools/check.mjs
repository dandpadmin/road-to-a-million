/* Offline checks. Run before pushing:  node tools/check.mjs
 *
 * Nothing here talks to Tessie or the internet. The snapshot job runs against a
 * fake Tessie that records each request and answers with an error, so the job
 * stops before it writes anything. Everything runs in a throwaway copy.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const results = [];
const check = (name, fn) => {
  try { fn(); results.push([true, name]); }
  catch (e) { results.push([false, name, e.message.trim()]); }
};
const run = (args, cwd = ROOT, env = {}) =>
  execFileSync(process.execPath, args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const scratch = () => {
  const dir = mkdtempSync(join(tmpdir(), 'rtam-check-'));
  for (const p of ['job', 'tools', 'tessie.js', 'index.html', 'app.jsx', 'Panels.jsx', 'Nerd.jsx', 'RouteMap.jsx']) {
    cpSync(join(ROOT, p), join(dir, p), { recursive: true });
  }
  return dir;
};

/* A fake Tessie: logs every request as JSON and refuses it, so no files are written. */
const FAKE = `globalThis.fetch = async (url, opts = {}) => {
  console.log('REQUEST ' + JSON.stringify({ method: opts.method || 'GET', url: String(url) }));
  return { ok: false, status: 418, statusText: 'offline check' };
};`;
const fakeEnv = { TESSIE_TOKEN: 'offline-check', TESSIE_VIN: 'OFFLINECHECKVIN00' };
const requestsOf = (dir) => {
  writeFileSync(join(dir, 'fake-tessie.mjs'), FAKE);
  let out = '';
  try { out = run(['--import', './fake-tessie.mjs', 'job/fetch-snapshot.mjs'], dir, fakeEnv); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
  return { out, requests: out.split('\n').filter((l) => l.startsWith('REQUEST ')).map((l) => JSON.parse(l.slice(8))) };
};

check('Job scripts parse', () => {
  for (const f of readdirSync(join(ROOT, 'job')).filter((f) => f.endsWith('.mjs'))) run(['--check', `job/${f}`]);
  run(['--check', 'tessie.js']);
});

check('Read-only check passes on the real code', () => { run(['job/check-readonly.mjs']); });

check('Job only makes allowlisted GET reads, with /state cached', () => {
  const dir = scratch();
  try {
    const { requests } = requestsOf(dir);
    if (!requests.length) throw new Error('the job made no requests');
    const allowed = new Set(['state', 'drives', 'charges', 'path', 'battery_health']);
    for (const r of requests) {
      const endpoint = new URL(r.url).pathname.split('/').pop();
      if (r.method !== 'GET') throw new Error(`${r.method} ${r.url}`);
      if (!allowed.has(endpoint)) throw new Error(`unexpected endpoint /${endpoint}`);
    }
    const state = requests.find((r) => new URL(r.url).pathname.endsWith('/state'));
    if (!state || !state.url.includes('use_cache=true')) throw new Error('/state is not requested with use_cache=true');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('Allowlist refuses a wake call', () => {
  const dir = scratch();
  try {
    const f = join(dir, 'job/fetch-snapshot.mjs');
    writeFileSync(f, readFileSync(f, 'utf8').replace("get('state?use_cache=true')", "get('wake')"));
    const { out, requests } = requestsOf(dir);
    if (requests.some((r) => r.url.includes('/wake'))) throw new Error('a /wake request was sent');
    if (!out.includes('refusing to call /wake')) throw new Error('the allowlist did not refuse /wake');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('Read-only check catches a wake call', () => {
  const dir = scratch();
  try {
    const f = join(dir, 'job/fetch-snapshot.mjs');
    writeFileSync(f, readFileSync(f, 'utf8') + "\nawait fetch(`https://api.tessie.com/${VIN}/wake`, { method: 'POST' });\n");
    let failed = false;
    try { run(['job/check-readonly.mjs'], dir); } catch { failed = true; }
    if (!failed) throw new Error('check-readonly.mjs passed code with a wake call');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('index.html matches the .jsx sources (rebundled)', () => {
  const dir = scratch();
  try {
    execFileSync('python3', ['tools/rebundle.py'], { cwd: dir, stdio: 'ignore' });
    if (readFileSync(join(dir, 'index.html'), 'utf8') !== readFileSync(join(ROOT, 'index.html'), 'utf8')) {
      throw new Error('run: python3 tools/rebundle.py');
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

check('Status label matches the schedule', () => {
  const wf = readFileSync(join(ROOT, '.github/workflows/snapshot.yml'), 'utf8');
  const cron = (wf.match(/cron:\s*"([^"]+)"/) || [])[1];
  const hours = Number((cron || '').split(' ')[1].replace('*/', ''));
  const label = (readFileSync(join(ROOT, 'app.jsx'), 'utf8').match(/Km every (\d+)H/) || [])[1];
  if (!hours || Number(label) !== hours) throw new Error(`cron "${cron}" vs page label "every ${label}H"`);
});

check('Published JSON files parse', () => {
  const files = ['odometer.json', 'history.json', 'route.json', 'basemap.json'];
  for (const d of ['ledger', 'archive']) for (const f of readdirSync(join(ROOT, d))) if (f.endsWith('.json')) files.push(`${d}/${f}`);
  for (const f of files) JSON.parse(readFileSync(join(ROOT, f), 'utf8'));
});

for (const [ok, name, why] of results) console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${why ? `\n      ${why}` : ''}`);
const failed = results.filter(([ok]) => !ok).length;
console.log(failed ? `\n${failed} check(s) failed.` : `\nAll ${results.length} checks passed.`);
process.exit(failed ? 1 : 0);
