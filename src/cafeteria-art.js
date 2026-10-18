// Cafeteria scenery is visual only. Every piece stays inside its original 64×64 tile.
const floor = '';
const shadow = '<path d="M8 55h48v4H8zM12 52h42v3H12z" fill="#60462E" opacity=".24" stroke="none"/>';

const tableFurniture = `
  <path d="M10 10h16v12H10zM38 10h16v12H38zM10 43h16v12H10zM38 43h16v12H38z" fill="#3D3027"/>
  <path d="M13 12h10v7H13zM41 12h10v7H41zM13 46h10v7H13zM41 46h10v7H41z" fill="#476D35" stroke="none"/>
  <path d="M14 13h8v2h-8zM42 13h8v2h-8zM14 47h8v2h-8zM42 47h8v2h-8z" fill="#88A66D" stroke="none"/>
  <path d="M10 20h3v4h-3zM23 20h3v4h-3zM38 20h3v4h-3zM51 20h3v4h-3zM10 52h3v5h-3zM23 52h3v5h-3zM38 52h3v5h-3zM51 52h3v5h-3z" fill="#604633" stroke="none"/>
  <path d="M14 17h8v1h-8zM42 17h8v1h-8zM14 51h8v1h-8zM42 51h8v1h-8z" fill="#294B2D" stroke="none"/>
  <path d="M7 19h50v27H7z" fill="#3D3027"/>
  <path d="M10 21h44v21H10z" fill="#557B46" stroke="none"/>
  <path d="M12 23h40v3H12zM12 27h2v12h-2z" fill="#88A66D" stroke="none"/>
  <path d="M12 40h40v2H12zM51 25h2v14h-2z" fill="#31532F" stroke="none"/>
  <path d="M16 27h32v1H16zM16 37h32v1H16z" fill="#75915D" opacity=".65" stroke="none"/>
  <path d="M17 44h4v5h-4zM43 44h4v5h-4z" fill="#463328" stroke="none"/>
  <path d="M10 44h7v5h-7zM47 44h7v5h-7z" fill="#6D4C35" stroke="none"/>`;
const tableSettings = [
  '<path d="M16 28h12v11H16zM37 28h12v11H37z" fill="#EEE1C3" stroke="none"/><path d="M18 30h8v7h-8zM39 30h8v7h-8z" fill="#B49364" stroke="none"/><path d="M20 31h4v4h-4zM41 31h4v4h-4z" fill="#729052" stroke="none"/><path d="M12 29h2v9h-2zM51 29h2v9h-2z" fill="#D8C89F" stroke="none"/>',
  '<path d="M18 28h10v10H18zM38 29h9v9h-9z" fill="#3B3228" stroke="none"/><path d="M20 30h6v6h-6zM40 31h5v5h-5z" fill="#E7D9BC" stroke="none"/><path d="M21 32h4v2h-4zM41 33h3v2h-3z" fill="#C99B4C" stroke="none"/><path d="M31 28h4v8h-4zM30 36h6v2h-6z" fill="#F1E5CA" stroke="none"/>',
  '<path d="M18 29h8v9h-8zM39 29h8v9h-8z" fill="#E9DCC0" stroke="none"/><path d="M19 31h6v1h-6zM19 34h4v1h-4zM40 31h6v1h-6zM40 34h5v1h-5z" fill="#B49364" stroke="none"/><path d="M30 30h5v6h-5zM36 33h3v2h-3z" fill="#D8BC85" stroke="none"/>',
];
const tableFinishing = `
  <path d="M9 20h46v2H9zM10 42h44v2H10z" fill="#B9875B" stroke="none"/>
  <path d="M13 23h38v1H13zM13 39h38v1H13z" fill="#F5E5BE" opacity=".8" stroke="none"/>
  <path d="M30 23h4v17h-4z" fill="#49623B" opacity=".85" stroke="none"/>
  <path d="M31 26h2v2h-2zM31 35h2v2h-2z" fill="#E6BE68" stroke="none"/>
  <path d="M15 30h1v7h-1zM28 30h1v7h-1zM35 30h1v7h-1zM49 30h1v7h-1z" fill="#E5D3AC" stroke="none"/>
  <path d="M12 12h11v1H12zM40 12h11v1H40zM12 46h11v1H12zM40 46h11v1H40z" fill="#A6BC82" stroke="none"/>
  <path d="M16 17h6v1h-6zM42 17h6v1h-6zM16 51h6v1h-6zM42 51h6v1h-6z" fill="#D4E1A9" stroke="none"/>`;
