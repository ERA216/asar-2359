import "./gift.css";
import { coinArt, itemArt, projectArt, studentArt } from "./campus-art.js";
import { coinPositions } from "./coins.js";
import { animateWalk } from "./walk-animation.js";
import { giftEnvelopeMarkup } from "./gift-envelope-view.js";

const sprite = (art, className) => `<svg class="${className}" viewBox="0 0 64 64" shape-rendering="crispEdges" aria-hidden="true">${art}</svg>`;
const surfaceProperties = ["background-color", "background-image", "background-size", "background-position", "box-shadow", "border-color", "outline-color"];
const captureSurface = element => {
  const style = getComputedStyle(element);
  return Object.fromEntries(surfaceProperties.map(property => [property, style.getPropertyValue(property)]));
};
const captureMap = element => element?.children.length ? {
  map: element.cloneNode(true),
  surfaces: [captureSurface(element), ...[...element.children].map(captureSurface)],
  coins: coinPositions.map(({ x, y }) => ({ x, y })),
} : null;
// Keep the level as it appeared when the page loaded, even when replaying the tutorial later.
let tutorialMap = captureMap(document.querySelector("#map"));

const demos = {
  parts: `
    <div class="demo-game-layout">
      <div class="demo-pickup-map" data-facing="down" aria-label="Демонстрация прохождения настоящей игровой карты"></div>
      <div class="demo-game-hud">
        <div class="demo-game-hud-label">ПРИМЕР УРОВНЯ</div>
        <div class="demo-pickup-status" aria-live="off">НАЙДИ ТРИ ЧАСТИ ПРОЕКТА</div>
        <div class="demo-game-moves">ХОДЫ <strong>20</strong></div>
        <div class="demo-slots">${["ТЕКСТ", "КОД", "СЛАЙДЫ"].map((name, index) => `<span class="demo-slot demo-slot--${index + 1}">${sprite(projectArt[index + 1], "demo-slot-art")}<span>${name}</span><small>НАЙТИ</small></span>`).join("")}</div>
        <div class="demo-game-goal">СОБЕРИ ЧАСТИ → ИДИ К ПРИНТЕРУ</div>
      </div>
    </div>
  `,
  move: `
    <div class="demo-game-layout demo-move-layout">
      <div class="demo-pickup-map demo-move-map" data-facing="down" aria-label="Демонстрация движения по настоящей игровой карте"></div>
      <div class="demo-game-hud demo-move-hud">
        <div class="demo-game-hud-label">ПРИМЕР ДВИЖЕНИЯ</div>
        <div class="demo-pickup-status demo-move-status" aria-live="off">ИДИ ПО СВОБОДНЫМ КЛЕТКАМ</div>
        <div class="demo-game-moves">ХОДЫ <strong>6</strong></div>
        <div class="demo-move-keys"><kbd data-direction="up">↑</kbd><kbd data-direction="left">←</kbd><kbd data-direction="down">↓</kbd><kbd data-direction="right">→</kbd></div>
        <div class="demo-game-goal">ОДИН ШАГ ПО КАРТЕ = ОДИН ХОД</div>
      </div>
    </div>`,
  coins: `
    <div class="demo-game-layout demo-coin-layout">
      <div class="demo-pickup-map demo-coin-map" data-facing="down" aria-label="Демонстрация сбора монеты на игровой карте"></div>
      <div class="demo-game-hud demo-coin-hud">
        <div class="demo-game-hud-label">ПРИМЕР УРОВНЯ</div>
        <div class="demo-pickup-status demo-coin-status" aria-live="off">ПОДКЛЮЧИ КОШЕЛЁК</div>
        <div class="demo-coin-wallet"><svg class="demo-coin-wallet-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7V5a2 2 0 0 1 2-2h12v4"/><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M13 10h8v7h-8a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2Z"/><circle cx="16" cy="13.5" r="1"/></svg><strong>Подключить кошелёк</strong></div>
        <div class="demo-coin-balance">${sprite(coinArt, "demo-coin-balance-art")}<span>МОНЕТЫ</span><strong>0</strong></div>
        <div class="demo-game-goal">МОНЕТА НА КАРТЕ → СЧЁТ → РЫНОК</div>
      </div>
    </div>`,
  help: `
    <div class="demo-game-layout demo-help-layout">
      <div class="demo-help-stage">
        <div class="demo-help-stage-label">КАК ДРУГ ОТКРЫВАЕТ ПОМОЩЬ</div>
        <div class="demo-gift-receive"><div class="demo-help-envelope-scale">${giftEnvelopeMarkup("demo-gift")}</div></div>
      </div>
      <div class="demo-game-hud demo-help-hud">
        <div class="demo-game-hud-label">ПОМОЩЬ ДРУГУ</div>
        <div class="demo-pickup-status demo-help-status">ВЫБЕРИ ПРЕДМЕТ</div>
        <div class="demo-help-item">${sprite(itemArt["extra-moves"], "demo-help-item-art")}<span><strong>+2 хода</strong><small>Ещё немного времени</small></span></div>
        <div class="demo-help-note"><small>ЗАПИСКА ДРУГУ</small><span>Ты справишься! До принтера осталось совсем немного.</span></div>
        <div class="demo-help-send">Подписать и создать ссылку</div>
        <div class="demo-help-link">↗ <span>Ссылка для друга</span></div>
        <div class="demo-help-timeline"><span>1 · ВЫБРАТЬ</span><span>2 · ОТПРАВИТЬ</span><span>3 · ОТКРЫТЬ</span></div>
      </div>
    </div>`,
};

