import { guardPosition } from "./guard.js";
import "./guard.css";

const guardArtwork = `
  <path d="M18 56h30v4H18z" fill="#81775E" stroke="none"/>
  <g class="guard-body"><g transform="scale(2)" stroke-width="1">
    <path d="M11 22h10v6h-4v-4h-2v4h-4z" fill="#292C25"/>
    <path d="M10 27h5v2H9v-1h1m7-1h5v1h1v1h-6z" fill="#292C25"/>
    <path d="M12 14h8v1h2v2h2v6h-3v-5h-1v6h-8v-6h-1v5H8v-6h2v-2h2z" fill="#974F3D"/>
    <path d="M12 16h2v5h-2m-2-4v4" fill="#C58060" stroke="none"/>
    <path d="M12 22h8v2h-8z" fill="#292C25"/><path d="M15 22h3v2h-3z" fill="#D8AD4B"/>
    <path d="M8 22h3v3H8zM21 22h3v3h-3z" fill="#C58060"/>
    <path d="M12 7h9v5h-2v3h-5v-2h-2z" fill="#D3C5A2"/>
    <g class="guard-front">
      <path d="M14 10h1v2h-1m4-2h1v2h-1" fill="#292C25" stroke="none"/>
      <path d="M16 13h2" stroke="#974F3D"/>
      <path d="M15 15h3v2h-1v4h-1v-4h-1z" fill="#F0E5C9" stroke="none"/>
      <path d="M19 17h2v2h-2z" fill="#D8AD4B"/>
      <path d="M12 17h2v3h-2z" fill="#292C25"/>
    </g>
    <path class="guard-back" d="M12 7h9v5h-2v2h-5v-2h-2z" fill="#514C3D"/>
    <path d="M10 5h2V3h9v2h2v3H10z" fill="#974F3D"/>
    <path d="M12 4h8v1h-8z" fill="#C58060" stroke="none"/>
    <path d="M10 7h13v1h-2v1h-8V8h-3z" fill="#292C25"/>
    <path class="guard-front" d="M15 4h3v2h-1v1h-1V6h-1z" fill="#D8AD4B" stroke="none"/>
  </g></g>`;

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
  svg.innerHTML = `<g stroke="#292C25" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><g data-model="guard" data-guard-turn="${turn}"><g class="guard-facing" data-facing="${facing}">${guardArtwork}</g></g></g>`;
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
