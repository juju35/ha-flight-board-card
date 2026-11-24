// ---------------------------------------------------------------------------
// Flights
// ---------------------------------------------------------------------------

// A delay of this many minutes or more is shown as a delay.
export const DELAY_MIN = 15;
// A departure is shown as boarding from this long before its expected time (FlightRadar24 has no boarding status).
export const BOARDING_S = 30 * 60;
export const num = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

// What the card shows of a flight of the departures ("dep") or arrivals ("arr") board, at `now` (seconds):
// its times, its delay in minutes (estimated or actual time against the scheduled one) and its status:
// `key` (translation key), `cls` (colour: ok, warn, accent, danger, na).
export const flightInfo = (f, kind, now) => {
  const dep = kind === "dep";
  const scheduled = num(dep ? f.time_scheduled_departure : f.time_scheduled_arrival);
  const estimated = num(dep ? f.time_estimated_departure : f.time_estimated_arrival);
  const actual = num(dep ? f.time_real_departure : f.time_real_arrival);
  const expected = actual ?? estimated ?? scheduled;
  const later = actual ?? estimated;
  const delay = scheduled !== null && later !== null ? Math.round((later - scheduled) / 60) : null;
  const generic = String(f.status ?? "").toLowerCase();
  const text = String(f.status_text ?? "").toLowerCase();
  let key;
  let cls;
  if (/cancel/.test(generic) || /cancel/.test(text)) [key, cls] = ["canceled", "danger"];
  else if (/divert/.test(generic) || /divert/.test(text)) [key, cls] = ["diverted", "danger"];
  else if (!dep && (actual !== null || generic === "landed" || /^landed/.test(text))) [key, cls] = ["landed", "accent"];
  else if (dep && (actual !== null || generic === "departed" || /^departed/.test(text))) [key, cls] = ["departed", "accent"];
  else if ((delay !== null && delay >= DELAY_MIN) || generic === "delayed") [key, cls] = ["delayed", "warn"];
  else if (dep && (/boarding/.test(text) || (expected !== null && expected - now <= BOARDING_S && expected - now > -BOARDING_S)))
    [key, cls] = ["boarding", "accent"];
  else if (!dep && estimated !== null && (generic === "estimated" || num(f.time_real_departure) !== null)) [key, cls] = ["estimated", "accent"];
  else if (scheduled === null && (generic === "unknown" || !generic)) [key, cls] = ["unknown", "na"];
  else [key, cls] = ["on_time", "ok"];
  return { f, scheduled, estimated, actual, expected, delay, key, cls };
};

// A flight that has left (departed, landed), or whose time is long gone (canceled, no news).
export const isPast = (info, now) => info.key === "departed" || info.key === "landed" || (info.expected !== null && info.expected < now - 3600);

// The flights of a board as shown: sorted by scheduled time, past ones left out unless `show_past`, those beyond
// `hours_ahead` left out.
export const boardFlights = (flights, kind, now, config = {}) => {
  const hours = num(config.hours_ahead);
  return (Array.isArray(flights) ? flights : [])
    .filter((f) => f && typeof f === "object")
    .map((f) => flightInfo(f, kind, now))
    .filter((i) => config.show_past === true || !isPast(i, now))
    .filter((i) => !hours || i.expected === null || i.expected <= now + hours * 3600)
    .sort((a, b) => (a.scheduled ?? a.expected ?? Infinity) - (b.scheduled ?? b.expected ?? Infinity));
};

// Board statistics: on-time share and average delay, from the integration's statistics sensors (today at the
// airport) when they have values, else computed from the listed flights.
export const boardStats = (flights, sensors = {}) => {
  const onTime = num(sensors.on_time);
  const delayed = num(sensors.delayed);
  let pct = onTime !== null && delayed !== null && onTime + delayed > 0 ? onTime / (onTime + delayed) : null;
  let avg = num(sensors.delay_average);
  const known = flights.filter((i) => i.key !== "canceled" && i.key !== "diverted" && i.key !== "unknown");
  if (pct === null && known.length) pct = known.filter((i) => !(i.delay >= DELAY_MIN) && i.key !== "delayed").length / known.length;
  if (avg === null) {
    const delays = known.map((i) => i.delay).filter((d) => d !== null);
    avg = delays.length ? Math.round(delays.reduce((a, d) => a + Math.max(0, d), 0) / delays.length) : null;
  }
  return { count: flights.length, pct, avg };
};

export const flightLabel = (f) => String(f.flight_number || f.callsign || "").trim();
export const cityOf = (f) => f.airport_city || f.airport_name || f.airport_code_iata || f.airport_code_icao || "";
