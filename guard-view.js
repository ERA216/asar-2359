import { guardPosition } from "./guard.js";
import "./guard.css";

import { guardArt } from "./campus-art.js";
const guardArtwork = guardArt;

export function captureGuardDrawing(map) {
  const model = map.querySelector('[data-model="guard"]');
  return model ? { rect: model.getBoundingClientRect(), turn: Number(model.dataset.guardTurn) } : null;
}

export function renderGuard(map, campus, guard, turn, previous, reducedMotion) {
  if (!guard) return;
  const { patrol } = guard, width = campus[0].length;
  const vertical = patrol.length > 1 && patrol[0].x === patrol[1].x;
  patrol.forEach(({ x, y }, index) => {
    const cell = map.children[y * width + x];
    cell.classList.add("guard-patrol");
    cell.classList.toggle("guard-patrol--vertical", vertical);
    cell.classList.toggle("guard-patrol--single", patrol.length === 1);
    cell.dataset.guardStep = index;
    cell.title += " · Маршрут охранника";
  });
  const position = guardPosition(guard, turn);
  const from = guardPosition(guard, Math.max(0, turn - 1));
  const facing = turn === 0 || patrol.length === 1 ? "down"
    : position.x !== from.x ? (position.x > from.x ? "right" : "left")
      : position.y > from.y ? "down" : "up";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("class", "guard-art");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML = `<g stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter"><g data-model="guard" data-guard-turn="${turn}"><g class="guard-facing" data-facing="${facing}">${guardArtwork}</g></g></g>`;
  const cell = map.children[position.y * width + position.x];
  cell.append(svg);
  cell.title += " · Охранник";
  map.setAttribute("aria-label", `${map.getAttribute("aria-label")}. Охранник: строка ${position.y + 1}, столбец ${position.x + 1}; патруль ${patrol.length} кл.`);
  if (!reducedMotion && previous && turn === previous.turn + 1 && patrol.length > 1) {
    const model = svg.querySelector('[data-model="guard"]');
    const current = model.getBoundingClientRect(), units = 64 / svg.getBoundingClientRect().width;
    model.animate([
      { transform: `translate(${(previous.rect.x - current.x) * units}px, ${(previous.rect.y - current.y) * units}px)` },
      { transform: "translate(0, 0)" },
    ], { duration: 150, easing: "steps(5, end)" });
    model.querySelector(".guard-body").animate([
      { transform: "translateY(0)" }, { transform: "translateY(-3px)", offset: .45 }, { transform: "translateY(0)" },
    ], { duration: 150, easing: "steps(5, end)" });
  }
}
