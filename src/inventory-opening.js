import "./inventory-opening.css";
import { itemArt } from "./campus-art.js";

const item = (art, className, x, y) => `<svg class="${className}" x="${x}" y="${y}" width="48" height="48" viewBox="0 0 64 64" fill="none" stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" shape-rendering="crispEdges">${art}</svg>`;

const opening = document.createElement("dialog");
opening.id = "inventory-opening";
opening.setAttribute("aria-label", "Открывается инвентарь");
opening.tabIndex = -1;
opening.innerHTML = `<div class="inventory-opening-scene" aria-hidden="true">
  <span class="inventory-opening-spark inventory-opening-spark--one">✦</span>
  <span class="inventory-opening-spark inventory-opening-spark--two">✦</span>
  <span class="inventory-opening-spark inventory-opening-spark--three">✦</span>
  <span class="inventory-opening-spark inventory-opening-spark--four">✦</span>
  <svg class="inventory-opening-bag" viewBox="0 0 240 220" fill="none" shape-rendering="crispEdges">
    <ellipse cx="120" cy="203" rx="82" ry="10" fill="#3C3429" opacity=".24"/>
    <path d="M66 80V55h14v24m80 1V55h14v25" stroke="#3C3429" stroke-width="12"/>
    <path d="M66 80V55h14v24m80 1V55h14v25" stroke="#A77A50" stroke-width="7"/>
    <path d="M85 71V49h4V36h62v13h4v22" stroke="#3C3429" stroke-width="10"/>
    <path d="M85 71V49h4V36h62v13h4v22" stroke="#D8CBA5" stroke-width="6"/>
    <path d="M38 80h164v22h7v77h-8v13H39v-13h-8v-77h7z" fill="#3C3429"/>
    <path d="M43 85h154v20h7v69h-8v13H44v-13h-8v-69h7z" fill="#A77A50"/>
    <path d="M46 88h148v9H46z" fill="#D8CBA5"/>
    <path d="M48 91h144v3H48z" fill="#F5ECD5"/>
    <path d="M43 108h12v68H43zm142 0h12v68h-12z" fill="#795539"/>
    <path d="M47 113h4v54h-4zm142 0h4v54h-4z" fill="#73805A"/>
    <path d="M57 101h126v14H57z" fill="#60432E"/>
    <path class="inventory-bag-opening" d="M55 96h130v22H55z" fill="#252A20"/>
    <path class="inventory-bag-opening-light" d="M61 101h118v8H61z" fill="#D9AA43" opacity=".7"/>
    <g class="inventory-bag-items">
      ${item(itemArt["extra-moves"], "inventory-bag-item inventory-bag-item--clock", 73, 66)}
      ${item(itemArt["door-key"], "inventory-bag-item inventory-bag-item--key", 124, 64)}
    </g>
    <path d="M60 118h120v58H60z" fill="#795539"/>
    <path d="M65 122h110v49H65z" fill="#4E5E43"/>
    <path d="M69 126h102v4H69z" fill="#73805A"/>
    <path d="M72 137h96v31H72z" fill="#3F583D"/>
    <path d="M78 144h84v18H78z" fill="#5C7650"/>
    <path d="M72 137h96m-96 31h96" stroke="#D8CBA5" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M96 144h48v20H96z" fill="#D9AA43"/>
    <path d="M100 148h40v12h-40z" fill="#F5ECD5"/>
    <path d="M117 148h6v12h-6zM105 153h30v2h-30z" fill="#4E5E43"/>
    <path d="M51 174h138M45 182h150" stroke="#F5ECD5" stroke-width="2"/>
    <g class="inventory-bag-flap">
      <path d="M47 73h146v9h8v27H39V82h8z" fill="#3C3429"/>
      <path d="M51 77h138v9h8v18H43V86h8z" fill="#C3A577"/>
      <path d="M54 80h132v5H54z" fill="#F5ECD5"/>
      <path d="M48 93h144M52 100h136" stroke="#8F6E48" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M106 79h28v16h-28z" fill="#795539"/>
      <path d="M110 82h20v10h-20z" fill="#D9AA43"/>
      <path d="M115 84h10v6h-10z" fill="#F5ECD5"/>
    </g>
    <path class="inventory-bag-zip" d="M55 107h130" stroke="#D9AA43" stroke-width="4" stroke-dasharray="4 3"/>
    <g class="inventory-bag-pull">
      <path d="M53 100h13v14H53z" fill="#3C3429"/>
      <path d="M55 102h9v10h-9z" fill="#D9AA43"/>
      <path d="M57 114h5v11h-5z" fill="#D9AA43" stroke="#3C3429" stroke-width="1"/>
    </g>
  </svg>
  <span class="inventory-opening-caption">ОТКРЫВАЕМ СУМКУ</span>
</div>`;
document.body.append(opening);

let timer = null;
let origin = null;
let completed = false;

opening.addEventListener("cancel", () => {
  clearTimeout(timer);
  timer = null;
});
opening.addEventListener("close", () => {
  clearTimeout(timer);
  timer = null;
  if (!completed) origin?.focus({ preventScroll: true });
  completed = false;
  origin = null;
  opening.classList.remove("is-playing");
});

export function openInventoryWithAnimation(dialog, button) {
  if (dialog.open || opening.open || document.querySelector("dialog[open]")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    dialog.showModal();
    button.setAttribute("aria-expanded", "true");
    return;
  }
  origin = button;
  opening.showModal();
  // A fresh class change restarts the scene each time the inventory opens.
  void opening.offsetWidth;
  opening.classList.add("is-playing");
  timer = setTimeout(() => {
    if (!opening.open) return;
    completed = true;
    opening.close();
    dialog.showModal();
    button.setAttribute("aria-expanded", "true");
  }, 1450);
}
