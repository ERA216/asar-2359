// Visual-only campus props. Every drawing fits inside one existing 64×64 tile.
// The opaque floor in wall props covers only the art of an already blocked cell.
const floor = '<path d="M0 0h64v64H0z" fill="#dfd2ad" stroke="none"/>';
const shadow = '<path d="M7 56h50v4H7z" fill="#615843" opacity=".22" stroke="none"/>';

export const wallProps = Object.freeze({
  bench: `${floor}${shadow}
    <path d="M8 23h48v9H8z" fill="#8f6543"/><path d="M10 24h44v3H10z" fill="#d5a875" stroke="none"/>
    <path d="M8 35h48v8H8z" fill="#a2764b"/><path d="M11 36h42v2H11z" fill="#d7aa77" stroke="none"/>
    <path d="M12 32v3m13-3v3m14-3v3m13-3v3M12 43v13h5V43m30 0v13h5V43" fill="#69513a"/>
    <path d="M20 26v11m24-11v11" stroke="#705139"/>`,
  books: `${floor}${shadow}
    <path d="M9 50h47v7H9z" fill="#856c4d"/><path d="M12 47h42v3H12z" fill="#d2ad79"/>
    <path d="M15 38h32v9H15z" fill="#668177"/><path d="M19 40h25v2H19z" fill="#bcd0ac" stroke="none"/>
    <path d="M11 28h38v9H11z" fill="#b66d52"/><path d="M14 30h32v2H14z" fill="#ecc18a" stroke="none"/>
    <path d="M18 19h35v8H18z" fill="#bca06a"/><path d="M21 21h29v2H21z" fill="#f1d79e" stroke="none"/>
    <path d="M26 10h25v8H26z" fill="#6a8a71"/><path d="M29 12h19v2H29z" fill="#d7dfbd" stroke="none"/>
    <path d="M15 38v9m32-19v9m-3-18v8m-18-17v8" stroke="#514735"/>`,
  cooler: `${floor}${shadow}
    <path d="M18 13h29v44H18z" fill="#7a9290"/><path d="M20 15h25v7H20z" fill="#c4d2c4" stroke="none"/>
    <path d="M24 4h17v12H24z" fill="#91abb0"/><path d="M27 6h11v8H27z" fill="#d6e4d9" stroke="none"/>
    <path d="M23 27h19v6H23z" fill="#435e5b"/><path d="M25 28h4v3h-4m9-3h4v3h-4" fill="#d7b06a" stroke="none"/>
    <path d="M29 34h7v13h-7z" fill="#f5e9ce"/><path d="M31 34v13" stroke="#a99a77"/>
    <path d="M20 52h25v3H20z" fill="#b7c4b6" stroke="none"/>`,
  timetable: `${floor}${shadow}
    <path d="M6 8h52v45H6z" fill="#8f6848"/><path d="M9 11h46v39H9z" fill="#e8d7ad"/>
    <path d="M12 14h41v7H12z" fill="#536c5d"/><text x="32" y="19" text-anchor="middle" font-size="5" stroke="none" fill="#fff7df">РАСПИСАНИЕ</text>
    <path d="M14 26h36m-36 7h36m-36 7h36M25 23v24m12-24v24" stroke="#aa9b78"/>
    <path d="M17 28h5m6 0h6m6 0h7M17 35h5m6 0h6m6 0h7M17 42h5m6 0h6m6 0h7" stroke="#697861"/>`,
  bicycle: `${floor}${shadow}
    <path d="M10 44h11v3h3v8H9v-4H7v-6h3m32-1h11v3h3v8H41v-4h-2v-6h3" fill="#c1ad81"/>
    <path d="M13 47h7v7h-7zM45 47h7v7h-7z" fill="#dfd2ad"/>
    <path d="M16 50h31M16 50l10-17h10l11 17M26 33l8 17 6-19M30 28h10m-8-3h7m-13 8-4-4h-6m24 2h7l3-5" fill="none" stroke="#526e63" stroke-width="2"/>
    <path d="M25 32h8v3h-8m14-6h9v3h-9" fill="#9d6b46"/>`,
  coffeeMachine: `${floor}${shadow}
    <path d="M13 8h38v49H13z" fill="#8b5944"/><path d="M15 10h34v5H15z" fill="#c48b61" stroke="none"/>
    <path d="M19 19h25v23H19z" fill="#414a42"/><path d="M22 22h19v16H22z" fill="#e7d5ae"/>
    <path d="M27 25h10v9H27z" fill="#9a6646"/><path d="M36 27h3v4h-3" fill="none" stroke="#9a6646"/>
    <path d="M24 36h16m-18 8h22v4H22z" stroke="#d7b073"/>
    <path d="M20 52h25v3H20z" fill="#5b4b3b"/><path d="M45 21h3v3h-3m0 4h3v3h-3" fill="#e6bb6a" stroke="none"/>`,
});

// Transparent, low-contrast marks for existing walkable floor only.
export const floorMarks = Object.freeze({
  scuff: '<path d="M8 52h18m4-31h15M14 27h8m26 22h9" fill="none" stroke="#8f805f" stroke-width="1" opacity=".18"/>',
  light: '<path d="M6 7h23v34H6zM32 7h24v34H32z" fill="#fff4ce" opacity=".09" stroke="none"/>',
  wear: '<path d="M11 13h13m-5 1h10M41 44h12m-8 2h7M10 51h5" fill="none" stroke="#736849" stroke-width="1" opacity=".14"/>',
});

// Accents fit over existing wall art; they do not replace door numbers.
export const edgeAccents = Object.freeze({
  clock: '<path d="M23 17h18v3h4v20h-4v3H23v-3h-4V20h4z" fill="#eee2c0"/><path d="M25 20h14v2h3v16h-3v2H25v-2h-3V22h3z" fill="#faf0d3"/><path d="M32 23v10h7" fill="none" stroke="#514735" stroke-width="2"/>',
  cup: '<path d="M43 37h12v3h-2v10h-8V40h-2z" fill="#f0e4ca"/><path d="M46 41h7v5h-7" fill="#a87455"/><path d="M54 41h3v5h-3" fill="none" stroke="#f0e4ca"/>',
  umbrella: '<path d="M42 15h3v27h-3z" fill="#5c5541"/><path d="M35 24h17v4H35z" fill="#c18f5e"/><path d="M36 23h4v-5h7v5h4" fill="#d6a674"/><path d="M43 42v10h8v-5" fill="none" stroke="#5c5541" stroke-width="2"/>',
});
