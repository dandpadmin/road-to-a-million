const { Eyebrow, Plate, StatReadout, ProgressRule, Badge } = window.RoadToAMillionDesignSystem_6606d4;

/* The data panels sit on a raised grey rather than on the page ground — 6% bone
   over midnight, so stacked panels separate without the page flipping light.
   Figures go cyan, everything smaller stays bone. */
const PANEL = '#252D35';
const INK = '#F6F0E3';
const INK_2 = 'rgba(246,240,227,.78)';
const INK_3 = 'rgba(246,240,227,.58)';
const INK_4 = 'rgba(246,240,227,.42)';
const BRONZE_D = '#A47D51';
const CYAN_D = '#00B4D9';
const CYAN_LINE = '#00B4D9';
const CYAN = '#00B4D9';
const HAIR = 'rgba(246,240,227,.16)';
const HAIR_2 = 'rgba(246,240,227,.10)';
const GRID = 'rgba(246,240,227,.07)';
const SEL = 'rgba(0,180,217,.12)';
/* One radius for every corner on the page — see --rtam-r in index.html. */
const RR = 'var(--rtam-r)';

window.RTAM_INK = { RR, PANEL, INK, INK_2, INK_3, INK_4, BRONZE_D, CYAN_D, CYAN_LINE, CYAN, HAIR, HAIR_2, GRID, SEL };

function Metric({ label, value, unit, sub, size = 40 }) {
  return (
    <Plate tone="raised" pad={26} style={{ gap: 14, alignContent: 'start', borderRadius: RR }}>
      <Eyebrow tone={BRONZE_D} size={10} track={0.22}>{label}</Eyebrow>
      <StatReadout className="rtam-bonestat" value={value} unit={unit} size={size} tone="accent" />
      {sub && <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{sub}</div>}
    </Plate>
  );
}

/* Sparkline of the last N days' distance, on bone. Bars are selectable when the
   day has a route to show. */
function DistanceBars({ days, activeKey, onSelect }) {
  const max = Math.max(...days.map(d => d.km));
  return (
    <Plate tone="raised" pad={24} style={{ gap: 12, borderRadius: RR }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 96, borderBottom: '1px solid ' + HAIR }}>
        {days.map((d, i) => {
          const selectable = !!(onSelect && d.key);
          const active = !!(d.key && d.key === activeKey);
          return (
            <div key={i} title={d.label + ' · ' + d.km + ' km'}
              onClick={selectable ? () => onSelect(d.key) : undefined}
              style={{ flex: 1, height: Math.max(3, Math.round((d.km / max) * 96)) + 'px', cursor: selectable ? 'pointer' : 'default', borderRadius: '3px 3px 0 0', background: active ? CYAN_LINE : i === days.length - 1 ? 'rgba(0,180,217,.5)' : 'rgba(246,240,227,.28)' }}></div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>
        <span>{days[0].label}</span><span style={{ color: BRONZE_D }}>peak {max.toLocaleString()} km</span><span>{days[days.length - 1].label}</span>
      </div>
    </Plate>
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

/* Today is still inside the location embargo, so it has no route and no map.
   Say that in the row rather than printing an em dash — a reader who taps and
   gets nothing assumes the page is broken. */
const SOON = 'Location & map available tomorrow';

/* The full-width daily log row. Rows with a plotted route are selectable and
   drive the map; rows still inside the embargo read the SOON line and stay inert. */
function LogRow({ day, date, province, from, to, km, note, plotted, active, onSelect }) {
  const clickable = !!(plotted && onSelect);
  return (
    <div
      onClick={clickable ? onSelect : undefined}
      title={clickable ? 'Show this day on the map' : undefined}
      style={{ display: 'grid', gridTemplateColumns: '90px 120px 1fr 110px', gap: 20, padding: '18px 14px', margin: '0 -14px', borderBottom: '1px solid ' + HAIR_2, alignItems: 'baseline', cursor: clickable ? 'pointer' : 'default', background: active ? SEL : 'transparent', boxShadow: active ? 'inset 2px 0 0 ' + CYAN_LINE : 'none' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: CYAN_D }}>{day}</div>
      <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: INK_3 }}>{date}</div>
      <div style={{ display: 'grid', gap: 5 }}>
        {plotted
          ? <div style={{ fontSize: 13, letterSpacing: '.14em', textTransform: 'uppercase', color: active ? INK : INK_2 }}>{routeLabel(from, to, province)}</div>
          : <div style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: INK_4 }}>{SOON}</div>}
        {note && <div style={{ fontSize: 13, lineHeight: 1.6, color: INK_3 }}>{note}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: INK }}>{km} <span style={{ color: BRONZE_D, fontSize: 11, letterSpacing: '.18em' }}>KM</span></div>
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

/* Touch browsers fire a synthetic mouseenter/mouseleave pair around a tap, so
   a hover-opened popup closed itself the instant it appeared. Hover is bound
   only on devices that genuinely have one; everywhere else it is tap only. */
const CAN_HOVER = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
  : true;

/* Minutes → "1h 04m" / "42 min". */
function plugged(m) {
  if (typeof m !== 'number' || m < 0) return null;
  if (m < 60) return m + ' min';
  return Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm';
}

/* The charge popup. Hover on a pointer device, tap on touch — one open at a
   time either way. Positioned in percentages over the map box so it tracks the
   svg as the column resizes, and flipped away from whichever edge it is near
   so it never opens off-frame. */
function StopPopup({ stop }) {
  const left = stop.x <= 0.18 ? '0%' : stop.x >= 0.82 ? '100%' : stop.x * 100 + '%';
  const shiftX = stop.x <= 0.18 ? '0' : stop.x >= 0.82 ? '-100%' : '-50%';
  const below = stop.y < 0.38;
  return (
    <div style={{ position: 'absolute', left, top: stop.y * 100 + '%', transform: 'translate(' + shiftX + ',' + (below ? 'calc(0% + 16px)' : 'calc(-100% - 16px)') + ')', zIndex: 3, pointerEvents: 'none', minWidth: 168, maxWidth: 260, padding: '12px 14px', display: 'grid', gap: 9, background: '#1C242C', border: '1px solid ' + HAIR, borderRadius: RR, boxShadow: '0 10px 28px rgba(0,0,0,.45)' }}>
      <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: BRONZE_D, whiteSpace: 'nowrap' }}>{stop.town}</div>
      {stop.sessions.map((c, i) => (
        <div key={i} style={{ display: 'grid', gap: 3, paddingTop: i ? 8 : 0, borderTop: i ? '1px solid ' + HAIR_2 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
            <span style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: INK_2 }}>{c.network}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: CYAN, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{plugged(c.minutes) || '—'}</span>
          </div>
          {c.socStart !== null && c.socEnd !== null && (
            <div style={{ fontSize: 10, letterSpacing: '.14em', color: INK_4, fontVariantNumeric: 'tabular-nums' }}>{c.socStart}% → {c.socEnd}%</div>
          )}
        </div>
      ))}
    </div>
  );
}

