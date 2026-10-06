const { Eyebrow, Plate } = window.RoadToAMillionDesignSystem_6606d4;
const { RR, PANEL, INK_3, INK_4, BRONZE_D, CYAN_LINE, HAIR } = window.RTAM_INK;

/* Lambert conformal conic, standard parallels 40°/62°, centred on 100°W —
   the projection basemap.json was baked in. Output is kilometres, y down.
   Change one, change both. */
const LCC = (() => {
  const R = 6371, D = Math.PI / 180, P1 = 40 * D, P2 = 62 * D, L0 = -100 * D;
  const n = Math.log(Math.cos(P1) / Math.cos(P2)) / Math.log(Math.tan(Math.PI / 4 + P2 / 2) / Math.tan(Math.PI / 4 + P1 / 2));
  const F = Math.cos(P1) * Math.pow(Math.tan(Math.PI / 4 + P1 / 2), n) / n;
  const rho = (lat) => R * F / Math.pow(Math.tan(Math.PI / 4 + lat * D / 2), n);
  const r0 = rho(50);
  return (lat, lng) => { const r = rho(lat), th = n * (lng * D - L0); return [r * Math.sin(th), -(r0 - r * Math.cos(th))]; };
})();

/* The frame follows the route rather than the continent, so the line fills
   the panel on day 30 and the frame widens as Ron heads south. Never tighter
   than MIN_W km across, so an early or local trip still reads as a place. */
const ASPECT = 16 / 10;
const MIN_W = 2600;
function frameFor(pts) {
  if (!pts.length) pts = [LCC(49.18, -97.94)]; // HQ, before there is a line
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  let w = (x1 - x0) * 1.16, h = (y1 - y0) * 1.16;
  w = Math.max(w, h * ASPECT, MIN_W); h = w / ASPECT;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return [cx - w / 2, cy - h / 2, w, h];
}

function RouteMap({ route, base }) {
  const grid = (route && route.grid) || 0.05;
  const lines = React.useMemo(() => ((route && route.lines) || []).map((l) => {
    const pts = [];
    for (let i = 0; i < l.length; i += 2) pts.push(LCC(l[i] * grid, l[i + 1] * grid));
    return pts;
  }), [route, grid]);
  const all = lines.flat();
  const [vx, vy, vw, vh] = frameFor(all);
  const start = lines.length ? lines[0][0] : null;
  const end = route && route.end ? LCC(route.end[0], route.end[1]) : null;

  /* Markers are drawn in km, so size them from the rendered width — the same
     dot reads the same on a phone as on a desktop. */
  const boxRef = React.useRef(null);
  const [px, setPx] = React.useState(1000);
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setPx(el.clientWidth || 1000));
    ro.observe(el);
    setPx(el.clientWidth || 1000);
    return () => ro.disconnect();
  }, []);
  const u = vw / Math.max(320, px); // km per screen pixel

  const hair = { fill: 'none', vectorEffect: 'non-scaling-stroke' };
  const asOf = route && route.asOf
    ? new Date(route.asOf).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'America/Winnipeg' })
    : null;
  const drawn = lines.length > 0;

  return (
    <Plate tone="raised" pad={13} style={{ gap: 14, borderRadius: RR }}>
      <div ref={boxRef} style={{ position: 'relative', border: (drawn ? '1px solid ' : '1px dashed ') + HAIR, borderRadius: RR, overflow: 'hidden', background: PANEL }}>
        <svg viewBox={vx + ' ' + vy + ' ' + vw + ' ' + vh} preserveAspectRatio="xMidYMid slice" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: String(ASPECT) }} role="img" aria-label="Every road the car has driven since day one, delayed 24 hours">
          {base && (
            <g>
              <path d={base.land} fill="rgba(246,240,227,.055)" stroke="rgba(246,240,227,.20)" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
              <path d={base.lakes} fill={PANEL} stroke="rgba(246,240,227,.12)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              <path d={base.subunits} {...hair} stroke="rgba(246,240,227,.11)" strokeWidth="0.75" />
              <path d={base.borders} {...hair} stroke="rgba(164,125,81,.55)" strokeWidth="1" />
            </g>
          )}
          {lines.map((pts, i) => (
            <polyline key={i} points={pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')} {...hair} stroke={CYAN_LINE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {start && <rect x={start[0] - 4 * u} y={start[1] - 4 * u} width={8 * u} height={8 * u} fill={BRONZE_D} />}
          {end && (
            <g>
              <circle cx={end[0]} cy={end[1]} r={11 * u} {...hair} stroke="rgba(246,240,227,.5)" strokeWidth="1.5" />
              <circle cx={end[0]} cy={end[1]} r={5 * u} fill={CYAN_LINE} />
            </g>
          )}
        </svg>
        {!drawn && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Route draws in after the first full day clears</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, background: BRONZE_D, display: 'inline-block' }}></span>Day 1 · Winkler HQ</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, background: CYAN_LINE, display: 'inline-block' }}></span>{asOf ? 'Through ' + asOf : 'Latest cleared point'}</span>
        <span style={{ marginLeft: 'auto', color: INK_4 }}>{(route && route.note) || 'Town level · delayed 24h'}</span>
      </div>
    </Plate>
  );
}

Object.assign(window, { RouteMap });
