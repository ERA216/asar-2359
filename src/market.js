import { itemArt, plantArt, studentArt } from "./campus-art.js";
import { bicycleArt } from "./decor-art.js";
import { items } from "./items.js";
import { getBalance, subscribe as subscribeBalance } from "./currency.js";
import { buy, getCount, isEquipped, toggleSkin, subscribe as subscribeInventory } from "./inventory.js";
import { currentLevel } from "./levels.js";

const dialog = document.querySelector("#market-dialog");
const cards = document.querySelector("#market-cards");
const notice = document.querySelector("#market-notice");
const preview = document.querySelector("#character-preview");
preview.querySelector(".character-plant").innerHTML = plantArt;
preview.querySelector(".character-bicycle").innerHTML = bicycleArt;
preview.querySelector(".character-student").innerHTML = studentArt;
let activeTab = "item";
let returnFocus = document.querySelector("#market-open");
const icons = itemArt;
export function itemIcon(id) { return `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges">${icons[id] || ""}</svg>`; }
export function isMarketOpen() { return dialog.open; }

const itemToast = document.createElement("div");
itemToast.id = "item-use-toast";
itemToast.setAttribute("popover", "manual");
itemToast.setAttribute("role", "status");
itemToast.setAttribute("aria-live", "polite");
document.body.append(itemToast);
let itemToastTimer;
const itemPresentation = {
  "extra-moves": { result: "+2 ХОДА", ornament: '<span class="item-vfx-clock-hand"></span><span class="item-vfx-clock-tick"></span>' },
  "door-key": { result: "КЛЮЧ ГОТОВ", ornament: '<span class="item-vfx-lock"><span></span></span>' },
  "guard-schedule": { result: "ПАТРУЛЬ РАСКРЫТ", ornament: '<span class="item-vfx-days"><i>1</i><i>2</i><i>3</i></span>' },
  "campus-map": { result: "МАРШРУТ НАЙДЕН", ornament: '<svg class="item-vfx-path" viewBox="0 0 120 48"><path pathLength="1" d="M8 38h24V12h28v24h25V9h27"/><circle cx="112" cy="9" r="4"/></svg>' },
  thermos: { result: "ЗАПАС СИЛ", ornament: '<span class="item-vfx-steam"><i></i><i></i><i></i></span>' },
  "spare-sheet": { result: "ЛИСТ ГОТОВ", ornament: '<span class="item-vfx-pencil"><i></i></span>' },
};
export function showItemToast(text, id, marked = false) {
  const presentation = itemPresentation[id];
  itemToast.replaceChildren();
  if (presentation) {
    itemToast.dataset.item = id;
    itemToast.classList.toggle("item-toast-marked", marked);
    itemToast.innerHTML = `<div class="item-toast-art" aria-hidden="true"><span class="item-toast-halo"></span><span class="item-toast-rays"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="item-toast-icon">${itemIcon(id)}</span>${presentation.ornament}<span class="item-toast-sparks"><i></i><i></i><i></i><i></i><i></i><i></i></span></div><div class="item-toast-content"><span class="item-toast-eyebrow"></span><strong class="item-toast-name"></strong><span class="item-toast-result"></span><span class="item-toast-copy"></span></div><span class="item-toast-progress" aria-hidden="true"></span>`;
    itemToast.querySelector(".item-toast-eyebrow").textContent = id === "spare-sheet" && !marked ? "ПРЕДМЕТ ВЫБРАН" : "ПРЕДМЕТ ИСПОЛЬЗОВАН";
    itemToast.querySelector(".item-toast-name").textContent = items.find(item => item.id === id).name;
    itemToast.querySelector(".item-toast-result").textContent = marked ? "МЕТКА ПОСТАВЛЕНА" : presentation.result;
    itemToast.querySelector(".item-toast-copy").textContent = text;
  } else {
    itemToast.removeAttribute("data-item");
    itemToast.classList.remove("item-toast-marked");
    itemToast.textContent = text;
  }
  if (!itemToast.matches(":popover-open")) itemToast.showPopover();
  clearTimeout(itemToastTimer);
  itemToastTimer = setTimeout(() => {
    if (itemToast.matches(":popover-open")) itemToast.hidePopover();
  }, 3400);
}

let worldEffectTimer;
export function animateItemWorld(id) {
  const map = document.querySelector("#map");
  const counter = document.querySelector("#moves-counter");
  clearTimeout(worldEffectTimer);
  map.removeAttribute("data-item-effect");
  counter.querySelector(".item-moves-float")?.remove();
  // Replaying the same item must restart the map animation.
  void map.offsetWidth;
  map.dataset.itemEffect = id;
  if (id === "extra-moves") {
    const marker = document.createElement("span");
    marker.className = "item-moves-float";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "+2";
    counter.append(marker);
  }
  worldEffectTimer = setTimeout(() => {
    map.removeAttribute("data-item-effect");
    counter.querySelector(".item-moves-float")?.remove();
  }, 1900);
}

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

function selectTab(tab) {
  activeTab = tab;
  document.querySelector("#market-title").textContent = tab === "skin" ? "Персонаж" : "Рынок кампуса";
  preview.hidden = tab !== "skin";
  document.querySelectorAll("[data-market-tab]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.marketTab === tab)));
  renderMarket();
}
function openDialog(tab, opener) {
  returnFocus = opener;
  selectTab(tab);
  dialog.showModal();
}
export function openCharacter(opener) { openDialog("skin", opener); }
document.querySelector("#market-open").addEventListener("click", event => openDialog("item", event.currentTarget));
document.querySelector("#market-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => returnFocus.focus({ preventScroll: true }));
document.querySelectorAll("[data-market-tab]").forEach(button => {
  button.addEventListener("click", () => selectTab(button.dataset.marketTab));
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
  const backpack = isEquipped("backpack-olive") ? "#73805A" : isEquipped("backpack-ochre") ? "#A57B32" : "";
  const jacket = isEquipped("jacket-stone") ? "#AEA184" : isEquipped("jacket-terracotta") ? "#A77A50" : "";
  for (const target of [map, preview]) {
    if (backpack) target.style.setProperty("--student-backpack", backpack);
    else target.style.removeProperty("--student-backpack");
    if (jacket) target.style.setProperty("--student-jacket", jacket);
    else target.style.removeProperty("--student-jacket");
    if (isEquipped("cap-ochre")) target.style.setProperty("--student-cap-display", "inline");
    else target.style.removeProperty("--student-cap-display");
    if (isEquipped("glasses-scholar")) target.style.setProperty("--student-glasses-display", "inline");
    else target.style.removeProperty("--student-glasses-display");
  }
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
    state.placingNote && "Выберите проходимую клетку на карте. Enter отметит клетку под студентом.",
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
  if (!button || button.disabled) return;
  const ownerDialog = button.closest("dialog");
  if (useRoundItem(button.dataset.use)) ownerDialog?.close();
});
