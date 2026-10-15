const { Eyebrow, Plate, StatReadout, Chip } = window.RoadToAMillionDesignSystem_6606d4;
const { RR, PANEL, INK, INK_2, INK_3, INK_4, BRONZE_D, CYAN_D, CYAN_LINE, HAIR, GRID } = window.RTAM_INK;

/* The nerd section. Everything here is derived from payloads the odometer job
   already fetches, so none of it costs an extra Tessie call — except battery
   health, which is one soft request that fails quietly. */

const AXIS = 'rgba(246,240,227,.28)';
const AXIS_TEXT = INK_3;

/* Round a range outward to sensible tick values so the axis reads in whole
   numbers rather than whatever the extremes happen to be. */
function niceScale(min, max, steps) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return { lo: 0, hi: 1, ticks: [0, 1] };
  const raw = (max - min) / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || mag * 10;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(6)));
  return { lo, hi, ticks };
}

/* Every drive as a dot: outside temperature against consumption.
   Coloured by country (Canada Cyan, US Bronze) — a colour per province ran out
   of distinct colours long before the trip will run out of provinces. A place
   in the legend previews on hover and locks on click (tap on phones): its dots
   come forward, everything else dims. Hovering (or tapping) a dot shows its
   day, town and figures. The Bone line is the typical (median) Wh/km in each
   2°C band. */
