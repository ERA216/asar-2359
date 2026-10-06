import { items } from "./items.js";
import { getBalance, subscribe as subscribeBalance } from "./currency.js";
import { buy, getCount, subscribe as subscribeInventory } from "./inventory.js";

const dialog = document.querySelector("#market-dialog");
const cards = document.querySelector("#market-cards");
const notice = document.querySelector("#market-notice");
let activeTab = "item";
const icons = {
  "extra-moves": '<circle cx="16" cy="16" r="12"/><path d="M16 8v8l5 3M7 6l3-3m12 3-3-3"/>',
  "door-key": '<circle cx="10" cy="11" r="6"/><path d="m14 16 11 11m-5-5 4-4m-8 0 4-4"/>',
  "backpack-ochre": '<rect x="7" y="8" width="18" height="21" rx="4"/><path d="M12 8V4h8v4M11 18h10v7H11zM7 13h18"/>',
  "jacket-terracotta": '<path d="m11 4-6 4-4 14 6 2 4-10v15h10V14l4 10 6-2-4-14-6-4-5 4zM16 8v21"/>',
};
export function itemIcon(id) { return `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[id] || ""}</svg>`; }
export function isMarketOpen() { return dialog.open; }

function renderMarket() {
  document.querySelector("#market-balance").textContent = getBalance();
  const focusId = cards.contains(document.activeElement) ? document.activeElement.dataset.buy : null;
  cards.innerHTML = items.filter(item => item.type === activeTab).map(item => {
    const count = getCount(item.id);
    const purchased = item.type === "skin" && count > 0;
    const shortage = Math.max(0, item.price - getBalance());
    return `<article class="market-card">${itemIcon(item.id)}<h3>${item.name}</h3><p>${item.description}</p><p class="market-owned">${item.type === "item" ? `У вас: ${count}` : purchased ? "Куплено" : "Для вашего студента"}</p><div class="market-price"><span><span class="market-coin" aria-hidden="true"></span> ${item.price} монет</span><button type="button" data-buy="${item.id}" ${purchased || shortage ? "disabled" : ""}>${purchased ? "Куплено" : shortage ? `Не хватает ${shortage}` : "Купить"}</button></div></article>`;
  }).join("");
  if (focusId) cards.querySelector(`[data-buy="${focusId}"]`)?.focus({ preventScroll: true });
}

document.querySelector("#market-open").addEventListener("click", () => { renderMarket(); dialog.showModal(); });
document.querySelector("#market-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => document.querySelector("#market-open").focus({ preventScroll: true }));
document.querySelectorAll("[data-market-tab]").forEach(button => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.marketTab;
    document.querySelectorAll("[data-market-tab]").forEach(tab => tab.setAttribute("aria-pressed", String(tab === button)));
    renderMarket();
  });
});
cards.addEventListener("click", event => {
  const button = event.target.closest("[data-buy]");
  if (!button || button.disabled) return;
  const id = button.dataset.buy;
  if (!buy(id)) { notice.textContent = "Покупка не выполнена. Проверьте баланс."; return; }
  notice.textContent = `Куплено: ${items.find(item => item.id === id).name}.`;
  const card = cards.querySelector(`[data-buy="${id}"]`)?.closest("article");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) card?.animate([{ backgroundColor: "#e1e8d6" }, { backgroundColor: "#faf4e7" }], { duration: 180 });
});
subscribeBalance(renderMarket);
subscribeInventory(renderMarket);

let readRoundState = () => ({ playing: false, keyArmed: false, keyUsed: false });
let useRoundItem = () => false;
const consumables = document.querySelector("#consumables");
const itemNotice = document.querySelector("#item-notice");

export function renderConsumables() {
  const state = readRoundState();
  const available = items.filter(item => item.type === "item" && getCount(item.id) > 0);
  consumables.hidden = available.length === 0;
  consumables.innerHTML = available.map(item => {
    const blocked = !state.playing || (item.id === "door-key" && state.keyUsed);
    return `<div class="consumable">${itemIcon(item.id)}<span>${item.name}: ${getCount(item.id)}</span><button type="button" data-use="${item.id}" ${blocked ? "disabled" : ""} aria-label="Использовать ${item.name}">${item.id === "door-key" && state.keyUsed ? "Уже использован" : "Использовать"}</button></div>`;
  }).join("");
  itemNotice.hidden = !state.keyArmed;
  itemNotice.textContent = state.keyArmed ? "Ключ готов: следующий шаг может пройти во внутреннее препятствие. Внешние стены закрыты." : "";
}

export function configureConsumables(readState, useItem) {
  readRoundState = readState;
  useRoundItem = useItem;
  subscribeInventory(renderConsumables);
}
consumables.addEventListener("click", event => {
  const button = event.target.closest("[data-use]");
  if (button && !button.disabled) useRoundItem(button.dataset.use);
});
