// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
import { STRINGS } from "./i18n/strings.js";

export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: Home Assistant's full locale when its base matches the card's resolved language (keeps the
// region, e.g. pt-BR or de-CH), otherwise the resolved language. Home Assistant's "pt" is European Portuguese,
// which Intl would format as Brazilian, so bare "pt" becomes "pt-PT".
export const fmtLang = (hass, config) => {
  const l = lang(hass, config);
  const ha = hass && (hass.locale?.language || hass.language);
  const loc = ha && ha.split("-")[0] === l.split("-")[0] && l !== "sr-Latn" ? ha : l;
  return loc === "pt" ? "pt-PT" : loc;
};

// A text of the card's language, English when missing, with its {placeholders} filled.
export const t = (hass, config, key, vars = {}) => {
  const s = STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key;
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
};

// "12 flights": the plural form of the card's language (Intl.PluralRules), the `_other` form when the language has
// no text for that form.
export const plural = (hass, config, key, n) => {
  let cat = "other";
  try {
    cat = new Intl.PluralRules(fmtLang(hass, config)).select(n);
  } catch (_e) {
    /* default form */
  }
  const table = STRINGS[lang(hass, config)];
  const k = `${key}_${cat}` in table ? `${key}_${cat}` : `${key}_other`;
  return t(hass, config, k, { n });
};

// The FlightRadar24 radar mark (images/flightradar24-mark.svg), the brand badge of the header icon.
export const FR24_MARK = `<svg class="mark" viewBox="0 0 45 45" fill="#1d1d1b" aria-hidden="true"><path d="M22.204,2.826C11.336,2.826,2.5,11.663,2.5,22.53c0,10.867,8.836,19.704,19.704,19.704s19.704-8.837,19.704-19.704C41.907,11.663,33.071,2.826,22.204,2.826zM22.204,39.27c-0.988,0-1.921-0.11-2.909-0.274l0.823-4.995c0.659,0.11,1.317,0.165,2.031,0.165c6.476,0,11.745-5.269,11.745-11.745c0-6.477-5.269-11.746-11.745-11.746c-6.477,0-11.746,5.269-11.746,11.746c0,3.787,1.811,7.135,4.555,9.275l-3.238,3.897c-3.897-3.074-6.421-7.849-6.421-13.172c0-9.276,7.519-16.795,16.794-16.795s16.795,7.519,16.795,16.795C38.889,31.696,31.479,39.27,22.204,39.27zM19.13,26.811c-1.372-0.933-2.25-2.525-2.25-4.281c0-2.909,2.36-5.269,5.269-5.269c2.908,0,5.269,2.36,5.269,5.269c0,2.909-2.36,5.269-5.269,5.269c-0.33,0-0.659-0.055-0.934-0.11l0.714-4.336L19.13,26.811zM22.204,29.062c2.964,0,5.489-1.977,6.257-4.666c0.11,0.165,0.33,0.274,0.549,0.274c0.384,0,0.769-0.329,0.769-0.769c0-0.439-0.33-0.768-0.769-0.768c-0.11,0-0.219,0.055-0.329,0.11c0.055-0.274,0.055-0.494,0.055-0.769c0-3.623-2.964-6.532-6.531-6.532s-6.531,2.964-6.531,6.532c0,2.195,1.043,4.116,2.689,5.269l-2.25,2.744c-2.415-1.866-3.952-4.775-3.952-8.013c0-0.988,0.165-1.976,0.439-2.909c0.11,0.055,0.22,0.11,0.33,0.11c0.384,0,0.768-0.329,0.768-0.768c0-0.33-0.219-0.604-0.549-0.714c1.592-3.458,5.104-5.818,9.166-5.818c5.543,0,10.099,4.556,10.099,10.099c0,4.116-2.47,7.684-6.037,9.275c-0.055-0.329-0.385-0.604-0.714-0.604c-0.384,0-0.768,0.329-0.768,0.768c0,0.11,0.055,0.274,0.11,0.384c-0.878,0.219-1.756,0.384-2.689,0.384c-0.604,0-1.208-0.055-1.756-0.165l0.604-3.512C21.435,29.006,21.819,29.062,22.204,29.062L22.204,29.062z"/><circle cx="11.775" cy="33.287" r="0.769"/><circle cx="22.204" cy="22.64" r="0.769"/><circle cx="28.131" cy="9.302" r="0.768"/><circle cx="14.958" cy="18.688" r="0.769"/></svg>`;
export const brandBadge = () => `<span class="brand" title="FlightRadar24">${FR24_MARK}</span>`;

export const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
