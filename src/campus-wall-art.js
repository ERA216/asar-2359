// Wall artwork only. Every drawing stays inside an existing solid perimeter cell.
const boardFrame = '<path d="M9 7h46v50H9z" fill="#5E4435"/><path d="M11 9h42v46H11z" fill="#A77754"/><path d="M13 11h38v42H13z" fill="#E8D8B8"/><path d="M12 10h40v2H12z" fill="#D8B28A" stroke="none"/><path d="M10 55h44v2H10z" fill="#3E3029" stroke="none"/>';

const directory = `${boardFrame}
  <path d="M15 14h34v11H15z" fill="#70513D"/><text x="32" y="22" text-anchor="middle" font-size="5" stroke="none" fill="#F5ECD5">ФАКУЛЬТЕТ</text>
  <path d="M16 27h32v25H16z" fill="#F5EAD1"/>
  <path d="M18 32h28M18 38h28M18 44h28" stroke="#C5B092"/>
  <text x="19" y="31" font-size="4.5" stroke="none" fill="#4E5E43">IT И ДИЗАЙН</text>
  <text x="19" y="37" font-size="4.5" stroke="none" fill="#795539">МАТЕМАТИКА</text>
  <text x="19" y="43" font-size="4.5" stroke="none" fill="#4E5E43">АУД. 102–110</text>
  <text x="19" y="49" font-size="4.5" stroke="none" fill="#795539">ДЕКАНАТ 110</text>
  <path d="M46 17h2v2h-2zM17 17h2v2h-2z" fill="#D9AA43" stroke="none"/>`;

const timetable = `${boardFrame}
  <path d="M15 14h34v10H15z" fill="#73513D"/><text x="32" y="21" text-anchor="middle" font-size="5" stroke="none" fill="#F5ECD5">РАСПИСАНИЕ</text>
  <path d="M16 25h32v28H16z" fill="#F4E9CE"/>
  <path d="M17 33h30M17 39h30M17 45h30M17 51h30" stroke="#B5A287"/>
  <text x="18" y="31" font-size="4.2" stroke="none" fill="#4B3B30">08:30</text><text x="34" y="31" font-size="4.2" stroke="none" fill="#4E5E43">КОД</text><text x="46" y="31" text-anchor="end" font-size="4.2" stroke="none" fill="#795539">102</text>
  <text x="18" y="37" font-size="4.2" stroke="none" fill="#4B3B30">10:15</text><text x="34" y="37" font-size="4.2" stroke="none" fill="#4E5E43">МАТ</text><text x="46" y="37" text-anchor="end" font-size="4.2" stroke="none" fill="#795539">104</text>
  <text x="18" y="43" font-size="4.2" stroke="none" fill="#4B3B30">12:00</text><text x="34" y="43" font-size="4.2" stroke="none" fill="#4E5E43">ДИЗ</text><text x="46" y="43" text-anchor="end" font-size="4.2" stroke="none" fill="#795539">108</text>
  <text x="18" y="49" font-size="4.2" stroke="none" fill="#4B3B30">14:00</text><text x="34" y="49" font-size="4.2" stroke="none" fill="#4E5E43">ПР.</text><text x="46" y="49" text-anchor="end" font-size="4.2" stroke="none" fill="#795539">110</text>`;

// October 2026 starts on Thursday; the miniature calendar contains actual dates.
const calendarWeekdays = ["П", "В", "С", "Ч", "П", "С", "В"]
  .map((day, column) => `<text x="${19 + column * 4}" y="29" text-anchor="middle" font-size="3.2" stroke="none" fill="#795539">${day}</text>`).join("");
const calendarDates = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const slot = index + 3;
  const x = 19 + (slot % 7) * 4;
  const y = 34 + Math.floor(slot / 7) * 4;
  return `<text x="${x}" y="${y}" text-anchor="middle" font-size="3.2" stroke="none" fill="${day === 17 ? "#FFF4DC" : "#604F3E"}">${day}</text>`;
}).join("");

const calendar = `${boardFrame}
  <path d="M14 13h36v41H14z" fill="#694A37"/><path d="M16 14h32v10H16z" fill="#925A48"/>
  <path d="M18 25h30v27H18z" fill="#C4AE8E"/><path d="M17 24h30v27H17z" fill="#F6EBD1"/>
  <path d="M20 9h3v9h-3zM40 9h3v9h-3z" fill="#5B4A3B"/><path d="M21 10h1v7h-1zM41 10h1v7h-1z" fill="#E0CEAF" stroke="none"/>
  <text x="32" y="21" text-anchor="middle" font-size="5.2" stroke="none" fill="#F5ECD5">ОКТ 2026</text>
  <path d="M17 30h30M17 52h30" fill="none" stroke="#BCA98B"/>
  <path d="M37 39h5v4h-5z" fill="#A36D50" stroke="none"/>
  ${calendarWeekdays}${calendarDates}
  <path d="M18 52h29v2H18z" fill="#5E4435" stroke="none"/>`;

