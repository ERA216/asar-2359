import { items } from "./items.js";
import { spend } from "./currency.js";

const storageKey = "asar:inventory:v1";
const listeners = new Set();
const owned = {};
const equipped = {};
let purchasing = false;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  for (const item of items) {
    const count = saved?.owned?.[item.id];
    if (Number.isSafeInteger(count) && count > 0) owned[item.id] = item.type === "skin" ? 1 : count;
    if (item.type === "skin" && owned[item.id] && saved?.equipped?.[item.id] === true) equipped[item.id] = true;
  }
} catch { /* Use an empty inventory when storage is unavailable or invalid. */ }

export function getCount(id) { return owned[id] || 0; }
export function isEquipped(id) { return equipped[id] === true; }

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ owned, equipped })); }
  catch { /* Keep the current session usable when browser storage is blocked. */ }
  listeners.forEach(callback => {
    try { callback(); } catch (error) { console.error("Inventory subscriber failed:", error); }
  });
}

export function buy(id) {
  const item = items.find(entry => entry.id === id);
  if (purchasing || !item || (item.type === "skin" && getCount(id)) || getCount(id) === Number.MAX_SAFE_INTEGER) return false;
  purchasing = true;
  try {
    if (!spend(item.price)) return false;
    owned[id] = getCount(id) + 1;
    save();
    return true;
  } finally { purchasing = false; }
}

export function consume(id) {
  if (!items.some(item => item.id === id && item.type === "item") || !getCount(id)) return false;
  owned[id]--;
  save();
  return true;
}

export function subscribe(callback) {
  listeners.add(callback);
  callback();
  return () => listeners.delete(callback);
}
