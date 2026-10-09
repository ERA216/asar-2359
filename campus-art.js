// Artwork only. All sprites share a 64 × 64 grid and a one-unit dark outline.
// No placement, state, random numbers or game rules live here.
export const groundShadow = '<path d="M15 57h37v2h-4v2H19v-1h-4z" fill="#795539" opacity=".22" stroke="none"/>';

export const plantArt = `${groundShadow}
  <path d="M24 44h18v9h-2v4h-3v2H29v-2h-3v-4h-2z" fill="#795539"/>
  <path d="M26 47h14v7h-3v2h-7v-2h-2z" fill="#A77A50"/>
  <path d="M27 49v4h2v2h3M38 49v5" fill="none" stroke="#C3B58F"/>
  <path d="M23 42h20v5h-2v2H25v-2h-2z" fill="#A77A50"/>
  <path d="M25 42h16v4H25z" fill="#3C3429"/><path d="M26 46h14" stroke="#D8CBA5"/>
  <path d="M31 18h4v26h-4z" fill="#A77A50"/>
  <path d="M31 25h4m-4 5h4m-4 5h4m-4 5h4" stroke="#795539"/>
  <path d="M32 14h-4v-3h-5V9h-7v2h-4v3H9v4h4v-3h7v1h5v2h6z" fill="#73805A"/>
  <path d="M34 14h4v-3h5V9h8v2h4v3h3v4h-4v-3h-7v1h-5v2h-7z" fill="#73805A"/>
  <path d="M31 16h-8v2h-7v3h-5v4H8v7h3v-4h4v-4h7v-3h8z" fill="#4E5E43"/>
  <path d="M35 16h8v2h7v3h5v4h3v7h-3v-4h-4v-4h-7v-3h-8z" fill="#4E5E43"/>
  <path d="M31 19h-5v4h-4v5h-3v10h4v-7h3v-6h5zM35 19h5v4h4v5h3v10h-4v-7h-3v-6h-5z" fill="#73805A"/>
  <path d="M30 14h-7v-2h-7m18 2h9v-2h8M28 19h-7v3h-6v3h-4m26-6h7v3h6v3h5M28 24v4h-3v5m13-9v4h3v5" fill="none" stroke="#D8CBA5"/>
  <path d="M31 15h4v7h-4z" fill="#4E5E43" stroke="none"/>`;

export const vendingArt = `${groundShadow}
  <path d="M13 6h37v51H13z" fill="#AEA184"/>
  <path d="M13 6h37v5H13z" fill="#D8CBA5"/><path d="M47 12h3v43h-3z" fill="#795539" stroke="none"/>
  <path d="M16 14h25v31H16z" fill="#3C3429"/>
  <path d="M18 16h21v26H18z" fill="#4E5E43"/>
  <g stroke-width="1">
    <path d="M20 18h4v7h-4zM33 18h4v7h-4zM26 28h4v7h-4z" fill="#A77A50"/>
    <path d="M26 18h4v7h-4zM20 28h4v7h-4zM33 28h4v7h-4z" fill="#D8CBA5"/>
    <path d="M21 19h2v2h-2zM27 19h2v2h-2zM34 19h2v2h-2zM21 29h2v2h-2zM27 29h2v2h-2zM34 29h2v2h-2z" fill="#F5ECD5" stroke="none"/>
    <path d="M19 26h19m-19 10h19" stroke="#AEA184"/>
    <path d="M20 38h17v3H20z" fill="#795539" stroke="none"/>
  </g>
  <path d="M43 16h4v9h-4z" fill="#4E5E43"/><path d="M44 18h2m-2 3h2" stroke="#F5ECD5"/>
  <path d="M43 28h4v8h-4z" fill="#795539"/><path d="M44 30h1m1 0h1m-3 3h1m1 0h1" stroke="#D8CBA5"/>
  <path d="M18 48h21v6H18z" fill="#3C3429"/><path d="M19 48h19v2H19z" fill="#795539" stroke="none"/>
  <path d="M43 47h4v5h-4z" fill="#A77A50"/>
  <path d="M14 12v43m1 1h32M18 14h22" fill="none" stroke="#F5ECD5"/>
  <path d="M16 57v2h5v-2m23 0v2h5v-2" fill="#3C3429"/>`;

