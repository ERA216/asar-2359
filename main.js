import { collectCoin, renderCoins, resetCoins, setCoinPositions, coinPositions } from "./coins.js";
import { generatedLevels, currentLevel, currentSeed, loadLevel, nextLevel, newSeries } from "./levels.js";
import { isMarketOpen, configureConsumables, renderConsumables } from "./market.js";
import { consume } from "./inventory.js";
import { captureGuardDrawing, renderGuard } from "./guard-view.js";
import { guardCollision } from "./guard.js";
import { createDecoration } from "./decor.js";
import { plantArt, vendingArt } from "./campus-art.js";
import { nearestPartRoute, nextGuardCells, routeToPart } from "./item-guides.js";
import "./item-effects.css";

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
let guardForecastUntil = 0;
let guidedPart = null;
let thermosArmed = false;
let thermosUsed = false;
let placingNote = false;
const markedCells = new Set();
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
  <path d="M18 56h30v4H18z" fill="#81775E" stroke="none"/>
  <g class="student-body"><g transform="scale(2)" stroke-width="1">
    <path d="M19 14h5v2h1v8h-6z" fill="var(--student-backpack, #A97935)"/>
    <path d="M11 22h10v6h-4v-4h-2v4h-4z" fill="#354B38"/>
    <path d="M10 27h5v2h-6v-1h1m7-1h5v1h1v1h-6z" fill="#292C25"/>
    <path d="M12 14h8v1h2v2h2v6h-3v-5h-1v6h-8v-6h-1v5H8v-6h2v-2h2z" fill="var(--student-jacket, #66805B)"/>
    <path d="M13 16h2v6h-2M10 17v4" stroke="#F0E5C9"/>
    <path d="M19 15v8" stroke="#D8AD4B"/>
    <path d="M8 22h3v3H8zM21 22h3v3h-3z" fill="#C58060"/>
    <path d="M11 5h2V3h7v2h2v2h1v5h-2v2H11v-2H10V7h1z" fill="#514C3D"/>
    <path d="M13 7h7v2h1v4h-2v2h-5v-2h-2V9h1z" fill="#D3C5A2"/>
    <path d="M12 6h4V5h3V4h-6v1h-1z" fill="#81775E" stroke="none"/>
    <path d="M14 10h1v2h-1m4-2h1v2h-1" fill="#292C25" stroke="none"/>
    <path d="M16 13h2" stroke="#974F3D"/>
    <path class="student-back" d="M11 6h10v6h-2v2h-6v-2h-2z" fill="#514C3D"/>
    <path d="M15 15h3v2h-1v2h-1v-2h-1z" fill="#F0E5C9" stroke="none"/>
  </g></g>`;

const libraryArtwork = `
  <path d="M8 56h50v4H8z" fill="#514C3D" opacity=".25" stroke="none"/>
  <path d="M8 14h46v44h-4v-4H14v4H8z" fill="#974F3D"/>
  <rect x="14" y="18" width="36" height="34" fill="#354B38"/>
  <path d="M16 20h4v12h-4m10-12h4v12h-4m10-12h4v12h-4M22 36h4v12h-4m12-12h4v12h-4m10-12h4v12h-4" fill="#974F3D"/>
  <path d="M20 20h4v12h-4m10-12h4v12h-4m10-10h6v10h-6M16 36h4v12h-4m12-10h6v10h-6m12-12h4v12h-4" fill="#81775E"/>
  <path d="M16 24h2m8 0h2m8 0h2m-12 16h4m10 0h2" stroke="#D3C5A2"/>
  <path d="M12 32h38v4H12m0 14h38v4H12" fill="#C58060"/>
  <path d="M10 18h2v36m40-36h2v36" stroke="#AEA184"/>
  <rect x="4" y="8" width="54" height="10" fill="#F0E5C9"/>
  <text x="32" y="14" text-anchor="middle" font-size="6" stroke="none" fill="#514C3D">БИБЛИОТЕКА</text>
  <path class="library-lamp" d="M28 4h10v4H28z" fill="#D3C5A2" stroke="none"/>
  <path class="library-book" d="M26 52h6v0h8v4h-8v0h-6z" fill="#F0E5C9"/>`;

const partArtwork = {
  1: '<path d="M18 8h24v4h4v4h4v38H18z" fill="#F0E5C9"/><path d="M42 8v10h8M24 26h18m-18 6h18m-18 6h18m-18 6h12" fill="none"/><path d="M22 8h4v10h-4z" fill="#974F3D" stroke="none"/>',
  2: '<path d="M12 14h40v28h4v4h2v6H6v-6h2v-4h4z" fill="#66805B"/><path d="M16 18h32v20H16z" fill="#F0E5C9"/><path d="M26 24h-4v4h-4v2h4v4h4m12-10h4v4h4v2h-4v4h-4M34 22v6h-2v8" fill="none"/><path d="M12 44h40M10 48h44M28 46h8" stroke="#D3C5A2"/>',
  3: '<path d="M10 18h18v4h26v30H10z" fill="#A97935"/><path d="M16 10h34v34H16z" fill="#F0E5C9"/><path d="M22 18h22M24 36v-8m8 8V24m8 12V28" fill="none" stroke="#66805B"/><path d="M10 38h20v-4h26v10h-2v10H10z" fill="#D8AD4B"/>',
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
  if (availablePart) artwork = `<path d="M16 56h34v4H16z" fill="#514C3D" opacity=".2" stroke="none"/><g class="project-item" style="--float-delay: -${Number(tile) * .6}s">${partArtwork[tile]}<path d="M44 4h8v4h4v10h-4v4h-8v-4h-4V8h4z" fill="#F0E5C9"/><text x="48" y="16" text-anchor="middle" font-size="9" stroke="none" fill="#514C3D">${tile}</text></g>`;
  if (tile === "P") {
    const ready = collected.size === 3;
    svg.setAttribute("data-printer-state", ready ? "ready" : "locked");
    artwork = `
      <path d="M4 56h56v4H4z" fill="#514C3D" opacity=".25" stroke="none"/>
      <rect x="6" y="4" width="52" height="10" fill="#F0E5C9"/>
      <text x="32" y="12" text-anchor="middle" font-size="6" stroke="none" fill="#514C3D">КОПИЦЕНТР</text>
      <path d="M8 40v16m48-16v16" stroke-width="2"/>
      <rect x="4" y="40" width="56" height="6" fill="#C58060"/>
      <path d="M20 16h24v12H20z" fill="#F0E5C9"/>
      <path d="M14 24h36v16H14z" fill="#AEA184"/><path d="M16 26h36v4H16z" fill="#D3C5A2" stroke="none"/>
      <path d="M44 28h4v4h-4z" fill="${ready ? '#66805B' : '#A97935'}" stroke="none"/>
      <path d="M20 36h24" stroke-width="2"/>
      <g class="printer-paper"><path d="M24 36h16v16H24z" fill="#F0E5C9"/><path d="M28 42h8m-8 4h8"/></g>
      <path d="M6 30h4v8H6m48-8h8v8h-8" fill="#F0E5C9"/>
      <g class="printer-lock"><rect x="46" y="44" width="12" height="10" fill="#AEA184"/><path class="lock-shackle" d="M48 44v-6h8v6" fill="none"/></g>`;
  }
  if (here) artwork += `<g data-model="student"><g class="student-facing">${studentArtwork}</g></g>`;
  svg.innerHTML = `<g stroke="#292C25" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">${artwork}</g>`;
  return svg;
}

