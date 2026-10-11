// Cafeteria scenery is visual only. Every piece stays inside its original 64×64 tile.
const floor = '<path d="M0 0h64v64H0z" fill="#D6C29B" stroke="none"/><path d="M0 32h64M32 0v64" stroke="#AE956C" opacity=".65"/>';
const shadow = '<path d="M6 52h52v7H6z" fill="#574833" opacity=".32" stroke="none"/>';

const tableFurniture = `
  <path d="M13 8h14v10H13zM37 8h14v10H37zM13 46h14v10H13zM37 46h14v10H37z" fill="#476D35"/>
  <path d="M15 10h10v6H15zM39 10h10v6H39zM15 48h10v6H15zM39 48h10v6H39z" fill="#779152" stroke="none"/>
  <path d="M6 16h52v32H6z" fill="#5B3E29"/>
  <path d="M9 19h46v25H9z" fill="#94643D" stroke="none"/>
  <path d="M11 21h42v2H11zM11 40h42v2H11z" fill="#E9C993" stroke="none"/>
  <path d="M18 25h10v2h2v10h-2v2H18v-2h-2V27h2zM38 25h10v2h2v10h-2v2H38v-2h-2V27h2z" fill="#F5ECD5"/>
  <path d="M20 28h6v7h-6zM40 28h6v7h-6z" fill="#D9AA43" stroke="none"/>
  <path d="M13 27h2v9h-2zM32 27h2v9h-2zM52 27h2v9h-2z" fill="#F5ECD5" stroke="none"/>`;
const diningTable = (hash, vertical) => `${floor}${shadow}<g${vertical ? ' transform="rotate(90 32 32)"' : ''}>${tableFurniture}${hash & 1 ? '<path d="M28 28h8v8h-8z" fill="#F5ECD5" stroke="none"/><path d="M30 30h4v4h-4z" fill="#A77A50" stroke="none"/>' : ''}</g>`;

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

const coffeeMachine = `${floor}${shadow}
  <path d="M14 7h36v46H14z" fill="#3C3429"/>
  <path d="M17 10h30v38H17z" fill="#476D35" stroke="none"/>
  <path d="M20 13h24v14H20z" fill="#795539"/>
  <path d="M23 16h18v8H23z" fill="#D9AA43" stroke="none"/>
  <path d="M21 30h22v15H21z" fill="#25251E" stroke="none"/>
  <path d="M29 32h10v9H29z" fill="#F5ECD5"/>
  <path d="M39 34h4v5h-4" fill="none" stroke="#F5ECD5"/>
  <path d="M31 27v5m4-5v5" stroke="#C3B58F"/>
  <path d="M17 49h30v4H17z" fill="#A77A50" stroke="none"/>
  <path d="M22 54h5v4h-5zM38 54h5v4h-5z" fill="#3C3429" stroke="none"/>`;

const drinksFridge = `${floor}${shadow}
  <path d="M14 5h36v52H14z" fill="#3C3429"/>
  <path d="M17 8h30v45H17z" fill="#557438" stroke="none"/>
  <path d="M20 11h24v35H20z" fill="#B9C9B2"/>
  <path d="M22 13h20v30H22z" fill="#E5DBC0" stroke="none"/>
  <path d="M20 25h24m-24 10h24" stroke="#795539" stroke-width="2"/>
  <path d="M24 17h3v7h-3zM30 15h3v9h-3zM37 17h3v7h-3z" fill="#A77A50" stroke="none"/>
  <path d="M24 28h4v6h-4zM31 29h4v5h-4zM38 27h3v7h-3z" fill="#D9AA43" stroke="none"/>
  <path d="M22 12v32M42 12v32" stroke="#F5ECD5" opacity=".7"/>
  <path d="M45 27h2v11h-2z" fill="#F5ECD5" stroke="none"/>`;

const plantBody = `
  <path d="M12 44h40v5h-3v9H15v-9h-3z" fill="#A77A50"/>
  <path d="M15 46h34v3H15zM18 54h28" stroke="#F5ECD5"/>
  <path d="M30 21h5v24h-5z" fill="#795539"/>
  <path d="M16 9h9V5h16v4h8v5h6v5h4v12h-5v7h-9v5H19v-5h-9v-7H5V19h5v-5h6z" fill="#315028"/>
  <path d="M17 12h9V8h15v5h8v5h7v12h-6v7h-8v4H22v-5h-9v-7H8v-9h5v-5h4z" fill="#557438" stroke="none"/>
  <path d="M15 17h10v-5h12m7 7h9M17 30h12m12-4h10" stroke="#8DA75F"/>`;

