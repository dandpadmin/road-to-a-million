const { Eyebrow, Plate, StatReadout, ProgressRule, Badge } = window.RoadToAMillionDesignSystem_6606d4;

/* Every panel is a Plate. No rounding, no shadow, hairlines only. */

function Metric({ label, value, unit, sub, size = 40 }) {
  return (
    <Plate tone="ghost" pad={26} style={{ gap: 14, alignContent: 'start' }}>
      <Eyebrow tone="bronze" size={10} track={0.22}>{label}</Eyebrow>
      <StatReadout value={value} unit={unit} size={size} />
      {sub && <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>{sub}</div>}
    </Plate>
  );
}

/* Sparkline of the last N days' distance. One hairline baseline, cyan bars,
   bronze label on the peak. No axes — the numbers carry the detail. */
function DistanceBars({ days }) {
  const max = Math.max(...days.map(d => d.km));
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 96, borderBottom: '1px solid rgba(246,240,227,.18)' }}>
        {days.map((d, i) => (
          <div key={i} title={d.label + ' · ' + d.km + ' km'} style={{ flex: 1, height: Math.max(3, Math.round((d.km / max) * 96)) + 'px', background: i === days.length - 1 ? '#00B4D9' : 'rgba(246,240,227,.28)' }}></div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.45)' }}>
        <span>{days[0].label}</span><span style={{ color: '#A47D51' }}>peak {max.toLocaleString()} km</span><span>{days[days.length - 1].label}</span>
      </div>
    </div>
  );
}

/* The daily log — what the driver posts at the end of each day. */
function LogRow({ day, date, province, km, note }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 110px', gap: 20, padding: '18px 0', borderBottom: '1px solid rgba(246,240,227,.12)', alignItems: 'baseline' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#00B4D9' }}>{day}</div>
      <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>{date}</div>
      <div style={{ display: 'grid', gap: 5 }}>
        <div style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(246,240,227,.78)' }}>{province}</div>
        {note && <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(246,240,227,.55)' }}>{note}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: '#F6F0E3' }}>{km} <span style={{ color: '#A47D51', fontSize: 11, letterSpacing: '.18em' }}>KM</span></div>
    </div>
  );
}
/* Latest day's route. Placeholder graphic until the Tessie drive path is wired.
   Town-level markers only, held back 24h — never a live position. */
function DayMap({ map }) {
  const W = 720, H = 300;
  const pts = map.path.map(([x, y]) => [x * W, y * H]);
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  return (
    <Plate tone="ghost" pad={26} style={{ gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <Eyebrow tone="bronze" size={11} track={0.24}>Route · {map.label}</Eyebrow>
        <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.45)' }}>Town level · delayed 24h</span>
      </div>
      <div style={{ position: 'relative', border: '1px dashed rgba(246,240,227,.22)' }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 300 }}>
          <defs><pattern id="rtam-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0v48" fill="none" stroke="rgba(246,240,227,.07)" strokeWidth="1" /></pattern></defs>
          <rect width={W} height={H} fill="url(#rtam-grid)" />
          <polyline points={line} fill="none" stroke="#00B4D9" strokeWidth="2.5" />
          {map.stops.map((s, i) => (
            <g key={i}>
              <circle cx={s.x * W} cy={s.y * H} r={s.kind === 'charge' ? 4 : 6} fill={s.kind === 'charge' ? '#1C242C' : '#00B4D9'} stroke="#00B4D9" strokeWidth="2" />
              <text x={s.x * W} y={s.y * H - 16} textAnchor={s.x > 0.85 ? 'end' : s.x < 0.12 ? 'start' : 'middle'} fill="rgba(246,240,227,.7)" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase' }}>{s.town.toUpperCase()}</text>
            </g>
          ))}
        </svg>
        <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(246,240,227,.35)' }}>Placeholder — Tessie drive path goes here</span>
      </div>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>
        <span>{map.corridor}</span>
        <span style={{ color: '#F6F0E3' }}>{map.km.toLocaleString()} km</span>
        <span>{map.stops.filter(s => s.kind === 'charge').length} charge stops</span>
      </div>
    </Plate>
  );
}
/* Two readouts in one Plate — same footprint as Metric, split by a hairline. */
function SplitMetric({ label, a, b, sub }) {
  return (
    <Plate tone="ghost" pad={26} style={{ gap: 14, alignContent: 'start' }}>
      <Eyebrow tone="bronze" size={10} track={0.22}>{label}</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[a, b].map((m, i) => (
          <div key={i} style={{ display: 'grid', gap: 8, alignContent: 'start', paddingLeft: i ? 20 : 0, borderLeft: i ? '1px solid rgba(246,240,227,.18)' : 'none' }}>
            <StatReadout value={m.value} unit={m.unit || ''} size={40} />
            <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>{m.label}</div>
          </div>
        ))}
      </div>
      {sub && <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>{sub}</div>}
    </Plate>
  );
}

Object.assign(window, { Metric, SplitMetric, DistanceBars, LogRow, DayMap });