function DayMap({ map }) {
  const W = 720, H = 460;
  const pts = (map.path || []).map(([x, y]) => [x * W, y * H]);
  const plotted = pts.length > 1;
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const stops = map.stops || [];
  const labels = layoutLabels(stops, W, H);
  const kmPerPx = map.kmPerPx || 0;
  let barKm = 0;
  if (kmPerPx > 0) { for (const n of SCALE_STEPS) { if (n / kmPerPx <= W * 0.34) barKm = n; } if (!barKm) barKm = SCALE_STEPS[0]; }
  const barPct = barKm ? (barKm / kmPerPx / W) * 100 : 0;
  const [openStop, setOpenStop] = React.useState(null);
  /* The hit circles (and the visible pins themselves) are drawn in viewBox
     units, so on a phone — where the map renders well under its authored
     width — a fixed r read as a ~10px target and taps mostly missed, and the
     dot itself shrank to a couple of visible pixels with nothing to signal
     it was tappable. Measure the rendered box once and derive both from it:
     the hit area never drops below a 44px finger, and the visible marker
     grows to match rather than staying pinned at its desktop size. */
  const boxRef = React.useRef(null);
  const [renderedPx, setRenderedPx] = React.useState(W);
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () => setRenderedPx(el.clientWidth || W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);
  const hitR = Math.max(15, (22 * W) / renderedPx);
  /* Never below the size the map was drawn at; capped so a very narrow
     screen doesn't blow the pins up into blobs. */
  const markScale = Math.min(2.4, Math.max(1, W / renderedPx));
  /* The day can change under the panel — a popup pinned to the old day's
     geometry would hang in the wrong place. */
  React.useEffect(() => { setOpenStop(null); }, [map.key]);
  const charged = stops.filter((s) => (s.sessions || []).length);
  const active = charged.find((s) => s.x + ',' + s.y === openStop) || null;
  /* "Day 7 · Sep 8" → "Day 7 Route · Sep 8". */
  const bits = String(map.label || '').split('·').map((s) => s.trim()).filter(Boolean);
  const title = bits.length > 1 ? bits[0] + ' Route · ' + bits.slice(1).join(' · ') : (bits[0] || 'Route');
  return (
    <Plate tone="raised" pad={13} className="rtam-daymap-plate" style={{ gap: 14, borderRadius: RR }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
        <Eyebrow tone={BRONZE_D} size={13} track={0.2}>{title}</Eyebrow>
      </div>
      <div ref={boxRef} style={{ position: 'relative', border: plotted ? '1px solid ' + HAIR : '1px dashed ' + HAIR, borderRadius: RR, overflow: 'visible' }} onClick={() => setOpenStop(null)}>
        {/* aspect-ratio keeps the box at the viewBox's shape, so the equal-scale
            projection is not stretched by the column width. */}
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: W + ' / ' + H, borderRadius: RR }}>
          <defs><pattern id="rtam-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0v48" fill="none" stroke={GRID} strokeWidth="1" /></pattern></defs>
          <rect width={W} height={H} fill="url(#rtam-grid)" />
          <polyline points={line} fill="none" stroke={CYAN_LINE} strokeWidth="2.5" />
          {stops.map((s, i) => (
            <g key={'m' + i}>
              {s.kind === 'end' && <circle cx={s.x * W} cy={s.y * H} r={10 * markScale} fill="none" stroke="rgba(246,240,227,.5)" strokeWidth={1.5 * Math.sqrt(markScale)} />}
              {(s.sessions || []).length > 0 && s.kind === 'charge' && <circle cx={s.x * W} cy={s.y * H} r={9 * markScale} fill="none" stroke="rgba(0,180,217,.34)" strokeWidth={1.5 * Math.sqrt(markScale)} />}
              <circle cx={s.x * W} cy={s.y * H} r={(s.kind === 'charge' ? 4 : 6) * markScale} fill={s.kind === 'charge' ? PANEL : CYAN_LINE} stroke={CYAN_LINE} strokeWidth={2 * Math.sqrt(markScale)} />
            </g>
          ))}
          {/* Stroke-then-fill puts a ground-coloured halo behind the type so a
              label crossing the route stays readable. */}
          {labels.map((l, i) => (
            <text key={'l' + i} x={l.tx} y={l.ty} textAnchor={l.anchor} fill={INK_2} stroke={PANEL} strokeWidth="4" strokeLinejoin="round" style={{ paintOrder: 'stroke', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1.4px' }}>{l.text}</text>
          ))}
        </svg>
        {charged.length > 0 && (
          <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {charged.map((s) => {
              const id = s.x + ',' + s.y;
              return (
                <circle key={'h' + id} cx={s.x * W} cy={s.y * H} r={hitR} fill="transparent" style={{ cursor: 'pointer' }}
                  onMouseEnter={CAN_HOVER ? () => setOpenStop(id) : undefined}
                  onMouseLeave={CAN_HOVER ? () => setOpenStop((v) => (v === id ? null : v)) : undefined}
                  onClick={(e) => { e.stopPropagation(); setOpenStop((v) => (v === id ? null : id)); }} />
              );
            })}
          </svg>
        )}
        {active && <StopPopup stop={active} />}
        {!plotted && <span style={{ position: 'absolute', left: 12, bottom: 10, fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: INK_4 }}>Awaiting the first closed day</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>
        <div style={{ flex: '1 1 auto', display: 'grid', gap: 8, justifyItems: 'start' }}>
          {barPct > 0 && (
            <div style={{ width: barPct + '%', minWidth: 40, display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 1, height: 9, background: 'rgba(246,240,227,.45)' }}></span>
              <span style={{ flex: 1, height: 1, background: 'rgba(246,240,227,.45)' }}></span>
              <span style={{ width: 1, height: 9, background: 'rgba(246,240,227,.45)' }}></span>
            </div>
          )}
          {barPct > 0 && <span style={{ whiteSpace: 'nowrap' }}>{barKm.toLocaleString()} km</span>}
          {charged.length > 0 && <span style={{ fontSize: 10, letterSpacing: '.18em', color: INK_4, whiteSpace: 'nowrap' }}>Hover / tap pins for charge info</span>}
        </div>
        {/* Right-hand stack: distance, time plugged in, stops — one under the other
            so the two figures share an edge and read as a pair. */}
        <div style={{ flex: '0 0 auto', display: 'grid', gap: 5, justifyItems: 'end', textAlign: 'right' }}>
          <span style={{ color: INK, whiteSpace: 'nowrap' }}>{map.km.toLocaleString()} km</span>
          {map.chargeMinutes > 0 && <span style={{ color: CYAN_D, whiteSpace: 'nowrap' }}>{plugged(map.chargeMinutes)}</span>}
          <span style={{ whiteSpace: 'nowrap' }}>{(map.chargeStops ?? stops.filter(s => s.kind === 'charge').length).toLocaleString()} stops</span>
        </div>
      </div>
    </Plate>
  );
}

/* The condensed day list that sits beside the map and drives it. Two lines per
   row on desktop so the whole window fits the map's height.

   On mobile the same rows become a horizontal strip of narrow day buttons —
   day number set large because that is the only thing you scan by — and the
   selected one widens to half the viewport to show the route. Everything that
   changes shape lives in the rtam-dl-* classes so the media query owns it. */
function DayList({ rows, activeKey, onSelect, onLatest, following }) {
  /* On mobile the rows are a horizontal strip and the selected one widens to
     half the viewport. Selecting a day off-screen looked like nothing happened,
     so the strip brings the open row to its left edge itself. */
  const stripRef = React.useRef(null);
  React.useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const row = strip.querySelector('.rtam-daylist-row.is-open');
    if (!row || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: Math.max(0, row.offsetLeft - strip.offsetLeft - 12), behavior: 'smooth' });
  }, [activeKey]);
  return (
    <div className="rtam-daylist" style={{ background: 'rgba(246,240,227,.06)', border: '1px solid ' + HAIR, display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', maxHeight: 566 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 18px', minHeight: 50, boxSizing: 'border-box', borderBottom: '1px solid ' + HAIR }}>
        <Eyebrow tone={BRONZE_D} size={10} track={0.24}>Daily log</Eyebrow>
        {following
          ? <span style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Select a day</span>
          : <button onClick={onLatest} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: RR, background: 'transparent', color: CYAN_D, border: '1px solid rgba(0,180,217,.5)', fontFamily: 'inherit', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase' }}>Latest</button>}
      </div>
      <div ref={stripRef} className="rtam-daylist-rows" style={{ overflowY: 'auto' }}>
        {rows.map((r, i) => {
          const clickable = !!(r.plotted && onSelect);
          const active = !!(r.key && r.key === activeKey);
          const dayNo = String(r.day || '').replace(/^\s*day\s*/i, '');
          return (
            <div key={r.key || i} className={'rtam-daylist-row' + (active ? ' is-open' : '') + (clickable ? '' : ' is-inert')}
              onClick={clickable ? () => onSelect(r.key) : undefined}
              title={clickable ? 'Show this day on the map' : 'No route yet for this day'}
              style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) auto', gap: '5px 14px', padding: '14px 18px', borderBottom: '1px solid ' + HAIR_2, cursor: clickable ? 'pointer' : 'default', background: active ? SEL : 'transparent', boxShadow: active ? 'inset 2px 0 0 ' + CYAN_LINE : 'none' }}>
              <div className="rtam-dl-head" style={{ gridRow: '1 / -1', display: 'grid', gap: 1, alignContent: 'start' }}>
                <span className="rtam-dl-daypre" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: INK_4 }}>Day</span>
                <span className="rtam-dl-day" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', color: CYAN_D }}>{dayNo}</span>
              </div>
              <div className="rtam-dl-date" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{r.date}</div>
              <div className="rtam-dl-km" style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: INK }}>{r.km} <span style={{ color: BRONZE_D, fontSize: 9, letterSpacing: '.16em' }}>KM</span>
                {r.chargeMinutes > 0 && <div className="rtam-dl-charge" style={{ marginTop: 3, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', color: CYAN_D }}>{plugged(r.chargeMinutes)} <span style={{ color: BRONZE_D, fontSize: 9, letterSpacing: '.16em' }}>CHG</span></div>}
              </div>
              {r.plotted
                ? <div className="rtam-dl-loc" style={{ gridColumn: '2 / -1', fontSize: 11, lineHeight: 1.5, letterSpacing: '.1em', textTransform: 'uppercase', color: active ? INK : INK_2 }}>{routeLabel(r.from, r.to, r.province)}</div>
                : <div className="rtam-dl-soon" style={{ gridColumn: '2 / -1', fontSize: 10, lineHeight: 1.5, letterSpacing: '.1em', textTransform: 'uppercase', color: INK_4 }}>{SOON}</div>}
              {r.note && <div className="rtam-dl-note" style={{ gridColumn: '2 / -1', fontSize: 11, lineHeight: 1.55, color: INK_3 }}>{r.note}</div>}
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
    <Plate tone="raised" pad={26} style={{ gap: 14, alignContent: 'start', borderRadius: RR }}>
      <Eyebrow tone={BRONZE_D} size={10} track={0.22}>{label}</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[a, b].map((m, i) => (
          <div key={i} style={{ display: 'grid', gap: 8, alignContent: 'start', paddingLeft: i ? 20 : 0, borderLeft: i ? '1px solid ' + HAIR : 'none' }}>
            <StatReadout className="rtam-bonestat" value={m.value} unit={m.unit || ''} size={40} tone="accent" />
            <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{m.label}</div>
          </div>
        ))}
      </div>
      {sub && <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{sub}</div>}
    </Plate>
  );
}

Object.assign(window, { Metric, SplitMetric, DistanceBars, LogRow, DayList, DayMap });
