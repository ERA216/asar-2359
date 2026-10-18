import { hatPlayerArt } from "./hat-player-art.js";
import { guardPixelArt } from "./guard-pixel-art.js";

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

export const decorativeBookshelfArt = `${groundShadow}
  <path d="M10 12h43v46h-4v-3H14v3h-4z" fill="#795539"/>
  <path d="M14 17h35v35H14z" fill="#3C3429"/>
  <path d="M16 19h4v12h-4zM32 19h4v12h-4zM23 37h4v13h-4zM40 37h5v13h-5z" fill="#A77A50"/>
  <path d="M21 20h4v11h-4zM37 18h4v13h-4zM16 36h5v14h-5zM33 37h5v13h-5z" fill="#73805A"/>
  <path d="M26 19h4v12h-4zM43 19h4v12h-4zM28 38h3v12h-3z" fill="#D8CBA5"/>
  <path d="M17 22h2m3 2h2m3-2h2m4 1h2m3-2h2m4 2h2M17 40h3m4 2h2m3-1h1m4 0h3m4 1h3" stroke="#F5ECD5"/>
  <path d="M13 32h37v4H13zM13 51h37v4H13z" fill="#A77A50"/>
  <path d="M12 17v36m39-36v36M15 33h33m-33 19h33" stroke="#C3B58F"/>`;

export const bookshelfArt = `${decorativeBookshelfArt}
  <path d="M17 26h3m2 0h3m2 0h3m3 0h3m2 0h3m2 0h4M17 45h4m2 0h4m2 0h2m3 0h4m2 0h5" fill="none" stroke="#D9AA43"/>
  <path d="M18 19h1v10h-1zM24 20h1v10h-1zM34 19h1v10h-1zM40 19h1v10h-1zM18 37h1v12h-1zM25 38h1v11h-1zM35 38h1v11h-1zM43 38h1v11h-1z" fill="#F1D8AE" stroke="none"/>
  <path d="M11 15h41v2H11zM14 33h36v1H14zM14 52h36v1H14z" fill="#D3A574" stroke="none"/>
  <path d="M8 5h47v11H8z" fill="#F5ECD5"/>
  <path d="M10 7h43v7H10z" fill="none" stroke="#C3B58F"/>
  <text x="31.5" y="12" text-anchor="middle" font-size="6" stroke="none" fill="#3C3429">БИБЛИОТЕКА</text>`;

export const printerDeskArt = `${groundShadow}
  <path class="printer-light-pool" d="M41 50h14v2h3v3H40v-3h1z" fill="none" stroke="none"/>
  <path d="M6 2h52v13H6z" fill="#795539"/><path d="M8 3h48v10H8z" fill="#F5ECD5"/>
  <path d="M10 5h3v1h-3zM51 5h3v1h-3zM10 11h3v1h-3zM51 11h3v1h-3z" fill="#A77A50" stroke="none"/>
  <text x="32" y="11" text-anchor="middle" font-size="7" textLength="34" lengthAdjust="spacingAndGlyphs" stroke="none" fill="#3C3429">ПРИНТЕР</text>
  <path d="M10 16h44v26H10z" fill="#A77A50"/><path d="M12 17h40v19H12z" fill="#D8CBA5"/>
  <path d="M13 19h6v2h-6zM45 19h6v2h-6zM13 23h5v1h-5zM46 23h5v1h-5z" fill="#C3B58F" stroke="none"/>
  <path d="M8 44h48v4H8z" fill="#795539"/><path d="M9 43h46v3H9z" fill="#D8CBA5"/>
  <path d="M10 48h5v10h-5zM49 48h5v10h-5zM15 53h34v3H15z" fill="#795539"/>
  <path d="M11 49h2v8h-2zM51 49h2v8h-2zM17 54h30v1H17z" fill="#C3B58F" stroke="none"/>
  <path d="M24 16h16v12H24z" fill="#C3B58F"/><path d="M25 16h16v12H25z" fill="#F5ECD5"/>
  <path d="M28 20h10m-10 2h10m-10 2h7" stroke="#AEA184"/>
  <path d="M18 24h28v3H18z" fill="#3C3429"/><path d="M16 27h32v4H16z" fill="#AEA184"/>
  <path d="M15 30h34v12H15z" fill="#C3B58F"/><path d="M16 29h32v4H16z" fill="#F5ECD5"/>
  <path d="M17 33h30v7H17z" fill="#9C927E"/><path d="M19 34h23v5H19z" fill="#3C3429"/>
  <path d="M17 31h29m-29 9h30M16 33v7m31-7v7" fill="none" stroke="#F5ECD5"/>
  <path d="M11 32h4v9h-4zM49 33h4v8h-4z" fill="#AEA184"/>
  <path d="M12 34h2v5h-2zM50 35h2v4h-2z" fill="#F5ECD5" stroke="none"/>
  <path d="M40 31h8v8h-8z" fill="#795539"/><path d="M41 32h6v6h-6z" fill="#D8CBA5"/>
  <path class="printer-status-halo" d="M42 30h9v9h-9z" fill="none" stroke="none"/>
  <path class="printer-status-led" d="M44 33h3v3h-3z" fill="#A77A50" stroke="none"/>
  <path d="M42 37h2m2 0h1" stroke="#795539"/>
  <g class="printer-paper"><path d="M23 38h17v14H23z" fill="#D8CBA5"/><path d="M24 37h17v14H24z" fill="#F5ECD5"/>
    <path d="M27 40h10m-10 3h11m-11 3h8" stroke="#AEA184"/><path d="M27 49h11" stroke="#795539"/></g>
  <path d="M15 47h7v2h-7zM41 47h6v2h-6z" fill="#F5ECD5" stroke="none"/>`;

