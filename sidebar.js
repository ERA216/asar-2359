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
