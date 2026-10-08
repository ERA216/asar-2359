import { items } from "./items.js";
import { getBalance, subscribe as subscribeBalance } from "./currency.js";
import { buy, getCount, isEquipped, toggleSkin, subscribe as subscribeInventory } from "./inventory.js";

const dialog = document.querySelector("#market-dialog");
const cards = document.querySelector("#market-cards");
const notice = document.querySelector("#market-notice");
let activeTab = "item";
const icons = {
  "extra-moves": '<path d="M11 4h10v3h5v5h3v10h-3v5h-5v3H11v-3H6v-5H3V12h3V7h5z" fill="#D8AD4B"/><path d="M12 8h8v3h4v12h-4v3h-8v-3H8V11h4z" fill="#F0E5C9"/><path d="M16 12v6h5M8 3h3m10 0h3"/>',
  "door-key": '<path d="M5 3h10v3h3v10h-3v3H5v-3H2V6h3z" fill="#C58060"/><path d="M7 7h6v7H7z" fill="#F0E5C9"/><path d="M16 15h4v4h4v4h5v6h-5v-3h-4v-4h-4z" fill="#C58060"/>',
  "backpack-ochre": '<path d="M11 8V3h10v5M7 9h18v3h3v14h-3v3H7v-3H4V12h3z" fill="#C58060"/><path d="M10 18h12v8H10z" fill="#D8AD4B"/><path d="M7 13h18M12 21h8"/>',
  "jacket-terracotta": '<path d="M10 5h4v3h4V5h4v3h4v5h3v11h-6v-8h-2v13H11V16H9v8H3V13h3V8h4z" fill="#A97935"/><path d="M16 9v20M12 7v4h8V7"/>',
};
export function itemIcon(id) { return `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges">${icons[id] || ""}</svg>`; }
export function isMarketOpen() { return dialog.open; }

function renderMarket() {
  document.querySelector("#market-balance").textContent = getBalance();
  const focusId = cards.contains(document.activeElement) ? document.activeElement.dataset.buy || document.activeElement.dataset.equip : null;
  cards.innerHTML = items.filter(item => item.type === activeTab).map(item => {
    const count = getCount(item.id);
    const purchased = item.type === "skin" && count > 0;
    const shortage = Math.max(0, item.price - getBalance());
    const action = purchased
      ? `<button type="button" data-equip="${item.id}" aria-pressed="${isEquipped(item.id)}">${isEquipped(item.id) ? "Снять" : "Надеть"}</button>`
      : `<button type="button" data-buy="${item.id}" ${shortage ? "disabled" : ""}>${shortage ? `Не хватает ${shortage}` : "Купить"}</button>`;
    return `<article class="market-card">${itemIcon(item.id)}<h3>${item.name}</h3><p>${item.description}</p><p class="market-owned">${item.type === "item" ? `У вас: ${count}` : purchased ? (isEquipped(item.id) ? "Куплено · надето" : "Куплено") : "Для вашего студента"}</p><div class="market-price"><span><span class="market-coin" aria-hidden="true"></span> ${item.price} монет</span>${action}</div></article>`;
  }).join("");
  if (focusId) cards.querySelector(`[data-buy="${focusId}"], [data-equip="${focusId}"]`)?.focus({ preventScroll: true });
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
  const equipButton = event.target.closest("[data-equip]");
  if (equipButton) {
    const id = equipButton.dataset.equip;
    if (toggleSkin(id)) notice.textContent = `${items.find(item => item.id === id).name}: ${isEquipped(id) ? "надето" : "снято"}.`;
    return;
  }
  const button = event.target.closest("[data-buy]");
  if (!button || button.disabled) return;
  const id = button.dataset.buy;
  if (!buy(id)) { notice.textContent = "Покупка не выполнена. Проверьте баланс."; return; }
  notice.textContent = `Куплено: ${items.find(item => item.id === id).name}.`;
  const nextButton = cards.querySelector(`[data-buy="${id}"], [data-equip="${id}"]`);
  if (nextButton && !nextButton.disabled) nextButton.focus({ preventScroll: true });
  const card = nextButton?.closest("article");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) card?.animate([{ backgroundColor: "#D3C5A2" }, { backgroundColor: "#F0E5C9" }], { duration: 180, easing: "steps(1, end)" });
});
subscribeBalance(renderMarket);
subscribeInventory(renderMarket);
subscribeInventory(() => {
  const map = document.querySelector("#map");
  if (isEquipped("backpack-ochre")) map.style.setProperty("--student-backpack", "#D8AD4B");
  else map.style.removeProperty("--student-backpack");
  if (isEquipped("jacket-terracotta")) map.style.setProperty("--student-jacket", "#974F3D");
  else map.style.removeProperty("--student-jacket");
});

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
