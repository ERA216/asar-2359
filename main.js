import { collectCoin, renderCoins, resetCoins } from "./coins.js";
import { isMarketOpen } from "./market.js";

const campus = [
  "#######",
  "#D...1#",
  "#.##..#",
  "#..2#B#",
  "#.#...#",
  "#3..P.#",
  "#######",
];
const landmarks = { D: "Общага", B: "Библиотека", P: "Принтер" };
const parts = { 1: "Текст", 2: "Код", 3: "Слайды" };
const moveLimit = 21;
const player = { x: 1, y: 1 };
const collected = new Set();
let movesLeft = moveLimit;
let phase = "playing";
const map = document.querySelector("#map");
const movementButtons = document.querySelectorAll("[data-dx]");
const message = document.querySelector("#round-message");
const roundDialog = document.querySelector("#round-dialog");

function showRoundResult() {
  const won = phase === "won";
  roundDialog.classList.toggle("result--win", won);
  roundDialog.classList.toggle("result--lose", !won);
  document.querySelector("#result-stamp").textContent = won ? "СДАНО" : "НЕ УСПЕЛ";
  document.querySelector("#result-title").textContent = won ? "Проект принят" : "Дедлайн закончился";
  roundDialog.querySelectorAll("[data-result-part]").forEach(icon => {
    const id = icon.dataset.resultPart;
    const found = collected.has(id);
    icon.classList.toggle("is-collected", found);
    icon.setAttribute("aria-label", `${parts[id]}: ${found ? "собрано" : "не собрано"}`);
  });
  document.querySelector("#result-copy").textContent = won
    ? "Проект на бумаге. Можно выдохнуть."
    : "Дедлайн ушёл. Черновик остался.";
  document.querySelector("#result-stat").textContent = won
    ? `Ходов осталось: ${movesLeft}`
    : `Собрано частей проекта: ${collected.size} из 3`;
  roundDialog.showModal();
}

// SVG artwork uses the existing map and collection state without changing it.
const studentArtwork = `
  <ellipse cx="32" cy="56" rx="15" ry="4" fill="#514b3d" opacity=".18" stroke="none"/>
  <g class="student-body">
    <rect x="39" y="26" width="12" height="22" rx="4" fill="#bf8952"/>
    <path d="M24 43h8v13H22zm9 0h8l2 13H33" fill="#514b3d"/>
    <path d="M21 56h11m2 0h11" stroke-width="3"/>
    <path d="M24 27q8-5 16 0l6 18-6 2-3-9v11H25V38l-4 9-6-2z" fill="#647e65"/>
    <path d="M38 28v18" stroke="#d9b777" stroke-width="3"/>
    <path d="M23 17q0-13 10-13t11 14" fill="#594938"/>
    <rect x="24" y="11" width="17" height="16" rx="7" fill="#eac19a"/>
    <path d="M23 15q1-14 13-10l7 7-9-3-5 6z" fill="#594938"/>
    <path d="M29 18h1m7 0h1" stroke-width="2"/>
    <path class="student-back" d="M23 17q0-13 10-13t11 14v5q-10 8-21 0z" fill="#647e65"/>
    <path d="M29 31l3 4 4-4" fill="none" stroke="#ede1bd"/>
  </g>`;

const libraryArtwork = `
  <path d="M6 58h52" stroke="#514b3d" opacity=".2" stroke-width="5"/>
  <rect x="9" y="15" width="46" height="42" fill="#897654"/>
  <rect x="16" y="19" width="32" height="36" fill="#514b3d"/>
  <path d="M19 23h5v11h-5zm7 0h6v11h-6zm8 2h5v9h-5zm7-2h4v11h-4" fill="#d4b578"/>
  <path d="M19 39h7v11h-7zm9 0h5v11h-5zm7-1h5v12h-5zm7 3h3v9h-3" fill="#849679"/>
  <path d="M16 35h32M16 51h32" stroke="#caa56b" stroke-width="3"/>
  <rect x="5" y="7" width="54" height="10" rx="1" fill="#f4e9ce"/>
  <text x="32" y="14" text-anchor="middle" font-size="6" stroke="none" fill="#514b3d">БИБЛИОТЕКА</text>
  <path class="library-lamp" d="M27 3h10v3H27z" fill="#f9d983" stroke="none"/>
  <path d="M10 18h5v37h-5m39-37h-5v37h5" fill="#bda67c"/>
  <path class="library-book" d="M26 53q4-2 6 0 4-2 7 0v6q-4-2-7 0-2-2-6 0z" fill="#f7edda"/>`;

