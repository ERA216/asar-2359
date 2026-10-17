import { wallProps, wallDetails, wallVariants, edgeAccents } from "./decor-art.js";

const wallNames = Object.keys(wallProps);
let wallLookKey = "";
let wallLooks = [];
let wallVariantLooks = [];

// Presentation-only colouring of the existing obstacle grid. Excluding the
// already drawn neighbours guarantees different props on touching cells.
function wallLook(context, x, y) {
  const { campus, seed, level } = context;
  const key = `${seed}:${level}:${campus.join("/")}`;
  if (key !== wallLookKey) {
    wallLooks = campus.map(row => Array(row.length).fill(null));
    wallVariantLooks = campus.map(row => Array(row.length).fill(null));
    for (let yy = 1; yy < campus.length - 1; yy++) {
      for (let xx = 1; xx < campus[yy].length - 1; xx++) {
        if (campus[yy][xx] !== "#") continue;
        const choices = wallNames.filter(name => name !== wallLooks[yy][xx - 1] && name !== wallLooks[yy - 1][xx]);
        const name = choices[tileHash(seed, level, xx, yy) % choices.length];
        wallLooks[yy][xx] = name;
        const nearby = [[xx - 1, yy - 1], [xx, yy - 1], [xx + 1, yy - 1], [xx - 1, yy]];
        const used = new Set(nearby.filter(([nx, ny]) => wallLooks[ny]?.[nx] === name).map(([nx, ny]) => wallVariantLooks[ny][nx]));
        const variants = wallVariants[name].map((_, index) => index).filter(index => !used.has(index));
        wallVariantLooks[yy][xx] = variants[tileHash(seed ^ 0x517cc1b7, level, xx, yy) % variants.length];
      }
    }
    wallLookKey = key;
  }
  return wallLooks[y][x];
}

// A separate hash gives each tile a repeatable look without consuming the
// generator's random stream or changing any level data.
function tileHash(seed, level, x, y) {
  let value = (seed ^ Math.imul(level, 0x9e3779b1) ^ Math.imul(x + 1, 0x85ebca6b) ^ Math.imul(y + 1, 0xc2b2ae35)) >>> 0;
  value = Math.imul(value ^ value >>> 16, 0x7feb352d);
  value = Math.imul(value ^ value >>> 15, 0x846ca68b);
  return (value ^ value >>> 16) >>> 0;
}

export function floorTextureVariant(seed, level, x, y) {
  return tileHash(seed, level, x, y) % 12;
}

export function createDecoration(tile, x, y, context) {
  const { campus, seed, level } = context;
  const last = campus.length - 1;
  const hash = tileHash(seed, level, x, y);
  let name, art, kind;

  if (tile === "#") {
    if (x > 0 && x < last && y > 0 && y < last) {
      name = wallLook(context, x, y);
      art = wallProps[name] + wallDetails[name] + wallVariants[name][wallVariantLooks[y][x]];
      kind = "wall";
    } else if ((y === 0 || y === last) && x > 0 && x < last && x % 2 === 1 && hash % 4 === 0) {
      name = "cup";
      art = edgeAccents.cup;
      kind = "edge";
    } else if ((x === 0 || x === last) && y > 0 && y < last && y % 2 === 0 && hash % 5 === 0) {
      name = "umbrella";
      art = edgeAccents.umbrella;
      kind = "edge";
    }
  }
  if (!art) return null;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("class", `campus-decor campus-decor--${kind}`);
  svg.setAttribute("data-decoration", name);
  svg.setAttribute("aria-hidden", "true");
  svg.style.pointerEvents = "none";
  svg.innerHTML = `<g stroke="#3C3429" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter">${art}</g>`;
  return svg;
}
