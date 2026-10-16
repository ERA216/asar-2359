// The foreground pedestrian redrawn on the map's 64 × 64 pixel grid.
// Front, side and back views share the same straw hat, olive jacket and brown trousers.
const shadow = '<path d="M15 58h35v2H18v-1h-3z" fill="#795539" opacity=".22" stroke="none"/>';

const front = `<g class="student-view student-view--front">
  <g class="walk-leg--left">
    <path d="M23 46h10v11H21v-3h2z" fill="#302B27" stroke="none"/>
    <path d="M25 48h6v7h-6z" fill="#806044" stroke="none"/>
    <path d="M25 49h2v5h-2z" fill="#A47D55" stroke="none"/>
    <path d="M20 55h11v4H19v-3h1z" fill="#303431" stroke="none"/>
    <path d="M21 58h10v1H21z" fill="#69716A" stroke="none"/>
  </g>
  <g class="walk-leg--right">
    <path d="M33 46h10v8h2v3H33z" fill="#302B27" stroke="none"/>
    <path d="M35 48h6v7h-6z" fill="#76563E" stroke="none"/>
    <path d="M39 49h2v5h-2z" fill="#A27B53" stroke="none"/>
    <path d="M34 55h11v1h2v3H34z" fill="#303431" stroke="none"/>
    <path d="M35 58h11v1H35z" fill="#69716A" stroke="none"/>
  </g>
  <path d="M18 36h8v12h-8zM38 36h8v12h-8z" fill="var(--student-backpack, #795539)" stroke="none"/>
  <path d="M18 38h5v10h-5zM42 38h4v10h-4z" fill="#4F392E" stroke="none"/>
  <path d="M19 47h5v4h-5zM41 47h5v4h-5z" fill="#DBAA84" stroke="none"/>
  <path d="M24 33h16v2h4v3h3v10h-5v2H22v-2h-5V38h3v-3h4z" fill="#2E342C" stroke="none"/>
  <path d="M23 36h18v2h3v9h-5v2H25v-2h-5v-9h3z" fill="var(--student-jacket, #557847)" stroke="none"/>
  <path d="M21 39h3v8h-3zM40 39h3v8h-3zM26 37h12v2H26z" fill="#6D8D58" stroke="none"/>
  <path d="M28 34h8v4h-3v10h-2V38h-3z" fill="#2D4633" stroke="none"/>
  <path d="M29 35h6v2h-6zM31 38h2v10h-2z" fill="#C6BA8F" stroke="none"/>
  <path d="M24 44h6v2h-6zm10 0h6v2h-6z" fill="#46643D" stroke="none"/>
  <path d="M27 46h3v1h-3zm9 0h3v1h-3z" fill="#8EA274" stroke="none"/>
  <path d="M29 30h6v5h-6z" fill="#DBAA84" stroke="none"/>
  <path d="M23 19h18v3h2v9h-3v3H24v-3h-3v-9h2z" fill="#493428" stroke="none"/>
  <path d="M25 22h14v2h2v7h-3v2H26v-2h-3v-7h2z" fill="#E6B38F" stroke="none"/>
  <path d="M25 23h4v7h-4z" fill="#F4CAA4" stroke="none"/>
  <path d="M23 25h3v5h-3zm16 0h2v5h-2z" fill="#D99D7B" stroke="none"/>
  <path d="M23 20h18v4h-3v2h-4v-2h-4v1h-5v3h-2z" fill="#5B3C2C" stroke="none"/>
  <path d="M27 26h3v3h-3zm8 0h3v3h-3z" fill="#332A27" stroke="none"/>
  <path d="M28 26h1v1h-1zm8 0h1v1h-1z" fill="#F5D6B6" stroke="none"/>
  <path d="M32 29h1v2h1v1h-3v-1h1z" fill="#B77F68" stroke="none"/>
  <path d="M30 32h5v1h-5z" fill="#A56F60" stroke="none"/>
  <g class="student-glasses" style="display:var(--student-glasses-display,none)">
    <path d="M25 25h7v5h-7zm9 0h7v5h-7z" fill="#F5ECD5" opacity=".3" stroke="none"/>
    <path d="M25 25h7v5h-7zm9 0h7v5h-7zM32 26h2M23 26h2m16 0h2" fill="none" stroke="#302B27" stroke-width="1.5"/>
  </g>
  <path d="M25 6h4V4h10v2h4v3h3v4h2v3h4v3H12v-3h4v-3h2V9h3V6h4z" fill="#302B27" stroke="none"/>
  <path d="M26 8h4V6h8v2h4v3h3v5H19v-5h3V8z" fill="#D2A15F" stroke="none"/>
  <path d="M28 8h9v2h4v2H24v-2h4z" fill="#F0C27C" stroke="none"/>
  <path d="M19 14h26v3H19z" fill="#8D603A" stroke="none"/>
  <path d="M21 15h22v1H21z" fill="#B7854D" stroke="none"/>
  <path d="M16 17h32v2h4v2H12v-2h4z" fill="#E3B06C" stroke="none"/>
  <path d="M12 21h40v2H12z" fill="#B8874D" stroke="none"/>
  <path d="M19 23h26v1H19zM28 9h9v2h-9z" fill="#61442F" stroke="none"/>
  <g class="student-cap" style="display:var(--student-cap-display,none)">
    <path d="M26 8h4V6h8v2h4v3h3v5H19v-5h3V8z" fill="#A57B32" stroke="none"/>
    <path d="M19 14h26v3H19z" fill="#795539" stroke="none"/>
    <path d="M16 17h32v2h4v2H12v-2h4z" fill="#D9AA43" stroke="none"/>
    <path d="M13 21h39v2H13z" fill="#A57B32" stroke="none"/>
  </g>
</g>`;

