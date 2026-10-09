import "./onboarding.css";
import { guardArt } from "./campus-art.js";

const tutorialKey = "asar:onboarding:v1";
const guardKey = "asar:onboarding:guard:v1";
const saved = key => {
  try { return localStorage.getItem(key) === "done"; }
  catch { return false; }
};
const remember = key => {
  try { localStorage.setItem(key, "done"); }
  catch { /* The game stays playable when storage is unavailable. */ }
};

// This module only reads the existing game UI. A modal dialog makes the map
// inert through the same dialog guard that protects the other game windows.
const steps = [
  {
    title: "Твой проект ждёт",
    text: "Собери текст, код и слайды, затем донеси все три части до принтера. Успей, пока не закончились ходы.",
    targets: [],
  },
  {
    title: "Как ходить",
    text: () => matchMedia("(max-width: 768px)").matches
      ? "Нажимай стрелки под картой. Каждый успешный шаг тратит один ход."
      : "Ходи стрелками или WASD. Каждый успешный шаг тратит один ход.",
    targets: () => [document.querySelector(matchMedia("(max-width: 768px)").matches ? ".controls" : "#map")],
  },
  {
    title: "Следи за ходами",
    text: "Число показывает оставшиеся ходы. В трёх слотах видно, какие части проекта уже собраны.",
    targets: () => [document.querySelector("#moves-left")?.parentElement, document.querySelector(".inventory")],
  },
  {
    title: "Асар — помощь другу",
    text: "Через «Помощь» можно отправить другому игроку записку и предмет в Solana. По такой ссылке помощь можно получить и самому.",
    targets: () => [document.querySelector("#gift-open")],
  },
  {
    title: "Монеты пригодятся",
    text: "Собирай монеты на карте и трать их в «Рынке» на полезные предметы.",
    targets: () => [document.querySelector(".coin-counter"), document.querySelector("#market-open")],
  },
];

const dialog = document.createElement("dialog");
dialog.id = "onboarding-dialog";
dialog.setAttribute("aria-labelledby", "onboarding-title");
dialog.setAttribute("aria-describedby", "onboarding-copy");
dialog.innerHTML = `
  <div class="onboarding-focus" aria-hidden="true"></div>
  <div class="onboarding-card">
    <p class="onboarding-eyebrow">АСАР: 23:59 · КАК ИГРАТЬ</p>
    <div class="onboarding-art" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="#3C3429" stroke-width="1" shape-rendering="crispEdges"><path d="M9 45h46v8H9z" fill="#795539"/><path d="M16 17h20v29H16z" fill="#F5ECD5"/><path d="M20 24h12m-12 6h12m-12 6h8" stroke="#795539"/><path d="M35 11h17v29H35z" fill="#4E5E43"/><path d="M39 15h9v19h-9z" fill="#D8CBA5"/><path d="M42 22v7m-2-4h5" stroke="#3C3429"/><path d="M13 42h23v7H13z" fill="#A77A50"/></svg></div>
    <p class="onboarding-step" id="onboarding-step"></p>
    <h2 id="onboarding-title"></h2>
    <p id="onboarding-copy"></p>
    <div class="onboarding-actions">
      <button type="button" id="onboarding-skip">Пропустить обучение</button>
      <button type="button" id="onboarding-next">Далее</button>
    </div>
  </div>`;
document.body.append(dialog);

const replay = document.createElement("button");
replay.type = "button";
replay.id = "onboarding-replay";
replay.textContent = "?";
replay.title = "Как играть";
replay.setAttribute("aria-label", "Как играть");
document.querySelector("#sidebar-nav").append(replay);
const mobileReplay = matchMedia("(max-width: 768px)");
function placeReplay() {
  document.querySelector(mobileReplay.matches ? "main" : "#sidebar-nav").append(replay);
}
mobileReplay.addEventListener("change", placeReplay);
placeReplay();

const focus = dialog.querySelector(".onboarding-focus");
const focuses = [focus, focus.cloneNode()];
focus.after(focuses[1]);
const next = dialog.querySelector("#onboarding-next");
const skip = dialog.querySelector("#onboarding-skip");
const art = dialog.querySelector(".onboarding-art svg");
const welcomeArt = art.innerHTML;
let index = 0;
let mode = "tutorial";
let previousFocus = null;
let previousScroll = null;
let targets = [];

