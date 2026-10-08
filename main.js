import { collectCoin, renderCoins, resetCoins, setCoinPositions, coinPositions } from "./coins.js";
import { generatedLevels, currentLevel, loadLevel, nextLevel, newSeries } from "./levels.js";
import { isMarketOpen, configureConsumables, renderConsumables } from "./market.js";
import { consume } from "./inventory.js";
import { captureGuardDrawing, renderGuard } from "./guard-view.js";
import { guardCollision } from "./guard.js";

const manualCampus = [
  "#######",
  "#D...1#",
  "#.##..#",
  "#..2#B#",
  "#.#...#",
  "#3..P.#",
  "#######",
];
const manualLevel = { campus: manualCampus, start: { x: 1, y: 1 }, moveLimit: 21, coins: coinPositions.map(point => ({ ...point })) };
let levelData = loadLevel(manualLevel);
let campus = levelData.campus;
const landmarks = { D: "Общага", B: "Библиотека", P: "Принтер" };
const parts = { 1: "Текст", 2: "Код", 3: "Слайды" };
let moveLimit = levelData.moveLimit;
const player = { ...levelData.start };
const collected = new Set();
let movesLeft = moveLimit;
let phase = "playing";
let bonusMoves = 0;
let guardTurn = 0;
let keyArmed = false;
let keyUsed = false;
const map = document.querySelector("#map");
const movementButtons = document.querySelectorAll("[data-dx]");
const message = document.querySelector("#round-message");
const roundDialog = document.querySelector("#round-dialog");

function showRoundResult() {
  const won = phase === "won";
  document.querySelector("#next-level").hidden = !won || !generatedLevels;
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
    : guardCollision(levelData.guard, player, guardTurn)
      ? "Охранник тебя заметил. Попробуйте обойти патруль."
    : "Дедлайн ушёл. Черновик остался.";
  document.querySelector("#result-stat").textContent = won
    ? `Ходов осталось: ${movesLeft}`
    : `Собрано частей проекта: ${collected.size} из 3`;
  roundDialog.showModal();
}

// SVG artwork uses the existing map and collection state without changing it.
const studentArtwork = `
  <path d="M18 55h30v4H18z" fill="#514b3d" opacity=".25" stroke="none"/>
  <g class="student-body">
    <path d="M39 28h8v3h3v15h-3v3h-8z" fill="var(--student-backpack, #bf8952)"/>
    <path d="M23 43h19v12h-8v-8h-3v8h-8z" fill="#4c5050"/>
    <path d="M21 53h10v5H20v-3h1m13-2h9v2h3v3H34z" fill="#35342d"/>
    <path d="M25 28h15v3h4v4h3v11h-6V36h-2v12H25V36h-2v10h-6V35h3v-4h5z" fill="var(--student-jacket, #647e65)"/>
    <path d="M26 32h4v12h-4M20 35h3v7h-3" fill="#b0ba87" stroke="none"/>
    <path d="M37 30h3v16h-3" fill="#d8b071" stroke="none"/>
    <path d="M17 44h6v6h-5v-2h-1m24-4h6v4h-1v2h-5" fill="#ddb18a"/>
    <path d="M23 9h3V6h13v3h4v4h3v10h-3v5H23v-5h-3V13h3z" fill="#654b3c"/>
    <path d="M26 14h13v4h3v8h-4v4h-9v-3h-5V17h2z" fill="#e6bd91"/>
    <path d="M27 10h10v3h-8v4h-4v5h-3v-9h5z" fill="#927051" stroke="none"/>
    <path d="M29 20h2v3h-2m8-3h2v3h-2" fill="#39382c" stroke="none"/>
    <path d="M32 27h4" stroke="#a97656"/>
    <path class="student-back" d="M23 12h19v13h-4v4H27v-4h-4z" fill="#654b3c"/>
    <path d="M29 31h7v3h-3v5h-2v-5h-2z" fill="#efe3bd" stroke="none"/>
  </g>`;

