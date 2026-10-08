// Visual-only campus props. Every drawing fits inside one existing 64×64 tile.
// The opaque floor in wall props covers only the art of an already blocked cell.
const floor = '<path d="M0 0h64v64H0z" fill="#D3C5A2" stroke="none"/>';
const shadow = '<path d="M8 56h50v4H8z" fill="#514C3D" opacity=".22" stroke="none"/>';

export const wallProps = Object.freeze({
  plant: `${floor}${shadow}
    <path d="M22 42h22v10h-4v6H26v-6h-4z" fill="#AEA184"/>
    <path d="M20 40h26v6H20zM30 20h4v20h-4z" fill="#81775E"/>
    <path d="M30 12h-8V8H12v6H8v8h8v6h12v-6h4v12h10v-4h10V18h-6v-6H36V8h-6z" fill="#66805B"/>
    <path d="M12 14h10v4H12zM36 18h10v4H36zM24 22h6v4h-6z" fill="#AEA184" stroke="none"/>
    <path d="M28 48h10v4H28z" fill="#D3C5A2" stroke="none"/>`,
  lockers: `${floor}${shadow}<path d="M8 8h48v48H8z" fill="#AEA184"/><path d="M24 8v48m16-48v48M12 16h8m8 0h8m8 0h8M12 20h8m8 0h8m8 0h8M18 30v8m16-8v8m16-8v8" stroke="#81775E"/>`,
  bench: `${floor}${shadow}
    <path d="M8 24h48v8H8z" fill="#974F3D"/><path d="M10 24h44v4H10z" fill="#AEA184" stroke="none"/>
    <path d="M8 36h48v8H8z" fill="#A97935"/><path d="M12 36h42v2H12z" fill="#AEA184" stroke="none"/>
    <path d="M12 32v4m12-4v4m14-4v4m12-4v4M12 44v12h4V44m30 0v12h4V44" fill="#514C3D"/>
    <path d="M20 26v12m24-12v12" stroke="#514C3D"/>`,
  books: `${floor}${shadow}
    <path d="M8 50h48v8H8z" fill="#81775E"/><path d="M12 48h42v4H12z" fill="#AEA184"/>
    <path d="M16 38h32v8H16z" fill="#66805B"/><path d="M20 40h24v2H20z" fill="#D3C5A2" stroke="none"/>
    <path d="M12 28h38v8H12z" fill="#C58060"/><path d="M14 30h32v2H14z" fill="#D3C5A2" stroke="none"/>
    <path d="M18 20h36v8H18z" fill="#AEA184"/><path d="M20 20h28v2H20z" fill="#D3C5A2" stroke="none"/>
    <path d="M26 10h24v8H26z" fill="#66805B"/><path d="M28 12h20v2H28z" fill="#F0E5C9" stroke="none"/>
    <path d="M16 38v8m32-20v8m-4-18v8m-18-16v8" stroke="#514C3D"/>`,
  cooler: `${floor}${shadow}
    <path d="M18 12h28v44H18z" fill="#AEA184"/><path d="M20 16h24v8H20z" fill="#D3C5A2" stroke="none"/>
    <path d="M24 4h16v12H24z" fill="#AEA184"/><path d="M28 6h12v8H28z" fill="#F0E5C9" stroke="none"/>
    <path d="M24 28h20v6H24z" fill="#514C3D"/><path d="M24 28h4v4h-4m8-4h4v4h-4" fill="#D8AD4B" stroke="none"/>
    <path d="M28 34h8v12h-8z" fill="#F0E5C9"/><path d="M32 34v12" stroke="#AEA184"/>
    <path d="M20 52h24v4H20z" fill="#D3C5A2" stroke="none"/>`,
  timetable: `${floor}${shadow}
    <path d="M6 8h52v44H6z" fill="#974F3D"/><path d="M8 12h46v40H8z" fill="#D3C5A2"/>
    <path d="M12 14h40v8H12z" fill="#66805B"/><text x="32" y="20" text-anchor="middle" font-size="5" stroke="none" fill="#F0E5C9">РАСПИСАНИЕ</text>
    <path d="M14 26h36m-36 8h36m-36 8h36M24 24v24m12-24v24" stroke="#AEA184"/>
    <path d="M16 28h4m6 0h6m6 0h8M16 36h4m6 0h6m6 0h8M16 42h4m6 0h6m6 0h8" stroke="#66805B"/>`,
  bicycle: `${floor}${shadow}
    <path d="M10 44h12v4h4v8H8v-4H8v-6h4m320h12v4h4v8H40v-4h-2v-6h4" fill="#AEA184"/>
    <path d="M12 48h8v8h-8zM44 48h8v8h-8z" fill="#D3C5A2"/>
    <path d="M16 50h32M16 50l10-16h10l12 16M26 32l8 16 6-20M30 28h10m-8-4h8m-12 8-4-4h-6m24 2h8l4-4" fill="none" stroke="#66805B" stroke-width="2"/>
    <path d="M24 32h8v4h-8m14-6h8v4h-8" fill="#A97935"/>`,
  coffeeMachine: `${floor}${shadow}
    <path d="M12 8h38v48H12z" fill="#974F3D"/><path d="M16 10h34v4H16z" fill="#C58060" stroke="none"/>
    <path d="M20 20h24v24H20z" fill="#354B38"/><path d="M22 22h20v16H22z" fill="#D3C5A2"/>
    <path d="M28 24h10v8H28z" fill="#974F3D"/><path d="M36 28h4v4h-4" fill="none" stroke="#974F3D"/>
    <path d="M24 36h16m-18 8h22v4H22z" stroke="#D8AD4B"/>
    <path d="M20 52h24v4H20z" fill="#514C3D"/><path d="M44 20h4v4h-4m0 4h4v4h-4" fill="#D8AD4B" stroke="none"/>`,
});

// Transparent, low-contrast marks for existing walkable floor only.
export const floorMarks = Object.freeze({
  scuff: '<path d="M8 52h18m4-32h16M14 28h8m26 22h8" fill="none" stroke="#81775E" stroke-width="2" opacity=".18"/>',
  light: '<path d="M6 8h24v34H6zM32 8h24v34H32z" fill="#F0E5C9" opacity=".09" stroke="none"/>',
  wear: '<path d="M12 12h12m-4 0h10M40 44h12m-8 2h8M10 52h4" fill="none" stroke="#81775E" stroke-width="2" opacity=".14"/>',
});

// Accents fit over existing wall art; they do not replace door numbers.
export const edgeAccents = Object.freeze({
  clock: '<path d="M24 16h18v4h4v20h-4v4H24v-4h-4V20h4z" fill="#F0E5C9"/><path d="M24 20h14v2h4v16h-4v2H24v-2h-4V22h4z" fill="#F0E5C9"/><path d="M32 24v10h8" fill="none" stroke="#514C3D" stroke-width="2"/>',
  cup: '<path d="M44 36h12v4h-2v10h-8V40h-2z" fill="#F0E5C9"/><path d="M46 40h8v4h-8" fill="#A97935"/><path d="M54 40h4v4h-4" fill="none" stroke="#F0E5C9"/>',
  umbrella: '<path d="M42 16h4v28h-4z" fill="#514C3D"/><path d="M36 24h16v4H36z" fill="#C58060"/><path d="M36 24h4v-4h8v4h4" fill="#D8AD4B"/><path d="M44 42v10h8v-4" fill="none" stroke="#514C3D" stroke-width="2"/>',
});