const diningTable = (hash, vertical) => `${floor}${shadow}<g${vertical ? ' transform="rotate(90 32 32)"' : ''}>${tableFurniture}${tableSettings[(hash >>> 5) % tableSettings.length]}${tableFinishing}</g>`;

const servingCounter = `${floor}${shadow}
  <path d="M5 11h54v43H5z" fill="#476D35"/>
  <path d="M8 14h48v19H8z" fill="#F5ECD5" stroke="none"/>
  <path d="M10 17h18v13H10zM35 17h18v13H35z" fill="#D8CBA5"/>
  <path d="M12 20h14v7H12zM37 20h14v7H37z" fill="#A77A50"/>
  <path d="M15 18h7v4h-7zM39 18h8v4h-8z" fill="#D9AA43" stroke="none"/>
  <path d="M7 9h50v3H7zM10 12h2v18h-2zM52 12h2v18h-2z" fill="#71543C" stroke="none"/>
  <path d="M13 15h15v2H13zM36 15h16v2H36zM13 23h11v1H13zM38 23h11v1H38z" fill="#FFF0D0" opacity=".72" stroke="none"/>
  <path d="M14 26h9v2h-9zM39 26h9v2h-9z" fill="#80523B" stroke="none"/>
  <path d="M15 25h3v2h-3zM19 25h4v2h-4zM40 25h3v2h-3zM44 25h3v2h-3z" fill="#D5A849" stroke="none"/>
  <path d="M28 19h7v2h-7z" fill="#A77A50" stroke="none"/>
  <path d="M4 32h56v6H4z" fill="#795539"/>
  <path d="M6 33h52v2H6z" fill="#C29468" stroke="none"/>
  <path d="M6 39h52v13H6z" fill="#557438" stroke="none"/>
  <path d="M9 42h46M12 49h40" stroke="#D8CBA5"/>
  <path d="M10 41h3v7h-3zM51 41h3v7h-3zM27 42h10v6H27z" fill="#355331" opacity=".65" stroke="none"/>
  <path d="M29 44h6v2h-6z" fill="#D1B984" stroke="none"/>
  <path d="M15 44h9v1h-9zM40 44h9v1h-9z" fill="#96A97B" stroke="none"/>
  <path d="M12 53h5v5h-5zM47 53h5v5h-5z" fill="#795539" stroke="none"/>
  <path d="M12 16h40v2H12zM12 18h2v13h-2zM50 18h2v13h-2z" fill="#FDF2D8" opacity=".8" stroke="none"/>
  <path d="M13 22h15v8H13zM36 22h15v8H36z" fill="#664932" stroke="none"/>
  <path d="M15 24h11v4H15zM38 24h11v4H38z" fill="#D5B07A" stroke="none"/>
  <path d="M16 24h4v2h-4zM21 24h4v2h-4zM39 24h4v2h-4zM44 24h4v2h-4z" fill="#E7C056" stroke="none"/>
  <path d="M8 34h48v2H8zM12 41h13v8H12zM39 41h13v8H39z" fill="#365630" stroke="none"/>
  <path d="M14 42h9v2h-9zM41 42h9v2h-9zM28 42h8v8h-8z" fill="#92A772" stroke="none"/>
  <path d="M30 44h4v3h-4zM13 47h11v1H13zM40 47h11v1H40z" fill="#E3C695" stroke="none"/>`;

const teaCart = `${floor}${shadow}
  <path d="M12 19h40v5H12zM10 42h44v6H10z" fill="#795539"/>
  <path d="M14 24h36v18H14z" fill="#557438"/>
  <path d="M17 27h30v11H17z" fill="#F5ECD5" stroke="none"/>
  <path d="M19 29h10v7H19zM34 29h10v7H34z" fill="#C3B58F"/>
  <path d="M21 31h6v4h-6zM36 31h6v4h-6z" fill="#A77A50" stroke="none"/>
  <path d="M20 8h24v11H20z" fill="#AEA184"/>
  <path d="M22 10h20v7H22z" fill="#D9AA43" stroke="none"/>
  <path d="M23 7h18v2H23zM24 11h14v2H24z" fill="#F5E3B8" stroke="none"/>
  <path d="M26 13h12v3H26z" fill="#725538" stroke="none"/>
  <text x="32" y="16" text-anchor="middle" font-size="5" fill="#F7E9C6" stroke="none">ЧАЙ</text>
  <path d="M17 27h6v7h-6zM25 27h5v7h-5zM34 27h5v7h-5zM41 27h6v7h-6z" fill="#E8D8B9" stroke="none"/>
  <path d="M19 29h2v3h-2zM27 29h1v3h-1zM36 29h1v3h-1zM43 29h2v3h-2z" fill="#A77A50" stroke="none"/>
  <path d="M12 20h40v2H12zM11 43h42v2H11z" fill="#B88960" stroke="none"/>
  <path d="M9 19h3v23H9zM52 19h3v23h-3z" fill="#55402E" stroke="none"/>
  <path d="M23 39h18v2H23z" fill="#D8BB87" stroke="none"/>
  <path d="M15 48h4v8h-4zM45 48h4v8h-4z" fill="#795539"/>
  <path d="M15 54h6v4h-6zM43 54h6v4h-6z" fill="#3C3429" stroke="none"/>
  <path d="M16 55h3v2h-3zM45 55h3v2h-3z" fill="#BBA68A" stroke="none"/>
  <path d="M14 55h7m22 0h7" stroke="#3C3429" stroke-width="2"/>`;

