// The guard uses the player's pixel scale and face palette, with a distinct uniform.
const shadow = '<path d="M15 58h35v2H18v-1h-3z" fill="#795539" opacity=".22"/>';

const front = `<g class="guard-view guard-view--front">
  <g class="walk-leg--left">
    <path d="M22 46h11v10H21v-3h1z" fill="#222B30"/>
    <path d="M24 47h7v8h-7z" fill="#39464C"/>
    <path d="M21 54h11v4H19v-2h2z" fill="#262B2B"/>
    <path d="M21 57h11v1H21z" fill="#728080"/>
  </g>
  <g class="walk-leg--right">
    <path d="M33 46h11v9h2v2H33z" fill="#222B30"/>
    <path d="M35 47h7v8h-7z" fill="#344149"/>
    <path d="M34 54h11v1h2v3H34z" fill="#262B2B"/>
    <path d="M35 57h11v1H35z" fill="#728080"/>
  </g>
  <path d="M24 31h16v2h4v3h3v12h-6v2H23v-2h-6V36h3v-3h4z" fill="#222B30"/>
  <path d="M23 34h18v2h3v11h-5v2H25v-2h-5V36h3z" fill="#40535A"/>
  <path d="M21 38h4v9h-4zM40 38h4v9h-4z" fill="#566B71"/>
  <path d="M21 46h5v5h-5zM40 46h5v5h-5z" fill="#DCAA88"/>
  <path d="M22 32h8v3h-8zM36 32h8v3h-8z" fill="#263940"/>
  <path d="M23 33h6v1h-6zM37 33h6v1h-6z" fill="#BD985C"/>
  <path d="M27 33h10v5h-3v10h-4V38h-3z" fill="#263940"/>
  <path d="M29 34h6v3h-6zM31 38h2v10h-2z" fill="#D8CBA5"/>
  <path d="M22 45h20v4H22z" fill="#263238"/>
  <path d="M30 45h5v4h-5z" fill="#B99455"/>
  <path d="M36 37h5v7h-5z" fill="#2D4148"/>
  <path d="M37 38h3v4h-3z" fill="#D4AD64"/>
  <path d="M38 39h1v2h-1z" fill="#F2DCA8"/>
  <path d="M19 37h3v7h-3z" fill="#263238"/>
  <path d="M19 38h2v3h-2z" fill="#728080"/>
  <path d="M27 29h10v6H27z" fill="#302B27"/>
  <path d="M29 29h6v5h-6z" fill="#DCAA88"/>
  <path d="M24 18h16v2h3v11h-3v3H24v-3h-3V20h3z" fill="#493428"/>
  <path d="M25 21h14v2h2v8h-3v2H26v-2h-3v-8h2z" fill="#E6B38F"/>
  <path d="M25 23h4v7h-4z" fill="#F4CAA4"/>
  <path d="M23 26h3v5h-3zM39 26h2v5h-2z" fill="#D99D7B"/>
  <path d="M25 19h15v4h-4v2h-5v-2h-5v3h-3v-5h2z" fill="#4A392F"/>
  <path d="M27 26h3v3h-3zm8 0h3v3h-3z" fill="#302B27"/>
  <path d="M28 26h1v1h-1zm8 0h1v1h-1z" fill="#F4D4AF"/>
  <path d="M32 29h1v2h1v1h-3v-1h1z" fill="#B77F68"/>
  <path d="M29 33h7v1h-7z" fill="#754F3A"/>
  <path d="M26 9h12v2h4v2h3v8H19v-8h3v-2h4z" fill="#222B30"/>
  <path d="M27 11h10v2h4v2h2v4H21v-4h2v-2h4z" fill="#40535A"/>
  <path d="M25 12h5v2h-5zM26 15h12v1H26z" fill="#667982"/>
  <path d="M21 18h23v3H21z" fill="#263238"/>
  <path d="M17 20h30v3H17z" fill="#222B30"/>
  <path d="M20 21h26v1H20z" fill="#687981"/>
  <path d="M30 13h5v4h-5z" fill="#C29E5F"/>
  <path d="M32 14h1v2h-1z" fill="#F3DFAB"/>
</g>`;

