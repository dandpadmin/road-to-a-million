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
   bronze label on the peak. No axes — the numbers carry the detail.
   Bars are selectable when the day has a route to show. */
function DistanceBars({ days, activeKey, onSelect }) {
  const max = Math.max(...days.map(d => d.km));
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 96, borderBottom: '1px solid rgba(246,240,227,.18)' }}>
        {days.map((d, i) => {
          const selectable = !!(onSelect && d.key);
          const active = !!(d.key && d.key === activeKey);
          return (
            <div key={i} title={d.label + ' · ' + d.km + ' km'}
              onClick={selectable ? () => onSelect(d.key) : undefined}
              style={{ flex: 1, height: Math.max(3, Math.round((d.km / max) * 96)) + 'px', cursor: selectable ? 'pointer' : 'default', background: active ? '#00B4D9' : i === days.length - 1 ? 'rgba(0,180,217,.5)' : 'rgba(246,240,227,.28)' }}></div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.45)' }}>
        <span>{days[0].label}</span><span style={{ color: '#A47D51' }}>peak {max.toLocaleString()} km</span><span>{days[days.length - 1].label}</span>
      </div>
    </div>
  );
}

/* "Whitehorse, Yukon" → "Whitehorse". The province is repeated on both ends of
   a day far more often than not, so it is hoisted out rather than printed twice. */
const townOnly = (s) => String(s || '—').split(',')[0].trim();
const provinceOf = (s) => { const p = String(s || '').split(','); return p.length > 1 ? p[p.length - 1].trim() : ''; };

function routeLabel(from, to, fallback) {
  if (!from || !to || from === '—' || to === '—') return fallback || '—';
  const pf = provinceOf(from), pt = provinceOf(to);
  if (pf && pf === pt) return townOnly(from) + ' → ' + townOnly(to) + ' · ' + pt;
  return from + ' → ' + to;
}

/* The daily log — one row per day, town to town. Rows with a plotted route are
   selectable and drive the map above; rows still inside the location embargo
   read "—" and stay inert. */
function LogRow({ day, date, province, from, to, km, note, plotted, active, onSelect }) {
  const clickable = !!(plotted && onSelect);
  return (
    <div
      onClick={clickable ? onSelect : undefined}
      title={clickable ? 'Show this day on the map' : undefined}
      style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 110px', gap: 20, padding: '18px 14px', margin: '0 -14px', borderBottom: '1px solid rgba(246,240,227,.12)', alignItems: 'baseline', cursor: clickable ? 'pointer' : 'default', background: active ? 'rgba(0,180,217,.10)' : 'transparent', boxShadow: active ? 'inset 2px 0 0 #00B4D9' : 'none' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#00B4D9' }}>{day}</div>
      <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>{date}</div>
      <div style={{ display: 'grid', gap: 5 }}>
        <div style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: active ? '#F6F0E3' : 'rgba(246,240,227,.78)' }}>{routeLabel(from, to, province)}</div>
        {note && <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(246,240,227,.55)' }}>{note}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: '#F6F0E3' }}>{km} <span style={{ color: '#A47D51', fontSize: 11, letterSpacing: '.18em' }}>KM</span></div>
    </div>
  );
}

/* A day's route, town level and at least 24h old — never a live position.

   Each day is framed to fill the panel, so the scale changes from day to day:
   a 90km morning and a 1,300km haul both fill the box. The scale bar is the
   correction — it is drawn in the same coordinate space as the route, from the
   kmPerPx the job reports, so it stretches with the map and stays honest.
   Nice round distances only; the bar picks the largest that fits. */
const SCALE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 150, 200, 250, 500, 750, 1000, 1500];

