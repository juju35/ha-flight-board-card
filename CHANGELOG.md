# Changelog

## 1.2.3 - 2026-11-20

### Fixes
- The mini card's detail button keeps its frosted glass on older Safari / iOS (`-webkit-backdrop-filter`).
- A pending status-pill fit is cancelled when the card leaves the page.

### Performance
- The entity discovery no longer counts every entity of Home Assistant several times per render: repeated calls on the same states are served from its cache.
- The visual editor builds its form schema again only when the language of its labels changes, not on every Home Assistant update.

### Maintenance
- Tests: the card's source is evaluated under its own path, so `npm run coverage` (run by CI) measures the card itself (94 % of lines, 81 % of branches).

## 1.2.2 - 2026-11-18

### Fixes
- Editor: the `auto` illustration theme label no longer mentions the sun.

## 1.2.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.2.0 - 2026-11-17

### Features
- **Status pill in the header** of both cards, full and mini, compact and unfolded, illustrated or classic: a coloured dot and a short status right after the title, in the colour of the header icon, which now follows the status too — **On time** (green), **Delays** (orange) or **Cancellations** (red, a canceled or diverted flight) among the flights listed, **No flights** or **Not tracked** (grey). It stays on the title row only while the title stays whole and the pill keeps its whole label beside it (measured by the card in every language, no fixed width threshold); otherwise it goes to its own line under the statistics, kept to one line, and shows only its dot when even that does not fit the banner, and at 200 px or less, the label kept in its tooltip and for screen readers. On the mini card, the next flight's status pill sits right after its time, and the header icon takes its colour; with no flight to show, the airport and the board's pill take its place. New texts translated into every language.
- The mini card's unfolded view: its collapse button gets the same frosted glass and hover as the compact view's expand button.

### Fixes
- **Night illustration with a dark theme by day**: with `illustration_theme: auto` (the default), the night picture now shows when the sun is below the horizon **or** Home Assistant uses a dark theme, like the other cards; a dark dashboard by day used to keep the day sky. `day` and `night` still force it.

## 1.1.1 - 2026-11-17

### Fixes
- **Uniform header height**: the illustrated header is now 90 px high on both cards (was 92 px on the full card and 80 px on the mini card), the same height as the other illustrated cards, so that headers line up on a dashboard. The runway strip is 10 px high on both cards (was 12 px on the full card), the same thickness as the ground strip of the other cards.

## 1.1.0 - 2026-11-14

### Features
- **FlightRadar24 logo**: the radar mark of FlightRadar24 now sits as a badge on the header icon of both cards (illustrated and classic headers, mini card included), on a white rounded tile so that it stays readable in the dark theme. The README shows the FlightRadar24 logotype under the project icon and in the supported integrations table.

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