const side = `<g class="guard-view guard-view--side">
  <g class="walk-leg--left">
    <path d="M27 46h10v10H26v-3h1z" fill="#222B30"/>
    <path d="M29 47h6v8h-6z" fill="#39464C"/>
    <path d="M26 54h11v4H24v-2h2z" fill="#262B2B"/>
    <path d="M26 57h11v1H26z" fill="#728080"/>
  </g>
  <g class="walk-leg--right">
    <path d="M36 46h10v10h2v2H35z" fill="#222B30"/>
    <path d="M38 47h6v8h-6z" fill="#344149"/>
    <path d="M37 55h11v3H35v-2h2z" fill="#262B2B"/>
    <path d="M37 57h11v1H37z" fill="#728080"/>
  </g>
  <path d="M25 32h18v3h4v13h-4v2H27v-2h-5V36h3z" fill="#222B30"/>
  <path d="M26 34h16v2h3v11h-4v2H28v-2h-4V36h2z" fill="#40535A"/>
  <path d="M27 37h5v10h-5zM40 38h4v8h-4z" fill="#566B71"/>
  <path d="M29 33h11v3h-8v4h-3z" fill="#263940"/>
  <path d="M34 36h3v11h-3z" fill="#D8CBA5"/>
  <path d="M25 45h19v4H25z" fill="#263238"/>
  <path d="M36 45h5v4h-5z" fill="#B99455"/>
  <path d="M42 38h5v6h-5z" fill="#2D4148"/>
  <path d="M43 39h3v3h-3z" fill="#D4AD64"/>
  <path d="M44 46h4v5h-4z" fill="#DCAA88"/>
  <path d="M26 36h3v8h-3z" fill="#263238"/>
  <path d="M33 30h7v5h-7z" fill="#DCAA88"/>
  <path d="M27 19h17v3h2v4h2v6h-4v2H31v-3h-3v-5h-1z" fill="#493428"/>
  <path d="M30 22h13v2h3v6h-2v3H32v-2h-3v-7h1z" fill="#E6B38F"/>
  <path d="M30 23h4v7h-4z" fill="#F4CAA4"/>
  <path d="M28 20h15v4h-4v2h-5v2h-5v-4h-1z" fill="#4A392F"/>
  <path d="M40 26h2v3h-2z" fill="#302B27"/>
  <path d="M45 29h2v2h-2zM40 32h5v1h-5z" fill="#B77F68"/>
  <path d="M27 10h13v2h4v3h3v6H24v-7h3z" fill="#222B30"/>
  <path d="M29 12h11v2h4v2h2v3H26v-4h3z" fill="#40535A"/>
  <path d="M27 18h20v3H27z" fill="#263238"/>
  <path d="M25 20h25v3H25z" fill="#222B30"/>
  <path d="M30 21h19v1H30z" fill="#687981"/>
  <path d="M36 14h5v4h-5z" fill="#C29E5F"/>
</g>`;

const back = `<g class="guard-view guard-view--back">
  <g class="walk-leg--left">
    <path d="M22 46h11v10H21v-3h1z" fill="#222B30"/>
    <path d="M24 47h7v8h-7z" fill="#39464C"/>
    <path d="M21 54h11v4H19v-2h2z" fill="#262B2B"/>
    <path d="M21 57h11v1H21z" fill="#728080"/>
  </g>
  <g class="walk-leg--right">
    <path d="M33 46h11v9h2v2H33z" fill="#222B30"/>
    <path d="M35 47h7v8h-7z" fill="#344149"/>
    <path d="M34 54h11v1h2v3H34z" fill="#262B2B"/>
    <path d="M35 57h11v1H35z" fill="#728080"/>
  </g>
  <path d="M24 31h16v2h4v3h3v12h-6v2H23v-2h-6V36h3v-3h4z" fill="#222B30"/>
  <path d="M23 34h18v2h3v11h-5v2H25v-2h-5V36h3z" fill="#40535A"/>
  <path d="M21 38h4v9h-4zM40 38h4v9h-4z" fill="#566B71"/>
  <path d="M21 46h5v5h-5zM40 46h5v5h-5z" fill="#DCAA88"/>
  <path d="M22 32h8v3h-8zM36 32h8v3h-8z" fill="#263940"/>
  <path d="M23 33h6v1h-6zM37 33h6v1h-6z" fill="#BD985C"/>
  <path d="M23 45h20v4H23z" fill="#263238"/>
  <path d="M30 45h5v4h-5z" fill="#B99455"/>
  <path d="M25 36h15v11H25z" fill="#344850"/>
  <path d="M27 38h11v7H27z" fill="#566B71"/>
  <path d="M30 39h5v5h-5z" fill="#263940"/>
  <path d="M31 40h3v3h-3z" fill="#D4AD64"/>
  <path d="M42 37h4v7h-4z" fill="#263238"/>
  <path d="M43 38h2v3h-2z" fill="#728080"/>
  <path d="M23 19h19v4h2v8h-3v3H24v-3h-3v-8h2z" fill="#302B27"/>
  <path d="M25 22h15v3h2v6h-3v2H26v-2h-2v-6h1z" fill="#61442F"/>
  <path d="M26 24h5v7h-5zM35 24h5v7h-5z" fill="#805E44"/>
  <path d="M26 9h12v2h4v2h3v8H19v-8h3v-2h4z" fill="#222B30"/>
  <path d="M27 11h10v2h4v2h2v4H21v-4h2v-2h4z" fill="#40535A"/>
  <path d="M25 12h5v2h-5zM26 15h12v1H26z" fill="#667982"/>
  <path d="M21 18h23v3H21z" fill="#263238"/>
  <path d="M18 20h29v3H18z" fill="#222B30"/>
  <path d="M20 21h26v1H20z" fill="#687981"/>
</g>`;

export const guardPixelArt = `${shadow}<g class="guard-body" stroke="none">${front}${side}${back}</g>`;
