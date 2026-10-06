const { Badge, Wordmark, Eyebrow, Plate, StatReadout, ProgressRule, Chip } = window.RoadToAMillionDesignSystem_6606d4;
const { DayMap, DayList, EfficiencyScatter, ChargeCurve, NerdStat, FirmwareLog, RouteMap } = window;
/* Charging spend is real money and the call on publishing it is still open.
   Flip to true when it is decided — nothing else needs to change. */
const SHOW_COST = false;
const { useState, useEffect } = React;
const FALLBACK = window.RTAM_DATA;
const A = '../../assets/';
/* Published bundles swap these for blob URLs; unbundled the relative path stands. */
const asset = (id, file) => (window.__resources && window.__resources[id]) || (A + file);

/* Where the live snapshot comes from. First hit wins: a file sitting next to
   this page when deployed, otherwise the copy the GitHub Action commits. The
   raw URL only resolves while the repo is public. */
const RAW = 'https://raw.githubusercontent.com/dandpadmin/road-to-a-million/main/';
const FEEDS = ['./odometer.json', RAW + 'odometer.json'];
/* The all-time route and the outline it is drawn on. The basemap never
   changes, so it is fetched once; the route refreshes with the feed. */
const ROUTE_FEEDS = ['./route.json', RAW + 'route.json'];
const BASE_FEEDS = ['./basemap.json', RAW + 'basemap.json'];

async function firstJson(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (r.ok) return await r.json();
    } catch (e) { /* try the next source */ }
  }
  return null;
}