const CTRY = { CA: { color: CYAN_LINE, label: 'Canada' }, US: { color: BRONZE_D, label: 'United States' } };
const HEAD = '"Montserrat", "Arial", sans-serif';
function EfficiencyScatter({ data, head, headRight }) {
  const Band = window.BandHead;
  const pts = (data && data.points) || [];
  const trend = (data && data.trend) || [];
  /* The chart draws at its real pixel width so type and dots keep their size;
     on a phone it goes nearly square instead of shrinking to a strip. */
  const [bw, setBw] = React.useState(720);
  const narrow = bw < 560;
  const W = Math.max(280, Math.round(bw)), H = narrow ? Math.round(W * 0.9) : Math.round(W * 0.47), L = narrow ? 44 : 58, R = 14, T = 16, B = 42;
  const [hoverPlace, setHoverPlace] = React.useState(null);
  const [lockPlace, setLockPlace] = React.useState(null);
  const [tip, setTip] = React.useState(null); // index into pts
  const boxRef = React.useRef(null);
  const canHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches;
  const active = hoverPlace || lockPlace;
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setBw(el.clientWidth || 720));
    ro.observe(el); setBw(el.clientWidth || 720);
    return () => ro.disconnect();
  }, [pts.length > 0]);
  if (!pts.length) {
    return (
      <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
        {head && <Band pad={24} right={headRight} rule={false}>{head}</Band>}
        <div style={{ padding: 40, textAlign: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Awaiting drives with temperature data</div>
      </Plate>
    );
  }
  const xs = niceScale(Math.min(...pts.map(p => p.t)), Math.max(...pts.map(p => p.t)), 6);
  const ys = niceScale(Math.min(...pts.map(p => p.wh)), Math.max(...pts.map(p => p.wh)), 5);
  const px = (t) => L + ((t - xs.lo) / (xs.hi - xs.lo)) * (W - L - R);
  const py = (w) => H - B - ((w - ys.lo) / (ys.hi - ys.lo)) * (H - T - B);
  const colorOf = (p) => (CTRY[p.ctry] || CTRY.CA).color;
  /* Nearest dot to the pointer, within ~14 screen px; with a place selected,
     only its dots answer. */
  const pick = (e) => {
    const el = boxRef.current; if (!el) return null;
    const r = el.getBoundingClientRect(); const k = W / r.width;
    const x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
    let best = null, bd = (14 * k) ** 2;
    pts.forEach((p, i) => {
      if (active && p.prov !== active) return;
      const d = (px(p.t) - x) ** 2 + (py(p.wh) - y) ** 2;
      if (d < bd) { bd = d; best = i; }
    });
    return best;
  };
  /* Legend: grouped by country, in order of first appearance. */
  const groups = ['CA', 'US'].map((c) => ({ c, places: [...new Set(pts.filter((p) => p.ctry === c).map((p) => p.prov))] })).filter((g) => g.places.length);
  const order = pts.map((p, i) => i).sort((a, b) => (active ? (pts[a].prov === active) - (pts[b].prov === active) : 0));
  const tp = tip !== null ? pts[tip] : null;
  const chip = (place, c) => {
    const on = active === place, locked = lockPlace === place, dim = active && !on;
    return (
      <button key={place}
        onMouseEnter={canHover ? () => setHoverPlace(place) : undefined}
        onMouseLeave={canHover ? () => setHoverPlace(null) : undefined}
        onClick={() => { setLockPlace(locked ? null : place); setTip(null); }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: narrow ? 6 : 7, padding: narrow ? '5px 8px' : '6px 10px', cursor: 'pointer', borderRadius: RR, background: locked ? 'rgba(246,240,227,.08)' : 'transparent', border: '1px solid ' + (on ? CTRY[c].color : 'rgba(246,240,227,.14)'), color: dim ? INK_4 : INK_2, fontFamily: 'var(--font-mono)', fontSize: narrow ? 10 : 11, letterSpacing: narrow ? '.08em' : '.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>
        <span style={{ width: 8, height: 8, background: CTRY[c].color, opacity: dim ? 0.35 : 1, display: 'inline-block' }}></span>{place}
      </button>
    );
  };
  return (
    <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
      {head && <Band pad={24} right={headRight} rule={false}>{head}</Band>}
      <div ref={boxRef} style={{ position: 'relative', border: '1px solid ' + HAIR, borderRadius: RR }}
        onMouseMove={canHover ? (e) => setTip(pick(e)) : undefined}
        onMouseLeave={canHover ? () => setTip(null) : undefined}
        onClick={!canHover ? (e) => setTip(pick(e)) : undefined}>
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: W + ' / ' + H, borderRadius: RR }}>
          {ys.ticks.map((v, i) => (
            <g key={'y' + i}>
              <line x1={L} y1={py(v)} x2={W - R} y2={py(v)} stroke={GRID} strokeWidth="1" />
              <text x={L - 10} y={py(v) + 4} textAnchor="end" fill={AXIS_TEXT} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px' }}>{v}</text>
            </g>
          ))}
          {xs.ticks.map((v, i) => (
            <text key={'x' + i} x={px(v)} y={H - B + 20} textAnchor="middle" fill={AXIS_TEXT} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px' }}>{v}°</text>
          ))}
          <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke={AXIS} strokeWidth="1" />
          <line x1={L} y1={T} x2={L} y2={H - B} stroke={AXIS} strokeWidth="1" />
          {/* Freezing is the line that matters in this dataset. */}
          {xs.lo < 0 && xs.hi > 0 && <line x1={px(0)} y1={T} x2={px(0)} y2={H - B} stroke="rgba(246,240,227,.22)" strokeDasharray="3 4" strokeWidth="1" />}
          {order.map((i) => {
            const p = pts[i], on = active && p.prov === active;
            return <circle key={i} cx={px(p.t)} cy={py(p.wh)} r={on ? 3.8 : 3} fill={colorOf(p)} fillOpacity={active ? (on ? 0.95 : 0.1) : 0.7} />;
          })}
          {trend.length > 1 && <polyline points={trend.map((q) => px(q.t).toFixed(1) + ',' + py(q.wh).toFixed(1)).join(' ')} fill="none" stroke={INK} strokeOpacity={active ? 0.45 : 0.9} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
          {tp && <circle cx={px(tp.t)} cy={py(tp.wh)} r={7} fill="none" stroke={INK} strokeWidth="1.5" />}
        </svg>
        {tp && (() => {
          const x = (px(tp.t) / W) * 100, y = (py(tp.wh) / H) * 100;
          const left = x < 25 ? '0' : x > 75 ? '-100%' : '-50%';
          const below = y < 40;
          return (
            <div style={{ position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(' + left + ',' + (below ? '14px' : 'calc(-100% - 14px)') + ')', pointerEvents: 'none', zIndex: 3, minWidth: narrow ? 0 : 200, maxWidth: narrow ? 230 : 280, padding: '12px 14px', display: 'grid', gap: 6, background: '#1C242C', border: '1px solid rgba(246,240,227,.18)', borderRadius: RR, boxShadow: '0 10px 28px rgba(0,0,0,.45)' }}>
              {tp.day && <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: BRONZE_D }}>Day {tp.day} · {tp.date}</span>}
              <span style={{ fontFamily: HEAD, fontWeight: 600, letterSpacing: '-.03em', fontSize: 15, lineHeight: 1.25, color: INK }}>{tp.town ? tp.town + ', ' : ''}{tp.prov}</span>
              <span style={{ fontSize: 12, letterSpacing: '.06em', color: INK_2, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{Math.round(tp.t)}°C · <span style={{ color: colorOf(tp) }}>{tp.wh} Wh/km</span> · {tp.km} km</span>
            </div>
          );
        })()}
      </div>
      <div style={{ display: 'grid', gap: narrow ? 14 : 12 }}>
        {narrow ? (
          /* On a phone the place list becomes one dropdown, grouped by country —
             the chip list would run to dozens of rows once the US fills in. */
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>Highlight a place</span>
            <select value={lockPlace || ''} onChange={(e) => { setLockPlace(e.target.value || null); setTip(null); }}
              style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', padding: '12px 40px 12px 14px', borderRadius: RR, border: '1px solid ' + (lockPlace ? (CTRY[(pts.find((p) => p.prov === lockPlace) || {}).ctry] || CTRY.CA).color : 'rgba(246,240,227,.22)'), background: '#1C242C url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 fill=%27none%27 stroke=%27%23A47D51%27 stroke-width=%271.5%27/%3E%3C/svg%3E") no-repeat right 14px center', color: INK, fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase' }}>
              <option value="">All places</option>
              {groups.map((g) => (
                <optgroup key={g.c} label={CTRY[g.c].label}>
                  {g.places.map((pl) => <option key={pl} value={pl}>{pl} ({pts.filter((p) => p.prov === pl).length})</option>)}
                </optgroup>
              ))}
            </select>
            <span style={{ display: 'flex', gap: 16, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>
              {groups.map((g) => <span key={g.c} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, background: CTRY[g.c].color, display: 'inline-block' }}></span>{CTRY[g.c].label}</span>)}
            </span>
          </label>
        ) : groups.map((g) => (
          <div key={g.c} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: HEAD, fontWeight: 600, letterSpacing: '-.03em', fontSize: 13, color: CTRY[g.c].color, minWidth: 116 }}>{CTRY[g.c].label}</span>
            {g.places.map((pl) => chip(pl, g.c))}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>
          {trend.length > 1 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 22, height: 2.5, background: INK, display: 'inline-block' }}></span>Typical Wh/km at that temperature</span>}
          <span>{narrow ? 'Pick a place to compare · tap a dot for details' : canHover ? 'Hover a place to compare · click to lock' : 'Tap a place to compare · tap a dot for details'}</span>
          <span style={{ marginLeft: 'auto', color: INK_4 }}>Outside temperature °C · {pts.length} drives of {(data && data.minKm) || 20} km+</span>
        </div>
      </div>
    </Plate>
  );
}

/* Charge times. One dot per session along a log time axis, in three lanes:
   Supercharger, other quick charges, and overnight. The solid Bone mark is the
   typical (median) session, the dashed one the average; shortest and longest
   are named underneath. Hover (tap on phones) a dot for its day, town and
   figures. */
const LANE_COLOR = { sc: CYAN_LINE, other: BRONZE_D, night: 'rgba(246,240,227,.75)' };
function fmtMin(m) {
  if (m === null || m === undefined) return '—';
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60), r = m % 60;
  return h + 'h' + (r ? ' ' + r + 'm' : '');
}
function ChargeTimes({ data, head, headRight }) {
  const Band = window.BandHead;
  const lanes = ((data && data.lanes) || []).filter((l) => l.n > 0);
  const boxRef = React.useRef(null);
  const [bw, setBw] = React.useState(720);
  const [tip, setTip] = React.useState(null); // [lane index, point index]
  const canHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover)').matches;
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setBw(el.clientWidth || 720));
    ro.observe(el); setBw(el.clientWidth || 720);
    return () => ro.disconnect();
  }, [lanes.length > 0]);
  if (!lanes.length) {
    return (
      <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
        {head && <Band pad={24} right={headRight} rule={false}>{head}</Band>}
        <div style={{ padding: 40, textAlign: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Awaiting charge sessions</div>
      </Plate>
    );
  }
  const narrow = bw < 560;
  const W = Math.max(280, Math.round(bw)), L = 14, R = 14, LANE = narrow ? 64 : 58, GAP = 34, T = 22, B = 30;
  const H = T + lanes.length * LANE + (lanes.length - 1) * GAP + B;
  const all = lanes.flatMap((l) => l.points.map((p) => p.min));
  const lo = 1, hi = Math.max(60, ...all);
  const TICKS = [1, 5, 15, 30, 60, 120, 240, 480, 960, 1440, 2160].filter((t) => t <= hi * 1.05);
  const lmax = Math.log(TICKS[TICKS.length - 1] < hi ? hi : TICKS[TICKS.length - 1]);
  const px = (m) => L + (Math.log(Math.max(lo, m)) / lmax) * (W - L - R);
  const laneTop = (i) => T + i * (LANE + GAP);
  /* Fixed vertical jitter per session, so dots don't sit on one line and
     don't jump around between renders. */
  const jit = (p, j) => { const h = Math.sin((p.day || 0) * 12.9898 + p.min * 78.233 + j * 3.1) * 43758.5453; return h - Math.floor(h); };
  const py = (i, p, j) => laneTop(i) + 8 + jit(p, j) * (LANE - 16);
  const tickLabel = (t) => (t < 60 ? t + 'm' : t / 60 + 'h');
  const pick = (e) => {
    const el = boxRef.current; if (!el) return null;
    const r = el.getBoundingClientRect(); const k = W / r.width;
    const x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
    let best = null, bd = (14 * k) ** 2;
    lanes.forEach((l, i) => l.points.forEach((p, j) => {
      const d = (px(p.min) - x) ** 2 + (py(i, p, j) - y) ** 2;
      if (d < bd) { bd = d; best = [i, j]; }
    }));
    return best;
  };
  const tp = tip ? lanes[tip[0]].points[tip[1]] : null;
  const place = (p) => (p ? [p.town, p.prov].filter(Boolean).join(', ') : '');
  return (
    <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
      {head && <Band pad={24} right={headRight} rule={false}>{head}</Band>}
      <div ref={boxRef} style={{ position: 'relative', border: '1px solid ' + HAIR, borderRadius: RR }}
        onMouseMove={canHover ? (e) => setTip(pick(e)) : undefined}
        onMouseLeave={canHover ? () => setTip(null) : undefined}
        onClick={!canHover ? (e) => setTip(pick(e)) : undefined}>
        <svg viewBox={'0 0 ' + W + ' ' + H} style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: W + ' / ' + H }}>
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={px(t)} y1={T - 6} x2={px(t)} y2={H - B} stroke={GRID} strokeWidth="1" />
              <text x={px(t)} y={H - B + 18} textAnchor="middle" fill={AXIS_TEXT} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px' }}>{tickLabel(t)}</text>
            </g>
          ))}
          {lanes.map((l, i) => {
            const top = laneTop(i), c = LANE_COLOR[l.key] || INK;
            return (
              <g key={l.key}>
                <text x={L} y={top - 8} fill={c} style={{ fontFamily: HEAD, fontWeight: 600, letterSpacing: '-.03em', fontSize: 12 }}>{l.label}</text>
                <line x1={L} y1={top + LANE} x2={W - R} y2={top + LANE} stroke={AXIS} strokeWidth="1" />
                {l.points.map((p, j) => (
                  <circle key={j} cx={px(p.min)} cy={py(i, p, j)} r={3} fill={c} fillOpacity={tp ? (tp === p ? 1 : 0.35) : 0.7} />
                ))}
                {l.mean !== null && <line x1={px(l.mean)} y1={top - 2} x2={px(l.mean)} y2={top + LANE} stroke={INK} strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 3" />}
                {l.median !== null && <line x1={px(l.median)} y1={top - 2} x2={px(l.median)} y2={top + LANE} stroke={INK} strokeWidth="2.5" />}
              </g>
            );
          })}
          {tp && <circle cx={px(tp.min)} cy={py(tip[0], tp, tip[1])} r={7} fill="none" stroke={INK} strokeWidth="1.5" />}
        </svg>
        {tp && (() => {
          const x = (px(tp.min) / W) * 100, y = (py(tip[0], tp, tip[1]) / H) * 100;
          const left = x < 25 ? '0' : x > 75 ? '-100%' : '-50%';
          const below = y < 45;
          return (
            <div style={{ position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(' + left + ',' + (below ? '14px' : 'calc(-100% - 14px)') + ')', pointerEvents: 'none', zIndex: 3, minWidth: narrow ? 0 : 200, maxWidth: narrow ? 240 : 290, padding: '12px 14px', display: 'grid', gap: 6, background: '#1C242C', border: '1px solid rgba(246,240,227,.18)', borderRadius: RR, boxShadow: '0 10px 28px rgba(0,0,0,.45)' }}>
              {tp.day && <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: BRONZE_D }}>Day {tp.day} · {tp.date}</span>}
              {place(tp) && <span style={{ fontFamily: HEAD, fontWeight: 600, letterSpacing: '-.03em', fontSize: 15, lineHeight: 1.25, color: INK }}>{place(tp)}</span>}
              <span style={{ fontSize: 12, letterSpacing: '.06em', color: INK_2, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                <span style={{ color: LANE_COLOR[lanes[tip[0]].key] }}>{fmtMin(tp.min)}</span>
                {tp.kwh !== null ? ' · +' + tp.kwh + ' kWh' : ''}
                {tp.soc0 !== null && tp.soc1 !== null ? ' · ' + tp.soc0 + '→' + tp.soc1 + '%' : ''}
              </span>
            </div>
          );
        })()}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(' + lanes.length + ', minmax(0,1fr))', gap: narrow ? 16 : 20 }}>
        {lanes.map((l) => (
          <div key={l.key} style={{ display: 'grid', gap: 6, alignContent: 'start', paddingTop: 10, borderTop: '1px solid ' + HAIR }}>
            <span style={{ fontFamily: HEAD, fontWeight: 600, letterSpacing: '-.03em', fontSize: 13, color: LANE_COLOR[l.key] || INK }}>{l.label}</span>
            <span style={{ fontSize: 12, letterSpacing: '.06em', color: INK, fontVariantNumeric: 'tabular-nums' }}>Typical {fmtMin(l.median)} <span style={{ color: INK_3 }}>· average {fmtMin(l.mean)}</span></span>
            <span style={{ fontSize: 11, letterSpacing: '.06em', lineHeight: 1.5, color: INK_2 }}>Shortest {fmtMin(l.shortest && l.shortest.min)}{place(l.shortest) ? ' · ' + place(l.shortest) : ''}</span>
            <span style={{ fontSize: 11, letterSpacing: '.06em', lineHeight: 1.5, color: INK_2 }}>Longest {fmtMin(l.longest && l.longest.min)}{place(l.longest) ? ' · ' + place(l.longest) : ''}</span>
            <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_4 }}>{l.n} session{l.n === 1 ? '' : 's'}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 2.5, height: 14, background: INK, display: 'inline-block' }}></span>Typical</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 0, height: 14, borderLeft: '1.5px dashed rgba(246,240,227,.7)', display: 'inline-block' }}></span>Average</span>
        <span>{canHover ? 'Hover a dot for details' : 'Tap a dot for details'}</span>
        <span style={{ marginLeft: 'auto', color: INK_4 }}>Session length · log scale · overnight = {fmtMin((data && data.nightMin) || 240)}+ off-network</span>
      </div>
    </Plate>
  );
}

