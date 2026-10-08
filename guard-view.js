import { guardPosition } from "./guard.js";
import "./guard.css";

const guardArtwork = `
  <path d="M18 55h30v4H18z" fill="#514b3d" opacity=".25" stroke="none"/>
  <g class="guard-body">
    <path d="M23 43h19v12h-8v-8h-3v8h-8z" fill="#485052"/>
    <path d="M21 53h10v5H20v-3h1m13-2h9v2h3v3H34z" fill="#35342d"/>
    <path d="M25 28h15v3h4v4h3v11h-6V36h-2v12H25V36h-2v10h-6V35h3v-4h5z" fill="#758b88"/>
    <path d="M26 33h3v9h-3m-6-7h3v7h-3" fill="#a8b6a3" stroke="none"/>
    <path d="M25 43h14v3H25z" fill="#594938"/>
    <rect x="30" y="43" width="5" height="3" fill="#dcb779"/>
    <path d="M17 44h6v6h-5v-2h-1m24-4h6v4h-1v2h-5" fill="#ddb18a"/>
    <path d="M24 13h18v11h-3v5H28v-3h-4z" fill="#eac19a"/>
    <g class="guard-front">
      <path d="M29 20h2v3h-2m8-3h2v3h-2" fill="#39382c" stroke="none"/>
      <path d="M32 26h4" stroke="#a97656"/>
      <path d="M29 30h7v3h-3v8h-2v-8h-2z" fill="#f4e9ce" stroke="none"/>
      <path d="M37 33h5v5h-2v2h-1v-2h-2z" fill="#dcb779"/>
      <rect x="24" y="34" width="4" height="6" fill="#514b3d"/>
    </g>
    <path class="guard-back" d="M24 14h18v11h-4v3h-9v-3h-5z" fill="#71604b"/>
    <path d="M21 9h3V5h18v4h3v7H21z" fill="#526e6b"/>
    <path d="M24 6h18v3H24z" fill="#a5b39a" stroke="none"/>
    <path d="M21 13h24v3h-4v2H25v-2h-4z" fill="#383f37"/>
    <path class="guard-front" d="M30 8h6v4h-2v2h-2v-2h-2z" fill="#dcb779"/>
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
  svg.innerHTML = `<g stroke="#443c30" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter"><g data-model="guard" data-guard-turn="${turn}"><g class="guard-facing" data-facing="${facing}">${guardArtwork}</g></g></g>`;
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
