// ---------------------------------------------------------------------------
// The full card
// ---------------------------------------------------------------------------
import { ICONS } from "./core.js";
import { brandBadge, esc, fmtLang, plural, svgIcon, t } from "./helpers.js";
import { discover } from "./flightradar24-entities.js";
import { boardFlights, boardStats, cityOf, flightInfo, flightLabel, isPast, num } from "./flights.js";
import { inDialog, morph, textWidth, watchOutside } from "./shadow-dom-patching.js";
import { sceneSvg } from "./illustration.js";
import { STYLE } from "./styles.js";

export class FlightBoardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._tab = null;
    this._run = 0;
    this._detail = null;
    this.shadowRoot.addEventListener("click", (ev) => this._click(ev));
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.getAttribute?.("role") === "button") {
        ev.preventDefault();
        ev.target.click();
      }
    });
    this._onKey = (ev) => {
      if (this._detail && ev.key === "Escape") {
        ev.stopPropagation();
        this._closeDetail(true);
      }
    };
    // A click elsewhere on the page closes the flight popup (and only that: a zoomed mini card stays zoomed).
    this._onOutside = (ev) => {
      if (this._detail && !inDialog(ev)) {
        this._detailClosedBy = ev;
        this._closeDetail(false);
      }
    };
  }

  static getConfigElement() {
    return document.createElement("flight-board-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 2 + Math.min(20, Math.max(1, num(this._config?.max_flights) ?? 6));
  }

  // 8 columns: 208 px on a phone.
  getGridOptions() {
    return { columns: 12, min_columns: 8 };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    this._tab = null;
    this._html = "";
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const sig = this._signature();
    if (this._sig && sig.length === this._sig.length && sig.every((v, i) => v === this._sig[i])) return;
    this._update(sig);
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    (this._outsideWatch ??= watchOutside(this, (ev) => this._onOutside(ev))).on();
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === "function") {
      this._resize ??= new ResizeObserver((entries) => {
        const w = Math.round(entries.at(-1).contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
    // The times ("in 23 min", boarding, past flights) follow the clock: checked every 30 s.
    clearInterval(this._timer);
    this._timer = setInterval(() => this._hass && this._config && (this.hass = this._hass), 30000);
    this._update();
  }

  disconnectedCallback() {
    this._outsideWatch?.off();
    clearInterval(this._timer);
    cancelAnimationFrame(this._fitFrame);
    this._resize?.disconnect();
    this._fitWidth = null;
    // Left (another view, a conditional card hidden): the popup closes without anything else.
    this._detail = null;
    window.removeEventListener("keydown", this._onKey);
  }

  // The header's status pill goes right after the title, on its row, only while the title stays whole and the
  // pill's whole label fits beside it; otherwise it takes a line of its own under the subtitle (.below), the title
  // whole on its row (cut only when it does not fit alone). There, in the banner, the subtitle keeps one line; if the
  // text still does not fit above the ground strip, the pill keeps its dot alone (.dot-only, its label in its tooltip
  // and for screen readers). Measured after each render and on each new width, whatever the language: no fixed
  // width threshold.
  _fitPill() {
    if (!this.isConnected) return;
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles, .next") || []) {
      const row = t.querySelector(".trow, .l1");
      const pills = row ? [...row.children].filter((n) => n.matches(".chip")) : [];
      if (!pills.length || !pills[0].getBoundingClientRect) continue;
      t.classList.remove("below", "dot-only");
      const name = row.querySelector(".name, .clock");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const title = name && getComputedStyle(name).display !== "none" ? textWidth(name) + gap : 0;
      const need = pills.reduce((w, p) => w + p.getBoundingClientRect().width + gap, title - gap);
      if (need > t.getBoundingClientRect().width - 0.5) {
        t.classList.add("below");
        const banner = t.closest(".banner");
        if (banner) {
          const b = banner.getBoundingClientRect();
          // Each element as it shows: its box cut by its ancestors that hide their overflow (a clamped line).
          const out = [...t.querySelectorAll("*")].some((n) => {
            let { top, bottom } = n.getBoundingClientRect();
            for (let p = n.parentElement; p && p !== t; p = p.parentElement) {
              if (getComputedStyle(p).overflowY === "visible") continue;
              top = Math.max(top, p.getBoundingClientRect().top);
              bottom = Math.min(bottom, p.getBoundingClientRect().bottom);
            }
            return bottom - top > 0.5 && (top < b.top - 0.5 || bottom > b.bottom - (parseFloat(getComputedStyle(banner).getPropertyValue("--runway-h")) || 10) + 0.5);
          });
          if (out) t.classList.add("dot-only");
        }
      }
      // A subtitle cut by its ellipsis keeps its whole text in its tooltip.
      const s = t.querySelector(".none");
      if (s && (!s.hasAttribute("title") || s.dataset.fit)) {
        const cut = s.scrollWidth > s.clientWidth + 1;
        s.toggleAttribute("data-fit", cut);
        if (cut) s.title = s.textContent.trim();
        else s.removeAttribute("title");
      }
    }
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _loc() {
    return fmtLang(this._hass, this._config);
  }

  _s(id) {
    return id ? this._hass?.states?.[id] : undefined;
  }

  _now() {
    return Date.now() / 1000;
  }

  // The tabs shown: departures and arrivals unless one is turned off (both off: departures).
  _tabs() {
    const c = this._config;
    const tabs = [];
    if (c.show_departures !== false) tabs.push("dep");
    if (c.show_arrivals !== false) tabs.push("arr");
    return tabs.length ? tabs : ["dep"];
  }

  _activeTab() {
    const tabs = this._tabs();
    if (this._tab && tabs.includes(this._tab)) return this._tab;
    const def = this._config.default_tab === "arrivals" ? "arr" : "dep";
    return tabs.includes(def) ? def : tabs[0];
  }

  // What the render depends on: language, dark mode, the airport entities and the minute.
  _signature() {
    const h = this._hass;
    const e = discover(h, this._config);
    return [
      h.language,
      h.locale,
      h.themes?.darkMode,
      ...Object.values(e).map((id) => h.states[id]),
      Math.floor(Date.now() / 60000),
    ];
  }

  _update(sig) {
    if (!this._hass || !this._config) return;
    this._sig = sig ?? this._signature();
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      morph(this.shadowRoot, html);
    }
    this._fitPill();
  }

  // Night illustration: forced by illustration_theme, else Home Assistant's dark mode alone (a light theme keeps the
  // day picture after sunset).
  _night() {
    const mode = this._config.illustration_theme;
    if (mode === "night") return true;
    if (mode === "day") return false;
    return !!this._hass?.themes?.darkMode;
  }

  // Formats a Unix time (seconds) in the time zone and the 12/24 h setting of Home Assistant; the weekday when
  // it is not today.
  _time(sec, withDay = false) {
    if (sec === null || sec === undefined) return "—";
    const h = this._hass;
    const opts = { hour: "2-digit", minute: "2-digit" };
    const tf = h?.locale?.time_format;
    if (tf === "12") opts.hour12 = true;
    else if (tf === "24") opts.hourCycle = "h23";
    const tz = h?.locale?.time_zone === "local" ? undefined : h?.config?.time_zone;
    if (tz) opts.timeZone = tz;
    const d = new Date(sec * 1000);
    try {
      if (withDay) {
        const day = (x) => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(x);
        if (day(d) !== day(new Date(this._now() * 1000))) opts.weekday = "short";
      }
      return new Intl.DateTimeFormat(this._loc(), opts).format(d);
    } catch (_e) {
      return d.toISOString().slice(11, 16);
    }
  }

  _board(kind) {
    const e = discover(this._hass, this._config);
    const id = kind === "dep" ? e.departures : e.arrivals;
    const s = this._s(id);
    const prefix = kind === "dep" ? "departures" : "arrivals";
    const v = (k) => this._s(e[`${prefix}_${k}`])?.state;
    const tracked = !!s && !["unavailable", "unknown"].includes(s.state) && Array.isArray(s.attributes?.flights);
    const flights = tracked ? boardFlights(s.attributes.flights, kind, this._now(), this._config) : [];
    const stats = boardStats(flights, { on_time: v("on_time"), delayed: v("delayed"), delay_average: v("delay_average") });
    return { id, entity: s, tracked, flights, stats };
  }

  // The airport: the title, else the tracked code, else "Airport".
  _airport() {
    const e = discover(this._hass, this._config);
    const code = this._s(e.track)?.state;
    const known = code && !["unavailable", "unknown", ""].includes(code) ? String(code).toUpperCase() : "";
    const title = this._config.title || "";
    return { title: title || known || this._t("airport"), code: title && known && title.toUpperCase() !== known ? known : "" };
  }

  _statsText(board) {
    if (this._config.show_stats === false || !board.tracked) return [];
    const { count, pct, avg } = board.stats;
    const parts = [plural(this._hass, this._config, "flights", count)];
    if (pct !== null) {
      const p = new Intl.NumberFormat(this._loc(), { style: "percent", maximumFractionDigits: 0 }).format(pct);
      parts.push(this._t("on_time_pct", { pct: p }));
    }
    if (avg !== null) parts.push(this._t("avg_delay", { delay: this._t("minutes", { n: `${avg > 0 ? "+" : ""}${avg}` }) }));
    return parts;
  }

  // The pill of a flight: the delay ("+25 min"), else its status (with the estimated time unless `short`).
  _pill(info, short = false) {
    const text =
      info.key === "delayed" && info.delay > 0
        ? this._t("minutes", { n: `+${info.delay}` })
        : info.key === "estimated" && info.estimated !== null && !short
          ? `${this._t("status_estimated")} ${this._time(info.estimated)}`
          : this._t(`status_${info.key}`);
    const title = info.key === "delayed" ? `${this._t("status_delayed")} · ${text}` : text;
    return `<span class="chip hpill ${info.cls}" title="${esc(title)}"><span class="dot"></span><span class="txt">${esc(text)}</span></span>`;
  }

  // The status of the board shown, for the header's pill and icon: cancellations (or diversions) among the
  // flights listed, else delays, else on time; grey when nothing is tracked or listed.
  _boardStatus(board) {
    if (!board.tracked) return { key: "not_tracked_short", cls: "na" };
    const max = Math.max(1, Math.min(50, Math.round(num(this._config.max_flights) ?? 6)));
    const shown = board.flights.slice(0, max).filter((i) => !isPast(i, this._now()));
    if (!shown.length) return { key: "no_flights_short", cls: "na" };
    if (shown.some((i) => i.key === "canceled" || i.key === "diverted")) return { key: "cancellations", cls: "danger" };
    if (shown.some((i) => i.key === "delayed")) return { key: "delays", cls: "warn" };
    return { key: "status_on_time", cls: "ok" };
  }

  _statusPill(st) {
    const text = this._t(st.key);
    return `<span class="chip hpill ${st.cls}" title="${esc(text)}"><span class="dot"></span><span class="txt">${esc(text)}</span></span>`;
  }

  _banner(kind, inner, extraClass = "") {
    const night = this._night();
    return `<div class="banner${night ? " night" : ""}${extraClass}">
      ${sceneSvg(kind, night, this._run)}
      <div class="runway"><div class="marks"></div><div class="lights top"></div><div class="lights bottom"></div></div>
      ${inner}
    </div>`;
  }

  _titleBlock(kind, board) {
    const a = this._airport();
    const stats = this._statsText(board);
    const st = this._boardStatus(board);
    return `<div class="badge ${st.cls}">${svgIcon(kind === "dep" ? ICONS.departures : ICONS.arrivals)}${brandBadge()}</div>
      <div class="titles">
        <div class="trow"><div class="name">${esc(a.title)}${a.code ? ` <span class="code">${esc(a.code)}</span>` : ""}</div>${this._statusPill(st)}</div>
        ${stats.length ? `<div class="stats">${stats.map((s) => `<span>${esc(s)}</span>`).join("")}</div>` : ""}
      </div>`;
  }

  _header(kind, board) {
    if (this._config.illustration === false)
      return `<div class="header">${this._titleBlock(kind, board)}${this._zoomButton("plain")}</div>`;
    return this._banner(kind, `<div class="head">${this._titleBlock(kind, board)}</div>${this._zoomButton(this._night() ? "on-night" : "")}`);
  }

  _tabsHtml(kind) {
    const tabs = this._tabs();
    if (tabs.length < 2) return "";
    return `<div class="tabs" role="tablist">${tabs
      .map(
        (k) =>
          `<button class="tab" role="tab" data-tab="${k}" aria-selected="${k === kind}">${esc(this._t(k === "dep" ? "departures" : "arrivals"))}</button>`,
      )
      .join("")}</div>`;
  }

  _row(info, kind) {
    const f = info.f;
    const parts = [flightLabel(f)];
    if (this._config.show_airline === true && (f.airline_short || f.airline)) parts.push(f.airline_short || f.airline);
    if (this._config.show_aircraft === true && (f.aircraft_code || f.aircraft_model)) parts.push(f.aircraft_code || f.aircraft_model);
    const extra = parts.filter(Boolean).join(" · ");
    const key = String(f.flight_id || `${flightLabel(f)}-${info.scheduled}`);
    const label = `${this._time(info.scheduled ?? info.expected)} ${cityOf(f)} ${extra}`;
    return `<div class="row" role="button" tabindex="0" data-key="${esc(key)}" data-flight="${esc(key)}" data-kind="${kind}" aria-label="${esc(label)}">
      <span class="time">${esc(this._time(info.scheduled ?? info.expected))}</span>
      <span class="where">${esc(cityOf(f) || "—")}${extra ? ` <span class="muted">· ${esc(extra)}</span>` : ""}</span>
      ${this._pill(info)}
    </div>`;
  }

  _list(kind, board) {
    if (!board.entity) return `<div class="empty">${esc(this._t("no_entities"))}</div>`;
    if (!board.tracked) return `<div class="empty">${esc(this._t("not_tracked"))}</div>`;
    const max = Math.max(1, Math.min(50, Math.round(num(this._config.max_flights) ?? 6)));
    const shown = board.flights.slice(0, max);
    if (!shown.length) return `<div class="empty">${esc(this._t("no_flights"))}</div>`;
    return `<div class="list">${shown.map((i) => this._row(i, kind)).join("")}</div>`;
  }

  _noEntities() {
    return `<style>${STYLE}</style><ha-card><div class="warning">${esc(this._t("no_entities"))}</div></ha-card>`;
  }

  _render() {
    const e = discover(this._hass, this._config);
    if (!e.departures && !e.arrivals) return this._noEntities();
    const kind = this._activeTab();
    const board = this._board(kind);
    return `<style>${STYLE}${this._extraStyle()}</style>
      <ha-card>
        ${this._header(kind, board)}
        ${this._tabsHtml(kind)}
        ${this._list(kind, board)}
        ${this._detailHtml()}
      </ha-card>`;
  }

  _extraStyle() {
    return "";
  }

  // The full card has no detail button.
  _zoomButton() {
    return "";
  }

  _findFlight(kind, key) {
    const s = this._s(discover(this._hass, this._config)[kind === "dep" ? "departures" : "arrivals"]);
    const f = (s?.attributes?.flights || []).find((x) => x && String(x.flight_id || `${flightLabel(x)}-${flightInfo(x, kind, 0).scheduled}`) === key);
    return f ? flightInfo(f, kind, this._now()) : null;
  }

  _detailHtml() {
    const d = this._detail;
    if (!d) return "";
    const info = this._findFlight(d.kind, d.key);
    if (!info) return "";
    const f = info.f;
    const dep = d.kind === "dep";
    const city = cityOf(f);
    const codes = [f.airport_code_iata, f.airport_code_icao].filter(Boolean).join(" / ");
    const airline = [f.airline, [f.airline_iata, f.airline_icao].filter(Boolean).join(" / ")].filter(Boolean);
    const aircraft = [f.aircraft_model || f.aircraft_code, f.aircraft_model && f.aircraft_code ? `(${f.aircraft_code})` : ""].filter(Boolean).join(" ");
    const place = [f.airport_name, f.airport_city && f.airport_city !== f.airport_name ? f.airport_city : "", f.airport_country_name].filter(Boolean).join(", ");
    const facts = [
      [this._t("airline"), airline.length > 1 ? `${airline[0]} (${airline[1]})` : airline[0]],
      [this._t("aircraft"), aircraft],
      [this._t("registration"), f.aircraft_registration],
      [this._t("callsign"), f.callsign],
      [this._t("scheduled"), info.scheduled !== null ? this._time(info.scheduled, true) : null, true],
      [this._t("estimated"), info.estimated !== null ? this._time(info.estimated, true) : null, true],
      [this._t("actual"), info.actual !== null ? this._time(info.actual, true) : null, true],
      [this._t(dep ? "destination" : "origin"), [place, codes ? `(${codes})` : ""].filter(Boolean).join(" ")],
    ].filter(([, v]) => v);
    const title = this._t(dep ? "to_city" : "from_city", { city: city || codes || "—" });
    const sub = [flightLabel(f), f.airline_short || f.airline].filter(Boolean).join(" · ") || this._t("flight");
    return `<div class="backdrop" data-action="backdrop">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="fb-dlg-title">
        <div class="mhead">
          <div class="badge">${svgIcon(dep ? ICONS.departures : ICONS.arrivals)}</div>
          <div><h3 id="fb-dlg-title">${esc(title)}</h3><div class="sub">${esc(sub)}</div></div>
          <button class="close" data-action="close" title="${esc(this._t("close"))}" aria-label="${esc(this._t("close"))}">${svgIcon(ICONS.close)}</button>
        </div>
        <div>${this._pill(info)}</div>
        <dl class="facts">${facts.map(([k, v, time]) => `<dt>${esc(k)}</dt><dd${time ? ' class="t"' : ""}>${esc(v)}</dd>`).join("")}</dl>
      </div>
    </div>`;
  }

  // Opens the flight popup; from the keyboard (no click count), the focus goes to its close button.
  _openDetail(kind, key, keyboard = false) {
    this._detail = { kind, key };
    window.addEventListener("keydown", this._onKey);
    this._update(this._sig);
    if (keyboard) this.shadowRoot.querySelector?.(".modal .close")?.focus({ preventScroll: true });
  }

  _closeDetail(refocus) {
    if (!this._detail) return;
    const { key } = this._detail;
    this._detail = null;
    window.removeEventListener("keydown", this._onKey);
    this._update(this._sig);
    if (refocus) this.shadowRoot.querySelector?.(`.row[data-flight="${CSS.escape(key)}"]`)?.focus({ preventScroll: true });
  }

  _click(ev) {
    const path = ev.composedPath();
    const action = path.find((n) => n.dataset?.action);
    if (this._detail) {
      // While the popup is open, its close button and the backdrop close it; a click in it does nothing else.
      if (action?.dataset.action === "close" || (action?.dataset.action === "backdrop" && path[0] === action)) this._closeDetail(true);
      return;
    }
    const tab = path.find((n) => n.dataset?.tab);
    if (tab) {
      if (tab.dataset.tab !== this._activeTab()) {
        this._tab = tab.dataset.tab;
        // A new plane: its animation starts again with the tab.
        this._run++;
        this._update(this._sig);
      }
      return;
    }
    const row = path.find((n) => n.dataset?.flight);
    if (row) this._openDetail(row.dataset.kind, row.dataset.flight, ev.detail === 0);
  }
}
