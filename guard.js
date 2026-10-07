import { directions, reachable } from "./level-solver.js";

// Patrol lengths count cells, including the starting cell. A one-cell patrol stays put.
export const guardSettings = {
  firstLevel: 21,
  lengths: [
    { from: 21, min: 1, max: 2 },
    { from: 26, min: 2, max: 3 },
    { from: 31, min: 3, max: 4 },
    { from: 36, min: 4, max: 5 },
    { from: 41, min: 5, max: 5 },
  ],
  patrolAttempts: 200,
};

export function patrolLengths(level) {
  return guardSettings.lengths.findLast(range => level >= range.from) || guardSettings.lengths[0];
}

export const patrolPeriod = guard => Math.max(1, 2 * (guard.patrol.length - 1));

export function guardPosition(guard, turn) {
  const last = guard.patrol.length - 1;
  const phase = turn % patrolPeriod(guard);
  return guard.patrol[phase <= last ? phase : 2 * last - phase];
}

export function guardCollision(guard, player, turn) {
  if (!guard) return false;
  const position = guardPosition(guard, turn);
  return player.x === position.x && player.y === position.y;
}

// Same end-of-turn rule as gameplay: exchanging cells is allowed; sharing one is not.
// Repeated phases have identical futures, so time modulo the period bounds the BFS.
export function solveGuardLevel(campus, start, guard) {
  if (guardCollision(guard, start, 0)) return null;
  const width = campus[0].length, period = patrolPeriod(guard);
  const queue = [{ ...start, mask: 0, turn: 0, parent: -1 }];
  const seen = new Set([(start.y * width + start.x) * 8 * period]);
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (current.mask === 7 && campus[current.y][current.x] === "P") {
      const path = [];
      for (let index = head; queue[index].parent !== -1; index = queue[index].parent) {
        const node = queue[index], parent = queue[node.parent];
        path.push([node.x - parent.x, node.y - parent.y]);
      }
      path.reverse();
      return { minimum: path.length, path };
    }
    const turn = current.turn + 1;
    for (const [dx, dy] of directions) {
      const x = current.x + dx, y = current.y + dy, tile = campus[y]?.[x];
      if (!tile || tile === "#" || guardCollision(guard, { x, y }, turn)) continue;
      const mask = current.mask | (/^[123]$/.test(tile) ? 1 << (Number(tile) - 1) : 0);
      const key = ((y * width + x) * 8 + mask) * period + turn % period;
      if (!seen.has(key)) { seen.add(key); queue.push({ x, y, mask, turn, parent: head }); }
    }
  }
  return null;
}

export function addGuard(levelData, level, random, slack) {
  const { campus, start, coins, parts, printer, library } = levelData;
  const range = patrolLengths(level);
  const coinCells = new Set(coins.map(({ x, y }) => `${x},${y}`));
  const candidates = [];
  for (let length = range.min; length <= range.max; length++) {
    for (let y = 1; y < campus.length - 1; y++) for (let x = 1; x < campus[0].length - 1; x++) {
      for (const [dx, dy] of (length === 1 ? [[1, 0]] : [[1, 0], [0, 1]])) {
        const patrol = Array.from({ length }, (_, i) => ({ x: x + dx * i, y: y + dy * i }));
        if (patrol.every(p => campus[p.y]?.[p.x] === "." && !coinCells.has(`${p.x},${p.y}`))) candidates.push(patrol);
      }
    }
  }
  for (let attempt = 0; candidates.length && attempt < guardSettings.patrolAttempts; attempt++) {
    const index = Math.floor(random() * candidates.length);
    const [patrol] = candidates.splice(index, 1);
    // Even blocking the entire route must leave every objective and coin accessible.
    const blocked = campus.map(row => [...row]);
    patrol.forEach(({ x, y }) => { blocked[y][x] = "#"; });
    const accessible = new Set(reachable(blocked, start).map(({ x, y }) => `${x},${y}`));
    if (![...parts, printer, library, ...coins].every(({ x, y }) => accessible.has(`${x},${y}`))) continue;
    if (random() < .5) patrol.reverse();
    const guard = { patrol };
    const solution = solveGuardLevel(campus, start, guard);
    if (solution) return { ...levelData, guard, minimum: solution.minimum, moveLimit: solution.minimum + slack };
  }
  return null;
}
