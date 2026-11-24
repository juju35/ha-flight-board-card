// ---------------------------------------------------------------------------
// The illustration: sky, airport scenery, runway and the plane of the tab
// ---------------------------------------------------------------------------

// Every animation of the illustration lasts a divisor of 8 s: the plane's 8 s cycle, so a recording of 8 s loops.
// The scenery is drawn in a 200 × 80 box whose bottom edge stands on the runway strip.
export const PLANE = `
  <g class="gear">
    <path d="M-2.5,-3 L-2.5,-1.2 M14,-3 L14,-1.2" stroke="#59626c" stroke-width=".8"/>
    <circle cx="-2.5" cy="-1" r="1" fill="#2c3238"/><circle cx="14" cy="-1" r=".9" fill="#2c3238"/>
  </g>
  <path d="M-19.5,-6.6 L-24.5,-5.6 L-23.5,-4.9 L-16,-5.4 Z" fill="#cfd7e0"/>
  <path d="M-14,-9 L-19.8,-17.5 L-16.3,-17.5 L-9,-9 Z" fill="#ff7a1a"/>
  <path d="M-20,-6.2 C-20,-8.2 -18,-9.1 -14,-9.1 L12,-9.1 C17,-9.1 21,-7.6 22.2,-5.6 C22.7,-4.4 21.2,-3 18,-3 L-15.5,-3 C-18.4,-3 -20,-4.2 -20,-6.2 Z" fill="#ffffff" stroke="#c4ced8" stroke-width=".4"/>
  <path d="M-18.6,-5.7 L19.8,-5.7 L21.4,-4.7 L-18.4,-4.7 Z" fill="#2f80ed"/>
  <path d="M15.6,-8.2 L18.6,-7.8 L20,-6.7 L16,-6.7 Z" fill="#1d3557"/>
  <g fill="#1d3557">${Array.from({ length: 11 }, (_, i) => `<rect x="${(-12 + i * 2.5).toFixed(1)}" y="-8" width="1.2" height="1.2" rx=".3"/>`).join("")}</g>
  <path d="M-3,-4.4 L5,-4.4 L-6.5,.2 L-9.5,.2 Z" fill="#8d99a6"/>
  <rect x="-1.5" y="-3.4" width="7" height="2.8" rx="1.4" fill="#6c7884"/>
  <ellipse cx="5.4" cy="-2" rx=".7" ry="1.3" fill="#38424d"/>`;

export const cloud = (x, y, s) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M-14,4 C-17,4 -18,0 -14.5,-1 C-14,-5 -8,-6 -6,-3 C-4,-8 4,-8 5,-2 C9,-3 12,0 10,4 Z"/>`;

// Stars of the night sky (fixed places, a few of them twinkling).
export const STARS = [
  [8, 8, 0.6], [26, 20, 0.5], [44, 6, 0.7], [62, 26, 0.5], [78, 12, 0.6], [98, 5, 0.5], [108, 30, 0.6], [146, 8, 0.7],
  [160, 22, 0.5], [178, 6, 0.6], [192, 16, 0.5], [118, 18, 0.4], [36, 32, 0.4], [86, 36, 0.4],
];

// The scenery: hills, terminal, control tower, windsock, sun or moon, clouds, the plane taking off (departures) or
// landing (arrivals). `run` changes when the tab changes: a new plane element, so its animation starts again.
export const sceneSvg = (kind, night, run) => {
  const win = night ? "#ffcf6e" : "#86b9de";
  const dark = night ? "#3b4b5e" : "#86b9de";
  const windows = Array.from({ length: 9 }, (_, i) => {
    const lit = !night || ![2, 6].includes(i);
    return `<rect x="${84 + i * 6.8}" y="66" width="4.4" height="5.6" rx=".6" fill="${lit ? win : dark}"/>`;
  }).join("");
  const sky = night
    ? `<g class="stars">${STARS.map(([x, y, r], i) => `<circle class="${i % 3 === 0 ? "tw" : ""}" cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>
       <mask id="fb-moon"><rect width="200" height="80" fill="#fff"/><circle cx="119.5" cy="13.5" r="5.4" fill="#000"/></mask>
       <circle cx="116" cy="16" r="9" fill="#f3eed2" opacity=".12"/>
       <circle cx="116" cy="16" r="6" fill="#f3eed2" mask="url(#fb-moon)"/>`
    : `<circle cx="116" cy="17" r="11" fill="#ffd65a" opacity=".28"/><circle cx="116" cy="17" r="7" fill="#ffd65a"/>`;
  return `<svg class="scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
    ${sky}
    <g class="clouds">
      <g class="cloud c1">${cloud(56, 14, 1)}</g>
      <g class="cloud c2">${cloud(184, 44, 0.7)}</g>
    </g>
    <path class="hill far" d="M0,80 C22,76 40,66 70,67 C96,68 110,59 140,61 C166,63 184,56 200,58 L200,80 Z"/>
    <path class="hill near" d="M24,80 C56,73 80,75 102,73.5 C132,71.5 162,70 200,72 L200,80 Z"/>
    <g class="terminal">
      <path d="M78,62.5 L148,62.5 L144,57.5 L82,57.5 Z" class="roof"/>
      <rect x="80" y="62" width="66" height="18" class="body"/>
      ${windows}
      <rect x="80" y="74.5" width="66" height="1.2" class="trim"/>
    </g>
    <g class="tower">
      <path d="M154.5,80 L161.5,80 L160.6,38 L155.4,38 Z" class="body"/>
      <path d="M149.5,38.5 L166.5,38.5 L164.6,28.5 L151.4,28.5 Z" class="cab"/>
      <rect x="151.8" y="30.4" width="12.4" height="4.6" rx=".6" fill="${night ? "#ffd27a" : "#a6dbf5"}"/>
      <rect x="150.4" y="26.4" width="15.2" height="2.6" rx=".8" class="cap"/>
      <path d="M158,26.5 L158,20.5" stroke="#6b7480" stroke-width=".7"/>
      <circle class="beacon-glow" cx="158" cy="19.4" r="3.8" fill="#ff3b30"/>
      <circle class="beacon" cx="158" cy="19.4" r="1.5" fill="#ff3b30"/>
    </g>
    <g class="windsock">
      <path d="M22,80 L22,61.5" stroke="#8a939c" stroke-width="1.1"/>
      <g transform="translate(22 62.4)"><g class="sock">
        <path d="M0,0 L4.6,.5 L4.6,4.6 L0,5.4 Z" fill="#ff7a1a"/>
        <path d="M4.6,.5 L9.2,1 L9.2,3.8 L4.6,4.6 Z" fill="#ffffff"/>
        <path d="M9.2,1 L13.6,1.5 L13.6,3.1 L9.2,3.8 Z" fill="#ff7a1a"/>
      </g></g>
    </g>
    <g class="flight" data-key="plane-${kind}-${run}"><g class="plane ${kind}">${PLANE}</g></g>
  </svg>`;
};
