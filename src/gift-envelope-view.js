// The tutorial and received gifts use the same stationery and opening effects.
export function giftEnvelopeMarkup(idPrefix = "gift") {
  const fireworkRays = "<i></i>".repeat(8);
  return `<div class="gift-envelope" aria-label="Конверт с запиской помощи">
    <div class="gift-glow" aria-hidden="true"></div>
    <div class="gift-sparkles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div class="gift-fireworks" aria-hidden="true"><div class="gift-firework gift-firework--left">${fireworkRays}</div><div class="gift-firework gift-firework--right">${fireworkRays}</div><span class="gift-twinkle">✦</span><span class="gift-twinkle">✦</span><span class="gift-twinkle">✦</span><span class="gift-twinkle">✦</span><span class="gift-twinkle">✦</span><span class="gift-twinkle">✦</span></div>
    <div class="gift-envelope-back" aria-hidden="true"><span>ASAR · 23:59</span></div>
    <div class="gift-paper"><div class="gift-paper-heading"><span>ЗАПИСКА ДРУГУ</span><span aria-hidden="true">✦</span></div><p id="${idPrefix}-letter"></p><small id="${idPrefix}-author"></small><div class="gift-paper-footer" aria-hidden="true">ПОМОЩЬ ПРИШЛА ВОВРЕМЯ</div></div>
    <div class="gift-flap" aria-hidden="true"></div>
    <div class="gift-pocket" aria-hidden="true"><span class="gift-pocket-label">ПОМОЩЬ · ASAR</span><span class="gift-pocket-code">23:59</span></div>
    <div class="gift-seal" aria-hidden="true"><span>✦</span></div>
  </div>`;
}