const coffeeMachine = `${floor}${shadow}
  <path d="M14 7h36v46H14z" fill="#3C3429"/>
  <path d="M17 10h30v38H17z" fill="#476D35" stroke="none"/>
  <path d="M20 13h24v14H20z" fill="#795539"/>
  <path d="M23 16h18v8H23z" fill="#D9AA43" stroke="none"/>
  <path d="M24 17h16v2H24zM26 21h7v1h-7z" fill="#F2DB9B" stroke="none"/>
  <path d="M25 20h14v3H25z" fill="#64472F" stroke="none"/>
  <text x="32" y="23" text-anchor="middle" font-size="5" fill="#F5E6BE" stroke="none">КОФЕ</text>
  <path d="M17 12h2v31h-2zM45 12h2v31h-2z" fill="#789364" opacity=".65" stroke="none"/>
  <path d="M22 26h3v2h-3zM27 26h3v2h-3zM39 26h3v2h-3z" fill="#D8B56F" stroke="none"/>
  <path d="M21 30h22v15H21z" fill="#25251E" stroke="none"/>
  <path d="M29 32h10v9H29z" fill="#F5ECD5"/>
  <path d="M39 34h4v5h-4" fill="none" stroke="#F5ECD5"/>
  <path d="M24 43h18v2H24zM27 46h13v2H27z" fill="#A58C6F" stroke="none"/>
  <path d="M30 33h7v5h-7zM37 34h2v3h-2z" fill="#F9EDCF" stroke="none"/>
  <path d="M31 39h7v1h-7zM22 45h21v1H22z" fill="#74523A" stroke="none"/>
  <path d="M31 27v5m4-5v5" stroke="#C3B58F"/>
  <path d="M17 49h30v4H17z" fill="#A77A50" stroke="none"/>
  <path d="M22 54h5v4h-5zM38 54h5v4h-5z" fill="#3C3429" stroke="none"/>
  <path d="M20 12h24v15H20z" fill="#6F5138" stroke="none"/>
  <path d="M22 14h20v11H22z" fill="#223D34" stroke="none"/>
  <path d="M24 16h16v2H24zM27 20h10v1H27z" fill="#C5D3A6" stroke="none"/>
  <path d="M23 27h4v3h-4zM30 27h4v3h-4zM37 27h4v3h-4z" fill="#D7B06C" stroke="none"/>
  <path d="M24 28h2v1h-2zM31 28h2v1h-2zM38 28h2v1h-2z" fill="#F7E5B8" stroke="none"/>
  <path d="M28 32h8v2h-8zM30 34h4v3h-4z" fill="#B8A184" stroke="none"/>
  <path d="M27 38h11v6H27z" fill="#F0E2C6" stroke="none"/>
  <path d="M38 39h3v3h-3z" fill="none" stroke="#F0E2C6"/>
  <path d="M29 40h7v2h-7z" fill="#8F5E3D" stroke="none"/>
  <path d="M21 45h22v3H21zM23 49h18v2H23z" fill="#7F6249" stroke="none"/>
  <path d="M25 46h2v1h-2zM30 46h2v1h-2zM35 46h2v1h-2z" fill="#CCB18B" stroke="none"/>`;

