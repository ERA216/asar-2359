import assert from "node:assert/strict";
import { guardCollision } from "./guard.js";
import { generateLevel } from "./level-generator.js";
import { nearestPartRoute, nextGuardCells, routeToPart } from "./item-guides.js";

const corridor = ["#######", "#D..1.#", "#.#...#", "#..2..#", "#######"];
const start = { x: 1, y: 1 };
assert.deepEqual(routeToPart(corridor, start, "1"), [
  { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
]);
assert.equal(nearestPartRoute(corridor, start, new Set(), null, 0).id, "1");

const guard = { patrol: [{ x: 3, y: 1 }, { x: 2, y: 1 }] };
assert.deepEqual(nextGuardCells(guard, 0), [
  { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 },
]);
const detour = routeToPart(corridor, start, "1", guard, 0);
assert.ok(detour.length > 3, "guard forces a detour from the three-step corridor");
detour.forEach((point, index) => {
  assert.notEqual(corridor[point.y][point.x], "#");
  assert.equal(guardCollision(guard, point, index + 1), false);
});

for (const level of [1, 6, 11, 21, 25, 30, 41]) {
  for (const seed of [0, 1, 42, 1234, 98765]) {
    const { campus, start, guard: patrol } = generateLevel(seed, level);
    const choice = nearestPartRoute(campus, start, new Set(), patrol, 0);
    assert.ok(choice, `no route at level ${level}, seed ${seed}`);
    assert.equal(campus[choice.path.at(-1).y][choice.path.at(-1).x], choice.id);
    let previous = start;
    choice.path.forEach((point, index) => {
      assert.equal(Math.abs(previous.x - point.x) + Math.abs(previous.y - point.y), 1);
      assert.notEqual(campus[point.y][point.x], "#");
      assert.equal(guardCollision(patrol, point, index + 1), false);
      previous = point;
    });
  }
}
console.log("PASS: shortest guide, timed guard detour, forecast and 35 generated maps.");
