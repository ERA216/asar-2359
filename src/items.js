// Catalog data only. Behavior is implemented separately.
export const items = [
  { id: "extra-moves", name: "+2 хода", description: "Два дополнительных хода на сдачу проекта.", price: 5, type: "item", effect: "extra_moves_2" },
  { id: "door-key", name: "Ключ", description: "Следующий шаг может пройти во внутреннее препятствие. Один раз за раунд; внешние стены закрыты.", price: 8, type: "item", effect: "unlock_door" },
  { id: "guard-schedule", name: "Расписание охранника", description: "Показывает следующие три клетки патруля. Доступно с уровня 21.", price: 6, type: "item", effect: "guard_forecast", minLevel: 21 },
  { id: "campus-map", name: "Карта корпуса", description: "Подсвечивает кратчайший безопасный путь к одной недостающей части проекта.", price: 7, type: "item", effect: "part_route" },
  { id: "thermos", name: "Термокружка", description: "Вернёт один ход после сбора следующей части проекта. Один раз за раунд.", price: 6, type: "item", effect: "restore_next_part" },
  { id: "spare-sheet", name: "Запасной лист", description: "Поставьте заметную метку на выбранной проходимой клетке карты.", price: 3, type: "item", effect: "place_note" },
  { id: "backpack-ochre", name: "Охристый рюкзак", description: "Дорожный ранец с кожаными ремнями, двумя карманами и латунной застёжкой.", price: 12, type: "skin", slot: "backpack", effect: "backpack_ochre" },
  { id: "backpack-olive", name: "Оливковый рюкзак", description: "Походный рюкзак со свёрнутым верхом, плотными лямками и светлой отделкой.", price: 14, type: "skin", slot: "backpack", effect: "backpack_olive" },
  { id: "jacket-terracotta", name: "Терракотовая куртка", description: "Куртка кампуса с кремовыми манжетами, контрастным воротником и нашивкой.", price: 12, type: "skin", slot: "jacket", effect: "jacket_terracotta" },
  { id: "jacket-stone", name: "Каменная куртка", description: "Светлый плащ с тёмными лацканами, длинным подолом и латунными пуговицами.", price: 14, type: "skin", slot: "jacket", effect: "jacket_stone" },
  { id: "cap-ochre", name: "Охристая шляпа", description: "Шляпа с широкими полями, светлой лентой и эмблемой кампуса.", price: 10, type: "skin", slot: "cap", effect: "cap_ochre" },
  { id: "glasses-scholar", name: "Очки отличника", description: "Тёмная оправа с золотыми петлями и бликами на линзах.", price: 8, type: "skin", slot: "glasses", effect: "glasses_scholar" },
];
