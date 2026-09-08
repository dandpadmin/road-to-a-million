/* @ds-bundle: {"format":4,"namespace":"RoadToAMillionDesignSystem_6606d4","components":[{"name":"Badge","sourcePath":"components/brand/Badge.jsx"},{"name":"DpLockup","sourcePath":"components/brand/DpLockup.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Callout","sourcePath":"components/core/Callout.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Plate","sourcePath":"components/core/Plate.jsx"},{"name":"SpecColumns","sourcePath":"components/core/SpecColumns.jsx"},{"name":"ProgressRule","sourcePath":"components/data/ProgressRule.jsx"},{"name":"StatReadout","sourcePath":"components/data/StatReadout.jsx"},{"name":"LowerThird","sourcePath":"components/media/LowerThird.jsx"},{"name":"Scrim","sourcePath":"components/media/Scrim.jsx"}],"sourceHashes":{"components/brand/Badge.jsx":"1ba6cbb1d35b","components/brand/DpLockup.jsx":"c9ba099fa21b","components/brand/Wordmark.jsx":"ebdf2cc93589","components/core/Callout.jsx":"36d37135dd97","components/core/Chip.jsx":"712864c9fb2b","components/core/Eyebrow.jsx":"f1dc8e4296a4","components/core/Plate.jsx":"fd2622c1cede","components/core/SpecColumns.jsx":"f078bba5f46c","components/data/ProgressRule.jsx":"db0eee9abdc2","components/data/StatReadout.jsx":"2affc951fa38","components/media/LowerThird.jsx":"ed2b347b321c","components/media/Scrim.jsx":"8b6b33d7c8c3","ui_kits/brand-guide/Sections.jsx":"137b1a5e44fe","ui_kits/broadcast/Beats.jsx":"233c5543a57b","ui_kits/broadcast/Frame.jsx":"8c0943f8c306","ui_kits/odometer/Nerd.jsx":"7c2516baa1da","ui_kits/odometer/Panels.jsx":"b1218a7d3228","ui_kits/odometer/data.js":"dc2dd43c01cf","ui_kits/odometer/job/fetch-instagram.mjs":"e26584c1db0f","ui_kits/odometer/job/fetch-snapshot.mjs":"5a07fca34a24","ui_kits/odometer/tessie.js":"feadf9785773","ui_kits/social/Frames.jsx":"e4455e4122b3","ui_kits/thumbnail/Controls.jsx":"561caaca8566","ui_kits/thumbnail/Ridge.jsx":"a0b651a33e18","ui_kits/thumbnail/Thumbnail.jsx":"e8bca77ff747"},"inlinedExternals":[],"unexposedExports":[{"name":"load","sourcePath":"ui_kits/odometer/tessie.js"},{"name":"mount","sourcePath":"ui_kits/odometer/tessie.js"},{"name":"shape","sourcePath":"ui_kits/odometer/tessie.js"}]} */

(() => {

const __ds_ns = (window.RoadToAMillionDesignSystem_6606d4 = window.RoadToAMillionDesignSystem_6606d4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The badge is extracted vector from the source PDF. The four type lines are set
   live in Etna / Plex Mono so they stay crisp at any size — never redraw them. */
function Badge({
  size = 288,
  src = 'assets/badge-art.svg',
  showType = true,
  style,
  ...rest
}) {
  const px = typeof size === 'number' ? size + 'px' : size;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "img",
    "aria-label": "Road To A Million badge",
    style: {
      position: 'relative',
      width: px,
      aspectRatio: '1',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      display: 'block',
      width: '100%',
      height: 'auto'
    }
  }), showType && /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 288 288",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("text", {
    x: "64.1289",
    y: "209.2354",
    fontFamily: "etna-x-condensed",
    fontWeight: "700",
    fontSize: "64.0449",
    fill: "#00b4d9"
  }, "MILLION"), /*#__PURE__*/React.createElement("text", {
    x: "87.1494",
    y: "155.2427",
    fontFamily: "IBM Plex Mono",
    fontWeight: "600",
    fontSize: "20.852",
    fill: "#a47d51"
  }, "ROAD TO A"), /*#__PURE__*/React.createElement("text", {
    x: "80.3579",
    y: "36.3208",
    fontFamily: "etna",
    fontWeight: "700",
    fontSize: "19.3336",
    fill: "#00b4d9"
  }, "1,000,000 KM"), /*#__PURE__*/React.createElement("text", {
    x: "48.4302",
    y: "54.2539",
    fontFamily: "IBM Plex Mono",
    fontWeight: "500",
    fontSize: "13.8687",
    fill: "#a47d51"
  }, "TESLA MODEL 3 CHALLENGE")));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Badge.jsx", error: String((e && e.message) || e) }); }

// components/brand/DpLockup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Endorsed lockup — RTAM is the project, Drive Protected is who is behind it.
   Hairline divider, full badge height, 22px either side. Wordmark cap height
   sits at 60% of badge height; never larger. */
function DpLockup({
  badgeSize = 84,
  tone = 'on-midnight',
  label = 'Presented by',
  badgeSrc = 'assets/badge-art.svg',
  wordmarkSrc,
  style,
  ...rest
}) {
  const bone = tone === 'on-midnight';
  const src = wordmarkSrc || (bone ? 'assets/dp-wordmark.svg' : 'assets/dp-wordmark.svg');
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '22px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    size: badgeSize,
    src: badgeSrc,
    style: {
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '1px',
      alignSelf: 'stretch',
      background: bone ? 'rgba(246,240,227,.25)' : 'rgba(28,36,44,.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '7px',
      justifyItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 500,
      fontSize: '9px',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: bone ? 'rgba(246,240,227,.5)' : 'rgba(28,36,44,.55)'
    }
  }, label), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Drive Protected",
    style: {
      height: Math.round(badgeSize * 0.52) + 'px',
      display: 'block'
    }
  })));
}
Object.assign(__ds_scope, { DpLockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/DpLockup.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  'on-midnight': {
    eyebrow: '#00B4D9',
    title: '#F6F0E3'
  },
  'on-bone': {
    eyebrow: '#00B4D9',
    title: '#1C242C'
  },
  'one-colour-bone': {
    eyebrow: '#F6F0E3',
    title: '#F6F0E3'
  },
  'one-colour-midnight': {
    eyebrow: '#1C242C',
    title: '#1C242C'
  }
};

/* The working mark: MILLION in Etna X Condensed Bold under a tracked mono eyebrow
   locked to 17% of the title size — the ratio the title sting uses. */
function Wordmark({
  size = 96,
  tone = 'on-midnight',
  align = 'centre',
  showEyebrow = true,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES['on-midnight'];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "img",
    "aria-label": "Road To A Million",
    style: {
      display: 'inline-grid',
      gap: 0,
      justifyItems: align === 'left' ? 'start' : 'center',
      width: '100%',
      ...style
    }
  }, rest), showEyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: Math.round(size * 0.17 * 100) / 100 + 'px',
      letterSpacing: '0.22em',
      paddingLeft: '0.22em',
      lineHeight: 1.1,
      color: t.eyebrow
    }
  }, "Road to a"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed', 'Arial Narrow', sans-serif",
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: size + 'px',
      lineHeight: 1,
      paddingBottom: '0.06em',
      marginTop: '-0.1em',
      letterSpacing: '-0.01em',
      color: t.title
    }
  }, "Million"));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/core/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Cyan-tinted note plate. One per view — cyan is the 5% colour. */
function Callout({
  children,
  title,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: '26px 28px',
      border: '1px solid rgba(0,180,217,.4)',
      background: 'rgba(0,180,217,.07)',
      display: 'grid',
      gap: '10px',
      ...style
    }
  }, rest), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 600,
      fontSize: '11px',
      letterSpacing: '0.24em',
      textTransform: 'uppercase',
      color: '#00B4D9'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontSize: '14px',
      lineHeight: 1.7,
      color: 'rgba(246,240,227,.75)',
      textWrap: 'pretty'
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Callout.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Chip({
  children,
  tone = 'bone',
  style,
  ...rest
}) {
  const bone = tone === 'bone';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      padding: '8px 14px',
      border: '1px solid ' + (bone ? 'rgba(246,240,227,.22)' : 'rgba(28,36,44,.22)'),
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontSize: '11px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: bone ? 'rgba(246,240,227,.7)' : 'rgba(28,36,44,.7)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  cyan: '#00B4D9',
  bronze: '#A47D51',
  bone: 'rgba(246,240,227,.5)',
  midnight: 'rgba(28,36,44,.55)'
};
function Eyebrow({
  children,
  tone = 'cyan',
  size = 11,
  track = 0.22,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 600,
      fontSize: size + 'px',
      letterSpacing: track + 'em',
      textTransform: 'uppercase',
      color: TONE[tone] || tone,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Plate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A hairline plate — the system's only container. No rounding, no shadow. */
function Plate({
  children,
  tone = 'midnight',
  pad = 32,
  style,
  ...rest
}) {
  const map = {
    midnight: {
      background: '#1C242C',
      border: '1px solid rgba(246,240,227,.18)',
      color: '#F6F0E3'
    },
    bone: {
      background: '#F6F0E3',
      border: '1px solid rgba(28,36,44,.16)',
      color: '#1C242C'
    },
    ghost: {
      background: 'transparent',
      border: '1px solid rgba(246,240,227,.18)',
      color: '#F6F0E3'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...(map[tone] || map.midnight),
      padding: pad + 'px',
      display: 'grid',
      gap: '18px',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Plate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Plate.jsx", error: String((e && e.message) || e) }); }

// components/core/SpecColumns.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The three-up spec strip that closes most guide sections: hairline on top,
   vertical hairlines between, a bronze eyebrow over one short paragraph. */
function SpecColumns({
  items = [],
  tone = 'midnight',
  style,
  ...rest
}) {
  const bone = tone === 'midnight';
  const line = bone ? 'rgba(246,240,227,.12)' : 'rgba(28,36,44,.12)';
  const top = bone ? 'rgba(246,240,227,.18)' : 'rgba(28,36,44,.16)';
  const body = bone ? 'rgba(246,240,227,.7)' : 'rgba(28,36,44,.7)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
      borderTop: '1px solid ' + top,
      ...style
    }
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      padding: i === 0 ? '26px 26px 26px 0' : '26px',
      borderRight: i === items.length - 1 ? 'none' : '1px solid ' + line
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 600,
      fontSize: '10px',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#A47D51',
      marginBottom: '10px'
    }
  }, it.label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontSize: '14px',
      lineHeight: 1.6,
      color: body
    }
  }, it.body))));
}
Object.assign(__ds_scope, { SpecColumns });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SpecColumns.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The run to one million, as a 5px rule. The only place cyan fills an area. */
function ProgressRule({
  percent = 41.3,
  height = 5,
  style,
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, percent));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      height: height + 'px',
      background: 'rgba(246,240,227,.22)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: height + 'px',
      background: '#00B4D9',
      width: pct + '%'
    }
  }));
}
Object.assign(__ds_scope, { ProgressRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressRule.jsx", error: String((e && e.message) || e) }); }

// components/data/StatReadout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Odometer-style readout. Numbers are always tabular so counters do not jitter. */
function StatReadout({
  value = '418,203',
  unit = 'KM',
  size = 40,
  face = 'mono',
  style,
  ...rest
}) {
  const display = face === 'display';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: Math.round(size * 0.24) + 'px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: display ? "'etna-x-condensed', 'Arial Narrow', sans-serif" : "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: display ? 700 : 600,
      fontSize: size + 'px',
      lineHeight: display ? 0.9 : 1.2,
      letterSpacing: display ? '-0.01em' : '0.02em',
      fontVariantNumeric: 'tabular-nums',
      color: '#F6F0E3'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 500,
      fontSize: Math.round(size * 0.44) + 'px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: '#A47D51'
    }
  }, unit));
}
Object.assign(__ds_scope, { StatReadout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatReadout.jsx", error: String((e && e.message) || e) }); }

// components/media/LowerThird.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Bottom-left, 6% margins, Midnight plate at 85%, 2px cyan rule on top. */
function LowerThird({
  eyebrow = 'Day 412',
  title = 'Nevada at dawn',
  meta,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-grid',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '2px',
      background: '#00B4D9'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(28,36,44,.85)',
      padding: '18px 26px 20px',
      display: 'grid',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 600,
      fontSize: '11px',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#00B4D9'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed', 'Arial Narrow', sans-serif",
      fontWeight: 700,
      fontSize: '40px',
      lineHeight: 0.94,
      textTransform: 'uppercase',
      color: '#F6F0E3'
    }
  }, title), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
      fontWeight: 500,
      fontSize: '11px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.55)'
    }
  }, meta)));
}
Object.assign(__ds_scope, { LowerThird });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/LowerThird.jsx", error: String((e && e.message) || e) }); }