export const studentArt = hatPlayerArt;

export const guardArt = guardPixelArt;

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

export const itemArt = {
  'extra-moves': '<path d="M21 13h22v3h7v7h4v22h-4v7h-7v3H21v-3h-7v-7h-4V23h4v-7h7z" fill="#A77A50"/><path d="M22 16h20v3h6v6h3v18h-3v6h-6v3H22v-3h-6v-6h-3V25h3v-6h6z" fill="#F5ECD5"/><path d="M18 26v16m29-15v14M24 20h16m-15 28h14" stroke="#C3B58F"/><path d="M32 23v12h9" fill="none"/><path d="M19 8h8v4h-8zM38 8h8v4h-8z" fill="#795539"/><path d="M29 7h7v5h-7z" fill="#AEA184"/><path d="M31 17h2v3h-2zM16 33h3v2h-3zM45 33h3v2h-3zM31 47h2v3h-2z" fill="#4E5E43" stroke="none"/>',
  'door-key': '<path d="M13 5h13v3h5v5h3v12h-3v4h-4v4H14v-3H9v-5H6V13h3V8h4z" fill="#A77A50"/><path d="M15 9h10v3h4v12h-4v4H15v-3h-4V13h4z" fill="#C3B58F"/><path d="M16 13h8v9h-8z" fill="#795539"/><path d="M17 14h6v7h-6z" fill="#F5ECD5"/><path d="M29 27h5v5h5v5h5v5h5v5h9v10H48v-6h-5v-5h-5v-5h-5v-5h-5z" fill="#A77A50"/><path d="M31 29v3h5v5h5v5h5v5h5" fill="none" stroke="#D8CBA5"/><path d="M49 51h3v3h-3z" fill="#795539" stroke="none"/>',
  'guard-schedule': '<path d="M12 9h40v47H12z" fill="#795539"/><path d="M15 12h34v41H15z" fill="#F5ECD5"/><path d="M15 12h34v11H15z" fill="#4E5E43"/><path d="M21 7h3v9h-3zM31 7h3v9h-3zM41 7h3v9h-3z" fill="#AEA184"/><path d="M19 28h26m-26 9h26m-26 9h26M27 25v26m10-26v26" stroke="#C3B58F"/><path d="M21 30h3v4h-3zM30 39h3v4h-3zM40 30h3v4h-3z" fill="#4E5E43" stroke="none"/>',
  'campus-map': '<path d="M7 12h15l20 6 15-6v42l-15 6-20-6-15 6z" fill="#D8CBA5"/><path d="M22 12v42m20-36v42" stroke="#795539"/><path d="M10 17h8v7h-8zM27 25h10v9H27zM47 20h6v11h-6zM11 40h6v13h-6zM28 46h9v7h-9z" fill="#AEA184" stroke="none"/><path d="M16 30h11v10h20v9m-30-19v5" fill="none" stroke="#4E5E43" stroke-width="2"/><path d="M44 47h6v6h-6z" fill="#A77A50"/>',
  'thermos': '<path d="M23 6h18v4h3v6h2v39H18V16h2v-6h3z" fill="#4E5E43"/><path d="M23 6h18v4H23zM21 11h22v6H21z" fill="#AEA184"/><path d="M21 18h22v3H21z" fill="#795539"/><path d="M23 26h18v19H23z" fill="#F5ECD5"/><path d="M25 28h14v15H25z" fill="#D8CBA5" stroke="none"/><path d="M29 32h6v7h-6zM35 33h3v4h-3" fill="none" stroke="#4E5E43"/><path d="M20 24v28m3 1h19" stroke="#73805A"/>',
  'spare-sheet': projectArt[1],
  'backpack-ochre': '<path d="M23 15V8h18v7M19 16h26v3h5v7h3v27h-5v4H16v-4h-5V26h3v-7h5z" fill="#A77A50"/><path d="M22 12h20v5H22z" fill="#C3B58F"/><path d="M17 22h30v25H17z" fill="#D8CBA5"/><path d="M20 34h24v18H20z" fill="#A77A50"/><path d="M22 38h20m-18 2h3v4h-3zM20 25h24" fill="none" stroke="#795539"/><path d="M13 29h4v18h-4zM47 29h4v18h-4z" fill="#795539"/><path d="M22 49h18" stroke="#F5ECD5"/>',
  'jacket-terracotta': '<path d="M23 10h7v4h5v-4h7v5h7v8h5v27h-9V30h-3v26H23V30h-3v20h-9V23h5v-8h7z" fill="#A77A50"/><path d="M24 11h5v5h6v-5h6v12h-7v32h-3V23h-7z" fill="#D8CBA5"/><path d="M25 33h4v8h-4zM36 33h4v8h-4z" fill="#795539"/><path d="M14 27v18m34-18v18M25 53h15" stroke="#C3B58F"/>',
};
itemArt['backpack-olive'] = itemArt['backpack-ochre'].replaceAll('#A77A50', '#73805A');
itemArt['jacket-stone'] = itemArt['jacket-terracotta'].replaceAll('#A77A50', '#AEA184');
itemArt['cap-ochre'] = '<path d="M25 15h4v-3h10v3h4v4h3v10h4v4h4v5H10v-5h4v-4h4V19h3v-4z" fill="#3C3429"/><path d="M26 17h4v-3h8v3h4v4h3v9H19v-9h3v-4z" fill="#A57B32" stroke="none"/><path d="M19 27h26v5H19z" fill="#795539" stroke="none"/><path d="M14 33h36v2h4v3H10v-3h4z" fill="#D9AA43" stroke="none"/><path d="M23 19h18m-20 6h22" stroke="#F5ECD5"/>';
itemArt['glasses-scholar'] = '<path d="M8 22h21v24H8zM35 22h21v24H35z" fill="#795539"/><path d="M11 25h15v18H11zM38 25h15v18H38z" fill="#F5ECD5"/><path d="M29 28h6M4 27h4m48 0h4" stroke="#3C3429" stroke-width="2"/>';

