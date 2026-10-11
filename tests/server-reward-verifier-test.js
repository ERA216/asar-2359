import assert from "node:assert/strict";
import { generateLevel } from "../src/level-generator.js";
import { solveLevel } from "../src/level-solver.js";
import { solveGuardLevel } from "../src/guard.js";
import { verifyCompletedMap } from "../src/server-reward-verifier.js";

const encode = path => path.map(([dx, dy]) =>
  dx === 1 ? "R" : dx === -1 ? "L" : dy === 1 ? "D" : "U").join("");

for (const level of [1, 10, 14, 15, 20, 21, 25, 40]) {
  for (const seed of [0, 42, 0xffffffff]) {
    const map = generateLevel(seed, level);
    const solution = map.guard
      ? solveGuardLevel(map.campus, map.start, map.guard)
      : solveLevel(map.campus, map.start);
    const route = encode(solution.path);
    assert.deepEqual(verifyCompletedMap(seed, level, route), {
      valid: true, reward: level < 15 ? 1 : 2,
    });
    assert.deepEqual(verifyCompletedMap(seed, level, route.slice(0, -1)), {
      valid: false, reason: "unfinished",
    });
    assert.deepEqual(verifyCompletedMap(seed, level, route + "R"), {
      valid: false, reason: route.length + 1 > map.moveLimit ? "move_limit" : "moves_after_win",
    });
    const position = { ...map.start };
    let blockedRoute;
    const steps = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
    for (let index = 0; index < route.length && !blockedRoute; index++) {
      for (const [direction, [dx, dy]] of Object.entries(steps)) {
        if (map.campus[position.y + dy]?.[position.x + dx] === "#") {
          blockedRoute = route.slice(0, index) + direction;
          break;
        }
      }
      const [dx, dy] = steps[route[index]];
      position.x += dx;
      position.y += dy;
    }
    assert.ok(blockedRoute, "Solution should pass a wall");
    assert.deepEqual(verifyCompletedMap(seed, level, blockedRoute), {
      valid: false, reason: "blocked_cell",
    });
    assert.deepEqual(verifyCompletedMap(seed, level, "R".repeat(map.moveLimit + 1)), {
      valid: false, reason: "move_limit",
    });
  }
}

for (const [seed, level, moves] of [[-1, 1, "R"], [0, 0, "R"], [0, 1, "R!"]]) {
  assert.deepEqual(verifyCompletedMap(seed, level, moves), { valid: false, reason: "invalid_input" });
}
console.log("Server reward verifier: routes, guards, limits, level 14/15 boundary and malformed reports passed.");
