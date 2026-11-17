import assert from "node:assert/strict";
import { test } from "node:test";
import { mockHass, NOW } from "../scripts/screenshots/mock.mjs";
import { load } from "./load.mjs";

const fb = load([
  "flightInfo",
  "boardFlights",
  "boardStats",
  "discover",
  "plural",
  "STRINGS",
  "FlightBoardCard",
  "FlightBoardMiniCard",
  "FlightBoardCardEditor",
  "FlightBoardMiniCardEditor",
  "document",
  "window",
]);

const card = (Cls, config = {}, hass = mockHass()) => {
  const el = new Cls();
  el._now = () => NOW;
  el.setConfig({ type: "custom:x", ...config });
  el._hass = hass;
  return el;
};
const at = (min) => NOW + min * 60;
const dep = (o) => ({ status: "scheduled", status_text: "Scheduled", flight_number: "ZX1", airport_city: "Lisbon", ...o });

test("status: on time, delayed from the estimated time, boarding 30 minutes before, departed once it has left", () => {
  assert.equal(fb.flightInfo(dep({ time_scheduled_departure: at(120) }), "dep", NOW).key, "on_time");
  const late = fb.flightInfo(dep({ time_scheduled_departure: at(120), time_estimated_departure: at(145) }), "dep", NOW);
  assert.equal(late.key, "delayed");
  assert.equal(late.delay, 25);
  assert.equal(late.cls, "warn");
  // Ten minutes late is still on time.
  assert.equal(fb.flightInfo(dep({ time_scheduled_departure: at(120), time_estimated_departure: at(130) }), "dep", NOW).key, "on_time");
  assert.equal(fb.flightInfo(dep({ time_scheduled_departure: at(20) }), "dep", NOW).key, "boarding");
  const gone = fb.flightInfo(dep({ time_scheduled_departure: at(-10), time_real_departure: at(-4) }), "dep", NOW);
  assert.equal(gone.key, "departed");
  assert.equal(gone.cls, "accent");
});

test("status: cancelled and diverted flights are dangers, whatever their times", () => {
  assert.equal(fb.flightInfo(dep({ status: "canceled", time_scheduled_departure: at(20) }), "dep", NOW).cls, "danger");
  assert.equal(fb.flightInfo(dep({ status: "unknown", status_text: "Canceled", time_scheduled_departure: at(20) }), "dep", NOW).key, "canceled");
  assert.equal(fb.flightInfo(dep({ status: "diverted", status_text: "Diverted to NTE", time_scheduled_arrival: at(20) }), "arr", NOW).key, "diverted");
});

test("status: an arrival in the air is estimated, landed once it has its actual time", () => {
  const air = { status: "estimated", time_scheduled_arrival: at(30), time_estimated_arrival: at(28), time_real_departure: at(-60) };
  assert.equal(fb.flightInfo(air, "arr", NOW).key, "estimated");
  assert.equal(fb.flightInfo({ ...air, time_real_arrival: at(-2) }, "arr", NOW).key, "landed");
  // An arrival 35 minutes late is a delay, not an estimate.
  assert.equal(fb.flightInfo({ ...air, time_estimated_arrival: at(65) }, "arr", NOW).delay, 35);
  assert.equal(fb.flightInfo({ ...air, time_estimated_arrival: at(65) }, "arr", NOW).key, "delayed");
});

test("missing times (null) never break a flight", () => {
  const info = fb.flightInfo({ status: null, status_text: null }, "dep", NOW);
  assert.equal(info.scheduled, null);
  assert.equal(info.delay, null);
  assert.equal(info.key, "unknown");
});

test("the board leaves out past flights unless show_past, and flights beyond hours_ahead", () => {
  const flights = mockHass().states["sensor.flightradar24_airport_departures"].attributes.flights;
  const all = fb.boardFlights(flights, "dep", NOW, {});
  assert.equal(all.length, 7);
  assert.ok(!all.some((i) => i.key === "departed"));
  assert.equal(fb.boardFlights(flights, "dep", NOW, { show_past: true }).length, 8);
  // Within the next hour: Amsterdam, Barcelona (expected 10:35), Dublin, Marseille.
  assert.deepEqual(
    [...fb.boardFlights(flights, "dep", NOW, { hours_ahead: 1 }).map((i) => i.f.airport_city)],
    ["Amsterdam", "Barcelona", "Dublin", "Marseille"],
  );
  // Sorted by scheduled time.
  const times = [...all.map((i) => i.scheduled)];
  assert.deepEqual(times, [...times].sort((a, b) => a - b));
  assert.equal(fb.boardFlights(null, "dep", NOW).length, 0);
});