export function renderOnboardingDemo(kind) {
  return demos[kind] || "";
}

// The tutorial uses a visual copy of the rendered game map. Demo movement
// never calls the level model or changes the player's state.
function createMapPreview(frame) {
  tutorialMap ||= captureMap(document.querySelector("#map"));
  if (!frame || !tutorialMap) return null;
  const map = tutorialMap.map.cloneNode(true);
  map.id = "onboarding-map-preview";
  map.classList.add("demo-live-map");
  map.removeAttribute("aria-label");
  map.setAttribute("aria-hidden", "true");
  map.querySelectorAll(".route-number, .guard-forecast, .guard-art, .player-speech").forEach(node => node.remove());
  // The game artwork is SVG. Copy the computed tile surfaces as well, so the
  // thumbnail keeps the exact level palette and texture without duplicating IDs.
  const applySurface = (surface, to) => {
    for (const [property, value] of Object.entries(surface)) to.style.setProperty(property, value);
  };
  applySurface(tutorialMap.surfaces[0], map);
  [...map.children].forEach((cell, index) => applySurface(tutorialMap.surfaces[index + 1], cell));
  frame.replaceChildren(map);
  const cells = [...map.children];
  const side = Math.sqrt(cells.length);
  if (!Number.isInteger(side) || side < 3) return null;
  map.style.setProperty("--map-columns", side);
  const start = cells.findIndex(cell => cell.classList.contains("player"));
  if (start < 0) return null;
  const passable = index => index >= 0 && index < cells.length && !cells[index].classList.contains("wall");
  const shortestPath = (from, to) => {
    if (to < 0 || from < 0) return [];
    const queue = [from];
    const previous = new Map([[from, -1]]);
    for (let head = 0; head < queue.length && !previous.has(to); head++) {
      const index = queue[head];
      const x = index % side;
      for (const next of [x > 0 ? index - 1 : -1, x < side - 1 ? index + 1 : -1, index - side, index + side]) {
        if (passable(next) && !previous.has(next)) { previous.set(next, index); queue.push(next); }
      }
    }
    if (!previous.has(to)) return [];
    const path = [];
    for (let index = to; index !== from; index = previous.get(index)) path.unshift(index);
    return path;
  };
  const model = map.querySelector('[data-model="student"]');
  model?.remove();
  const actor = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  actor.setAttribute("viewBox", "0 0 64 64");
  actor.setAttribute("class", "demo-pickup-student");
  actor.setAttribute("aria-hidden", "true");
  actor.innerHTML = `<g stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter"><g class="student-facing">${studentArt}</g></g>`;
  frame.append(actor);
  const placeActor = index => {
    const cell = cells[index];
    if (!cell) return;
    Object.assign(actor.style, { left: `${map.offsetLeft + cell.offsetLeft}px`, top: `${map.offsetTop + cell.offsetTop}px`, width: `${cell.clientWidth}px`, height: `${cell.clientHeight}px` });
  };
  placeActor(start);
  return { frame, map, cells, side, start, actor, placeActor, shortestPath };
}

