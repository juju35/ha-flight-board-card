// ---------------------------------------------------------------------------
// FlightRadar24 entities
// ---------------------------------------------------------------------------

export const PLATFORM = "flightradar24";
// Translation keys of the integration's airport entities, and their default entity ids (const.py,
// STABLE_ENTITY_OBJECT_IDS: the delay and canceled sensors have no "airport_" in their ids).
export const KEYS = {
  departures: ["airport_departures", "sensor.flightradar24_airport_departures"],
  arrivals: ["airport_arrivals", "sensor.flightradar24_airport_arrivals"],
  departures_on_time: ["airport_departures_on_time", "sensor.flightradar24_departures_on_time"],
  departures_delayed: ["airport_departures_delayed", "sensor.flightradar24_departures_delayed"],
  departures_delay_average: ["airport_departures_delay_average", "sensor.flightradar24_departures_delay_average"],
  departures_canceled: ["airport_departures_canceled", "sensor.flightradar24_departures_canceled"],
  arrivals_on_time: ["airport_arrivals_on_time", "sensor.flightradar24_airport_arrivals_on_time"],
  arrivals_delayed: ["airport_arrivals_delayed", "sensor.flightradar24_airport_arrivals_delayed"],
  arrivals_delay_average: ["airport_arrivals_delay_average", "sensor.flightradar24_arrivals_delay_average"],
  arrivals_canceled: ["airport_arrivals_canceled", "sensor.flightradar24_arrivals_canceled"],
  track: ["airport_track", "text.flightradar24_airport_track"],
};
// Older releases of the integration named the departures stats like the arrivals ones.
export const LEGACY_IDS = {
  departures_on_time: "sensor.flightradar24_airport_departures_on_time",
  departures_delayed: "sensor.flightradar24_airport_departures_delayed",
};

export const _found = new Map();
// The airport entities: the configured ones, else those of the integration's registry entries (on the same device
// as the configured departures or arrivals sensor when one is set), else the default entity ids.
export const discover = (hass, config = {}) => {
  const states = hass?.states || {};
  const entities = hass?.entities;
  const key = [config.departures_entity, config.arrivals_entity, config.airport_entity].join("|");
  const cached = _found.get(key);
  // The same states object (several calls in one render): no need to count the entities again.
  if (cached && cached.entities === entities && cached.states === states) return cached.out;
  if (cached && cached.entities === entities && cached.count === Object.keys(states).length) {
    cached.states = states;
    return cached.out;
  }
  const out = {};
  const reg = Object.values(entities || {}).filter((e) => e && e.platform === PLATFORM && e.translation_key);
  const anchor = [config.departures_entity, config.arrivals_entity].map((id) => entities?.[id]).find(Boolean);
  const device = anchor?.device_id;
  for (const [k, [tk, id]] of Object.entries(KEYS)) {
    const matches = reg.filter((e) => e.translation_key === tk);
    const pick = matches.find((e) => device && e.device_id === device && states[e.entity_id]) || matches.find((e) => states[e.entity_id]);
    out[k] = pick?.entity_id || (states[id] ? id : LEGACY_IDS[k] && states[LEGACY_IDS[k]] ? LEGACY_IDS[k] : undefined);
  }
  if (config.departures_entity) out.departures = config.departures_entity;
  if (config.arrivals_entity) out.arrivals = config.arrivals_entity;
  if (config.airport_entity) out.track = config.airport_entity;
  _found.set(key, { entities, states, count: Object.keys(states).length, out });
  return out;
};
