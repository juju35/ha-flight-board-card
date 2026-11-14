// Mock FlightRadar24 airport entities for the screenshots and the browser tests: a fictional board at "RNS", with
// fictional airlines, on a fixed clock (NOW) so that every run renders the same times.
export const NOW = Date.parse("2026-06-12T09:41:00+02:00") / 1000;
export const TIME_ZONE = "Europe/Paris";

const AIRLINES = {
  NW: ["Northwind", "Northwind", "NWD"],
  AB: ["Atlantic Breeze Airways", "Atlantic Breeze", "ABZ"],
  BC: ["Bluecrest Air", "Bluecrest", "BCR"],
  ZX: ["Zephyr Air", "Zephyr", "ZPX"],
};
const AIRPORTS = {
  LIS: ["Lisbon Humberto Delgado Airport", "Lisbon", "LPPT", "Portugal", "PT"],
  AMS: ["Amsterdam Schiphol Airport", "Amsterdam", "EHAM", "Netherlands", "NL"],
  BCN: ["Barcelona El Prat Airport", "Barcelona", "LEBL", "Spain", "ES"],
  DUB: ["Dublin Airport", "Dublin", "EIDW", "Ireland", "IE"],
  MRS: ["Marseille Provence Airport", "Marseille", "LFML", "France", "FR"],
  MUC: ["Munich Airport", "Munich", "EDDM", "Germany", "DE"],
  OPO: ["Porto Airport", "Porto", "LPPR", "Portugal", "PT"],
  NCE: ["Nice Côte d'Azur Airport", "Nice", "LFMN", "France", "FR"],
  LGW: ["London Gatwick Airport", "London", "EGKK", "United Kingdom", "GB"],
  LYS: ["Lyon Saint-Exupéry Airport", "Lyon", "LFLL", "France", "FR"],
  GVA: ["Geneva Airport", "Geneva", "LSGG", "Switzerland", "CH"],
  BRU: ["Brussels Airport", "Brussels", "EBBR", "Belgium", "BE"],
  TLS: ["Toulouse Blagnac Airport", "Toulouse", "LFBO", "France", "FR"],
};
const AIRCRAFT = { A20N: "Airbus A320neo", E295: "Embraer E195-E2", AT76: "ATR 72-600", B738: "Boeing 737-800", A319: "Airbus A319" };

// min: scheduled time from NOW in minutes; est / real: minutes from NOW (or null).
const flight = (kind, i, { no, airport, min, est = null, real = null, status = "scheduled", text, aircraft = "A20N", reg }) => {
  const [airline, short, icao] = AIRLINES[no.slice(0, 2)];
  const [name, city, apIcao, country, cc] = AIRPORTS[airport];
  const at = (m) => (m === null ? null : NOW + m * 60);
  const dep = kind === "dep";
  // The other end of the flight: an hour and a half away.
  const other = (m) => (m === null ? null : at(m + (dep ? 90 : -90)));
  return {
    status_text: text ?? status.charAt(0).toUpperCase() + status.slice(1),
    status,
    flight_id: `${kind}${i}${no.replace(" ", "")}`,
    flight_number: no.replace(" ", ""),
    callsign: `${icao}${no.slice(3)}`,
    aircraft_model: AIRCRAFT[aircraft],
    aircraft_code: aircraft,
    aircraft_registration: reg ?? `F-H${"ZBCDEFGHJK"[i]}${"AXQ"[i % 3]}${"LMN"[i % 3]}`,
    airline,
    airline_short: short,
    airline_iata: no.slice(0, 2),
    airline_icao: icao,
    airport_name: name,
    airport_code_iata: airport,
    airport_code_icao: apIcao,
    airport_country_name: country,
    airport_country_code: cc,
    airport_city: city,
    time_scheduled_departure: dep ? at(min) : other(min),
    time_scheduled_arrival: dep ? other(min) : at(min),
    time_real_departure: dep ? at(real) : real === null && est === null ? null : other(min),
    time_real_arrival: dep ? null : at(real),
    time_estimated_departure: dep ? at(est) : null,
    time_estimated_arrival: dep ? (est === null ? null : other(est)) : at(est),
  };
};

