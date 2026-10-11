import assert from "node:assert/strict";
import { mapRewardLimit, createMapClaims } from "../src/reward-policy.js";

const saved = new Map([["asar:coins:v1", "999"]]);
globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value), key: index => [...saved.keys()][index] ?? null, get length() { return saved.size; } };
const walletA = "1".repeat(32), walletB = "2".repeat(32);
const { setWalletAddress } = await import("../src/wallet-state.js");
const { getBalance, addCoins, spend, subscribe } = await import("../src/currency.js");
const observed = [];
subscribe(value => observed.push(value));
assert.equal(getBalance(), 0);
addCoins(5);
assert.equal(getBalance(), 0);
assert.equal(spend(0), false);
setWalletAddress(walletA);
assert.equal(getBalance(), 0, "Do not migrate unverified legacy coins to a wallet");
addCoins(2);
assert.equal(spend(1), true);
setWalletAddress("");
assert.equal(getBalance(), 0);
setWalletAddress(walletB);
assert.equal(getBalance(), 0);
setWalletAddress(walletA);
assert.equal(getBalance(), 1);
assert.equal(saved.get("asar:coins:v1"), "999", "Preserve old save");
assert.deepEqual(observed, [0, 0, 2, 1, 0, 0, 1]);

for (const level of [1, 10, 14, 15, 21, 100]) {
  const limit = level < 15 ? 1 : 2;
  assert.equal(mapRewardLimit(level, false), 0);
  assert.equal(mapRewardLimit(level, true), limit);
  const map = `seed:${level}`;
  let claims = createMapClaims(localStorage);
  assert.equal(claims.claim("", map, 0, limit), false);
  for (let i = 0; i < limit; i++) assert.equal(claims.claim(walletA, map, i, limit), true);
  // A new instance represents a reload, not just an in-memory restart.
  claims = createMapClaims(localStorage);
  for (let i = 0; i < limit + 2; i++) assert.equal(claims.claim(walletA, map, i, limit), false);
  assert.equal(claims.claim(walletB, map, 0, limit), true);
}
const totals = createMapClaims(localStorage);
assert.equal(totals.total(walletA), 9, "Count prior claims after reload");
assert.equal(totals.total(walletB), 6, "Keep wallet totals separate");
const deniedStorage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } };
const session = createMapClaims(deniedStorage);
assert.equal(session.claim(walletA, "map", 0, 1), true);
assert.equal(session.claim(walletA, "map", 0, 1), false);
assert.equal(session.total(walletA), 1, "Count in-session claims without storage");
console.log("Reward policy: wallet gating, 14/15 boundary, accounts, reload, replay and blocked storage passed.");
