// Visual-only campus props; placement and the obstacle grid are unchanged.
import { plantArt, decorativeBookshelfArt, vendingArt, groundShadow } from './campus-art.js';
const shadow = groundShadow;
export const bicycleArt = `${shadow}
    <path d="M9 37h12v2h3v3h2v10h-2v3h-3v2H9v-2H6v-3H4V42h2v-3h3zM42 37h12v2h3v3h2v10h-2v3h-3v2H42v-2h-3v-3h-2V42h2v-3h3z" fill="#795539"/>
    <path d="M10 40h10v2h3v10h-3v2H10v-2H7V42h3zM43 40h10v2h3v10h-3v2H43v-2h-3V42h3z" fill="#D8CBA5"/>
    <path d="M15 40v14m-8-7h16m25-7v14m-8-7h16" stroke="#AEA184"/>
    <path d="M15 47h16v-3h2v-5h3v-6h2v-5h7M15 47v-4h3v-5h3v-5h13M23 33v5h3v5h3v4m9-19v6h3v6h4v7h3" fill="none" stroke="#4E5E43" stroke-width="2"/>
    <path d="M19 29h10v3H19zM39 25h9v3h-9z" fill="#795539"/>
    <path d="M29 47h5v3h4m-5-1v-5h-4" fill="none"/>`;