const libraryArtwork = `
  <path d="M7 56h50v4H7z" fill="#514b3d" opacity=".25" stroke="none"/>
  <path d="M9 14h46v43h-5v-3H14v3H9z" fill="#886345"/>
  <rect x="14" y="18" width="36" height="34" fill="#433d31"/>
  <path d="M16 20h4v12h-4m10-12h4v12h-4m10-12h4v12h-4M22 37h4v12h-4m12-12h4v12h-4m10-12h4v12h-4" fill="#aa6350"/>
  <path d="M21 21h4v11h-4m10-12h4v12h-4m10-10h6v10h-6M16 37h5v12h-5m11-10h6v10h-6m12-12h4v12h-4" fill="#7f9468"/>
  <path d="M17 23h2m8 0h2m8 0h2m-13 17h4m10 0h2" stroke="#dfc693"/>
  <path d="M13 33h38v3H13m0 14h38v3H13" fill="#bc9464"/>
  <path d="M10 18h2v36m40-36h2v36" stroke="#d0a373"/>
  <rect x="5" y="7" width="54" height="10" fill="#f4e9ce"/>
  <text x="32" y="14" text-anchor="middle" font-size="6" stroke="none" fill="#514b3d">БИБЛИОТЕКА</text>
  <path class="library-lamp" d="M27 3h10v3H27z" fill="#f9d983" stroke="none"/>
  <path class="library-book" d="M26 53h6v1h7v5h-7v-1h-6z" fill="#f7edda"/>`;

const partArtwork = {
  1: '<path d="M19 10h23l6 7v35H19z" fill="#fff5dc"/><path d="M41 10v9h7M25 26h17m-17 6h17m-17 6h17m-17 6h10" fill="none"/><path d="M23 10v9" stroke="#b26747" stroke-width="3"/>',
  2: '<path d="M12 14h40v29h3v4h3v4H6v-4h3v-4h3z" fill="#7f9290"/><rect x="16" y="18" width="32" height="21" fill="#f2e7cb"/><path d="M25 23l-5 5 5 5m14-10 5 5-5 5m-5-11-4 12" fill="none"/><path d="M12 43h40v3H12z" fill="#b7c1b0"/><path d="M10 49h44M26 46h12"/><path d="M14 15h36" stroke="#dbe0cd"/>',
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
  if (availablePart) artwork = `<path d="M16 55h34v4H16z" fill="#514b3d" opacity=".2" stroke="none"/><g class="project-item" style="--float-delay: -${Number(tile) * .6}s">${partArtwork[tile]}<path d="M45 4h8v3h4v10h-4v3h-8v-3h-4V7h4z" fill="#f5e9cc"/><text x="49" y="15" text-anchor="middle" font-size="9" stroke="none" fill="#514b3d">${tile}</text></g>`;
  if (tile === "P") {
    const ready = collected.size === 3;
    svg.setAttribute("data-printer-state", ready ? "ready" : "locked");
    artwork = `
      <path d="M4 56h56v4H4z" fill="#514b3d" opacity=".25" stroke="none"/>
      <rect x="6" y="4" width="52" height="10" fill="#f4e9ce"/>
      <text x="32" y="11" text-anchor="middle" font-size="6" stroke="none" fill="#514b3d">КОПИЦЕНТР</text>
      <path d="M7 41v17m49-17v17" stroke-width="3"/>
      <rect x="4" y="39" width="56" height="6" fill="#b79465"/>
      <path d="M21 16h23v13H21z" fill="#fff5dc"/>
      <path d="M14 25h37v17H14z" fill="#829799"/><path d="M15 26h35v5H15z" fill="#bac8bd" stroke="none"/>
      <path d="M43 28h4v4h-4z" fill="${ready ? '#31704a' : '#b68b54'}" stroke="none"/>
      <path d="M20 35h25" stroke-width="3"/>
      <g class="printer-paper"><path d="M24 36h17v15H24z" fill="#fff5dc"/><path d="M28 42h9m-9 4h7"/></g>
      <path d="M6 30h5v9H6m48-8h7v8h-7" fill="#fff5dc"/>
      <g class="printer-lock"><rect x="46" y="44" width="11" height="10" fill="#d4b578"/><path class="lock-shackle" d="M48 44v-6h7v6" fill="none"/></g>`;
  }
  if (here) artwork += `<g data-model="student"><g class="student-facing">${studentArtwork}</g></g>`;
  svg.innerHTML = `<g stroke="#443c30" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter">${artwork}</g>`;
  return svg;
}

