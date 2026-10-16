// The front view reuses the background character's vector details on the map grid.
// Side and back views keep the same brown hair, olive jacket and trousers.
const shadow = '<path d="M15 58h35v2H18v-1h-3z" fill="#795539" opacity=".22" stroke="none"/>';

const front = `<g class="student-view student-view--front">
  <g transform="translate(10 1) scale(.68 .62)" stroke="none">
    <g class="street-figure-body">
        <g class="walk-leg--right">
          <path d="M33 65h13v22H34V76h-1z" fill="#352F29"/>
          <path d="M35 67h9v18h-8V74h-1z" fill="#76563E"/>
          <path d="M40 69h4v15h-4z" fill="#A27B53"/>
          <path d="M35 84h10v3h3v5H34v-5h1z" fill="#303431"/>
          <path d="M36 89h11v2H35z" fill="#69716A"/>
        </g>
        <g class="walk-leg--left">
          <path d="M19 65h13v11h-1v11H19z" fill="#352F29"/>
          <path d="M21 67h9v7h-1v11h-8z" fill="#806044"/>
          <path d="M22 69h4v15h-4z" fill="#A47D55"/>
          <path d="M19 84h10v3h2v5H16v-5h3z" fill="#303431"/>
          <path d="M18 89h11v2H17z" fill="#69716A"/>
        </g>
        <g class="street-figure-upper">
          <path d="M20 43h24v3h5v5h3v18h-5v3h-7V50H24v22h-7v-3h-5V51h3v-5h5z" fill="#2E342C"/>
          <path d="M18 49h7v17h-2v3h-8V52h3zM39 49h7v17h3V52h-3z" fill="#3F5E3B"/>
          <path d="M18 50h4v15h-4zM43 50h4v15h-4z" fill="#6E8754"/>
          <path d="M16 67h7v5h-7zM42 67h7v5h-7z" fill="#DBAA84"/>
          <path d="M20 43h5v-3h14v3h5v5h2v19h-3v3H21v-3h-3V48h2z" fill="#355039"/>
          <path d="M22 45h5v-2h10v2h5v4h2v17h-4v2H24v-2h-4V49h2z" fill="var(--student-jacket, #557847)"/>
          <path d="M22 48h5v16h-5zM37 48h5v16h-5z" fill="#6D8D58"/>
          <path d="M27 45h10v4h-3v17h-4V49h-3z" fill="#2D4633"/>
          <path d="M29 46h6v3h-6z" fill="#B5C399"/>
          <path d="M31 49h2v17h-2z" fill="#C6BA8F"/>
          <path d="M25 58h14v8H25z" fill="#46643D"/>
          <path d="M26 59h12v2H26z" fill="#7C9560"/>
          <path d="M28 67h8v2h-8z" fill="#304834"/>
          <path d="M27 39h10v7H27z" fill="#302B27"/>
          <path d="M29 39h6v5h-6z" fill="#DBAA84"/>
          <path d="M23 25h18v3h3v12h-3v3h-4v2H27v-2h-4v-3h-3V28h3z" fill="#493428"/>
          <path d="M25 28h14v2h3v9h-3v3H25v-3h-3v-9h3z" fill="#E6B38F"/>
          <path d="M25 30h5v8h-5z" fill="#F4CAA4"/>
          <path d="M22 33h3v5h-3zM39 33h3v5h-3z" fill="#D99D7B"/>
          <path d="M23 25h18v4h-3v3h-4v-3h-3v2h-6v3h-3v-6h1z" fill="#5B3C2C"/>
          <path d="M25 28h5v2h-5zM34 28h5v2h-5z" fill="#795039"/>
          <path d="M27 33h4v1h-4zM34 33h4v1h-4z" fill="#754F3A"/>
          <g class="street-figure-eye" fill="#332A27">
            <path d="M28 34h2v3h-2z"/><path d="M35 34h2v3h-2z"/>
          </g>
          <g class="student-eyelid" opacity="0" fill="#754F3A">
            <path d="M28 35h2v1h-2z"/><path d="M35 35h2v1h-2z"/>
          </g>
          <path d="M32 37h1v2h1v1h-3v-1h1z" fill="#B77F68"/>
          <path d="M30 41h5v1h-5z" fill="#A56F60"/>
          <path d="M26 13h12v2h5v3h3v10h-3v3h-3v-4h-3v-2h-5v1h-5v5h-4V19h3v-4h4z" fill="#302B27"/>
          <path d="M27 15h10v2h5v3h2v7h-3v-3h-5v-2h-5v1h-5v6h-2V20h3z" fill="#61442F"/>
          <path d="M28 16h9v2h4v2H27v-2h1zM26 22h5v2h-5z" fill="#8A6247"/>
          <path d="M33 18h7v2h-7zM28 24h5v1h-5z" fill="#A47B55"/>
        </g>
      </g>
  <g class="student-glasses" style="display:var(--student-glasses-display,none)">
    <path d="M25 32h8v7h-8zm9 0h8v7h-8z" fill="#F5ECD5" opacity=".3"/>
    <path d="M25 32h8v7h-8zm9 0h8v7h-8zM33 34h1M22 34h3m17 0h3" fill="none" stroke="#302B27" stroke-width="1.5"/>
  </g>
  <g class="student-cap" style="display:var(--student-cap-display,none)">
    <path d="M26 9h4V7h8v2h4v3h3v9H19v-9h3V9z" fill="#A57B32"/>
    <path d="M19 18h26v4H19z" fill="#795539"/>
    <path d="M15 22h34v2h4v3H11v-3h4z" fill="#D9AA43"/>
    <path d="M12 27h40v2H12z" fill="#A57B32"/>
  </g>
  </g>
</g>`;

