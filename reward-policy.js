// Presentation/gameplay limits, not a blockchain payout authorization.
export function mapRewardLimit(level, connected) {
  if (!connected || !Number.isSafeInteger(level) || level < 1) return 0;
  return level < 15 ? 1 : 2;
}

export function createMapClaims(storage) {
  const memory = new Map();
  const keyFor = (wallet, map) => `asar:map-claims:v1:${wallet}:${map}`;
  function read(wallet, map) {
    const key = keyFor(wallet, map);
    let stored = [];
    try { stored = JSON.parse(storage?.getItem(key) || "[]"); } catch { /* Session fallback. */ }
    const values = Array.isArray(stored) ? stored.filter(n => Number.isSafeInteger(n) && n >= 0) : [];
    return new Set([...(memory.get(key) || []), ...values]);
  }
  return {
    has(wallet, map, index) { return read(wallet, map).has(index); },
    claim(wallet, map, index, limit) {
      if (!wallet || !Number.isSafeInteger(index) || index < 0 || index >= limit) return false;
      const claimed = read(wallet, map);
      if (claimed.has(index) || claimed.size >= limit) return false;
      claimed.add(index);
      const key = keyFor(wallet, map);
      memory.set(key, claimed);
      try { storage?.setItem(key, JSON.stringify([...claimed])); } catch { /* Session fallback. */ }
      return true;
    },
    total(wallet) {
      if (!wallet) return 0;
      const prefix = `asar:map-claims:v1:${wallet}:`;
      const keys = new Set([...memory.keys()].filter(key => key.startsWith(prefix)));
      try {
        for (let index = 0; index < storage.length; index++) {
          const key = storage.key(index);
          if (key?.startsWith(prefix)) keys.add(key);
        }
      } catch { /* Count in-session claims when storage is unavailable. */ }
      let count = 0;
      for (const key of keys) count += read(wallet, key.slice(prefix.length)).size;
      return count;
    },
  };
}