function DayMap({ map }) {
  const W = 720, H = 300;
  const pts = (map.path || []).map(([x, y]) => [x * W, y * H]);
  const plotted = pts.length > 1;
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const kmPerPx = map.kmPerPx || 0;
  let barKm = 0;
  if (kmPerPx > 0) { for (const n of SCALE_STEPS) { if (n / kmPerPx <= 200) barKm = n; } if (!barKm) barKm = SCALE_STEPS[0]; }
  const barPx = barKm ? barKm / kmPerPx : 0;
  const barY = H - 26;
  return (
    <Plate tone="ghost" pad={26} style={{ gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <Eyebrow tone="bronze" size={11} track={0.24}>Route · {map.label}</Eyebrow>
        <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.45)' }}>{map.note || 'Town level · delayed 24h'}</span>
      </div>
      <div style={{ position: 'relative', border: plotted ? '1px solid rgba(246,240,227,.18)' : '1px dashed rgba(246,240,227,.22)' }}>
        {/* aspect-ratio keeps the box at the viewBox's shape, so the equal-scale
            projection is not stretched by the column width. */}
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: W + ' / ' + H }}>
          <defs><pattern id="rtam-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0v48" fill="none" stroke="rgba(246,240,227,.07)" strokeWidth="1" /></pattern></defs>
          <rect width={W} height={H} fill="url(#rtam-grid)" />
          <polyline points={line} fill="none" stroke="#00B4D9" strokeWidth="2.5" />
          {(map.stops || []).map((s, i) => (
            <g key={i}>
              <circle cx={s.x * W} cy={s.y * H} r={s.kind === 'charge' ? 4 : 6} fill={s.kind === 'charge' ? '#1C242C' : '#00B4D9'} stroke="#00B4D9" strokeWidth="2" />
              <text x={s.x * W} y={s.y * H - 16} textAnchor={s.x > 0.85 ? 'end' : s.x < 0.12 ? 'start' : 'middle'} fill="rgba(246,240,227,.7)" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase' }}>{s.town.toUpperCase()}</text>
            </g>
          ))}
          {barPx > 0 && (
            <g>
              <line x1={18} y1={barY} x2={18 + barPx} y2={barY} stroke="rgba(246,240,227,.55)" strokeWidth="1.5" />
              <line x1={18} y1={barY - 5} x2={18} y2={barY + 5} stroke="rgba(246,240,227,.55)" strokeWidth="1.5" />
              <line x1={18 + barPx} y1={barY - 5} x2={18 + barPx} y2={barY + 5} stroke="rgba(246,240,227,.55)" strokeWidth="1.5" />
              <text x={18} y={barY - 11} fill="rgba(246,240,227,.55)" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1.6px' }}>{barKm.toLocaleString()} KM</text>
            </g>
          )}
        </svg>
        {!plotted && <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(246,240,227,.35)' }}>Awaiting the first closed day</span>}
      </div>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>
        <span>{routeLabel(map.from, map.to, map.corridor)}</span>
        <span style={{ color: '#F6F0E3' }}>{map.km.toLocaleString()} km</span>
        <span>{(map.chargeStops ?? (map.stops || []).filter(s => s.kind === 'charge').length).toLocaleString()} charge stops</span>
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

/* Ron's Instagram posts. Reads the shape the fetch-instagram job writes:
   { id, permalink, thumb, caption, timestamp, type }. Renders as flat square
   tiles — hairline borders, no rounding, caption on hover only, so the grid
   reads as a contact sheet rather than a social widget. */
function PostGrid({ posts, count = 6 }) {
  const slots = Array.from({ length: count }, (_, i) => (posts || [])[i] || null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 16 }}>
      {slots.map((p, i) => (
        <a key={p ? p.id : 'empty' + i} href={p ? p.permalink : undefined} target="_blank" rel="noreferrer"
          style={{ position: 'relative', display: 'block', aspectRatio: '1 / 1', overflow: 'hidden', border: '1px solid rgba(246,240,227,.18)', background: 'rgba(246,240,227,.03)', cursor: p ? 'pointer' : 'default', textDecoration: 'none' }}>
          {p && p.thumb
            ? <img src={p.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(.92)' }} />
            : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.28)', textAlign: 'center', padding: 16 }}>Awaiting post</div>}
          {p && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6, padding: 14, background: 'linear-gradient(to top, rgba(28,36,44,.94) 0%, rgba(28,36,44,.55) 45%, rgba(28,36,44,0) 100%)' }}>
              <span style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: '#00B4D9' }}>{p.dateLabel || ''}</span>
              <span style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(246,240,227,.82)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.caption || ''}</span>
            </div>
          )}
        </a>
      ))}
    </div>
  );
}

Object.assign(window, { Metric, SplitMetric, DistanceBars, LogRow, DayMap, PostGrid });
