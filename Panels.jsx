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
   a 90km morning and a 1,300km haul both fill the box. The scale bar below the
   map is the correction — its width is a real fraction of the frame, taken from
   the kmPerPx the job reports. Nice round distances only; the bar picks the
   largest that fits. */
const SCALE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 150, 200, 250, 500, 750, 1000, 1500];

/* Monospace at 11px with 1.4px tracking. Used to measure a label before it is
   placed — close enough to reserve the right box. */
const CHAR_W = 7.0;

/* Labels are laid out, not just drawn. Each one tries a ring of positions
   around its marker and takes the first that clears the frame, every marker,
   and every label already placed. Anything with nowhere to go is dropped
   rather than stacked — an unreadable pile of names is worse than a missing
   one, and the Daily log carries the full list anyway. Start and end are
   placed first so they are never the ones dropped. */
function layoutLabels(stops, W, H) {
  const rank = { start: 0, end: 1, charge: 2 };
  const ordered = [...stops].map((s, i) => ({ s, i })).sort((a, b) => (rank[a.s.kind] ?? 3) - (rank[b.s.kind] ?? 3) || a.i - b.i);
  /* Markers are obstacles too — a label must not sit on a dot. */
  const taken = stops.map((s) => ({ x1: s.x * W - 11, x2: s.x * W + 11, y1: s.y * H - 11, y2: s.y * H + 11 }));
  const hits = (a, b) => !(a.x2 < b.x1 || b.x2 < a.x1 || a.y2 < b.y1 || b.y2 < a.y1);
  const out = [];
  for (const { s } of ordered) {
    const text = townOnly(s.town).toUpperCase();
    if (!text || text === '—') continue;
    const w = text.length * CHAR_W;
    const cx = s.x * W, cy = s.y * H;
    const cands = [
      { dx: 0, dy: -16, a: 'middle' }, { dx: 0, dy: 24, a: 'middle' },
      { dx: 13, dy: 4, a: 'start' }, { dx: -13, dy: 4, a: 'end' },
      { dx: 13, dy: -13, a: 'start' }, { dx: -13, dy: -13, a: 'end' },
      { dx: 13, dy: 20, a: 'start' }, { dx: -13, dy: 20, a: 'end' },
      { dx: 0, dy: -30, a: 'middle' }, { dx: 0, dy: 38, a: 'middle' },
    ];
    for (const c of cands) {
      const tx = cx + c.dx, ty = cy + c.dy;
      const x1 = c.a === 'middle' ? tx - w / 2 : c.a === 'start' ? tx : tx - w;
      const box = { x1, x2: x1 + w, y1: ty - 10, y2: ty + 4 };
      if (box.x1 < 4 || box.x2 > W - 4 || box.y1 < 2 || box.y2 > H - 4) continue;
      if (taken.some((t) => hits(t, box))) continue;
      taken.push(box);
      out.push({ text, tx, ty, anchor: c.a });
      break;
    }
  }
  return out;
}

