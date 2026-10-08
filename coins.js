import { addCoins, subscribe } from "./currency.js";

// Zero-based coordinates: x is the column, y is the row. Use empty floor cells only.
export const coinPositions = [
  { x: 2, y: 1 },
  { x: 4, y: 2 },
  { x: 1, y: 4 },
  { x: 3, y: 5 },
];

export function setCoinPositions(positions) {
  coinPositions.splice(0, coinPositions.length, ...positions.map(point => ({ ...point })));
  resetCoins();
}

const collectedCoins = new Set();
const flights = new Set();
const map = document.querySelector("#map");
const counter = document.querySelector("#coin-balance");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const artwork = '<path d="M7 27h19v2H7z" fill="#514C3D" opacity=".25"/><g class="coin-face"><path d="M11 3h10v2h4v4h2v12h-2v4h-4v2H11v-2H7v-4H5V9h2V5h4z" fill="#A97935" stroke="#514C3D"/><path d="M11 4h9v2h4v4h2v10h-2v4h-4v2h-9v-2H7v-4H5V10h2V6h4z" fill="#D8AD4B" stroke="#F0E5C9"/><path d="M12 7h7v2h3v12h-3v2h-7v-2H9V9h3z" fill="#D8AD4B"/><path d="M18 10h-5v10h5m-8-5h10" fill="none" stroke="#F0E5C9" stroke-width="2" stroke-linecap="square"/></g>';

subscribe(balance => { counter.textContent = balance; });

export function renderCoins(campus) {
  coinPositions.forEach(({ x, y }, index) => {
    if (collectedCoins.has(index) || campus[y]?.[x] !== ".") return;
    const cell = map.children[y * campus[0].length + x];
    const coin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    coin.setAttribute("viewBox", "0 0 32 32");
    coin.setAttribute("class", "map-coin");
    coin.setAttribute("data-coin", index);
    coin.setAttribute("aria-hidden", "true");
    coin.style.setProperty("--coin-delay", `-${performance.now() / 1000 + index * .4}s`);
    coin.innerHTML = artwork;
    cell.append(coin);
  });
}

export function collectCoin(player) {
  const index = coinPositions.findIndex(({ x, y }) => x === player.x && y === player.y);
  if (index < 0 || collectedCoins.has(index)) return;
  const coin = map.querySelector(`[data-coin="${index}"]`);
  // Only collect coins that were actually placed on valid floor cells.
  if (!coin) return;
  collectedCoins.add(index);
  addCoins(1);
  if (reducedMotion.matches) return;
  const start = coin.getBoundingClientRect();
  const target = counter.getBoundingClientRect();
  const effect = coin.cloneNode(true);
  effect.removeAttribute("data-coin");
  effect.setAttribute("class", "coin-flight");
  Object.assign(effect.style, { left: `${start.x}px`, top: `${start.y}px`, width: `${start.width}px`, height: `${start.height}px` });
  document.body.append(effect);
  const animation = effect.animate([
    { transform: "translate(0, 0) scale(1)", opacity: 1 },
    { transform: "translate(0, -16px) scale(1.1)", opacity: 1, offset: .25 },
    { transform: `translate(${target.x + target.width / 2 - start.x - start.width / 2}px, ${target.y + target.height / 2 - start.y - start.height / 2}px) scale(.2)`, opacity: 0 },
  ], { duration: 380, easing: "steps(6, end)", fill: "forwards" });
  const flight = { effect, animation };
  flights.add(flight);
  animation.onfinish = () => { effect.remove(); flights.delete(flight); };
}

function clearFlights() {
  flights.forEach(({ effect, animation }) => { animation.cancel(); effect.remove(); });
  flights.clear();
}

export function resetCoins() {
  collectedCoins.clear();
  clearFlights();
}

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) clearFlights();
});
