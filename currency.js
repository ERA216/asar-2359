import { getWalletAddress, subscribeWallet } from "./wallet-state.js";
const storageKey = () => `asar:wallet-coins:v1:${getWalletAddress()}`;
const subscribers = new Set();
const sessionBalances = new Map();
let balance = 0;

// Storage is optional: the current session still works when it is unavailable.
function loadBalance() {
  balance = 0;
  if (!getWalletAddress()) return;
  balance = sessionBalances.get(getWalletAddress()) || 0;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey()) ?? String(balance));
    if (Number.isSafeInteger(saved) && saved >= 0) balance = saved;
  } catch {
    // Retain the wallet's session balance if storage is unavailable.
  }
}
subscribeWallet(() => { loadBalance(); subscribers.forEach(notify); });
loadBalance();

function validateAmount(amount) {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new RangeError("Coin amounts must be non-negative safe integers.");
  }
}

function notify(callback) {
  try {
    callback(balance);
  } catch (error) {
    console.error("Currency subscriber failed:", error);
  }
}

function updateBalance(nextBalance) {
  if (nextBalance === balance) return;
  balance = nextBalance;
  sessionBalances.set(getWalletAddress(), balance);
  try {
    localStorage.setItem(storageKey(), JSON.stringify(balance));
  } catch {
    // Keep the in-memory balance if browser storage is blocked or full.
  }
  subscribers.forEach(notify);
}

export function getBalance() {
  return balance;
}

export function addCoins(amount) {
  validateAmount(amount);
  if (!getWalletAddress()) return 0;
  validateAmount(balance + amount);
  updateBalance(balance + amount);
  return balance;
}

export function spend(price) {
  validateAmount(price);
  if (!getWalletAddress()) return false;
  if (price > balance) return false;
  updateBalance(balance - price);
  return true;
}

// Send the initial value immediately and return an unsubscribe function.
export function subscribe(callback) {
  if (typeof callback !== "function") throw new TypeError("A subscriber must be a function.");
  subscribers.add(callback);
  notify(callback);
  return () => subscribers.delete(callback);
}
