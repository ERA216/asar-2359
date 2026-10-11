import assert from "node:assert/strict";
import { createIDosGamesClient } from "@idosgames/core";
import { generateLevel } from "../src/level-generator.js";
import { solveLevel } from "../src/level-solver.js";
import { solveGuardLevel } from "../src/guard.js";

const client = createIDosGamesClient({ titleID: "KJ56QZ5E-DEV" });
client.auth.setRememberSession(false);
const login = await client.auth.loginWithDeviceID();
assert.equal(login.ok, true, `DEV login: ${login.error || login.reason || "unknown"}`);
try {
  const call = async (handler, input) => {
    let response;
    for (let attempt = 0; attempt < 8; attempt++) {
      response = await client.cloudCode.execute(handler, input);
      if (response.reason !== "throttled") break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert.equal(response.ok, true, `${handler}: ${response.error || response.reason}`);
    assert.ok(!response.data?.Error, `${handler}: ${JSON.stringify(response.data?.Error)}`);
    return response.data.FunctionResult;
  };
  const started = await call("asarDevStart", {});
  const map = generateLevel(started.seed, started.level);
  const solution = map.guard
    ? solveGuardLevel(map.campus, map.start, map.guard)
    : solveLevel(map.campus, map.start);
  const moves = solution.path.map(([dx, dy]) =>
    dx === 1 ? "R" : dx === -1 ? "L" : dy === 1 ? "D" : "U").join("");
  const incomplete = await call("asarDevFinish", { roundId: started.roundId, moves: moves.slice(0, -1) });
  assert.deepEqual(incomplete, { valid: false, reason: "unfinished" });
  const finished = await call("asarDevFinish", { roundId: started.roundId, moves });
  assert.deepEqual(finished, {
    valid: true,
    rewardPreview: started.level < 15 ? 1 : 2,
    nextLevel: started.level + 1,
    granted: false,
  });
  const repeated = await call("asarDevFinish", { roundId: started.roundId, moves });
  assert.deepEqual(repeated, { valid: false, reason: "unknown_or_completed_round" });
  const next = await call("asarDevStart", {});
  assert.equal(next.level, started.level + 1);
  assert.notEqual(next.roundId, started.roundId);
  console.log(`DEV server route check passed: level ${started.level}, invalid route rejected, valid route accepted, replay rejected, next level issued, no reward granted.`);
} finally {
  client.auth.logout();
}
