/* Illustrative figures. The real feed is the driver's daily data screenshots. */
window.RTAM_DATA = {
  odometer: 418203,
  goal: 1000000,
  day: 412,
  province: 'Nevada',
  route: 'US-50 East · Fallon to Ely',
  today: 742,
  best: 1104,
  avgPerDay: 1015,
  chargeSessions: 3,
  chargeSupercharger: 2,
  chargeOther: 1,
  chargeLifetime: 1148,
  chargeLifetimeSupercharger: 902,
  chargeLifetimeOther: 246,
  batteryHealth: 91,
  dayMap: {
    label: 'Latest day · Day 412',
    corridor: 'US-50 East · Nevada',
    km: 742,
    /* Town-level only, held back 24h. Normalised 0–1 points, west to east. */
    path: [[0.06,0.62],[0.15,0.58],[0.27,0.55],[0.38,0.6],[0.5,0.52],[0.62,0.5],[0.72,0.44],[0.83,0.42],[0.94,0.36]],
    stops: [
      { x: 0.06, y: 0.62, town: 'Fallon', kind: 'start' },
      { x: 0.38, y: 0.6, town: 'Austin', kind: 'charge' },
      { x: 0.72, y: 0.44, town: 'Eureka', kind: 'charge' },
      { x: 0.94, y: 0.36, town: 'Ely', kind: 'end' },
    ],
  },
  days: [
    { label: 'D 405', km: 880 }, { label: 'D 406', km: 1104 }, { label: 'D 407', km: 640 },
    { label: 'D 408', km: 0 }, { label: 'D 409', km: 955 }, { label: 'D 410', km: 1082 },
    { label: 'D 411', km: 806 }, { label: 'D 412', km: 742 },
  ],
  log: [
    { day: 'Day 412', date: '18 Oct', province: 'Nevada', km: '742', note: 'US-50 East. Third charge stop at Austin took 41 minutes — the only one on the route.' },
    { day: 'Day 411', date: '17 Oct', province: 'Nevada', km: '806', note: 'Crossed from California at Stateline.' },
    { day: 'Day 410', date: '16 Oct', province: 'California', km: '1,082', note: '' },
    { day: 'Day 409', date: '15 Oct', province: 'California', km: '955', note: 'Front tyres swapped at 415,000 km. Fourth set.' },
    { day: 'Day 408', date: '14 Oct', province: 'Oregon', km: '0', note: 'Off the road — rear motor inspection.' },
  ],
};