export function playOnboardingMove(container) {
  const preview = createMapPreview(container.querySelector(".demo-move-map"));
  if (!preview) return () => {};
  const { frame, map, cells, side, start, actor, placeActor, shortestPath } = preview;
  const openFloor = cell => !cell.classList.contains("wall") && !cell.classList.contains("part") && !cell.classList.contains("landmark") && !cell.querySelector(".map-coin");
  const choices = cells.map((cell, index) => ({ index, path: shortestPath(start, index) }))
    .filter(({ index, path }) => index !== start && openFloor(cells[index]) && path.length >= 2 && path.length <= 5 && path.every(step => openFloor(cells[step])));
  choices.sort((a, b) => Math.abs(a.path.length - 4) - Math.abs(b.path.length - 4));
  const route = choices[0]?.path || cells.map((cell, index) => shortestPath(start, index))
    .filter(path => path.length && path.length <= 4)
    .sort((a, b) => b.length - a.length)[0] || [];
  const status = container.querySelector(".demo-move-status");
  const moves = container.querySelector(".demo-game-moves strong");
  const keys = [...container.querySelectorAll(".demo-move-keys kbd")];
  let stopped = false;
  let pending;
  const animations = new Set();
  const wait = ms => new Promise(resolve => {
    const id = setTimeout(() => { if (pending?.id === id) pending = null; resolve(); }, ms);
    pending = { id, resolve };
  });

  async function loop() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      placeActor(route.at(-1) ?? start);
      moves.textContent = "2";
      status.textContent = "ОДИН ШАГ = ОДИН ХОД";
      return;
    }
    while (!stopped) {
      let position = start;
      placeActor(start);
      frame.dataset.facing = "down";
      keys.forEach(key => key.classList.remove("is-active"));
      moves.textContent = String(route.length + 2);
      status.textContent = "ИДИ ПО СВОБОДНЫМ КЛЕТКАМ";
      await wait(550);
      for (const [step, index] of route.entries()) {
        if (stopped) return;
        const from = cells[position];
        const target = cells[index];
        const direction = index % side > position % side ? "right" : index % side < position % side ? "left" : index < position ? "up" : "down";
        frame.dataset.facing = direction;
        keys.forEach(key => key.classList.toggle("is-active", key.dataset.direction === direction));
        const left = map.offsetLeft + target.offsetLeft;
        const top = map.offsetTop + target.offsetTop;
        const walk = actor.animate([
          { left: `${map.offsetLeft + from.offsetLeft}px`, top: `${map.offsetTop + from.offsetTop}px` },
          { left: `${left}px`, top: `${top}px` },
        ], { duration: 320, easing: "steps(6, end)" });
        animations.add(walk);
        animateWalk(actor.querySelector(".student-body"), 320, -3);
        await wait(325);
        actor.style.left = `${left}px`;
        actor.style.top = `${top}px`;
        walk.cancel();
        animations.delete(walk);
        position = index;
        moves.textContent = String(Number(moves.textContent) - 1);
        status.textContent = `ШАГ ${step + 1} ИЗ ${route.length}`;
        await wait(170);
      }
      if (stopped) return;
      keys.forEach(key => key.classList.remove("is-active"));
      status.textContent = "ОДИН ШАГ = ОДИН ХОД";
      await wait(1500);
      if (stopped) return;
      const reset = frame.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: "steps(3, end)", fill: "forwards" });
      animations.add(reset);
      await wait(180);
      reset.cancel();
      animations.delete(reset);
    }
  }
  void loop();
  return () => {
    stopped = true;
    if (pending) { clearTimeout(pending.id); pending.resolve(); }
    animations.forEach(animation => animation.cancel());
  };
}

