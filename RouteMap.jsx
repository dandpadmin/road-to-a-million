const { Plate } = window.RoadToAMillionDesignSystem_6606d4;
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

const CYAN = [0, 180, 217], BONE = [246, 240, 227];
const rgb = (c, a) => 'rgba(' + c.join(',') + ',' + (a == null ? 1 : a) + ')';
const MIN_KM_ACROSS = 15;      // tightest zoom: about 15 km across the map
const TOWN_ZOOM = 2.2;         // town names appear once zoomed in this far past the whole-trip view
const fmtDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }); };
const IN_FRAME = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const FULL_URL = 'https://dandpadmin.github.io/road-to-a-million/#map';

/* Soft light around the cyan line for a road driven n times: several faint,
   pale layers that fade outward, so it reads as a glow rather than a shadow.
   Same numbers draw the map and the legend, so they can't drift apart. */
const GLOW = [214, 244, 250];
function glowLayers(n, w) {
  if (n < 2) return [];
  const k = Math.min(5, n) - 1, spread = 3 + 3.2 * k, a0 = 0.10 + 0.04 * k;
  return [1, 0.8, 0.6, 0.35].map((t) => ({ a: +(a0 * (1 - t * 0.55)).toFixed(3), w: w + spread * t }));
}

/* How "the same road" is decided. Tessie's tracks are simplified, so two drives
   down one highway rarely share points: a straight chord on one day can sit a
   couple of km off the other day's curve. So every track is resampled every
   STEP km and a road counts as driven again where another day's track passes
   within SAME_KM, smoothed over SMOOTH samples either way so short wobbles
   don't break the glow. */
const STEP = 1, SAME_KM = 2.5, SMOOTH = 3, GAP_KM = 60;

/* Turn routemap.json into drawable paths. Every day's track is drawn in cyan;
   the glow is drawn once per road, along the first day that drove it, as wide
   as the number of days that have driven it since. */