// Decorative floor-plan elements never participate in collision detection.
function createInterior(tile, x, y) {
  let art = "";
  if (tile === "#") {
    if (y === 0 || y === campus.length - 1) {
      art = `<path d="M0 12h64v40H0" fill="#AEA184"/><path d="M0 ${y === 0 ? 54 : 10}h64" stroke="#795539" stroke-width="2"/>`;
      if (x > 0 && x < campus[0].length - 1) art += x % 2
        ? '<rect x="10" y="22" width="44" height="18" fill="#D8CBA5"/><path d="M32 22v18" stroke="#795539"/>'
        : `<rect x="8" y="20" width="46" height="24" rx="0" fill="#F5ECD5"/><text x="32" y="36" text-anchor="middle" font-size="8" fill="#3C3429">${y === 0 ? "КОРПУС А" : "УНИВЕРСИТЕТ"}</text>`;
    } else if (x === 0 || x === campus[0].length - 1) {
      art = `<path d="M12 0h40v64H12" fill="#AEA184"/><path d="M${x === 0 ? 54 : 10} 0v64" stroke="#795539" stroke-width="2"/>`;
      if (y % 2 === 0) art += `<path d="M15 3h35v59H15z" fill="#795539"/><path d="M18 5h29v56H18z" fill="#A77A50"/><path d="M20 8h25v51H20z" fill="#795539"/><path d="M22 10h21v47H22z" fill="#A77A50"/><path d="M24 24h7v13h-7zM34 24h7v13h-7zM24 41h7v13h-7zM34 41h7v13h-7z" fill="#795539"/><path d="M25 25h5v10h-5zM35 25h5v10h-5zM25 42h5v10h-5zM35 42h5v10h-5z" fill="#A77A50" stroke="none"/><path d="M19 6v53M23 11v8m20 7v7M27 44v6M33 9v47" stroke="#C3B58F"/><path d="M22 12h22v10H22z" fill="#3C3429"/><path d="M24 14h18v6H24z" fill="#F5ECD5" stroke="none"/><text x="33" y="19" text-anchor="middle" font-size="6" stroke="none" fill="#3C3429">${100 + y + x}</text><path d="M42 32h3v8h-3z" fill="#AEA184"/><path d="M38 34h6v2h-6z" fill="#F5ECD5"/><path d="M17 14h2v5h-2zM17 47h2v5h-2z" fill="#AEA184"/>`;

      else art += '<path d="M22 20h20v24H22z" fill="#4E5E43"/><path d="M23 21h18v22H23z" fill="none" stroke="#73805A"/><path d="M28 25h8v2h-3v11h3v2h-8v-2h3V27h-3z" fill="#F5ECD5" stroke="none"/>';
    } else if (x === 2 && y === 2) {
      art = '<path d="M0 0h64v64H0z" fill="#D8CBA5" stroke="none"/><path d="M4 56h56v4H4z" fill="#3C3429" opacity=".25" stroke="none"/><rect x="4" y="8" width="56" height="50" fill="#AEA184"/><path d="M6 8h52M6 8v46" stroke="#D8CBA5"/><path d="M24 8v50m18-50v50M8 16h8m12 0h6m12 0h8M8 20h8m12 0h6m12 0h8M18 30v8m18-8v8m18-8v8" stroke="#3C3429"/>';
    } else if (x === 3) {
      art = '<path d="M0 0h64v64H0z" fill="#D8CBA5" stroke="none"/><rect x="6" y="8" width="52" height="48" fill="#795539"/><path d="M8 54V8h48" fill="none" stroke="#D8CBA5"/><rect x="12" y="12" width="42" height="38" fill="#F5ECD5"/><text x="32" y="24" text-anchor="middle" font-size="7" fill="#3C3429">СДАЧА</text><text x="32" y="34" text-anchor="middle" font-size="7" fill="#3C3429">ПРОЕКТОВ</text><text x="32" y="44" text-anchor="middle" font-size="9" fill="#795539">до 23:59</text>';
    } else if (x === 4) {
      art = vendingArt;
    } else {
      art = plantArt;
    }
  } else if (tile === "D") {
    art = '<rect x="4" y="8" width="54" height="50" rx="0" fill="#A77A50" opacity=".45"/><path d="M10 12h44v40H10z" fill="none" stroke="#D8CBA5" stroke-width="2"/>';
  }
  if (!art) return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("class", "interior-art");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<g stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter">${art}</g>`;
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
      ], { duration: 150, easing: "steps(5, end)" });
      student.querySelector(".student-body").animate([
        { transform: "translateY(0)" }, { transform: `translateY(${gained ? -7 : -3}px)`, offset: .45 }, { transform: "translateY(0)" },
      ], { duration: gained ? 240 : 150, easing: "steps(5, end)" });
    }
    if (gained && pickup) {
      const target = document.querySelector(`[data-part="${pickup.id}"]`).getBoundingClientRect();
      const effect = pickup.svg;
      effect.classList.add("pickup-effect");
      effect.insertAdjacentHTML("beforeend", '<g class="pixel-sparks" fill="#D8AD4B" stroke="#F0E5C9" stroke-width="2"><path d="M6 8h6v6H6zM48 8h6v6h-6zM8 48h6v6H8zM50 46h6v6h-6z"/></g>');
      Object.assign(effect.style, { left: `${pickup.rect.x}px`, top: `${pickup.rect.y}px`, width: `${pickup.rect.width}px`, height: `${pickup.rect.height}px` });
      document.body.append(effect);
      pickupEffects.add(effect);
      const flight = effect.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: "translate(0, -16px) scale(1.1)", opacity: 1, offset: .22 },
        { transform: `translate(${target.x + target.width / 2 - pickup.rect.x - pickup.rect.width / 2}px, ${target.y + target.height / 2 - pickup.rect.y - pickup.rect.height / 2}px) scale(.15)`, opacity: 0 },
      ], { duration: 420, easing: "steps(6, end)", fill: "forwards" });
      flight.onfinish = () => { effect.remove(); pickupEffects.delete(effect); };
      map.querySelector(".library-book")?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "translateY(0)" }], { duration: 240, easing: "steps(4, end)" });
    }
    if (!restarting && lastDrawing.count < 3 && collected.size === 3) {
      map.querySelector(".lock-shackle")?.animate([{ transform: "translate(0, 0)" }, { transform: "translate(3px, -2px)" }], { duration: 220, easing: "steps(4, end)" });
    }
    if (phase === "won" && lastDrawing?.phase !== "won") {
      map.querySelector(".printer-paper")?.animate([{ transform: "translateY(-9px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: 240, easing: "steps(4, end)" });
    }
  }
  lastDrawing = { x: player.x, y: player.y, count: collected.size, moves: movesLeft, phase };
}

function renderMap() {
  map.style.setProperty("--map-columns", campus[0].length);
  map.dataset.placingNote = String(placingNote);
  const decorContext = { campus, seed: currentSeed(), level: currentLevel(), coins: levelData.coins, guard: levelData.guard };
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
    const decoration = createDecoration(tile, x, y, decorContext);
    if (decoration) cell.append(decoration);
    const model = createMapModel(tile, here);
    if (model) cell.append(model);
    else if (!interior && !decoration) cell.textContent = availablePart ? tile : landmarks[tile] || "";
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
  if (guidedPart && !collected.has(guidedPart)) {
    const route = routeToPart(campus, player, guidedPart, levelData.guard, guardTurn);
    if (route) map.setAttribute("aria-label", `${map.getAttribute("aria-label").replace(/\.$/, "")}. Подсвечен путь к части «${parts[guidedPart]}»: ${route.length} шагов.`);
    route?.forEach(({ x, y }, index) => {
      const cell = map.children[y * campus[0].length + x];
      cell.classList.add(index === route.length - 1 ? "route-target" : "route-cell");
      const badge = document.createElement("span");
      badge.className = "route-number";
      badge.textContent = index + 1;
      badge.setAttribute("aria-hidden", "true");
      cell.append(badge);
    });
  }
  if (levelData.guard && guardForecastUntil > guardTurn) {
    const forecast = new Map();
    const nextCells = nextGuardCells(levelData.guard, guardTurn, Math.min(3, guardForecastUntil - guardTurn));
    map.setAttribute("aria-label", `${map.getAttribute("aria-label").replace(/\.$/, "")}. Следующие клетки охранника: ${nextCells.map(({ x, y }) => `строка ${y + 1}, столбец ${x + 1}`).join("; ")}.`);
    nextCells.forEach(({ x, y }, index) => {
      const key = `${x},${y}`;
      forecast.set(key, [...(forecast.get(key) || []), index + 1]);
    });
    forecast.forEach((steps, key) => {
      const [x, y] = key.split(",").map(Number);
      const cell = map.children[y * campus[0].length + x];
      const badge = document.createElement("span");
      badge.className = "guard-forecast";
      badge.textContent = steps.join("·");
      badge.setAttribute("aria-hidden", "true");
      cell.append(badge);
    });
  }
  markedCells.forEach(key => {
    const [x, y] = key.split(",").map(Number);
    const cell = map.children[y * campus[0].length + x];
    if (cell) { cell.classList.add("note-marked"); cell.title += " · Ваша метка"; }
  });
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
  } else if (id === "guard-schedule") {
    if (!levelData.guard || currentLevel() < 21 || !consume(id)) return false;
    guardForecastUntil = guardTurn + 3;
    message.textContent = "Следующие три клетки патруля отмечены числами 1–3.";
  } else if (id === "campus-map") {
    const guide = nearestPartRoute(campus, player, collected, levelData.guard, guardTurn);
    if (!guide || !consume(id)) return false;
    guidedPart = guide.id;
    message.textContent = `Путь к части «${parts[guidedPart]}» подсвечен. Охранник учтён.`;
  } else if (id === "thermos") {
    if (thermosUsed || collected.size === 3 || !consume(id)) return false;
    thermosUsed = true;
    thermosArmed = true;
    message.textContent = "Термокружка готова: следующий сбор части вернёт 1 ход.";
  } else if (id === "spare-sheet") {
    if (placingNote) return false;
    placingNote = true;
    map.tabIndex = 0;
    map.focus({ preventScroll: true });
    message.textContent = "Выберите проходимую клетку на карте для метки.";
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
    if (guidedPart === tile) guidedPart = null;
    if (thermosArmed) {
      thermosArmed = false;
      movesLeft++;
      bonusMoves++;
    }
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
  guardForecastUntil = 0;
  guidedPart = null;
  thermosArmed = false;
  thermosUsed = false;
  placingNote = false;
  markedCells.clear();
  map.removeAttribute("tabindex");
  message.textContent = `Соберите части 1, 2 и 3, затем идите к принтеру. На всё — ${moveLimit} ходов.`;
  resetCoins();
  renderMap();
}

movementButtons.forEach(button => {
  button.addEventListener("click", () => movePlayer(Number(button.dataset.dx), Number(button.dataset.dy)));
});
function placeNote(x, y) {
  if (!placingNote || phase !== "playing" || campus[y]?.[x] === "#" || !campus[y]?.[x] || !consume("spare-sheet")) return false;
  markedCells.add(`${x},${y}`);
  placingNote = false;
  map.removeAttribute("tabindex");
  message.textContent = `Метка оставлена: строка ${y + 1}, столбец ${x + 1}.`;
  renderMap();
  return true;
}
map.addEventListener("click", event => {
  if (!placingNote || isMarketOpen()) return;
  const cell = event.target.closest(".cell");
  if (!cell || !map.contains(cell)) return;
  const index = Array.prototype.indexOf.call(map.children, cell);
  placeNote(index % campus[0].length, Math.floor(index / campus[0].length));
});
map.addEventListener("keydown", event => {
  if (placingNote && (event.key === "Enter" || event.key === " ") && event.target === map) {
    event.preventDefault();
    placeNote(player.x, player.y);
  }
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
configureConsumables(() => ({ playing: phase === "playing", keyArmed, keyUsed, level: currentLevel(), remainingParts: 3 - collected.size, thermosArmed, thermosUsed, placingNote }), useRoundItem);
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
