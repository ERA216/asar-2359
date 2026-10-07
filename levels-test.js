import assert from "node:assert/strict";
import { generateLevel, parameters } from "./level-generator.js";
import { reachable, solveLevel } from "./level-solver.js";

function verify(map, level) {
  const config = parameters(level), { campus, start } = map;
  assert.equal(campus.length, config.size + 2);
  assert.ok(campus.every(row => row.length === config.size + 2));
  assert.ok([...campus[0], ...campus.at(-1)].every(tile => tile === "#"));
  assert.ok(campus.every(row => row[0] === "#" && row.at(-1) === "#"));
  for (let y = 1; y <= config.size; y++) for (let x = 1; x <= config.size; x++) {
    const wall = (xx, yy) => xx <= config.size && yy <= config.size && campus[yy][xx] === "#";
    assert.ok(!(wall(x, y) && wall(x + 1, y) && wall(x, y + 1) && wall(x + 1, y + 1)));
    assert.ok(!(wall(x, y) && wall(x + 1, y) && wall(x + 2, y)));
    assert.ok(!(wall(x, y) && wall(x, y + 1) && wall(x, y + 2)));
  }
  const points = [start, ...map.parts, map.printer];
  points.forEach((a, i) => points.slice(i + 1).forEach(b => assert.ok(Math.abs(a.x - b.x) + Math.abs(a.y - b.y) >= config.spacing)));
  assert.equal(reachable(campus, start).length, campus.join("").replaceAll("#", "").length);
  for (const symbol of "D123PB") assert.equal([...campus.join("")].filter(tile => tile === symbol).length, 1);
  assert.ok(map.coins.length >= 3 && map.coins.length <= 5);
  assert.equal(new Set(map.coins.map(p => `${p.x},${p.y}`)).size, map.coins.length);
  map.coins.forEach(({ x, y }) => assert.equal(campus[y][x], "."));
  const solution = solveLevel(campus, start);
  assert.ok(solution && solution.minimum >= config.minPath);
  assert.equal(map.moveLimit, solution.minimum + config.slack);
  let { x, y } = start; const found = new Set();
  for (const [dx, dy] of solution.path) {
    x += dx; y += dy;
    assert.notEqual(campus[y][x], "#");
    if ("123".includes(campus[y][x])) found.add(campus[y][x]);
  }
  assert.equal(found.size, 3); assert.equal(campus[y][x], "P");
  return solution.minimum;
}

// Courses 1–10 cover every change before saturation; course 20 checks the cap.
assert.equal(solveLevel(["########", "#DP123.#", "########"], { x: 1, y: 1 }).minimum, 7);
assert.equal(solveLevel(["########", "#D#123P#", "########"], { x: 1, y: 1 }), null);
for (const level of [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 96]) {
  let shortest = Infinity, longest = 0, fallbacks = 0;
  for (let seed = 0; seed < 1000; seed++) {
    const map = generateLevel(seed, level);
    assert.deepEqual(map, generateLevel(seed, level));
    const length = verify(map, level);
    shortest = Math.min(shortest, length); longest = Math.max(longest, length);
    fallbacks += Number(map.fallback);
  }
  verify(generateLevel(42, level, 0), level);
  console.log(`Course ${parameters(level).course}: 1000 PASS; minimum ${shortest}–${longest}; fallback ${fallbacks}; forced fallback PASS`);
}
for (let level = 1; level <= 100; level++) verify(generateLevel(1234, level), level);
assert.equal(parameters(20).size, 8); assert.equal(parameters(21).size, 9);
console.log("PASS: 11000 maps, 100 progression levels, deterministic output, forced fallbacks, replayed BFS routes.");
