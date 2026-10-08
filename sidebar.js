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
  "market-open": '<path d="M5 3h14v3h2v4H3V6h2zM5 10v11h14V10M9 21v-7h6v7M7 6v4m5-4v4m5-4v4"/>',
  "gift-open": '<path d="M3 6h18v14H3zM3 7h3v3h3v3h6v-3h3V7h3"/>',
};
function decorate(button, icon) {
  const label = document.createElement("span");
  label.textContent = button.textContent;
  button.replaceChildren(label);
  button.insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">${icon}</svg>`);
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
const inventory = panel("sidebar-inventory", "Инвентарь", '<path d="M4 5h16v16H4zM8 5V2h8v3M4 11h16M9 11v4h6v-4"/>');
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

const wallet = document.querySelector(".wallet-tools");
document.querySelector("#sidebar-wallet").append(wallet);
const character = document.createElement("button");
character.type = "button"; character.id = "sidebar-character-open"; character.textContent = "Персонаж";
decorate(character, '<path d="M9 2h6v2h2v5h-2v2H9V9H7V4h2zM8 13h8v2h4v7M4 22v-7h4m0 2v5m8-5v5M10 14v2h4v-2"/>');
nav.append(character);
character.addEventListener("click", () => {
  document.querySelector("#market-open").click();
  document.querySelector('[data-market-tab="skin"]').click();
});
const memo = panel("sidebar-memo", "Запись в Solana (тест)", '<path d="M5 2h10l4 4v16H5zM15 2v5h4M8 12h8m-8 4h6"/>');
memo.button.classList.remove("sidebar-action");
memo.button.classList.add("sidebar-test-link");
sidebar.append(memo.button);
memo.content.append(document.querySelector(".memo-section"));
memo.button.addEventListener("click", () => { document.querySelector(".memo-panel").open = true; });

function syncSections() {
  const market = document.querySelector("#market-dialog");
  const skins = document.querySelector('[data-market-tab="skin"]').getAttribute("aria-pressed") === "true";
  document.querySelector("#market-open").setAttribute("aria-expanded", String(market.open && !skins));
  character.setAttribute("aria-expanded", String(market.open && skins));
  document.querySelector("#gift-open").setAttribute("aria-expanded", String(!!document.querySelector("#gift-dialog")?.open));
}
// Gift UI loads independently; observe dialog state without coupling to its logic.
new MutationObserver(syncSections).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "aria-pressed"] });
syncSections();