const partArtwork = {
  1: '<path d="M19 10h23l6 7v35H19z" fill="#fff5dc"/><path d="M41 10v9h7M25 26h17m-17 6h17m-17 6h17m-17 6h10" fill="none"/><path d="M23 10v9" stroke="#b26747" stroke-width="3"/>',
  2: '<rect x="12" y="14" width="40" height="29" rx="2" fill="#85967e"/><rect x="16" y="18" width="32" height="21" fill="#f2e7cb"/><path d="M25 23l-5 5 5 5m14-10 5 5-5 5m-5-11-4 12" fill="none"/><path d="M12 43h40l5 7H7z" fill="#a4ae92"/><path d="M26 46h12"/>',
  3: '<path d="M10 18h18l4 5h22v29H10z" fill="#c59356"/><path d="M17 12h33v32H17z" fill="#fff5dc"/><path d="M22 18h23M23 36v-7m8 7V23m8 13V27" fill="none" stroke="#6c8063" stroke-width="3"/><path d="M10 39h20l4-5h23l-5 20H10z" fill="#dcb779"/>',
};

function createMapModel(tile, here) {
  const availablePart = parts[tile] && !collected.has(tile);
  if (!here && tile !== "B" && tile !== "P" && !availablePart) return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  let artwork = tile === "B" ? libraryArtwork : "";
  if (availablePart) artwork = `<ellipse cx="32" cy="57" rx="18" ry="3" fill="#514b3d" opacity=".16" stroke="none"/><g class="project-item" style="--float-delay: -${Number(tile) * .6}s">${partArtwork[tile]}<circle cx="49" cy="12" r="8" fill="#f5e9cc"/><text x="49" y="15" text-anchor="middle" font-size="9" stroke="none" fill="#514b3d">${tile}</text></g>`;
  if (tile === "P") {
    const ready = collected.size === 3;
    svg.setAttribute("data-printer-state", ready ? "ready" : "locked");
    artwork = `
      <ellipse cx="32" cy="57" rx="28" ry="4" fill="#514b3d" opacity=".18" stroke="none"/>
      <rect x="6" y="4" width="52" height="10" rx="1" fill="#f4e9ce"/>
      <text x="32" y="11" text-anchor="middle" font-size="6" stroke="none" fill="#514b3d">КОПИЦЕНТР</text>
      <path d="M7 41v17m49-17v17" stroke-width="3"/>
      <rect x="4" y="39" width="56" height="6" rx="1" fill="#b79465"/>
      <path d="M21 16h23v13H21z" fill="#fff5dc"/>
      <rect x="14" y="25" width="37" height="17" rx="3" fill="#a2ae97"/>
      <circle cx="45" cy="30" r="2" fill="${ready ? '#31704a' : '#b68b54'}" stroke="none"/>
      <path d="M20 35h25" stroke-width="3"/>
      <g class="printer-paper"><path d="M24 36h17v15H24z" fill="#fff5dc"/><path d="M28 42h9m-9 4h7"/></g>
      <path d="M6 30h5v9H6m48-8h7v8h-7" fill="#fff5dc"/>
      <g class="printer-lock"><rect x="46" y="44" width="11" height="10" rx="2" fill="#d4b578"/><path class="lock-shackle" d="M48 44v-4a3.5 3.5 0 0 1 7 0v4" fill="none"/></g>`;
  }
  if (here) artwork += `<g data-model="student"><g class="student-facing">${studentArtwork}</g></g>`;
  svg.innerHTML = `<g stroke="#625a48" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${artwork}</g>`;
  return svg;
}

