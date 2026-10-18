import { navArt } from "./campus-art.js";
import { currentLevel, generatedLevels } from "./levels.js";
import { parameters } from "./level-generator.js";
import { openCharacter } from "./market.js";
import { getAudioVolume, setAudioVolume } from "./audio-settings.js";
import { setMusicPaused } from "./music.js";
import { getTotalCoins } from "./coins.js";
import { subscribe as subscribeBalance } from "./currency.js";
import { subscribeStats } from "./play-stats.js";
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
  "market-open": navArt.market,
  "gift-open": navArt.gift,
};
function decorate(button, icon) {
  const label = document.createElement("span");
  label.textContent = button.textContent;
  button.replaceChildren(label);
  button.insertAdjacentHTML("afterbegin", `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter">${icon}</svg>`);
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
const levels = panel("sidebar-levels", "Уровни", navArt.levels);
const inventory = panel("sidebar-inventory", "Инвентарь", navArt.inventory);
nav.prepend(levels.button, inventory.button);
const levelOverview = document.createElement("section");
levelOverview.className = "level-overview";
levelOverview.setAttribute("aria-label", "Текущий уровень и прогресс курса");
levelOverview.innerHTML = '<p class="level-overview-kicker">ТЕКУЩИЙ МАРШРУТ</p><div class="level-overview-heading"></div><p class="level-overview-range"></p><div class="level-overview-progress" role="progressbar" aria-label="Прогресс внутри курса" aria-valuemin="1" aria-valuemax="5"></div><p class="level-overview-next"></p>';
const levelLabel = document.createElement("p");
levelLabel.className = "level-overview-level";
const levelCourse = document.createElement("span");
levelCourse.className = "level-overview-course";
levelOverview.querySelector(".level-overview-heading").append(levelLabel, levelCourse);
const levelProgress = levelOverview.querySelector(".level-overview-progress");
const segments = Array.from({ length: 5 }, () => levelProgress.appendChild(document.createElement("span")));
levels.content.append(levelOverview, document.querySelector("#new-series"));
const updateLevel = () => {
  if (!generatedLevels) {
    levelLabel.textContent = document.querySelector("#level-tag").textContent;
    levelCourse.hidden = true;
    levelOverview.querySelector(".level-overview-range").hidden = true;
    levelProgress.hidden = true;
    levelOverview.querySelector(".level-overview-next").hidden = true;
    return;
  }
  const level = currentLevel();
  const course = parameters(level).course;
  const first = (course - 1) * 5 + 1;
  const step = level - first + 1;
  levelLabel.textContent = `Уровень ${level}`;
  levelCourse.textContent = `Курс ${course}`;
  levelOverview.querySelector(".level-overview-range").textContent = `Уровни курса: ${first}–${first + 4}`;
  levelProgress.setAttribute("aria-valuenow", String(step));
  levelProgress.setAttribute("aria-valuetext", `Уровень ${step} из 5 текущего курса`);
  segments.forEach((segment, index) => {
    segment.textContent = first + index;
    segment.className = index < step - 1 ? "is-past" : index === step - 1 ? "is-current" : "";
  });
  levelOverview.querySelector(".level-overview-next").textContent = step === 5
    ? `Следующий уровень начнёт курс ${course + 1}.`
    : `До курса ${course + 1}: ${6 - step} ур.`;
};
new MutationObserver(updateLevel).observe(document.querySelector("#level-tag"), { childList: true, subtree: true, characterData: true });
updateLevel();
document.querySelector("#new-series").addEventListener("click", () => levels.dialog.close());
const empty = document.createElement("p");
empty.className = "inventory-empty";
empty.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter">${navArt.inventory}</svg><span>Полезных предметов пока нет. Загляни на рынок</span>`;
const consumablesSection = document.createElement("section");
consumablesSection.className = "inventory-section";
consumablesSection.innerHTML = '<h3>Предметы</h3>';
const consumables = document.querySelector("#consumables");
consumablesSection.append(consumables);
inventory.content.append(empty, consumablesSection, document.querySelector("#item-notice"));
const updateEmpty = () => {
  const hasItems = !consumables.hidden;
  empty.hidden = hasItems;
  consumablesSection.hidden = !hasItems;
};
new MutationObserver(updateEmpty).observe(consumables, { attributes: true, attributeFilter: ["hidden"], childList: true });
updateEmpty();

const wallet = document.querySelector(".wallet-tools");
document.querySelector("#sidebar-wallet").append(wallet);
const character = document.createElement("button");
character.type = "button"; character.id = "sidebar-character-open"; character.textContent = "Персонаж";
decorate(character, navArt.character);
nav.append(character);
character.addEventListener("click", () => {
  openCharacter(character);
});
const settings = panel("sidebar-settings", "Настройки", navArt.settings);
nav.append(settings.button);
settings.content.innerHTML = '<div class="setting-volume"><label for="settings-music">Музыка</label><output for="settings-music"></output><input id="settings-music" type="range" min="0" max="100" step="1"></div><div class="setting-volume"><label for="settings-effects">Звуковые эффекты</label><output for="settings-effects"></output><input id="settings-effects" type="range" min="0" max="100" step="1"></div><div class="settings-actions"><button id="settings-restart" type="button">Начать заново</button><button id="settings-pause" type="button">Остановить игру</button></div>';
const progressPanel = document.createElement("section");
progressPanel.id = "player-progress";
progressPanel.setAttribute("aria-labelledby", "player-progress-title");
progressPanel.innerHTML = '<h2 id="player-progress-title">Твой прогресс</h2><div class="progress-current"><span class="progress-current-label">ТЕКУЩИЙ МАРШРУТ</span><strong id="progress-current-level">Уровень 1</strong><span id="progress-current-course">Курс 1</span></div><dl><div><dt>Пройдено уровней</dt><dd id="progress-levels">0</dd></div><div><dt>Всего монет</dt><dd id="progress-coins">0</dd></div><div><dt>Использовано предметов</dt><dd id="progress-items">0</dd></div><div><dt>Лучший результат</dt><dd id="progress-best">—</dd></div></dl><div class="progress-route" role="progressbar" aria-label="Прогресс текущего курса" aria-valuemin="0" aria-valuemax="5"><span class="progress-route-label">УРОВНИ КУРСА</span><div class="progress-route-steps"><span></span><span></span><span></span><span></span><span></span></div></div><p class="progress-note">Предметы и лучший результат считаются с этого обновления.</p>';
settings.content.append(progressPanel);
const progressValues = {
  levels: progressPanel.querySelector("#progress-levels"),
  coins: progressPanel.querySelector("#progress-coins"),
  items: progressPanel.querySelector("#progress-items"),
  best: progressPanel.querySelector("#progress-best"),
};
const progressCurrentLevel = progressPanel.querySelector("#progress-current-level");
const progressCurrentCourse = progressPanel.querySelector("#progress-current-course");
const progressRoute = progressPanel.querySelector(".progress-route");
const progressSteps = [...progressRoute.querySelectorAll(".progress-route-steps span")];
const updateProgress = ({ itemsUsed, bestMoves } = {}) => {
  const level = currentLevel();
  const won = document.querySelector("#round-message").dataset.phase === "won";
  progressValues.levels.textContent = Math.max(0, level - 1 + Number(won));
  progressCurrentLevel.textContent = `Уровень ${level}`;
  progressCurrentCourse.textContent = generatedLevels ? `Курс ${parameters(level).course}` : "";
  progressRoute.hidden = !generatedLevels;
  if (generatedLevels) {
    const step = (level - 1) % 5;
    progressRoute.setAttribute("aria-valuenow", String(step + Number(won)));
    progressRoute.setAttribute("aria-valuetext", `${step + Number(won)} из 5 уровней курса пройдено`);
    progressSteps.forEach((segment, index) => {
      segment.className = index < step + Number(won) ? "is-complete" : index === step ? "is-current" : "";
    });
  }
  progressValues.coins.textContent = getTotalCoins();
  if (itemsUsed !== undefined) progressValues.items.textContent = itemsUsed;
  if (bestMoves !== undefined) progressValues.best.textContent = bestMoves === null ? "—" : `${bestMoves} ходов`;
};
subscribeStats(updateProgress);
subscribeBalance(() => updateProgress());
new MutationObserver(() => updateProgress()).observe(document.querySelector("#level-tag"), { childList: true, subtree: true, characterData: true });
new MutationObserver(() => updateProgress()).observe(document.querySelector("#round-message"), { attributes: true, attributeFilter: ["data-phase"] });
for (const [id, kind] of [["settings-music", "music"], ["settings-effects", "effects"]]) {
  const input = settings.content.querySelector(`#${id}`);
  const output = settings.content.querySelector(`output[for="${id}"]`);
  input.value = Math.round(getAudioVolume(kind) * 100);
  output.value = `${input.value}%`;
  input.addEventListener("input", () => {
    output.value = `${input.value}%`;
    setAudioVolume(kind, Number(input.value) / 100);
  });
}
settings.content.querySelector("#settings-restart").addEventListener("click", () => {
  settings.dialog.close();
  document.querySelector("#restart").click();
});
const pauseDialog = document.createElement("dialog");
pauseDialog.id = "pause-dialog";
pauseDialog.className = "sidebar-panel";
pauseDialog.setAttribute("aria-labelledby", "pause-title");
pauseDialog.innerHTML = '<h2 id="pause-title">Игра остановлена</h2><p>Текущий уровень сохранён. Продолжите, когда будете готовы.</p><button id="pause-resume" type="button" autofocus>Продолжить игру</button>';
document.body.append(pauseDialog);
settings.content.querySelector("#settings-pause").addEventListener("click", () => {
  settings.dialog.close();
  setMusicPaused(true);
  pauseDialog.showModal();
});
pauseDialog.querySelector("#pause-resume").addEventListener("click", () => pauseDialog.close());
pauseDialog.addEventListener("close", () => setMusicPaused(false));
const memo = panel("sidebar-memo", "Запись в Solana (тест)", navArt.memo);
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
  ["KeyV", settings.button],
]);
document.addEventListener("keydown", event => {
  if (!desktop.matches || event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
  if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable], [contenteditable='true']")) return;
  if (event.code === "KeyV" && settings.dialog.open) {
    event.preventDefault();
    settings.dialog.close();
    return;
  }
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
  settings.content.append(progressPanel);
  for (const badge of desktopBadges) badge.remove();
  desktopBadges.length = 0;
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
  desktopRow = document.createElement("div");
  desktopRow.id = "desktop-game-row";
  document.querySelector("#map").before(desktopRow);
  moveForDesktop(nav, desktopRow);
  moveForDesktop(document.querySelector("#map"), desktopRow);
  const rightRail = document.createElement("aside");
  rightRail.id = "desktop-side-panel";
  rightRail.setAttribute("aria-label", "Монеты, ходы, прогресс, помощь и настройки");
  desktopRow.append(rightRail);
  moveForDesktop(coins, rightRail);
  moveForDesktop(document.querySelector("#moves-counter"), rightRail);
  rightRail.append(progressPanel);
  moveForDesktop(document.querySelector("#gift-open"), rightRail);
  moveForDesktop(settings.button, rightRail);
  const footer = document.createElement("div");
  footer.id = "desktop-map-footer";
  desktopRow.append(footer);
  for (const node of [document.querySelector(".legend"), document.querySelector("#round-message"), document.querySelector("#position"), tools.querySelector("small")]) moveForDesktop(node, footer);
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
}
mobile.addEventListener("change", arrange);
desktop.addEventListener("change", arrange);
arrange();