function prepare(data) {
  const g = data.grid;
  const days = data.days.map((d, di) => {
    const pts = [];
    for (let i = 0; i + 1 < d.c.length; i += 2) pts.push(LCC(d.c[i] * g, d.c[i + 1] * g));
    return { key: d.k, day: d.d, di, pts };
  });
  /* resample */
  const S = [];   // { x, y, di, brk } in day order; brk = a GPS gap comes just before this sample
  for (const d of days) {
    d.s0 = S.length;
    for (let i = 0; i < d.pts.length; i++) {
      const [x, y] = d.pts[i];
      if (i === 0) { S.push({ x, y, di: d.di, brk: true }); continue; }
      const [px, py] = d.pts[i - 1], len = Math.hypot(x - px, y - py);
      if (len > GAP_KM) { S.push({ x, y, di: d.di, brk: true }); continue; }
      const n = Math.max(1, Math.ceil(len / STEP));
      for (let j = 1; j <= n; j++) S.push({ x: px + (x - px) * j / n, y: py + (y - py) * j / n, di: d.di, brk: false });
    }
    d.s1 = S.length;
  }
  /* spatial hash, cells SAME_KM wide */
  const hash = new Map(), hk = (cx, cy) => cx + ',' + cy;
  S.forEach((p, i) => { const k = hk(Math.floor(p.x / SAME_KM), Math.floor(p.y / SAME_KM)); (hash.get(k) || hash.set(k, []).get(k)).push(i); });
  const daysNear = (x, y) => {
    const out = new Set(), cx = Math.floor(x / SAME_KM), cy = Math.floor(y / SAME_KM);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) {
      for (const j of hash.get(hk(cx + a, cy + b)) || []) {
        const q = S[j];
        if ((q.x - x) ** 2 + (q.y - y) ** 2 <= SAME_KM * SAME_KM) out.add(q.di);
      }
    }
    return out;
  };
  for (const p of S) { const near = daysNear(p.x, p.y); p.n = near.size; p.first = Math.min(...near) === p.di; }
  /* smooth the count along each day's track, within unbroken stretches */
  for (const d of days) {
    for (let i = d.s0; i < d.s1; i++) {
      let m = S[i].n;
      for (let j = i - 1; j >= Math.max(d.s0, i - SMOOTH) && !S[j + 1].brk; j--) m = Math.max(m, S[j].n);
      for (let j = i + 1; j <= Math.min(d.s1 - 1, i + SMOOTH) && !S[j].brk; j++) m = Math.max(m, S[j].n);
      S[i].ns = m;
    }
  }
  /* paths: all tracks in cyan; glow runs grouped by count (5 means 5 or more) */
  const all = new Path2D(), glow = new Map();
  let roadKm = 0, repeatRoadKm = 0;
  const againKm = new Map();
  for (const d of days) {
    let curN = 0, path = null;
    for (let i = d.s0; i < d.s1; i++) {
      const p = S[i];
      if (p.brk) all.moveTo(p.x, p.y); else all.lineTo(p.x, p.y);
      if (p.brk) { curN = 0; continue; }
      const q = S[i - 1], len = Math.hypot(p.x - q.x, p.y - q.y);
      if (!p.first) againKm.set(d.di, (againKm.get(d.di) || 0) + len);
      const n = p.first && p.ns >= 2 ? Math.min(5, p.ns) : 0;
      if (p.first) { roadKm += len; if (p.ns >= 2) repeatRoadKm += len; }
      if (!n) { curN = 0; continue; }
      if (n !== curN) {
        if (!glow.has(n)) glow.set(n, new Path2D());
        path = glow.get(n); path.moveTo(q.x, q.y); curN = n;
      }
      path.lineTo(p.x, p.y);
    }
  }
  /* One label per town, at its latest night; newest wins a crowded spot. */
  const seen = new Map();
  for (const t of data.towns || []) {
    const p = LCC(t.at[0] * g, t.at[1] * g);
    seen.set(t.name, { name: t.name.toUpperCase(), x: p[0], y: p[1], day: t.d });
  }
  const towns = [...seen.values()].sort((a, b) => b.day - a.day);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of S) { if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; }
  return {
    days, S, daysNear, all, glow, towns,
    times: [...glow.keys()].sort((a, b) => a - b),
    bounds: S.length ? [x0, y0, x1, y1] : null,
    start: days.length ? days[0].pts[0] : LCC(49.18, -97.94), // HQ, before there is a line
    end: data.end ? LCC(data.end[0], data.end[1]) : null,
    stats: {
      roadKm,
      repeatPct: roadKm ? Math.round(repeatRoadKm / roadKm * 100) : 0,
      repeatDays: [...againKm.values()].filter((km) => km >= 5).length,   // at least 5 km of a road already driven
      days: days.length,
    },
  };
}

function GlowSwatch({ n }) {
  const w = 2.5, h = 16;
  return (
    <svg width="30" height={h} viewBox={'0 0 30 ' + h} aria-hidden="true" style={{ display: 'block' }}>
      {glowLayers(n, w).map((s, i) => <line key={i} x1="6" y1={h / 2} x2="24" y2={h / 2} stroke={rgb(GLOW, s.a)} strokeWidth={s.w} strokeLinecap="round" />)}
      <line x1="6" y1={h / 2} x2="24" y2={h / 2} stroke={CYAN_LINE} strokeWidth={w} strokeLinecap="round" />
    </svg>
  );
}

