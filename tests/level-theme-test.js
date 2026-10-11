import assert from "node:assert/strict";
import { themeForLevel } from "../src/level-theme.js";

for (const [level, theme] of [
  [1, "campus"], [10, "campus"],
  [11, "cafeteria"], [20, "cafeteria"],
  [21, "night"], [30, "night"],
  [31, "campus"], [40, "campus"],
  [41, "cafeteria"], [50, "cafeteria"],
  [51, "night"], [60, "night"],
  [61, "campus"],
]) assert.equal(themeForLevel(level), theme, `Level ${level}`);

console.log("PASS: level themes repeat every 30 levels.");
