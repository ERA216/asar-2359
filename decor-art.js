// Visual-only campus props; placement and the obstacle grid are unchanged.
import { plantArt, bookshelfArt, vendingArt, groundShadow } from './campus-art.js';
const floor = '<path d="M0 0h64v64H0z" fill="#C3B58F" stroke="none"/><path d="M1 1h62v62H1z" fill="none" stroke="#795539" opacity=".25"/><path d="M32 0v64M0 32h64" stroke="#795539" opacity=".3"/><path d="M7 49h50v9H7z" fill="#795539" opacity=".34" stroke="none"/><path d="M11 58h43v2H11z" fill="#3C3429" opacity=".22" stroke="none"/>';
const shadow = groundShadow;
export const wallProps = Object.freeze({
  plant: `${floor}${plantArt}`,
  lockers: `${floor}${shadow}
    <path d="M10 7h44v50H10z" fill="#AEA184"/><path d="M10 7h44v4H10z" fill="#D8CBA5"/>
    <path d="M13 13h11v41H13zM26 13h11v41H26zM39 13h12v41H39z" fill="#C3B58F"/>
    <path d="M15 16h7m-7 3h7m-7 3h7m6-6h7m-7 3h7m-7 3h7m6-6h8m-8 3h8m-8 3h8" stroke="#795539"/>
    <path d="M21 32h2v7h-2zM34 32h2v7h-2zM47 32h2v7h-2z" fill="#795539"/>
    <path d="M14 25h9v4h-9zM27 25h9v4h-9zM40 25h10v4H40z" fill="#F5ECD5" stroke="none"/>
    <path d="M14 14v38m13-38v38m13-38v38" stroke="#F5ECD5"/>
    <path d="M12 57v2h4v-2m32 0v2h4v-2" fill="#3C3429"/>`,
  bench: `${floor}${shadow}
    <path d="M9 23h46v17H9z" fill="#795539"/><path d="M10 24h44v6H10zM10 32h44v6H10z" fill="#A77A50"/>
    <path d="M11 25h41m-41 8h41" stroke="#D8CBA5"/>
    <path d="M12 28h2m6 0h14m7 0h7m-32 8h9m13 0h11" stroke="#795539"/>
    <path d="M8 42h48v6H8z" fill="#A77A50"/><path d="M9 42h46v2H9z" fill="#C3B58F"/>
    <path d="M12 39h3v3h-3zM49 39h3v3h-3zM12 48h4v10h-4zM48 48h4v10h-4z" fill="#795539"/>
    <path d="M15 51h33" stroke="#3C3429"/>`,
  books: `${floor}${bookshelfArt}`,
  cooler: `${floor}${shadow}
    <path d="M20 20h26v37H20z" fill="#C3B58F"/><path d="M20 20h26v5H20z" fill="#F5ECD5"/>
    <path d="M24 5h18v3h2v9h-2v4H24v-4h-2V8h2z" fill="#AEA184"/>
    <path d="M24 10h17v7H24z" fill="#D8CBA5" stroke="none"/><path d="M25 7h13m-14 2v6m2 3h13" stroke="#F5ECD5"/>
    <path d="M24 28h18v17H24z" fill="#795539"/><path d="M26 30h14v11H26z" fill="#3C3429"/>
    <path d="M27 28h4v4h-4z" fill="#4E5E43"/><path d="M35 28h4v4h-4z" fill="#A77A50"/>
    <path d="M30 36h6v8h-6z" fill="#F5ECD5"/><path d="M26 45h14v3H26z" fill="#AEA184"/>
    <path d="M23 52h19m-19 2h19M21 26v24" stroke="#F5ECD5"/>`,
  timetable: `${floor}${shadow}
    <path d="M7 9h50v44H7z" fill="#795539"/><path d="M9 11h46v40H9z" fill="#A77A50"/>
    <path d="M12 14h40v34H12z" fill="#F5ECD5"/><path d="M12 14h40v9H12z" fill="#4E5E43"/>
    <text x="32" y="20" text-anchor="middle" font-size="5" fill="#F5ECD5" stroke="none">РАСПИСАНИЕ</text>
    <path d="M15 27h34m-34 6h34m-34 6h34m-34 6h34M23 25v22m12-22v22" stroke="#C3B58F"/>
    <path d="M16 30h4m6 0h6m6 0h8M16 36h4m6 0h6m6 0h8M16 42h4m6 0h6m6 0h8" stroke="#4E5E43"/>
    <path d="M8 10h47M8 10v41" stroke="#D8CBA5"/>`,
  bicycle: `${floor}${shadow}
    <path d="M9 37h12v2h3v3h2v10h-2v3h-3v2H9v-2H6v-3H4V42h2v-3h3zM42 37h12v2h3v3h2v10h-2v3h-3v2H42v-2h-3v-3h-2V42h2v-3h3z" fill="#795539"/>
    <path d="M10 40h10v2h3v10h-3v2H10v-2H7V42h3zM43 40h10v2h3v10h-3v2H43v-2h-3V42h3z" fill="#D8CBA5"/>
    <path d="M15 40v14m-8-7h16m25-7v14m-8-7h16" stroke="#AEA184"/>
    <path d="M15 47h16v-3h2v-5h3v-6h2v-5h7M15 47v-4h3v-5h3v-5h13M23 33v5h3v5h3v4m9-19v6h3v6h4v7h3" fill="none" stroke="#4E5E43" stroke-width="2"/>
    <path d="M19 29h10v3H19zM39 25h9v3h-9z" fill="#795539"/>
    <path d="M29 47h5v3h4m-5-1v-5h-4" fill="none"/>`,
  coffeeMachine: `${floor}${vendingArt}`,
});
export const floorMarks = Object.freeze({
  scuff: '<path d="M8 52h10m12-32h8M14 28h5m26 22h4" fill="none" stroke="#C3B58F" opacity=".4"/>',
  light: '<path d="M6 8h24v34H6zM32 8h24v34H32z" fill="#F5ECD5" opacity=".09" stroke="none"/>',
  wear: '<path d="M12 12h9M40 44h7m-3 2h4M10 52h4" fill="none" stroke="#C3B58F" opacity=".4"/>',
});
export const edgeAccents = Object.freeze({
  clock: '<path d="M24 15h14v2h4v3h2v16h-2v3h-4v2H24v-2h-4v-3h-2V20h2v-3h4z" fill="#795539"/><path d="M25 18h12v2h4v16h-4v2H25v-2h-4V20h4z" fill="#F5ECD5"/><path d="M31 20v2m0 12v2M23 28h2m12 0h2M31 24v5h6" fill="none" stroke="#3C3429"/>',
  cup: '<path d="M45 39h10v11h-2v2h-6v-2h-2zM55 41h3v6h-3" fill="#F5ECD5"/><path d="M46 40h8v2h-8z" fill="#795539" stroke="none"/><path d="M47 43v6m1 3h5" stroke="#C3B58F"/>',
  umbrella: '<path d="M45 26h2v25h-2z" fill="#795539"/><path d="M39 30h14v3H39zM41 27h10v3H41zM44 24h4v3h-4z" fill="#4E5E43"/><path d="M41 31h3m3-3h2M46 48v6h5v-4" fill="none" stroke="#C3B58F"/>',
});
