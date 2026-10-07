import { reachable, solveLevel } from "./level-solver.js";

// Sizes exclude the outer wall ring. Later courses saturate at safe bounds.
export const difficulty = {
  stages: [
    { size: 5, density: .12, slack: 4, minPath: 12, spacing: 2 },
    { size: 6, density: .17, slack: 3, minPath: 16, spacing: 3 },
    { size: 7, density: .21, slack: 2, minPath: 20, spacing: 3 },
    { size: 8, density: .24, slack: 2, minPath: 24, spacing: 4 },
    { size: 9, density: .27, slack: 1, minPath: 28, spacing: 4 },
    { size: 10, density: .28, slack: 1, minPath: 32, spacing: 4 },
  ],
  later: { densityStep: .01, maxDensity: .32, minSlack: 0, maxMinPath: 36 },
  attempts: 200,
};

export function parameters(level) {
  if (!Number.isSafeInteger(level) || level < 1) throw new Error("Invalid level");
  const course = Math.floor((level - 1) / 5) + 1;
  const extra = Math.max(0, course - difficulty.stages.length);
  const base = difficulty.stages[Math.min(course, difficulty.stages.length) - 1];
  return { ...base, course,
    density: Math.min(difficulty.later.maxDensity, base.density + extra * difficulty.later.densityStep),
    slack: Math.max(difficulty.later.minSlack, base.slack - extra),
    minPath: Math.min(difficulty.later.maxMinPath, base.minPath + extra),
  };
}

function randomSource(seed, level) {
  let state = ((seed >>> 0) ^ Math.imul(level, 0x9e3779b1)) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ state >>> 15, state | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}
function shuffle(values, random) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const emptyMap = size => Array.from({ length: size + 2 }, (_, y) => Array.from({ length: size + 2 }, (_, x) => x === 0 || y === 0 || x === size + 1 || y === size + 1 ? "#" : "."));
const floors = grid => grid.flatMap((row, y) => row.flatMap((tile, x) => tile === "." ? [{ x, y }] : []));

function finish(grid, points, config, random, fallback, attempt) {
  const [start, ...rest] = points;
  points.forEach(({ x, y }, i) => { grid[y][x] = ["D", "1", "2", "3", "P"][i]; });
  const available = shuffle(floors(grid), random);
  const library = available.pop(); grid[library.y][library.x] = "B";
  const coins = available.slice(0, 3 + Math.floor(random() * 3));
  const campus = grid.map(row => row.join(""));
  const solution = solveLevel(campus, start);
  if (!solution || solution.minimum < config.minPath) return null;
  const buildings = [];
  for (let y = 1; y <= config.size; y++) for (let x = 1; x <= config.size; x++) if (grid[y][x] === "#") buildings.push({ x, y });
  return { size: config.size, campus, start, parts: rest.slice(0, 3), printer: rest[3], library,
    buildings, coins, minimum: solution.minimum, moveLimit: solution.minimum + config.slack, course: config.course, fallback, attempt };
}

export function generateLevel(seed, level, maxAttempts = difficulty.attempts) {
  const config = parameters(level), random = randomSource(seed, level), n = config.size;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const grid = emptyMap(n);
    const cells = shuffle(floors(grid), random);
    let count = 0;
    for (const { x, y } of cells) {
      if (count >= Math.floor(n * n * config.density)) break;
      grid[y][x] = "#";
      // Avoid solid 2x2 interior blocks and straight runs longer than two.
      const wall = (xx, yy) => xx > 0 && yy > 0 && xx <= n && yy <= n && grid[yy][xx] === "#";
      const block = [-1, 0].some(dx => [-1, 0].some(dy => [0, 1].every(i => [0, 1].every(j => wall(x + dx + i, y + dy + j)))));
      const run = [[1, 0], [0, 1]].some(([dx, dy]) => [-2, -1, 0].some(offset => [0, 1, 2].every(i => wall(x + (offset + i) * dx, y + (offset + i) * dy))));
      const remaining = floors(grid);
      if (block || run || reachable(grid, remaining[0]).length !== remaining.length) grid[y][x] = "."; else count++;
    }
    const available = shuffle(floors(grid), random);
    if (reachable(grid, available[0]).length !== available.length) continue;
    const points = [];
    for (const point of available) {
      if (points.every(other => distance(point, other) >= config.spacing)) points.push(point);
      if (points.length === 5) break;
    }
    if (points.length !== 5) continue;
    const result = finish(grid, points, config, random, false, attempt);
    if (result) return result;
  }
  // Open floor fallback: corners plus centre guarantee long, connected routes.
  const grid = emptyMap(n), middle = Math.ceil(n / 2);
  const result = finish(grid, [{ x: 1, y: 1 }, { x: n, y: 1 }, { x: n, y: n }, { x: 1, y: n }, { x: middle, y: middle }], config, random, true, maxAttempts);
  if (!result) throw new Error("Difficulty parameters exceed fallback capacity");
  return result;
}
