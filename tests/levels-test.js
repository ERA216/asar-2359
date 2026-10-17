import assert from "node:assert/strict";
import { createHash, randomInt } from "node:crypto";
import { generateLevel, parameters } from "../src/level-generator.js";
import { isBlockedTile, reachable, solveLevel } from "../src/level-solver.js";
import { guardPosition, patrolLengths, solveGuardLevel } from "../src/guard.js";

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
  assert.equal(reachable(campus, start).length, [...campus.join("")].filter(tile => !isBlockedTile(tile)).length);
  assert.equal(campus[map.library.y][map.library.x], "B");
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
    [...points, ...map.coins].forEach(p => assert.ok(accessible.has(`${p.x},${p.y}`)));
  }
  const solution = map.guard ? solveGuardLevel(campus, start, map.guard) : solveLevel(campus, start);
  assert.ok(solution && solution.minimum >= config.minPath);
  assert.equal(map.moveLimit, solution.minimum + config.slack);
  let { x, y } = start; const found = new Set();
  let guardIndex = 0, guardDirection = 1;
  for (const [dx, dy] of solution.path) {
    x += dx; y += dy;
    assert.ok(!isBlockedTile(campus[y][x]));
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
const collisionSafeHashes = [
  "42ae8abc4c9df4c81396cf1c9b2dd3c00727405722696d48294d3e1f75a3a19b",
  "487434d608a1b2359181adfc062c6232c9a521a0ac065f4f0704fb1433b4e387",
  "2090e28a1d5e9df35c3521baf518062916e02999df4dc8fed4d1bdbd61b09acc",
  "67a3d9d8d0aff6a6eb94375c5c70ed6536a31979dd6f9bafc4f59142421685b9",
  "cdcd3d4218fd84d870ca59a0c96f5bd3130cc981582a8004b1d6d5929a126ff0",
  "39d628067e02f7f4d12c61451e099c3be93faa746ee0297e65737712bb4d3aad",
  "96f8ab79a26719278981aa533fd454d42d4697057ef853e292ecd1bdcc65109f",
  "885759dd7949ee7e29b966bc2fe7e9a82858c0556441cd8e40783de82afc0ebf",
  "8eb602c48767a3a2921e4294b987e09a474aaf77e694843d7c36f2fcf06fd1b7",
  "41c3d97984eee94f10f28c140a221843ebcf0b9f85e0549f5f30b457726e64ff",
  "5414d9e4f3cea0db2ae77cc13dbf68760282b036988bf4f8fd1a0100b4dbbb4b",
  "183ba9b18513cc0817b302077b09750b1d41af57b1b1c97f12b71a1a5c22bb13",
  "4e09afcd477cc19fdb67cdf64de12e1071948a61e08f8c0a7e891e7a17723144",
  "812f8be14ba7b64ca3ee09a5b65889383081e0a35bef679c5be61abe397bc40c",
  "d0b796a8e22f63686891d5b1c3168fe1dfc7698665bf87ee6d0f7ee86c67e5fd",
  "fc1bc66099619be7c0107f10704f15808540f399e698e304584c5e3f7b37b157",
  "a68e9265c5537fadf26484ee713c33750a16ff01eece70fcffa371ba0b4839db",
  "6d91be1b5d583ef1c5d863f72694efb94e60fe4da7d96926738f5a0561da3edb",
  "ce58c8d06d0b35ff11a37a1f78a9fb8b8a49c5de38cd77014ac250b992ff613c",
  "69e18a775b9921cdae5d003954a04387d98b83e48c095e0d9b96d2ae9b6a6be7",
];
collisionSafeHashes.forEach((expected, index) => {
  const level = index + 1, hash = createHash("sha256");
  for (let seed = 0; seed < 20; seed++) {
    const map = generateLevel(seed, level);
    hash.update(JSON.stringify(map)); verify(map, level);
  }
  const fallback = generateLevel(42, level, 0);
  hash.update(JSON.stringify(fallback)); verify(fallback, level);
  assert.equal(hash.digest("hex"), expected, `Level ${level} changed`);
});
console.log("PASS: levels 1–20 match all 420 collision-safe maps exactly.");

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
  "#..#.....#1#", "#..#.##.##.#", "##......#..#", "#..#.......#",
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
assert.equal(reachable(["#####", "#DB.#", "#####"], { x: 1, y: 1 }).length, 1);
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