export const wallProps = Object.freeze({
  plant: plantArt,
  lockers: `${shadow}
    <path d="M10 7h44v50H10z" fill="#AEA184"/><path d="M10 7h44v4H10z" fill="#D8CBA5"/>
    <path d="M13 13h11v41H13zM26 13h11v41H26zM39 13h12v41H39z" fill="#C3B58F"/>
    <path d="M15 16h7m-7 3h7m-7 3h7m6-6h7m-7 3h7m-7 3h7m6-6h8m-8 3h8m-8 3h8" stroke="#795539"/>
    <path d="M21 32h2v7h-2zM34 32h2v7h-2zM47 32h2v7h-2z" fill="#795539"/>
    <path d="M14 25h9v4h-9zM27 25h9v4h-9zM40 25h10v4H40z" fill="#F5ECD5" stroke="none"/>
    <path d="M14 14v38m13-38v38m13-38v38" stroke="#F5ECD5"/>
    <path d="M12 57v2h4v-2m32 0v2h4v-2" fill="#3C3429"/>`,
  bench: `${shadow}
    <path d="M9 23h46v17H9z" fill="#795539"/><path d="M10 24h44v6H10zM10 32h44v6H10z" fill="#A77A50"/>
    <path d="M11 25h41m-41 8h41" stroke="#D8CBA5"/>
    <path d="M12 28h2m6 0h14m7 0h7m-32 8h9m13 0h11" stroke="#795539"/>
    <path d="M8 42h48v6H8z" fill="#A77A50"/><path d="M9 42h46v2H9z" fill="#C3B58F"/>
    <path d="M12 39h3v3h-3zM49 39h3v3h-3zM12 48h4v10h-4zM48 48h4v10h-4z" fill="#795539"/>
    <path d="M15 51h33" stroke="#3C3429"/>`,
  books: decorativeBookshelfArt,
  cooler: `${shadow}
    <path d="M20 20h26v37H20z" fill="#C3B58F"/><path d="M20 20h26v5H20z" fill="#F5ECD5"/>
    <path d="M24 5h18v3h2v9h-2v4H24v-4h-2V8h2z" fill="#AEA184"/>
    <path d="M24 10h17v7H24z" fill="#D8CBA5" stroke="none"/><path d="M25 7h13m-14 2v6m2 3h13" stroke="#F5ECD5"/>
    <path d="M24 28h18v17H24z" fill="#795539"/><path d="M26 30h14v11H26z" fill="#3C3429"/>
    <path d="M27 28h4v4h-4z" fill="#4E5E43"/><path d="M35 28h4v4h-4z" fill="#A77A50"/>
    <path d="M30 36h6v8h-6z" fill="#F5ECD5"/><path d="M26 45h14v3H26z" fill="#AEA184"/>
    <path d="M23 52h19m-19 2h19M21 26v24" stroke="#F5ECD5"/>`,
  timetable: `${shadow}
    <path d="M7 9h50v44H7z" fill="#795539"/><path d="M9 11h46v40H9z" fill="#A77A50"/>
    <path d="M12 14h40v34H12z" fill="#F5ECD5"/><path d="M12 14h40v9H12z" fill="#4E5E43"/>
    <text x="32" y="20" text-anchor="middle" font-size="5" fill="#F5ECD5" stroke="none">РАСПИСАНИЕ</text>
    <path d="M15 27h34m-34 6h34m-34 6h34m-34 6h34M23 25v22m12-22v22" stroke="#C3B58F"/>
    <path d="M16 30h4m6 0h6m6 0h8M16 36h4m6 0h6m6 0h8M16 42h4m6 0h6m6 0h8" stroke="#4E5E43"/>
    <path d="M8 10h47M8 10v41" stroke="#D8CBA5"/>`,
  bicycle: bicycleArt,
  coffeeMachine: vendingArt,
});
// Surface details sit over the existing silhouettes; every SVG remains in its 64px cell.
export const wallDetails = Object.freeze({
  plant: `<path d="M27 44h12v2H27zM29 52h7v1h-7z" fill="#D8CBA5" stroke="none"/>
    <path d="M14 18h5v2h-5zM19 11h5v2h-5zM40 11h7v2h-7zM49 21h5v2h-5zM13 29h4v2h-4zM45 29h4v2h-4z" fill="#A2AA75" stroke="none"/>
    <path d="M25 28h2v6h-2zM38 28h2v6h-2zM31 25h2v13h-2z" fill="#324839" stroke="none"/>
    <path d="M29 47h2v2h-2zM35 48h2v1h-2z" fill="#4A3228" stroke="none"/>`,
  lockers: `<path d="M14 14h1v38h-1zM27 14h1v38h-1zM40 14h1v38h-1z" fill="#F5ECD5" stroke="none"/>
    <path d="M16 17h5v1h-5zM29 17h5v1h-5zM42 17h6v1h-6zM16 22h5v1h-5zM29 22h5v1h-5zM42 22h6v1h-6z" fill="#635640" stroke="none"/>
    <path d="M16 26h6v2h-6zM29 26h6v2h-6zM42 26h7v2h-7z" fill="#E9DCC0" stroke="none"/>
    <path d="M19 34h2v2h-2zM32 34h2v2h-2zM45 34h2v2h-2z" fill="#D9AA43" stroke="none"/>
    <path d="M16 48h6m7 0h6m7 0h7" fill="none" stroke="#8B795E"/>`,
  bench: `<path d="M16 26h8m5 0h10m5 0h6M15 34h13m5 0h15M17 44h12m6 0h12" fill="none" stroke="#E0BE8B"/>
    <path d="M11 30h42v2H11zM11 38h42v2H11z" fill="#4C3528" stroke="none"/>
    <path d="M13 25h2v2h-2zM49 25h2v2h-2zM13 43h2v2h-2zM49 43h2v2h-2z" fill="#D9AA43" stroke="none"/>
    <path d="M13 48h2v9h-2zM49 48h2v9h-2z" fill="#B18B63" stroke="none"/>`,
  books: `<path d="M16 26h4m2 0h3m1 0h4m2 0h4m1 0h4m2 0h4M16 45h5m2 0h4m2 0h3m2 0h4m2 0h5" fill="none" stroke="#D9AA43"/>
    <path d="M18 19h1v10h-1zM24 20h1v10h-1zM34 19h1v10h-1zM40 19h1v10h-1zM18 37h1v12h-1zM25 38h1v11h-1zM35 38h1v11h-1zM43 38h1v11h-1z" fill="#F1D8AE" stroke="none"/>
    <path d="M11 12h41v2H11zM14 33h36v1H14zM14 52h36v1H14z" fill="#D3A574" stroke="none"/>`,
  cooler: `<path d="M26 11h13v2H26zM27 16h11v1H27zM27 19h11v1H27z" fill="#EDF0D8" stroke="none"/>
    <path d="M27 13h3v2h-3zM36 9h2v2h-2z" fill="#F5ECD5" stroke="none"/>
    <path d="M28 32h2v4h-2zM36 32h2v4h-2z" fill="#D8CBA5" stroke="none"/>
    <path d="M31 37h4v6h-4z" fill="#C9A877" stroke="none"/>
    <path d="M25 45h16v1H25zM25 49h16v1H25z" fill="#665342" stroke="none"/>
    <path d="M23 25h20v1H23zM23 53h20v1H23z" fill="#F5ECD5" stroke="none"/>`,
  timetable: `<path d="M10 11h44v2H10zM10 49h44v2H10z" fill="#C89B70" stroke="none"/>
    <text x="16" y="31" font-size="3.6" fill="#4E5E43" stroke="none">08</text>
    <text x="27" y="31" font-size="3.6" fill="#795539" stroke="none">102</text>
    <text x="38" y="31" font-size="3.6" fill="#4E5E43" stroke="none">КОД</text>
    <text x="16" y="37" font-size="3.6" fill="#4E5E43" stroke="none">10</text>
    <text x="27" y="37" font-size="3.6" fill="#795539" stroke="none">104</text>
    <text x="38" y="37" font-size="3.6" fill="#4E5E43" stroke="none">МАТ</text>
    <text x="16" y="43" font-size="3.6" fill="#4E5E43" stroke="none">12</text>
    <text x="27" y="43" font-size="3.6" fill="#795539" stroke="none">108</text>
    <text x="38" y="43" font-size="3.6" fill="#4E5E43" stroke="none">ДИЗ</text>
    <path d="M10 14h2v35h-2zM52 14h2v35h-2z" fill="#5E4435" stroke="none"/>`,
  bicycle: `<path d="M15 42v10m-5-5h10m28-5v10m-5-5h10" fill="none" stroke="#F5ECD5"/>
    <path d="M13 45h4v4h-4zM46 45h4v4h-4zM30 45h5v5h-5z" fill="#A77A50" stroke="none"/>
    <path d="M25 33h7v1h-7zM35 28h10v1H35zM28 49h10m-9 2h8" fill="none" stroke="#D8CBA5"/>
    <path d="M34 40h3v2h-3zM23 38h3v2h-3z" fill="#D9AA43" stroke="none"/>`,
  coffeeMachine: `<path d="M20 23h3v1h-3zM27 23h3v1h-3zM34 23h3v1h-3zM20 33h3v1h-3zM27 33h3v1h-3zM34 33h3v1h-3z" fill="#D9AA43" stroke="none"/>
    <path d="M18 16h21v1H18zM18 42h21v1H18zM20 48h16v1H20z" fill="#D8CBA5" stroke="none"/>
    <path d="M44 19h2v2h-2zM44 31h2v2h-2z" fill="#F5ECD5" stroke="none"/>
    <path d="M22 51h13v1H22zM43 54h5v1h-5z" fill="#695341" stroke="none"/>`,
});
// Small details change the drawing, while the prop type and its map cell stay fixed.
export const wallVariants = Object.freeze({
  plant: [
    '',
    '<path d="M13 16h7v2h-5v4h-3v-4h1zM28 49h10v2H28z" fill="#73805A" stroke="none"/>',
    '<path d="M43 13h7v2h4v3h-7v-2h-4z" fill="#4E5E43" stroke="none"/><path d="M27 52h12v2H27z" fill="#795539" stroke="none"/>',
  ],
  lockers: [
    '',
    '<path d="M16 27h5v2h-5z" fill="#73805A" stroke="none"/>',
    '<path d="M42 27h6v2h-6z" fill="#D9AA43" stroke="none"/>',
  ],
  bench: [
    '',
    '<path d="M21 27h12m-17 8h8" stroke="#F5ECD5"/>',
    '<path d="M37 27h10m-19 8h14" stroke="#795539"/>',
  ],
  books: [
    '',
    '<path d="M17 19h3v12h-3zM34 37h3v13h-3z" fill="#D9AA43"/><path d="M26 19h3v12h-3z" fill="#73805A"/>',
    '<path d="M22 20h3v11h-3zM40 37h4v13h-4z" fill="#A77A50"/><path d="M29 38h3v12h-3z" fill="#F5ECD5"/>',
  ],
  cooler: [
    '',
    '<path d="M24 11h17v4H24z" fill="#F5ECD5" stroke="none"/><path d="M27 28h4v4h-4z" fill="#73805A"/>',
    '<path d="M25 11h15v4H25z" fill="#C3B58F" stroke="none"/><path d="M35 28h4v4h-4z" fill="#D9AA43"/>',
  ],
  timetable: [
    '',
    '<path d="M16 29h4v3h-4zM37 35h9v2h-9z" fill="#73805A" stroke="none"/>',
    '<path d="M25 29h7v2h-7zM17 41h3v3h-3z" fill="#D9AA43" stroke="none"/>',
  ],
  bicycle: [
    '',
    '<path d="M39 19h13v7H39z" fill="none" stroke="#795539"/><path d="M42 21h7v3h-7z" fill="#D8CBA5"/>',
    '<path d="M19 29h10v3H19z" fill="#A77A50"/><path d="M25 38h4v4h-4z" fill="#D9AA43"/>',
  ],
  coffeeMachine: [
    '',
    '<path d="M26 19h4v5h-4zM20 29h4v5h-4z" fill="#D9AA43"/><path d="M44 18h2v2h-2z" fill="#F5ECD5"/>',
    '<path d="M33 19h4v5h-4zM27 29h4v5h-4z" fill="#73805A"/><path d="M44 30h2v2h-2z" fill="#D9AA43"/>',
  ],
});
export const edgeAccents = Object.freeze({
  cup: '<path d="M45 39h10v11h-2v2h-6v-2h-2zM55 41h3v6h-3" fill="#F5ECD5"/><path d="M46 40h8v2h-8z" fill="#795539" stroke="none"/><path d="M47 43v6m1 3h5" stroke="#C3B58F"/>',
  umbrella: '<path d="M45 26h2v25h-2z" fill="#795539"/><path d="M39 30h14v3H39zM41 27h10v3H41zM44 24h4v3h-4z" fill="#4E5E43"/><path d="M41 31h3m3-3h2M46 48v6h5v-4" fill="none" stroke="#C3B58F"/>',
});
