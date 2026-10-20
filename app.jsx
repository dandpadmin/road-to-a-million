const { Badge, Wordmark, Eyebrow, Plate, StatReadout, ProgressRule, Chip } = window.RoadToAMillionDesignSystem_6606d4;
const { DayMap, DayList, EfficiencyScatter, ChargeTimes, ChargeCurve, NerdStat, FirmwareLog, RouteMap, BandHead, BandButton, bandNote } = window;
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
        {/* "every 2H" mirrors the cron in .github/workflows/snapshot.yml; change both together. */}
        <span className="rtam-topbar-status" style={{ fontSize: 10, textAlign: 'center', letterSpacing: '.2em', textTransform: 'uppercase', color: D.liveKm ? '#E8B33A' : '#00B4D9' }}>● {D.liveKm ? 'Km every 2H · map delayed ' + (D.locationEmbargoHours ?? 24) + 'H' : 'Delayed ' + (D.embargoHours ?? 24) + 'H'} · through Day {D.day}{stamp ? ' · updated ' + stamp : ''}</span>
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
              <span style={{ fontFamily: '"Montserrat", "Arial", sans-serif', fontWeight: 600, fontSize: 20, lineHeight: 1.1, letterSpacing: '-.03em', color: '#00B4D9' }}>Day {D.day} · {D.province}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 86, lineHeight: .95, letterSpacing: '-.04em', color: '#F6F0E3', fontVariantNumeric: 'tabular-nums' }}>{D.odometer.toLocaleString()}</span>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: '#A47D51' }}>km</span>
              </div>
              <div style={{ fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.55)' }}>{D.route}</div>
            </div>
            <div className="rtam-hero-right" style={{ display: 'grid', gap: 10, justifyItems: 'end', textAlign: 'right' }}>
              <span style={{ fontFamily: '"Montserrat", "Arial", sans-serif', fontWeight: 600, fontSize: 16, lineHeight: 1.1, letterSpacing: '-.03em', color: '#A47D51' }}>Remaining</span>
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

        {/* Lifetime charge count. The label sits on a Bone plate cut to the
           figure's height; the network split runs underneath. */}
        <div className="rtam-charge" style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
          <div className="rtam-charge-l" style={{ display: 'flex', alignItems: 'stretch', gap: 16 }}>
            <span className="rtam-charge-n" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 56, lineHeight: .74, paddingTop: 2, letterSpacing: '-.04em', color: '#F6F0E3', fontVariantNumeric: 'tabular-nums' }}>{D.chargeLifetime.toLocaleString()}</span>
            <span className="rtam-charge-tag" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', background: '#F6F0E3', color: '#1C242C', borderRadius: 'var(--rtam-r)', fontFamily: '"Montserrat", "Arial", sans-serif', fontWeight: 600, fontSize: 18, lineHeight: 1.1, letterSpacing: '-.03em' }}>Charge Sessions<br />So Far</span>
          </div>
          <div className="rtam-charge-split" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(246,240,227,.8)' }}>
            <span>{D.chargeLifetimeSupercharger.toLocaleString()} Tesla Supercharger</span>
            <span style={{ color: 'rgba(246,240,227,.4)' }}>·</span>
            <span>{D.chargeLifetimeOther.toLocaleString()} other networks</span>
          </div>
        </div>

          </div>
        </div>

        <div className="rtam-metricgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 24 }}>
          <Metric label="Latest Day" value={D.today.toLocaleString()} unit="KM" sub={<React.Fragment>Highest km day so far <span style={{ fontWeight: 700, color: '#F6F0E3' }}>{D.best.toLocaleString()} km</span> — Day {D.bestDay ?? D.day}</React.Fragment>} />
          <Metric label="Daily Average" value={D.avgPerDay.toLocaleString()} unit="KM" sub={'Across ' + D.day + ' days'} />
          <SplitMetric label="Latest Day Charge Sessions" a={{ value: D.chargeSupercharger, label: 'Tesla Supercharger' }} b={{ value: D.chargeOther, label: 'Other networks' }} />
        </div>

        <div className="rtam-mapgrid" style={{ display: 'grid', gridTemplateColumns: '320px minmax(0,1fr)', gap: 32, alignItems: 'stretch' }}>
          {/* The log takes the map's height: it sits absolutely inside this
              cell, so only the map sets the row height and the log scrolls. */}
          <div className="rtam-daylist-wrap" style={{ position: 'relative', minHeight: 320 }}>
          <DayList rows={D.log || []} activeKey={shownKey} onSelect={setSelected} onLatest={() => setSelected(null)} following={!selected} />
          </div>
          <DayMap map={shownMap} />
        </div>

        <DistanceBars days={barDays} activeKey={shownKey} onSelect={setSelected} head="Distance Per Day" headRight={
          <React.Fragment>
            {['8 days', '30 days'].map(r => <BandButton key={r} active={range === r} onClick={() => setRange(r)}>{r}</BandButton>)}
            <span style={{ width: 1, height: 16, background: 'rgba(28,36,44,.35)', margin: '0 2px' }}></span>
            <BandButton href="archive.html">Archive</BandButton>
          </React.Fragment>} />

        {RouteMap && (
          <RouteMap route={route} base={base} head="Every Road So Far" headRight={<span style={bandNote}>Since Day 1 · roads driven twice are drawn once</span>} />
        )}

        {N && (
          <div style={{ display: 'grid', gap: 34, paddingTop: 40, borderTop: '1px solid rgba(246,240,227,.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: '"Montserrat", "Arial", sans-serif', fontWeight: 600, fontSize: 28, lineHeight: 1.1, letterSpacing: '-.03em', color: '#00B4D9' }}>The Numbers Behind It</span>
            </div>

            <div className="rtam-metricgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
              <NerdStat label="Lifetime Consumption" value={(N.energy.whPerKm || 0).toLocaleString()} unit="WH/KM" sub={(N.energy.rangeEst ? '≈ ' + N.energy.rangeEst.toLocaleString() + ' km of range at this rate' : (N.energy.kmPerKwh || 0) + ' km per kWh') + ' · median drive ' + (N.efficiency.median || 0) + ' Wh/km'} />
              <NerdStat label="Energy Used" value={(N.energy.used || 0).toLocaleString()} unit="KWH" sub={'Best drive ' + (N.efficiency.best || 0) + ' Wh/km'} />
              <NerdStat label="Energy Added" value={(N.energy.added || 0).toLocaleString()} unit="KWH" sub={N.energy.overhead !== null ? N.energy.overhead + '% lost to charging and conditioning' : 'Charging overhead pending'} />
              <NerdStat label="Autopilot Share" value={(N.autopilot.pct || 0).toLocaleString()} unit="%" sub={(N.autopilot.km || 0).toLocaleString() + ' km of the total'} />
              {N.battery && <NerdStat label="Battery Health" value={N.battery.healthPct !== null ? N.battery.healthPct.toLocaleString() : '—'} unit="%" sub={N.battery.rangeNow ? Math.round(N.battery.rangeNow).toLocaleString() + ' km at full charge' : 'Weekly reading'} />}
              {SHOW_COST && N.cost.total > 0 && <NerdStat label="Charging Spend" value={'$' + N.cost.total.toLocaleString()} unit={N.cost.currency} sub={'$' + N.cost.perKm + ' per km · ' + N.cost.sessions + ' priced sessions'} />}
            </div>

            <EfficiencyScatter data={N.efficiency} head="Consumption Against Outside Temperature" headRight={<span style={bandNote}>Wh/km against °C · one dot per drive · coloured by country</span>} />

            {N.chargeTimes && <ChargeTimes data={N.chargeTimes} head="Time on the Charger" headRight={<span style={bandNote}>One dot per session · Supercharger, other networks, overnight</span>} />}

            <div className="rtam-nerdgrid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 32, alignItems: 'stretch' }}>
              <div style={{ display: 'grid', gridTemplateRows: 'minmax(0,1fr) auto', gap: 14 }}>
                <ChargeCurve data={N.chargeCurve} head="Charge Curve · kW" />
                <span style={{ minHeight: 28, fontSize: 11, lineHeight: 1.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(246,240,227,.58)' }}>{N.chargeCurve.note}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateRows: 'minmax(0,1fr) auto', gap: 14 }}>
                <FirmwareLog versions={N.firmware} head="Firmware" />
                <span style={{ minHeight: 28, fontSize: 11, lineHeight: 1.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(246,240,227,.58)' }}>Logged when the car reports a new version</span>
              </div>
            </div>
          </div>
        )}

        <Plate tone="raised" pad={26} style={{ gap: 18, borderRadius: 'var(--rtam-r)' }}>
          <BandHead pad={26}>Agreement</BandHead>
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
