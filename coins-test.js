import assert from "node:assert/strict";
const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) };
globalThis.matchMedia = () => ({ matches: true, addEventListener() {} });
let sprites = [];
const counter = { textContent: "" };
const map = {
  children: Array.from({ length: 9 }, () => ({ append(coin) { sprites.push(coin); } })),
  querySelector(selector) { return sprites.find(s => `[data-coin="${s.attrs['data-coin']}"]` === selector); },
  querySelectorAll() { return [...sprites]; },
};
globalThis.document = {
  querySelector: s => s === "#map" ? map : counter,
  createElementNS: () => ({ attrs: {}, style: { setProperty() {} }, setAttribute(k, v) { this.attrs[k] = String(v); }, remove() { sprites = sprites.filter(s => s !== this); } }),
};
const { setWalletAddress } = await import("./wallet-state.js");
const { getBalance } = await import("./currency.js");
const { setCoinPositions, renderCoins, collectCoin, resetCoins } = await import("./coins.js");
const campus = ["...", "...", "..."];
const points = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
const redraw = () => { sprites = []; renderCoins(campus); };
for (const level of [1, 10, 14, 15, 21]) {
  setWalletAddress("");
  setCoinPositions(points, level, 123);
  redraw();
  assert.equal(sprites.length, 0);
  points.forEach(collectCoin);
  assert.equal(getBalance(), 0);
  setWalletAddress("1".repeat(32));
  const cap = level < 15 ? 1 : 2;
  assert.equal(sprites.length, cap, "Connect updates the map without restarting it");
  const before = getBalance();
  points.forEach(collectCoin);
  redraw();
  assert.equal(getBalance() - before, cap);
  assert.equal(sprites.length, 0);
  resetCoins(); redraw();
  assert.equal(sprites.length, 0, "Restart cannot respawn claimed coins");
  setWalletAddress(""); setWalletAddress("1".repeat(32));
  assert.equal(sprites.length, 0, "Reconnect cannot restore claims");
}
setCoinPositions(points, 15, 999);
redraw();
assert.equal(sprites.length, 2);
setWalletAddress("");
assert.equal(sprites.length, 0, "Disconnect removes visible coins immediately");
assert.equal(counter.textContent, 0);
console.log("Coin integration: guest, connect, collect, restart, reconnect and level thresholds passed.");