// components/media/Scrim.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Midnight at 90% behind type, fading to clear by mid-frame. Never a flat overlay. */
const DIRS = {
  bottom: 'linear-gradient(to top, rgba(28,36,44,.9) 0%, rgba(28,36,44,.15) 55%, rgba(28,36,44,.55) 100%)',
  top: 'linear-gradient(180deg, rgba(28,36,44,.94) 0%, rgba(28,36,44,.7) 56%, rgba(28,36,44,0) 100%)',
  left: 'linear-gradient(100deg, rgba(28,36,44,.94) 0%, rgba(28,36,44,.6) 42%, transparent 78%)'
};
function Scrim({
  from = 'bottom',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      background: DIRS[from] || DIRS.bottom,
      pointerEvents: 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Scrim });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Scrim.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brand-guide/Sections.jsx
try { (() => {
const {
  Badge,
  Wordmark,
  DpLockup,
  Eyebrow,
  Chip,
  Plate,
  SpecColumns,
  Callout
} = window.RoadToAMillionDesignSystem_6606d4;
const A = '../../assets/';
function SectionHead({
  num,
  title,
  lead,
  tone = 'midnight'
}) {
  const bone = tone === 'midnight';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20,
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: bone ? 'cyan' : 'bronze',
    size: 11,
    track: 0.3
  }, num), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(40px,6vw,72px)',
      lineHeight: .94,
      textTransform: 'uppercase',
      color: bone ? '#F6F0E3' : '#1C242C'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 16,
      lineHeight: 1.7,
      color: bone ? 'rgba(246,240,227,.66)' : 'rgba(28,36,44,.7)',
      textWrap: 'pretty'
    }
  }, lead));
}
function Specimen({
  bg,
  label,
  children,
  border
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: '52px 32px',
      background: bg,
      border: border || 'none'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, label));
}
function Swatch({
  name,
  hex,
  rgb,
  cmyk,
  role
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(246,240,227,.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 180,
      background: hex,
      borderBottom: '1px solid rgba(246,240,227,.18)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8,
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 22,
      textTransform: 'uppercase',
      color: '#F6F0E3'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      lineHeight: 1.9,
      color: 'rgba(246,240,227,.6)'
    }
  }, "HEX ", hex.slice(1).toUpperCase(), /*#__PURE__*/React.createElement("br", null), "RGB ", rgb, /*#__PURE__*/React.createElement("br", null), "CMYK ", cmyk), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 10,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: '#A47D51'
    }
  }, role)));
}
Object.assign(window, {
  SectionHead,
  Specimen,
  Swatch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brand-guide/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/broadcast/Beats.jsx
try { (() => {
const {
  Badge,
  Wordmark,
  StatReadout,
  Eyebrow
} = window.RoadToAMillionDesignSystem_6606d4;
const A = '../../assets/';

/* The three canonical beats from section 09 of the guide. Every one of them
   starts slowly, holds at least 2s, and leaves. Nothing bounces, nothing spins. */

function BadgeSting({
  playing
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    size: 200,
    src: A + 'badge-art.svg',
    style: {
      animation: playing ? 'rtam-rise 5s cubic-bezier(.22,.9,.24,1) infinite' : 'none'
    }
  }));
}
function TitleCard({
  playing,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      padding: '0 48px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed','Arial Narrow',sans-serif",
      fontWeight: 700,
      fontSize: 72,
      lineHeight: .86,
      textTransform: 'uppercase',
      color: '#F6F0E3',
      textAlign: 'center',
      animation: playing ? 'rtam-wipe 5s cubic-bezier(.3,.85,.2,1) infinite' : 'none'
    }
  }, title.split('\n').map((l, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("br", null), l))));
}
function StatOverlay({
  playing,
  odometer
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      justifyItems: 'center',
      animation: playing ? 'rtam-tick 5s ease-out infinite' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "cyan",
    size: 13,
    track: 0.22
  }, "Odometer"), /*#__PURE__*/React.createElement(StatReadout, {
    value: odometer,
    unit: "KM",
    size: 48
  })));
}
Object.assign(window, {
  BadgeSting,
  TitleCard,
  StatOverlay
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/broadcast/Beats.jsx", error: String((e && e.message) || e) }); }

// ui_kits/broadcast/Frame.jsx
try { (() => {
const {
  LowerThird,
  Scrim,
  Eyebrow
} = window.RoadToAMillionDesignSystem_6606d4;

/* A 16:9 episode frame with the furniture in its real position:
   bottom-left, 6% margins. */
function EpisodeFrame({
  photo,
  children,
  safeArea
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      background: '#1C242C',
      overflow: 'hidden',
      border: '1px solid rgba(246,240,227,.18)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement(Scrim, {
    from: "bottom"
  }), safeArea && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '6%',
      border: '1px dashed rgba(0,180,217,.35)',
      pointerEvents: 'none'
    }
  }), children);
}
function BeatTab({
  label,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      padding: '11px 18px',
      cursor: 'pointer',
      borderRadius: 0,
      background: active ? '#00B4D9' : 'transparent',
      color: active ? '#1C242C' : 'rgba(246,240,227,.6)',
      border: '1px solid ' + (active ? '#00B4D9' : 'rgba(246,240,227,.22)'),
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      fontWeight: 500
    }
  }, label);
}
Object.assign(window, {
  EpisodeFrame,
  BeatTab
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/broadcast/Frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/odometer/Nerd.jsx
try { (() => {
const {
  Eyebrow,
  Plate,
  StatReadout,
  Chip
} = window.RoadToAMillionDesignSystem_6606d4;

/* The nerd section. Everything here is derived from payloads the odometer job
   already fetches, so none of it costs an extra Tessie call — except battery
   health, which is one soft request that fails quietly.

   Categorical colour. The brand runs cyan / bronze / bone and nothing else, so
   a province palette has to come from somewhere: these are the three brand
   colours plus four oklch neighbours picked to sit at the same lightness and
   chroma, rather than four arbitrary hues. */
const PROV_COLORS = ['#00B4D9', '#A47D51', '#F6F0E3', 'oklch(0.74 0.11 175)', 'oklch(0.70 0.10 300)', 'oklch(0.79 0.12 75)', 'oklch(0.69 0.12 20)'];
const provColor = (list, p) => PROV_COLORS[Math.max(0, list.indexOf(p)) % PROV_COLORS.length];
const AXIS = 'rgba(246,240,227,.28)';
const AXIS_TEXT = 'rgba(246,240,227,.5)';

/* Round a range outward to sensible tick values so the axis reads in whole
   numbers rather than whatever the extremes happen to be. */
function niceScale(min, max, steps) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return {
    lo: 0,
    hi: 1,
    ticks: [0, 1]
  };
  const raw = (max - min) / steps;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || mag * 10;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Number(v.toFixed(6)));
  return {
    lo,
    hi,
    ticks
  };
}

/* Every drive as a dot: outside temperature against consumption. This is the
   graph the audience will argue about, so it gets the space and real axes. */
function EfficiencyScatter({
  data
}) {
  const pts = data && data.points || [];
  const provinces = data && data.provinces || [];
  const W = 720,
    H = 340,
    L = 58,
    R = 14,
    T = 16,
    B = 42;
  if (!pts.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px dashed rgba(246,240,227,.22)',
        padding: 40,
        textAlign: 'center',
        fontSize: 11,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: 'rgba(246,240,227,.35)'
      }
    }, "Awaiting drives with temperature data");
  }
  const xs = niceScale(Math.min(...pts.map(p => p.t)), Math.max(...pts.map(p => p.t)), 6);
  const ys = niceScale(Math.min(...pts.map(p => p.wh)), Math.max(...pts.map(p => p.wh)), 5);
  const px = t => L + (t - xs.lo) / (xs.hi - xs.lo) * (W - L - R);
  const py = w => H - B - (w - ys.lo) / (ys.hi - ys.lo) * (H - T - B);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(246,240,227,.18)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      width: '100%',
      height: 'auto',
      aspectRatio: W + ' / ' + H
    }
  }, ys.ticks.map((v, i) => /*#__PURE__*/React.createElement("g", {
    key: 'y' + i
  }, /*#__PURE__*/React.createElement("line", {
    x1: L,
    y1: py(v),
    x2: W - R,
    y2: py(v),
    stroke: "rgba(246,240,227,.08)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: L - 10,
    y: py(v) + 4,
    textAnchor: "end",
    fill: AXIS_TEXT,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px'
    }
  }, v))), xs.ticks.map((v, i) => /*#__PURE__*/React.createElement("text", {
    key: 'x' + i,
    x: px(v),
    y: H - B + 20,
    textAnchor: "middle",
    fill: AXIS_TEXT,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px'
    }
  }, v, "\xB0")), /*#__PURE__*/React.createElement("line", {
    x1: L,
    y1: H - B,
    x2: W - R,
    y2: H - B,
    stroke: AXIS,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: L,
    y1: T,
    x2: L,
    y2: H - B,
    stroke: AXIS,
    strokeWidth: "1"
  }), xs.lo < 0 && xs.hi > 0 && /*#__PURE__*/React.createElement("line", {
    x1: px(0),
    y1: T,
    x2: px(0),
    y2: H - B,
    stroke: "rgba(246,240,227,.22)",
    strokeDasharray: "3 4",
    strokeWidth: "1"
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: px(p.t),
    cy: py(p.wh),
    r: 3,
    fill: provColor(provinces, p.prov),
    fillOpacity: "0.75"
  }, /*#__PURE__*/React.createElement("title", null, p.prov, " \xB7 ", p.t, "\xB0C \xB7 ", p.wh, " Wh/km \xB7 ", p.km, " km"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      flexWrap: 'wrap',
      alignItems: 'center',
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: AXIS_TEXT
    }
  }, provinces.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      background: provColor(provinces, p),
      display: 'inline-block'
    }
  }), p)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'rgba(246,240,227,.35)'
    }
  }, "Outside temperature \xB0C \xB7 ", pts.length, " drives")));
}

/* Peak power against state of charge, pooled across sessions. A single session
   summary is one reading, so this only becomes a curve over weeks — the sample
   count per bucket is shown rather than implied. */
