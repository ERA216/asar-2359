import { guardPosition } from "./guard.js";
import "./guard.css";

const guardArtwork = `
  <ellipse cx="32" cy="56" rx="15" ry="4" fill="#514b3d" opacity=".18" stroke="none"/>
  <g class="guard-body">
    <path d="M24 43h8v13H22zm9 0h8l2 13H33" fill="#514b3d"/>
    <path d="M21 56h11m2 0h11" stroke-width="3"/>
    <path d="M23 28q9-5 18 0l6 16-5 2-4-9v12H25V37l-4 9-5-2z" fill="#849679"/>
    <path d="M25 43h13" stroke="#594938" stroke-width="3"/>
    <rect x="29" y="42" width="5" height="3" rx=".5" fill="#dcb779"/>
    <path d="M17 43l4 1-1 4-4-1m27-4-3 2 2 4 4-2" fill="#eac19a"/>
    <rect x="24" y="11" width="17" height="17" rx="7" fill="#eac19a"/>
    <g class="guard-front">
      <path d="M29 18h1m7 0h1" stroke-width="2"/>
      <path d="M30 23q3 2 5 0" fill="none"/>
      <path d="M27 28l5 5 5-5M32 33v8" fill="none" stroke="#f4e9ce"/>
      <path d="M37 32h5v4l-2.5 2-2.5-2z" fill="#dcb779"/>
      <rect x="24" y="33" width="4" height="6" rx="1" fill="#514b3d"/>
    </g>
    <path class="guard-back" d="M24 14h17v7q-8 6-17 0z" fill="#594938"/>
    <path d="M22 13l2-7q9-5 18 0l2 7z" fill="#647e65"/>
    <path d="M22 13h22l-4 3H26z" fill="#514b3d"/>
    <path class="guard-front" d="M30 7h5v4l-2.5 1.5L30 11z" fill="#dcb779"/>
  </g>`;

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
  svg.innerHTML = `<g stroke="#625a48" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g data-model="guard" data-guard-turn="${turn}"><g class="guard-facing" data-facing="${facing}">${guardArtwork}</g></g></g>`;
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
    ], { duration: 150, easing: "ease-out" });
    model.querySelector(".guard-body").animate([
      { transform: "translateY(0)" }, { transform: "translateY(-3px)", offset: .45 }, { transform: "translateY(0)" },
    ], { duration: 150, easing: "ease-out" });
  }
}