export function playOnboardingPickup(container) {
  const preview = createMapPreview(container.querySelector(".demo-pickup-map"));
  if (!preview) return () => {};
  const { frame, map, cells, side, start, actor, placeActor, shortestPath } = preview;
  const printer = cells.findIndex(cell => cell.title.includes("Принтер"));
  const printerSignal = printer >= 0 ? cells[printer].querySelector("svg[data-printer-state]") : null;
  const items = Object.fromEntries([1, 2, 3].map(id => [id, cells.findIndex(cell => cell.classList.contains("part") && cell.querySelector(".project-item > text")?.textContent.trim() === String(id))]));
  const available = [1, 2, 3].filter(id => items[id] >= 0);
  // Visit the nearest visible part next, like a player choosing a short route.
  let current = start;
  const route = [];
  const remaining = new Set(available);
  while (remaining.size) {
    const choices = [...remaining].map(id => ({ id, path: shortestPath(current, items[id]) })).filter(choice => choice.path.length);
    if (!choices.length) break;
    choices.sort((a, b) => a.path.length - b.path.length);
    const choice = choices[0];
    route.push(...choice.path.map(index => ({ index, part: index === items[choice.id] ? choice.id : null })));
    current = items[choice.id];
    remaining.delete(choice.id);
  }
  const end = shortestPath(current, printer);
  route.push(...end.map(index => ({ index, finish: index === printer })));
  const slots = [...container.querySelectorAll(".demo-slot")];
  const names = { 1: "ТЕКСТ", 2: "КОД", 3: "СЛАЙДЫ" };
  const status = container.querySelector(".demo-pickup-status");
  const moves = container.querySelector(".demo-game-moves strong");
  let stopped = false;
  let pending;
  const animations = new Set();
  const wait = ms => new Promise(resolve => {
    const id = setTimeout(() => { if (pending?.id === id) pending = null; resolve(); }, ms);
    pending = { id, resolve };
  });

  async function loop() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      placeActor(printer >= 0 ? printer : start);
      available.forEach(id => { cells[items[id]].querySelector(".project-item").style.display = "none"; slots[id - 1].classList.add("is-collected"); slots[id - 1].querySelector("small").textContent = "СОБРАНО"; });
      printerSignal?.setAttribute("data-printer-state", "ready");
      status.textContent = "ЧАСТИ СОБРАНЫ · ПРИНТЕР ВПЕРЕДИ";
      moves.textContent = String(Math.max(0, route.length - available.length));
      return;
    }
    while (!stopped) {
      let position = start;
      placeActor(start);
      frame.dataset.facing = "down";
      frame.classList.remove("demo-map--complete");
      printerSignal?.setAttribute("data-printer-state", "locked");
      available.forEach(id => { cells[items[id]].classList.add("part"); cells[items[id]].querySelector(".project-item").style.display = ""; });
      slots.forEach(slot => { slot.classList.remove("is-collected"); slot.querySelector("small").textContent = "НАЙТИ"; });
      moves.textContent = String(route.length + 3);
      status.textContent = "НАЙДИ ТРИ ЧАСТИ ПРОЕКТА";
      await wait(550);
      for (const point of route) {
        if (stopped) return;
        const target = cells[point.index];
        const from = cells[position];
        frame.dataset.facing = point.index % side > position % side ? "right" : point.index % side < position % side ? "left" : point.index < position ? "up" : "down";
        const left = map.offsetLeft + target.offsetLeft;
        const top = map.offsetTop + target.offsetTop;
        const walk = actor.animate([
          { left: `${map.offsetLeft + from.offsetLeft}px`, top: `${map.offsetTop + from.offsetTop}px` },
          { left: `${left}px`, top: `${top}px` },
        ], { duration: 230, easing: "steps(5, end)" });
        animations.add(walk);
        animateWalk(actor.querySelector(".student-body"), 230, -3);
        await wait(235);
        actor.style.left = `${left}px`;
        actor.style.top = `${top}px`;
        walk.cancel();
        animations.delete(walk);
        position = point.index;
        moves.textContent = String(Number(moves.textContent) - 1);
        if (stopped) return;
        if (point.finish) {
          frame.classList.add("demo-map--complete");
          status.textContent = "ПРОЕКТ СДАН!";
          await wait(1600);
          break;
        }
        if (!point.part) { await wait(45); continue; }
        const id = point.part;
        const item = cells[items[id]].querySelector(".project-item");
        await wait(150);
        const source = item.ownerSVGElement.getBoundingClientRect();
        const destination = slots[id - 1].getBoundingClientRect();
        const parent = container.getBoundingClientRect();
        const flight = item.ownerSVGElement.cloneNode(true);
        flight.classList.add("demo-pickup-flight");
        flight.insertAdjacentHTML("beforeend", '<g fill="#D9AA43" stroke="#F5ECD5" stroke-width="2"><path d="M6 8h6v6H6zM48 8h6v6h-6zM8 48h6v6H8zM50 46h6v6h-6z"/></g>');
        Object.assign(flight.style, { left: `${source.left - parent.left}px`, top: `${source.top - parent.top}px`, width: `${source.width}px`, height: `${source.height}px` });
        container.append(flight);
        item.style.display = "none";
        cells[items[id]].classList.remove("part");
        const pickup = flight.animate([
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: "translate(0, -16px) scale(1.1)", opacity: 1, offset: .22 },
          { transform: `translate(${destination.left + destination.width / 2 - source.left - source.width / 2}px, ${destination.top + destination.height / 2 - source.top - source.height / 2}px) scale(.15)`, opacity: 0 },
        ], { duration: 560, easing: "steps(7, end)", fill: "forwards" });
        animations.add(pickup);
        await wait(560);
        pickup.cancel();
        animations.delete(pickup);
        flight.remove();
        slots[id - 1].classList.add("is-collected");
        slots[id - 1].querySelector("small").textContent = "СОБРАНО";
        if (slots.every(slot => slot.classList.contains("is-collected"))) printerSignal?.setAttribute("data-printer-state", "ready");
        status.textContent = `${names[id]} СОБРАН${id === 3 ? "Ы" : ""} · ${slots.filter(slot => slot.classList.contains("is-collected")).length} / 3`;
        await wait(650);
      }
      const reset = frame.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: "steps(3, end)", fill: "forwards" });
      animations.add(reset);
      await wait(180);
      placeActor(start);
      reset.cancel();
      animations.delete(reset);
    }
  }
  void loop();
  return () => {
    stopped = true;
    if (pending) { clearTimeout(pending.id); pending.resolve(); }
    animations.forEach(animation => animation.cancel());
    container.querySelectorAll(".demo-pickup-flight").forEach(flight => flight.remove());
  };
}

