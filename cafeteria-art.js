// Cafeteria scenery is visual only. Every piece stays inside its original 64×64 tile.
const floor = '<path d="M0 0h64v64H0z" fill="#EADDBE" stroke="none"/><path d="M0 32h64M32 0v64" stroke="#D1BF99" opacity=".55"/>';
const shadow = '<path d="M7 54h50v5H7z" fill="#7D6849" opacity=".22" stroke="none"/>';

const diningTable = `${floor}${shadow}
  <path d="M13 8h14v10H13zM37 8h14v10H37zM13 46h14v10H13zM37 46h14v10H37z" fill="#476D35"/>
  <path d="M15 10h10v6H15zM39 10h10v6H39zM15 48h10v6H15zM39 48h10v6H39z" fill="#779152" stroke="none"/>
  <path d="M7 17h50v30H7z" fill="#795539"/>
  <path d="M10 19h44v24H10z" fill="#B58757" stroke="none"/>
  <path d="M11 21h42v2H11zM11 40h42v2H11z" fill="#E9C993" stroke="none"/>
  <path d="M18 25h10v2h2v10h-2v2H18v-2h-2V27h2zM38 25h10v2h2v10h-2v2H38v-2h-2V27h2z" fill="#F5ECD5"/>
  <path d="M20 28h6v7h-6zM40 28h6v7h-6z" fill="#D9AA43" stroke="none"/>
  <path d="M13 27h2v9h-2zM32 27h2v9h-2zM52 27h2v9h-2z" fill="#F5ECD5" stroke="none"/>`;

const servingCounter = `${floor}${shadow}
  <path d="M5 11h54v43H5z" fill="#476D35"/>
  <path d="M8 14h48v19H8z" fill="#F5ECD5" stroke="none"/>
  <path d="M10 17h18v13H10zM35 17h18v13H35z" fill="#D8CBA5"/>
  <path d="M12 20h14v7H12zM37 20h14v7H37z" fill="#A77A50"/>
  <path d="M15 18h7v4h-7zM39 18h8v4h-8z" fill="#D9AA43" stroke="none"/>
  <path d="M4 32h56v6H4z" fill="#795539"/>
  <path d="M6 39h52v13H6z" fill="#557438" stroke="none"/>
  <path d="M9 42h46M12 49h40" stroke="#D8CBA5"/>
  <path d="M12 53h5v5h-5zM47 53h5v5h-5z" fill="#795539" stroke="none"/>`;

const teaCart = `${floor}${shadow}
  <path d="M12 19h40v5H12zM10 42h44v6H10z" fill="#795539"/>
  <path d="M14 24h36v18H14z" fill="#557438"/>
  <path d="M17 27h30v11H17z" fill="#F5ECD5" stroke="none"/>
  <path d="M19 29h10v7H19zM34 29h10v7H34z" fill="#C3B58F"/>
  <path d="M21 31h6v4h-6zM36 31h6v4h-6z" fill="#A77A50" stroke="none"/>
  <path d="M20 8h24v11H20z" fill="#AEA184"/>
  <path d="M22 10h20v7H22z" fill="#D9AA43" stroke="none"/>
  <path d="M15 48h4v8h-4zM45 48h4v8h-4z" fill="#795539"/>
  <path d="M14 55h7m22 0h7" stroke="#3C3429" stroke-width="2"/>`;

const pottedTree = `${floor}${shadow}
  <path d="M13 44h38v5h-3v8H16v-8h-3z" fill="#A77A50"/>
  <path d="M16 46h32v3H16zM19 53h26" stroke="#F5ECD5"/>
  <path d="M30 22h5v23h-5z" fill="#795539"/>
  <path d="M21 10h8V6h13v5h7v8h5v12h-5v6h-9v4H24v-4h-8v-7h-5V18h5v-5h5z" fill="#315028"/>
  <path d="M22 13h8V9h11v5h7v7h4v8h-6v6h-8v4H26v-5h-8v-7h-5v-7h5v-5h4z" fill="#557438" stroke="none"/>
  <path d="M19 18h8v-5h9m6 6h7M22 30h9m9-4h8" stroke="#8DA75F"/>`;

const fixtures = [diningTable, diningTable, servingCounter, teaCart, pottedTree];