const drinksFridge = `${floor}${shadow}
  <path d="M9 4h46v55H9z" fill="#3E3028"/>
  <path d="M12 7h40v48H12z" fill="#3B633E" stroke="none"/>
  <path d="M16 11h32v36H16z" fill="#24372D"/>
  <path d="M18 13h28v32H18z" fill="#DCE7D9" stroke="none"/>
  <path d="M18 13h28v3H18zM18 43h28v3H18z" fill="#9AAB90" stroke="none"/>
  <path d="M17 7h30v4H17z" fill="#28462E" stroke="none"/>
  <text x="32" y="11" text-anchor="middle" font-size="5" fill="#F2E5BF" stroke="none">НАПИТКИ</text>
  <path d="M19 24h26v2H19zM19 35h26v2H19z" fill="#527451" stroke="none"/>
  <path d="M22 15h4v8h-4zM30 16h4v7h-4zM39 15h4v8h-4z" fill="#A36B4A" stroke="none"/>
  <path d="M23 15h2v2h-2zM31 16h2v2h-2zM40 15h2v2h-2z" fill="#E9C37B" stroke="none"/>
  <path d="M22 28h5v6h-5zM30 29h5v5h-5zM39 28h4v6h-4z" fill="#D9AA43" stroke="none"/>
  <path d="M22 39h6v4h-6zM31 39h6v4h-6zM40 39h4v4h-4z" fill="#8EA766" stroke="none"/>
  <path d="M22 18h1v4h-1zM31 19h1v3h-1zM40 18h1v4h-1zM22 31h4v1h-4zM31 31h3v1h-3zM40 30h3v1h-3z" fill="#F5E7BE" opacity=".7" stroke="none"/>
  <path d="M18 13v32M47 13v32" stroke="#FFF1CF" opacity=".7"/>
  <path d="M12 8h3v45h-3zM50 8h2v45h-2zM17 48h30v2H17z" fill="#76905F" stroke="none"/>
  <path d="M19 46h27v2H19zM20 49h24v1H20z" fill="#263A2D" stroke="none"/>
  <path d="M49 17h2v5h-2zM49 40h2v5h-2z" fill="#D4BD8E" stroke="none"/>
  <path d="M48 24h3v14h-3zM15 51h34v3H15z" fill="#D3BC8E" stroke="none"/>
  <path d="M17 13h30v33H17z" fill="#263B34" stroke="none"/>
  <path d="M19 15h26v29H19z" fill="#BBCDB8" stroke="none"/>
  <path d="M20 24h24v2H20zM20 34h24v2H20z" fill="#536E4E" stroke="none"/>
  <path d="M22 17h5v6h-5zM30 17h5v6h-5zM38 17h5v6h-5z" fill="#A9784D" stroke="none"/>
  <path d="M23 16h3v2h-3zM31 16h3v2h-3zM39 16h3v2h-3z" fill="#E3C785" stroke="none"/>
  <path d="M22 27h5v6h-5zM30 27h5v6h-5zM38 27h5v6h-5z" fill="#D5AC54" stroke="none"/>
  <path d="M23 29h3v2h-3zM31 29h3v2h-3zM39 29h3v2h-3z" fill="#F6E4B6" stroke="none"/>
  <path d="M22 37h5v6h-5zM30 37h5v6h-5zM38 37h5v6h-5z" fill="#6F9253" stroke="none"/>
  <path d="M23 39h3v2h-3zM31 39h3v2h-3zM39 39h3v2h-3z" fill="#D7E0B4" stroke="none"/>
  <path d="M19 15h2v29h-2zM44 15h1v29h-1z" fill="#F8F0D5" opacity=".7" stroke="none"/>
  <path d="M47 13h4v33h-4zM48 25h2v12h-2z" fill="#826342" stroke="none"/>
  <path d="M15 48h34v3H15zM19 52h26v2H19z" fill="#D1B58A" stroke="none"/>`;