function updateFocus() {
  if (!dialog.open || !targets.length) return;
  targets.forEach((target, i) => {
    const rect = target.getBoundingClientRect();
    focuses[i].style.left = `${Math.max(4, rect.left - 4)}px`;
    focuses[i].style.top = `${Math.max(4, rect.top - 4)}px`;
    focuses[i].style.width = `${Math.max(0, rect.width + 8)}px`;
    focuses[i].style.height = `${Math.max(0, rect.height + 8)}px`;
  });
  dialog.dataset.placement = mode === "tutorial" && index === steps.length - 1 && matchMedia("(max-width: 768px)").matches
    ? "middle"
    : targets[0].getBoundingClientRect().top < innerHeight / 2 ? "bottom" : "top";
}

function showStep() {
  const step = steps[index];
  targets = (typeof step.targets === "function" ? step.targets() : step.targets).filter(Boolean);
  dialog.querySelector("#onboarding-step").textContent = `${index + 1} / ${steps.length}`;
  dialog.querySelector("#onboarding-title").textContent = step.title;
  dialog.querySelector("#onboarding-copy").textContent = typeof step.text === "function" ? step.text() : step.text;
  next.textContent = index === steps.length - 1 ? "Понятно, начать" : "Далее";
  focuses.forEach((node, i) => { node.hidden = i >= targets.length; });
  dialog.dataset.placement = "top";
  if (targets.length) {
    targets[0].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    requestAnimationFrame(updateFocus);
  }
  next.focus({ preventScroll: true });
}

function openTutorial() {
  if (dialog.open || document.querySelector("dialog[open]")) return;
  previousFocus = document.activeElement;
  previousScroll = { x: scrollX, y: scrollY };
  mode = "tutorial";
  art.innerHTML = welcomeArt;
  skip.hidden = false;
  index = 0;
  dialog.showModal();
  showStep();
}

function openGuardTip(cell) {
  if (dialog.open || document.querySelector("dialog[open]")) return;
  previousFocus = document.activeElement;
  previousScroll = { x: scrollX, y: scrollY };
  mode = "guard";
  index = 0;
  targets = [cell];
  art.innerHTML = guardArt;
  skip.hidden = true;
  dialog.querySelector("#onboarding-step").textContent = "НОВЫЙ ПАТРУЛЬ";
  dialog.querySelector("#onboarding-title").textContent = "На карте охранник";
  dialog.querySelector("#onboarding-copy").textContent = "Теперь на карте охранник. Избегай его клетки: столкновение завершит раунд.";
  next.textContent = "Понятно, играть";
  dialog.showModal();
  focuses.forEach((node, i) => { node.hidden = i > 0; });
  cell.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  requestAnimationFrame(updateFocus);
  next.focus({ preventScroll: true });
}

next.addEventListener("click", () => {
  if (mode === "guard" || index === steps.length - 1) dialog.close();
  else { index++; showStep(); }
});
skip.addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  remember(mode === "guard" ? guardKey : tutorialKey);
  targets = [];
  if (previousScroll) scrollTo(previousScroll.x, previousScroll.y);
  if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  previousScroll = previousFocus = null;
  requestAnimationFrame(checkGuard);
});
replay.addEventListener("click", openTutorial);
window.addEventListener("resize", updateFocus);
window.addEventListener("scroll", updateFocus, { passive: true });

// Let an incoming gift open first, then welcome a new player after its window closes.
const openingGift = /^[1-9A-HJ-NP-Za-km-z]{86,88}$/.test(new URL(location.href).searchParams.get("gift") || "");
let giftSettled = !openingGift;
if (!openingGift && !saved(tutorialKey)) requestAnimationFrame(() => requestAnimationFrame(openTutorial));

function checkGuard() {
  if (!giftSettled || !saved(tutorialKey) || saved(guardKey)) return;
  const cell = document.querySelector("#map .guard-art")?.closest(".cell");
  if (cell && !dialog.open && !document.querySelector("dialog[open]")) openGuardTip(cell);
}

const guardObserver = new MutationObserver(() => {
  if (saved(guardKey)) { guardObserver.disconnect(); return; }
  checkGuard();
});
guardObserver.observe(document.querySelector("#map"), { childList: true, subtree: true });
document.addEventListener("close", event => {
  if (event.target.id === "gift-dialog") {
    giftSettled = true;
    if (!saved(tutorialKey)) { requestAnimationFrame(openTutorial); return; }
  }
  requestAnimationFrame(checkGuard);
}, true);
requestAnimationFrame(checkGuard);
