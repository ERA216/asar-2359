import "./onboarding.css";

// This module only reads the existing game UI. A modal dialog makes the map
// inert through the same dialog guard that protects the other game windows.
const steps = [
  {
    title: "Твой проект ждёт",
    text: "Собери текст, код и слайды, затем донеси все три части до принтера. Успей, пока не закончились ходы.",
    target: null,
  },
  {
    title: "Как ходить",
    text: () => matchMedia("(max-width: 768px)").matches
      ? "Нажимай стрелки под картой. Каждый успешный шаг тратит один ход."
      : "Ходи стрелками или WASD. Каждый успешный шаг тратит один ход.",
    target: () => document.querySelector(matchMedia("(max-width: 768px)").matches ? ".controls" : "#map"),
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

const focus = dialog.querySelector(".onboarding-focus");
const next = dialog.querySelector("#onboarding-next");
let index = 0;
let previousFocus = null;
let previousScroll = null;
let target = null;

function updateFocus() {
  if (!dialog.open || !target) return;
  const rect = target.getBoundingClientRect();
  focus.style.left = `${Math.max(4, rect.left - 4)}px`;
  focus.style.top = `${Math.max(4, rect.top - 4)}px`;
  focus.style.width = `${Math.max(0, rect.width + 8)}px`;
  focus.style.height = `${Math.max(0, rect.height + 8)}px`;
  dialog.dataset.placement = rect.top < innerHeight / 2 ? "bottom" : "top";
}

function showStep() {
  const step = steps[index];
  target = step.target?.() || null;
  dialog.querySelector("#onboarding-step").textContent = `${index + 1} / ${steps.length}`;
  dialog.querySelector("#onboarding-title").textContent = step.title;
  dialog.querySelector("#onboarding-copy").textContent = typeof step.text === "function" ? step.text() : step.text;
  next.textContent = index === steps.length - 1 ? "Понятно, начать" : "Далее";
  focus.hidden = !target;
  dialog.dataset.placement = "top";
  if (target) {
    target.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    requestAnimationFrame(updateFocus);
  }
  next.focus({ preventScroll: true });
}

function openTutorial() {
  if (dialog.open || document.querySelector("dialog[open]")) return;
  previousFocus = document.activeElement;
  previousScroll = { x: scrollX, y: scrollY };
  index = 0;
  dialog.showModal();
  showStep();
}

next.addEventListener("click", () => {
  if (index === steps.length - 1) dialog.close();
  else { index++; showStep(); }
});
dialog.querySelector("#onboarding-skip").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  target = null;
  if (previousScroll) scrollTo(previousScroll.x, previousScroll.y);
  if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  previousScroll = previousFocus = null;
});
window.addEventListener("resize", updateFocus);
window.addEventListener("scroll", updateFocus, { passive: true });

// A gift link gets priority over the welcome window.
const openingGift = new URL(location.href).searchParams.has("gift");
if (!openingGift) requestAnimationFrame(() => requestAnimationFrame(openTutorial));
