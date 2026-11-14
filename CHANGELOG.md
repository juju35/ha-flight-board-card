# Changelog

## 1.0.0 - 2026-11-14

### Features
- **Flight Board Card** (`custom:flight-board-card`): the departures and arrivals board of the airport tracked by the [FlightRadar24 integration](https://github.com/AlexandrErohin/home-assistant-flightradar24), its sensors discovered through the entity registry (renamed or localised entities included) or their default entity ids ([#1](https://github.com/juju35/ha-flight-board-card/issues/1), idea by @mielikki33).
- Animated illustration as header, drawn in SVG: sky, hills, terminal, control tower with its blinking beacon, waving windsock, sun or moon, drifting clouds, and a runway with pulsing edge lights; a plane takes off on the Departures tab and lands on the Arrivals tab, starting again when the tab changes. `prefers-reduced-motion` is honoured.
- Night illustration (stars, moon, lit terminal and tower, runway lights on), following `sun.sun` or the dark theme, or forced with `illustration_theme: day | night`; `illustration: false` gives a classic header with a round icon.
- Header statistics: number of flights, on-time share and average delay, from the airport's statistics sensors or computed from the listed flights (`show_stats`).
- Departures / Arrivals tabs (`default_tab`, `show_departures`, `show_arrivals`); one line per flight with its scheduled time, city, flight number (`show_airline`, `show_aircraft`) and a coloured status pill: on time, delay (« +25 min »), boarding, departed, landed, estimated, canceled, diverted; `max_flights`, `hours_ahead`, `show_past`.
- Flight detail popup at the top of the card: airline, aircraft and registration, callsign, scheduled, estimated and actual times, airport; closed by a click elsewhere, Escape, or when the card leaves the page.
- **Flight Board Mini Card** (`custom:flight-board-mini-card`): the next flight on the illustrated banner (time, city, flight, « in 23 min », status), with a detail button that unfolds the full board and folds back on a click elsewhere.
- Visual editors for both cards, the mini card's with the full card's options; 22 languages, flight statuses included, with only English in the bundle and each other language loaded on demand.