export function playOnboardingCoin(container) {
  const preview = createMapPreview(container.querySelector(".demo-coin-map"));
  if (!preview) return () => {};
  const { frame, map, cells, side, start, actor, placeActor, shortestPath } = preview;
  const coinCandidates = tutorialMap.coins
    .map(({ x, y }) => y * side + x)
    .filter(index => cells[index] && !cells[index].classList.contains("wall") && !cells[index].classList.contains("part") && index !== start);
  const floorCandidates = cells.map((cell, index) => index).filter(index =>
    index !== start && !cells[index].classList.contains("wall") && !cells[index].classList.contains("part") && !cells[index].classList.contains("landmark"));
  const choices = (coinCandidates.length ? coinCandidates : floorCandidates)
    .map(index => ({ index, path: shortestPath(start, index) })).filter(choice => choice.path.length);
  choices.sort((a, b) => a.path.length - b.path.length);
  const choice = choices[0];
  if (!choice) return () => {};

  // The real game only renders coins after wallet connection. This visual
  // example adds one to the copied map without connecting a real wallet.
  map.querySelectorAll(".map-coin").forEach(node => node.remove());
  const coin = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  coin.setAttribute("viewBox", "0 0 64 64");
  coin.setAttribute("class", "map-coin demo-map-coin");
  coin.setAttribute("aria-hidden", "true");
  coin.innerHTML = coinArt;
  coin.style.display = "none";
  cells[choice.index].append(coin);

  const status = container.querySelector(".demo-coin-status");
  const wallet = container.querySelector(".demo-coin-wallet");
  const walletState = wallet.querySelector("strong");
  const balance = container.querySelector(".demo-coin-balance");
  const amount = balance.querySelector("strong");
  let stopped = false;
  let pending;
  const animations = new Set();
  const wait = ms => new Promise(resolve => {
    const id = setTimeout(() => { if (pending?.id === id) pending = null; resolve(); }, ms);
    pending = { id, resolve };
  });

  async function loop() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wallet.classList.add("is-connected");
      walletState.textContent = "Подключён · пример";
      amount.textContent = "1";
      status.textContent = "МОНЕТА СОБРАНА · РЫНОК ОТКРЫТ";
      placeActor(choice.index);
      return;
    }
    while (!stopped) {
      let position = start;
      placeActor(start);
      frame.dataset.facing = "down";
      wallet.classList.remove("is-connected");
      walletState.textContent = "Подключить кошелёк";
      balance.classList.remove("is-earned");
      amount.textContent = "0";
      coin.style.display = "none";
      status.textContent = "ПОДКЛЮЧИ КОШЕЛЁК";
      await wait(1000);
      if (stopped) return;
      wallet.classList.add("is-connected");
      walletState.textContent = "Подключён · пример";
      coin.style.display = "";
      status.textContent = "МОНЕТА ПОЯВИЛАСЬ НА КАРТЕ";
      await wait(600);
      for (const index of choice.path) {
        if (stopped) return;
        const from = cells[position];
        const target = cells[index];
        frame.dataset.facing = index % side > position % side ? "right" : index % side < position % side ? "left" : index < position ? "up" : "down";
        const left = map.offsetLeft + target.offsetLeft;
        const top = map.offsetTop + target.offsetTop;
        const walk = actor.animate([
          { left: `${map.offsetLeft + from.offsetLeft}px`, top: `${map.offsetTop + from.offsetTop}px` },
          { left: `${left}px`, top: `${top}px` },
        ], { duration: 260, easing: "steps(5, end)" });
        animations.add(walk);
        animateWalk(actor.querySelector(".student-body"), 260, -3);
        await wait(265);
        actor.style.left = `${left}px`;
        actor.style.top = `${top}px`;
        walk.cancel();
        animations.delete(walk);
        position = index;
        await wait(60);
      }
      if (stopped) return;
      await wait(160);
      const source = coin.getBoundingClientRect();
      const destination = balance.getBoundingClientRect();
      const parent = container.getBoundingClientRect();
      const flight = coin.cloneNode(true);
      flight.classList.add("demo-pickup-flight", "demo-coin-flight");
      Object.assign(flight.style, { left: `${source.left - parent.left}px`, top: `${source.top - parent.top}px`, width: `${source.width}px`, height: `${source.height}px` });
      container.append(flight);
      coin.style.display = "none";
      const pickup = flight.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: "translate(0, -14px) scale(1.12)", opacity: 1, offset: .24 },
        { transform: `translate(${destination.left + destination.width / 2 - source.left - source.width / 2}px, ${destination.top + destination.height / 2 - source.top - source.height / 2}px) scale(.2)`, opacity: 0 },
      ], { duration: 480, easing: "steps(7, end)", fill: "forwards" });
      animations.add(pickup);
      await wait(485);
      pickup.cancel();
      animations.delete(pickup);
      flight.remove();
      if (stopped) return;
      amount.textContent = "1";
      balance.classList.add("is-earned");
      status.textContent = "+1 МОНЕТА · ЗАГЛЯНИ В РЫНОК";
      await wait(1750);
      if (stopped) return;
      const reset = frame.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: "steps(3, end)", fill: "forwards" });
      animations.add(reset);
      await wait(180);
      reset.cancel();
      animations.delete(reset);
    }
  }
  void loop();
  return () => {
    stopped = true;
    if (pending) { clearTimeout(pending.id); pending.resolve(); }
    animations.forEach(animation => animation.cancel());
    container.querySelectorAll(".demo-coin-flight").forEach(flight => flight.remove());
  };
}

