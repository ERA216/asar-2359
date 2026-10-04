const campus = [
  "#######",
  "#D....#",
  "#.##..#",
  "#...#B#",
  "#.#...#",
  "#...P.#",
  "#######",
];
const landmarks = { D: "Общага", B: "Библиотека", P: "Принтер" };
const player = { x: 1, y: 1 };
const map = document.querySelector("#map");

function renderMap() {
  map.replaceChildren();
  campus.forEach((row, y) => [...row].forEach((tile, x) => {
    const cell = document.createElement("div");
    const here = player.x === x && player.y === y;
    cell.className = `cell ${tile === "#" ? "wall" : ""} ${landmarks[tile] ? "landmark" : ""} ${here ? "player" : ""}`;
    cell.textContent = here ? "●" : landmarks[tile] || "";
    cell.setAttribute("aria-hidden", "true");
    map.append(cell);
  }));
  const location = landmarks[campus[player.y][player.x]] || "Дорожка";
  const description = `${location} · строка ${player.y + 1}, столбец ${player.x + 1}`;
  document.querySelector("#position").textContent = description;
  map.setAttribute("aria-label", `Карта кампуса. Игрок: ${description}`);
}

function movePlayer(dx, dy) {
  const x = player.x + dx;
  const y = player.y + dy;
  if (!campus[y]?.[x] || campus[y][x] === "#") return;
  Object.assign(player, { x, y });
  renderMap();
}

document.querySelectorAll("[data-dx]").forEach(button => {
  button.addEventListener("click", () => movePlayer(Number(button.dataset.dx), Number(button.dataset.dy)));
});

const directions = {
  ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0],
};
document.addEventListener("keydown", event => {
  if (event.target.closest("input, textarea, select, [contenteditable]")) return;
  const direction = directions[event.code];
  if (direction && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    movePlayer(...direction);
  }
});
renderMap();

// Keep the campus usable even if the wallet module fails to load.
import("./memo.js").catch(() => {
  document.querySelector("#status").textContent = "Не удалось загрузить Solana. Обновите страницу; карта работает отдельно.";
});