// Decorative floor-plan elements never participate in collision detection.
function createInterior(tile, x, y) {
  let art = "";
  if (tile === "#") {
    if (y === 0 || y === campus.length - 1) {
      art = `<path d="M0 12h64v40H0" fill="#b9ac92"/><path d="M0 ${y === 0 ? 54 : 10}h64" stroke="#756b57" stroke-width="4"/>`;
      if (x > 0 && x < campus[0].length - 1) art += x % 2
        ? '<rect x="10" y="22" width="44" height="18" fill="#f6dd9e"/><path d="M32 22v18" stroke="#8d8067"/>'
        : `<rect x="9" y="19" width="46" height="25" rx="2" fill="#f6eddb"/><text x="32" y="35" text-anchor="middle" font-size="8" fill="#514c3e">${y === 0 ? "КОРПУС А" : "УНИВЕРСИТЕТ"}</text>`;
    } else if (x === 0 || x === campus[0].length - 1) {
      art = `<path d="M12 0h40v64H12" fill="#b9ac92"/><path d="M${x === 0 ? 54 : 10} 0v64" stroke="#756b57" stroke-width="4"/>`;
      if (y % 2 === 0) art += `<path d="M15 3h34v58H15z" fill="#72563f"/><path d="M19 7h26v52H19z" fill="#ad8056"/><path d="M21 9h3v47h-3m7-47h3v47h-3m7-47h3v47h-3" fill="#c49769" stroke="none"/><path d="M18 6h28M18 59h28" stroke="#d5af7c"/><rect x="23" y="13" width="18" height="10" fill="#f7edda"/><text x="32" y="21" text-anchor="middle" font-size="8" fill="#403a31">${100 + y + x}</text><path d="M40 34h3v7h-3m-4-5h6" fill="#a9b1a8" stroke="#4c4a3e"/><path d="M18 12v5m0 33v5" stroke="#bbc2b2" stroke-width="2"/>`;
      else art += '<rect x="22" y="20" width="20" height="24" rx="2" fill="#536b60"/><path d="M25 26h14m-14 6h14m-14 6h14" stroke="#f5ecd9"/>';
    } else if (x === 2 && y === 2) {
      art = '<path d="M0 0h64v64H0z" fill="#dfd2ad" stroke="none"/><path d="M4 55h56v5H4z" fill="#514b3d" opacity=".25" stroke="none"/><rect x="4" y="7" width="56" height="50" fill="#899886"/><path d="M6 9h52M6 9v46" stroke="#c3c9a9"/><path d="M23 7v50m18-50v50M9 16h8m12 0h6m12 0h7M9 20h8m12 0h6m12 0h7M18 30v8m18-8v8m18-8v8" stroke="#46574b"/>';
    } else if (x === 3) {
      art = '<path d="M0 0h64v64H0z" fill="#dfd2ad" stroke="none"/><rect x="6" y="7" width="52" height="49" fill="#9f8056"/><path d="M8 54V9h48" fill="none" stroke="#dcc190"/><rect x="11" y="12" width="42" height="38" fill="#e8dbb9"/><text x="32" y="24" text-anchor="middle" font-size="7" fill="#514638">СДАЧА</text><text x="32" y="34" text-anchor="middle" font-size="7" fill="#514638">ПРОЕКТОВ</text><text x="32" y="45" text-anchor="middle" font-size="9" fill="#a3462f">до 23:59</text>';
    } else if (x === 4) {
      art = '<path d="M0 0h64v64H0z" fill="#dfd2ad" stroke="none"/><path d="M10 57h44v4H10z" fill="#514b3d" opacity=".3" stroke="none"/><rect x="11" y="5" width="42" height="54" fill="#7e8a89"/><path d="M13 7h38v5H13z" fill="#b0b5a4" stroke="none"/><rect x="16" y="15" width="24" height="30" fill="#354d4c"/><path d="M19 18h4v5h-4m12 1h5v5h-5m-12 3h4v5h-4m12 1h5v5h-5" fill="#d5ae5d"/><path d="M25 18h4v5h-4m-1 7h4v5h-4m-9 5h4v5h-4" fill="#bc7260"/><path d="M31 17h5v5h-5m-6 13h4v6h-4m-12-17h4v6h-4" fill="#87a38c"/><path d="M44 20h5v11h-5z" fill="#383e39"/><path d="M45 22h3m-3 4h3" stroke="#caa06c"/><path d="M18 49h21v6H18z" fill="#363d39"/><path d="M43 48h5v7h-5z" fill="#ab7956"/><path d="M13 7v49M13 57h37" stroke="#c7cbb8"/>';
    } else {
      art = '<path d="M0 0h64v64H0z" fill="#dfd2ad" stroke="none"/><path d="M17 54h31v5H17z" fill="#514b3d" opacity=".25" stroke="none"/><path d="M21 42h23v9h-3v6H25v-6h-4z" fill="#9c6046"/><path d="M24 47h17v3H24m3 3h12v2H27" fill="#c18a58" stroke="none"/><path d="M20 40h25v6H20z" fill="#bb7c51"/><path d="M24 41h17v3H24z" fill="#574232"/><path d="M30 17h5v25h-5z" fill="#a88751"/><path d="M31 23h3m-3 6h3m-3 6h3" stroke="#604e33"/><path d="M31 18h-8v4h-6v5h-6v-9h4v-4h9v-3h7v-3h-7V5h-9v3h-3v4h-5V8h4V3h14v3h7v4h4V6h6V3h12v4h4v5h-6V8H42v5h8v4h6v6h3v9h-5v-6h-5v-5h-8v-3h-5v8h-4v-6h-1z" fill="#5b8250"/><path d="M11 17h12v-3h7m7 1h10v4h7M16 5h9m18 0h10M33 17v12" stroke="#a1b377"/><path d="M25 22h5v5h-4v8h-5v-8h4m15-8h4v7h5v11h-5v-9h-4z" fill="#496a42"/>';
    }
  } else if (tile === "D") {
    art = '<rect x="5" y="7" width="54" height="50" rx="2" fill="#a57853" opacity=".45"/><path d="M10 12h44v40H10z" fill="none" stroke="#e7ce9a" stroke-width="2"/>';
  }
  if (!art) return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("class", "interior-art");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<g stroke="#514735" stroke-width="1" stroke-linejoin="miter">${art}</g>`;
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
  map.style.setProperty("--map-columns", campus[0].length);
  const previousGuard = levelData.guard ? captureGuardDrawing(map) : null;
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
    cell.classList.toggle("border-bottom", y === campus.length - 1);
    cell.classList.toggle("floor-light", y === 1 && x > 0 && x < campus[0].length - 1 && x % 2 === 1);
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
  renderGuard(map, campus, levelData.guard, guardTurn, previousGuard, reducedMotion.matches);
  renderConsumables();
}

function useRoundItem(id, gift = false) {
  if (phase !== "playing" || isMarketOpen()) return false;
  if (id === "extra-moves") {
    if (!Number.isSafeInteger(movesLeft + 2) || (!gift && !consume(id))) return false;
    movesLeft += 2;
    bonusMoves += 2;
    message.textContent = "Добавлено 2 хода. Продолжайте собирать проект!";
    // A bonus is not a restart; preserve the model animation snapshot.
    if (lastDrawing) lastDrawing.moves = movesLeft;
  } else if (id === "door-key") {
    if (keyUsed || (!gift && !consume(id))) return false;
    keyUsed = true;
    keyArmed = true;
  } else return false;
  renderMap();
  return true;
}

function movePlayer(dx, dy) {
  if (phase !== "playing" || isMarketOpen() || document.querySelector("#gift-dialog")?.open) return;
  const x = player.x + dx;
  const y = player.y + dy;
  const tile = campus[y]?.[x];
  const keyPassage = keyArmed && x > 0 && y > 0 && x < campus[0].length - 1 && y < campus.length - 1;
  if (!tile || (tile === "#" && !keyPassage)) {
    message.textContent = "Здесь здание. Выберите другую дорогу — ход не потрачен.";
    return;
  }
  Object.assign(player, { x, y });
  keyArmed = false;
  collectCoin(player);
  movesLeft--;
  if (levelData.guard) guardTurn++;
  message.textContent = collected.size === 3 ? "Все части собраны. Возвращайтесь к принтеру!" : "Соберите части 1, 2 и 3, затем идите к принтеру.";
  if (parts[tile] && !collected.has(tile)) {
    collected.add(tile);
    message.textContent = `Собрано: ${parts[tile]}. ${collected.size === 3 ? "Теперь к принтеру!" : `Осталось частей: ${3 - collected.size}.`}`;
  }
  // A delivery on the final available move still counts as a win.
  if (guardCollision(levelData.guard, player, guardTurn)) {
    phase = "lost";
    message.textContent = "Охранник тебя заметил. Попробуйте обойти патруль!";
  } else if (tile === "P" && collected.size === 3) {
    phase = "won";
    message.textContent = `Победа! Проект сдан за ${moveLimit + bonusMoves - movesLeft} ходов. Команда успела к дедлайну!`;
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
  Object.assign(player, levelData.start);
  collected.clear();
  movesLeft = moveLimit;
  phase = "playing";
  bonusMoves = 0;
  guardTurn = 0;
  keyArmed = false;
  keyUsed = false;
  message.textContent = `Соберите части 1, 2 и 3, затем идите к принтеру. На всё — ${moveLimit} ходов.`;
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
configureConsumables(() => ({ playing: phase === "playing", keyArmed, keyUsed }), useRoundItem);
function startLevel() {
  levelData = loadLevel(manualLevel);
  campus = levelData.campus;
  moveLimit = levelData.moveLimit;
  lastDrawing = null;
  setCoinPositions(levelData.coins);
  document.querySelector("#level-tag").textContent = generatedLevels ? `Уровень ${currentLevel()}, курс ${levelData.course}` : "Раунд 1";
  document.querySelector("#level-limit").textContent = moveLimit;
  document.querySelector("#new-series").hidden = !generatedLevels;
  restartRound();
}
document.querySelector("#next-level").addEventListener("click", () => {
  if (phase !== "won" || !generatedLevels) return;
  nextLevel(); startLevel();
});
document.querySelector("#new-series").addEventListener("click", () => { newSeries(); startLevel(); });
startLevel();

// Keep the campus usable even if the wallet module fails to load.
import("./memo.js").catch(() => {
  document.querySelector("#status").textContent = "Не удалось загрузить Solana. Обновите страницу; карта работает отдельно.";
});

import("./gift-ui.js").then(({ initGifts }) => initGifts(id => useRoundItem(id, true))).catch(() => {
  document.querySelector("#gift-open").addEventListener("click", () => alert("Помощь недоступна. Обновите страницу; игра работает отдельно."));
});