export const navArt = {
  market: `<path d="M7 58h50v2H7z" fill="#3C3429" opacity=".24" stroke="none"/>
    <path d="M9 29h46v28H9z" fill="#3C3429"/><path d="M11 30h42v25H11z" fill="#D8CBA5"/><path d="M12 31h40v2H12z" fill="#F5ECD5" stroke="none"/>
    <path d="M17 6h30v2h3v11H14V8h3z" fill="#795539"/><path d="M17 8h30v8H17z" fill="#4E5E43"/><path d="M19 9h26v1H19z" fill="#73805A" stroke="none"/>
    <path d="M27 10h10v1h2v4h-2v1H27v-1h-2v-4h2z" fill="#D9AA43"/><path d="M29 11h6v4h-6z" fill="#F5ECD5" stroke="none"/><path d="M31 10h2v6h-2z" fill="#A77A50" stroke="none"/>
    <path d="M6 18h52v3H6z" fill="#795539"/><path d="M8 21h48v10H8z" fill="#3C3429"/>
    <path d="M9 22h7v7H9zM25 22h7v7h-7zM41 22h7v7h-7z" fill="#F5ECD5"/><path d="M17 22h7v7h-7zM33 22h7v7h-7zM49 22h6v7h-6z" fill="#73805A"/>
    <path d="M9 29h7v2H9zM25 29h7v2h-7zM41 29h7v2h-7z" fill="#C3B58F"/><path d="M17 29h7v2h-7zM33 29h7v2h-7zM49 29h6v2h-6z" fill="#4E5E43"/>
    <path d="M14 34h23v18H14z" fill="#795539"/><path d="M16 36h19v13H16z" fill="#4E5E43"/><path d="M17 37h17v2H17z" fill="#73805A" stroke="none"/>
    <path d="M19 43h5v5h-5zM27 42h5v6h-5z" fill="#A77A50"/><path d="M20 40h3v3h-3zM28 39h3v3h-3z" fill="#F5ECD5" stroke="none"/>
    <path d="M18 46h16v2H18z" fill="#D9AA43" stroke="none"/><path d="M16 49h19v3H16z" fill="#C3B58F"/><path d="M17 50h17" stroke="#F5ECD5"/>
    <path d="M40 34h11v22H40z" fill="#3C3429"/><path d="M42 36h7v18h-7z" fill="#73805A"/><path d="M43 37h5v8h-5z" fill="#D8CBA5"/><path d="M44 38h3v6h-3z" fill="#F5ECD5" stroke="none"/><path d="M47 48h2v2h-2z" fill="#D9AA43" stroke="none"/>
    <path d="M11 54h27m2 0h12M13 34v19m24-19v19" stroke="#F5ECD5"/><path d="M7 17h50" stroke="#F5ECD5"/>`,
  gift: '<path d="M7 18h50v34H7z" fill="#795539"/><path d="M9 20h46v30H9z" fill="#E5D2AA"/><path d="M12 23h40v24H12z" fill="none" stroke="#B69A72"/><path d="M9 20h46L32 39z" fill="#C7AE85"/><path d="M10 21h44L32 36z" fill="#F0E0BC"/><path d="M9 50l18-14m28 14L37 36" stroke="#A98B63"/><path d="M10 49h44m-42-2h40" stroke="#F5ECD5"/><path d="M27 33h10v9H27z" fill="#3C3429"/><path d="M28 34h8v7h-8z" fill="#557244"/><path d="M32 35l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#F5ECD5" stroke="none"/><path d="M46 23h6v5h-6z" fill="#F5ECD5"/><path d="M47 24h4v3h-4z" fill="#D9AA43" stroke="none"/>',
  levels: `<path d="M5 58h54v2H5z" fill="#3C3429" opacity=".24" stroke="none"/>
    <path d="M6 44h18v13H6zM22 31h18v26H22zM38 17h20v40H38z" fill="#3C3429"/>
    <path d="M8 47h14v8H8zM24 34h14v21H24zM40 20h16v35H40z" fill="#D8CBA5"/>
    <path d="M8 47h3v8H8zM24 34h3v21h-3zM40 20h3v35h-3z" fill="#F5ECD5" stroke="none"/>
    <path d="M19 47h3v8h-3zM35 34h3v21h-3zM53 20h3v35h-3z" fill="#A77A50" stroke="none"/>
    <path d="M5 42h20v5H5zM21 29h20v5H21zM37 15h22v5H37z" fill="#795539"/>
    <path d="M7 43h16v2H7zM23 30h16v2H23zM39 16h18v2H39z" fill="#F5ECD5" stroke="none"/>
    <path d="M7 46h16m0-13h16m0-14h18" stroke="#D9AA43"/>
    <path d="M12 49h5v4h-5zM28 37h6v4h-6zM45 23h7v5h-7z" fill="#4E5E43"/>
    <path d="M14 50h1v2h-1zM29 38h1v2h-1zM32 38h1v2h-1zM46 24h1v3h-1zM49 24h1v3h-1z" fill="#D9AA43" stroke="none"/>
    <path d="M10 55h10m7 0h10m6 0h11M25 43h13M41 34h15" stroke="#A77A50"/>
    <path d="M46 5h2v10h-2z" fill="#3C3429"/><path d="M48 5h10v8H48z" fill="#4E5E43"/><path d="M49 6h8v1h-8z" fill="#73805A" stroke="none"/>
    <path d="M52 7h2v2h2v2h-2v2h-2v-2h-2V9h2z" fill="#D9AA43" stroke="none"/>
    <path d="M11 38h3v2h-3zM27 25h3v2h-3z" fill="#D9AA43" stroke="none"/>`,
  inventory: `<path d="M10 58h44v2H10z" fill="#3C3429" opacity=".24" stroke="none"/>
    <path d="M23 17V9h18v8M19 22V10h5v12m21 0V10h5v12" fill="none" stroke="#795539" stroke-width="3"/>
    <path d="M26 11h12v5H26z" fill="#D8CBA5"/><path d="M27 12h10v2H27z" fill="#F5ECD5" stroke="none"/>
    <path d="M40 9h7v15h-7z" fill="#795539"/><path d="M41 10h5v13h-5z" fill="#F5ECD5"/><path d="M42 12h3m-3 3h3m-3 3h3" stroke="#C3B58F"/>
    <path d="M16 19h30v3h5v6h3v25h-4v4H14v-4h-4V28h3v-6h3z" fill="#3C3429"/>
    <path d="M18 21h26v3h5v6h2v23h-3v2H16v-2h-3V30h2v-6h3z" fill="#A77A50"/>
    <path d="M18 22h27v6H18z" fill="#D8CBA5"/><path d="M20 23h23v2H20z" fill="#F5ECD5" stroke="none"/>
    <path d="M17 29h30v8H17z" fill="#795539"/><path d="M19 30h26v5H19z" fill="#C3B58F"/><path d="M20 31h24v1H20z" fill="#F5ECD5" stroke="none"/>
    <path d="M11 34h7v18h-7zM46 34h7v18h-7z" fill="#795539"/><path d="M13 36h4v14h-4zM47 36h4v14h-4z" fill="#73805A"/>
    <path d="M13 39h4m30 0h4M13 47h4m30 0h4" stroke="#D8CBA5"/>
    <path d="M20 38h24v16H20z" fill="#795539"/><path d="M22 40h20v12H22z" fill="#4E5E43"/><path d="M24 41h16v2H24z" fill="#73805A" stroke="none"/>
    <path d="M26 44h12v7H26z" fill="#D9AA43"/><path d="M28 45h8v5h-8z" fill="#F5ECD5" stroke="none"/><path d="M31 45h2v5h-2zM29 47h6v2h-6z" fill="#4E5E43" stroke="none"/>
    <path d="M20 29h5v11h-5zM39 29h5v11h-5z" fill="#795539"/><path d="M21 31h3v7h-3zM40 31h3v7h-3z" fill="#F5ECD5" stroke="none"/>
    <path d="M21 35h3m16 0h3M19 22h25M17 53h30" stroke="#F5ECD5"/><path d="M18 41h2m24 0h2" stroke="#D9AA43" stroke-width="2"/>`,
  character: studentArt,
  settings: '<path d="M26 4h12v6h7V7h6v6h-4v6h4v7h8v12h-8v7h-4v6h4v6h-6v-3h-7v6H26v-6h-7v3h-6v-6h4v-6h-4v-7H5V26h8v-7h4v-6h-4V7h6v3h7z" fill="#474D4B"/><path d="M28 8h8v7h10v-4h2v3h-4v7h6v8h5v6h-5v8h-6v7h4v3h-2v-4H36v7h-8v-7H18v4h-2v-3h4v-7h-6v-8H9v-6h5v-8h6v-7h-4v-3h2v4h10z" fill="#A8ADA9"/><path d="M28 8h8v6h-8zM16 20h5v-5h5v-2h-6v7h-4zM11 28h5v7h-5zM20 42h5v5h-5z" fill="#D8DDD8" stroke="none"/><path d="M27 25h10v3h3v10h-3v3H27v-3h-3V28h3z" fill="#474D4B"/><path d="M28 29h8v8h-8z" fill="#D8DDD8" stroke="none"/>',
  memo: projectArt[1],
};