const plantBody = right => `
  <path d="M10 43h44v5h-3v10H13V48h-3z" fill="#4A3428" stroke="none"/>
  <path d="M13 46h38v3h-2v7H15v-7h-2z" fill="#A87650" stroke="none"/>
  <path d="M15 47h34v2H15zM17 50h30v1H17z" fill="#D6A67A" stroke="none"/>
  <path d="M18 52h3v3h-3zM43 52h3v3h-3zM24 55h16v1H24z" fill="#775039" stroke="none"/>
  <path d="M17 43h30v3H17z" fill="#453529" stroke="none"/>
  <path d="M23 42h18v2H23z" fill="#7A6344" stroke="none"/>
  <path d="M30 29h4v15h-4zM23 32h3v3h5v3h-4v-2h-4zM34 34h5v-3h3v4h-4v3h-4z" fill="#684A31" stroke="none"/>
  <path d="M20 11h7V7h14v4h7v4h5v5h4v13h-4v6h-7v4H18v-4h-7v-6H7V20h4v-5h9z" fill="#28472A" stroke="none"/>
  <path d="M20 14h8v-4h12v4h7v5h6v13h-4v5h-8v4H20v-4h-7v-5h-3V22h4v-5h6z" fill="#3D6435" stroke="none"/>
  <path d="M21 15h8v-3h9v4h8v5h5v9h-4v6h-8v3H22v-4h-7v-5h-3v-7h5v-5h4z" fill="#5F7F47" stroke="none"/>
  <path d="M12 23h8v4h-3v4h-5zM20 34h8v5h-7v-2h-4v-2h3zM39 30h11v6h-6v3h-8v-4h3zM45 17h6v5h-5z" fill="#31582F" stroke="none"/>
  <path d="M18 19h8v-4h6v4h-3v3H18zM33 13h7v3h5v4h-9v-3h-3zM13 27h8v3h-5v3h-3zM29 25h9v4h-4v3h-8v-4h3zM42 25h9v3h-3v3h-6z" fill="#819B60" stroke="none"/>
  <path d="M21 16h5v2h-5zM35 15h5v2h-5zM16 28h5v2h-5zM30 26h5v2h-5zM43 26h5v2h-5zM23 35h6v2h-6z" fill="#A5B77A" stroke="none"/>
  <path d="M11 22h3v4h-3zM48 21h5v3h-5zM45 34h5v3h-5zM17 35h5v3h-5z" fill="#263F27" stroke="none"/>
  ${right
    ? '<path d="M35 21h6v2h-6zM25 30h4v2h-4zM46 31h3v2h-3z" fill="#B2BF81" stroke="none"/>'
    : '<path d="M24 21h6v2h-6zM39 29h5v2h-5zM16 32h4v2h-4z" fill="#B2BF81" stroke="none"/>'}`;

const menuBoard = `<path d="M4 5h54v46H4z" fill="#493327"/><path d="M7 8h48v40H7z" fill="#9A6F4D" stroke="none"/>
  <path d="M10 11h42v34H10z" fill="#315339" stroke="none"/><path d="M12 13h38v2H12z" fill="#507451" stroke="none"/>
  <text x="31" y="24" text-anchor="middle" font-size="9" fill="#E8D5A7" stroke="none">МЕНЮ</text>
  <path d="M16 29h13m5 0h11M16 34h19m4 0h6M16 39h15m6 0h8" stroke="#D8BD7B" stroke-width="1.2"/>
  <path d="M12 29h2v2h-2zM12 35h2v2h-2zM12 40h2v2h-2zM47 31h2v2h-2zM45 39h2v2h-2z" fill="#D5A85B" stroke="none"/>`;
// Draw the name as pixels so both halves of the two-tile sign align exactly.
const signGlyphs = {
  "С": ["01111", "11000", "10000", "10000", "10000", "11000", "01111"],
  "Т": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  "О": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  "Л": ["00111", "01001", "01001", "01001", "10001", "10001", "10001"],
  "В": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  "А": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  "Я": ["01111", "10001", "10001", "01111", "00101", "01001", "10001"],
};
const signPixels = [..."СТОЛОВАЯ"].flatMap((letter, index) => signGlyphs[letter].flatMap((row, y) =>
  [...row].flatMap((pixel, x) => pixel === "1" ? [`M${14 + index * 13 + x * 2} ${21 + y * 2}h2v2h-2z`] : []))).join("");
const entranceSign = `<path d="M2 5h124v45H2z" fill="#4D3529"/><path d="M5 8h118v39H5z" fill="#AB805D" stroke="none"/>
  <path d="M8 11h112v33H8z" fill="#E8D6B8" stroke="none"/><path d="M11 14h106v27H11z" fill="#F4E9CF" stroke="none"/>
  <path d="M14 17h6v2h-4v4h-2zM114 17h-6v2h4v4h2zM14 38h6v-2h-4v-4h-2zM114 38h-6v-2h4v-4h2z" fill="#A98865" stroke="none"/>
  <path d="M25 17h78v1H25zM25 38h78v1H25z" fill="#D1B17E" stroke="none"/>
  <path d="M8 24h2v8H8zM118 24h2v8h-2z" fill="#795539" stroke="none"/>
  <path d="${signPixels}" fill="#4A3529" stroke="none"/>`;