test("statistics: the integration's sensors first, else computed from the flights", () => {
  const flights = fb.boardFlights(mockHass().states["sensor.flightradar24_airport_departures"].attributes.flights, "dep", NOW, {});
  const s = fb.boardStats(flights, { on_time: "34", delayed: "3", delay_average: "8" });
  assert.equal(s.count, 7);
  assert.equal(Math.round(s.pct * 100), 92);
  assert.equal(s.avg, 8);
  const computed = fb.boardStats(flights, { on_time: "unavailable" });
  // 6 known flights (the cancelled one left out), one delayed.
  assert.equal(Math.round(computed.pct * 100), 83);
  assert.ok(computed.avg > 0);
});

test("discovery: registry entries by translation key, whatever their entity ids", () => {
  const states = {
    "sensor.vols_depart": { entity_id: "sensor.vols_depart", state: "3", attributes: { flights: [] } },
    "sensor.vols_arrivee": { entity_id: "sensor.vols_arrivee", state: "3", attributes: { flights: [] } },
    "sensor.retard_moyen": { entity_id: "sensor.retard_moyen", state: "4", attributes: {} },
    "text.aeroport": { entity_id: "text.aeroport", state: "NTE", attributes: {} },
  };
  const entities = {
    "sensor.vols_depart": { entity_id: "sensor.vols_depart", platform: "flightradar24", translation_key: "airport_departures", device_id: "d" },
    "sensor.vols_arrivee": { entity_id: "sensor.vols_arrivee", platform: "flightradar24", translation_key: "airport_arrivals", device_id: "d" },
    "sensor.retard_moyen": { entity_id: "sensor.retard_moyen", platform: "flightradar24", translation_key: "airport_departures_delay_average", device_id: "d" },
    "text.aeroport": { entity_id: "text.aeroport", platform: "flightradar24", translation_key: "airport_track", device_id: "d" },
  };
  const e = fb.discover({ states, entities }, {});
  assert.equal(e.departures, "sensor.vols_depart");
  assert.equal(e.arrivals, "sensor.vols_arrivee");
  assert.equal(e.departures_delay_average, "sensor.retard_moyen");
  assert.equal(e.track, "text.aeroport");
});

test("discovery: the default entity ids without registry, and the configured entities first", () => {
  const hass = mockHass();
  const e = fb.discover(hass, {});
  assert.equal(e.departures, "sensor.flightradar24_airport_departures");
  assert.equal(e.departures_on_time, "sensor.flightradar24_departures_on_time");
  assert.equal(e.arrivals_delay_average, "sensor.flightradar24_arrivals_delay_average");
  assert.equal(e.track, "text.flightradar24_airport_track");
  assert.equal(fb.discover(hass, { departures_entity: "sensor.other" }).departures, "sensor.other");
  assert.equal(Object.values(fb.discover({ states: {} }, {})).filter(Boolean).length, 0);
});

test("plural forms follow the language, the other form when a language has no text for one", () => {
  const n = (language, count) => fb.plural({ language }, {}, "flights", count);
  assert.equal(n("en", 1), "1 flight");
  assert.equal(n("en", 12), "12 flights");
  assert.equal(n("fr", 1), "1 vol");
  assert.equal(n("pl", 3), "3 loty");
  assert.equal(n("pl", 5), "5 lotów");
  assert.equal(n("ru", 21), "21 рейс");
  assert.equal(n("sl", 2), "2 leta");
});

test("the full card: header stats, tabs, one row per flight up to max_flights, the delay in the pill", () => {
  const html = card(fb.FlightBoardCard)._render();
  assert.match(html, /class="name">RNS</);
  assert.match(html, /<span>7 flights<\/span><span>92% on time<\/span><span>avg \+8 min<\/span>/);
  assert.match(html, /data-tab="dep" aria-selected="true"/);
  assert.equal((html.match(/class="row"/g) || []).length, 6);
  assert.match(html, /\+25 min/);
  assert.match(html, /plane dep/);
  assert.equal((card(fb.FlightBoardCard, { max_flights: 3 })._render().match(/class="row"/g) || []).length, 3);
});