const side = `<g class="student-view student-view--side">
  <g class="walk-leg--left">
    <path d="M28 46h10v11H27v-3h1z" fill="#302B27" stroke="none"/>
    <path d="M30 48h6v7h-6z" fill="#76563E" stroke="none"/>
    <path d="M28 55h11v4H26v-3h2z" fill="#303431" stroke="none"/>
    <path d="M28 58h10v1H28z" fill="#69716A" stroke="none"/>
  </g>
  <g class="walk-leg--right">
    <path d="M37 46h9v10h2v2H36z" fill="#302B27" stroke="none"/>
    <path d="M39 48h5v8h-5z" fill="#806044" stroke="none"/>
    <path d="M39 56h10v3H37v-2h2z" fill="#303431" stroke="none"/>
    <path d="M39 58h9v1h-9z" fill="#69716A" stroke="none"/>
  </g>
  <path d="M17 34h15v16H18v-3h-2V37h1z" fill="#302B27" stroke="none"/>
  <path d="M19 36h11v11H19z" fill="var(--student-backpack, #795539)" stroke="none"/>
  <path d="M21 38h7v7h-7z" fill="#A07B56" stroke="none"/>
  <path d="M19 47h12v2H19z" fill="#4F392E" stroke="none"/>
  <path d="M27 34h15v2h4v3h2v9h-5v2H28v-2h-4V38h3z" fill="#2E342C" stroke="none"/>
  <path d="M28 36h13v2h4v9h-4v2H29v-2h-3v-9h2z" fill="var(--student-jacket, #557847)" stroke="none"/>
  <path d="M29 37h5v10h-5zM39 38h4v8h-4z" fill="#6D8D58" stroke="none"/>
  <path d="M32 35h8v3h-3v10h-2V38h-3z" fill="#2D4633" stroke="none"/>
  <path d="M35 38h2v9h-2z" fill="#C6BA8F" stroke="none"/>
  <path d="M43 41h5v7h-5z" fill="#355039" stroke="none"/>
  <path d="M45 47h5v4h-5z" fill="#DBAA84" stroke="none"/>
  <path d="M34 31h6v5h-6z" fill="#DBAA84" stroke="none"/>
  <path d="M24 20h19v3h2v4h2v5h-3v2H29v-3h-3v-4h-2z" fill="#493428" stroke="none"/>
  <path d="M28 23h14v2h3v5h-2v3H30v-2h-3v-6h1z" fill="#E6B38F" stroke="none"/>
  <path d="M29 24h4v6h-4z" fill="#F4CAA4" stroke="none"/>
  <path d="M24 20h17v4h-4v2h-5v2h-4v-3h-4z" fill="#5B3C2C" stroke="none"/>
  <path d="M40 26h2v3h-2z" fill="#332A27" stroke="none"/>
  <path d="M45 28h2v2h-2zM40 32h5v1h-5z" fill="#B77F68" stroke="none"/>
  <g class="student-glasses" style="display:var(--student-glasses-display,none)">
    <path d="M38 25h6v6h-6z" fill="#F5ECD5" opacity=".3" stroke="none"/>
    <path d="M38 25h6v6h-6zM34 27h4" fill="none" stroke="#302B27" stroke-width="1.5"/>
  </g>
  <path d="M23 6h4V4h11v2h4v3h3v5h3v3h4v3H14v-3h4v-3h2V9h3z" fill="#302B27" stroke="none"/>
  <path d="M24 8h4V6h9v2h4v3h3v5H19v-5h2V8z" fill="#D2A15F" stroke="none"/>
  <path d="M26 8h10v2h4v2H22v-2h4z" fill="#F0C27C" stroke="none"/>
  <path d="M19 14h26v3H19z" fill="#8D603A" stroke="none"/>
  <path d="M18 17h31v2h4v2H13v-2h5z" fill="#E3B06C" stroke="none"/>
  <path d="M14 21h39v2H14z" fill="#B8874D" stroke="none"/>
  <g class="student-cap" style="display:var(--student-cap-display,none)">
    <path d="M24 8h4V6h9v2h4v3h3v5H19v-5h2V8z" fill="#A57B32" stroke="none"/>
    <path d="M19 14h26v3H19z" fill="#795539" stroke="none"/>
    <path d="M18 17h31v2h4v2H13v-2h5z" fill="#D9AA43" stroke="none"/>
    <path d="M14 21h39v2H14z" fill="#A57B32" stroke="none"/>
  </g>
</g>`;