const topWindow = `<path d="M7 7h50v42H7z" fill="#4B3328"/><path d="M10 10h44v36H10z" fill="#A57855" stroke="none"/>
  <path d="M13 13h38v29H13z" fill="#EED5A6" stroke="none"/><path d="M15 15h16v12H15zM34 15h15v12H34zM15 30h16v10H15zM34 30h15v10H34z" fill="#F4E0B8" stroke="none"/>
  <path d="M32 13v29M13 28h38" stroke="#674631" stroke-width="3"/><path d="M16 16h2v10h-2zM35 16h2v10h-2z" fill="#FFF1D1" opacity=".65" stroke="none"/>
  <path d="M9 46h46v3H9zM13 49h38v2H13z" fill="#56392B" stroke="none"/>`;
const sideWindow = `<path d="M0 0h64v64H0z" fill="#B39C80" stroke="none"/><path d="M2 0h3v64H2zM59 0h3v64h-3z" fill="#71503A" stroke="none"/>
  <path d="M9 5h46v54H9z" fill="#694B38"/><path d="M12 8h40v48H12z" fill="#B38A64" stroke="none"/>
  <path d="M16 11h32v42H16z" fill="#51372B"/><path d="M19 14h26v36H19z" fill="#E5C893" stroke="none"/>
  <path d="M21 16h22v32H21z" fill="#F0D8A9" stroke="none"/><path d="M32 14v36M19 32h26" stroke="#704C35" stroke-width="3"/>
  <path d="M22 17h2v13h-2zM35 17h2v13h-2zM22 35h2v12h-2z" fill="#FFF2D1" opacity=".72" stroke="none"/>
  <path d="M13 56h38v3H13zM16 59h32v2H16z" fill="#52392C" stroke="none"/>`;
const bottomNotice = `<path d="M8 20h48v30H8z" fill="#4F382B"/><path d="M11 23h42v24H11z" fill="#315339" stroke="none"/>
  <path d="M15 26h34v18H15z" fill="#EADBBE" stroke="none"/><path d="M18 29h28v2H18zM18 35h20v2H18z" fill="#BDA981" stroke="none"/>
  <path d="M20 27h4v4h-4zM36 36h7v4h-7z" fill="#D1A450" stroke="none"/><path d="M18 42h29v1H18z" fill="#9B8265" stroke="none"/>`;

const servingCounterFinish = `
  <path d="M12 17h40v2H12zM11 31h42v2H11z" fill="#FFF1D2" opacity=".75" stroke="none"/>
  <path d="M14 21h13v10H14zM37 21h13v10H37z" fill="#694A33" stroke="none"/>
  <path d="M16 23h9v6h-9zM39 23h9v6h-9z" fill="#E3C186" stroke="none"/>
  <path d="M17 24h3v2h-3zM21 25h3v2h-3zM40 24h3v2h-3zM44 25h3v2h-3z" fill="#A86A3F" stroke="none"/>
  <path d="M18 23h5v1h-5zM40 23h5v1h-5z" fill="#F9E5AF" stroke="none"/>
  <path d="M15 36h34v2H15zM9 43h3v8H9zM52 43h3v8h-3z" fill="#E6CCA0" stroke="none"/>
  <path d="M19 42h11v1H19zM37 42h9v1h-9zM28 47h8v1h-8z" fill="#B9D19A" stroke="none"/>`;
const teaCartFinish = `
  <path d="M23 24h18v2H23zM27 26h10v11H27z" fill="#795539" stroke="none"/>
  <path d="M29 28h6v7h-6z" fill="#D9AA43" stroke="none"/>
  <path d="M26 30h3v4h-3zM37 29h4v5h-4z" fill="none" stroke="#795539" stroke-width="2"/>
  <path d="M29 29h6v2h-6zM31 25h2v2h-2zM30 37h4v1h-4z" fill="#F6E9C9" stroke="none"/>
  <path d="M17 39h30v2H17zM13 44h38v2H13zM18 49h7v1h-7zM39 49h7v1h-7z" fill="#E4C798" stroke="none"/>
  <path d="M18 27h5v1h-5zM41 27h5v1h-5z" fill="#FFF3D9" stroke="none"/>`;
const coffeeMachineFinish = `
  <path d="M18 12h2v32h-2zM44 12h2v32h-2z" fill="#A1B28A" stroke="none"/>
  <path d="M22 15h20v2H22zM23 24h18v2H23z" fill="#D8C99C" stroke="none"/>
  <path d="M25 28h3v3h-3zM30 28h3v3h-3zM35 28h3v3h-3z" fill="#3C3429" stroke="none"/>
  <path d="M26 29h1v1h-1zM31 29h1v1h-1zM36 29h1v1h-1z" fill="#F2C45C" stroke="none"/>
  <path d="M29 37h9v7h-9zM38 38h3v4h-3z" fill="#F5ECD5" stroke="none"/>
  <path d="M30 39h7v3h-7z" fill="#9B633E" stroke="none"/>
  <path d="M30 33h1v3h-1zM33 32h1v4h-1zM36 33h1v3h-1z" fill="#EEE0BA" opacity=".85" stroke="none"/>
  <path d="M21 48h22v2H21zM23 51h18v1H23z" fill="#C8AD87" stroke="none"/>`;
