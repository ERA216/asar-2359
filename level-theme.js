const themes = ["campus", "cafeteria", "night"];

export function themeForLevel(level) {
  return themes[Math.floor((level - 1) / 10) % themes.length];
}
