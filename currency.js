const storageKey = "asar:coins:v1";
const subscribers = new Set();
let balance = 0;

// Storage is optional: the current session still works when it is unavailable.
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? "0");
  if (Number.isSafeInteger(saved) && saved >= 0) balance = saved;
} catch {
  balance = 0;
}

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
  try {
    localStorage.setItem(storageKey, JSON.stringify(balance));
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
  validateAmount(balance + amount);
  updateBalance(balance + amount);
  return balance;
}

export function spend(price) {
  validateAmount(price);
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