const mobile = matchMedia("(max-width: 768px)");
const desktop = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
const desktopShortcuts = new Map([
  ["KeyL", levels.button],
  ["KeyI", inventory.button],
  ["KeyM", document.querySelector("#market-open")],
  ["KeyH", document.querySelector("#gift-open")],
  ["KeyC", character],
]);
document.addEventListener("keydown", event => {
  if (!desktop.matches || event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], [contenteditable='true']")) return;
  if (document.querySelector("dialog[open]")) return;
  const button = desktopShortcuts.get(event.code);
  if (!button) return;
  event.preventDefault();
  button.click();
});
document.querySelector("#market-open").addEventListener("click", () => {
  if (desktop.matches) document.querySelector('[data-market-tab="item"]').click();
});
const coins = document.querySelector("#sidebar-coins");
const desktopMoves = [];
let desktopRow = null;
let desktopConnectTitle;
let quickItemsObserver = null;
let roundMessageObserver = null;
let desktopHint = null;
let desktopHintText = "";
const desktopBadges = [];
function moveForDesktop(node, destination) {
  const marker = document.createComment("desktop position");
  node.before(marker);
  desktopMoves.push([node, marker]);
  destination.append(node);
}
function restoreDesktop() {
  for (const badge of desktopBadges) badge.remove();
  desktopBadges.length = 0;
  quickItemsObserver?.disconnect();
  quickItemsObserver = null;
  roundMessageObserver?.disconnect();
  roundMessageObserver = null;
  document.querySelector("#round-message").classList.remove("desktop-redundant");
  if (desktopHint) desktopHint.textContent = desktopHintText;
  desktopHint = null;
  if (desktopConnectTitle !== undefined) {
    const connect = document.querySelector("#connect");
    if (desktopConnectTitle === null) connect.removeAttribute("title");
    else connect.setAttribute("title", desktopConnectTitle);
    desktopConnectTitle = undefined;
  }
  for (const [node, marker] of desktopMoves) marker.replaceWith(node);
  desktopMoves.length = 0;
  desktopRow?.remove();
  desktopRow = null;
}
function arrange() {
  if (desktopRow) restoreDesktop();
  const main = document.querySelector("main");
  if (mobile.matches) {
    main.querySelector("header").append(wallet);
    main.querySelector("header").after(coins);
    main.append(tools, memo.button);
  } else {
    document.querySelector("#sidebar-wallet").append(wallet);
    nav.before(coins);
    sidebar.append(tools, memo.button);
  }
  if (!desktop.matches) return;
  for (const [code, button] of desktopShortcuts) {
    const badge = document.createElement("span");
    badge.className = "desktop-key";
    badge.textContent = code.slice(-1);
    badge.setAttribute("aria-hidden", "true");
    button.append(badge);
    desktopBadges.push(badge);
  }
  const connect = document.querySelector("#connect");
  desktopConnectTitle = connect.getAttribute("title");
  connect.title = "Для игры кошелёк не нужен";
  moveForDesktop(wallet, main);
  main.querySelector("header").before(wallet);
  moveForDesktop(coins, document.querySelector(".round-info"));

  desktopRow = document.createElement("div");
  desktopRow.id = "desktop-game-row";
  document.querySelector("#map").before(desktopRow);
  moveForDesktop(nav, desktopRow);
  moveForDesktop(document.querySelector("#map"), desktopRow);
  const footer = document.createElement("div");
  footer.id = "desktop-map-footer";
  desktopRow.append(footer);
  for (const node of [document.querySelector(".legend"), document.querySelector("#round-message"), document.querySelector("#position"), tools.querySelector("small"), memo.button]) moveForDesktop(node, footer);
  const meta = document.createElement("div");
  meta.id = "desktop-map-meta";
  footer.prepend(meta);
  meta.append(footer.querySelector(".legend"), footer.querySelector("#position"), footer.querySelector("small"));
  const restart = document.querySelector("#restart");
  moveForDesktop(restart, meta);
  meta.querySelector(".legend").after(restart);
  desktopHint = meta.querySelector("small");
  desktopHintText = desktopHint.textContent;
  desktopHint.textContent = "Компьютер: стрелки или WASD.";
  const roundMessage = document.querySelector("#round-message");
  const syncRoundMessage = () => roundMessage.classList.toggle("desktop-redundant", roundMessage.textContent.startsWith("Соберите части 1, 2 и 3, затем идите к принтеру."));
  roundMessageObserver = new MutationObserver(syncRoundMessage);
  roundMessageObserver.observe(roundMessage, { childList: true, characterData: true, subtree: true });
  syncRoundMessage();

  const quickItems = document.createElement("section");
  quickItems.id = "desktop-quick-items";
  quickItems.setAttribute("aria-label", "Быстрые предметы");
  quickItems.innerHTML = '<h2>Под рукой</h2><div id="desktop-quick-list"></div><p id="desktop-quick-notice" role="status"></p>';
  footer.prepend(quickItems);
  const consumables = document.querySelector("#consumables");
  const itemNotice = document.querySelector("#item-notice");
  const syncQuickItems = () => {
    const available = !consumables.hidden;
    const armed = !itemNotice.hidden;
    quickItems.hidden = !available && !armed;
    quickItems.querySelector("#desktop-quick-list").innerHTML = available ? consumables.innerHTML : "";
    const notice = quickItems.querySelector("#desktop-quick-notice");
    notice.hidden = !armed;
    notice.textContent = armed ? itemNotice.textContent : "";
  };
  quickItems.addEventListener("click", event => {
    const button = event.target.closest("[data-use]");
    if (!button || button.disabled) return;
    [...consumables.querySelectorAll("[data-use]")].find(original => original.dataset.use === button.dataset.use)?.click();
  });
  quickItemsObserver = new MutationObserver(syncQuickItems);
  quickItemsObserver.observe(consumables, { attributes: true, attributeFilter: ["hidden"], childList: true });
  quickItemsObserver.observe(itemNotice, { attributes: true, attributeFilter: ["hidden"], childList: true, characterData: true });
  syncQuickItems();
}
mobile.addEventListener("change", arrange);
desktop.addEventListener("change", arrange);
arrange();
