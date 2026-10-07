import { generateLevel } from "./level-generator.js";

// Set false to restore the original handcrafted map and its 21-move limit.
export const generatedLevels = true;
const storageKey = "asar:levels:v1";
const validLevel = value => Number.isSafeInteger(value) && value > 0 && value < Number.MAX_SAFE_INTEGER;
const newSeed = () => crypto.getRandomValues(new Uint32Array(1))[0];
let progress;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (validLevel(saved?.level) && Number.isInteger(saved.seed) && saved.seed >= 0 && saved.seed <= 0xffffffff) progress = saved;
} catch { /* Storage is optional; the current session remains playable. */ }
progress ||= { level: 1, seed: newSeed() };
const url = new URL(location.href);
const requested = url.searchParams.get("level");
if (generatedLevels && /^\d+$/.test(requested || "") && validLevel(Number(requested))) {
  progress.level = Number(requested);
  url.searchParams.delete("level");
  history.replaceState(history.state, "", url.href);
}
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Keep playing without persistence. */ }
}
if (generatedLevels) save();
export function currentLevel() { return progress.level; }
export function loadLevel(manual) { return generatedLevels ? generateLevel(progress.seed, progress.level) : manual; }
export function nextLevel() { if (validLevel(progress.level + 1)) { progress.level++; save(); } }
export function newSeries() { progress = { level: 1, seed: newSeed() }; save(); }
