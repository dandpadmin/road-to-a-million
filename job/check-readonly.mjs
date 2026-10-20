/* Read-only check. Runs before every snapshot and fails the run if the job
 * could wake the car or send it a command. Comments are stripped first, so
 * explaining the rule in prose doesn't trip it — only code does.
 *
 * Local run:  node job/check-readonly.mjs
 */
import { readFile, readdir } from 'node:fs/promises';

const files = [
  ...(await readdir('job')).filter((f) => f.endsWith('.mjs') && f !== 'check-readonly.mjs').map((f) => `job/${f}`),
  'tessie.js',
];

const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

const RULES = [
  [/\bwake\b/i, 'a wake call'],
  [/command/i, 'a vehicle command'],
  [/method\s*:\s*['"`](POST|PUT|PATCH|DELETE)/i, 'a non-GET request'],
  [/use_cache\s*=\s*false/i, 'a live (uncached) state read'],
];

const problems = [];
let tessieCalls = 0;
for (const file of files) {
  const code = stripComments(await readFile(file, 'utf8'));
  code.split('\n').forEach((line, i) => {
    for (const [re, what] of RULES) {
      if (re.test(line)) problems.push(`${file}:${i + 1} looks like ${what}: ${line.trim()}`);
    }
    if (line.includes('api.tessie.com')) {
      tessieCalls += 1;
      if (file !== 'job/fetch-snapshot.mjs') problems.push(`${file}:${i + 1} calls Tessie outside the guarded get(): ${line.trim()}`);
    }
  });
}
if (tessieCalls !== 1) problems.push(`expected exactly one Tessie call site (the guarded get()), found ${tessieCalls}`);

if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`);
  console.error('Read-only check failed: the snapshot job must only read stored data. Nothing was sent to Tessie.');
  process.exit(1);
}
console.log(`Read-only check passed (${files.length} files, 1 guarded Tessie call site).`);