export const bookshelfArt = `${groundShadow}
  <path d="M10 12h43v46h-4v-3H14v3h-4z" fill="#795539"/>
  <path d="M14 17h35v35H14z" fill="#3C3429"/>
  <path d="M16 19h4v12h-4zM32 19h4v12h-4zM23 37h4v13h-4zM40 37h5v13h-5z" fill="#A77A50"/>
  <path d="M21 20h4v11h-4zM37 18h4v13h-4zM16 36h5v14h-5zM33 37h5v13h-5z" fill="#73805A"/>
  <path d="M26 19h4v12h-4zM43 19h4v12h-4zM28 38h3v12h-3z" fill="#D8CBA5"/>
  <path d="M17 22h2m3 2h2m3-2h2m4 1h2m3-2h2m4 2h2M17 40h3m4 2h2m3-1h1m4 0h3m4 1h3" stroke="#F5ECD5"/>
  <path d="M13 32h37v4H13zM13 51h37v4H13z" fill="#A77A50"/>
  <path d="M12 17v36m39-36v36M15 33h33m-33 19h33" stroke="#C3B58F"/>
  <path d="M8 5h47v11H8z" fill="#F5ECD5"/>
  <path d="M10 7h43v7H10z" fill="none" stroke="#C3B58F"/>
  <text x="31.5" y="12" text-anchor="middle" font-size="6" stroke="none" fill="#3C3429">БИБЛИОТЕКА</text>`;

export const printerDeskArt = `${groundShadow}
  <path d="M8 4h48v10H8z" fill="#F5ECD5"/><text x="32" y="11" text-anchor="middle" font-size="6" stroke="none" fill="#3C3429">КОПИЦЕНТР</text>
  <path d="M8 37h48v6H8z" fill="#A77A50"/><path d="M8 37h48v2H8z" fill="#D8CBA5" stroke="none"/>
  <path d="M10 43h4v14h-4zM50 43h4v14h-4zM14 51h36v3H14z" fill="#795539"/>
  <path d="M12 44v11m40-11v11" stroke="#C3B58F"/>
  <path d="M21 17h24v10H21z" fill="#F5ECD5"/><path d="M23 19h20m-20 3h20" stroke="#D8CBA5"/>
  <path d="M16 25h34v14H16z" fill="#AEA184"/><path d="M18 23h30v5H18z" fill="#D8CBA5"/>
  <path d="M18 29h29v8H18z" fill="#795539"/><path d="M20 31h22v4H20z" fill="#3C3429"/>
  <path d="M44 29h3v3h-3z" fill="#4E5E43"/><path d="M44 34h3" stroke="#F5ECD5"/>
  <path d="M17 26v11m2-13h26" stroke="#F5ECD5"/>
  <g class="printer-paper"><path d="M24 34h18v16H24z" fill="#F5ECD5"/><path d="M27 38h12m-12 3h12m-12 3h8" stroke="#795539"/></g>
  <path d="M9 30h5v7H9zM52 31h5v7h-5z" fill="#F5ECD5"/>
  <path d="M10 31h3m40 1h3" stroke="#AEA184"/>`;