// The concentric stepped silhouettes keep the wooden rim and dial crisp at tile size.
const clock = `<path d="M29 3h7v2h3v5h-2v2H27v-2h-2V5h4z" fill="#41291F" stroke="none"/>
  <path d="M29 5h7v2h2v3h-3V8h-6v2h-2V7h2z" fill="#A87352" stroke="none"/>
  <path d="M31 7h3v3h-3z" fill="#C9C4B8" stroke="none"/>
  <path d="M25 10h14v2h6v3h4v4h3v5h2v7h1v8h-2v6h-3v5h-5v4h-6v2H25v-2h-6v-4h-5v-5h-3v-6h-2v-8h1v-7h2v-5h3v-4h4v-3h6z" fill="#3F281F" stroke="none"/>
  <path d="M25 13h14v2h6v3h4v5h2v7h1v8h-2v6h-3v5h-5v3H22v-3h-5v-5h-3v-6h-2v-8h1v-7h2v-5h4v-3h6z" fill="#8F583E" stroke="none"/>
  <path d="M25 15h14v2h5v3h4v5h2v6h1v7h-2v6h-4v4h-5v3H24v-3h-5v-4h-4v-6h-2v-7h1v-6h2v-5h4v-3h5z" fill="#BC8560" stroke="none"/>
  <path d="M24 17h16v2h5v4h3v6h2v10h-2v5h-4v4h-5v2H25v-2h-5v-4h-4v-5h-2V29h2v-6h3v-4h5z" fill="#6A412F" stroke="none"/>
  <path d="M25 20h14v2h5v4h2v5h1v7h-2v5h-4v4H23v-4h-4v-5h-2v-7h1v-5h2v-4h5z" fill="#E5D0A7" stroke="none"/>
  <path d="M26 21h12v2h5v4h2v5h1v6h-2v5h-4v3H24v-3h-4v-5h-2v-6h1v-5h2v-4h5z" fill="#F3E4C3" stroke="none"/>
  <path d="M17 25h2v-3h4v-3h3v-2h12v1h-11v3h-4v3h-3v4h-2zM14 32h1v8h2v5h3v4h4v2h15v1H23v-2h-5v-5h-3v-5h-1z" fill="#D5A078" stroke="none"/>
  <path d="M21 22h3v1h-3zM18 25h2v1h-2zM15 31h2v2h-2zM16 42h2v2h-2zM23 49h3v1h-3zM39 15h4v2h-4zM48 23h2v3h-2z" fill="#D8A17A" stroke="none"/>
  <path d="M27 24h1v2h-1zM36 24h1v2h-1zM23 28h2v1h-2zM40 28h2v1h-2zM21 31h2v1h-2zM42 31h2v1h-2zM21 37h2v1h-2zM42 37h2v1h-2zM23 40h2v1h-2zM40 40h2v1h-2zM27 43h1v2h-1zM36 43h1v2h-1z" fill="#352820" stroke="none"/>
  <text x="32" y="25" text-anchor="middle" font-size="5.8" font-weight="bold" fill="#30251F" stroke="none">12</text>
  <text x="43" y="37" text-anchor="middle" font-size="5.8" font-weight="bold" fill="#30251F" stroke="none">3</text>
  <text x="32" y="47" text-anchor="middle" font-size="5.8" font-weight="bold" fill="#30251F" stroke="none">6</text>
  <text x="21" y="37" text-anchor="middle" font-size="5.8" font-weight="bold" fill="#30251F" stroke="none">9</text>
  <path d="M32 26v10" fill="none" stroke="#30251F" stroke-width="1"/>
  <path d="M31 34h-2v-2h-2v-2h-3v-2h-2v3h2v2h3v3h4zM33 34h2v-2h2v-2h3v-2h2v3h-2v2h-3v3h-4z" fill="#292521" stroke="none"/>
  <path d="M30 33h4v4h-4z" fill="#292521" stroke="none"/><path d="M31 34h2v2h-2z" fill="#4A3A2C" stroke="none"/>`;

const studentNotices = `${boardFrame}
  <path d="M16 14h31v8H16z" fill="#566C58"/><text x="31" y="20" text-anchor="middle" font-size="5" stroke="none" fill="#F5ECD5">ОБЪЯВЛЕНИЯ</text>
  <path d="M16 26h19v23H16z" fill="#6C503C"/><path d="M17 25h19v23H17z" fill="#F5ECD5"/>
  <path d="M20 28h13v2H20z" fill="#A67551" stroke="none"/><path d="M20 34h12m-12 4h13m-13 4h9" stroke="#9C876D"/>
  <path d="M37 29h11v12H37z" fill="#D3B78E"/><path d="M39 31h7v2h-7zM39 36h6m-6 2h5" stroke="#6C795D"/>
  <path d="M38 44h9v6h-9z" fill="#A77754"/><path d="M40 46h5m-5 2h4" stroke="#F5E7C9"/>
  <path d="M24 24h3v3h-3zM41 28h3v3h-3z" fill="#D9AA43" stroke="none"/>`;

