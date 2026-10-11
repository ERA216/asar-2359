// DEV sandbox only. This verifies server-issued maps but deliberately grants
// no coins, crypto, IOUs or other resources.
import { verifyCompletedMap } from "../src/server-reward-verifier.js";

const ROUND_KEY = "asar_dev_round_v1";
const PROGRESS_KEY = "asar_dev_progress_v1";

function readRecord(data, key) {
  const value = data?.ReadOnly?.[key]?.Value;
  if (typeof value !== "string") return null;
  try { return JSON.parse(value); } catch { return null; }
}

function readState() {
  const result = server.GetUserCustomData();
  if (!result?.Success || !result.Data) throw new Error("Server state unavailable");
  return result.Data;
}

function writeRecord(key, value) {
  const result = server.SetUserCustomData("ReadOnly", key, JSON.stringify(value));
  if (!result?.Success) throw new Error("Could not save server state");
}

handlers.asarDevStart = function (_args, context) {
  if (!context?.UserID) throw new Error("Login required");
  const state = readState();
  const progress = readRecord(state, PROGRESS_KEY);
  const level = Number.isSafeInteger(progress?.nextLevel) && progress.nextLevel > 0
    ? progress.nextLevel : 1;
  let round = readRecord(state, ROUND_KEY);
  if (!round || round.level !== level || round.completed) {
    round = {
      id: Math.floor(Math.random() * 0x100000000).toString(36) + Date.now().toString(36),
      seed: Math.floor(Math.random() * 0x100000000),
      level,
      completed: false,
    };
    writeRecord(ROUND_KEY, round);
  }
  return { roundId: round.id, seed: round.seed, level: round.level };
};

handlers.asarDevFinish = function (args, context) {
  if (!context?.UserID) throw new Error("Login required");
  if (typeof args?.roundId !== "string" || typeof args?.moves !== "string")
    return { valid: false, reason: "invalid_input" };
  const state = readState();
  const round = readRecord(state, ROUND_KEY);
  if (!round || round.id !== args.roundId || round.completed)
    return { valid: false, reason: "unknown_or_completed_round" };
  const verdict = verifyCompletedMap(round.seed, round.level, args.moves);
  if (!verdict.valid) return verdict;
  writeRecord(ROUND_KEY, { ...round, completed: true });
  writeRecord(PROGRESS_KEY, { nextLevel: round.level + 1 });
  return { valid: true, rewardPreview: verdict.reward, nextLevel: round.level + 1, granted: false };
};
