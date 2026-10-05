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
  <ellipse cx="32" cy="57" rx="19" ry="4" fill="#122b35" opacity=".25"/>
  <rect x="41" y="28" width="13" height="23" rx="5" fill="#e3a64d" stroke="#243947" stroke-width="2"/>
  <path d="M23 44h9v12h-11zm10 0h9l2 12h-11z" fill="#273b55"/>
  <path d="M20 56h12v4H18v-2zm13 0h12l2 4H33z" fill="#172b36"/>
  <path d="M23 28q9-6 18 0l8 18-6 3-5-10v12H24V39l-5 10-6-3z" fill="#5cbeb0" stroke="#243947" stroke-width="2" stroke-linejoin="round"/>
  <path d="M39 29v20" stroke="#bc8640" stroke-width="4"/>
  <circle cx="32" cy="18" r="13" fill="#243947"/>
  <rect x="23" y="12" width="18" height="16" rx="7" fill="#efc39b"/>
  <path d="M22 16v-6q10-10 21 1l-2 8-5-8-5 5z" fill="#243947"/>
  <path d="M28 19h1m7 0h1" stroke="#243947" stroke-width="2" stroke-linecap="round"/>
  <path d="M28 33l4 4 4-4" fill="none" stroke="#d7fff0" stroke-width="2"/>`;

const libraryArtwork = `
  <path d="M7 22L32 7l25 15z" fill="#eac47c" stroke="#253e46" stroke-width="2" stroke-linejoin="round"/>
  <rect x="10" y="23" width="44" height="31" rx="2" fill="#dde9d7"/>
  <rect x="17" y="29" width="30" height="19" rx="2" fill="#253e46"/>
  <path d="M19 44V32h5v12zm7 0V30h5v14zm7 0V33h5v11z" fill="#eac47c"/>
  <path d="M40 32l4-1 3 12-4 1z" fill="#79c9b7"/>
  <path d="M11 25h5v27h-5zm37 0h5v27h-5z" fill="#a6bcae"/>
  <path d="M7 53h50v5H7z" fill="#eac47c"/>
  <path d="M25 16q4-2 7 0 3-2 7 0v6q-4-2-7 0-3-2-7 0z" fill="#253e46"/>`;

function createMapModel(tile, here) {
  if (!here && tile !== "B" && tile !== "P") return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  let artwork = tile === "B" ? libraryArtwork : "";
  if (tile === "P") {
    const ready = collected.size === 3;
    const accent = ready ? "#9af5b0" : "#bac2c9";
    svg.setAttribute("data-printer-state", ready ? "ready" : "locked");
    artwork = `
      ${ready ? '<circle cx="32" cy="32" r="29" fill="#9af5b0" opacity=".2"/>' : ""}
      <rect x="19" y="8" width="26" height="20" rx="2" fill="#f0f3e8" stroke="#253e46" stroke-width="2"/>
      <path d="M24 14h16m-16 5h12" stroke="#9cacae" stroke-width="2"/>
      <rect x="9" y="24" width="46" height="24" rx="6" fill="${accent}" stroke="#253e46" stroke-width="2"/>
      <circle cx="47" cy="31" r="3" fill="${ready ? "#188848" : "#755b49"}"/>
      <rect x="17" y="36" width="30" height="8" rx="2" fill="#253e46"/>
      <path d="M21 40h22v16H21z" fill="#f0f3e8" stroke="#253e46" stroke-width="2"/>
      ${ready
        ? '<path d="M26 48l4 4 8-9" fill="none" stroke="#188848" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<rect x="28" y="47" width="8" height="6" rx="1" fill="#755b49"/><path d="M30 47v-2a2 2 0 0 1 4 0v2" fill="none" stroke="#755b49" stroke-width="2"/>'}`;
  }
  // Keep a landmark visible when the student occupies its cell.
  if (here) artwork += `<g data-model="student"${artwork ? ' transform="translate(28 25) scale(.58)"' : ""}>${studentArtwork}</g>`;
  svg.innerHTML = artwork;
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

function renderMap() {
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
}

function movePlayer(dx, dy) {
  if (phase !== "playing") return;
  const x = player.x + dx;
  const y = player.y + dy;
  const tile = campus[y]?.[x];
  if (!tile || tile === "#") {
    message.textContent = "Здесь здание. Выберите другую дорогу — ход не потрачен.";
    return;
  }
  Object.assign(player, { x, y });
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