function wallArt(x, y, size, hash) {
  if (y === 0 || y === size - 1) {
    const top = y === 0;
    const panel = `<path d="M0 0h64v64H0z" fill="#D8CBA5" stroke="none"/><path d="M0 ${top ? 49 : 10}h64v5H0z" fill="#795539" stroke="none"/><path d="M0 ${top ? 54 : 15}h64v3H0z" fill="#557438" stroke="none"/>`;
    if (x === 0 || x === size - 1) return panel + '<path d="M0 0h8v64H0zM56 0h8v64h-8z" fill="#A77A50" stroke="none"/>';
    if (top && x === Math.floor(size / 2)) return panel + '<path d="M5 14h54v27H5z" fill="#476D35"/><path d="M8 17h48v21H8z" fill="#F5ECD5" stroke="none"/><text x="32" y="30" text-anchor="middle" font-size="6" fill="#3C3429" stroke="none">СТОЛОВАЯ</text><path d="M18 34h28" stroke="#A77A50"/>';
    return panel + (top
      ? '<path d="M8 11h48v32H8z" fill="#795539"/><path d="M11 14h42v25H11z" fill="#C3B58F" stroke="none"/><path d="M32 14v25m-21-12h42" stroke="#F5ECD5"/><path d="M12 40h41" stroke="#557438"/>'
      : '<path d="M9 25h46v22H9z" fill="#476D35"/><path d="M12 28h40v15H12z" fill="#F5ECD5" stroke="none"/><path d="M17 35h30M22 32v7m20-7v7" stroke="#C3B58F"/>');
  }
  if (x === 0 || x === size - 1) return '<path d="M0 0h64v64H0z" fill="#D8CBA5" stroke="none"/><path d="M7 0h5v64H7zM52 0h5v64h-5z" fill="#A77A50" stroke="none"/><path d="M15 7h34v50H15z" fill="#795539"/><path d="M18 10h28v44H18z" fill="#F5ECD5" stroke="none"/><path d="M21 13h22v38H21z" fill="#C3B58F" stroke="none"/><path d="M32 13v38m-11-19h22" stroke="#F5ECD5"/>';
  return fixtures[hash % fixtures.length];
}

export const cafeteriaBuffetArt = `${shadow}
  <path d="M8 18h48v40H8z" fill="#476D35"/>
  <path d="M11 21h42v18H11z" fill="#F5ECD5" stroke="none"/>
  <path d="M13 24h17v12H13zM34 24h17v12H34z" fill="#C3B58F"/>
  <path d="M16 28h10v5H16zM37 28h10v5H37z" fill="#D9AA43" stroke="none"/>
  <path d="M7 39h50v5H7z" fill="#795539"/>
  <path d="M12 45h40v10H12z" fill="#557438" stroke="none"/>
  <path class="library-book" d="M27 7h10v8H27z" fill="#F5ECD5"/>
  <path d="M28 8h8v4h-8z" fill="#A77A50" stroke="none"/>`;

const entranceMat = '<path d="M10 43h44v15H10z" fill="#795539" opacity=".22" stroke="none"/><path d="M14 46h36v9H14z" fill="#557438" stroke="none"/><path d="M18 50h28" stroke="#D8CBA5"/>';
const floorMotif = '<path d="M25 29h14v2h3v3h-3v2H25v-2h-3v-3h3z" fill="#D1BF99" opacity=".6" stroke="none"/><path d="M28 32h8" stroke="#F5ECD5" opacity=".65"/>';

export function cafeteriaTileArt(tile, x, y, { campus, seed, level, coins }) {
  const size = campus.length;
  let hash = ((seed >>> 0) ^ Math.imul(level, 0x9e3779b1) ^ Math.imul(x + 1, 0x85ebca6b) ^ Math.imul(y + 1, 0xc2b2ae35)) >>> 0;
  hash = Math.imul(hash ^ hash >>> 16, 0x7feb352d);
  hash = Math.imul(hash ^ hash >>> 15, 0x846ca68b);
  hash = (hash ^ hash >>> 16) >>> 0;
  if (tile === '#') return wallArt(x, y, size, hash);
  if (tile === 'D') return entranceMat;
  if (tile === '.' && hash % 9 === 0 && !coins.some(coin => coin.x === x && coin.y === y)) return floorMotif;
  return '';
}