const eventPoster = `${boardFrame}
  <path d="M16 14h32v12H16z" fill="#455C4D"/><text x="32" y="22" text-anchor="middle" font-size="6" stroke="none" fill="#F5ECD5">СОБЫТИЯ</text>
  <path d="M17 28h30v23H17z" fill="#F5E8CA"/>
  <path d="M20 31h9v12h-9z" fill="#A77754"/><path d="M22 34h5v6h-5z" fill="#E6CAA0" stroke="none"/>
  <path d="M32 31h12v2H32zM32 36h10v1H32zM32 40h12v1H32zM32 44h8v1H32z" fill="#78634C" stroke="none"/>
  <path d="M19 47h25v2H19z" fill="#6D7B5B" stroke="none"/><path d="M19 51h28v2H19z" fill="#4C382D" stroke="none"/>
  <path d="M20 16h2v2h-2zM43 16h2v2h-2z" fill="#D9AA43" stroke="none"/>`;

export function sideWallDetailArt(isLeft, y) {
  const section = (y - 1) % 6;
  if (isLeft) return section === 0 ? directory : section === 2 ? timetable : studentNotices;
  return section === 0 ? clock : section === 2 ? calendar : eventPoster;
}

const bulletinFrame = `<path d="M6 17h52v32H6z" fill="#51392D"/>
  <path d="M8 19h48v27H8z" fill="#A47450"/><path d="M10 21h44v23H10z" fill="#BF956B"/>
  <path d="M8 19h48v2H8z" fill="#D8B28A" stroke="none"/><path d="M6 47h52v3H6z" fill="#624632" stroke="none"/>
  <path d="M9 45h46v2H9z" fill="#D6B188" stroke="none"/>`;

function note(x, y, width, height, accent) {
  const lines = height > 15 ? 3 : 2;
  const details = Array.from({ length: lines }, (_, row) =>
    `<path d="M${x + 2} ${y + 7 + row * 3}h${width - 4 - (row % 2 ? 2 : 0)}" stroke="#9D886E" stroke-width="1" fill="none"/>`).join("");
  return `<path d="M${x + 1} ${y + 2}h${width}v${height}h-${width}z" fill="#624632" opacity=".35" stroke="none"/>
    <path d="M${x} ${y}h${width}v${height}h-${width}z" fill="#F4E8CD"/>
    <path d="M${x + 2} ${y + 3}h${width - 4}v2h-${width - 4}z" fill="${accent}" stroke="none"/>
    ${details}<path d="M${x + Math.floor(width / 2) - 1} ${y - 1}h3v3h-3z" fill="#D9AA43" stroke="none"/>`;
}

const bulletinVariants = [
  note(12, 23, 12, 19, "#6B795D") + note(27, 24, 12, 18, "#A77754") + note(42, 22, 10, 20, "#7F6651"),
  note(12, 23, 23, 19, "#A16F52") + note(39, 24, 13, 12, "#6B795D") + '<path d="M40 39h11v4H40z" fill="#E6C48D"/><path d="M42 40h7" stroke="#795539"/>',
  '<path d="M12 23h17v20H12z" fill="#EAD7B5"/><path d="M14 25h13v4H14z" fill="#64775C"/><path d="M15 32h11m-11 4h11m-11 4h11M19 30v12m4-12v12" stroke="#9F8A6D"/>' + note(32, 23, 20, 19, "#A77754"),
  note(12, 24, 14, 18, "#7C8A70") + '<path d="M29 23h23v19H29z" fill="#E8D3A6"/><path d="M31 25h19v5H31z" fill="#A47754"/><path d="M33 33h15m-15 3h14m-14 3h10" stroke="#9B8060"/><path d="M39 22h3v3h-3z" fill="#D9AA43" stroke="none"/>',
  note(12, 24, 10, 17, "#A77754") + note(25, 23, 14, 19, "#6B795D") + note(42, 25, 10, 16, "#A16F52") + '<path d="M14 42h8v2h-8zM41 42h10v2H41z" fill="#D9AA43" stroke="none"/>',
];

// Vary only the drawing. The bulletin board stays on the same perimeter cell.
export function wallBulletinArt(x, y) {
  return bulletinFrame + bulletinVariants[(x + (y === 0 ? 0 : 2)) % bulletinVariants.length];
}
