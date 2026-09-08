/* Illustrative figures — the shape the job writes, so the page renders complete
   before the live feed arrives. Real data replaces this at runtime. */
const RTAM_DAY_MAPS = [
  {
    key: '2026-10-16', day: 410, label: 'Day 410 · 16 Oct', km: 1082,
    from: 'Redding, California', to: 'Susanville, California', corridor: 'Susanville, California',
    chargeStops: 2, note: 'Town level · delayed 24h', kmPerPx: 1.24,
    path: [[0.1,0.44],[0.3,0.4],[0.52,0.47],[0.74,0.52],[0.9,0.58]],
    stops: [
      { x: 0.1, y: 0.44, town: 'Redding', kind: 'start' },
      { x: 0.52, y: 0.47, town: 'Red Bluff', kind: 'charge' },
      { x: 0.9, y: 0.58, town: 'Susanville', kind: 'end' },
    ],
  },
  {
    key: '2026-10-17', day: 411, label: 'Day 411 · 17 Oct', km: 806,
    from: 'Susanville, California', to: 'Fallon, Nevada', corridor: 'Fallon, Nevada',
    chargeStops: 1, note: 'Town level · delayed 24h', kmPerPx: 0.96,
    path: [[0.14,0.3],[0.36,0.4],[0.58,0.52],[0.82,0.66]],
    stops: [
      { x: 0.14, y: 0.3, town: 'Susanville', kind: 'start' },
      { x: 0.58, y: 0.52, town: 'Reno', kind: 'charge' },
      { x: 0.82, y: 0.66, town: 'Fallon', kind: 'end' },
    ],
  },
  {
    key: '2026-10-18', day: 412, label: 'Day 412 · 18 Oct', km: 742,
    from: 'Fallon, Nevada', to: 'Ely, Nevada', corridor: 'Ely, Nevada',
    chargeStops: 2, note: 'Town level · delayed 24h', kmPerPx: 0.79,
    path: [[0.06,0.62],[0.15,0.58],[0.27,0.55],[0.38,0.6],[0.5,0.52],[0.62,0.5],[0.72,0.44],[0.83,0.42],[0.94,0.36]],
    stops: [
      { x: 0.06, y: 0.62, town: 'Fallon', kind: 'start' },
      { x: 0.38, y: 0.6, town: 'Austin', kind: 'charge' },
      { x: 0.72, y: 0.44, town: 'Eureka', kind: 'charge' },
      { x: 0.94, y: 0.36, town: 'Ely', kind: 'end' },
    ],
  },
];
RTAM_DAY_MAPS.forEach((m) => { m.plotted = true; });

/* Illustrative nerd figures. Deterministic so the preview does not reshuffle
   on every reload — consumption rises as temperature falls, which is the shape
   the real data should show. */
const RTAM_PROVS = ['British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba', 'Yukon'];
const RTAM_POINTS = (() => {
  const out = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  for (let i = 0; i < 190; i += 1) {
    const t = Number((-24 + rnd() * 52).toFixed(1));
    const wh = Math.round(152 + (18 - t) * 1.9 + (rnd() - 0.5) * 34);
    out.push({ t, wh, km: Math.round(40 + rnd() * 420), prov: RTAM_PROVS[Math.floor(rnd() * RTAM_PROVS.length)] });
  }
  return out;
})();
const RTAM_WH = RTAM_POINTS.map((p) => p.wh).sort((a, b) => a - b);

window.RTAM_DATA = {
  odometer: 418203,
  goal: 1000000,
  day: 412,
  province: 'Nevada',
  route: 'Ely, Nevada',
  today: 742,
  best: 1104,
  avgPerDay: 1015,
  chargeSessions: 3,
  chargeSupercharger: 2,
  chargeOther: 1,
  chargeLifetime: 1148,
  chargeLifetimeSupercharger: 902,
  chargeLifetimeOther: 246,
  locationEmbargoHours: 24,
  nerd: {
    efficiency: {
      points: RTAM_POINTS,
      median: RTAM_WH[Math.floor(RTAM_WH.length / 2)],
      best: RTAM_WH[0],
      worst: RTAM_WH[RTAM_WH.length - 1],
      provinces: RTAM_PROVS,
    },
    autopilot: { km: 289640, pct: 69.3 },
    energy: { used: 62451, added: 70118, overhead: 10.9, whPerKm: 149 },
    cost: { total: 8214.55, supercharger: 6402.1, other: 1812.45, perKm: 0.02, sessions: 1102, currency: 'CAD' },
    chargeCurve: {
      points: [
        { soc: 10, kw: 244, n: 31 }, { soc: 20, kw: 238, n: 74 }, { soc: 30, kw: 205, n: 96 },
        { soc: 40, kw: 171, n: 88 }, { soc: 50, kw: 140, n: 71 }, { soc: 60, kw: 112, n: 63 },
        { soc: 70, kw: 86, n: 52 }, { soc: 80, kw: 61, n: 44 }, { soc: 90, kw: 38, n: 19 },
      ],
      sessions: 1148,
      note: 'Peak power per session, pooled by state of charge',
    },
    battery: { healthPct: 91.4, rangeNow: 458, rangeOriginal: 501 },
    firmware: [
      { version: '2026.20.5', since: '2026-06-14' },
      { version: '2026.26.2', since: '2026-07-29' },
      { version: '2026.32.1', since: '2026-09-03' },
    ],
  },
  dayMaps: RTAM_DAY_MAPS,
  dayMap: RTAM_DAY_MAPS[RTAM_DAY_MAPS.length - 1],
  days: [
    { key: '2026-10-11', label: 'D 405', km: 880 }, { key: '2026-10-12', label: 'D 406', km: 1104 },
    { key: '2026-10-13', label: 'D 407', km: 640 }, { key: '2026-10-14', label: 'D 408', km: 0 },
    { key: '2026-10-15', label: 'D 409', km: 955 }, { key: '2026-10-16', label: 'D 410', km: 1082 },
    { key: '2026-10-17', label: 'D 411', km: 806 }, { key: '2026-10-18', label: 'D 412', km: 742 },
  ],
  log: [
    { key: '2026-10-18', day: 'Day 412', date: '18 Oct', province: 'Nevada', from: 'Fallon, Nevada', to: 'Ely, Nevada', plotted: true, km: '742', note: 'US-50 East. Third charge stop at Austin took 41 minutes — the only one on the route.' },
    { key: '2026-10-17', day: 'Day 411', date: '17 Oct', province: 'Nevada', from: 'Susanville, California', to: 'Fallon, Nevada', plotted: true, km: '806', note: 'Crossed from California at Stateline.' },
    { key: '2026-10-16', day: 'Day 410', date: '16 Oct', province: 'California', from: 'Redding, California', to: 'Susanville, California', plotted: true, km: '1,082', note: '' },
    { key: '2026-10-15', day: 'Day 409', date: '15 Oct', province: 'California', from: 'Eureka, California', to: 'Redding, California', km: '955', note: 'Front tyres swapped at 415,000 km. Fourth set.' },
    { key: '2026-10-14', day: 'Day 408', date: '14 Oct', province: 'Oregon', from: 'Coos Bay, Oregon', to: 'Coos Bay, Oregon', km: '0', note: 'Off the road — rear motor inspection.' },
  ],
};
