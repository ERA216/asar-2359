// Catalog data only. Behavior is implemented separately.
export const items = [
  { id: "extra-moves", name: "+2 хода", description: "Два дополнительных хода на сдачу проекта.", price: 5, type: "item", effect: "extra_moves_2" },
  { id: "door-key", name: "Ключ", description: "Следующий шаг может пройти во внутреннее препятствие. Один раз за раунд; внешние стены закрыты.", price: 8, type: "item", effect: "unlock_door" },
  { id: "guard-schedule", name: "Расписание охранника", description: "Показывает следующие три клетки патруля. Доступно с уровня 21.", price: 6, type: "item", effect: "guard_forecast", minLevel: 21 },
  { id: "campus-map", name: "Карта корпуса", description: "Подсвечивает кратчайший безопасный путь к одной недостающей части проекта.", price: 7, type: "item", effect: "part_route" },
  { id: "thermos", name: "Термокружка", description: "Вернёт один ход после сбора следующей части проекта. Один раз за раунд.", price: 6, type: "item", effect: "restore_next_part" },
  { id: "spare-sheet", name: "Запасной лист", description: "Поставьте заметную метку на выбранной проходимой клетке карты.", price: 3, type: "item", effect: "place_note" },
  { id: "backpack-ochre", name: "Охристый рюкзак", description: "Тёплый охристый цвет рюкзака.", price: 12, type: "skin", effect: "backpack_ochre" },
  { id: "jacket-terracotta", name: "Терракотовая куртка", description: "Терракотовый цвет куртки студента.", price: 12, type: "skin", effect: "jacket_terracotta" },
];