const drinksFridgeFinish = `
  <path d="M17 14h29v2H17zM17 44h29v2H17z" fill="#E8F0D8" stroke="none"/>
  <path d="M20 24h24v1H20zM20 34h24v1H20z" fill="#B8CEAB" stroke="none"/>
  <path d="M22 17h5v1h-5zM30 17h5v1h-5zM38 17h5v1h-5z" fill="#F7DE9D" stroke="none"/>
  <path d="M22 27h5v1h-5zM30 27h5v1h-5zM38 27h5v1h-5z" fill="#F9E7B6" stroke="none"/>
  <path d="M22 37h5v1h-5zM30 37h5v1h-5zM38 37h5v1h-5z" fill="#CFE1B1" stroke="none"/>
  <path d="M20 17h1v26h-1zM43 17h1v26h-1z" fill="#FFF7E0" opacity=".62" stroke="none"/>
  <path d="M49 24h3v15h-3zM50 26h1v11h-1z" fill="#E8D2A3" stroke="none"/>
  <path d="M13 53h38v2H13zM16 56h32v1H16z" fill="#795539" stroke="none"/>`;

function wallArt(x, y, size, hash, campus) {
  if (y === 0 || y === size - 1) {
    const top = y === 0;
    const panel = `<path d="M0 0h64v64H0z" fill="#B9A387" stroke="none"/>
      <path d="M0 0h64v4H0zM0 60h64v4H0zM0 0h3v64H0zM61 0h3v64h-3z" fill="#4C3429" stroke="none"/>
      <path d="M3 4h58v2H3zM3 58h58v2H3z" fill="#D8BB91" stroke="none"/>
      <path d="M0 ${top ? 52 : 8}h64v5H0z" fill="#684630" stroke="none"/>
      <path d="M3 ${top ? 53 : 9}h58v2H3z" fill="#BC956F" stroke="none"/>
      <path d="M0 ${top ? 57 : 13}h64v2H0z" fill="#557044" stroke="none"/>
      <path d="M9 3h46v1H9zM9 60h46v1H9z" fill="#F5E7C9" stroke="none"/>
      <path d="M7 8h2v2H7zM55 8h2v2h-2zM7 53h2v2H7zM55 53h2v2h-2z" fill="#8D694B" stroke="none"/>`;
    if (x === 0 || x === size - 1) return panel + '<path d="M5 6h3v49H5zM56 6h3v49h-3z" fill="#74523C" stroke="none"/>';
    if (top && x === Math.floor(size / 2) - 1) return panel + entranceSign;
    if (top && x === Math.floor(size / 2)) return panel + `<g transform="translate(-64 0)">${entranceSign}</g>`;
    if (top && x === Math.floor(size / 2) - 2) return panel + menuBoard;
    return panel + (top ? topWindow : bottomNotice);
  }
  if (x === 0 || x === size - 1) return y === size - 2 ? sideWindow + plantBody(x === size - 1) : sideWindow;
  const internalWall = (xx, yy) => xx > 0 && yy > 0 && xx < size - 1 && yy < size - 1 && campus[yy][xx] === '#';
  const horizontalPair = internalWall(x - 1, y) || internalWall(x + 1, y);
  const verticalPair = internalWall(x, y - 1) || internalWall(x, y + 1);
  if (horizontalPair || verticalPair) return diningTable(hash, verticalPair && !horizontalPair);
  return [
    diningTable(hash, true), diningTable(hash, false), servingCounter + servingCounterFinish, diningTable(hash, true),
    drinksFridge + drinksFridgeFinish, diningTable(hash, false), teaCart + teaCartFinish, coffeeMachine + coffeeMachineFinish,
  ][hash % 8];
}