/* Peak power against state of charge, pooled across sessions. A single session
   summary is one reading, so this only becomes a curve over weeks — the sample
   count per bucket is shown rather than implied. */
function ChargeCurve({ data, head }) {
  const Band = window.BandHead;
  const pts = (data && data.points) || [];
  const W = 520, H = 230, L = 46, R = 12, T = 18, B = 40;
  if (pts.length < 2) {
    return (
      <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
        {head && <Band pad={24} rule={false}>{head}</Band>}
        <div style={{ padding: 34, textAlign: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Curve fills in as sessions accumulate — {pts.length} of the 2 points needed</div>
      </Plate>
    );
  }
  const maxKw = Math.max(...pts.map(p => p.kw));
  const ys = niceScale(0, maxKw, 4);
  const px = (soc) => L + (soc / 100) * (W - L - R);
  const py = (kw) => H - B - ((kw - ys.lo) / (ys.hi - ys.lo)) * (H - T - B);
  const line = pts.map(p => px(p.soc).toFixed(1) + ',' + py(p.kw).toFixed(1)).join(' ');
  return (
    <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
      {head && <Band pad={24} rule={false}>{head}</Band>}
      <div style={{ border: '1px solid ' + HAIR, borderRadius: RR, overflow: 'hidden' }}>
      <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: W + ' / ' + H }}>
        {ys.ticks.map((v, i) => (
          <g key={i}>
            <line x1={L} y1={py(v)} x2={W - R} y2={py(v)} stroke={GRID} strokeWidth="1" />
            <text x={L - 10} y={py(v) + 4} textAnchor="end" fill={AXIS_TEXT} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px' }}>{v}</text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map((v) => (
          <text key={v} x={px(v)} y={H - B + 20} textAnchor="middle" fill={AXIS_TEXT} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '1px' }}>{v}%</text>
        ))}
        <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke={AXIS} strokeWidth="1" />
        <polyline points={line} fill="none" stroke={CYAN_LINE} strokeWidth="2.5" />
        {pts.map((p, i) => (
          <circle key={i} cx={px(p.soc)} cy={py(p.kw)} r={4} fill={PANEL} stroke={CYAN_LINE} strokeWidth="2">
            <title>{p.soc}% · {p.kw} kW · {p.n} session{p.n === 1 ? '' : 's'}</title>
          </circle>
        ))}
      </svg>
      </div>
    </Plate>
  );
}