function ChargeCurve({
  data
}) {
  const pts = data && data.points || [];
  const W = 520,
    H = 230,
    L = 46,
    R = 12,
    T = 18,
    B = 40;
  if (pts.length < 2) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px dashed rgba(246,240,227,.22)',
        padding: 34,
        textAlign: 'center',
        fontSize: 11,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: 'rgba(246,240,227,.35)'
      }
    }, "Curve fills in as sessions accumulate \u2014 ", pts.length, " of the 2 points needed");
  }
  const maxKw = Math.max(...pts.map(p => p.kw));
  const ys = niceScale(0, maxKw, 4);
  const px = soc => L + soc / 100 * (W - L - R);
  const py = kw => H - B - (kw - ys.lo) / (ys.hi - ys.lo) * (H - T - B);
  const line = pts.map(p => px(p.soc).toFixed(1) + ',' + py(p.kw).toFixed(1)).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(246,240,227,.18)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      width: '100%',
      height: 'auto',
      aspectRatio: W + ' / ' + H
    }
  }, ys.ticks.map((v, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: L,
    y1: py(v),
    x2: W - R,
    y2: py(v),
    stroke: "rgba(246,240,227,.08)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("text", {
    x: L - 10,
    y: py(v) + 4,
    textAnchor: "end",
    fill: AXIS_TEXT,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px'
    }
  }, v))), [0, 25, 50, 75, 100].map(v => /*#__PURE__*/React.createElement("text", {
    key: v,
    x: px(v),
    y: H - B + 20,
    textAnchor: "middle",
    fill: AXIS_TEXT,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '1px'
    }
  }, v, "%")), /*#__PURE__*/React.createElement("line", {
    x1: L,
    y1: H - B,
    x2: W - R,
    y2: H - B,
    stroke: AXIS,
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: line,
    fill: "none",
    stroke: "#00B4D9",
    strokeWidth: "2.5"
  }), pts.map((p, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: px(p.soc),
    cy: py(p.kw),
    r: 4,
    fill: "#1C242C",
    stroke: "#00B4D9",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("title", null, p.soc, "% \xB7 ", p.kw, " kW \xB7 ", p.n, " session", p.n === 1 ? '' : 's')))));
}
function NerdStat({
  label,
  value,
  unit,
  sub
}) {
  return /*#__PURE__*/React.createElement(Plate, {
    tone: "ghost",
    pad: 22,
    style: {
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "bronze",
    size: 10,
    track: 0.22
  }, label), /*#__PURE__*/React.createElement(StatReadout, {
    value: value,
    unit: unit || '',
    size: 34
  }), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, sub));
}

/* Firmware is the one thing Tessie reports only as "now" — the job records a
   line each time it changes, so this list starts empty and grows. */
function FirmwareLog({
  versions
}) {
  const list = (versions || []).slice().reverse();
  if (!list.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        color: 'rgba(246,240,227,.35)'
      }
    }, "Recording from today \u2014 no changes seen yet");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 0
    }
  }, list.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: v.version + i,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      padding: '11px 0',
      borderBottom: '1px solid rgba(246,240,227,.10)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      color: i === 0 ? '#F6F0E3' : 'rgba(246,240,227,.6)'
    }
  }, v.version), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.45)'
    }
  }, i === 0 ? 'Current · from ' : 'From ', v.since))));
}
Object.assign(window, {
  EfficiencyScatter,
  ChargeCurve,
  NerdStat,
  FirmwareLog
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/odometer/Nerd.jsx", error: String((e && e.message) || e) }); }

// ui_kits/odometer/Panels.jsx
try { (() => {
const {
  Eyebrow,
  Plate,
  StatReadout,
  ProgressRule,
  Badge
} = window.RoadToAMillionDesignSystem_6606d4;

/* Every panel is a Plate. No rounding, no shadow, hairlines only. */

function Metric({
  label,
  value,
  unit,
  sub,
  size = 40
}) {
  return /*#__PURE__*/React.createElement(Plate, {
    tone: "ghost",
    pad: 26,
    style: {
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "bronze",
    size: 10,
    track: 0.22
  }, label), /*#__PURE__*/React.createElement(StatReadout, {
    value: value,
    unit: unit,
    size: size
  }), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, sub));
}

/* Sparkline of the last N days' distance. One hairline baseline, cyan bars,
   bronze label on the peak. No axes — the numbers carry the detail.
   Bars are selectable when the day has a route to show. */
function DistanceBars({
  days,
  activeKey,
  onSelect
}) {
  const max = Math.max(...days.map(d => d.km));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6,
      height: 96,
      borderBottom: '1px solid rgba(246,240,227,.18)'
    }
  }, days.map((d, i) => {
    const selectable = !!(onSelect && d.key);
    const active = !!(d.key && d.key === activeKey);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      title: d.label + ' · ' + d.km + ' km',
      onClick: selectable ? () => onSelect(d.key) : undefined,
      style: {
        flex: 1,
        height: Math.max(3, Math.round(d.km / max * 96)) + 'px',
        cursor: selectable ? 'pointer' : 'default',
        background: active ? '#00B4D9' : i === days.length - 1 ? 'rgba(0,180,217,.5)' : 'rgba(246,240,227,.28)'
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.45)'
    }
  }, /*#__PURE__*/React.createElement("span", null, days[0].label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#A47D51'
    }
  }, "peak ", max.toLocaleString(), " km"), /*#__PURE__*/React.createElement("span", null, days[days.length - 1].label)));
}

/* "Whitehorse, Yukon" → "Whitehorse". The province is repeated on both ends of
   a day far more often than not, so it is hoisted out rather than printed twice. */
const townOnly = s => String(s || '—').split(',')[0].trim();
const provinceOf = s => {
  const p = String(s || '').split(',');
  return p.length > 1 ? p[p.length - 1].trim() : '';
};
function routeLabel(from, to, fallback) {
  if (!from || !to || from === '—' || to === '—') return fallback || '—';
  const pf = provinceOf(from),
    pt = provinceOf(to);
  if (pf && pf === pt) return townOnly(from) + ' → ' + townOnly(to) + ' · ' + pt;
  return from + ' → ' + to;
}

/* The daily log — one row per day, town to town. Rows with a plotted route are
   selectable and drive the map above; rows still inside the location embargo
   read "—" and stay inert. */
function LogRow({
  day,
  date,
  province,
  from,
  to,
  km,
  note,
  plotted,
  active,
  onSelect
}) {
  const clickable = !!(plotted && onSelect);
  return /*#__PURE__*/React.createElement("div", {
    onClick: clickable ? onSelect : undefined,
    title: clickable ? 'Show this day on the map' : undefined,
    style: {
      display: 'grid',
      gridTemplateColumns: '90px 120px 1fr 110px',
      gap: 20,
      padding: '18px 14px',
      margin: '0 -14px',
      borderBottom: '1px solid rgba(246,240,227,.12)',
      alignItems: 'baseline',
      cursor: clickable ? 'pointer' : 'default',
      background: active ? 'rgba(0,180,217,.10)' : 'transparent',
      boxShadow: active ? 'inset 2px 0 0 #00B4D9' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: '#00B4D9'
    }
  }, day), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, date), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: active ? '#F6F0E3' : 'rgba(246,240,227,.78)'
    }
  }, routeLabel(from, to, province)), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: 'rgba(246,240,227,.55)'
    }
  }, note)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      textAlign: 'right',
      color: '#F6F0E3'
    }
  }, km, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#A47D51',
      fontSize: 11,
      letterSpacing: '.18em'
    }
  }, "KM")));
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
  const rank = {
    start: 0,
    end: 1,
    charge: 2
  };
  const ordered = [...stops].map((s, i) => ({
    s,
    i
  })).sort((a, b) => (rank[a.s.kind] ?? 3) - (rank[b.s.kind] ?? 3) || a.i - b.i);
  /* Markers are obstacles too — a label must not sit on a dot. */
  const taken = stops.map(s => ({
    x1: s.x * W - 11,
    x2: s.x * W + 11,
    y1: s.y * H - 11,
    y2: s.y * H + 11
  }));
  const hits = (a, b) => !(a.x2 < b.x1 || b.x2 < a.x1 || a.y2 < b.y1 || b.y2 < a.y1);
  const out = [];
  for (const {
    s
  } of ordered) {
    const text = townOnly(s.town).toUpperCase();
    if (!text || text === '—') continue;
    const w = text.length * CHAR_W;
    const cx = s.x * W,
      cy = s.y * H;
    const cands = [{
      dx: 0,
      dy: -16,
      a: 'middle'
    }, {
      dx: 0,
      dy: 24,
      a: 'middle'
    }, {
      dx: 13,
      dy: 4,
      a: 'start'
    }, {
      dx: -13,
      dy: 4,
      a: 'end'
    }, {
      dx: 13,
      dy: -13,
      a: 'start'
    }, {
      dx: -13,
      dy: -13,
      a: 'end'
    }, {
      dx: 13,
      dy: 20,
      a: 'start'
    }, {
      dx: -13,
      dy: 20,
      a: 'end'
    }, {
      dx: 0,
      dy: -30,
      a: 'middle'
    }, {
      dx: 0,
      dy: 38,
      a: 'middle'
    }];
    for (const c of cands) {
      const tx = cx + c.dx,
        ty = cy + c.dy;
      const x1 = c.a === 'middle' ? tx - w / 2 : c.a === 'start' ? tx : tx - w;
      const box = {
        x1,
        x2: x1 + w,
        y1: ty - 10,
        y2: ty + 4
      };
      if (box.x1 < 4 || box.x2 > W - 4 || box.y1 < 2 || box.y2 > H - 4) continue;
      if (taken.some(t => hits(t, box))) continue;
      taken.push(box);
      out.push({
        text,
        tx,
        ty,
        anchor: c.a
      });
      break;
    }
  }
  return out;
}
function DayMap({
  map
}) {
  const W = 720,
    H = 300;
  const pts = (map.path || []).map(([x, y]) => [x * W, y * H]);
  const plotted = pts.length > 1;
  const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const stops = map.stops || [];
  const labels = layoutLabels(stops, W, H);
  const kmPerPx = map.kmPerPx || 0;
  let barKm = 0;
  if (kmPerPx > 0) {
    for (const n of SCALE_STEPS) {
      if (n / kmPerPx <= W * 0.34) barKm = n;
    }
    if (!barKm) barKm = SCALE_STEPS[0];
  }
  const barPct = barKm ? barKm / kmPerPx / W * 100 : 0;
  return /*#__PURE__*/React.createElement(Plate, {
    tone: "ghost",
    pad: 26,
    style: {
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "bronze",
    size: 11,
    track: 0.24
  }, "Route \xB7 ", map.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.45)'
    }
  }, map.note || 'Town level · delayed 24h')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      border: plotted ? '1px solid rgba(246,240,227,.18)' : '1px dashed rgba(246,240,227,.22)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      width: '100%',
      height: 'auto',
      aspectRatio: W + ' / ' + H
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "rtam-grid",
    width: "48",
    height: "48",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M48 0H0v48",
    fill: "none",
    stroke: "rgba(246,240,227,.07)",
    strokeWidth: "1"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: W,
    height: H,
    fill: "url(#rtam-grid)"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: line,
    fill: "none",
    stroke: "#00B4D9",
    strokeWidth: "2.5"
  }), stops.map((s, i) => /*#__PURE__*/React.createElement("g", {
    key: 'm' + i
  }, s.kind === 'end' && /*#__PURE__*/React.createElement("circle", {
    cx: s.x * W,
    cy: s.y * H,
    r: 10,
    fill: "none",
    stroke: "rgba(246,240,227,.55)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: s.x * W,
    cy: s.y * H,
    r: s.kind === 'charge' ? 4 : 6,
    fill: s.kind === 'charge' ? '#1C242C' : '#00B4D9',
    stroke: "#00B4D9",
    strokeWidth: "2"
  }))), labels.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: 'l' + i,
    x: l.tx,
    y: l.ty,
    textAnchor: l.anchor,
    fill: "rgba(246,240,227,.82)",
    stroke: "#1C242C",
    strokeWidth: "4",
    strokeLinejoin: "round",
    style: {
      paintOrder: 'stroke',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '1.4px'
    }
  }, l.text))), !plotted && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      bottom: 10,
      fontSize: 9,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.35)'
    }
  }, "Awaiting the first closed day")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap',
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, barPct > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto',
      width: barPct + '%',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 9,
      background: 'rgba(246,240,227,.45)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'rgba(246,240,227,.45)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 9,
      background: 'rgba(246,240,227,.45)'
    }
  })), barPct > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, barKm.toLocaleString(), " km"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F6F0E3',
      whiteSpace: 'nowrap'
    }
  }, map.km.toLocaleString(), " km"), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, (map.chargeStops ?? stops.filter(s => s.kind === 'charge').length).toLocaleString(), " charge stops")));
}
/* The condensed day list that sits beside the map and drives it. Same rows as
   LogRow but stacked two-line so the whole window fits the map's height — the
   selection is useless if you have to scroll away from the map to use it. */
