// Connection state is supplied by the existing Phantom connection flow.
// A public address is not proof of ownership for server-side token rewards.
let address = "";
const listeners = new Set();
export function getWalletAddress() { return address; }
export function setWalletAddress(next) {
  const value = typeof next === "string" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(next) ? next : "";
  if (value === address) return;
  address = value;
  listeners.forEach(callback => callback(address));
}
export function subscribeWallet(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