test("default_tab, show_arrivals and the title", () => {
  const arr = card(fb.FlightBoardCard, { default_tab: "arrivals", title: "Rennes" })._render();
  assert.match(arr, /data-tab="arr" aria-selected="true"/);
  assert.match(arr, /plane arr/);
  assert.match(arr, /Rennes <span class="code">RNS<\/span>/);
  assert.match(arr, /\+35 min/);
  const one = card(fb.FlightBoardCard, { show_arrivals: false, default_tab: "arrivals" })._render();
  assert.doesNotMatch(one, /class="tabs"/);
  assert.match(one, /plane dep/);
});

test("a click on a tab switches the board and starts the plane again", () => {
  const el = card(fb.FlightBoardCard);
  el._update = () => {};
  const tab = { dataset: { tab: "arr" } };
  el._click({ composedPath: () => [tab], detail: 1 });
  assert.equal(el._activeTab(), "arr");
  assert.equal(el._run, 1);
  assert.match(el._render(), /data-key="plane-arr-1"/);
});

test("a click on a flight opens its detail at the top of the card, a click elsewhere closes it", () => {
  const el = card(fb.FlightBoardCard);
  el._update = () => {};
  const row = { dataset: { flight: "dep2NW3317", kind: "dep" } };
  el._click({ composedPath: () => [row], detail: 1 });
  const html = el._render();
  assert.match(html, /class="backdrop"/);
  assert.match(html, /to Barcelona/);
  assert.match(html, /Northwind \(NW \/ NWD\)/);
  assert.match(html, /Barcelona El Prat Airport, Barcelona, Spain \(BCN \/ LEBL\)/);
  // A click outside the card closes it.
  el._onOutside({ composedPath: () => [] });
  assert.equal(el._detail, null);
  // Opened again, then the card leaves the page: closed.
  el._click({ composedPath: () => [row], detail: 1 });
  el.disconnectedCallback();
  assert.equal(el._detail, null);
});

test("the detail of a flight shows its times with the weekday when it is not today", () => {
  const el = card(fb.FlightBoardCard);
  assert.equal(el._time(NOW), "09:41");
  assert.match(el._time(NOW + 86400, true), /^Sat,? 09:41$/);
});

test("an airport not tracked yet, and no FlightRadar24 entity at all", () => {
  assert.match(card(fb.FlightBoardCard, {}, mockHass({ tracked: false }))._render(), /No airport tracked/);
  assert.match(card(fb.FlightBoardCard, {}, { states: {}, language: "en" })._render(), /No FlightRadar24 airport sensors found/);
});

test("night illustration: forced, else the sun below the horizon or the dark theme", () => {
  assert.match(card(fb.FlightBoardCard, { illustration_theme: "night" })._render(), /class="banner night"/);
  assert.match(card(fb.FlightBoardCard, { illustration_theme: "night" }, mockHass({ sun: "above_horizon" }))._render(), /banner night/);
  assert.doesNotMatch(card(fb.FlightBoardCard, { illustration_theme: "day" }, mockHass({ dark: true }))._render(), /banner night/);
  assert.doesNotMatch(card(fb.FlightBoardCard, { illustration_theme: "day" }, mockHass({ sun: "below_horizon", dark: true }))._render(), /banner night/);
  assert.match(card(fb.FlightBoardCard, {}, mockHass({ sun: "below_horizon" }))._render(), /banner night/);
  assert.match(card(fb.FlightBoardCard, {}, mockHass({ dark: true }))._render(), /banner night/);
  assert.doesNotMatch(card(fb.FlightBoardCard, {}, mockHass({ sun: "above_horizon" }))._render(), /banner night/);
  assert.doesNotMatch(card(fb.FlightBoardCard, {}, mockHass())._render(), /banner night/);
});

test("a dark theme while the sun is up shows the night illustration", () => {
  assert.match(card(fb.FlightBoardCard, {}, mockHass({ sun: "above_horizon", dark: true }))._render(), /class="banner night"/);
  assert.match(card(fb.FlightBoardMiniCard, {}, mockHass({ sun: "above_horizon", dark: true }))._render(), /class="banner night"/);
});

test("illustration: false gives the classic header with its round icon", () => {
  const html = card(fb.FlightBoardCard, { illustration: false })._render();
  assert.doesNotMatch(html, /class="scene"/);
  assert.match(html, /<div class="header"><div class="badge (ok|warn|danger|na)">/);
});

