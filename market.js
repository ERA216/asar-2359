import { itemArt } from "./campus-art.js";
import { items } from "./items.js";
import { getBalance, subscribe as subscribeBalance } from "./currency.js";
import { buy, getCount, isEquipped, toggleSkin, subscribe as subscribeInventory } from "./inventory.js";
import { currentLevel } from "./levels.js";

const dialog = document.querySelector("#market-dialog");
const cards = document.querySelector("#market-cards");
const notice = document.querySelector("#market-notice");
let activeTab = "item";
const icons = itemArt;
export function itemIcon(id) { return `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges">${icons[id] || ""}</svg>`; }
export function isMarketOpen() { return dialog.open; }

function renderMarket() {
  document.querySelector("#market-balance").textContent = getBalance();
  const focusId = cards.contains(document.activeElement) ? document.activeElement.dataset.buy || document.activeElement.dataset.equip : null;
  cards.innerHTML = items.filter(item => item.type === activeTab && (!item.minLevel || currentLevel() >= item.minLevel)).map(item => {
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
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) card?.animate([{ backgroundColor: "#D8CBA5" }, { backgroundColor: "#F5ECD5" }], { duration: 180, easing: "steps(1, end)" });
});
subscribeBalance(renderMarket);
subscribeInventory(renderMarket);
subscribeInventory(() => {
  const map = document.querySelector("#map");
  if (isEquipped("backpack-ochre")) map.style.setProperty("--student-backpack", "#A57B32");
  else map.style.removeProperty("--student-backpack");
  if (isEquipped("jacket-terracotta")) map.style.setProperty("--student-jacket", "#A77A50");
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
    const used = item.id === "door-key" && state.keyUsed || item.id === "thermos" && state.thermosUsed;
    const blocked = !state.playing || used || item.minLevel && state.level < item.minLevel || item.id === "thermos" && state.remainingParts === 0 || item.id === "campus-map" && state.remainingParts === 0 || item.id === "spare-sheet" && state.placingNote;
    const label = item.minLevel && state.level < item.minLevel ? `С уровня ${item.minLevel}` : used ? "Уже использован" : item.id === "spare-sheet" && state.placingNote ? "Выберите клетку" : "Использовать";
    return `<div class="consumable">${itemIcon(item.id)}<span>${item.name}: ${getCount(item.id)}</span><button type="button" data-use="${item.id}" ${blocked ? "disabled" : ""} aria-label="Использовать ${item.name}">${label}</button></div>`;
  }).join("");
  const hints = [
    state.keyArmed && "Ключ готов: следующий шаг может пройти во внутреннее препятствие. Внешние стены закрыты.",
    state.thermosArmed && "Термокружка готова: следующий сбор части вернёт 1 ход.",
    state.placingNote && "Закройте инвентарь и выберите проходимую клетку на карте. Enter отметит клетку под студентом.",
  ].filter(Boolean);
  itemNotice.hidden = hints.length === 0;
  itemNotice.textContent = hints.join(" ");
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
