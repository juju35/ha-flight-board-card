// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
import { pickerDefine } from "./card-picker.js";
import { VERSION } from "./core.js";
import { FlightBoardCard } from "./full-card.js";
import { FlightBoardMiniCard } from "./mini-card.js";
import { FlightBoardCardEditor, FlightBoardMiniCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("flight-board-card", FlightBoardCard);
define("flight-board-mini-card", FlightBoardMiniCard);
define("flight-board-card-editor", FlightBoardCardEditor);
define("flight-board-mini-card-editor", FlightBoardMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "flight-board-card",
    name: "Flight Board Card",
    description: "Airport departures and arrivals board for the FlightRadar24 integration, under an animated airport illustration.",
  },
  {
    type: "flight-board-mini-card",
    name: "Flight Board Mini Card",
    description: "The next departure or arrival of an airport (FlightRadar24), with a detail button to the full board.",
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type))
    window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-flight-board-card" });
}

console.info(
  `%c FLIGHT-BOARD-CARD %c v${VERSION} `,
  "color: white; background: #2f80ed; font-weight: 700;",
  "color: #2f80ed; background: white; font-weight: 700;",
);
