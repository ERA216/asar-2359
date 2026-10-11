import { generateLevel } from "./level-generator.js";
import { guardCollision } from "./guard.js";
import { mapRewardLimit } from "./reward-policy.js";

const directions = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };

// Call only on the server with a seed and level from server-owned challenge state.
// This intentionally rejects item-assisted runs until item ownership is server-owned too.
export function verifyCompletedMap(seed, level, moves) {
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff ||
      !Number.isSafeInteger(level) || level < 1 ||
      typeof moves !== "string" || !/^[UDLR]+$/.test(moves)) {
    return { valid: false, reason: "invalid_input" };
  }

  const map = generateLevel(seed, level);
  if (moves.length > map.moveLimit) return { valid: false, reason: "move_limit" };
  const player = { ...map.start };
  const collected = new Set();

  for (let turn = 0; turn < moves.length; turn++) {
    const [dx, dy] = directions[moves[turn]];
    const x = player.x + dx, y = player.y + dy;
    const tile = map.campus[y]?.[x];
    if (!tile || tile === "#") return { valid: false, reason: "blocked_cell" };
    player.x = x;
    player.y = y;
    if (guardCollision(map.guard, player, turn + 1)) return { valid: false, reason: "guard_collision" };
    if (tile === "1" || tile === "2" || tile === "3") collected.add(tile);
    if (tile === "P" && collected.size === 3) {
      if (turn !== moves.length - 1) return { valid: false, reason: "moves_after_win" };
      return { valid: true, reward: mapRewardLimit(level, true) };
    }
  }

  return { valid: false, reason: "unfinished" };
}