function App() {
  /* Starts on the static figures in data.js so the page never renders empty,
     then swaps to the real snapshot the moment it arrives. */
  const [D, setD] = useState(FALLBACK);
  const [route, setRoute] = useState(null);
  const [base, setBase] = useState(null);
  useEffect(() => {
    let live = true;
    firstJson(BASE_FEEDS).then((b) => { if (live && b) setBase(b); });
    const tick = () => {
      firstJson(FEEDS).then((d) => { if (live && d) setD(d); });
      firstJson(ROUTE_FEEDS).then((r) => { if (live && r) setRoute(r); });
    };
    tick();
    const id = setInterval(tick, 15 * 60 * 1000);
    return () => { live = false; clearInterval(id); };
  }, []);

  const [range, setRange] = useState('8 days');
  /* Which day the map is showing. null = follow the feed's newest plotted day,
     so the page keeps advancing on its own until the reader picks a row. */
  const [selected, setSelected] = useState(null);
  const maps = D.dayMaps || [];
  const shownMap = (selected && maps.find(m => m.key === selected)) || D.dayMap;
  const shownKey = shownMap ? shownMap.key : null;
  const barDays = range === '8 days' ? (D.days || []).slice(-8) : (D.days || []);
  const N = D.nerd || null;
  const pct = (D.odometer / D.goal) * 100;
  const stamp = D.updatedAt ? new Date(D.updatedAt).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Winnipeg' }) : null;
  const remaining = D.goal - D.odometer;
  const daysLeft = D.avgPerDay > 0 ? Math.round(remaining / D.avgPerDay) : null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="rtam-topbar" style={{ position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 40px', minHeight: 56, background: 'rgba(28,36,44,.86)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(246,240,227,.14)' }}>
        <span className="rtam-topbar-status" style={{ fontSize: 10, textAlign: 'center', letterSpacing: '.2em', textTransform: 'uppercase', color: D.liveKm ? '#E8B33A' : '#00B4D9' }}>● {D.liveKm ? 'Live km · map delayed ' + (D.locationEmbargoHours ?? 24) + 'H' : 'Delayed ' + (D.embargoHours ?? 24) + 'H'} · through Day {D.day}{stamp ? ' · updated ' + stamp : ''}</span>
      </div>

      <div className="rtam-page" style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 40px 90px', display: 'grid', gap: 48 }}>

        {/* The hero sits on the photograph rather than beside it. Midnight is laid
           over the top, heaviest where the type is and thinning toward the ground
           so the car reads at the bottom edge. */}
        <div className="rtam-hero-band">
          <img src={asset('heroPhoto', 'hero-road.jpg')} alt="The car parked above a river valley" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1C242C 0%, rgba(28,36,44,.95) 32%, rgba(28,36,44,.74) 54%, rgba(28,36,44,.26) 74%, rgba(28,36,44,.06) 90%, rgba(28,36,44,.03) 100%)' }}></div>
          <div className="rtam-hero-band-in" style={{ position: 'relative', display: 'grid', gap: 48 }}>

        <div style={{ display: 'grid', gap: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: 14 }}>
              <Eyebrow tone="cyan" size={13} track={0.22}>Day {D.day} · {D.province}</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 86, lineHeight: .95, letterSpacing: '-.04em', color: '#F6F0E3', fontVariantNumeric: 'tabular-nums' }}>{D.odometer.toLocaleString()}</span>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: '#A47D51' }}>km</span>
              </div>
              <div style={{ fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.55)' }}>{D.route}</div>
            </div>
            <div className="rtam-hero-right" style={{ display: 'grid', gap: 10, justifyItems: 'end', textAlign: 'right' }}>
              <Eyebrow tone="bronze" size={10}>Remaining</Eyebrow>
              <div style={{ fontSize: 34, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: '#F6F0E3' }}>{remaining.toLocaleString()} <span style={{ fontSize: 14, letterSpacing: '.18em', color: '#A47D51' }}>KM</span></div>
              <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>{daysLeft === null ? 'Pace not established yet' : '≈ ' + daysLeft.toLocaleString() + ' days at current pace'}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <ProgressRule percent={pct} height={5} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.5)' }}>
              <span>{pct.toFixed(1)}% complete</span><span style={{ color: '#A47D51' }}>1,000,000 km goal</span>
            </div>
          </div>
        </div>

        <div className="rtam-charge" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div className="rtam-charge-l" style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 56, lineHeight: 1, letterSpacing: '-.04em', color: '#F6F0E3', fontVariantNumeric: 'tabular-nums' }}>{D.chargeLifetime.toLocaleString()}</span>
            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3, letterSpacing: '.2em', textTransform: 'uppercase', color: '#A47D51', paddingBottom: 4 }}>Charge sessions<br />so far</span>
          </div>
          <div className="rtam-charge-r" style={{ display: 'grid', gap: 6, justifyItems: 'end', textAlign: 'right', paddingBottom: 4 }}>
            <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.8)' }}>{D.chargeLifetimeSupercharger.toLocaleString()} Tesla Supercharger</span>
            <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.8)' }}>{D.chargeLifetimeOther.toLocaleString()} other networks</span>
          </div>
        </div>

          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 24 }}>
          <Metric label="Latest day" value={D.today.toLocaleString()} unit="KM" sub={<React.Fragment>Highest km day so far <span style={{ fontWeight: 700, color: '#F6F0E3' }}>{D.best.toLocaleString()} km</span> — Day {D.bestDay ?? D.day}</React.Fragment>} />
          <Metric label="Daily average" value={D.avgPerDay.toLocaleString()} unit="KM" sub={'Across ' + D.day + ' days'} />
          <SplitMetric label="Latest day charge sessions" a={{ value: D.chargeSupercharger, label: 'Tesla Supercharger' }} b={{ value: D.chargeOther, label: 'Other networks' }} />
        </div>

        <div className="rtam-mapgrid" style={{ display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', gap: 32, alignItems: 'start' }}>
          <DayList rows={D.log || []} activeKey={shownKey} onSelect={setSelected} onLatest={() => setSelected(null)} following={!selected} />
          <DayMap map={shownMap} />
        </div>

        <div style={{ display: 'grid', gap: 32 }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
              <Eyebrow tone="bronze" size={11} track={0.24}>Distance per day</Eyebrow>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {['8 days', '30 days'].map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{ padding: '8px 14px', cursor: 'pointer', borderRadius: 'var(--rtam-r)', background: range === r ? '#00B4D9' : 'transparent', color: range === r ? '#1C242C' : 'rgba(246,240,227,.6)', border: '1px solid ' + (range === r ? '#00B4D9' : 'rgba(246,240,227,.22)'), fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase' }}>{r}</button>
                ))}
                <span style={{ width: 1, height: 16, background: 'rgba(246,240,227,.18)', margin: '0 2px' }}></span>
                <a href="archive.html" className="rtam-archive-link" style={{ padding: '8px 14px', borderRadius: 'var(--rtam-r)', background: 'transparent', color: 'rgba(246,240,227,.6)', border: '1px solid rgba(246,240,227,.22)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none' }}>Archive</a>
              </div>
            </div>
            <DistanceBars days={barDays} activeKey={shownKey} onSelect={setSelected} />
          </div>
        </div>

        {RouteMap && (
          <div style={{ display: 'grid', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
              <Eyebrow tone="bronze" size={11} track={0.24}>Every road so far</Eyebrow>
              <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.4)' }}>Since Day 1 · roads driven twice are drawn once</span>
            </div>
            <RouteMap route={route} base={base} />
          </div>
        )}

        {N && (
          <div style={{ display: 'grid', gap: 34, paddingTop: 40, borderTop: '1px solid rgba(246,240,227,.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
              <Eyebrow tone="cyan" size={12} track={0.24}>The numbers behind it</Eyebrow>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
              <NerdStat label="Lifetime consumption" value={(N.energy.whPerKm || 0).toLocaleString()} unit="WH/KM" sub={(N.energy.rangeEst ? '≈ ' + N.energy.rangeEst.toLocaleString() + ' km of range at this rate' : (N.energy.kmPerKwh || 0) + ' km per kWh') + ' · median drive ' + (N.efficiency.median || 0) + ' Wh/km'} />
              <NerdStat label="Energy used" value={(N.energy.used || 0).toLocaleString()} unit="KWH" sub={'Best drive ' + (N.efficiency.best || 0) + ' Wh/km'} />
              <NerdStat label="Energy added" value={(N.energy.added || 0).toLocaleString()} unit="KWH" sub={N.energy.overhead !== null ? N.energy.overhead + '% lost to charging and conditioning' : 'Charging overhead pending'} />
              <NerdStat label="Autopilot share" value={(N.autopilot.pct || 0).toLocaleString()} unit="%" sub={(N.autopilot.km || 0).toLocaleString() + ' km of the total'} />
              {N.battery && <NerdStat label="Battery health" value={N.battery.healthPct !== null ? N.battery.healthPct.toLocaleString() : '—'} unit="%" sub={N.battery.rangeNow ? Math.round(N.battery.rangeNow).toLocaleString() + ' km at full charge' : 'Weekly reading'} />}
              {SHOW_COST && N.cost.total > 0 && <NerdStat label="Charging spend" value={'$' + N.cost.total.toLocaleString()} unit={N.cost.currency} sub={'$' + N.cost.perKm + ' per km · ' + N.cost.sessions + ' priced sessions'} />}
            </div>

            <div style={{ display: 'grid', gap: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
                <Eyebrow tone="bronze" size={11} track={0.24}>Consumption against outside temperature</Eyebrow>
                <span style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.4)' }}>Wh/km against °C · one dot per drive · coloured by province</span>
              </div>
              <EfficiencyScatter data={N.efficiency} />
            </div>

            <div className="rtam-nerdgrid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 32, alignItems: 'stretch' }}>
              <div style={{ display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                  <Eyebrow tone="bronze" size={11} track={0.24}>Charge curve · kW</Eyebrow>
                </div>
                <ChargeCurve data={N.chargeCurve} />
                <span style={{ minHeight: 28, fontSize: 10, lineHeight: 1.4, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.4)' }}>{N.chargeCurve.note}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', gap: 18 }}>
                <Eyebrow tone="bronze" size={11} track={0.24}>Firmware</Eyebrow>
                <FirmwareLog versions={N.firmware} />
                <span style={{ minHeight: 28, fontSize: 10, lineHeight: 1.4, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(246,240,227,.4)' }}>Logged when the car reports a new version</span>
              </div>
            </div>
          </div>
        )}

        <Plate tone="ghost" pad={26} style={{ gap: 16, borderRadius: 'var(--rtam-r)' }}>
          <Eyebrow tone="bronze" size={10}>Agreement</Eyebrow>
          <p style={{ margin: 0, maxWidth: 720, fontSize: 13, lineHeight: 1.7, color: 'rgba(246,240,227,.62)' }}>The run ends at the earliest of: the odometer reaching 1,000,000 km; the battery failing past reasonable operation; or the vehicle being declared a total loss.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Chip>Started 2 Sep 2026</Chip><Chip>2026 Model 3</Chip></div>
        </Plate>

      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

/* Embedded in an iframe, the parent page can't know how tall this is. Report
   height on every layout change so the host can size the frame. */
if (window.parent !== window) {
  const post = () => window.parent.postMessage(
    { type: 'rtam:height', height: document.documentElement.scrollHeight }, '*');
  new ResizeObserver(post).observe(document.documentElement);
  window.addEventListener('load', post);
  post();
}