const menuBoard = '<path d="M6 7h52v43H6z" fill="#795539"/><path d="M9 10h46v37H9z" fill="#476D35" stroke="none"/><text x="32" y="21" text-anchor="middle" font-size="9" fill="#F5ECD5" stroke="none">МЕНЮ</text><path d="M16 27h32M16 34h21M16 41h27" stroke="#F5ECD5"/><path d="M44 32h4v4h-4zM47 39h3v3h-3z" fill="#D9AA43" stroke="none"/>';
const entranceSign = '<path d="M2 6h124v43H2z" fill="#795539"/><path d="M5 9h118v37H5z" fill="#476D35" stroke="none"/><path d="M8 12h112v31H8z" fill="#F5ECD5" stroke="none"/><text x="64" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#3C3429" stroke="none">СТОЛОВАЯ</text><path d="M43 35h42" stroke="#A77A50"/><path d="M20 34v8m4-8v8m4-8v8m72-8v8m4-8v8m4-8v8" stroke="#795539"/>';
const topWindow = '<path d="M8 10h48v35H8z" fill="#795539"/><path d="M11 13h42v29H11z" fill="#D5B982" stroke="none"/><path d="M14 16h36v23H14z" fill="#E7D3A0" stroke="none"/><path d="M32 13v29M11 27h42" stroke="#795539" stroke-width="2"/><path d="M16 18h10m-10 3h7m14 11h11" stroke="#F5ECD5" opacity=".75"/><path d="M11 42h42v3H11z" fill="#557438" stroke="none"/>';
const sideWindow = '<path d="M0 0h64v64H0z" fill="#D8CBA5" stroke="none"/><path d="M7 0h5v64H7zM52 0h5v64h-5z" fill="#A77A50" stroke="none"/><path d="M15 7h34v50H15z" fill="#795539"/><path d="M18 10h28v44H18z" fill="#D5B982" stroke="none"/><path d="M21 13h22v38H21z" fill="#E7D3A0" stroke="none"/><path d="M32 13v38m-11-19h22" stroke="#795539" stroke-width="2"/><path d="M23 15h6m-6 3h4m8 22h6" stroke="#F5ECD5" opacity=".75"/>';

function wallArt(x, y, size, hash, campus) {
  if (y === 0 || y === size - 1) {
    const top = y === 0;
    const panel = `<path d="M0 0h64v64H0z" fill="#D8CBA5" stroke="none"/><path d="M0 ${top ? 49 : 10}h64v5H0z" fill="#795539" stroke="none"/><path d="M0 ${top ? 54 : 15}h64v3H0z" fill="#557438" stroke="none"/>`;
    if (x === 0 || x === size - 1) return panel + '<path d="M0 0h8v64H0zM56 0h8v64h-8z" fill="#A77A50" stroke="none"/>';
    if (top && x === Math.floor(size / 2) - 1) return panel + entranceSign;
    if (top && x === Math.floor(size / 2)) return panel + `<g transform="translate(-64 0)">${entranceSign}</g>`;
    if (top && x === Math.floor(size / 2) - 2) return panel + menuBoard;
    return panel + (top
      ? topWindow
      : '<path d="M9 22h46v27H9z" fill="#476D35"/><path d="M12 25h40v21H12z" fill="#F5ECD5" stroke="none"/><path d="M16 30h32M16 37h32M22 29v15m20-15v15" stroke="#C3B58F"/><path d="M19 31h6v5h-6zM37 38h7v5h-7z" fill="#D9AA43" stroke="none"/>');
  }
  if (x === 0 || x === size - 1) return y === size - 2 ? sideWindow + plantBody : sideWindow;
  const internalWall = (xx, yy) => xx > 0 && yy > 0 && xx < size - 1 && yy < size - 1 && campus[yy][xx] === '#';
  const horizontalPair = internalWall(x - 1, y) || internalWall(x + 1, y);
  const verticalPair = internalWall(x, y - 1) || internalWall(x, y + 1);
  if (horizontalPair || verticalPair) return diningTable(hash, verticalPair && !horizontalPair);
  return [servingCounter, teaCart, coffeeMachine, drinksFridge][hash % 4];
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
const floorMotif = '<path d="M26 27h12v3h3v8h-3v3H26v-3h-3v-8h3z" fill="#C7AF83" opacity=".7" stroke="none"/><path d="M28 30h8v8h-8z" fill="#F5ECD5" opacity=".65" stroke="none"/><path d="M30 32h4v4h-4z" fill="#D9AA43" opacity=".75" stroke="none"/>';

export function cafeteriaTileArt(tile, x, y, { campus, seed, level, coins }) {
  const size = campus.length;
  let hash = ((seed >>> 0) ^ Math.imul(level, 0x9e3779b1) ^ Math.imul(x + 1, 0x85ebca6b) ^ Math.imul(y + 1, 0xc2b2ae35)) >>> 0;
  hash = Math.imul(hash ^ hash >>> 16, 0x7feb352d);
  hash = Math.imul(hash ^ hash >>> 15, 0x846ca68b);
  hash = (hash ^ hash >>> 16) >>> 0;
  if (tile === '#') return wallArt(x, y, size, hash, campus);
  if (tile === 'D') return entranceMat;
  if (tile === '.' && hash % 6 === 0 && !coins.some(coin => coin.x === x && coin.y === y)) return floorMotif;
  return '';
}
