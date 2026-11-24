// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------
import { lang, t } from "./helpers.js";
import { PLATFORM } from "./flightradar24-entities.js";

// Options on by default (left out of the YAML while on), and off by default (left out while off).
export const ON_BY_DEFAULT = ["show_departures", "show_arrivals", "show_stats", "illustration", "zoom"];
export const OFF_BY_DEFAULT = ["show_past", "show_airline", "show_aircraft"];
export const LANGUAGES = [
  ["en", "English"], ["fr", "Français"], ["de", "Deutsch"], ["es", "Español"], ["sr", "Српски"], ["sr-Latn", "Srpski (latinica)"],
  ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português (Portugal)"], ["pl", "Polski"], ["ro", "Română"], ["da", "Dansk"],
  ["sv", "Svenska"], ["bg", "Български"], ["ru", "Русский"], ["uk", "Українська"], ["hu", "Magyar"], ["sk", "Slovenčina"],
  ["cs", "Čeština"], ["sl", "Slovenščina"], ["lv", "Latviešu"], ["el", "Ελληνικά"],
];

export class FlightBoardCardEditor extends HTMLElement {
  static get mini() {
    return false;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    const toggles = ["show_departures", "show_arrivals", "show_stats", "show_past", "show_airline", "show_aircraft", "illustration"];
    if (this.constructor.mini) toggles.push("zoom");
    return [
      { name: "departures_entity", selector: { entity: { domain: "sensor", integration: PLATFORM } } },
      { name: "arrivals_entity", selector: { entity: { domain: "sensor", integration: PLATFORM } } },
      { name: "airport_entity", selector: { entity: { domain: "text", integration: PLATFORM } } },
      { name: "title", selector: { text: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "default_tab",
            selector: { select: { mode: "dropdown", options: [{ value: "departures", label: tr("departures") }, { value: "arrivals", label: tr("arrivals") }] } },
          },
          {
            name: "illustration_theme",
            selector: {
              select: {
                mode: "dropdown",
                options: ["auto", "day", "night"].map((v) => ({ value: v, label: tr(`theme_${v}`) })),
              },
            },
          },
          { name: "max_flights", selector: { number: { min: 1, max: 50, step: 1, mode: "box" } } },
          { name: "hours_ahead", selector: { number: { min: 1, max: 48, step: 1, mode: "box", unit_of_measurement: "h" } } },
        ],
      },
      { type: "grid", name: "", schema: toggles.map((name) => ({ name, selector: { boolean: {} } })) },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => t(this._hass, this._config, s.name);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const config = { ...ev.detail.value };
        for (const [k, v] of Object.entries(config)) {
          // A minimal YAML: no empty values, no options left at their default.
          if (
            v === "" ||
            v === undefined ||
            v === null ||
            (ON_BY_DEFAULT.includes(k) && v === true) ||
            (OFF_BY_DEFAULT.includes(k) && v === false) ||
            (k === "default_tab" && v === "departures") ||
            (k === "illustration_theme" && v === "auto") ||
            (k === "max_flights" && v === 6)
          )
            delete config[k];
        }
        this._config = config;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { default_tab: "departures", illustration_theme: "auto", max_flights: 6, ...this._config };
    for (const k of ON_BY_DEFAULT) if (data[k] === undefined) data[k] = true;
    for (const k of OFF_BY_DEFAULT) if (data[k] === undefined) data[k] = false;
    this._form.hass = this._hass;
    this._form.data = data;
    // The schema only depends on the language of its labels: not rebuilt (nor ha-form re-rendered) on every hass update.
    const l = lang(this._hass, this._config);
    if (this._schemaLang !== l) {
      this._schemaLang = l;
      this._form.schema = this._schema();
    }
  }
}

export class FlightBoardMiniCardEditor extends FlightBoardCardEditor {
  static get mini() {
    return true;
  }
}
