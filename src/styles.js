// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export const STYLE = `
  :host { --fb-accent: #2f80ed; --fb-ok: var(--success-color, #43a047); --fb-warn: var(--warning-color, #ffa600);
          --fb-danger: var(--error-color, #db4437); --fb-na: var(--disabled-text-color, #9e9e9e); display: block; }
  ha-card { overflow: hidden; position: relative; container: fbcard / inline-size; }
  /* A size container has no width of its own content: in a parent sized by its content the card would fall to a
     few pixels. This empty grid gives it a natural width of 400 px without any minimum. */
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, 400px); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .muted { color: var(--secondary-text-color); }
  [role="button"] { cursor: pointer; }
  [role="button"]:focus-visible, button:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
  .ok { --c: var(--fb-ok); } .warn { --c: var(--fb-warn); } .accent { --c: var(--fb-accent); } .danger { --c: var(--fb-danger); } .na { --c: var(--fb-na); }
  /* Status pill: the state colour on a tint, the text mixed with the text colour to stay readable. */
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;
          line-height: 16px; white-space: nowrap; min-width: 0; max-width: 100%; box-sizing: border-box; overflow: hidden;
          background: color-mix(in srgb, var(--c) 15%, transparent); color: color-mix(in srgb, var(--c) 40%, var(--primary-text-color, #212121)); }
  .chip .txt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; }
  .warning { padding: 16px; color: color-mix(in srgb, var(--fb-warn) 40%, var(--primary-text-color, #212121)); }

  /* ── Illustrated header ── */
  .banner { position: relative; height: var(--banner-h, 90px); overflow: hidden; --runway-h: 10px;
            --sky-text: #0d2a45; --sky-muted: #3b5b78;
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.night { --sky-text: #ffffff; --sky-muted: rgba(255,255,255,.78);
                  background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .banner .scene { position: absolute; right: 0; bottom: var(--runway-h); height: calc(100% - var(--runway-h));
                   width: var(--scene-w); overflow: hidden; }
  /* The scenery's width: up to 2.5 × its height and --scene-max of the banner; from 380 to 420 px it narrows a little
     (down to 160 px), so that a short title keeps its status pill beside it. */
  .banner { --scene-w: min(calc((var(--banner-h, 90px) - var(--runway-h)) * 2.5), var(--scene-max, 58%), max(160px, 100cqw - 220px)); }
  .runway { position: absolute; left: 0; right: 0; bottom: 0; height: var(--runway-h); background: #858c94;
            box-shadow: inset 0 1px 0 #6f767d, inset 0 -1px 0 #6f767d; }
  .night .runway { background: #2c323b; box-shadow: inset 0 1px 0 #1f242b, inset 0 -1px 0 #1f242b; }
  /* Centre line markings, then the edge lights of both sides. */
  .runway .marks { position: absolute; left: 0; right: 0; top: calc(50% - .8px); height: 1.6px;
                   background: repeating-linear-gradient(90deg, rgba(255,255,255,.85) 0 9px, transparent 9px 18px); }
  .night .runway .marks { background: repeating-linear-gradient(90deg, rgba(255,255,255,.45) 0 9px, transparent 9px 18px); }
  .runway .lights { position: absolute; left: 0; right: 0; height: 3px;
                    background: radial-gradient(circle, #fff1b8 0 1.1px, transparent 1.5px) 4px 0 / 16px 3px repeat-x;
                    opacity: .55; animation: fb-pulse 2s ease-in-out infinite; }
  .runway .lights.top { top: 0; } .runway .lights.bottom { bottom: 0; animation-delay: -1s; }
  .night .runway .lights { background: radial-gradient(circle, #ffd27a 0 1.3px, rgba(255,210,122,.35) 1.6px, transparent 2.4px) 4px 0 / 16px 3px repeat-x; opacity: 1;
                           animation-name: fb-pulse-night; }
  .head { position: absolute; z-index: 1; left: 0; top: 0; bottom: var(--runway-h); box-sizing: border-box;
          right: var(--scene-w, 0px);
          display: flex; align-items: center; gap: 10px; padding: 4px 8px 4px 14px; min-width: 0; color: var(--sky-text); }
  /* The header's text block is a container: the status pill leaves the title row when it lacks room. */
  .head, .header { container: fbhead / inline-size; }
  /* The header icon takes the status colour of the pill (--c of its ok / warn / danger / na class). */
  .badge { width: 40px; height: 40px; flex: none; border-radius: 50%; display: grid; place-items: center;
           color: color-mix(in srgb, var(--c, var(--fb-accent)) 88%, #0d2a45);
           background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c, var(--fb-accent)) 22%, transparent); }
  .night .badge { background: rgba(255,255,255,.12); color: color-mix(in srgb, var(--c, #8fbaff) 70%, #ffffff); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .badge .icon { width: 24px; height: 24px; }
  /* Brand badge on the header icon (FlightRadar24 radar mark): on a white rounded tile, readable in both themes. */
  .badge { position: relative; }
  .badge .brand { position: absolute; right: -4px; bottom: -4px; width: 18px; height: 18px; border-radius: 5px; padding: 2px; box-sizing: border-box;
                  display: grid; place-items: center; background: #fff;
                  box-shadow: 0 0 0 1px var(--divider-color, rgba(0,0,0,.12)), 0 0 0 3px var(--card-background-color, #fff); }
  .banner .badge .brand { box-shadow: 0 0 0 1px rgba(13,42,69,.16), 0 1px 3px rgba(13,42,69,.18); }
  .badge .brand .mark { width: 100%; height: 100%; }
  .titles { flex: 1 1 0; min-width: 0; overflow: hidden; display: flex; flex-direction: column; }
  /* The title row: the title, then the status pill right after it with its whole label (placed by _fitPill). */
  .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          flex: 0 1000 auto; min-width: 0; }
  .trow .hpill { flex: none; max-width: none; }
  .name .code { font-weight: 400; opacity: .7; }
  /* The statistics on two lines at most: a part that does not fit goes to a third line, clipped away; the "·" that
     starts a line sits in the negative margin, clipped too. */
  .stats { display: flex; flex-wrap: wrap; max-height: 32px; overflow: hidden; margin-left: -10px; font-size: 12px; line-height: 16px; color: var(--sky-muted); }
  .stats span { white-space: nowrap; }
  .stats span::before { content: "·"; display: inline-block; width: 10px; text-align: center; }
  /* Scenery colours, day and night. */
  .scene .hill.far { fill: #a7d39f; } .scene .hill.near { fill: #86c27f; }
  .night .scene .hill.far { fill: #1d3a4a; } .night .scene .hill.near { fill: #17303d; }
  .scene .terminal .body { fill: #eef2f6; } .scene .terminal .roof { fill: #b3bfcb; } .scene .terminal .trim { fill: #c9d2db; }
  .night .scene .terminal .body { fill: #2a3646; } .night .scene .terminal .roof { fill: #3a4759; } .night .scene .terminal .trim { fill: #344154; }
  .scene .tower .body { fill: #e3e8ed; } .scene .tower .cab { fill: #5d6b7a; } .scene .tower .cap { fill: #4a5563; }
  .night .scene .tower .body { fill: #303c4b; } .night .scene .tower .cab { fill: #232d3a; } .night .scene .tower .cap { fill: #1c2530; }
  .scene .clouds { fill: #ffffff; opacity: .92; } .night .scene .clouds { opacity: .1; }
  .scene .stars { fill: #ffffff; opacity: .85; }
  /* ── Animations (each one a divisor of the plane's 8 s) ── */
  .scene .beacon, .scene .beacon-glow { animation: fb-blink 1s steps(1, end) infinite; }
  .scene .beacon-glow { opacity: .3; }
  .scene .sock { animation: fb-sock 2s ease-in-out infinite; }
  .scene .cloud { animation: fb-drift 4s ease-in-out infinite alternate; }
  .scene .cloud.c2 { animation-delay: -2s; animation-direction: alternate-reverse; }
  .scene .stars .tw { animation: fb-twinkle 4s ease-in-out infinite; }
  .scene .stars .tw:nth-child(2n) { animation-delay: -2s; }
  .scene .plane.dep { transform: translate(128px, 52px) rotate(-13deg); animation: fb-takeoff 8s linear infinite; }
  .scene .plane.dep .gear { animation: fb-gear 8s linear infinite; }
  .scene .plane.arr { transform: translate(52px, 70px) rotate(5deg); animation: fb-landing 8s linear infinite; }
  @keyframes fb-blink { 0% { opacity: 1; } 50% { opacity: .15; } }
  @keyframes fb-pulse { 0%, 100% { opacity: .35; } 50% { opacity: .8; } }
  @keyframes fb-pulse-night { 0%, 100% { opacity: .65; } 50% { opacity: 1; } }
  @keyframes fb-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .25; } }
  @keyframes fb-sock { 0%, 100% { transform: rotate(-3deg) scaleX(.9); } 50% { transform: rotate(5deg) scaleX(1); } }
  @keyframes fb-drift { from { transform: translateX(-7px); } to { transform: translateX(7px); } }
  @keyframes fb-takeoff {
    0% { transform: translate(-26px, 80px) rotate(0deg); opacity: 0; animation-timing-function: ease-in; }
    6% { transform: translate(-14px, 80px) rotate(0deg); opacity: 1; animation-timing-function: ease-in; }
    44% { transform: translate(72px, 80px) rotate(0deg); }
    52% { transform: translate(98px, 78.5px) rotate(-11deg); }
    68% { transform: translate(146px, 58px) rotate(-14deg); }
    82% { transform: translate(214px, 30px) rotate(-14deg); opacity: 1; }
    83%, 100% { transform: translate(220px, 28px) rotate(-14deg); opacity: 0; }
  }
  @keyframes fb-gear { 0%, 58% { opacity: 1; } 62%, 100% { opacity: 0; } }
  @keyframes fb-landing {
    0% { transform: translate(-36px, 44px) rotate(6deg); opacity: 0; }
    6% { transform: translate(-22px, 48px) rotate(6deg); opacity: 1; }
    44% { transform: translate(80px, 79.6px) rotate(-2deg); animation-timing-function: ease-out; }
    50% { transform: translate(94px, 80px) rotate(0deg); animation-timing-function: ease-out; }
    80% { transform: translate(140px, 80px) rotate(0deg); opacity: 1; }
    90%, 100% { transform: translate(144px, 80px) rotate(0deg); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .scene *, .runway .lights { animation: none !important; }
  }
  /* A narrow card keeps the sky and the runway for its texts: no scenery. */
  @container (max-width: 300px) {
    .banner .scene { display: none; }
    .head { right: 0; }
  }
  /* Pills on the sky: a frosted glass under the tint. */
  .banner .chip { background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
  /* The whole title and the whole pill do not fit side by side (measured by the card, see _fitPill): the pill goes to
     its own line, under the statistics, kept to one line; if that does not fit the header either, the dot alone. */
  .titles.below > .trow { display: contents; }
  .titles.below > .trow .hpill { order: 3; align-self: flex-start; max-width: 100%; margin-top: 2px; }
  .titles.below .stats { order: 2; max-height: 16px; }
  .titles.dot-only > .trow { display: flex; }
  .titles.dot-only > .trow .hpill { order: 0; align-self: center; margin-top: 0; }
  :is(.titles, .next).dot-only .hpill { padding: 0; background: none !important; overflow: visible; }
  :is(.titles, .next).dot-only .hpill .txt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  /* Very narrow: the dot alone, back on the title row (the label stays in its tooltip and for screen readers). */
  @container fbcard (max-width: 200px) {
    .titles.below > .trow { display: flex; }
    .titles.below > .trow .hpill { order: 0; align-self: center; margin-top: 0; }
    .hpill { padding: 0; background: none !important; overflow: visible; }
    .hpill .txt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  }

  /* ── Classic header (illustration: false) ── */
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 14px 8px; }
  .header .badge { color: var(--c, var(--fb-accent)); background: color-mix(in srgb, var(--c, var(--fb-accent)) 16%, transparent); box-shadow: none; }
  .header .stats { color: var(--secondary-text-color); }

  /* ── Tabs, right under the header ── */
  .tabs { display: flex; gap: 18px; padding: 0 16px; border-bottom: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .tab { all: unset; cursor: pointer; padding: 9px 0 7px; font-size: 14px; font-weight: 500; color: var(--secondary-text-color);
         border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; }
  .tab:hover { color: var(--primary-text-color); }
  .tab[aria-selected="true"] { color: var(--primary-text-color); border-bottom-color: var(--fb-accent); }

  /* ── Flights ── */
  .list { padding: 4px 0 8px; }
  .row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 7px 16px; }
  .row + .row { border-top: 1px solid color-mix(in srgb, var(--divider-color, rgba(127,127,127,.2)) 70%, transparent); }
  .row:hover { background: color-mix(in srgb, var(--fb-accent) 6%, transparent); }
  .row .time { font-weight: 600; font-variant-numeric: tabular-nums; min-width: 2.9em; }
  .row .where { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; }
  .row .where .muted { font-size: 13px; }
  .row .chip { max-width: 46cqw; }
  .empty { padding: 14px 16px; font-size: 13px; color: var(--secondary-text-color); }

  /* ── Flight detail popup, at the top of the card ── */
  .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: flex-start; justify-content: center;
              padding-top: 10px; box-sizing: border-box; z-index: 9; border-radius: inherit; }
  .modal { background: var(--card-background-color, #fff); color: var(--primary-text-color); width: min(94%, 380px); max-height: calc(100% - 20px);
           overflow: auto; box-sizing: border-box; border-radius: 14px; padding: 14px; box-shadow: 0 8px 30px rgba(0,0,0,.35);
           display: flex; flex-direction: column; gap: 10px; }
  .mhead { display: flex; align-items: flex-start; gap: 10px; }
  .mhead .badge { width: 36px; height: 36px; color: var(--fb-accent); background: color-mix(in srgb, var(--fb-accent) 16%, transparent); box-shadow: none; }
  .mhead .badge .icon { width: 20px; height: 20px; }
  .mhead h3 { margin: 0; font-size: 16px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .mhead .sub { font-size: 12px; color: var(--secondary-text-color); overflow-wrap: anywhere; }
  .mhead > div:not(.badge) { flex: 1 1 auto; min-width: 0; }
  .close { all: unset; flex: none; cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
           color: var(--secondary-text-color); box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }
  .close:hover { color: var(--primary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }
  .close .icon { width: 16px; height: 16px; }
  .facts { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 5px 12px; margin: 0; font-size: 13px; }
  .facts dt { color: var(--secondary-text-color); }
  .facts dd { margin: 0; overflow-wrap: anywhere; }
  .facts .t { font-variant-numeric: tabular-nums; }
`;

// The mini card: a lower banner, the next flight laid on the sky.
export const MINI_STYLE = `
  .banner { --banner-h: 90px; --runway-h: 10px; --scene-max: 40%; }
  .head { padding-right: 6px; }
  .next { display: flex; flex-direction: column; gap: 1px; flex: 1 1 0; min-width: 0; }
  .next .l1 { display: flex; align-items: center; gap: 8px; min-width: 0; white-space: nowrap; }
  .next .clock { font-size: 22px; font-weight: 600; line-height: 26px; font-variant-numeric: tabular-nums; flex: none; }
  .next .l1 > .chip { flex: none; max-width: none; }
  .next .l1 > .name { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  /* The time (or the airport) and the whole pill do not fit side by side (see _fitPill): the pill under the flight,
     its lines kept to one; if that does not fit the header either, the dot alone beside the time. */
  .next.below > .l1 { display: contents; }
  .next.below > :not(.l1) { order: 2; }
  .next.below > .l1 > .chip { order: 3; align-self: flex-start; margin-top: 2px; }
  .next.below .none { -webkit-line-clamp: 1; }
  .next.dot-only > .l1 { display: flex; }
  .next.dot-only > .l1 > .chip { order: 0; align-self: center; margin-top: 0; }
  .next .city { font-size: 13px; line-height: 17px; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .next .what { font-size: 12px; line-height: 16px; color: var(--sky-muted); min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .header { --sky-muted: var(--secondary-text-color); }
  .next .none { font-size: 12px; line-height: 16px; color: var(--sky-muted); overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .next .l1 .name { font-size: 16px; line-height: 26px; }
  .zoom { all: unset; position: absolute; z-index: 2; top: 5px; right: 5px; cursor: pointer; width: 24px; height: 24px; border-radius: 50%;
          display: grid; place-items: center; color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
          -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .night .zoom, .zoom.on-night { color: #ffffff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .zoom:hover { background: rgba(255,255,255,.75); }
  .night .zoom:hover, .zoom.on-night:hover { background: rgba(255,255,255,.22); }
  .zoom .icon { width: 16px; height: 16px; }
  @container (max-width: 280px) { .banner .scene { display: none; } .head { right: 0; padding-right: 34px; } }
  /* A narrow mini card: a smaller clock leaves its status pill whole. */
  @container fbcard (max-width: 260px) { .next .clock { font-size: 20px; } .next .l1 { gap: 6px; } }
  /* Without the illustration, tighter margins too: the next flight's status keeps its whole label beside the clock. */
  @container fbcard (max-width: 260px) { .header.plainmini { gap: 6px; padding-left: 10px; padding-right: 38px; } }
`;
// The zoomed mini card: the full card, with the detail button over its banner.
export const ZOOM_STYLE = `
  .zoom { all: unset; position: absolute; z-index: 2; top: 5px; right: 5px; cursor: pointer; width: 24px; height: 24px; border-radius: 50%;
          display: grid; place-items: center; color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
          -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .zoom:hover { background: rgba(255,255,255,.75); }
  .zoom.on-night { color: #ffffff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .zoom.on-night:hover { background: rgba(255,255,255,.22); }
  .zoom.plain { color: var(--secondary-text-color); background: none; box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); top: 18px; right: 12px; }
  .zoom .icon { width: 16px; height: 16px; }
  .header { position: relative; padding-right: 40px; }
`;