export const cafeteriaBuffetArt = `${shadow}
  <path d="M8 18h48v40H8z" fill="#476D35"/>
  <path d="M11 21h42v18H11z" fill="#F5ECD5" stroke="none"/>
  <path d="M13 24h17v12H13zM34 24h17v12H34z" fill="#C3B58F"/>
  <path d="M16 28h10v5H16zM37 28h10v5H37z" fill="#D9AA43" stroke="none"/>
  <path d="M10 18h44v3H10zM13 22h16v1H13zM35 22h16v1H35z" fill="#D7BC8C" stroke="none"/>
  <path d="M18 27h6v2h-6zM39 27h6v2h-6z" fill="#F2DEA8" stroke="none"/>
  <path d="M7 39h50v5H7z" fill="#795539"/>
  <path d="M8 40h48v2H8z" fill="#B88960" stroke="none"/>
  <path d="M12 45h40v10H12z" fill="#557438" stroke="none"/>
  <path d="M14 48h9v5h-9zM41 48h9v5h-9z" fill="#385833" stroke="none"/>
  <path d="M26 46h12v8H26z" fill="#496940" stroke="none"/>
  <path d="M29 48h6v4h-6zM15 50h7v1h-7zM42 50h7v1h-7z" fill="#94AB76" stroke="none"/>
  <path d="M8 55h48v2H8z" fill="#3D3429" stroke="none"/>
  <path d="M9 17h46v3H9zM11 20h42v18H11z" fill="#6C4A32" stroke="none"/>
  <path d="M13 22h38v14H13z" fill="#E8D6B3" stroke="none"/>
  <path d="M14 23h17v11H14zM33 23h17v11H33z" fill="#AA845D" stroke="none"/>
  <path d="M16 29h13v3H16zM35 29h13v3H35z" fill="#694B37" stroke="none"/>
  <path d="M17 25h5v4h-5zM23 25h5v4h-5zM36 25h5v4h-5zM42 25h5v4h-5z" fill="#DAB45E" stroke="none"/>
  <path d="M19 24h3v2h-3zM25 24h3v2h-3zM38 24h3v2h-3zM44 24h3v2h-3z" fill="#F4DE9E" stroke="none"/>
  <path d="M15 22h2v12h-2zM49 22h2v12h-2zM17 22h30v1H17z" fill="#FFF0CF" opacity=".78" stroke="none"/>
  <path d="M8 38h48v4H8zM10 39h44v1H10z" fill="#B18358" stroke="none"/>
  <path d="M14 44h15v9H14zM35 44h15v9H35z" fill="#355831" stroke="none"/>
  <path d="M16 46h11v2H16zM37 46h11v2H37zM18 50h7v1h-7zM39 50h7v1h-7z" fill="#8DA86B" stroke="none"/>
  <path d="M30 44h4v9h-4z" fill="#A57A50" stroke="none"/>
  <path d="M13 21h38v2H13zM13 35h38v2H13z" fill="#FFF0CE" opacity=".8" stroke="none"/>
  <path d="M17 24h12v10H17zM35 24h12v10H35z" fill="#634833" stroke="none"/>
  <path d="M19 26h8v6h-8zM37 26h8v6h-8z" fill="#E4BE77" stroke="none"/>
  <path d="M20 27h3v2h-3zM24 28h2v2h-2zM38 27h3v2h-3zM42 28h2v2h-2z" fill="#B36F43" stroke="none"/>
  <path d="M15 39h34v2H15zM16 47h10v1H16zM38 47h10v1H38z" fill="#E8CDA0" stroke="none"/>
  <path d="M20 50h6v1h-6zM38 50h6v1h-6z" fill="#A8BF87" stroke="none"/>
  <path d="M26 6h12v11H26z" fill="#795539"/>
  <path d="M28 8h8v7h-8z" fill="#F5ECD5" stroke="none"/>
  <path d="M29 10h6v1h-6zM29 12h4v1h-4z" fill="#4E5E43" stroke="none"/>
  <path d="M30 4h4v2h-4z" fill="#D9AA43" stroke="none"/>`;

const entranceMat = '<path d="M10 43h44v15H10z" fill="#795539" opacity=".22" stroke="none"/><path d="M14 46h36v9H14z" fill="#557438" stroke="none"/><path d="M18 50h28" stroke="#D8CBA5"/>';
export function cafeteriaTileArt(tile, x, y, { campus, seed, level }) {
  const size = campus.length;
  let hash = ((seed >>> 0) ^ Math.imul(level, 0x9e3779b1) ^ Math.imul(x + 1, 0x85ebca6b) ^ Math.imul(y + 1, 0xc2b2ae35)) >>> 0;
  hash = Math.imul(hash ^ hash >>> 16, 0x7feb352d);
  hash = Math.imul(hash ^ hash >>> 15, 0x846ca68b);
  hash = (hash ^ hash >>> 16) >>> 0;
  if (tile === '#') return wallArt(x, y, size, hash, campus);
  if (tile === 'D') return entranceMat;
  return '';
}
