const storageKey = "asar:play-stats:v1";
const listeners = new Set();
let itemsUsed = 0;
let bestMoves = null;

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (Number.isSafeInteger(saved.itemsUsed) && saved.itemsUsed >= 0) itemsUsed = saved.itemsUsed;
  if (Number.isSafeInteger(saved.bestMoves) && saved.bestMoves > 0) bestMoves = saved.bestMoves;
} catch { /* Stats remain available for this session. */ }

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ itemsUsed, bestMoves })); }
  catch { /* Keep session stats when storage is unavailable. */ }
  listeners.forEach(callback => callback({ itemsUsed, bestMoves }));
}

export function recordItemUse() {
  if (itemsUsed >= Number.MAX_SAFE_INTEGER) return;
  itemsUsed++;
  save();
}

export function recordBestMoves(moves) {
  if (!Number.isSafeInteger(moves) || moves < 1 || bestMoves !== null && moves >= bestMoves) return;
  bestMoves = moves;
  save();
}

export function subscribeStats(callback) {
  listeners.add(callback);
  callback({ itemsUsed, bestMoves });
  return () => listeners.delete(callback);
}