function RouteMap({ data, base, head, headRight }) {
  const P = React.useMemo(() => (data && data.days && data.days.length ? prepare(data) : null), [data]);
  const B = React.useMemo(() => (base ? {
    land: new Path2D(base.land), lakes: new Path2D(base.lakes), subunits: new Path2D(base.subunits), borders: new Path2D(base.borders),
  } : null), [base]);

  const boxRef = React.useRef(null), cvRef = React.useRef(null), tipRef = React.useRef(null), hintRef = React.useRef(null);
  const scaleBarRef = React.useRef(null), scaleTxtRef = React.useRef(null);
  const st = React.useRef({ W: 0, H: 0, dpr: 1, view: null, fit: null, tipAt: null, anim: 0 }).current;
  /* Handlers bound once read the latest data from here, not from their first render. */
  st.P = P; st.B = B;
  const [full, setFull] = React.useState(() => !IN_FRAME && typeof location !== 'undefined' && location.hash === '#map');
  const [narrow, setNarrow] = React.useState(false);
  st.full = full;

  const fitFor = (W, H) => {
    const P = st.P;
    if (!P || !P.bounds) { const c = P ? P.start : LCC(49.18, -97.94); const s = W / 2600; return { s, tx: W / 2 - c[0] * s, ty: H / 2 - c[1] * s }; }
    const [x0, y0, x1, y1] = P.bounds;
    const w = Math.max(x1 - x0, 400), h = Math.max(y1 - y0, 250);
    const s = Math.min(W / (w * 1.12), H / (h * 1.12));
    return { s, tx: W / 2 - s * (x0 + x1) / 2, ty: H / 2 - s * (y0 + y1) / 2 };
  };
  const sMin = () => st.fit.s * 0.6;
  const sMax = () => st.W / MIN_KM_ACROSS;

  function draw() {
    const cv = cvRef.current; if (!cv || !st.view) return;
    const P = st.P, B = st.B;
    const ctx = cv.getContext('2d'), { W, H, dpr, view } = st;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = PANEL; ctx.fillRect(0, 0, W, H);
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * view.tx, dpr * view.ty);
    const px = 1 / view.s; // one screen pixel, in km
    if (B) {
      ctx.fillStyle = 'rgba(246,240,227,.055)'; ctx.fill(B.land);
      ctx.strokeStyle = 'rgba(246,240,227,.20)'; ctx.lineWidth = 0.75 * px; ctx.stroke(B.land);
      ctx.fillStyle = PANEL; ctx.fill(B.lakes);
      ctx.strokeStyle = 'rgba(246,240,227,.12)'; ctx.lineWidth = 0.5 * px; ctx.stroke(B.lakes);
      ctx.strokeStyle = 'rgba(246,240,227,.11)'; ctx.lineWidth = 0.75 * px; ctx.stroke(B.subunits);
      ctx.strokeStyle = 'rgba(164,125,81,.55)'; ctx.lineWidth = px; ctx.stroke(B.borders);
    }
    const zoomed = view.s / st.fit.s;
    if (P) {
      const w = Math.min(3.6, 2.2 + Math.log2(Math.max(1, zoomed)) * 0.3);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const n of P.times) for (const g of glowLayers(n, w)) {
        ctx.strokeStyle = rgb(GLOW, g.a); ctx.lineWidth = g.w * px; ctx.stroke(P.glow.get(n));
      }
      ctx.strokeStyle = CYAN_LINE; ctx.lineWidth = w * px; ctx.stroke(P.all);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (P && zoomed >= TOWN_ZOOM) {
      ctx.font = '500 10px "IBM Plex Mono", ui-monospace, Menlo, monospace';
      ctx.textBaseline = 'middle';
      /* The zoom buttons' column is reserved, so no label hides under it. */
      const boxes = [[W - 56, 0, W, 186 + (st.full ? 40 : 0)]];
      for (const t of P.towns) {
        const x = t.x * view.s + view.tx, y = t.y * view.s + view.ty;
        if (x < -40 || y < -20 || x > W + 40 || y > H + 20) continue;
        const tw = ctx.measureText(t.name).width, b = [x - 4, y - 8, x + 13 + tw, y + 8];
        if (boxes.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) continue;
        boxes.push(b);
        ctx.fillStyle = 'rgba(28,36,44,.85)'; ctx.fillRect(x + 6, y - 7, tw + 6, 14);
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fillStyle = 'rgba(246,240,227,.85)'; ctx.fill();
        ctx.fillStyle = 'rgba(246,240,227,.78)'; ctx.fillText(t.name, x + 9, y + 0.5);
      }
    }
    const start = P ? P.start : LCC(49.18, -97.94);
    const sx = start[0] * view.s + view.tx, sy = start[1] * view.s + view.ty;
    ctx.fillStyle = BRONZE_D; ctx.fillRect(sx - 4, sy - 4, 8, 8);
    if (P && P.end) {
      const ex = P.end[0] * view.s + view.tx, ey = P.end[1] * view.s + view.ty;
      ctx.beginPath(); ctx.arc(ex, ey, 11, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(246,240,227,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = CYAN_LINE; ctx.fill();
    }
    const km = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000].reduce((b, v) => (v <= 80 / view.s ? v : b), 1);
    if (scaleBarRef.current) scaleBarRef.current.style.width = Math.round(km * view.s) + 'px';
    if (scaleTxtRef.current) scaleTxtRef.current.textContent = km.toLocaleString('en-CA') + ' km';
    if (st.tipAt) placeTip();
  }

  function resize() {
    const box = boxRef.current, cv = cvRef.current; if (!box || !cv) return;
    const r = box.getBoundingClientRect(), cs = getComputedStyle(box);
    const padT = parseFloat(cs.paddingTop) || 0, padB = parseFloat(cs.paddingBottom) || 0;
    const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height - padT - padB));
    const old = st.W ? { W: st.W, H: st.H, fit: st.fit } : null;
    st.W = W; st.H = H; st.dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.width = Math.round(W * st.dpr); cv.height = Math.round(H * st.dpr); cv.style.height = H + 'px';
    st.fit = fitFor(W, H);
    if (!old || !st.view) st.view = { ...st.fit };
    else { // keep the same centre and relative zoom
      const cx = (old.W / 2 - st.view.tx) / st.view.s, cy = (old.H / 2 - st.view.ty) / st.view.s;
      const s = st.view.s * (st.fit.s / old.fit.s);
      st.view = { s, tx: W / 2 - cx * s, ty: H / 2 - cy * s };
    }
    draw();
  }

  /* New data (a fresh snapshot) refits only if the reader hasn't moved the map. */
  React.useEffect(() => {
    if (!st.W) return;
    const untouched = st.view && st.fit && Math.abs(st.view.s - st.fit.s) < 1e-9 && Math.abs(st.view.tx - st.fit.tx) < 0.5;
    st.fit = fitFor(st.W, st.H);
    if (untouched || !st.view) st.view = { ...st.fit };
    draw();
  }, [P, B]);

  React.useEffect(() => {
    const box = boxRef.current; if (!box) return;
    const ro = new ResizeObserver(() => { setNarrow(box.clientWidth < 600); resize(); });
    ro.observe(box); resize();
    return () => ro.disconnect();
  }, []);
  React.useEffect(() => { resize(); }, [full, narrow]);

  /* ---- interaction ---- */
  const zoomAt = (f, x, y) => {
    const s = Math.min(sMax(), Math.max(sMin(), st.view.s * f)), k = s / st.view.s;
    st.view = { s, tx: x - (x - st.view.tx) * k, ty: y - (y - st.view.ty) * k }; draw();
  };
  const animateTo = (target) => {
    cancelAnimationFrame(st.anim);
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { st.view = target; draw(); return; }
    const from = { ...st.view }, t0 = performance.now(), { W, H } = st;
    const cF = [(W / 2 - from.tx) / from.s, (H / 2 - from.ty) / from.s], cT = [(W / 2 - target.tx) / target.s, (H / 2 - target.ty) / target.s];
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 260), e = 1 - Math.pow(1 - p, 3);
      const s = Math.exp(Math.log(from.s) + (Math.log(target.s) - Math.log(from.s)) * e);
      const cx = cF[0] + (cT[0] - cF[0]) * e, cy = cF[1] + (cT[1] - cF[1]) * e;
      st.view = { s, tx: W / 2 - cx * s, ty: H / 2 - cy * s }; draw();
      if (p < 1) st.anim = requestAnimationFrame(step);
    };
    st.anim = requestAnimationFrame(step);
  };
  const zoomCentre = (f) => {
    const s = Math.min(sMax(), Math.max(sMin(), st.view.s * f)), k = s / st.view.s, { W, H } = st;
    animateTo({ s, tx: W / 2 - (W / 2 - st.view.tx) * k, ty: H / 2 - (H / 2 - st.view.ty) * k });
  };
  const flashHint = (text) => {
    const h = hintRef.current; if (!h) return;
    h.textContent = text; h.style.opacity = '1';
    clearTimeout(st.hintT); st.hintT = setTimeout(() => { h.style.opacity = '0'; }, 1100);
  };
  const hideTip = () => { st.tipAt = null; if (tipRef.current) tipRef.current.hidden = true; };
  function placeTip() {
    const t = tipRef.current; if (!t || !st.tipAt) return;
    const x = st.tipAt[0] * st.view.s + st.view.tx, y = st.tipAt[1] * st.view.s + st.view.ty;
    const padT = parseFloat(getComputedStyle(boxRef.current).paddingTop) || 0, half = (t.offsetWidth || 180) / 2 + 6;
    t.style.left = Math.min(st.W - half, Math.max(half, x)) + 'px'; t.style.top = (y + padT) + 'px';
  }
  const showTip = (px, py) => {
    const P = st.P;
    if (!P) return;
    let best = null, bd = 16 * 16;
    for (const p of P.S) {
      const x = p.x * st.view.s + st.view.tx, y = p.y * st.view.s + st.view.ty;
      if (x < -20 || y < -20 || x > st.W + 20 || y > st.H + 20) continue;
      const dd = (x - px) ** 2 + (y - py) ** 2;
      if (dd < bd) { bd = dd; best = { x, y, p }; }
    }
    const t = tipRef.current; if (!t) return;
    if (!best) { hideTip(); return; }
    const list = [...P.daysNear(best.p.x, best.p.y)].sort((a, c) => a - c).map((i) => P.days[i]);
    const first = list[0], last = list[list.length - 1];
    const EM = '<em style="color:#00B4D9;font-style:normal">';
    t.innerHTML = list.length === 1
      ? '<b style="color:#F6F0E3">Driven once</b> · Day ' + first.day + ', ' + fmtDay(first.key)
      : '<b style="color:#F6F0E3">Driven ' + list.length + ' times</b><br>First ' + EM + 'Day ' + first.day + '</em> ' + fmtDay(first.key) + ' · latest ' + EM + 'Day ' + last.day + '</em> ' + fmtDay(last.key);
    st.tipAt = [(best.x - st.view.tx) / st.view.s, (best.y - st.view.ty) / st.view.s];
    t.hidden = false; placeTip();
  };

  React.useEffect(() => {
    const cv = cvRef.current; if (!cv) return;
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const pos = (x, y) => { const r = cv.getBoundingClientRect(); return [x - r.left, y - r.top]; };
    const onWheel = (e) => {
      if (!full && !(e.ctrlKey || e.metaKey)) { flashHint('Use ' + (isMac ? '⌘' : 'Ctrl') + ' + scroll to zoom the map'); return; }
      e.preventDefault(); const [x, y] = pos(e.clientX, e.clientY); zoomAt(Math.exp(-e.deltaY * 0.0022), x, y);
    };
    let drag = null;
    const onDown = (e) => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, y: e.clientY, v: { ...st.view }, moved: false }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; };
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      st.view = { ...drag.v, tx: drag.v.tx + dx, ty: drag.v.ty + dy }; draw();
    };
    const onUp = (e) => {
      if (e.pointerType !== 'mouse' || !drag) return;
      cv.style.cursor = 'grab';
      if (!drag.moved) showTip(...pos(e.clientX, e.clientY));
      drag = null;
    };
    const onDbl = (e) => {
      const [x, y] = pos(e.clientX, e.clientY), s = Math.min(sMax(), st.view.s * 2), k = s / st.view.s;
      animateTo({ s, tx: x - (x - st.view.tx) * k, ty: y - (y - st.view.ty) * k });
    };
    /* Touch: two fingers move and pinch; one finger keeps scrolling the page,
       except in the full-screen map, where one finger pans. */
    let touch = null;
    const tp = (e) => [...e.touches].map((t) => pos(t.clientX, t.clientY));
    const onTS = (e) => { touch = { p: tp(e), v: { ...st.view }, moved: false }; };
    const onTM = (e) => {
      if (!touch) return;
      const p = tp(e);
      if (p.length >= 2) {
        e.preventDefault();
        if (touch.p.length < 2) touch = { p, v: { ...st.view }, moved: true };
        const [a0, b0] = touch.p, [a1, b1] = p;
        const d0 = Math.hypot(b0[0] - a0[0], b0[1] - a0[1]) || 1, d1 = Math.hypot(b1[0] - a1[0], b1[1] - a1[1]);
        const m0 = [(a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2], m1 = [(a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2];
        const s = Math.min(sMax(), Math.max(sMin(), touch.v.s * d1 / d0)), k = s / touch.v.s;
        st.view = { s, tx: m1[0] - (m0[0] - touch.v.tx) * k, ty: m1[1] - (m0[1] - touch.v.ty) * k };
        touch.moved = true; draw();
      } else if (p.length === 1) {
        const dx = p[0][0] - touch.p[0][0], dy = p[0][1] - touch.p[0][1];
        if (Math.abs(dx) + Math.abs(dy) > 6) touch.moved = true;
        if (full) { e.preventDefault(); st.view = { ...touch.v, tx: touch.v.tx + dx, ty: touch.v.ty + dy }; draw(); }
        else if (touch.moved && Math.abs(dx) > Math.abs(dy)) flashHint('Use two fingers to move the map');
      }
    };
    const onTE = (e) => {
      if (touch && !touch.moved && touch.p.length === 1 && e.touches.length === 0) showTip(...touch.p[0]);
      touch = e.touches.length ? { p: tp(e), v: { ...st.view }, moved: true } : null;
    };
    cv.addEventListener('wheel', onWheel, { passive: false });
    cv.addEventListener('pointerdown', onDown); cv.addEventListener('pointermove', onMove); cv.addEventListener('pointerup', onUp);
    cv.addEventListener('dblclick', onDbl);
    cv.addEventListener('touchstart', onTS, { passive: true }); cv.addEventListener('touchmove', onTM, { passive: false }); cv.addEventListener('touchend', onTE);
    const onKey = (e) => { if (e.key === 'Escape' && full) setFull(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      cv.removeEventListener('wheel', onWheel);
      cv.removeEventListener('pointerdown', onDown); cv.removeEventListener('pointermove', onMove); cv.removeEventListener('pointerup', onUp);
      cv.removeEventListener('dblclick', onDbl);
      cv.removeEventListener('touchstart', onTS); cv.removeEventListener('touchmove', onTM); cv.removeEventListener('touchend', onTE);
      document.removeEventListener('keydown', onKey);
    };
  }, [P, B, full]);

  React.useEffect(() => { document.body.style.overflow = full ? 'hidden' : ''; }, [full]);

  /* Inside the Shopify frame a "full screen" would only fill the frame, so the
     expand button opens the map on its own page instead. */
  const expand = () => {
    if (full) { setFull(false); if (location.hash === '#map') history.replaceState(null, '', location.pathname + location.search); return; }
    if (IN_FRAME) { window.open(FULL_URL, '_blank', 'noopener'); return; }
    setFull(true);
  };

  const asOf = data && data.asOf
    ? new Date(data.asOf).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'America/Winnipeg' })
    : null;
  const drawn = !!P;
  const btn = { width: 34, height: 34, borderRadius: 4, border: '1px solid ' + HAIR, background: 'rgba(28,36,44,.88)', color: '#F6F0E3', font: '600 17px/1 var(--font-mono, "IBM Plex Mono", monospace)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 0 };
  const icon = { width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6 };
  const mono = { fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: INK_3 };
  const S = P && P.stats;

  const mapBox = (
    <div ref={boxRef} style={full
      ? { position: 'fixed', inset: 0, zIndex: 60, background: PANEL, paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }
      : { position: 'relative', border: (drawn ? '1px solid ' : '1px dashed ') + HAIR, borderRadius: RR, overflow: 'hidden', background: PANEL, aspectRatio: narrow ? '1 / 1' : '16 / 10', maxWidth: '100%' }}>
      <canvas ref={cvRef} role="img" aria-label="Every road the car has driven since day one, delayed 24 hours. Roads driven more than once have a glow; tap a road to see how often."
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'grab', touchAction: full ? 'none' : 'pan-x pan-y' }} />
      <div style={{ position: 'absolute', top: full ? 'calc(10px + env(safe-area-inset-top, 0px))' : 10, right: full ? 'calc(10px + env(safe-area-inset-right, 0px))' : 10, display: 'grid', gap: 6 }}>
        <button type="button" style={btn} aria-label="Zoom in" onClick={() => zoomCentre(2)}>+</button>
        <button type="button" style={btn} aria-label="Zoom out" onClick={() => zoomCentre(0.5)}>&minus;</button>
        <button type="button" style={btn} aria-label="Show the whole route" onClick={() => { hideTip(); animateTo({ ...st.fit }); }}>
          <svg viewBox="0 0 16 16" style={icon}><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" /></svg>
        </button>
        <button type="button" style={btn} aria-label={full ? 'Close the full-screen map' : 'Open the map full screen'} onClick={expand}>
          {full
            ? <svg viewBox="0 0 16 16" style={icon}><path d="M3 3l10 10M13 3 3 13" /></svg>
            : <svg viewBox="0 0 16 16" style={icon}><path d="M9 2h5v5M7 14H2V9M14 2 9.5 6.5M2 14l4.5-4.5" /></svg>}
        </button>
      </div>
      <div style={{ position: 'absolute', left: full ? 'calc(12px + env(safe-area-inset-left, 0px))' : 12, bottom: full ? 'calc(10px + env(safe-area-inset-bottom, 0px))' : 10, display: 'grid', gap: 4, pointerEvents: 'none', ...mono, letterSpacing: '.12em' }}>
        <span ref={scaleTxtRef}>500 km</span>
        <i ref={scaleBarRef} style={{ display: 'block', height: 4, width: 80, border: '1px solid ' + INK_3, borderTop: 0 }}></i>
      </div>
      <div ref={hintRef} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', background: 'rgba(28,36,44,.62)', color: '#F6F0E3', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', textAlign: 'center', padding: 20, opacity: 0, transition: 'opacity .2s' }}></div>
      <div ref={tipRef} hidden style={{ position: 'absolute', pointerEvents: 'none', background: 'rgba(28,36,44,.95)', border: '1px solid ' + HAIR, borderRadius: 4, padding: '7px 10px', fontSize: 11, lineHeight: 1.45, letterSpacing: '.05em', color: 'rgba(246,240,227,.78)', whiteSpace: 'nowrap', transform: 'translate(-50%, calc(-100% - 12px))' }}></div>
      {!drawn && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: INK_4, pointerEvents: 'none' }}>Route draws in after the first full day clears</div>
      )}
    </div>
  );

  return (
    <Plate tone="raised" pad={13} style={{ gap: 14, borderRadius: RR }}>
      {head && window.BandHead && <window.BandHead pad={13} inset={22} right={headRight} rule={false}>{head}</window.BandHead>}
      {mapBox}
      {full && <div style={{ aspectRatio: narrow ? '1 / 1' : '16 / 10' }}></div>}
      <div style={{ display: 'flex', gap: '10px 18px', flexWrap: 'wrap', alignItems: 'center', ...mono }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {[1, 2, 3, 5].map((n) => (
            <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><GlowSwatch n={n} />{n === 5 ? '5×+' : n + '×'}</span>
          ))}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, background: BRONZE_D, display: 'inline-block' }}></span>Day 1 · Winkler HQ</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: CYAN_LINE, display: 'inline-block' }}></span>{asOf ? 'Through ' + asOf : 'Latest cleared point'}</span>
        <span style={{ marginLeft: 'auto', color: INK_4 }}>{(data && data.note) || 'Town level · delayed 24h'}</span>
      </div>
      {S && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
          {[
            [Math.round(S.roadKm).toLocaleString('en-CA') + ' km', 'of road tracked since Day 1'],
            [S.repeatPct + '%', 'of that road was driven more than once'],
            [S.repeatDays + ' of ' + S.days, 'days drove a road for the second time or more'],
          ].map(([b, s]) => (
            <div key={s} style={{ borderTop: '1px solid ' + HAIR, paddingTop: 10, display: 'grid', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono, "IBM Plex Mono", monospace)', fontWeight: 600, fontSize: 20, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums', color: '#F6F0E3' }}>{b}</span>
              <span style={{ fontSize: 12, color: INK_3 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
    </Plate>
  );
}

Object.assign(window, { RouteMap });
