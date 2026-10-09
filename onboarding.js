import "./onboarding.css";

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

const focus = dialog.querySelector(".onboarding-focus");
const focuses = [focus, focus.cloneNode()];
focus.after(focuses[1]);
const next = dialog.querySelector("#onboarding-next");
let index = 0;
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
  dialog.dataset.placement = index === steps.length - 1 && matchMedia("(max-width: 768px)").matches
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
  targets = [];
  if (previousScroll) scrollTo(previousScroll.x, previousScroll.y);
  if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  previousScroll = previousFocus = null;
});
window.addEventListener("resize", updateFocus);
window.addEventListener("scroll", updateFocus, { passive: true });

// A gift link gets priority over the welcome window.
const openingGift = new URL(location.href).searchParams.has("gift");
if (!openingGift) requestAnimationFrame(() => requestAnimationFrame(openTutorial));