function DayList({
  rows,
  activeKey,
  onSelect,
  onLatest,
  following
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rtam-daylist",
    style: {
      border: '1px solid rgba(246,240,227,.18)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr)',
      maxHeight: 466
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      padding: '16px 18px',
      borderBottom: '1px solid rgba(246,240,227,.18)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "bronze",
    size: 10,
    track: 0.24
  }, "Daily log"), following ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.4)'
    }
  }, "Select a day") : /*#__PURE__*/React.createElement("button", {
    onClick: onLatest,
    style: {
      padding: '5px 10px',
      cursor: 'pointer',
      borderRadius: 0,
      background: 'transparent',
      color: '#00B4D9',
      border: '1px solid rgba(0,180,217,.5)',
      fontFamily: 'inherit',
      fontSize: 9,
      letterSpacing: '.16em',
      textTransform: 'uppercase'
    }
  }, "Latest")), /*#__PURE__*/React.createElement("div", {
    className: "rtam-daylist-rows",
    style: {
      overflowY: 'auto'
    }
  }, rows.map((r, i) => {
    const clickable = !!(r.plotted && onSelect);
    const active = !!(r.key && r.key === activeKey);
    return /*#__PURE__*/React.createElement("div", {
      key: r.key || i,
      className: "rtam-daylist-row",
      onClick: clickable ? () => onSelect(r.key) : undefined,
      title: clickable ? 'Show this day on the map' : 'No route yet for this day',
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto',
        gap: '5px 12px',
        padding: '13px 18px',
        borderBottom: '1px solid rgba(246,240,227,.10)',
        cursor: clickable ? 'pointer' : 'default',
        opacity: clickable ? 1 : 0.55,
        background: active ? 'rgba(0,180,217,.10)' : 'transparent',
        boxShadow: active ? 'inset 2px 0 0 #00B4D9' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        color: '#00B4D9'
      }
    }, r.day, " \xB7 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(246,240,227,.45)'
      }
    }, r.date)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        textAlign: 'right',
        color: '#F6F0E3'
      }
    }, r.km, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#A47D51',
        fontSize: 9,
        letterSpacing: '.16em'
      }
    }, "KM")), /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: '1 / -1',
        fontSize: 11,
        lineHeight: 1.5,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: active ? 'rgba(246,240,227,.85)' : 'rgba(246,240,227,.55)'
      }
    }, routeLabel(r.from, r.to, r.province)), r.note && /*#__PURE__*/React.createElement("div", {
      style: {
        gridColumn: '1 / -1',
        fontSize: 11,
        lineHeight: 1.55,
        color: 'rgba(246,240,227,.45)'
      }
    }, r.note));
  })));
}

/* Two readouts in one Plate — same footprint as Metric, split by a hairline. */
function SplitMetric({
  label,
  a,
  b,
  sub
}) {
  return /*#__PURE__*/React.createElement(Plate, {
    tone: "ghost",
    pad: 26,
    style: {
      gap: 14,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "bronze",
    size: 10,
    track: 0.22
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, [a, b].map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gap: 8,
      alignContent: 'start',
      paddingLeft: i ? 20 : 0,
      borderLeft: i ? '1px solid rgba(246,240,227,.18)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(StatReadout, {
    value: m.value,
    unit: m.unit || '',
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, m.label)))), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, sub));
}

/* Ron's Instagram posts. Reads the shape the fetch-instagram job writes:
   { id, permalink, thumb, caption, timestamp, type }. Renders as flat square
   tiles — hairline borders, no rounding, caption on hover only, so the grid
   reads as a contact sheet rather than a social widget. */
