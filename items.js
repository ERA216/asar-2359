// Catalog data only. Effects and purchases are not implemented.
export const items = [
  { id: "extra-moves", name: "+2 хода", description: "Два дополнительных хода на сдачу проекта.", price: 5, type: "item", effect: "extra_moves_2" },
  { id: "door-key", name: "Ключ от двери", description: "Ключ от закрытой двери корпуса.", price: 8, type: "item", effect: "unlock_door" },
  { id: "distract-guard", name: "Отвлечь охранника", description: "Отвлечь охранника на короткое время.", price: 6, type: "item", effect: "distract_guard" },
  { id: "backpack-ochre", name: "Охристый рюкзак", description: "Тёплый охристый цвет рюкзака.", price: 12, type: "skin", effect: "backpack_ochre" },
  { id: "jacket-terracotta", name: "Терракотовая куртка", description: "Терракотовый цвет куртки студента.", price: 12, type: "skin", effect: "jacket_terracotta" },
];