const back = `<g class="student-view student-view--back">
  <g class="walk-leg--left">
    <path d="M22 46h11v11H21v-3h1z" fill="#302B27" stroke="none"/>
    <path d="M24 48h7v7h-7z" fill="#806044" stroke="none"/>
    <path d="M20 55h12v4H19v-3h1z" fill="#303431" stroke="none"/>
    <path d="M21 58h10v1H21z" fill="#69716A" stroke="none"/>
  </g>
  <g class="walk-leg--right">
    <path d="M33 46h11v9h2v2H33z" fill="#302B27" stroke="none"/>
    <path d="M35 48h7v7h-7z" fill="#76563E" stroke="none"/>
    <path d="M34 55h12v1h2v3H34z" fill="#303431" stroke="none"/>
    <path d="M35 58h11v1H35z" fill="#69716A" stroke="none"/>
  </g>
  <path d="M22 33h20v3h4v12h-5v2H23v-2h-5V36h4z" fill="#2E342C" stroke="none"/>
  <path d="M22 36h20v2h2v9h-4v2H24v-2h-4v-9h2z" fill="var(--student-jacket, #557847)" stroke="none"/>
  <path d="M21 39h4v8h-4zm18 0h4v8h-4z" fill="#6D8D58" stroke="none"/>
  <path d="M19 47h5v4h-5zm22 0h5v4h-5z" fill="#DBAA84" stroke="none"/>
  <path d="M25 35h14v2h3v12h-3v2H25v-2h-3V37h3z" fill="#302B27" stroke="none"/>
  <path d="M26 37h12v2h2v10H24V39h2z" fill="var(--student-backpack, #795539)" stroke="none"/>
  <path d="M27 39h10v8H27z" fill="#A07B56" stroke="none"/>
  <path d="M25 47h14v2H25zM28 43h8v1h-8z" fill="#4F392E" stroke="none"/>
  <path d="M31 48h3v2h-3z" fill="#C6BA8F" stroke="none"/>
  <path d="M23 20h18v3h2v9h-3v3H24v-3h-3v-9h2z" fill="#493428" stroke="none"/>
  <path d="M25 23h14v8H25z" fill="#684B34" stroke="none"/>
  <path d="M26 24h4v6h-4zm10 0h3v6h-3z" fill="#795039" stroke="none"/>
  <path d="M25 6h4V4h10v2h4v3h3v4h2v3h4v3H12v-3h4v-3h2V9h3V6h4z" fill="#302B27" stroke="none"/>
  <path d="M26 8h4V6h8v2h4v3h3v5H19v-5h3V8z" fill="#D2A15F" stroke="none"/>
  <path d="M28 8h9v2h4v2H24v-2h4z" fill="#F0C27C" stroke="none"/>
  <path d="M19 14h26v3H19z" fill="#8D603A" stroke="none"/>
  <path d="M16 17h32v2h4v2H12v-2h4z" fill="#E3B06C" stroke="none"/>
  <path d="M12 21h40v2H12z" fill="#B8874D" stroke="none"/>
  <g class="student-cap" style="display:var(--student-cap-display,none)">
    <path d="M26 8h4V6h8v2h4v3h3v5H19v-5h3V8z" fill="#A57B32" stroke="none"/>
    <path d="M19 14h26v3H19z" fill="#795539" stroke="none"/>
    <path d="M16 17h32v2h4v2H12v-2h4z" fill="#D9AA43" stroke="none"/>
    <path d="M12 21h40v2H12z" fill="#A57B32" stroke="none"/>
  </g>
</g>`;

export const hatPlayerArt = `${shadow}<g class="student-body">${front}${side}${back}</g>`;
