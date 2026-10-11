export const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

export function reachable(campus, start) {
  const seen = new Set([`${start.x},${start.y}`]);
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const { x, y } = queue[head];
    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
      if (campus[ny]?.[nx] && campus[ny][nx] !== "#" && !seen.has(key)) {
        seen.add(key); queue.push({ x: nx, y: ny });
      }
    }
  }
  return queue;
}

// BFS states include the three collected parts. Passing the printer early is legal.
export function solveLevel(campus, start) {
  const width = campus[0].length;
  const queue = [{ ...start, mask: 0, parent: -1 }];
  const seen = new Set([((start.y * width + start.x) * 8)]);
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
    for (const [dx, dy] of directions) {
      const x = current.x + dx, y = current.y + dy, tile = campus[y]?.[x];
      if (!tile || tile === "#") continue;
      const mask = current.mask | (/^[123]$/.test(tile) ? 1 << (Number(tile) - 1) : 0);
      const key = (y * width + x) * 8 + mask;
      if (!seen.has(key)) { seen.add(key); queue.push({ x, y, mask, parent: head }); }
    }
  }
  return null;
}
