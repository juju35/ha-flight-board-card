// Renders the cards with the mock board (scripts/screenshots/mock.mjs) into screenshots/*.png, light and dark.
// Usage: npm install && npm run build && node scripts/screenshots/stills.mjs
// The animations are paused at a chosen moment of the plane's cycle (`at`), so each shot shows the plane.
import { cardClip, freeze, launch, mountCard, openPage, pair, root, writeIfChanged } from "./harness.mjs";

const FULL = 460;
const MINI = 380;
const shots = [
  // Departures, day sky: the plane climbing.
  ...pair("card", { tag: "flight-board-card", config: { illustration_theme: "day" }, at: 0.62 }),
  // Arrivals, day sky: the plane on final approach.
  ...pair("card-arrivals", { tag: "flight-board-card", config: { illustration_theme: "day", default_tab: "arrivals" }, at: 0.3 }),
  // Night sky, the terminal and the tower lit.
  ...pair("card-night", { tag: "flight-board-card", config: { illustration_theme: "night" }, at: 0.66 }),
  // The detail popup of a flight, at the top of the card.
  ...pair("card-detail", { tag: "flight-board-card", config: { illustration_theme: "day" }, at: 0.62, clicks: ['.row[data-flight^="dep2"]'] }),
  // Without the illustration: the classic header.
  ...pair("card-classic", { tag: "flight-board-card", config: { illustration: false, show_airline: true } }),
  // The mini card, and the same card unfolded by its detail button.
  ...pair("mini-card", { tag: "flight-board-mini-card", config: { illustration_theme: "day" }, at: 0.62, width: MINI }),
  ...pair("mini-card-night", { tag: "flight-board-mini-card", config: { illustration_theme: "night", default_tab: "arrivals" }, at: 0.3, width: MINI }),
  ...pair("mini-card-zoom", { tag: "flight-board-mini-card", config: { illustration_theme: "day" }, at: 0.62, clicks: [".zoom"] }),
];

const browser = await launch();
for (const s of shots) {
  const width = s.width ?? FULL;
  const page = await openPage(browser, { theme: s.theme, width, label: s.file });
  await mountCard(page, { tag: s.tag, config: s.config, dark: s.theme === "dark", clicks: s.clicks });
  await page.waitForTimeout(300);
  await freeze(page, s.at ?? 0.5);
  const out = `screenshots/${s.file}.png`;
  const png = await page.screenshot({ clip: await cardClip(page, width), animations: "allow" });
  console.log(`${out}${(await writeIfChanged(page, `${root}${out}`, png)) ? "" : " (unchanged)"}`);
  await page.close();
}
await browser.close();