const DEPARTURES = [
  { no: "ZX 1235", airport: "LIS", min: -11, real: -5, status: "departed", text: "Departed 09:36" },
  { no: "AB 482", airport: "AMS", min: 14, est: 14, aircraft: "E295" },
  { no: "NW 3317", airport: "BCN", min: 29, est: 54, status: "delayed", text: "Delayed 10:35" },
  { no: "BC 219", airport: "DUB", min: 44, aircraft: "AT76" },
  { no: "ZX 1871", airport: "MRS", min: 59, est: 59, aircraft: "A319" },
  { no: "AB 902", airport: "MUC", min: 84, status: "canceled", text: "Canceled", aircraft: "E295" },
  { no: "NW 640", airport: "OPO", min: 99, aircraft: "B738" },
  { no: "BC 77", airport: "NCE", min: 124, est: 132, aircraft: "AT76" },
].map((f, i) => flight("dep", i, f));

const ARRIVALS = [
  { no: "ZX 1236", airport: "LIS", min: -21, est: -17, real: -17, status: "landed", text: "Landed 09:24" },
  { no: "AB 481", airport: "AMS", min: 9, est: 6, status: "estimated", text: "Estimated 09:47", aircraft: "E295" },
  { no: "BC 210", airport: "LGW", min: 24, est: 59, status: "delayed", text: "Delayed 11:05", aircraft: "AT76" },
  { no: "NW 3318", airport: "LYS", min: 39, est: 41, status: "estimated", text: "Estimated 10:22", aircraft: "B738" },
  { no: "ZX 1872", airport: "GVA", min: 64, aircraft: "A319" },
  { no: "AB 707", airport: "BRU", min: 79, status: "diverted", text: "Diverted to NTE", aircraft: "E295" },
  { no: "NW 902", airport: "TLS", min: 109 },
].map((f, i) => flight("arr", i, f));

const st = (entity_id, state, attributes = {}) => ({ entity_id, state: String(state), attributes, last_changed: new Date(NOW * 1000).toISOString() });

export const mockHass = ({ language = "en", dark = false, sun, tracked = true } = {}) => {
  const states = {
    "sensor.flightradar24_airport_departures": st("sensor.flightradar24_airport_departures", tracked ? DEPARTURES.length : "unavailable", tracked ? { flights: DEPARTURES } : {}),
    "sensor.flightradar24_airport_arrivals": st("sensor.flightradar24_airport_arrivals", tracked ? ARRIVALS.length : "unavailable", tracked ? { flights: ARRIVALS } : {}),
    "sensor.flightradar24_departures_on_time": st("sensor.flightradar24_departures_on_time", 34),
    "sensor.flightradar24_departures_delayed": st("sensor.flightradar24_departures_delayed", 3),
    "sensor.flightradar24_departures_delay_average": st("sensor.flightradar24_departures_delay_average", 8),
    "sensor.flightradar24_airport_arrivals_on_time": st("sensor.flightradar24_airport_arrivals_on_time", 30),
    "sensor.flightradar24_airport_arrivals_delayed": st("sensor.flightradar24_airport_arrivals_delayed", 5),
    "sensor.flightradar24_arrivals_delay_average": st("sensor.flightradar24_arrivals_delay_average", 12),
    "text.flightradar24_airport_track": st("text.flightradar24_airport_track", tracked ? "RNS" : ""),
  };
  if (sun) states["sun.sun"] = st("sun.sun", sun);
  return {
    states,
    entities: {},
    language,
    locale: { language, time_format: "24", time_zone: "server" },
    config: { time_zone: TIME_ZONE },
    themes: { darkMode: dark },
  };
};
