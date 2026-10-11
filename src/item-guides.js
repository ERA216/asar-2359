import { directions } from "./level-solver.js";
import { guardCollision, guardPosition, patrolPeriod } from "./guard.js";

// Guidance reads the finished map. It never changes a tile or the level solver.
export function routeToPart(campus, start, target, guard = null, turn = 0) {
  const width = campus[0].length;
  const period = guard ? patrolPeriod(guard) : 1;
  const queue = [{ ...start, turn, parent: -1 }];
  const seen = new Set([(start.y * width + start.x) * period + turn % period]);
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (campus[current.y][current.x] === target) {
      const path = [];
      for (let index = head; queue[index].parent !== -1; index = queue[index].parent) {
        path.push({ x: queue[index].x, y: queue[index].y });
      }
      return path.reverse();
    }
    for (const [dx, dy] of directions) {
      const x = current.x + dx, y = current.y + dy, tile = campus[y]?.[x];
      const nextTurn = current.turn + 1;
      if (!tile || tile === "#" || guardCollision(guard, { x, y }, nextTurn)) continue;
      const key = (y * width + x) * period + nextTurn % period;
      if (!seen.has(key)) { seen.add(key); queue.push({ x, y, turn: nextTurn, parent: head }); }
    }
  }
  return null;
}

export function nearestPartRoute(campus, player, collected, guard, turn) {
  return ["1", "2", "3"]
    .filter(id => !collected.has(id))
    .map(id => ({ id, path: routeToPart(campus, player, id, guard, turn) }))
    .filter(result => result.path)
    .sort((a, b) => a.path.length - b.path.length || Number(a.id) - Number(b.id))[0] || null;
}

export function nextGuardCells(guard, turn, count = 3) {
  return Array.from({ length: count }, (_, index) => guardPosition(guard, turn + index + 1));
}
