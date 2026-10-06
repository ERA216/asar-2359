import "./gift.css";
import { itemIcon } from "./market.js";

export function initGifts(applyGift) {
  const dialog = document.createElement("dialog");
  dialog.id = "gift-dialog";
  dialog.setAttribute("aria-labelledby", "gift-title");
  dialog.innerHTML = `<div class="gift-heading"><h2 id="gift-title">Помощь другу</h2><button type="button" id="gift-close">Закрыть</button></div>
    <section id="gift-compose"><p>Пара ходов или ключ — иногда этого достаточно.</p>
    <div class="gift-options"><button type="button" data-gift-type="moves2" aria-pressed="true">${itemIcon("extra-moves")}<strong>+2 хода</strong><small>Ещё немного времени</small></button><button type="button" data-gift-type="key" aria-pressed="false">${itemIcon("door-key")}<strong>Ключ</strong><small>Один шаг через здание</small></button></div>
    <label for="gift-note">Записка другу · необязательно</label><textarea id="gift-note" rows="3"></textarea><small id="gift-capacity"></small>
    <p class="gift-fine">Публичный Memo в Devnet. Только комиссия в тестовых SOL. Подарок получит тот, кто откроет ссылку.</p>
    <button type="button" id="gift-send">Подписать и создать ссылку</button><button type="button" id="gift-connect">Подключить Phantom в шапке</button></section>
    <p id="gift-status" role="status" aria-live="polite"></p>
    <section id="gift-success" hidden><label for="gift-link">Отправь эту ссылку другу</label><input id="gift-link" readonly><div class="gift-actions"><button type="button" id="gift-copy">Копировать</button><button type="button" id="gift-share">Поделиться</button></div><a id="gift-explorer" target="_blank" rel="noopener noreferrer">Solana Explorer · Devnet</a><p class="gift-fine">Локальная ссылка работает только в вашей сети Wi-Fi. Для друга из другой сети нужен опубликованный адрес игры.</p></section>`;
  document.body.append(dialog);
  const $ = id => dialog.querySelector(`#gift-${id}`);
  let type = "moves2", busy = false, operation;
  function showLink(signature) {
    const url = new URL(location.href); url.search = ""; url.hash = ""; url.searchParams.set("gift", signature);
    $("link").value = url.href;
    $("explorer").href = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    $("success").hidden = false;
  }
  const bytes = text => new TextEncoder().encode(text).length;
  function refresh() {
    const left = 160 - bytes(`asar1|${type}|${$("note").value}`);
    $("capacity").textContent = `Осталось ${left} байт (примерно ${Math.max(0, Math.floor(left / 2))} русских букв)`;
    const connected = !!window.phantom?.solana?.publicKey;
    $("send").disabled = busy || !connected || left < 0;
    $("connect").hidden = connected;
    $("note").disabled = busy;
    dialog.querySelectorAll("[data-gift-type]").forEach(button => {
      button.disabled = busy;
      button.setAttribute("aria-pressed", String(button.dataset.giftType === type));
    });
  }
  document.querySelector("#gift-open").addEventListener("click", () => {
    $("compose").hidden = false;
    dialog.querySelector("#gift-receive")?.remove();
    $("title").textContent = "Помощь другу";
    $("close").textContent = "Закрыть";
    $("status").textContent = "";
    refresh(); dialog.showModal();
  });
  $("close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    operation?.abort(); busy = false; refresh();
    document.querySelector("#gift-open").focus({ preventScroll: true });
  });
  $("connect").addEventListener("click", () => { dialog.close(); document.querySelector("#connect").click(); });
  new MutationObserver(refresh).observe(document.querySelector("#wallet"), { childList: true, subtree: true, characterData: true });
  $("note").addEventListener("input", refresh);
  dialog.querySelectorAll("[data-gift-type]").forEach(button => button.addEventListener("click", () => { type = button.dataset.giftType; refresh(); }));
  $("send").addEventListener("click", async () => {
    if (busy) return;
    const current = operation = new AbortController();
    busy = true; refresh(); $("success").hidden = true;
    $("status").textContent = "Загружаем модуль Solana…";
    try {
      const { createGift } = await import("./gift.js");
      if (current.signal.aborted) return;
      const signature = await createGift(type, $("note").value, { signal: current.signal,
        onState: text => { if (!current.signal.aborted) $("status").textContent = text; } });
      if (current.signal.aborted) return;
      showLink(signature);
      $("status").textContent = "Записка отправлена. Ссылку можно скопировать; подтверждение Devnet может занять несколько секунд.";
    } catch (error) {
      if (!current.signal.aborted) $("status").textContent = error.code === 4001 ? "Подпись отменена. Можно попробовать снова." : `Не удалось создать ссылку: ${error.message}`;
      if (!current.signal.aborted && error.signature) {
        showLink(error.signature);
        $("status").textContent = "Devnet не подтвердил отправку. Ссылка сохранена: проверьте её или Explorer перед повторной подписью — запись уже могла попасть в сеть.";
      }
    } finally { if (operation === current) { busy = false; refresh(); } }
  });
  $("copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("link").value); $("status").textContent = "Скопировано"; }
    catch { $("link").select(); $("status").textContent = "Выделенная ссылка готова: скопируйте её вручную."; }
  });
  $("share").hidden = !navigator.share;
  $("share").addEventListener("click", async () => {
    try { await navigator.share({ title: "Помощь в Асар: 23:59", url: $("link").value }); }
    catch (error) { $("status").textContent = error.name === "AbortError" ? "Отправка ссылки отменена." : "Скопируйте ссылку и отправьте вручную."; }
  });
  refresh();
  const url = new URL(location.href);
  const signature = url.searchParams.get("gift");
  if (!/^[1-9A-HJ-NP-Za-km-z]{86,88}$/.test(signature || "")) return;
  $("compose").hidden = true;
  $("title").textContent = "Тебе пришла помощь";
  $("close").textContent = "Играть";
  $("status").textContent = "Тебе пришла помощь…";
  const receive = document.createElement("section");
  receive.id = "gift-receive";
  receive.innerHTML = `<div class="gift-envelope"><div class="gift-flap"></div><div class="gift-paper"><p id="gift-letter"></p><small id="gift-author"></small></div><div class="gift-pocket"></div></div><div id="gift-prize" hidden></div><button type="button" id="gift-claim" hidden disabled>Забрать</button>`;
  $("status").before(receive);
  dialog.showModal();
  url.searchParams.delete("gift");
  history.replaceState(history.state, "", url.href);
  const storageKey = `asar:gift:${signature}`;
  const used = () => localStorage.getItem(storageKey) === "claimed";
  let dismissed = false;
  dialog.addEventListener("close", () => { dismissed = true; }, { once: true });
  async function openEnvelope() {
    try {
      if (used()) { $("status").textContent = "Эта помощь уже получена"; receive.hidden = true; return; }
      const { readGift, giftTypes } = await import("./gift.js");
      if (dismissed) return;
      const gift = await readGift(signature);
      if (dismissed) return;
      $("letter").textContent = gift.note || "Ты справишься. Пусть до принтера останется на один повод для тревоги меньше.";
      $("author").textContent = `От ${gift.author}`;
      const id = giftTypes[gift.type];
      $("prize").innerHTML = `${itemIcon(id)}<strong>${gift.type === "moves2" ? "+2 хода" : "Ключ"}</strong><p>${gift.type === "moves2" ? "Добавит два хода к текущему раунду." : "Следующий успешный шаг может пройти через здание. Один ключ за раунд; внешние стены закрыты."}</p>`;
      receive.classList.add("is-open");
      $("status").textContent = "";
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) await new Promise(resolve => setTimeout(resolve, 850));
      if (dismissed) return;
      $("prize").hidden = false; $("claim").hidden = false; $("claim").disabled = false;
      $("claim").addEventListener("click", () => {
        try {
          if (used()) { $("status").textContent = "Эта помощь уже получена"; $("claim").disabled = true; return; }
          // Persist before granting; storage failures must not create repeatable gifts.
          localStorage.setItem(storageKey, "claimed");
          if (!applyGift(id)) {
            localStorage.removeItem(storageKey);
            $("status").textContent = "Раунд завершён или ключ уже использован. Начните новый раунд и снова откройте исходную ссылку.";
            return;
          }
          $("claim").disabled = true; dialog.close();
        } catch { $("status").textContent = "Браузер не разрешил сохранить получение. Разрешите локальное хранение и попробуйте снова."; }
      });
    } catch (error) {
      if (dismissed) return;
      receive.hidden = true;
      $("status").textContent = `Не удалось открыть конверт. ${error.message}. Можно продолжить игру и позже открыть исходную ссылку.`;
    }
  }
  openEnvelope();
}
