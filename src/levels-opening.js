import { currentLevel, generatedLevels } from "./levels.js";
import { parameters } from "./level-generator.js";
import "./levels-opening.css";

const routeNodes = [[58, 177], [108, 145], [162, 125], [216, 89], [288, 89]];
const opening = document.createElement("dialog");
opening.id = "levels-opening";
opening.setAttribute("aria-label", "Открывается карта уровней");
opening.tabIndex = -1;
opening.innerHTML = `<div class="levels-opening-scene" aria-hidden="true">
  <span class="levels-opening-heading">КАРТА МАРШРУТА</span>
  <svg class="levels-opening-map" viewBox="0 0 360 244" fill="none" shape-rendering="crispEdges">
    <path d="M22 27h316v204H22z" fill="#4A3529" opacity=".25"/>
    <path d="M117 18h126v202H117z" fill="#614832"/>
    <path d="M121 22h118v194H121z" fill="#F5E6C5"/>
    <path d="M124 25h112v188H124z" fill="#EBD7AF"/>
    <g class="levels-map-fold levels-map-fold--left">
      <path d="M26 22h95v194H26z" fill="#604632"/>
      <path d="M30 26h91v186H30z" fill="#F3E0B8"/>
      <path d="M33 29h85v180H33z" fill="#E9D4AA"/>
      <path d="M37 38h77M37 57h77M37 76h77M37 95h77M37 114h77M37 133h77M37 152h77M37 171h77M37 190h77" stroke="#C6AC7B" opacity=".38"/>
      <path d="M49 34v171M76 34v171M103 34v171" stroke="#C6AC7B" opacity=".3"/>
      <path d="M31 27h89v4H31z" fill="#FFF0CC" opacity=".6"/>
      <path d="M32 210h87v2H32z" fill="#B69565"/>
    </g>
    <g class="levels-map-fold levels-map-fold--right">
      <path d="M239 22h95v194h-95z" fill="#604632"/>
      <path d="M239 26h91v186h-91z" fill="#F3E0B8"/>
      <path d="M242 29h85v180h-85z" fill="#E9D4AA"/>
      <path d="M246 38h77M246 57h77M246 76h77M246 95h77M246 114h77M246 133h77M246 152h77M246 171h77M246 190h77" stroke="#C6AC7B" opacity=".38"/>
      <path d="M257 34v171M284 34v171M311 34v171" stroke="#C6AC7B" opacity=".3"/>
      <path d="M240 27h89v4h-89z" fill="#FFF0CC" opacity=".6"/>
      <path d="M241 210h87v2h-87z" fill="#B69565"/>
    </g>
    <path d="M121 25v188M239 25v188" stroke="#C09F70" stroke-width="2" stroke-dasharray="3 2"/>
    <path d="M126 45h108M126 64h108M126 83h108M126 102h108M126 121h108M126 140h108M126 159h108M126 178h108M126 197h108" stroke="#C6AC7B" opacity=".35"/>
    <path d="M140 31v177M168 31v177M196 31v177M224 31v177" stroke="#C6AC7B" opacity=".28"/>
    <path d="M37 34h10v2H37zM37 34v10h2V34zM313 34h10v2h-10zM321 34v10h2V34zM37 200h10v2H37zM37 192v10h2v-10zM313 200h10v2h-10zM321 192v10h2v-10z" fill="#A77A50"/>
    <g class="levels-map-ornament">
      <path d="M148 31h64v10h-64z" fill="#6A4B33"/>
      <path d="M151 34h58v4h-58z" fill="#D9AA43"/>
      <path d="M47 55h40v2H47zM47 61h30v2H47zM250 166h53v2h-53zM250 172h42v2h-42z" fill="#A68960" opacity=".8"/>
      <path d="M279 39h17v2h-17zM286 32v17" stroke="#71805B" stroke-width="2"/>
      <path d="M277 42l9-11 9 11-9 10z" fill="#D9AA43" stroke="#604632" stroke-width="2"/>
      <path d="M285 34h2v14h-2zM280 41h12v2h-12z" fill="#F8E8BB"/>
    </g>
    <path class="levels-map-route-shadow" d="M58 177h50v-32h54v-20h54V89h72" stroke="#6E694F" stroke-width="9" stroke-linecap="square" stroke-linejoin="miter"/>
    <path class="levels-map-route" d="M58 177h50v-32h54v-20h54V89h72" stroke="#E8BB63" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter"/>
    ${routeNodes.map(([x, y], index) => `<g class="levels-map-node" data-route-step="${index}" style="--node-delay:${index * 95}ms" transform="translate(${x} ${y})">
      <circle r="12" fill="#5B4936"/>
      <circle r="9" fill="#6A8654"/>
      <circle r="6" fill="#F5ECD5"/>
      <text class="levels-map-node-number" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="900" fill="#3C3429" stroke="none">${index + 1}</text>
    </g>`).join("")}
    <path class="levels-map-flash" d="M16 25h8m-4-4v8M332 52h10m-5-5v10M338 183h8m-4-4v8" stroke="#F8E1A0" stroke-width="2"/>
  </svg>
  <span class="levels-opening-caption">УРОВЕНЬ 1 · КУРС 1</span>
  <span class="levels-opening-spark levels-opening-spark--one">✦</span>
  <span class="levels-opening-spark levels-opening-spark--two">✧</span>
  <span class="levels-opening-spark levels-opening-spark--three">✦</span>
</div>`;
document.body.append(opening);

let timer = null;
let origin = null;
let completed = false;

opening.addEventListener("cancel", () => {
  clearTimeout(timer);
  timer = null;
});
opening.addEventListener("close", () => {
  clearTimeout(timer);
  timer = null;
  if (!completed) origin?.focus({ preventScroll: true });
  completed = false;
  origin = null;
  opening.classList.remove("is-playing");
});

export function openLevelsWithAnimation(dialog, button) {
  if (dialog.open || opening.open || document.querySelector("dialog[open]")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dialog.showModal();
    button.setAttribute("aria-expanded", "true");
    return;
  }
  const level = currentLevel();
  const course = generatedLevels ? parameters(level).course : 1;
  const first = (course - 1) * 5 + 1;
  const step = generatedLevels ? level - first : 0;
  opening.querySelector(".levels-opening-caption").textContent = `УРОВЕНЬ ${level} · КУРС ${course}`;
  opening.querySelectorAll("[data-route-step]").forEach((node, index) => {
    node.querySelector(".levels-map-node-number").textContent = first + index;
    node.classList.toggle("is-current", index === step);
    node.classList.toggle("is-past", index < step);
  });
  origin = button;
  opening.showModal();
  void opening.offsetWidth;
  opening.classList.add("is-playing");
  timer = setTimeout(() => {
    if (!opening.open) return;
    completed = true;
    opening.close();
    dialog.showModal();
    button.setAttribute("aria-expanded", "true");
  }, 1500);
}