const side = `<g class="student-view student-view--side">
  <g transform="translate(6 0) scale(.8 1)">
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
  <path d="M27 11h12v2h5v3h2v8h-2v5h-3v-5h-4v-2h-5v5h-5v-3h-3v-9h3z" fill="#302B27" stroke="none"/>
  <path d="M28 13h11v2h4v3h2v6h-3v-3h-5v-2h-5v4h-5v-6h1z" fill="#61442F" stroke="none"/>
  <path d="M30 14h8v2h3v2H29v-2h1zM27 22h4v2h-4z" fill="#8A6247" stroke="none"/>
  <g class="student-cap" style="display:var(--student-cap-display,none)">
    <path d="M24 8h4V6h9v2h4v3h3v5H19v-5h2V8z" fill="#A57B32" stroke="none"/>
    <path d="M19 14h26v3H19z" fill="#795539" stroke="none"/>
    <path d="M18 17h31v2h4v2H13v-2h5z" fill="#D9AA43" stroke="none"/>
    <path d="M14 21h39v2H14z" fill="#A57B32" stroke="none"/>
  </g>
  </g>
</g>`;

const back = `<g class="student-view student-view--back">
  <g transform="translate(6 0) scale(.8 1)">
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
  <path d="M26 11h12v2h5v3h3v13h-3v4H22v-4h-3V17h3v-3h4z" fill="#302B27" stroke="none"/>
  <path d="M27 13h10v2h5v3h2v10h-3v3H24v-3h-3V18h3v-3h3z" fill="#61442F" stroke="none"/>
  <path d="M28 15h9v2h4v2H25v-2h3zM24 23h5v7h-5z" fill="#8A6247" stroke="none"/>
  <path d="M37 20h4v8h-4zM30 17h5v2h-5z" fill="#A47B55" stroke="none"/>
  <g class="student-cap" style="display:var(--student-cap-display,none)">
    <path d="M26 8h4V6h8v2h4v3h3v5H19v-5h3V8z" fill="#A57B32" stroke="none"/>
    <path d="M19 14h26v3H19z" fill="#795539" stroke="none"/>
    <path d="M16 17h32v2h4v2H12v-2h4z" fill="#D9AA43" stroke="none"/>
    <path d="M12 21h40v2H12z" fill="#A57B32" stroke="none"/>
  </g>
  </g>
</g>`;

export const hatPlayerArt = `${shadow}<g class="student-body">${front}${side}${back}</g>`;