function NerdStat({ label, value, unit, sub }) {
  return (
    <Plate tone="raised" pad={22} style={{ gap: 16, alignContent: 'start', borderRadius: RR }}>
      <window.BandHead pad={22} size={16}>{label}</window.BandHead>
      {/* Stacked in the desktop row of four; side by side on phones, where the
          box runs full width (.rtam-metricgrid in the mobile rules). */}
      <div className="rtam-metric-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', columnGap: 18, rowGap: 16 }}>
        <StatReadout className="rtam-bonestat" value={value} unit={unit || ''} size={34} tone="accent" style={{ flex: '0 0 auto' }} />
        {sub && <div style={{ fontSize: 12, lineHeight: 1.55, letterSpacing: '.12em', textTransform: 'uppercase', color: INK_2 }}>{sub}</div>}
      </div>
    </Plate>
  );
}

/* Firmware is the one thing Tessie reports only as "now" — the job records a
   line each time it changes, so this list starts empty and grows. */
function FirmwareLog({ versions, head }) {
  const Band = window.BandHead;
  const list = (versions || []).slice().reverse();
  if (!list.length) {
    return <Plate tone="raised" pad={22} style={{ gap: 16, borderRadius: RR }}>{head && <Band pad={22}>{head}</Band>}<span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_4 }}>Recording from today — no changes seen yet</span></Plate>;
  }
  return (
    <Plate tone="raised" pad={22} style={{ gap: 0, alignContent: 'start', borderRadius: RR }}>
      {head && <div style={{ marginBottom: 8 }}><Band pad={22}>{head}</Band></div>}
      {list.map((v, i) => (
        <div key={v.version + i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid ' + window.RTAM_INK.HAIR_2 }}>
          <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: i === 0 ? INK : INK_2 }}>{v.version}</span>
          <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{i === 0 ? 'Current · from ' : 'From '}{v.since}</span>
        </div>
      ))}
    </Plate>
  );
}

Object.assign(window, { EfficiencyScatter, ChargeTimes, ChargeCurve, NerdStat, FirmwareLog });