function DayMap({ map }) {
  const W = 720, H = 300;
  const pts = (map.path || []).map(([x, y]) => [x * W, y * H]);
  const plotted = pts.length > 1;
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const stops = map.stops || [];
  const labels = layoutLabels(stops, W, H);
  const kmPerPx = map.kmPerPx || 0;
  let barKm = 0;
  if (kmPerPx > 0) { for (const n of SCALE_STEPS) { if (n / kmPerPx <= W * 0.34) barKm = n; } if (!barKm) barKm = SCALE_STEPS[0]; }
  const barPct = barKm ? (barKm / kmPerPx / W) * 100 : 0;
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
          {stops.map((s, i) => (
            <g key={'m' + i}>
              {s.kind === 'end' && <circle cx={s.x * W} cy={s.y * H} r={10} fill="none" stroke="rgba(246,240,227,.55)" strokeWidth="1.5" />}
              <circle cx={s.x * W} cy={s.y * H} r={s.kind === 'charge' ? 4 : 6} fill={s.kind === 'charge' ? '#1C242C' : '#00B4D9'} stroke="#00B4D9" strokeWidth="2" />
            </g>
          ))}
          {/* Stroke-then-fill puts a ground-coloured halo behind the type so a
              label crossing the route stays readable. */}
          {labels.map((l, i) => (
            <text key={'l' + i} x={l.tx} y={l.ty} textAnchor={l.anchor} fill="rgba(246,240,227,.82)" stroke="#1C242C" strokeWidth="4" strokeLinejoin="round" style={{ paintOrder: 'stroke', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1.4px' }}>{l.text}</text>
          ))}
        </svg>
        {!plotted && <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(246,240,227,.35)' }}>Awaiting the first closed day</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>
        {barPct > 0 && (
          <div style={{ flex: '0 0 auto', width: barPct + '%', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: 1, height: 9, background: 'rgba(246,240,227,.45)' }}></span>
            <span style={{ flex: 1, height: 1, background: 'rgba(246,240,227,.45)' }}></span>
            <span style={{ width: 1, height: 9, background: 'rgba(246,240,227,.45)' }}></span>
          </div>
        )}
        {barPct > 0 && <span style={{ whiteSpace: 'nowrap' }}>{barKm.toLocaleString()} km</span>}
        <div style={{ flex: '1 1 auto' }}></div>
        <span style={{ color: '#F6F0E3', whiteSpace: 'nowrap' }}>{map.km.toLocaleString()} km</span>
        <span style={{ whiteSpace: 'nowrap' }}>{(map.chargeStops ?? stops.filter(s => s.kind === 'charge').length).toLocaleString()} charge stops</span>
      </div>
    </Plate>
  );
}
/* The condensed day list that sits beside the map and drives it. Same rows as
   LogRow but stacked two-line so the whole window fits the map's height — the
   selection is useless if you have to scroll away from the map to use it. */
function DayList({ rows, activeKey, onSelect, onLatest, following }) {
  return (
    <div className="rtam-daylist" style={{ border: '1px solid rgba(246,240,227,.18)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', maxHeight: 466 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid rgba(246,240,227,.18)' }}>
        <Eyebrow tone="bronze" size={10} track={0.24}>Daily log</Eyebrow>
        {following
          ? <span style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.4)' }}>Select a day</span>
          : <button onClick={onLatest} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: 0, background: 'transparent', color: '#00B4D9', border: '1px solid rgba(0,180,217,.5)', fontFamily: 'inherit', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase' }}>Latest</button>}
      </div>
      <div className="rtam-daylist-rows" style={{ overflowY: 'auto' }}>
        {rows.map((r, i) => {
          const clickable = !!(r.plotted && onSelect);
          const active = !!(r.key && r.key === activeKey);
          return (
            <div key={r.key || i} className="rtam-daylist-row"
              onClick={clickable ? () => onSelect(r.key) : undefined}
              title={clickable ? 'Show this day on the map' : 'No route yet for this day'}
              style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: '5px 12px', padding: '13px 18px', borderBottom: '1px solid rgba(246,240,227,.10)', cursor: clickable ? 'pointer' : 'default', opacity: clickable ? 1 : 0.55, background: active ? 'rgba(0,180,217,.10)' : 'transparent', boxShadow: active ? 'inset 2px 0 0 #00B4D9' : 'none' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: '#00B4D9' }}>{r.day} · <span style={{ color: 'rgba(246,240,227,.45)' }}>{r.date}</span></div>
              <div style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: '#F6F0E3' }}>{r.km} <span style={{ color: '#A47D51', fontSize: 9, letterSpacing: '.16em' }}>KM</span></div>
              <div style={{ gridColumn: '1 / -1', fontSize: 11, lineHeight: 1.5, letterSpacing: '.1em', textTransform: 'uppercase', color: active ? 'rgba(246,240,227,.85)' : 'rgba(246,240,227,.55)' }}>{routeLabel(r.from, r.to, r.province)}</div>
              {r.note && <div style={{ gridColumn: '1 / -1', fontSize: 11, lineHeight: 1.55, color: 'rgba(246,240,227,.45)' }}>{r.note}</div>}
            </div>
          );
        })}
      </div>
    </div>
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

Object.assign(window, { Metric, SplitMetric, DistanceBars, LogRow, DayList, DayMap, PostGrid });
