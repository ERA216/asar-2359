const sidebar = document.createElement("aside");
sidebar.id = "sidebar";
sidebar.setAttribute("aria-label", "Стойка кампуса");
sidebar.innerHTML = '<p class="sidebar-label">СТОЙКА КАМПУСА</p><div id="sidebar-wallet"></div><div id="sidebar-coins"></div><nav id="sidebar-nav" aria-label="Разделы игры"></nav><div id="sidebar-tools"></div>';
document.body.prepend(sidebar);
const nav = document.querySelector("#sidebar-nav");
document.querySelector("#sidebar-coins").append(document.querySelector(".coin-counter"));
nav.append(document.querySelector(".market-tools"));
const tools = document.querySelector("#sidebar-tools");
for (const selector of ["#consumables", "#item-notice", "#round-message", "#restart", "#new-series", ".controls", "#position", "main > small"]) tools.append(document.querySelector(selector));

const icons = {
  "market-open": '<path d="M3 9h18l-2-6H5zM5 9v12h14V9M9 21v-7h6v7"/>',
  "gift-open": '<rect x="3" y="6" width="18" height="14" rx="1"/><path d="m3 7 9 7 9-7"/>',
};
function decorate(button, icon) {
  const label = document.createElement("span");
  label.textContent = button.textContent;
  button.replaceChildren(label);
  button.insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>`);
  button.classList.add("sidebar-action");
}
for (const [id, icon] of Object.entries(icons)) decorate(document.getElementById(id), icon);

// Interface-only guard: modal panels keep keyboard input away from the map.
document.addEventListener("keydown", event => {
  if (document.querySelector("dialog[open]") && /^(Arrow(Up|Down|Left|Right)|Key[WASD])$/.test(event.code)) {
    event.stopImmediatePropagation();
    if (!event.target.closest("input, textarea, select, [contenteditable]")) event.preventDefault();
  }
}, true);

function panel(id, title, icon) {
  const button = document.createElement("button");
  button.type = "button"; button.id = `${id}-open`; button.textContent = title;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", `${id}-panel`);
  decorate(button, icon);
  const dialog = document.createElement("dialog");
  dialog.id = `${id}-panel`; dialog.className = "sidebar-panel";
  dialog.setAttribute("aria-labelledby", `${id}-heading`);
  dialog.innerHTML = `<div class="sidebar-panel-heading"><h2 id="${id}-heading">${title}</h2><button type="button" class="sidebar-close">Закрыть</button></div><div class="sidebar-panel-content"></div>`;
  document.body.append(dialog);
  button.addEventListener("click", () => { dialog.showModal(); button.setAttribute("aria-expanded", "true"); });
  dialog.querySelector(".sidebar-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { button.setAttribute("aria-expanded", "false"); button.focus({ preventScroll: true }); });
  return { button, dialog, content: dialog.querySelector(".sidebar-panel-content") };
}
const levels = panel("sidebar-levels", "Уровни", '<path d="M3 21V15h6V9h6V3h6v18z"/>');
const inventory = panel("sidebar-inventory", "Инвентарь", '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 5V2h8v3M4 11h16M9 11v4h6v-4"/>');
nav.prepend(levels.button, inventory.button);
const levelLabel = document.createElement("p");
levels.content.append(levelLabel, document.querySelector("#new-series"));
const updateLevel = () => { levelLabel.textContent = document.querySelector("#level-tag").textContent; };
new MutationObserver(updateLevel).observe(document.querySelector("#level-tag"), { childList: true, subtree: true, characterData: true });
updateLevel();
document.querySelector("#new-series").addEventListener("click", () => levels.dialog.close());
const empty = document.createElement("p"); empty.textContent = "Пока пусто. Загляни на рынок";
inventory.content.append(empty, document.querySelector("#consumables"), document.querySelector("#item-notice"));
const updateEmpty = () => { empty.hidden = !document.querySelector("#consumables").hidden; };
new MutationObserver(updateEmpty).observe(document.querySelector("#consumables"), { attributes: true, attributeFilter: ["hidden"], childList: true });
updateEmpty();
