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