test("the mini card: the next flight on the banner, its countdown and status", () => {
  const html = card(fb.FlightBoardMiniCard)._render();
  assert.match(html, /class="clock">09:55</);
  assert.match(html, /to Amsterdam/);
  assert.match(html, /AB482 · in 14 min/);
  assert.match(html, /Boarding/);
  assert.doesNotMatch(html, /class="row"/);
  const arr = card(fb.FlightBoardMiniCard, { default_tab: "arrivals" })._render();
  assert.match(arr, /from Amsterdam/);
  assert.match(arr, /in 6 min/);
});

test("the mini card's detail button unfolds the full card; a click outside folds it back", () => {
  const el = card(fb.FlightBoardMiniCard);
  el._update = () => {};
  const zoom = { classList: { contains: (c) => c === "zoom" }, dataset: {} };
  el._click({ composedPath: () => [zoom], detail: 1, stopPropagation() {} });
  assert.equal(el._zoomed, true);
  assert.match(el._render(), /class="row"/);
  assert.deepEqual({ ...el.getGridOptions() }, { columns: 12, min_columns: 8 });
  // A flight popup open: the click outside only closes the popup.
  el._click({ composedPath: () => [{ dataset: { flight: "dep1AB482", kind: "dep" } }], detail: 1 });
  const out = { composedPath: () => [] };
  el._onOutside(out);
  el._onFold(out);
  assert.equal(el._detail, null);
  assert.equal(el._zoomed, true);
  el._onFold({ composedPath: () => [] });
  assert.equal(el._zoomed, false);
  assert.deepEqual({ ...el.getGridOptions() }, { columns: 6, min_columns: 6 });
  // zoom: false removes the button.
  assert.doesNotMatch(card(fb.FlightBoardMiniCard, { zoom: false })._render(), /class="zoom/);
});

test("the mini card folds back when it leaves the page", () => {
  const el = card(fb.FlightBoardMiniCard);
  el._update = () => {};
  el._setZoom(true);
  el.disconnectedCallback();
  assert.equal(el._zoomed, false);
});

test("the editors keep the YAML minimal and the mini card's editor has the full card's options", () => {
  const ed = new fb.FlightBoardCardEditor();
  let form;
  fb.document.createElement = (tag) => {
    form = { tag, listeners: {}, addEventListener(t, f) { this.listeners[t] = f; } };
    return form;
  };
  ed.appendChild = () => {};
  ed.dispatchEvent = (ev) => {
    ed.last = ev.detail.config;
  };
  ed.setConfig({ type: "custom:flight-board-card" });
  ed.hass = mockHass();
  assert.equal(form.data.max_flights, 6);
  assert.equal(form.data.show_departures, true);
  form.listeners["value-changed"]({
    stopPropagation() {},
    detail: { value: { type: "custom:flight-board-card", max_flights: 6, show_departures: true, show_past: false, default_tab: "departures", illustration_theme: "night", title: "" } },
  });
  assert.deepEqual({ ...ed.last }, { type: "custom:flight-board-card", illustration_theme: "night" });
  const names = (schema) => schema.flatMap((s) => (s.schema ? names(s.schema) : [s.name]));
  const full = names(ed._schema());
  const mini = new fb.FlightBoardMiniCardEditor();
  mini._config = {};
  const miniNames = names(mini._schema());
  for (const n of full) assert.ok(miniNames.includes(n), n);
  assert.ok(miniNames.includes("zoom") && !full.includes("zoom"));
});

const LANGS = ["en", "fr", "de", "es", "sr", "sr-Latn", "it", "nl", "pt", "pl", "ro", "da", "sv", "bg", "ru", "uk", "hu", "sk", "cs", "sl", "lv", "el"];
const vars = (s) => s.match(/\{\w+\}/g)?.sort() ?? [];

test("every language has every English text, with the same placeholders", () => {
  assert.deepEqual([...Object.keys(fb.STRINGS)], LANGS);
  const ref = [...Object.keys(fb.STRINGS.en)].sort();
  for (const l of LANGS.slice(1)) {
    const table = fb.STRINGS[l];
    // Extra plural forms (zero, two, few, many) only next to the English one / other pair.
    const extra = Object.keys(table).filter((k) => !(k in fb.STRINGS.en));
    for (const k of extra) assert.match(k, /^flights_(zero|two|few|many)$/, `${l}.${k}`);
    assert.deepEqual([...Object.keys(table).filter((k) => k in fb.STRINGS.en)].sort(), ref, l);
    for (const k of Object.keys(table)) {
      const en = fb.STRINGS.en[k] ?? fb.STRINGS.en.flights_other;
      assert.ok(table[k].trim(), `${l}.${k} empty`);
      assert.deepEqual(vars(table[k]), vars(en), `${l}.${k} placeholders`);
    }
  }
});

test("every flight status is translated", () => {
  for (const l of LANGS.slice(1))
    for (const k of Object.keys(fb.STRINGS.en).filter((x) => x.startsWith("status_")))
      assert.notEqual(fb.STRINGS[l][k], undefined, `${l}.${k}`);
});

test("the FlightRadar24 mark sits as a badge on the header icon of both cards, illustrated or not", () => {
  for (const [Cls, config] of [
    [fb.FlightBoardCard, {}],
    [fb.FlightBoardCard, { illustration: false }],
    [fb.FlightBoardMiniCard, {}],
    [fb.FlightBoardMiniCard, { illustration: false }],
  ]) {
    const html = card(Cls, config)._render();
    assert.match(html, /<div class="badge (?:ok|warn|danger|na|accent)"><svg class="icon [^"]*"[^>]*>.*?<\/svg><span class="brand" title="FlightRadar24"><svg class="mark" viewBox="0 0 45 45"/s);
  }
});

test("the header's status pill: cancellations, else delays, else on time; grey when nothing is tracked or listed", () => {
  const withDepartures = (flights) => {
    const h = mockHass();
    h.states["sensor.flightradar24_airport_departures"] = { ...h.states["sensor.flightradar24_airport_departures"], attributes: { flights } };
    return h;
  };
  const pill = (html) => html.match(/<div class="trow">.*?<span class="chip hpill (\w+)" title="([^"]*)">/s)?.slice(1);
  const badge = (html) => html.match(/<div class="badge (\w+)">/)?.[1];
  const flights = [dep({ flight_id: "a", time_scheduled_departure: at(120) }), dep({ flight_id: "b", time_scheduled_departure: at(150) })];
  let html = card(fb.FlightBoardCard, {}, withDepartures(flights))._render();
  assert.deepEqual(pill(html), ["ok", "On time"]);
  assert.equal(badge(html), "ok");
  flights.push(dep({ flight_id: "c", time_scheduled_departure: at(160), time_estimated_departure: at(190) }));
  html = card(fb.FlightBoardCard, {}, withDepartures(flights))._render();
  assert.deepEqual(pill(html), ["warn", "Delays"]);
  assert.equal(badge(html), "warn");
  flights.push(dep({ flight_id: "d", time_scheduled_departure: at(170), status: "canceled", status_text: "Canceled" }));
  html = card(fb.FlightBoardCard, {}, withDepartures(flights))._render();
  assert.deepEqual(pill(html), ["danger", "Cancellations"]);
  assert.equal(badge(html), "danger");
  // Only the flights listed count (max_flights).
  assert.deepEqual(pill(card(fb.FlightBoardCard, { max_flights: 2 }, withDepartures(flights))._render()), ["ok", "On time"]);
  assert.deepEqual(pill(card(fb.FlightBoardCard, {}, withDepartures([]))._render()), ["na", "No flights"]);
  html = card(fb.FlightBoardCard, {}, mockHass({ tracked: false }))._render();
  assert.deepEqual(pill(html), ["na", "Not tracked"]);
  assert.equal(badge(html), "na");
  // Translated, and in the classic header too.
  assert.deepEqual(pill(card(fb.FlightBoardCard, { language: "fr", illustration: false }, withDepartures(flights))._render()), ["danger", "Annulations"]);
});

test("the mini card's pill: the next flight's status beside its time, the board's beside the airport when none is shown", () => {
  const mini = card(fb.FlightBoardMiniCard)._render();
  const [, cls] = mini.match(/<div class="l1"><span class="clock">[^<]*<\/span><span class="chip hpill (\w+)"/) || [];
  assert.ok(cls, "pill beside the clock");
  assert.match(mini, new RegExp(`<div class="badge ${cls}">`));
  const off = card(fb.FlightBoardMiniCard, {}, mockHass({ tracked: false }))._render();
  assert.match(off, /<div class="l1"><span class="name">Airport<\/span><span class="chip hpill na" title="Not tracked">/);
  assert.match(off, /<div class="badge na">/);
  assert.match(off, /No airport tracked/);
});
