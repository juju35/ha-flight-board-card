// Browser test (Chromium through Playwright) of the cards' layout: at their minimum width (8 columns of a sections
// view on a phone for the full card, 6 for the mini card) and wider, in long languages and both themes, with and
// without the illustration: nothing leaves the card, no text lies under the scenery, the title keeps a few
// characters, the header icon keeps its 40 px on both cards, and the flight popup opens at the top of the card.
// Skipped when Playwright or Chromium is not installed, except in CI, where it must run.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import { mockHass, NOW } from "../scripts/screenshots/mock.mjs";

const src = readFileSync(new URL("../src/flight-board-card.js", import.meta.url), "utf8");
const THEMES = {
  light: { "--card-background-color": "#fff", "--primary-text-color": "#212121", "--secondary-text-color": "#727272" },
  dark: { "--card-background-color": "#1c1c1c", "--primary-text-color": "#e1e1e1", "--secondary-text-color": "#9b9b9b" },
};
const HA_CARD = `customElements.define("ha-card", class extends HTMLElement { constructor() { super();
  this.attachShadow({ mode: "open" }).innerHTML = "<style>:host{display:block;overflow:hidden;background:var(--card-background-color);color:var(--primary-text-color)}</style><slot></slot>"; } });`;

let browser;
let skip = false;
before(async () => {
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  } catch (err) {
    if (process.env.CI) throw err;
    skip = `Chromium not available: ${err.message.split("\n")[0]}`;
  }
});
after(() => browser?.close());

const measure = async (cases) => {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.setFixedTime(new Date(NOW * 1000));
  await page.setContent("<!doctype html><body style='margin:0;font-family:Roboto,Arial,sans-serif'></body>");
  await page.addScriptTag({ content: HA_CARD });
  await page.addScriptTag({ content: src });
  const hass = mockHass();
  const out = await page.evaluate(
    ({ cases, hass, THEMES }) =>
      cases.map((c) => {
        const box = document.createElement("div");
        box.style.cssText = `width:${c.width}px;${Object.entries(THEMES[c.theme]).map(([k, v]) => `${k}:${v}`).join(";")}`;
        document.body.appendChild(box);
        const el = document.createElement(c.type);
        el.setConfig({ type: `custom:${c.type}`, language: c.lang, ...c.config });
        el.hass = { ...hass, themes: { darkMode: c.theme === "dark" } };
        box.appendChild(el);
        const sr = el.shadowRoot;
        const click = (sel) => sr.querySelector(sel)?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 }));
        if (c.zoom) click(".zoom");
        if (c.detail) click(".row");
        const card = sr.querySelector("ha-card").getBoundingClientRect();
        const rect = (n) => n.getBoundingClientRect();
        const shown = (n) => n.getClientRects().length > 0 && getComputedStyle(n).visibility !== "hidden" && getComputedStyle(n).display !== "none";
        // What shows of an element: its box clipped by its ancestors that hide their overflow (an ellipsis).
        const visible = (n) => {
          let { left, right } = rect(n);
          for (let p = n.parentElement; p && p.localName !== "ha-card"; p = p.parentElement) {
            if (getComputedStyle(p).overflowX !== "visible") {
              left = Math.max(left, rect(p).left);
              right = Math.min(right, rect(p).right);
            }
          }
          return { left, right };
        };
        const outside = [...sr.querySelectorAll("*")]
          .filter((n) => shown(n) && !n.closest("svg") && !n.closest(".runway"))
          .filter((n) => {
            const v = visible(n);
            return v.right > v.left && (v.right > card.right + 0.5 || v.left < card.left - 0.5);
          })
          .map((n) => n.className?.baseVal ?? n.className);
        const scene = sr.querySelector(".scene");
        const head = sr.querySelector(".head");
        const sceneShown = scene && shown(scene);
        // Texts of the header: never under the scenery (the detail button sits over its sky on purpose).
        const under =
          sceneShown && head
            ? [...head.querySelectorAll("*")].filter((n) => shown(n) && n.children.length === 0 && rect(n).right > rect(scene).left + 0.5).map((n) => n.textContent)
            : [];
        const name = sr.querySelector(".name, .clock");
        const badge = sr.querySelector(".head .badge, .header .badge");
        const modal = sr.querySelector(".modal");
        const r = {
          outside,
          under,
          nameWidth: name ? rect(name).width : 0,
          ch: name ? parseFloat(getComputedStyle(name).fontSize) * 2 : 0,
          badge: badge ? [Math.round(rect(badge).width), Math.round(rect(badge).height)] : null,
          modalTop: modal ? rect(modal).top - card.top : null,
          modalOut: modal ? rect(modal).right > card.right + 0.5 || rect(modal).bottom > card.bottom + 0.5 : false,
          rows: sr.querySelectorAll(".row").length,
        };
        box.remove();
        return r;
      }),
    { cases, hass, THEMES },
  );
  await page.close();
  assert.deepEqual(errors, []);
  return out;
};

const LANGS = ["en", "de", "el", "sr", "lv", "hu", "pt"];
const matrix = (variants, widths) => {
  const cases = [];
  for (const v of variants) for (const lang of LANGS) for (const theme of ["light", "dark"]) for (const width of widths) cases.push({ ...v, lang, theme, width });
  return cases;
};

test("at their minimum width and wider, nothing leaves the card and no text lies under the scenery", { timeout: 120000 }, async (t) => {
  if (skip) return t.skip(skip);
  const cases = [
    ...matrix([{ type: "flight-board-card", config: {} }, { type: "flight-board-card", config: { illustration: false, show_airline: true, show_aircraft: true } }], [208, 245, 300, 380, 460, 560]),
    ...matrix(
      [
        { type: "flight-board-mini-card", config: {} },
        { type: "flight-board-mini-card", config: { default_tab: "arrivals", illustration_theme: "night" } },
        { type: "flight-board-mini-card", config: { illustration: false } },
      ],
      [156, 208, 245, 300, 380],
    ),
    ...matrix([{ type: "flight-board-mini-card", config: {}, zoom: true }], [208, 300, 460]),
  ];
  const results = await measure(cases);
  results.forEach((r, i) => {
    const c = cases[i];
    const at = `${c.type} ${JSON.stringify(c.config)}${c.zoom ? " zoomed" : ""} ${c.lang} ${c.theme} ${c.width}px`;
    assert.deepEqual(r.outside, [], `outside the card: ${at}`);
    assert.deepEqual(r.under, [], `text under the scenery: ${at}`);
    assert.ok(r.nameWidth >= r.ch, `title ${r.nameWidth.toFixed(0)} px: ${at}`);
    assert.deepEqual(r.badge, [40, 40], `header icon: ${at}`);
  });
});

test("the flight popup opens at the top of the card and stays in it", { timeout: 60000 }, async (t) => {
  if (skip) return t.skip(skip);
  const cases = matrix([{ type: "flight-board-card", config: {}, detail: true }, { type: "flight-board-mini-card", config: {}, zoom: true, detail: true }], [245, 460]);
  const results = await measure(cases);
  results.forEach((r, i) => {
    const c = cases[i];
    const at = `${c.type} ${c.lang} ${c.theme} ${c.width}px`;
    assert.ok(r.modalTop !== null && r.modalTop <= 12, `popup top ${r.modalTop}: ${at}`);
    assert.equal(r.modalOut, false, `popup outside the card: ${at}`);
  });
});