function PostGrid({
  posts,
  count = 6
}) {
  const slots = Array.from({
    length: count
  }, (_, i) => (posts || [])[i] || null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))',
      gap: 16
    }
  }, slots.map((p, i) => /*#__PURE__*/React.createElement("a", {
    key: p ? p.id : 'empty' + i,
    href: p ? p.permalink : undefined,
    target: "_blank",
    rel: "noreferrer",
    style: {
      position: 'relative',
      display: 'block',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      border: '1px solid rgba(246,240,227,.18)',
      background: 'rgba(246,240,227,.03)',
      cursor: p ? 'pointer' : 'default',
      textDecoration: 'none'
    }
  }, p && p.thumb ? /*#__PURE__*/React.createElement("img", {
    src: p.thumb,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      filter: 'saturate(.92)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      fontSize: 10,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.28)',
      textAlign: 'center',
      padding: 16
    }
  }, "Awaiting post"), p && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      gap: 6,
      padding: 14,
      background: 'linear-gradient(to top, rgba(28,36,44,.94) 0%, rgba(28,36,44,.55) 45%, rgba(28,36,44,0) 100%)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: '#00B4D9'
    }
  }, p.dateLabel || ''), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      lineHeight: 1.5,
      color: 'rgba(246,240,227,.82)',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, p.caption || '')))));
}
Object.assign(window, {
  Metric,
  SplitMetric,
  DistanceBars,
  LogRow,
  DayList,
  DayMap,
  PostGrid
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/odometer/Panels.jsx", error: String((e && e.message) || e) }); }

// ui_kits/odometer/data.js
try { (() => {
/* Illustrative figures — the shape the job writes, so the page renders complete
   before the live feed arrives. Real data replaces this at runtime. */
const RTAM_DAY_MAPS = [{
  key: '2026-10-16',
  day: 410,
  label: 'Day 410 · 16 Oct',
  km: 1082,
  from: 'Redding, California',
  to: 'Susanville, California',
  corridor: 'Susanville, California',
  chargeStops: 2,
  note: 'Town level · delayed 24h',
  kmPerPx: 1.24,
  path: [[0.1, 0.44], [0.3, 0.4], [0.52, 0.47], [0.74, 0.52], [0.9, 0.58]],
  stops: [{
    x: 0.1,
    y: 0.44,
    town: 'Redding',
    kind: 'start'
  }, {
    x: 0.52,
    y: 0.47,
    town: 'Red Bluff',
    kind: 'charge'
  }, {
    x: 0.9,
    y: 0.58,
    town: 'Susanville',
    kind: 'end'
  }]
}, {
  key: '2026-10-17',
  day: 411,
  label: 'Day 411 · 17 Oct',
  km: 806,
  from: 'Susanville, California',
  to: 'Fallon, Nevada',
  corridor: 'Fallon, Nevada',
  chargeStops: 1,
  note: 'Town level · delayed 24h',
  kmPerPx: 0.96,
  path: [[0.14, 0.3], [0.36, 0.4], [0.58, 0.52], [0.82, 0.66]],
  stops: [{
    x: 0.14,
    y: 0.3,
    town: 'Susanville',
    kind: 'start'
  }, {
    x: 0.58,
    y: 0.52,
    town: 'Reno',
    kind: 'charge'
  }, {
    x: 0.82,
    y: 0.66,
    town: 'Fallon',
    kind: 'end'
  }]
}, {
  key: '2026-10-18',
  day: 412,
  label: 'Day 412 · 18 Oct',
  km: 742,
  from: 'Fallon, Nevada',
  to: 'Ely, Nevada',
  corridor: 'Ely, Nevada',
  chargeStops: 2,
  note: 'Town level · delayed 24h',
  kmPerPx: 0.79,
  path: [[0.06, 0.62], [0.15, 0.58], [0.27, 0.55], [0.38, 0.6], [0.5, 0.52], [0.62, 0.5], [0.72, 0.44], [0.83, 0.42], [0.94, 0.36]],
  stops: [{
    x: 0.06,
    y: 0.62,
    town: 'Fallon',
    kind: 'start'
  }, {
    x: 0.38,
    y: 0.6,
    town: 'Austin',
    kind: 'charge'
  }, {
    x: 0.72,
    y: 0.44,
    town: 'Eureka',
    kind: 'charge'
  }, {
    x: 0.94,
    y: 0.36,
    town: 'Ely',
    kind: 'end'
  }]
}];
RTAM_DAY_MAPS.forEach(m => {
  m.plotted = true;
});

/* Illustrative nerd figures. Deterministic so the preview does not reshuffle
   on every reload — consumption rises as temperature falls, which is the shape
   the real data should show. */
const RTAM_PROVS = ['British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba', 'Yukon'];
const RTAM_POINTS = (() => {
  const out = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 190; i += 1) {
    const t = Number((-24 + rnd() * 52).toFixed(1));
    const wh = Math.round(152 + (18 - t) * 1.9 + (rnd() - 0.5) * 34);
    out.push({
      t,
      wh,
      km: Math.round(40 + rnd() * 420),
      prov: RTAM_PROVS[Math.floor(rnd() * RTAM_PROVS.length)]
    });
  }
  return out;
})();
const RTAM_WH = RTAM_POINTS.map(p => p.wh).sort((a, b) => a - b);
window.RTAM_DATA = {
  odometer: 418203,
  goal: 1000000,
  day: 412,
  province: 'Nevada',
  route: 'Ely, Nevada',
  today: 742,
  best: 1104,
  avgPerDay: 1015,
  chargeSessions: 3,
  chargeSupercharger: 2,
  chargeOther: 1,
  chargeLifetime: 1148,
  chargeLifetimeSupercharger: 902,
  chargeLifetimeOther: 246,
  locationEmbargoHours: 24,
  nerd: {
    efficiency: {
      points: RTAM_POINTS,
      median: RTAM_WH[Math.floor(RTAM_WH.length / 2)],
      best: RTAM_WH[0],
      worst: RTAM_WH[RTAM_WH.length - 1],
      provinces: RTAM_PROVS
    },
    autopilot: {
      km: 289640,
      pct: 69.3
    },
    energy: {
      used: 62451,
      added: 70118,
      overhead: 10.9,
      whPerKm: 149,
      kmPerKwh: 6.7,
      packKwh: 75,
      rangeEst: 503
    },
    cost: {
      total: 8214.55,
      supercharger: 6402.1,
      other: 1812.45,
      perKm: 0.02,
      sessions: 1102,
      currency: 'CAD'
    },
    chargeCurve: {
      points: [{
        soc: 10,
        kw: 244,
        n: 31
      }, {
        soc: 20,
        kw: 238,
        n: 74
      }, {
        soc: 30,
        kw: 205,
        n: 96
      }, {
        soc: 40,
        kw: 171,
        n: 88
      }, {
        soc: 50,
        kw: 140,
        n: 71
      }, {
        soc: 60,
        kw: 112,
        n: 63
      }, {
        soc: 70,
        kw: 86,
        n: 52
      }, {
        soc: 80,
        kw: 61,
        n: 44
      }, {
        soc: 90,
        kw: 38,
        n: 19
      }],
      sessions: 1148,
      note: 'Peak power per session, pooled by state of charge'
    },
    battery: {
      healthPct: 91.4,
      rangeNow: 458,
      rangeOriginal: 501
    },
    firmware: [{
      version: '2026.20.5',
      since: '2026-06-14'
    }, {
      version: '2026.26.2',
      since: '2026-07-29'
    }, {
      version: '2026.32.1',
      since: '2026-09-03'
    }]
  },
  dayMaps: RTAM_DAY_MAPS,
  dayMap: RTAM_DAY_MAPS[RTAM_DAY_MAPS.length - 1],
  days: [{
    key: '2026-10-11',
    label: 'D 405',
    km: 880
  }, {
    key: '2026-10-12',
    label: 'D 406',
    km: 1104
  }, {
    key: '2026-10-13',
    label: 'D 407',
    km: 640
  }, {
    key: '2026-10-14',
    label: 'D 408',
    km: 0
  }, {
    key: '2026-10-15',
    label: 'D 409',
    km: 955
  }, {
    key: '2026-10-16',
    label: 'D 410',
    km: 1082
  }, {
    key: '2026-10-17',
    label: 'D 411',
    km: 806
  }, {
    key: '2026-10-18',
    label: 'D 412',
    km: 742
  }],
  log: [{
    key: '2026-10-18',
    day: 'Day 412',
    date: '18 Oct',
    province: 'Nevada',
    from: 'Fallon, Nevada',
    to: 'Ely, Nevada',
    plotted: true,
    km: '742',
    note: 'US-50 East. Third charge stop at Austin took 41 minutes — the only one on the route.'
  }, {
    key: '2026-10-17',
    day: 'Day 411',
    date: '17 Oct',
    province: 'Nevada',
    from: 'Susanville, California',
    to: 'Fallon, Nevada',
    plotted: true,
    km: '806',
    note: 'Crossed from California at Stateline.'
  }, {
    key: '2026-10-16',
    day: 'Day 410',
    date: '16 Oct',
    province: 'California',
    from: 'Redding, California',
    to: 'Susanville, California',
    plotted: true,
    km: '1,082',
    note: ''
  }, {
    key: '2026-10-15',
    day: 'Day 409',
    date: '15 Oct',
    province: 'California',
    from: 'Eureka, California',
    to: 'Redding, California',
    km: '955',
    note: 'Front tyres swapped at 415,000 km. Fourth set.'
  }, {
    key: '2026-10-14',
    day: 'Day 408',
    date: '14 Oct',
    province: 'Oregon',
    from: 'Coos Bay, Oregon',
    to: 'Coos Bay, Oregon',
    km: '0',
    note: 'Off the road — rear motor inspection.'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/odometer/data.js", error: String((e && e.message) || e) }); }

// ui_kits/odometer/job/fetch-instagram.mjs
try { (() => {
/* Pulls Ron's recent Instagram posts and writes instagram.json.
 *
 * Runs on the same private timer as the odometer job. Reads IG_TOKEN and
 * IG_USER_ID from the environment. Requires a Business or Creator account
 * connected to a Meta app — personal accounts have no API.
 *
 * The token is a long-lived user token and expires 60 days after it is issued.
 * Nothing here renews it: a GitHub Action cannot write back to its own secrets
 * without a PAT, so a refreshed token would have nowhere to go. Put a reminder
 * in the calendar for day 50 and regenerate it by hand. If it does lapse, this
 * step fails on its own (continue-on-error) and the odometer keeps running.
 * See SETUP.md.
 *
 * Local test:  IG_TOKEN=… IG_USER_ID=… node job/fetch-instagram.mjs
 */

const COUNT = 6;
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
async function main() {
  const {
    writeFile
  } = await import('node:fs/promises');
  const TOKEN = process.env.IG_TOKEN;
  const USER = process.env.IG_USER_ID;
  const OUT = process.env.IG_OUT || 'instagram.json';
  if (!TOKEN || !USER) {
    console.error('Missing IG_TOKEN or IG_USER_ID');
    process.exit(1);
  }
  const url = `https://graph.instagram.com/v21.0/${USER}/media` + `?fields=${FIELDS}&limit=${COUNT}&access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`instagram → ${res.status} ${res.statusText} ${body.slice(0, 300)}`);
  }
  const {
    data = []
  } = await res.json();
  const posts = data.slice(0, COUNT).map(m => ({
    id: m.id,
    permalink: m.permalink,
    /* Videos expose a poster frame instead of media_url. */
    thumb: m.media_type === 'VIDEO' ? m.thumbnail_url || null : m.media_url || null,
    type: m.media_type,
    caption: (m.caption || '').split('\n')[0].slice(0, 180),
    timestamp: m.timestamp,
    dateLabel: m.timestamp ? new Date(m.timestamp).toLocaleDateString('en-CA', {
      day: 'numeric',
      month: 'short'
    }) : ''
  }));
  await writeFile(OUT, JSON.stringify({
    posts,
    fetchedAt: new Date().toISOString()
  }, null, 2));
  console.log(`wrote ${OUT} — ${posts.length} posts`);
}
main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/odometer/job/fetch-instagram.mjs", error: String((e && e.message) || e) }); }

// ui_kits/odometer/job/fetch-snapshot.mjs
try { (() => {
/* The helper. Runs on a private timer — never in the web tier.
 * Reads TESSIE_TOKEN + TESSIE_VIN from the environment, calls Tessie, and
 * writes the embargoed, town-rounded snapshot to odometer.json.
 *
 * Also maintains history.json — the small set of facts Tessie reports only as
 * "now" and never retroactively. Today that is the firmware version. The file
 * is committed alongside odometer.json and grows by a line every few weeks.
 *
 * Local test:  TESSIE_TOKEN=… TESSIE_VIN=… node job/fetch-snapshot.mjs
 */

async function main() {
  const {
    writeFile,
    readFile
  } = await import('node:fs/promises');
  const {
    shape
  } = await import('../tessie.js');
  const TOKEN = process.env.TESSIE_TOKEN;
  const VIN = process.env.TESSIE_VIN;
  const OUT = process.env.OUT || 'odometer.json';
  const HIST = process.env.HISTORY || 'history.json';
  if (!TOKEN || !VIN) {
    console.error('Missing TESSIE_TOKEN or TESSIE_VIN');
    process.exit(1);
  }
  const H = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/json'
  };
  const q = 'distance_format=km&timezone=America/Winnipeg';
  const get = async path => {
    const res = await fetch(`https://api.tessie.com/${VIN}/${path}`, {
      headers: H
    });
    if (!res.ok) throw new Error(`${path} → ${res.status} ${res.statusText}`);
    return res.json();
  };
  /* Optional endpoints must never take the odometer down with them. */
  const soft = path => get(path).catch(e => {
    console.warn(`${path} unavailable:`, e.message);
    return null;
  });
  const [state, drives, charges, health] = await Promise.all([get('state'), get(`drives?${q}&limit=400`), soft(`charges?${q}&limit=2000`), soft('battery_health')]);
  const chargeList = charges ? charges.results || charges : [];

  /* history.json is append-only and must survive a failed read — losing it
     would silently reset the firmware log to empty and commit that. */
  let history = {
    firmware: []
  };
  try {
    const raw = await readFile(HIST, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.firmware)) history = parsed;
  } catch (e) {
    console.warn('history.json not read, starting fresh:', e.message);
  }
  const version = state && (state.car_version || state.vehicle_state && state.vehicle_state.car_version) || null;
  if (version) {
    const clean = String(version).split(' ')[0];
    const latest = history.firmware[history.firmware.length - 1];
    if (!latest || latest.version !== clean) {
      history.firmware.push({
        version: clean,
        since: new Date().toISOString().slice(0, 10)
      });
      console.log(`firmware recorded: ${clean}`);
    }
  }
  const snapshot = shape({
    state,
    drives: drives.results || drives,
    charges: chargeList,
    health,
    history
  });
  await writeFile(OUT, JSON.stringify(snapshot, null, 2));
  await writeFile(HIST, JSON.stringify(history, null, 2));
  if (!snapshot.odometer) console.warn('WARNING: odometer read as 0 — check the /state payload shape');
  if (snapshot.day === null) console.warn('WARNING: day index null — DEPARTURE in tessie.js is not a valid date');
  if (!snapshot.nerd.efficiency.points.length) console.warn('NOTE: no efficiency points — check the drives payload carries energy and outside temperature');
  console.log(`wrote ${OUT} — odometer ${snapshot.odometer} km, as at ${snapshot.asOf}`);
}
main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/odometer/job/fetch-snapshot.mjs", error: String((e && e.message) || e) }); }

// ui_kits/odometer/tessie.js
try { (() => {
/* Tessie → RTAM_DATA adapter.
 *
 * This file does NOT run in the design system — the kit loads data.js (static
 * figures) so the card renders without a network call. Point the kit at this
 * file instead when you deploy the dashboard to the site.
 *
 * SECURITY MODEL — the website never touches Tessie.
 * A Tessie access token is a single full-access credential; there is no
 * read-only token. So the public site is not given one. Instead a scheduled job
 * (cron / GitHub Action / Lambda) runs `shape()` against Tessie and writes a
 * static odometer.json to the CDN. The site fetches that file and nothing else.
 * A total compromise of the website yields a stale JSON file — there is no
 * credential there to steal and no path from the browser to the car.
 *
 * Belt and braces, configured outside this repo:
 *   Do not install Tessie's Tesla Virtual Key on the car. 2021+ vehicles
 *   require signed commands; without the key paired, commands are rejected by
 *   the car itself. (This also disables Tessie's in-app remote controls.)
 *   Note: Tessie usually does NOT appear under tesla.com → third-party apps,
 *   because it connects via the fleet integration — there is no scope toggle
 *   there to rely on, which is why the Virtual Key is the real control.
 *
 * DRIVER SAFETY — locations are embargoed on their own clock.
 * Distance may run live; anything that reveals a PLACE is held back at least
 * LOCATION_EMBARGO_HOURS (24, floored) and rounded to town, so
 * the dashboard can never be used to find the car or the driver. Nothing that
 * reveals a current position leaves this file: the odometer is reconstructed as
 * at the cutoff rather than read live, because a live reading plus a known
 * route is itself a position. Do not "fix" that by using state.odometer
 * directly.
 *
 * Field names below follow developer.tessie.com and are confirmed against a
 * live account: timestamps arrive as Unix SECONDS and the /state odometer is
 * nested and in miles. See toDate() and odometerKm().
 */

const ENDPOINT = '/odometer.json';
const REFRESH_MS = 15 * 60 * 1000;

/* SPLIT EMBARGO. Two clocks, deliberately different.
 *
 *   EMBARGO_HOURS          — the DISTANCE clock. Settable via env (0 = live).
 *   LOCATION_EMBARGO_HOURS — the LOCATION clock. Floored at 24, always.
 *
 * Distance figures (odometer, daily km, charge counts) publish on the first
 * clock, so they can run live. Anything that says WHERE — towns, provinces,
 * the plotted route — publishes on the second, which no env var can pull below
 * 24 hours. Setting EMBARGO_HOURS=0 now makes the numbers live and leaves the
 * map a day behind, rather than blanking the map. The web tier never reads
 * either value; only the job does. */
const ENV = typeof process !== 'undefined' && process.env || {};
/* An unset GitHub Actions variable arrives as '', and Number('') is 0 — which
   would silently disable the embargo. Anything unparseable falls back to 24. */
const RAW_EMBARGO = ENV.EMBARGO_HOURS;
const PARSED_EMBARGO = RAW_EMBARGO === undefined || String(RAW_EMBARGO).trim() === '' ? 24 : Number(RAW_EMBARGO);
const EMBARGO_HOURS = Number.isFinite(PARSED_EMBARGO) ? Math.max(0, PARSED_EMBARGO) : 24;
/* Hard floor. Deliberately not derived from EMBARGO_HOURS — a location is the
   one field that can put a person in danger, so it does not take instruction
   from configuration. Raise it here if you want a longer hold; it cannot go
   below 24 from outside this file. */
const LOCATION_EMBARGO_HOURS = Math.max(24, EMBARGO_HOURS);
const LIVE_KM = EMBARGO_HOURS < 24;
const DEPARTURE = '2026-09-02'; // day 1 — Ron departed the morning of Sept 2, 2026
const GOAL = 1000000;
/* How many days get a plotted route. Every plotted day costs ~500 bytes in
   odometer.json, so this is a rolling window rather than the whole trip —
   at 1,000 days the file would otherwise pass half a megabyte. Older days
   keep their log row and their distance, they just stop being clickable. */
const MAP_DAYS = 30;
/* How many days the log lists. */
const LOG_DAYS = 10;

/* --- the scheduled job ----------------------------------------------------
 * Runs somewhere private on a timer. Never in the web tier.
 *
 *   import { shape } from './tessie.js';
 *
 *   const H = { Authorization: `Bearer ${process.env.TESSIE_TOKEN}` };
 *   const VIN = process.env.TESSIE_VIN;
 *   const q = 'distance_format=km&timezone=America/Winnipeg';
 *
 *   const state  = await fetch(`https://api.tessie.com/${VIN}/state`, { headers: H }).then(r => r.json());
 *   const drives = await fetch(`https://api.tessie.com/${VIN}/drives?${q}&limit=200`, { headers: H }).then(r => r.json());
 *
 *   await putToCdn('odometer.json', JSON.stringify(shape({ state, drives: drives.results })));
 *
 * Only these two GET paths are ever called. If you would rather run a live
 * proxy route than a snapshot job, allowlist those two paths explicitly so a
 * bug cannot turn the route into a general Tessie passthrough.
 * ------------------------------------------------------------------------ */

const TZ = 'America/Winnipeg';
const MI_TO_KM = 1.609344;
const km = n => Math.round(n || 0);

/* Tessie sends timestamps as Unix SECONDS, not ISO strings. Everything that
   touches a date goes through here — a raw `new Date(d.started_at)` yields
   1970 and every derived label reads NaN. */
function toDate(v) {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' || /^\d+$/.test(String(v))) {
    const n = Number(v);
    return new Date(n < 1e12 ? n * 1000 : n);
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/* Local calendar day, not UTC — a 9pm drive belongs to that evening. */
function dayKey(v) {
  const d = toDate(v);
  return d ? d.toLocaleDateString('en-CA', {
    timeZone: TZ
  }) : null;
}

/* Format a YYYY-MM-DD day key for display. Built from parts on purpose —
   new Date('2026-09-02') is UTC midnight, which renders as Sep 1 in Winnipeg. */
function fmtDayKey(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Date(y, m - 1, d).toLocaleDateString('en-CA', {
    day: 'numeric',
    month: 'short'
  });
}
function dayIndex(v) {
  const d = toDate(v);
  if (!d) return null;
  return Math.floor((d - new Date(DEPARTURE)) / 864e5) + 1;
}

/* Tessie mirrors Tesla's payload, where the odometer is nested and in MILES.
   Prefer an explicitly-km field if one appears; otherwise convert. */
function odometerKm(state) {
  const s = state || {};
  const v = s.vehicle_state || {};
  const candidates = [[s.odometer_km, 'km'], [v.odometer_km, 'km'], [s.odometer, 'mi'], [v.odometer, 'mi']];
  for (const [val, unit] of candidates) {
    if (typeof val === 'number' && val > 0) return unit === 'km' ? val : val * MI_TO_KM;
  }
  return 0;
}

/* "1240 18th St, Brandon, Manitoba R7A 7S1, Canada" → "Brandon, Manitoba".
   Drops the street line, the country, and the postal code — a postal code is a
   few blocks, which defeats the point of rounding to a town. */
/* Reverse geocoding on a remote stretch often returns the road rather than a
   settlement — "Alaska Highway Frontage Road, British Columbia". A road name is
   not a town and reads as noise on the map, so it is dropped in favour of
   whatever comes after it. */
const ROADISH = /\b(highway|hwy|freeway|expressway|frontage|road|rd|route|rte|street|ave|avenue|drive|lane|boulevard|blvd|trail|parkway|pkwy|access|service)\b/i;
function town(loc) {
  if (!loc) return '—';
  let parts = String(loc).split(',').map(s => s.trim()).filter(Boolean);
  parts = parts.filter(p => !/^(canada|usa|u\.s\.a\.|united states|mexico)$/i.test(p));
  if (parts.length > 2 || /^\d/.test(parts[0] || '')) parts = parts.slice(1);
  parts = parts.map(p => p.replace(/\s+[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d$/, '').replace(/\s+\d{5}(-\d{4})?$/, '').trim());
  while (parts.length > 1 && ROADISH.test(parts[0])) parts = parts.slice(1);
  return parts.filter(Boolean).join(', ') || '—';
}

/* Tessie returns one record per drive; the dashboard wants one per day.
   Sorted before folding so `starting` is genuinely the day's first departure
   and `ending` its last arrival — the records do not arrive in order. */
function byDay(drives) {
  const acc = new Map();
  const ordered = [...(drives || [])].sort((a, b) => (toDate(a.started_at) || 0) - (toDate(b.started_at) || 0));
  for (const d of ordered) {
    const key = dayKey(d.started_at);
    if (!key) continue;
    const row = acc.get(key) || {
      date: key,
      km: 0,
      drives: 0,
      energy: 0,
      autopilot: 0,
      starting: null,
      ending: null
    };
    row.km += d.odometer_distance || 0;
    row.energy += d.energy_used || 0;
    row.autopilot += d.autopilot_distance || 0;
    row.drives += 1;
    if (row.starting === null) row.starting = d.starting_location || null;
    row.ending = d.ending_location || row.ending;
    acc.set(key, row);
  }
  return [...acc.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/* Tessie flags Tesla-network sessions with a boolean; the text fields are a
   fallback for records that predate it or come from a different shape. Checked
   in order of reliability \u2014 an explicit false is respected, not overridden. */
function isSupercharger(c) {
  if (!c) return false;
  for (const key of ['is_supercharger', 'supercharger', 'is_tesla_charger']) {
    if (typeof c[key] === 'boolean') return c[key];
  }
  const text = [c.location, c.site_name, c.site, c.charger_type, c.network, c.address, c.name, c.fast_charger_brand, c.conn_charge_cable].filter(Boolean).join(' ');
  if (/supercharg|tesla/i.test(text)) return true;
  /* A DC fast charge on the Tesla cable is a Supercharger in practice. */
  if (c.is_fast_charger === true && /tesla|tpc/i.test(text)) return true;
  return false;
}

/* Charge sessions, split Tesla-network vs everything else. Published sessions
   only — anything inside the embargo window is held with the drives. */
function chargeCounts(charges, cutoff, targetDay) {
  const out = {
    day: 0,
    daySc: 0,
    dayOther: 0,
    life: 0,
    lifeSc: 0,
    lifeOther: 0,
    lastDay: targetDay || null
  };
  const published = (charges || []).filter(c => {
    const d = toDate(c.started_at);
    return d && d <= cutoff;
  });
  for (const c of published) {
    out.life += 1;
    if (isSupercharger(c)) out.lifeSc += 1;else out.lifeOther += 1;
  }
  if (!targetDay) return out;
  for (const c of published.filter(c => dayKey(c.started_at) === targetDay)) {
    out.day += 1;
    if (isSupercharger(c)) out.daySc += 1;else out.dayOther += 1;
  }
  return out;
}

/* Town-level rounding for plotted coordinates. 0.05° is roughly 5km — enough
   to draw the day's corridor, far too coarse to locate a car. Applied BEFORE
   anything is normalised, so full-precision coordinates never leave here. */
const GRID = 0.05;
const snap = n => Math.round(n / GRID) * GRID;
function coords(o, prefix) {
  const lat = o[prefix + 'latitude'] ?? o.latitude;
  const lon = o[prefix + 'longitude'] ?? o.longitude;
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;
  if (!lat && !lon) return null;
  return [snap(lat), snap(lon)];
}

/* The viewBox DayMap draws into. Projection needs these to keep one scale on
   both axes, so they live here and must match Panels.jsx. */
const VB_W = 720,
  VB_H = 300,
  PAD = 0.08,
  DEG_KM = 111.0;

/* Project one day's drives into the normalised 0–1 points DayMap plots.

   EQUAL SCALE ON BOTH AXES. An earlier version normalised lat and lon
   independently, which made every day fill the frame regardless of length —
   fine for a single latest-day panel, wrong the moment days can be compared.
   One px-per-degree factor is used for both axes and reported back as
   kmPerPx, so the panel can draw an honest scale bar and a 90km day reads as
   visibly smaller than a 1,300km one.

   Callers must pass only location-embargoed drives — this function does not
   police the clock, it just draws what it is handed. */
function projectDay(drives, charges, targetDay) {
  const empty = {
    path: [],
    stops: [],
    kmPerPx: 0
  };
  if (!targetDay) return empty;
  const dayDrives = (drives || []).filter(d => dayKey(d.started_at) === targetDay).sort((a, b) => (toDate(a.started_at) || 0) - (toDate(b.started_at) || 0));
  if (!dayDrives.length) return empty;
  const raw = [];
  for (const d of dayDrives) {
    const s = coords(d, 'starting_');
    const e = coords(d, 'ending_');
    if (s) raw.push({
      ll: s,
      town: town(d.starting_location)
    });
    if (e) raw.push({
      ll: e,
      town: town(d.ending_location)
    });
  }
  /* Snapping collapses consecutive points inside the same 5km cell. */
  const pts = raw.filter((p, i) => !i || p.ll[0] !== raw[i - 1].ll[0] || p.ll[1] !== raw[i - 1].ll[1]);
  if (pts.length < 2) return empty;
  const lats = pts.map(p => p.ll[0]);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  /* Equirectangular: squeeze longitude by cos(lat) so a degree east covers the
     same ground as a degree north at this latitude. y inverted — north is up. */
  const kx = Math.cos(midLat * Math.PI / 180);
  const mu = ll => [ll[1] * kx, -ll[0]];
  const units = pts.map(p => mu(p.ll));
  const xs = units.map(m => m[0]),
    ys = units.map(m => m[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  /* Floor matches the 5km snap grid — below it the points are one cell and
     there is nothing real left to magnify. */
  const FLOOR = GRID;
  const boxW = Math.max(maxX - minX, FLOOR),
    boxH = Math.max(maxY - minY, FLOOR);
  const midX = (minX + maxX) / 2,
    midY = (minY + maxY) / 2;
  /* One factor, both axes: px per degree, whichever axis is tighter. */
  const k = Math.min(VB_W * (1 - PAD * 2) / boxW, VB_H * (1 - PAD * 2) / boxH);
  const at = m => [Number((0.5 + (m[0] - midX) * k / VB_W).toFixed(4)), Number((0.5 + (m[1] - midY) * k / VB_H).toFixed(4))];
  const path = units.map(at);

  /* One marker per place. Start and end are placed first so they always win;
     a charge in a town already on the map is counted in chargeStops but does
     not earn a second pin — three "FORT NELSON" labels stacked on each other
     is what this prevents. Coordinates are checked too, since two towns can
     snap into the same 5km cell. */
  const stops = [];
  const coordSeen = new Set(),
    townSeen = new Set();
  const add = (p, kind) => {
    const [x, y] = at(mu(p.ll));
    const ck = x + ',' + y;
    const tk = String(p.town || '').trim().toLowerCase();
    if (coordSeen.has(ck)) return;
    if (tk && tk !== '—' && townSeen.has(tk)) return;
    coordSeen.add(ck);
    if (tk && tk !== '—') townSeen.add(tk);
    stops.push({
      x,
      y,
      town: p.town || '—',
      kind
    });
  };
  add(pts[0], 'start');
  add(pts[pts.length - 1], 'end');

  /* Charge stops for the day, snapped and matched to the nearest path point so
     a marker always sits on the drawn line. */
  for (const c of (charges || []).filter(c => dayKey(c.started_at) === targetDay)) {
    const ll = coords(c, 'starting_');
    if (!ll) continue;
    const near = pts.reduce((best, p) => {
      const dist = Math.hypot(p.ll[0] - ll[0], p.ll[1] - ll[1]);
      return !best || dist < best.dist ? {
        p,
        dist
      } : best;
    }, null);
    if (near && near.dist < 0.6) add({
      ll: near.p.ll,
      town: town(c.location) || near.p.town
    }, 'charge');
  }
  return {
    path,
    stops,
    kmPerPx: Number((DEG_KM / k).toFixed(4))
  };
}

/* Tessie mirrors Tesla's field names, which have drifted across firmware and
   are not identical between the drives and charges payloads. Every optional
   figure is read through this rather than a single hard-coded key, so a
   renamed field degrades to "no data" instead of NaN on the page. */
function pick(obj, keys) {
  for (const k of keys) {
    const v = obj && obj[k];
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}
const F_OUTSIDE_TEMP = ['average_outside_temperature', 'outside_temp', 'outside_temperature', 'avg_outside_temp'];
const F_ENERGY_USED = ['energy_used', 'energy_used_kwh', 'kwh_used'];
const F_ENERGY_ADDED = ['energy_added', 'charge_energy_added', 'energy_added_kwh'];
const F_COST = ['cost', 'total_cost', 'charge_cost'];
const F_SOC_END = ['ending_battery', 'end_battery_level', 'battery_level_end', 'ending_battery_level'];
const F_SOC_START = ['starting_battery', 'start_battery_level', 'battery_level_start', 'starting_battery_level'];
const F_POWER = ['max_charger_power', 'charger_power', 'peak_power_kw'];

/* Everything the nerd section reads. Built from the payloads already fetched
   for the odometer \u2014 no extra Tessie calls except battery health, which the
   job passes in. Anything naming a place is built from locPublished, so the
   province colouring on the scatter is 24h behind like every other location. */
function nerdBlock({
  published,
  locPublished,
  charges,
  health,
  history
}) {
  const chargeList = charges || [];

  /* Efficiency. One dot per drive: outside temperature against Wh/km, coloured
     by province. Short hops are dropped \u2014 under 5km the figure is dominated by
     start-up draw and says nothing about the drive. */
  const points = [];
  for (const d of locPublished) {
    const km2 = d.odometer_distance || 0;
    const kwh = pick(d, F_ENERGY_USED);
    const t = pick(d, F_OUTSIDE_TEMP);
    if (km2 < 5 || kwh === null || kwh <= 0 || t === null) continue;
    points.push({
      t: Number(t.toFixed(1)),
      wh: Math.round(kwh * 1000 / km2),
      km: km(km2),
      prov: town(d.ending_location).split(',').pop().trim() || '\u2014'
    });
  }
  /* Newest last, capped \u2014 the whole trip's drives would eventually dominate
     the file, and the pattern is legible long before then. */
  const scatter = points.slice(-600);
  const whVals = scatter.map(p => p.wh).sort((a, b) => a - b);
  const median = whVals.length ? whVals[Math.floor(whVals.length / 2)] : 0;

  /* Autopilot and energy totals run on the distance clock \u2014 no place in them. */
  let apKm = 0,
    totalKm = 0,
    usedKwh = 0;
  for (const d of published) {
    totalKm += d.odometer_distance || 0;
    apKm += d.autopilot_distance || 0;
    const e = pick(d, F_ENERGY_USED);
    if (e !== null && e > 0) usedKwh += e;
  }
  let addedKwh = 0,
    cost = 0,
    costSc = 0,
    costOther = 0,
    costed = 0;
  /* Usable pack size, measured rather than assumed. A session that moved the
     battery a long way gives energy added per percent; the median across such
     sessions is a far better figure than a spec-sheet number, and it needs no
     guess about which Model 3 this is. Short top-ups are excluded — taper and
     rounding make them wildly inaccurate. */
  const packSamples = [];
  const curve = new Map(); // state of charge bucket -> [kW samples]
  for (const c of chargeList) {
    const a = pick(c, F_ENERGY_ADDED);
    if (a !== null && a > 0) addedKwh += a;
    const money = pick(c, F_COST);
    if (money !== null && money > 0) {
      cost += money;
      costed += 1;
      if (isSupercharger(c)) costSc += money;else costOther += money;
    }
    /* Aggregate charge curve. A session summary gives one peak-power reading at
       one state of charge, so a single session is a dot, not a curve \u2014 pooled
       across every session the shape of the taper appears. Bucketed in 5% steps. */
    const soc = pick(c, F_SOC_END);
    const kw = pick(c, F_POWER);
    if (soc !== null && kw !== null && kw > 0) {
      const b = Math.round(soc / 5) * 5;
      if (!curve.has(b)) curve.set(b, []);
      curve.get(b).push(kw);
    }
    const soc0 = pick(c, F_SOC_START);
    if (a !== null && a > 0 && soc !== null && soc0 !== null && soc - soc0 >= 20) {
      packSamples.push(a / (soc - soc0) * 100);
    }
  }
  packSamples.sort((x, y) => x - y);
  const packKwh = packSamples.length ? packSamples[Math.floor(packSamples.length / 2)] : null;
  const curvePoints = [...curve.entries()].map(([soc, vals]) => ({
    soc,
    kw: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    n: vals.length
  })).sort((a, b) => a.soc - b.soc);
  return {
    efficiency: {
      points: scatter,
      median,
      best: whVals.length ? whVals[0] : 0,
      worst: whVals.length ? whVals[whVals.length - 1] : 0,
      /* Distinct provinces present, so the legend is built from the data. */
      provinces: [...new Set(scatter.map(p => p.prov))].filter(p => p && p !== '\u2014')
    },
    autopilot: {
      km: km(apKm),
      pct: totalKm > 0 ? Number((apKm / totalKm * 100).toFixed(1)) : 0
    },
    energy: {
      used: Math.round(usedKwh),
      added: Math.round(addedKwh),
      /* Charging losses and preconditioning \u2014 added is always the larger. */
      overhead: addedKwh > 0 && usedKwh > 0 ? Number(((addedKwh - usedKwh) / addedKwh * 100).toFixed(1)) : null,
      whPerKm: totalKm > 0 && usedKwh > 0 ? Math.round(usedKwh * 1000 / totalKm) : 0,
      /* Plain-language translation of Wh/km for readers who don't think in it.
         Range is only offered when the pack size was actually measured. */
      kmPerKwh: totalKm > 0 && usedKwh > 0 ? Number((totalKm / usedKwh).toFixed(1)) : 0,
      packKwh: packKwh ? Math.round(packKwh) : null,
      rangeEst: packKwh && totalKm > 0 && usedKwh > 0 ? Math.round(packKwh / (usedKwh / totalKm)) : null
    },
    cost: {
      total: Number(cost.toFixed(2)),
      supercharger: Number(costSc.toFixed(2)),
      other: Number(costOther.toFixed(2)),
      perKm: totalKm > 0 && cost > 0 ? Number((cost / totalKm).toFixed(3)) : 0,
      /* How many sessions actually carried a price \u2014 free chargers and missing
         invoices both show as no cost, and the average lies without this. */
      sessions: costed,
      currency: 'CAD'
    },
    chargeCurve: {
      points: curvePoints,
      sessions: chargeList.length,
      note: 'Peak power per session, pooled by state of charge'
    },
    battery: (() => {
      /* Tessie wraps some endpoints in `results` and the health payload's key
         names vary; normalise here so the panel has no guessing to do. */
      const hb = health && (health.results || health);
      if (!hb || typeof hb !== 'object') return null;
      const healthPct = pick(hb, ['battery_health', 'health', 'health_percent', 'state_of_health']);
      const rangeNow = pick(hb, ['max_range', 'current_max_range', 'rated_range']);
      const rangeOriginal = pick(hb, ['original_max_range', 'original_range', 'as_new_max_range']);
      const degradation = pick(hb, ['degradation', 'degradation_percent']);
      const derived = healthPct !== null ? healthPct : degradation !== null ? 100 - degradation : rangeNow && rangeOriginal ? Number((rangeNow / rangeOriginal * 100).toFixed(1)) : null;
      if (derived === null && rangeNow === null) return null;
      return {
        healthPct: derived,
        rangeNow,
        rangeOriginal
      };
    })(),
    firmware: history && history.firmware || []
  };
}
function shape({
  state,
  drives,
  charges,
  health,
  history
}) {
  const all = drives || [];
  const now = Date.now();
  const cutoff = now - EMBARGO_HOURS * 36e5;
  const locCutoff = now - LOCATION_EMBARGO_HOURS * 36e5;

  /* Split at the distance line. Held drives are never published as km — they
     are kept only to walk the live odometer back to the cutoff. */
  const at = d => toDate(d.ended_at || d.started_at);
  const published = all.filter(d => {
    const t = at(d);
    return t && t <= cutoff;
  });
  const held = all.filter(d => {
    const t = at(d);
    return t && t > cutoff;
  });
  const heldKm = held.reduce((s, d) => s + (d.odometer_distance || 0), 0);

  /* Split again, later, for anything that reveals a place. */
  const locPublished = all.filter(d => {
    const t = at(d);
    return t && t <= locCutoff;
  });
  const days = byDay(published);
  const locDays = byDay(locPublished);
  /* Which day keys may show a place at all, and the whole row so the log can
     name both ends of the day. A day appears here as soon as some of it clears
     the location window; the locations it carries are drawn from those cleared
     drives, so they are never fresher than the window. */
  const placeOf = new Map(locDays.map(d => [d.date, d]));

  /* The dashboard is about the challenge, not the car's whole history. Days
     before departure are dropped — otherwise they render as "Day -15". The
     lifetime odometer stays lifetime; only the daily figures are trip-scoped. */
  const trip = days.filter(d => (dayIndex(d.date) || 0) >= 1);
  const recent = trip.slice(-30);
  const last = trip[trip.length - 1] || null;
  const dayNo = last ? dayIndex(last.date) : 0;

  /* Position comes from the last location-embargoed drive whatever its date, so
     the location box isn't blank before day 1 closes. Town-rounded, and at
     least LOCATION_EMBARGO_HOURS old by construction. */
  const position = locDays[locDays.length - 1] || {
    date: null,
    starting: null,
    ending: null
  };
  const locTrip = locDays.filter(d => (dayIndex(d.date) || 0) >= 1);
  const mapDay = locTrip[locTrip.length - 1] || null;
  const odometer = km(odometerKm(state) - heldKm);
  const driving = trip.filter(d => d.km > 0);
  const ch = chargeCounts(charges, cutoff, last ? last.date : null);
  /* Charge STOPS are plotted, so the maps are built off the location clock and
     the location-side drives — never off `last`, which may be today. One entry
     per day in the rolling window, oldest first, so the page can let the reader
     click back through the trip. */
  const dayMaps = locTrip.slice(-MAP_DAYS).map(d => {
    const g = projectDay(locPublished, charges, d.date);
    return {
      key: d.date,
      day: dayIndex(d.date),
      label: 'Day ' + dayIndex(d.date) + ' \u00b7 ' + fmtDayKey(d.date),
      km: km(d.km),
      from: town(d.starting),
      to: town(d.ending),
      corridor: town(d.ending),
      /* Counted from the charge records, not the plotted markers — a session
         without coordinates still counts but never gets a pin. */
      chargeStops: chargeCounts(charges, locCutoff, d.date).day,
      note: 'Town level \u00b7 delayed ' + LOCATION_EMBARGO_HOURS + 'h',
      path: g.path,
      stops: g.stops,
      /* km per viewBox pixel — what the panel's scale bar is drawn from. */
      kmPerPx: g.kmPerPx,
      plotted: g.path.length > 1 || undefined
    };
  });
  const plottedKeys = new Set(dayMaps.filter(m => m.plotted).map(m => m.key));
  return {
    odometer,
    goal: GOAL,
    day: dayNo,
    province: town(position.ending).split(',').pop().trim() || '—',
    route: town(position.ending),
    today: km(last ? last.km : 0),
    best: km(Math.max(0, ...trip.map(d => d.km))),
    avgPerDay: driving.length ? km(driving.reduce((s, d) => s + d.km, 0) / driving.length) : 0,
    chargeSessions: ch.day,
    chargeSupercharger: ch.daySc,
    chargeOther: ch.dayOther,
    chargeLifetime: ch.life,
    chargeLifetimeSupercharger: ch.lifeSc,
    chargeLifetimeOther: ch.lifeOther,
    /* Plotted from the location-embargoed drives, snapped to a 5km grid. Its
       label reports the day it actually shows, which under live km is a day
       behind the odometer above it — say so on the page rather than letting the
       two read as the same day. `dayMap` is the newest plotted day; `dayMaps`
       carries the rolling window the log rows select from. */
    dayMap: dayMaps[dayMaps.length - 1] || {
      label: 'Awaiting day 1',
      corridor: town(position.ending),
      from: '\u2014',
      to: '\u2014',
      km: 0,
      chargeStops: 0,
      note: 'Town level \u00b7 delayed ' + LOCATION_EMBARGO_HOURS + 'h',
      path: [],
      stops: [],
      kmPerPx: 0
    },
    dayMaps,
    asOf: last && last.date || position.date || dayKey(cutoff),
    /* Wall-clock time the job ran. asOf is the day the DATA covers, which only
       moves once a day — this is the only field that proves the feed is alive. */
    updatedAt: new Date().toISOString(),
    embargoHours: EMBARGO_HOURS,
    locationEmbargoHours: LOCATION_EMBARGO_HOURS,
    liveKm: LIVE_KM || undefined,
    nerd: nerdBlock({
      published,
      locPublished,
      charges,
      health,
      history
    }),
    /* Last 30 days of distance. The page slices this to 8 or shows all 30 — it
       is one honest series either way, not a short one repeated to look long. */
    days: recent.map(d => ({
      key: d.date,
      label: 'D ' + dayIndex(d.date),
      km: km(d.km)
    })),
    log: trip.slice(-LOG_DAYS).reverse().map(d => {
      const place = placeOf.get(d.date) || null;
      return {
        key: d.date,
        day: 'Day ' + dayIndex(d.date),
        date: fmtDayKey(d.date),
        province: place ? town(place.ending).split(',').pop().trim() : '—',
        /* Both ends of the day, town level. Held on the location clock like
           everything else, so today's row reads "—" until it clears. */
        from: place ? town(place.starting) : '—',
        to: place ? town(place.ending) : '—',
        /* Whether this row has a route to show when clicked. */
        plotted: plottedKeys.has(d.date) || undefined,
        km: km(d.km).toLocaleString('en-CA'),
        note: '' // written by hand — Tessie has no field for what broke
      };
    })
  };
}

/* The browser reads the pre-shaped snapshot — no shaping, no token, no Tessie. */
async function load() {
  const res = await fetch(ENDPOINT, {
    headers: {
      Accept: 'application/json'
    }
  });
  if (!res.ok) throw new Error('odometer.json ' + res.status);
  return res.json();
}

/* Hydrate in place, then keep it current. Falls back to the static figures in
   data.js if the snapshot is unreachable, so the page never renders empty. */
function mount(onData) {
  const tick = () => load().then(onData).catch(e => console.warn('[rtam] odometer feed:', e.message));
  tick();
  setInterval(tick, REFRESH_MS);
}
Object.assign(__ds_scope, { shape, load, mount });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/odometer/tessie.js", error: String((e && e.message) || e) }); }

// ui_kits/social/Frames.jsx
try { (() => {
const {
  Badge,
  Scrim,
  Eyebrow
} = window.RoadToAMillionDesignSystem_6606d4;
const A = '../../assets/';
function SquareCard({
  photo,
  day,
  odometer,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 360,
      height: 360,
      background: '#1C242C',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, {
    from: "bottom"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 22,
      right: 22,
      textAlign: 'right',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: '#00B4D9'
    }
  }, day), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 22,
      fontVariantNumeric: 'tabular-nums',
      color: '#F6F0E3'
    }
  }, odometer)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      bottom: 22,
      right: 22,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 48,
      lineHeight: .86,
      textTransform: 'uppercase',
      color: '#F6F0E3'
    }
  }, title), /*#__PURE__*/React.createElement(Badge, {
    size: 66,
    src: A + 'badge-art.svg',
    showType: false,
    style: {
      flex: '0 0 auto'
    }
  })));
}
function ClipCover({
  photo,
  episode,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 216,
      height: 384,
      background: '#1C242C',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, {
    from: "bottom"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 14,
      border: '1px dashed rgba(0,180,217,.35)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    size: 48,
    src: A + 'badge-art.svg',
    showType: false,
    style: {
      position: 'absolute',
      top: 26,
      left: 26
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 26,
      right: 26,
      bottom: 70,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 10,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: '#00B4D9',
      marginBottom: 8
    }
  }, episode), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 34,
      lineHeight: .88,
      textTransform: 'uppercase',
      color: '#F6F0E3'
    }
  }, title)));
}
function WideFrame({
  photo,
  kicker,
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      background: '#1C242C',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement(Scrim, {
    from: "left"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 28,
      top: 28,
      bottom: 28,
      display: 'grid',
      alignContent: 'space-between',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    size: 58,
    src: A + 'badge-art.svg',
    showType: false
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: '#00B4D9',
      marginBottom: 10
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 46,
      lineHeight: .86,
      textTransform: 'uppercase',
      color: '#F6F0E3'
    }
  }, title))));
}
function FrameLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.5)'
    }
  }, children);
}
Object.assign(window, {
  SquareCard,
  ClipCover,
  WideFrame,
  FrameLabel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/social/Frames.jsx", error: String((e && e.message) || e) }); }

// ui_kits/thumbnail/Controls.jsx
try { (() => {
const {
  Eyebrow
} = window.RoadToAMillionDesignSystem_6606d4;
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "bronze",
    size: 10,
    track: 0.22
  }, label), children);
}
const inputCss = {
  background: 'transparent',
  border: '1px solid rgba(246,240,227,.22)',
  color: '#F6F0E3',
  font: '400 13px/1.5 "IBM Plex Mono",monospace',
  padding: '10px 12px',
  borderRadius: 0,
  width: '100%',
  boxSizing: 'border-box'
};
function Toggle({
  label,
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!on),
    style: {
      ...inputCss,
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      fontSize: 11,
      color: on ? '#00B4D9' : 'rgba(246,240,227,.55)',
      borderColor: on ? 'rgba(0,180,217,.5)' : 'rgba(246,240,227,.22)'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", null, on ? 'ON' : 'OFF'));
}
function Segmented({
  options,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.v,
    onClick: () => onChange(o.v),
    style: {
      flex: 1,
      padding: '10px 8px',
      cursor: 'pointer',
      background: value === o.v ? '#00B4D9' : 'transparent',
      color: value === o.v ? '#1C242C' : 'rgba(246,240,227,.6)',
      border: '1px solid ' + (value === o.v ? '#00B4D9' : 'rgba(246,240,227,.22)'),
      borderLeftWidth: 0,
      fontSize: 11,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      borderRadius: 0
    }
  }, o.l)));
}
Object.assign(window, {
  Field,
  Toggle,
  Segmented,
  inputCss
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/thumbnail/Controls.jsx", error: String((e && e.message) || e) }); }

// ui_kits/thumbnail/Ridge.jsx
try { (() => {
const RIDGE_PTS = "0,0 32.779,26.279 51.462,11.301 98.45,48.971 146.668,10.314 146.668,48.971 0,48.971";
function Ridge() {
  const tiles = [];
  for (let i = 0; i < 4; i++) {
    const x = i * 293.336;
    tiles.push(/*#__PURE__*/React.createElement("polygon", {
      key: 'a' + i,
      transform: `translate(${x},0) scale(-1,1)`,
      points: RIDGE_PTS
    }));
    tiles.push(/*#__PURE__*/React.createElement("polygon", {
      key: 'b' + i,
      transform: `translate(${x},0)`,
      points: RIDGE_PTS
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 140,
      height: 64,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1026.676 48.971",
    preserveAspectRatio: "xMidYMax meet",
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      display: 'block'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "#1C242C"
  }, tiles)));
}
Object.assign(window, {
  Ridge
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/thumbnail/Ridge.jsx", error: String((e && e.message) || e) }); }

// ui_kits/thumbnail/Thumbnail.jsx
try { (() => {
const {
  Wordmark,
  StatReadout,
  ProgressRule
} = window.RoadToAMillionDesignSystem_6606d4;

/* 1280x720. Furniture always sits on an opaque Midnight base plate — never on the photo. */
function Thumbnail({
  layout,
  eyebrow,
  title,
  odometer,
  episode,
  progress,
  showRidge,
  showMark,
  photo
}) {
  const full = layout === 'full';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1280,
      height: 720,
      overflow: 'hidden',
      background: '#1C242C',
      fontFamily: "'IBM Plex Mono', monospace"
    }
  }, full ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      height: 352,
      background: 'linear-gradient(180deg,rgba(28,36,44,.94) 0%,rgba(28,36,44,.7) 56%,rgba(28,36,44,0) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 52,
      right: 64,
      display: 'grid',
      gap: 20,
      justifyItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '.3em',
      textTransform: 'uppercase',
      color: '#00B4D9'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 126,
      lineHeight: .84,
      letterSpacing: '-.01em',
      textTransform: 'uppercase',
      color: '#F6F0E3',
      textWrap: 'balance'
    }
  }, title))) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: "",
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 824,
      height: 720,
      objectFit: 'cover',
      objectPosition: '52% 50%',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 456,
      top: 0,
      width: 190,
      height: 720,
      background: 'linear-gradient(90deg,#1C242C,rgba(28,36,44,0))'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 458,
      height: 720,
      background: '#1C242C'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 56,
      top: 58,
      width: 376,
      display: 'grid',
      gap: 22,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: '.2em',
      textTransform: 'uppercase',
      color: '#00B4D9',
      lineHeight: 1.3,
      textWrap: 'balance'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'etna-x-condensed',sans-serif",
      fontWeight: 700,
      fontSize: 100,
      lineHeight: .86,
      letterSpacing: '-.01em',
      textTransform: 'uppercase',
      color: '#F6F0E3',
      textWrap: 'balance'
    }
  }, title))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 140,
      background: '#1C242C'
    }
  }), showRidge && /*#__PURE__*/React.createElement(Ridge, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 60,
      right: 60,
      bottom: 16,
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(StatReadout, {
    value: odometer,
    unit: "km",
    size: 54,
    face: "display"
  }), showMark && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 220,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 54,
    tone: "one-colour-bone",
    showEyebrow: false
  }))), /*#__PURE__*/React.createElement(ProgressRule, {
    percent: progress
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 24,
      fontSize: 28,
      fontWeight: 500,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'rgba(246,240,227,.72)',
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", null, episode), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#A47D51'
    }
  }, "1,000,000 km goal"))));
}
Object.assign(window, {
  Thumbnail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/thumbnail/Thumbnail.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.DpLockup = __ds_scope.DpLockup;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Plate = __ds_scope.Plate;

__ds_ns.SpecColumns = __ds_scope.SpecColumns;

__ds_ns.ProgressRule = __ds_scope.ProgressRule;

__ds_ns.StatReadout = __ds_scope.StatReadout;

__ds_ns.LowerThird = __ds_scope.LowerThird;

__ds_ns.Scrim = __ds_scope.Scrim;

})();
