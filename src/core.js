/*
 * Flight Board Card for Home Assistant
 * https://github.com/juju35/ha-flight-board-card
 *
 * An airport departures and arrivals board for the FlightRadar24 integration
 * (https://github.com/AlexandrErohin/home-assistant-flightradar24): the `flights` attribute of its
 * « Airport departures » and « Airport arrivals » sensors, under an animated illustration of the airport.
 * The sensors are discovered through the entity registry (platform and translation key), whatever their
 * names, or from their default entity ids.
 */

export const VERSION = "__VERSION__";

// mdi icon paths: the cards draw their icons themselves (no <ha-icon>, nothing to load).
export const ICONS = {
  // mdi:airplane-takeoff and mdi:airplane-landing (the header icon, by tab).
  departures: "M2.5,19H21.5V21H2.5V19M22.07,9.64C21.86,8.84 21.03,8.36 20.23,8.58L14.92,10L8,3.57L6.09,4.08L10.23,11.25L5.26,12.58L3.29,11.04L1.84,11.43L3.66,14.59L4.43,15.92L6.03,15.5L11.34,14.07L15.69,12.91L21,11.5C21.81,11.26 22.28,10.44 22.07,9.64Z",
  arrivals: "M2.5,19H21.5V21H2.5V19M9.68,13.27L14.03,14.43L19.34,15.85C20.14,16.06 20.96,15.59 21.18,14.79C21.39,14 20.92,13.17 20.12,12.95L14.81,11.53L12.05,2.5L10.12,2V10.28L5.15,8.95L4.22,6.63L2.77,6.24V11.41L4.37,11.84L9.68,13.27Z",
  // mdi:arrow-expand and mdi:arrow-collapse: the mini card's detail button.
  expand: "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  collapse: "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
  // mdi:close: the detail popup's close button.
  close: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  // mdi:airplane: the detail popup's title.
  plane: "M20.56,3.91C21.15,4.5 21.15,5.45 20.56,6.03L16.67,9.92L18.79,19.11L17.38,20.53L13.5,13.1L9.6,17L9.96,19.47L8.89,20.53L7.13,17.35L3.94,15.58L5,14.5L7.5,14.87L11.37,11L3.94,7.09L5.36,5.68L14.55,7.8L18.44,3.91C19,3.33 20,3.33 20.56,3.91Z",
};