export const studentArt = `${groundShadow}<g class="student-body">
  <path d="M39 29h7v3h3v17H38z" fill="var(--student-backpack, #A77A50)"/>
  <path d="M43 33h4v11h-4zM42 44h6v4h-6z" fill="#795539"/><path d="M44 35v7" stroke="#D8CBA5"/>
  <path d="M23 43h18v12h-7v-8h-4v8h-7z" fill="#4E5E43"/>
  <path d="M25 45v8m12-8v8" stroke="#73805A"/>
  <path d="M22 53h8v5H20v-3h2zM34 53h8v2h2v3H34z" fill="#3C3429"/>
  <path d="M21 56h8m7 0h7" stroke="#AEA184"/>
  <path d="M25 28h14v2h4v3h3v12h-5V35h-2v10H25V35h-2v10h-5V33h3v-3h4z" fill="var(--student-jacket, #4E5E43)"/>
  <path d="M21 34v8m6-10v10m13-10h2v9" fill="none" stroke="#73805A"/>
  <path d="M30 29h5v5h-2v10h-2V34h-1z" fill="#F5ECD5" stroke="none"/>
  <path d="M25 30v10h2V30m11 0v10h2V30" fill="#A77A50" stroke="none"/>
  <path d="M18 43h5v5h-4v-1h-1zM41 43h5v4h-1v1h-4z" fill="#D8CBA5"/>
  <path d="M21 13v-3h3V7h5V5h9v2h5v3h3v4h1v8h-3v5H23v-4h-3V13z" fill="#795539"/>
  <path d="M24 16h3v-4h5v3h5v-3h4v5h3v7h-3v4h-4v2h-8v-2h-4v-5h-2v-5h1z" fill="#D8CBA5"/>
  <path d="M24 19h2v5h-2m16-6h2v5h-2M29 27h8" stroke="#A77A50"/>
  <path d="M27 19h3v4h-3zM36 19h3v4h-3z" fill="#3C3429" stroke="none"/>
  <path d="M27 19h1v1h-1m9-1h1v1h-1" fill="#F5ECD5" stroke="none"/>
  <path d="M32 22v2h2m-3 2h4" fill="none" stroke="#795539"/>
  <path d="M23 13v-2h4V9h4V7h6m-9 4h5v-2h5m-3 4h5v-2h2M22 17v3" fill="none" stroke="#A77A50"/>
  <path class="student-back" d="M23 13h20v11h-3v4h-5v1h-7v-2h-4v-5h-2z" fill="#795539"/>
  </g>`;

export const guardArt = `${groundShadow}<g class="guard-body">
  <path d="M23 43h18v12h-7v-8h-4v8h-7z" fill="#795539"/>
  <path d="M25 46v7m12-7v7" stroke="#A77A50"/>
  <path d="M22 53h8v5H20v-3h2zM34 53h8v2h2v3H34z" fill="#3C3429"/><path d="M21 56h8m7 0h7" stroke="#AEA184"/>
  <path d="M25 28h14v2h4v3h3v12h-5V35h-2v10H25V35h-2v10h-5V33h3v-3h4z" fill="#4E5E43"/>
  <path d="M21 34v8m6-10v10m13-10h2v9" fill="none" stroke="#73805A"/>
  <path d="M23 43h18v3H23z" fill="#3C3429"/><path d="M30 43h5v3h-5z" fill="#A77A50"/>
  <path d="M18 43h5v5h-4v-1h-1zM41 43h5v4h-1v1h-4z" fill="#D8CBA5"/>
  <path d="M24 13h18v11h-3v4h-4v2h-6v-2h-4v-5h-2v-7h1z" fill="#D8CBA5"/>
  <path d="M24 19h2v5h-2m14 3h-9" stroke="#A77A50"/>
  <g class="guard-front"><path d="M27 19h3v3h-3zM36 19h3v3h-3z" fill="#3C3429" stroke="none"/>
    <path d="M31 23v1h3m-4 2h6" stroke="#795539"/>
    <path d="M29 29h7v4h-2v8h-2v-8h-3z" fill="#F5ECD5" stroke="none"/>
    <path d="M36 34h4v5h-4z" fill="#D9AA43"/><path d="M26 34h3v5h-3z" fill="#3C3429"/>
  </g>
  <path class="guard-back" d="M24 13h18v11h-3v4H28v-2h-4z" fill="#795539"/>
  <path d="M21 11V8h4V5h15v3h4v3h2v4H20v-4z" fill="#4E5E43"/>
  <path d="M24 8h17v3H24z" fill="#73805A" stroke="none"/>
  <path d="M21 15h24v2h-3v2H25v-2h-4z" fill="#3C3429"/>
  <path class="guard-front" d="M30 8h6v5h-2v1h-2v-1h-2z" fill="#D9AA43"/>
  </g>`;

