// Lamps are visual-only wall fixtures. Their positions never change the grid.
export function createNightLamp(tile, x, y, columns) {
  const last = columns - 1;
  if (tile !== "#" || (x !== 0 && x !== last) || (y !== 2 && y !== last - 2)) return null;

  const lamp = document.createElement("span");
  lamp.className = `night-lamp ${x === last ? "night-lamp--right" : ""}`;
  lamp.setAttribute("aria-hidden", "true");
  lamp.innerHTML = `<svg viewBox="0 0 64 64" focusable="false" aria-hidden="true" shape-rendering="crispEdges">
    <path d="M52 23h9v4h-9zM48 27h8v4h-8z" fill="#58473C"/>
    <path d="M37 20h16v4H37zM35 24h20v20H35zM37 44h16v4H37z" fill="#4A4038"/>
    <path d="M39 26h12v16H39z" fill="#E8BB70"/>
    <path d="M41 28h8v11h-8z" fill="#F8DEA0"/>
    <path d="M44 29h3v5h-3z" fill="#FFF0C2"/>
    <path d="M43 24h4v20h-4zM36 43h18" fill="#795539"/>
    <path d="M38 21h14M37 46h16" stroke="#D5AA6B" stroke-width="2"/>
  </svg>`;
  return lamp;
}
