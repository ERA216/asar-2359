import assert from "node:assert/strict";
import { createHash, randomInt } from "node:crypto";
import { generateLevel, parameters } from "./level-generator.js";
import { reachable, solveLevel } from "./level-solver.js";
import { guardPosition, patrolLengths, solveGuardLevel } from "./guard.js";

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
  if (level <= 20) assert.equal(map.guard, undefined);
  else {
    assert.ok(map.guard);
    const { patrol } = map.guard, range = patrolLengths(level);
    assert.ok(patrol.length > 1, "A level 21+ guard must move");
    assert.ok(patrol.length >= range.min && patrol.length <= range.max);
    assert.equal(new Set(patrol.map(p => `${p.x},${p.y}`)).size, patrol.length);
    if (patrol.length > 1) assert.equal(Math.abs(patrol[0].x + patrol[0].y - start.x - start.y) % 2, 0, "Moving guard must be able to meet the player");
    const blocked = campus.map(row => [...row]);
    patrol.forEach((p, i) => {
      assert.equal(campus[p.y][p.x], ".");
      assert.ok(!map.coins.some(c => c.x === p.x && c.y === p.y));
      if (i) {
        assert.equal(Math.abs(p.x - patrol[i - 1].x) + Math.abs(p.y - patrol[i - 1].y), 1);
        assert.equal(p.x - patrol[i - 1].x, patrol[1].x - patrol[0].x);
        assert.equal(p.y - patrol[i - 1].y, patrol[1].y - patrol[0].y);
      }
      blocked[p.y][p.x] = "#";
    });
    const accessible = new Set(reachable(blocked, start).map(p => `${p.x},${p.y}`));
    [...points, map.library, ...map.coins].forEach(p => assert.ok(accessible.has(`${p.x},${p.y}`)));
  }
  const solution = map.guard ? solveGuardLevel(campus, start, map.guard) : solveLevel(campus, start);
  assert.ok(solution && solution.minimum >= config.minPath);
  assert.equal(map.moveLimit, solution.minimum + config.slack);
  let { x, y } = start; const found = new Set();
  let guardIndex = 0, guardDirection = 1;
  for (const [dx, dy] of solution.path) {
    x += dx; y += dy;
    assert.notEqual(campus[y][x], "#");
    if (map.guard) {
      const { patrol } = map.guard;
      // Independent step-by-step simulation, not the solver's position formula.
      if (patrol.length > 1) {
        if (guardIndex + guardDirection < 0 || guardIndex + guardDirection >= patrol.length) guardDirection *= -1;
        guardIndex += guardDirection;
      }
      assert.ok(x !== patrol[guardIndex].x || y !== patrol[guardIndex].y, "Solver route hits guard");
    }
    if ("123".includes(campus[y][x])) found.add(campus[y][x]);
  }
  assert.equal(found.size, 3); assert.equal(campus[y][x], "P");
  return solution.minimum;
}

// Captured before the guard changes: 20 seeds and a forced fallback per level.
const originalHashes = [
  "37060408f61337d17dabf9291a30094e5f4817c37720879a93201dde93cd1217",
  "18b28cdc9bc50f74a73bc8d3919d75dea5afb03770cd868dcf52706cefd8bf4c",
  "09c64713bf4845148f538d49ea079463d0fe229df2f7e968522c2e01f1feecab",
  "a0687857154f437747894af1e62007268dd78cd0b5b3ab9fb1354741ceb4ce20",
  "891d07cdf0ce24500aaa83ae698bcc2d016e5db949ac5392afd74e42dce31e39",
  "89cb85d9dc84fc938039b2f97f419abc9754c82c2962b74b57366c23ea62a7b3",
  "48f383235f44767cd1b27be53e8f9eb1442f01ab7464eb70c82b1010b5926934",
  "9d899f8b14c6a6f602c2704f9eee5ebd3352baa2469ce234eb8d96edce75af82",
  "96e845ac087dddb2a9c1830ab60092ee745a2cbda414eaf7b465b010cabd852c",
  "0ba30e7d4c13652a8354fb5de4be044e8a0eac4530495bef669c347518891e16",
  "867cd6fe99f4ffd3ab3c0614ad6c67eb7f3db52c8ab1e0459a5b2440382df3ae",
  "995cdf1c0e85e867a25d469229c40585f204b73e4e5d54def3bd60b25c785989",
  "7db78a92ee1e4dcf74bc2832488dec5781d69f1e1b03f7c7297cf40b96efa949",
  "d74c455e9953194c0ad3faf7fbbfde17ae03f0358641d813db92b62ce0a49441",
  "663ba4681b9672636e766bbde26382defeb52f589d2832014d6863771adf8fe7",
  "c9a56ec01647f7879ac32d1a5b21d972849f69073837dcbacfa2737a41e99069",
  "66506c4aeb94e3d85ad2f467313664225a7395dc9879c16b4f670cb8698c95f0",
  "cc87eb7a9503561bf54c36e2842af10b75c1170ebdf8c8e541912758f82a00ca",
  "ef83af9db91c9e21c8d6f20a9d3ebd0eb5a51b0a9fb65e092e654eadb400e8f0",
  "910e8c6751a49f08fc55c9db1eb937be678d997141fa935eaae9aa2d1242ca46",
];
originalHashes.forEach((expected, index) => {
  const level = index + 1, hash = createHash("sha256");
  for (let seed = 0; seed < 20; seed++) {
    const map = generateLevel(seed, level);
    hash.update(JSON.stringify(map)); verify(map, level);
  }
  const fallback = generateLevel(42, level, 0);
  hash.update(JSON.stringify(fallback)); verify(fallback, level);
  assert.equal(hash.digest("hex"), expected, `Level ${level} changed`);
});
console.log("PASS: levels 1–20 match all 420 original maps exactly.");

for (let length = 1; length <= 5; length++) {
  const guard = { patrol: Array.from({ length }, (_, x) => ({ x, y: 1 })) };
  let index = 0, direction = 1;
  for (let turn = 0; turn < 40; turn++) {
    assert.deepEqual(guardPosition(guard, turn), guard.patrol[index]);
    if (length > 1) {
      if (index + direction < 0 || index + direction >= length) direction *= -1;
      index += direction;
    }
  }
}
assert.equal(solveGuardLevel(["########", "#D.123P#", "########"], { x: 1, y: 1 }, { patrol: [{ x: 2, y: 1 }] }), null);
// This route takes 42 moves if visited states omit time; the timed optimum is 40.
assert.equal(solveGuardLevel([
  "############", "#..#..##.3##", "#..##..#.#.#", "##.2#.#P...#",
  "#..#.....#1#", "#..#.##.##.#", "##......#..#", "#..#...B...#",
  "###..#....##", "#.#.##.D..##", "#...#...#..#", "############",
], { x: 7, y: 9 }, { patrol: [10, 9, 8, 7, 6].map(y => ({ x: 6, y })) }).minimum, 40);
for (let sample = 0; sample < 300; sample++) {
  const seed = randomInt(0x100000000), level = randomInt(21, 201);
  try { verify(generateLevel(seed, level), level); }
  catch (error) { throw new Error(`Random guard case: seed=${seed}, level=${level}`, { cause: error }); }
}
console.log("PASS: 300 random levels 21–200; every timed route replayed without collision.");

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
