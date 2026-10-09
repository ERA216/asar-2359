import { addCoins, subscribe } from "./currency.js";
import { coinArt } from "./campus-art.js";
import { getWalletAddress, subscribeWallet } from "./wallet-state.js";
import { mapRewardLimit, createMapClaims } from "./reward-policy.js";
let level = 1;
let mapID = "manual";
let lastCampus;
let storage;
try { storage = localStorage; } catch { /* Storage may be disabled. */ }
const claims = createMapClaims(storage);

// Zero-based coordinates: x is the column, y is the row. Use empty floor cells only.
export const coinPositions = [
  { x: 2, y: 1 },
  { x: 4, y: 2 },
  { x: 1, y: 4 },
  { x: 3, y: 5 },
];

export function setCoinPositions(positions, nextLevel = 1, seed = "manual") {
  level = nextLevel;
  mapID = `${seed}:${level}`;
  coinPositions.splice(0, coinPositions.length, ...positions.slice(0, mapRewardLimit(level, true)).map(point => ({ ...point })));
  resetCoins();
}

const flights = new Set();
const map = document.querySelector("#map");
const counter = document.querySelector("#coin-balance");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const artwork = coinArt;

subscribe(balance => { counter.textContent = balance; });

export function renderCoins(campus) {
  lastCampus = campus;
  const wallet = getWalletAddress();
  if (!wallet) return;
  coinPositions.forEach(({ x, y }, index) => {
    if (claims.has(wallet, mapID, index) || campus[y]?.[x] !== ".") return;
    const cell = map.children[y * campus[0].length + x];
    const coin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    coin.setAttribute("viewBox", "0 0 64 64");
    coin.setAttribute("class", "map-coin");
    coin.setAttribute("data-coin", index);
    coin.setAttribute("aria-hidden", "true");
    coin.style.setProperty("--coin-delay", `-${performance.now() / 1000 + index * .4}s`);
    coin.innerHTML = artwork;
    cell.append(coin);
  });
}

export function collectCoin(player) {
  const wallet = getWalletAddress();
  if (!wallet) return;
  const index = coinPositions.findIndex(({ x, y }) => x === player.x && y === player.y);
  if (index < 0 || claims.has(wallet, mapID, index)) return;
  const coin = map.querySelector(`[data-coin="${index}"]`);
  // Only collect coins that were actually placed on valid floor cells.
  if (!coin) return;
  if (!claims.claim(wallet, mapID, index, mapRewardLimit(level, true))) return;
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
  clearFlights();
}

subscribeWallet(() => {
  clearFlights();
  map.querySelectorAll("[data-coin]").forEach(coin => coin.remove());
  if (lastCampus) renderCoins(lastCampus);
});

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) clearFlights();
});
