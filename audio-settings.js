const storageKey = "asar:audio-settings:v1";
const volumes = { music: 0.3, effects: 0.55 };
const listeners = new Set();

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  for (const kind of Object.keys(volumes)) {
    if (Number.isFinite(saved?.[kind])) volumes[kind] = Math.max(0, Math.min(1, saved[kind]));
  }
} catch { /* Keep defaults when storage is unavailable. */ }

export function getAudioVolume(kind) { return volumes[kind]; }

export function setAudioVolume(kind, value) {
  if (!(kind in volumes) || !Number.isFinite(value)) return;
  volumes[kind] = Math.max(0, Math.min(1, value));
  try { localStorage.setItem(storageKey, JSON.stringify(volumes)); } catch { /* Current session still works. */ }
  listeners.forEach(listener => listener(kind, volumes[kind]));
}

export function subscribeAudioVolume(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
