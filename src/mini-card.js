// ---------------------------------------------------------------------------
// The mini card: the next flight on the banner; its detail button unfolds the full card
// ---------------------------------------------------------------------------
import { ICONS } from "./core.js";
import { brandBadge, esc, svgIcon } from "./helpers.js";
import { discover } from "./flightradar24-entities.js";
import { cityOf, flightLabel, isPast } from "./flights.js";
import { inDialog, watchOutside } from "./shadow-dom-patching.js";
import { MINI_STYLE, STYLE, ZOOM_STYLE } from "./styles.js";
import { FlightBoardCard } from "./full-card.js";

export class FlightBoardMiniCard extends FlightBoardCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onFold = (ev) => {
      // The click that closed the flight popup only closes the popup.
      if (this._detailClosedBy === ev) return;
      if (this._zoomed && !inDialog(ev)) this._setZoom(false);
    };
  }

  static getConfigElement() {
    return document.createElement("flight-board-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    (this._foldWatch ??= watchOutside(this, (ev) => this._onFold(ev))).on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._foldWatch?.off();
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 };
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    if (!zoomed) {
      this._detail = null;
      window.removeEventListener("keydown", this._onKey);
    }
    this._run++;
    this._update(this._sig);
  }

  _click(ev) {
    if (!this._detail && ev.composedPath().some((n) => n.classList?.contains("zoom"))) {
      ev.stopPropagation();
      this._setZoom(!this._zoomed);
      if (ev.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
      return;
    }
    super._click(ev);
  }

  _extraStyle() {
    return this._zoomed ? ZOOM_STYLE : "";
  }

  _zoomButton(cls = "") {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom ${cls}" title="${label}" aria-label="${label}" aria-expanded="${z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  // "in 23 min", "in 1 h 05", "now", "12 min ago".
  _until(sec) {
    if (sec === null) return "";
    const m = Math.round((sec - this._now()) / 60);
    if (m < 0) return this._t("minutes_ago", { n: -m });
    if (m === 0) return this._t("now");
    if (m < 60) return this._t("in_minutes", { n: m });
    return this._t("in_hours", { h: Math.floor(m / 60), m: String(m % 60).padStart(2, "0") });
  }

  // The sky of the compact view: the next flight (its time, then its status pill), else the airport with the
  // board's status pill and why nothing is shown. `cls` is the status colour, also the header icon's.
  _next(kind, board) {
    const empty = (key) => {
      const st = this._boardStatus(board);
      return {
        cls: st.cls,
        html: `<div class="next"><div class="l1"><span class="name">${esc(this._airport().title)}</span>${this._statusPill(st)}</div>
          <div class="none" title="${esc(this._t(key))}">${esc(this._t(key))}</div></div>`,
      };
    };
    if (!board.entity) return empty("no_entities");
    if (!board.tracked) return empty("not_tracked");
    const now = this._now();
    // The next flight still to come (the first of the board when every one has gone).
    const info = board.flights.find((i) => !isPast(i, now) && (i.expected ?? 0) >= now - 300) || board.flights.find((i) => !isPast(i, now));
    if (!info) return empty("no_flights");
    const f = info.f;
    const city = cityOf(f) || "—";
    const what = [flightLabel(f), this._until(info.expected)].filter(Boolean).join(" · ");
    return {
      cls: info.cls,
      html: `<div class="next" data-key="next-${esc(String(f.flight_id || flightLabel(f)))}">
      <div class="l1"><span class="clock">${esc(this._time(info.scheduled ?? info.expected))}</span>${this._pill(info, true)}</div>
      <div class="city">${esc(this._t(kind === "dep" ? "to_city" : "from_city", { city }))}</div>
      <div class="what">${esc(what)}</div>
    </div>`,
    };
  }

  _render() {
    if (this._zoomed) return super._render();
    const e = discover(this._hass, this._config);
    if (!e.departures && !e.arrivals) return this._noEntities();
    const kind = this._activeTab();
    const board = this._board(kind);
    const next = this._next(kind, board);
    const badge = `<div class="badge ${next.cls}">${svgIcon(kind === "dep" ? ICONS.departures : ICONS.arrivals)}${brandBadge()}</div>`;
    const inner = `<div class="head">${badge}${next.html}</div>`;
    const header =
      this._config.illustration === false
        ? `<div class="header plainmini">${badge}${next.html}${this._zoomButton("plain")}</div>`
        : this._banner(kind, `${inner}${this._zoomButton(this._night() ? "on-night" : "")}`);
    return `<style>${STYLE}${MINI_STYLE}${this._config.illustration === false ? ZOOM_STYLE : ""}</style>
      <ha-card>${header}</ha-card>`;
  }
}