export function playOnboardingHelp(container) {
  const receive = container.querySelector(".demo-gift-receive");
  const status = container.querySelector(".demo-help-status");
  if (!receive || !status) return () => {};
  receive.querySelector("#demo-gift-letter").textContent = "Ты справишься! До принтера осталось совсем немного.";
  receive.querySelector("#demo-gift-author").textContent = "От друга";
  let stopped = false;
  let pending;
  const wait = ms => new Promise(resolve => {
    const id = setTimeout(() => { if (pending?.id === id) pending = null; resolve(); }, ms);
    pending = { id, resolve };
  });
  const stage = (number, label) => {
    container.dataset.helpStage = String(number);
    status.textContent = label;
  };
  async function loop() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      receive.classList.add("is-open", "is-revealed");
      stage(3, "ДРУГ ОТКРЫЛ КОНВЕРТ");
      return;
    }
    while (!stopped) {
      receive.classList.remove("is-open", "is-revealed");
      stage(1, "ВЫБЕРИ ПРЕДМЕТ И НАПИШИ ЗАПИСКУ");
      await wait(1100);
      if (stopped) return;
      stage(2, "ПОДПИШИ И ОТПРАВЬ ССЫЛКУ");
      await wait(1050);
      if (stopped) return;
      stage(3, "ДРУГ ОТКРЫВАЕТ КОНВЕРТ");
      receive.classList.add("is-open");
      await wait(1400);
      if (stopped) return;
      receive.classList.add("is-revealed");
      status.textContent = "ЗАПИСКА И ПРЕДМЕТ ПОЛУЧЕНЫ";
      await wait(2600);
    }
  }
  void loop();
  return () => {
    stopped = true;
    if (pending) { clearTimeout(pending.id); pending.resolve(); }
  };
}
