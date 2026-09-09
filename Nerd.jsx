const { Eyebrow, Plate, StatReadout, Chip } = window.RoadToAMillionDesignSystem_6606d4;
const { RR, PANEL, INK, INK_2, INK_3, INK_4, BRONZE_D, CYAN_D, CYAN_LINE, HAIR, GRID } = window.RTAM_INK;

/* The nerd section. Everything here is derived from payloads the odometer job
   already fetches, so none of it costs an extra Tessie call — except battery
   health, which is one soft request that fails quietly. */

/* Categorical colour. The brand runs cyan / bronze / bone and nothing else, so
   a province palette has to come from somewhere: the three brand colours plus
   four oklch neighbours at matched lightness and chroma. */
const PROV_COLORS = [CYAN_LINE, '#A47D51', INK, 'oklch(0.74 0.11 175)', 'oklch(0.70 0.10 300)', 'oklch(0.79 0.12 75)', 'oklch(0.69 0.12 20)'];
const provColor = (list, p) => PROV_COLORS[Math.max(0, list.indexOf(p)) % PROV_COLORS.length];

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

/* Every drive as a dot: outside temperature against consumption. This is the
   graph the audience will argue about, so it gets the space and real axes. */
function EfficiencyScatter({ data }) {
  const pts = (data && data.points) || [];
  const provinces = (data && data.provinces) || [];
  const W = 720, H = 340, L = 58, R = 14, T = 16, B = 42;
  if (!pts.length) {
    return (
      <div style={{ background: 'rgba(246,240,227,.06)', border: '1px dashed ' + HAIR, borderRadius: RR, padding: 40, textAlign: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Awaiting drives with temperature data</div>
    );
  }
  const xs = niceScale(Math.min(...pts.map(p => p.t)), Math.max(...pts.map(p => p.t)), 6);
  const ys = niceScale(Math.min(...pts.map(p => p.wh)), Math.max(...pts.map(p => p.wh)), 5);
  const px = (t) => L + ((t - xs.lo) / (xs.hi - xs.lo)) * (W - L - R);
  const py = (w) => H - B - ((w - ys.lo) / (ys.hi - ys.lo)) * (H - T - B);
  return (
    <Plate tone="raised" pad={24} style={{ gap: 16, borderRadius: RR }}>
      <div style={{ border: '1px solid ' + HAIR, borderRadius: RR, overflow: 'hidden' }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: W + ' / ' + H }}>
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
          {pts.map((p, i) => (
            <circle key={i} cx={px(p.t)} cy={py(p.wh)} r={3} fill={provColor(provinces, p.prov)} fillOpacity="0.8">
              <title>{p.prov} · {p.t}°C · {p.wh} Wh/km · {p.km} km</title>
            </circle>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', alignItems: 'center', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: AXIS_TEXT }}>
        {provinces.map((p) => (
          <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 9, height: 9, background: provColor(provinces, p), display: 'inline-block' }}></span>{p}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: INK_4 }}>Outside temperature °C · {pts.length} drives</span>
      </div>
    </Plate>
  );
}

/* Peak power against state of charge, pooled across sessions. A single session
   summary is one reading, so this only becomes a curve over weeks — the sample
   count per bucket is shown rather than implied. */
function ChargeCurve({ data }) {
  const pts = (data && data.points) || [];
  const W = 520, H = 230, L = 46, R = 12, T = 18, B = 40;
  if (pts.length < 2) {
    return (
      <div style={{ background: 'rgba(246,240,227,.06)', border: '1px dashed ' + HAIR, borderRadius: RR, padding: 34, textAlign: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4 }}>Curve fills in as sessions accumulate — {pts.length} of the 2 points needed</div>
    );
  }
  const maxKw = Math.max(...pts.map(p => p.kw));
  const ys = niceScale(0, maxKw, 4);
  const px = (soc) => L + (soc / 100) * (W - L - R);
  const py = (kw) => H - B - ((kw - ys.lo) / (ys.hi - ys.lo)) * (H - T - B);
  const line = pts.map(p => px(p.soc).toFixed(1) + ',' + py(p.kw).toFixed(1)).join(' ');
  return (
    <Plate tone="raised" pad={24} style={{ borderRadius: RR }}>
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
    <Plate tone="raised" pad={22} style={{ gap: 12, alignContent: 'start', borderRadius: RR }}>
      <Eyebrow tone={BRONZE_D} size={10} track={0.22}>{label}</Eyebrow>
      <StatReadout className="rtam-bonestat" value={value} unit={unit || ''} size={34} tone="accent" />
      {sub && <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{sub}</div>}
    </Plate>
  );
}

/* Firmware is the one thing Tessie reports only as "now" — the job records a
   line each time it changes, so this list starts empty and grows. */
function FirmwareLog({ versions }) {
  const list = (versions || []).slice().reverse();
  if (!list.length) {
    return <Plate tone="raised" pad={22} style={{ borderRadius: RR }}><span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_4 }}>Recording from today — no changes seen yet</span></Plate>;
  }
  return (
    <Plate tone="raised" pad={22} style={{ gap: 0, borderRadius: RR }}>
      {list.map((v, i) => (
        <div key={v.version + i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid ' + window.RTAM_INK.HAIR_2 }}>
          <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: i === 0 ? INK : INK_2 }}>{v.version}</span>
          <span style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 }}>{i === 0 ? 'Current · from ' : 'From '}{v.since}</span>
        </div>
      ))}
    </Plate>
  );
}

Object.assign(window, { EfficiencyScatter, ChargeCurve, NerdStat, FirmwareLog });