// Decorative floor-plan elements never participate in collision detection.
function createInterior(tile, x, y) {
  let art = "";
  if (tile === "#") {
    if (y === 0 || y === 6) {
      art = `<path d="M0 12h64v40H0" fill="#b9ac92"/><path d="M0 ${y === 0 ? 54 : 10}h64" stroke="#756b57" stroke-width="4"/>`;
      if (x > 0 && x < 6) art += x % 2
        ? '<rect x="10" y="22" width="44" height="18" fill="#f6dd9e"/><path d="M32 22v18" stroke="#8d8067"/>'
        : `<rect x="9" y="19" width="46" height="25" rx="2" fill="#f6eddb"/><text x="32" y="35" text-anchor="middle" font-size="8" fill="#514c3e">${y === 0 ? "КОРПУС А" : "УНИВЕРСИТЕТ"}</text>`;
    } else if (x === 0 || x === 6) {
      art = `<path d="M12 0h40v64H12" fill="#b9ac92"/><path d="M${x === 0 ? 54 : 10} 0v64" stroke="#756b57" stroke-width="4"/>`;
      if (y === 2 || y === 4) art += `<rect x="18" y="8" width="28" height="48" rx="2" fill="#8f7759"/><rect x="23" y="13" width="18" height="10" fill="#f7edda"/><text x="32" y="21" text-anchor="middle" font-size="8" fill="#403a31">${100 + y + x}</text><circle cx="40" cy="38" r="2" fill="#e9cb86"/>`;
      else art += '<rect x="22" y="20" width="20" height="24" rx="2" fill="#536b60"/><path d="M25 26h14m-14 6h14m-14 6h14" stroke="#f5ecd9"/>';
    } else if (x === 2 && y === 2) {
      art = '<rect x="4" y="7" width="56" height="50" rx="3" fill="#899886"/><path d="M23 7v50m18-50v50M9 16h8m12 0h6m12 0h7M18 30v8m18-8v8m18-8v8" stroke="#46574b"/>';
    } else if (x === 3) {
      art = '<rect x="6" y="7" width="52" height="49" rx="2" fill="#9f8056"/><rect x="11" y="12" width="42" height="38" fill="#e8dbb9"/><text x="32" y="24" text-anchor="middle" font-size="7" fill="#514638">СДАЧА</text><text x="32" y="34" text-anchor="middle" font-size="7" fill="#514638">ПРОЕКТОВ</text><text x="32" y="45" text-anchor="middle" font-size="9" fill="#a3462f">до 23:59</text>';
    } else if (x === 4) {
      art = '<rect x="11" y="5" width="42" height="54" rx="3" fill="#a8573e"/><rect x="16" y="11" width="24" height="32" fill="#ead7aa"/><path d="M19 19h18m-18 10h18m-18 10h18" stroke="#72674e"/><path d="M44 19h4m-4 7h4M20 51h24" stroke="#f7edda"/>';
    } else {
      art = '<ellipse cx="32" cy="53" rx="23" ry="6" fill="#6e624b" opacity=".2"/><path d="M21 38h22l-4 19H25z" fill="#ad7650"/><path d="M32 43V15" stroke="#52694b"/><path d="M32 29Q8 33 12 14q20-3 20 15m0 6Q55 37 54 17q-20-3-22 18M32 20Q19 9 31 4q16 6 1 16" fill="#6b805b"/>';
    }
  } else if (tile === "D") {
    art = '<rect x="5" y="7" width="54" height="50" rx="2" fill="#a57853" opacity=".45"/><path d="M10 12h44v40H10z" fill="none" stroke="#e7ce9a" stroke-width="2"/>';
  }
  if (!art) return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("class", "interior-art");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<g stroke="#625a48" stroke-width="1.5" stroke-linejoin="round">${art}</g>`;
  return svg;
}

// Animation snapshots describe the last drawing, never the game state.
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let lastDrawing = null;
let facing = "down";
const pickupEffects = new Set();

function clearPickupEffects() {
  pickupEffects.forEach(effect => effect.remove());
  pickupEffects.clear();
}

reducedMotion.addEventListener("change", () => {
  if (!reducedMotion.matches) return;
  map.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
  clearPickupEffects();
});

function animateDrawing(previousStudent, pickup) {
  const restarting = !lastDrawing || movesLeft > lastDrawing.moves;
  const moved = !restarting && (player.x !== lastDrawing.x || player.y !== lastDrawing.y);
  const gained = !restarting && collected.size > lastDrawing.count;
  if (restarting) { facing = "down"; clearPickupEffects(); }
  else if (moved) facing = player.x !== lastDrawing.x ? (player.x > lastDrawing.x ? "right" : "left") : (player.y > lastDrawing.y ? "down" : "up");
  map.dataset.facing = facing;
  // Preserve the float phase when cells are redrawn.
  map.style.setProperty("--ambient-delay", `-${performance.now() / 1000}s`);
  if (!reducedMotion.matches) {
    const student = map.querySelector('[data-model="student"]');
    if (moved && previousStudent && student) {
      const current = student.getBoundingClientRect();
      const svg = student.ownerSVGElement;
      const scale = svg.closest(".landmark") ? .8 : 1;
      const units = 64 / svg.getBoundingClientRect().width / scale;
      student.animate([
        { transform: `translate(${(previousStudent.x - current.x) * units}px, ${(previousStudent.y - current.y) * units}px)` },
        { transform: "translate(0, 0)" },
      ], { duration: 150, easing: "ease-out" });
      student.querySelector(".student-body").animate([
        { transform: "translateY(0)" }, { transform: `translateY(${gained ? -7 : -3}px)`, offset: .45 }, { transform: "translateY(0)" },
      ], { duration: gained ? 240 : 150, easing: "ease-out" });
    }
    if (gained && pickup) {
      const target = document.querySelector(`[data-part="${pickup.id}"]`).getBoundingClientRect();
      const effect = pickup.svg;
      effect.classList.add("pickup-effect");
      Object.assign(effect.style, { left: `${pickup.rect.x}px`, top: `${pickup.rect.y}px`, width: `${pickup.rect.width}px`, height: `${pickup.rect.height}px` });
      document.body.append(effect);
      pickupEffects.add(effect);
      const flight = effect.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: "translate(0, -16px) scale(1.1)", opacity: 1, offset: .22 },
        { transform: `translate(${target.x + target.width / 2 - pickup.rect.x - pickup.rect.width / 2}px, ${target.y + target.height / 2 - pickup.rect.y - pickup.rect.height / 2}px) scale(.15)`, opacity: 0 },
      ], { duration: 420, easing: "ease-in", fill: "forwards" });
      flight.onfinish = () => { effect.remove(); pickupEffects.delete(effect); };
      map.querySelector(".library-book")?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "translateY(0)" }], { duration: 240 });
    }
    if (!restarting && lastDrawing.count < 3 && collected.size === 3) {
      map.querySelector(".lock-shackle")?.animate([{ transform: "translate(0, 0)" }, { transform: "translate(3px, -2px)" }], { duration: 220 });
    }
    if (phase === "won" && lastDrawing?.phase !== "won") {
      map.querySelector(".printer-paper")?.animate([{ transform: "translateY(-9px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 240 });
    }
  }
  lastDrawing = { x: player.x, y: player.y, count: collected.size, moves: movesLeft, phase };
}

function renderMap() {
  const previousStudent = map.querySelector('[data-model="student"]')?.getBoundingClientRect();
  const pickedId = campus[player.y][player.x];
  const oldItem = parts[pickedId] && map.children[player.y * campus[0].length + player.x]?.querySelector(".project-item");
  const pickup = oldItem ? { id: pickedId, svg: oldItem.ownerSVGElement.cloneNode(true), rect: oldItem.ownerSVGElement.getBoundingClientRect() } : null;
  map.replaceChildren();
  campus.forEach((row, y) => [...row].forEach((tile, x) => {
    const cell = document.createElement("div");
    const here = player.x === x && player.y === y;
    const availablePart = parts[tile] && !collected.has(tile);
    cell.className = `cell ${tile === "#" ? "wall" : ""} ${landmarks[tile] ? "landmark" : ""} ${availablePart ? "part" : ""} ${here ? "player" : ""}`;
    const interior = createInterior(tile, x, y);
    if (interior) cell.append(interior);
    const model = createMapModel(tile, here);
    if (model) cell.append(model);
    else if (!interior) cell.textContent = availablePart ? tile : landmarks[tile] || "";
    const objectLabel = tile === "P" ? `Принтер: ${collected.size === 3 ? "готов" : "нужны все 3 части"}` : landmarks[tile] || parts[tile] || "Дорожка";
    cell.title = here ? `Студент · ${objectLabel}` : objectLabel;
    cell.setAttribute("aria-hidden", "true");
    map.append(cell);
  }));
  const tile = campus[player.y][player.x];
  const location = landmarks[tile] || parts[tile] || "Дорожка";
  const description = `${location} · строка ${player.y + 1}, столбец ${player.x + 1}`;
  document.querySelector("#position").textContent = description;
  map.setAttribute("aria-label", `Карта кампуса. Игрок: ${description}`);
  document.querySelector("#moves-left").textContent = movesLeft;
  document.querySelector("#parts-count").textContent = collected.size;
  document.querySelectorAll("[data-part]").forEach(item => {
    const id = item.dataset.part;
    const found = collected.has(id);
    item.textContent = `${found ? "✓" : id + "."} ${parts[id]}`;
    item.classList.toggle("collected", found);
  });
  movementButtons.forEach(button => { button.disabled = phase !== "playing"; });
  message.dataset.phase = phase;
  animateDrawing(previousStudent, pickup);
  renderCoins(campus);
}

function movePlayer(dx, dy) {
  if (phase !== "playing" || isMarketOpen()) return;
  const x = player.x + dx;
  const y = player.y + dy;
  const tile = campus[y]?.[x];
  if (!tile || tile === "#") {
    message.textContent = "Здесь здание. Выберите другую дорогу — ход не потрачен.";
    return;
  }
  Object.assign(player, { x, y });
  collectCoin(player);
  movesLeft--;
  message.textContent = collected.size === 3 ? "Все части собраны. Возвращайтесь к принтеру!" : "Соберите части 1, 2 и 3, затем идите к принтеру.";
  if (parts[tile] && !collected.has(tile)) {
    collected.add(tile);
    message.textContent = `Собрано: ${parts[tile]}. ${collected.size === 3 ? "Теперь к принтеру!" : `Осталось частей: ${3 - collected.size}.`}`;
  }
  // A delivery on the final available move still counts as a win.
  if (tile === "P" && collected.size === 3) {
    phase = "won";
    message.textContent = `Победа! Проект сдан за ${moveLimit - movesLeft} ходов. Команда успела к дедлайну!`;
  } else if (movesLeft === 0) {
    phase = "lost";
    message.textContent = "Ходы закончились — проект не сдан. Попробуйте более короткий маршрут!";
  } else if (tile === "P") {
    message.textContent = `Принтер ждёт полный проект. Соберите ещё ${3 - collected.size} части.`;
  }
  renderMap();
  if (phase === "won" || phase === "lost") showRoundResult();
}

function restartRound() {
  if (roundDialog.open) roundDialog.close();
  Object.assign(player, { x: 1, y: 1 });
  collected.clear();
  movesLeft = moveLimit;
  phase = "playing";
  message.textContent = "Соберите части 1, 2 и 3, затем идите к принтеру. На всё — 21 ход.";
  resetCoins();
  renderMap();
}

movementButtons.forEach(button => {
  button.addEventListener("click", () => movePlayer(Number(button.dataset.dx), Number(button.dataset.dy)));
});
document.querySelector("#restart").addEventListener("click", restartRound);
document.querySelector("#result-restart").addEventListener("click", restartRound);
roundDialog.addEventListener("close", () => document.querySelector("#restart").focus({ preventScroll: true }));

const directions = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};
document.addEventListener("keydown", event => {
  if (event.target.closest("input, textarea, select, [contenteditable]")) return;
  const direction = directions[event.code];
  if (direction && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    if (!event.repeat) movePlayer(...direction);
  }
});
restartRound();

// Keep the campus usable even if the wallet module fails to load.
import("./memo.js").catch(() => {
  document.querySelector("#status").textContent = "Не удалось загрузить Solana. Обновите страницу; карта работает отдельно.";
});