export const coinArt = `<path d="M21 48h24v2h-3v2H24v-1h-3z" fill="#795539" opacity=".22" stroke="none"/>
  <g class="coin-face" stroke="#3C3429" stroke-width="1" stroke-linejoin="miter">
  <path d="M25 17h14v2h5v4h3v5h2v10h-2v5h-3v4h-5v2H25v-2h-5v-4h-3v-5h-2V28h2v-5h3v-4h5z" fill="#A57B32"/>
  <path d="M24 15h14v2h5v4h3v5h2v10h-2v5h-3v4h-5v2H24v-2h-5v-4h-3v-5h-2V26h2v-5h3v-4h5z" fill="#D9AA43"/>
  <path d="M25 17h12v2h5v4h3v13h-2v5h-5v3H24v-2h-4v-4h-3V26h2v-5h6z" fill="none" stroke="#F5ECD5"/>
  <path d="M26 21h10v2h5v5h2v7h-2v5h-5v2H26v-2h-5v-5h-2v-7h2v-5h5z" fill="#A57B32" stroke="none"/>
  <path d="M27 22h9v2h4v5h1v6h-2v4h-4v2h-8v-2h-4v-5h-1v-6h2v-4h3z" fill="#D9AA43" stroke="none"/>
  <path d="M28 25h9v3h-6v3h5v3h-5v3h6v3h-9z" fill="#A57B32" stroke="none"/>
  <path d="M27 24h9v3h-6v3h5v3h-5v3h6v3h-9z" fill="#F5ECD5" stroke="none"/>
  <path d="M21 20h4v2h-3v3h-2v-3h1z" fill="#F5ECD5" stroke="none"/>
  </g>`;

export const projectArt = {
  1: '<path d="M18 10h22v2h3v3h3v39H18z" fill="#C3B58F"/><path d="M16 8h23v3h3v3h3v38H16z" fill="#F5ECD5"/><path d="M39 8v7h6M20 24h20m-20 6h20m-20 6h20m-20 6h13" fill="none" stroke="#795539"/><path d="M19 9h3v10h-3z" fill="#A77A50"/><path d="M17 50h27" stroke="#D8CBA5"/>',
  2: '<path d="M12 12h39v29H12z" fill="#795539"/><path d="M14 14h35v25H14z" fill="#C3B58F"/><path d="M17 17h29v19H17z" fill="#F5ECD5"/><path d="M24 21h-2v2h-2v3h2v2h2m15-7h2v2h2v3h-2v2h-2M34 20v3h-2v4h-2v4" fill="none" stroke="#3C3429"/><path d="M12 41h39v2h2v3h2v4H8v-4h2v-3h2z" fill="#AEA184"/><path d="M14 43h34v3H14z" fill="#795539"/><path d="M17 44h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2m2 0h2" stroke="#F5ECD5"/><path d="M27 47h10M10 49h43" stroke="#F5ECD5"/>',
  3: '<path d="M10 19h14v3h29v31H10z" fill="#A77A50"/><path d="M16 13h32v33H16z" fill="#C3B58F"/><path d="M19 10h31v34H19z" fill="#F5ECD5"/><path d="M23 16h23v2H23zM25 33v-8h3v8m5 0V21h3v12m5 0v-6h3v6" fill="#4E5E43" stroke="none"/><path d="M14 36h14v-3h27v6h-2v6h-2v9H12V44h2z" fill="#A77A50"/><path d="M16 37h13v-2h24m-39 17h36" fill="none" stroke="#D8CBA5"/>',
};
