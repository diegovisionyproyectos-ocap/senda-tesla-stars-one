/* TESLA STARS ONE — generadores SVG de la identidad. Una sola fuente para la guía web y los archivos exportados. */
(function (root) {
  const C = {
    noche: '#0A1020', bobina: '#3B7BFF', bobinaTx: '#1F57D6', chispa: '#8FE3FF',
    ocre: '#E8894A', polvo: '#EEF1F7', nebulosa: '#8A93A8', marte: '#7A3A1E'
  };
  const FONT = "'Unbounded','Arial Black',system-ui,sans-serif";
  const BODY = "'IBM Plex Sans','Segoe UI',system-ui,sans-serif";
  const MONO = "'IBM Plex Mono',Consolas,monospace";
  // T con tronco de rayo y estrella de cuatro puntas sobre la órbita
  const T = 'M30 28H90V40H66L63 59H72L54 96L57.5 71H48L52.5 40H30Z';
  const STAR = 'M107 29C108 38 110 40 119 41C110 42 108 44 107 53C106 44 104 42 95 41C104 40 106 38 107 29Z';
  const smallStar = (x, y, r) => `M${x} ${y - r}C${x + r * .1} ${y - r * .2} ${x + r * .2} ${y - r * .1} ${x + r} ${y}C${x + r * .2} ${y + r * .1} ${x + r * .1} ${y + r * .2} ${x} ${y + r}C${x - r * .1} ${y + r * .2} ${x - r * .2} ${y + r * .1} ${x - r} ${y}C${x - r * .2} ${y - r * .1} ${x - r * .1} ${y - r * .2} ${x} ${y - r}Z`;
  let uid = 0;
  const SCHEMES = {
    dark: { orbit: C.bobina, mark: C.polvo, star: C.ocre, text: C.polvo, sub: C.ocre, line: C.bobina },
    light: { orbit: C.bobina, mark: C.noche, star: C.ocre, text: C.noche, sub: C.bobinaTx, line: C.bobina },
    monoLight: { orbit: '#FFFFFF', mark: '#FFFFFF', star: '#FFFFFF', text: '#FFFFFF', sub: '#FFFFFF', line: '#FFFFFF' },
    monoDark: { orbit: C.noche, mark: C.noche, star: C.noche, text: C.noche, sub: C.noche, line: C.noche },
    ocre: { orbit: C.noche, mark: C.noche, star: C.polvo, text: C.noche, sub: C.noche, line: C.noche }
  };
  function iconG(o) {
    const id = 'tso' + (++uid);
    return `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120"><rect width="120" height="120" fill="#fff"/><path d="${T}" fill="#000" stroke="#000" stroke-width="8" stroke-linejoin="round"/><path d="${STAR}" fill="#000" stroke="#000" stroke-width="6"/></mask></defs>` +
      `<g mask="url(#${id})"><ellipse cx="60" cy="60" rx="52" ry="19" transform="rotate(-22 60 60)" fill="none" stroke="${o.orbit}" stroke-width="5"/></g>` +
      `<path d="${T}" fill="${o.mark}" stroke="${o.mark}" stroke-width="1.5" stroke-linejoin="round"/><path d="${STAR}" fill="${o.star}"/>`;
  }
  const wrap = (vb, inner, label, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${w ? ` width="${w}" height="${h}"` : ''} role="img" aria-label="${label}">${inner}</svg>`;
  const S = k => SCHEMES[k] || k;

  function icon(k, size) { return wrap('0 0 120 120', iconG(S(k)), 'Símbolo de Tesla Stars One', size, size); }
  function horizontal(k) {
    const o = S(k);
    return wrap('0 0 560 120', `<g>${iconG(o)}</g>` +
      `<text x="140" y="68" font-family="${FONT}" font-weight="700" font-size="42" textLength="400" lengthAdjust="spacingAndGlyphs" fill="${o.text}">TESLA STARS</text>` +
      `<text x="141" y="104" font-family="${FONT}" font-weight="500" font-size="20" letter-spacing="12" fill="${o.sub}">ONE</text>` +
      `<path d="M252 97H520" stroke="${o.line}" stroke-width="2"/><path d="${smallStar(536, 97, 9)}" fill="${o.star}"/>`, 'Tesla Stars One');
  }
  function vertical(k) {
    const o = S(k);
    return wrap('0 0 420 320', `<g transform="translate(132 0) scale(1.3)">${iconG(o)}</g>` +
      `<text x="210" y="228" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="42" textLength="390" lengthAdjust="spacingAndGlyphs" fill="${o.text}">TESLA STARS</text>` +
      `<path d="M40 268H160M260 268H380" stroke="${o.line}" stroke-width="2"/>` +
      `<text x="216" y="276" text-anchor="middle" font-family="${FONT}" font-weight="500" font-size="22" letter-spacing="12" fill="${o.sub}">ONE</text>`, 'Tesla Stars One');
  }
  function wordmark(k) {
    const o = S(k);
    return wrap('0 0 420 100', `<text x="0" y="48" font-family="${FONT}" font-weight="700" font-size="42" textLength="410" lengthAdjust="spacingAndGlyphs" fill="${o.text}">TESLA STARS</text>` +
      `<text x="1" y="88" font-family="${FONT}" font-weight="500" font-size="20" letter-spacing="12" fill="${o.sub}">ONE</text><path d="M112 81H390" stroke="${o.line}" stroke-width="2"/><path d="${smallStar(405, 81, 9)}" fill="${o.star}"/>`, 'Tesla Stars One');
  }
  // campo de estrellas determinista
  function stars(w, h, n, seed) {
    let s = seed || 7, out = '';
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < n; i++) { const x = r() * w, y = r() * h, z = r(); out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + z * 1.8).toFixed(2)}" fill="${z > .93 ? C.chispa : C.polvo}" opacity="${(0.25 + z * .6).toFixed(2)}"/>`; }
    return out;
  }
  function marsDisc(cx, cy, r, id) {
    return `<defs><radialGradient id="${id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#F0A46A"/><stop offset=".55" stop-color="${C.ocre}"/><stop offset="1" stop-color="${C.marte}"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
  }
  function avatar() {
    return wrap('0 0 400 400', `<circle cx="200" cy="200" r="200" fill="${C.noche}"/>${stars(400, 400, 26, 3)}<g transform="translate(56 56) scale(2.4)">${iconG(SCHEMES.dark)}</g>`, 'Avatar de Tesla Stars One', 400, 400);
  }
  function instagram() {
    const id = 'mi' + (++uid);
    return wrap('0 0 1080 1350', `<rect width="1080" height="1350" fill="${C.noche}"/>${stars(1080, 1350, 150, 11)}${marsDisc(930, 1290, 430, id)}` +
      `<ellipse cx="930" cy="1290" rx="560" ry="150" transform="rotate(-18 930 1290)" fill="none" stroke="${C.bobina}" stroke-width="4" opacity=".9"/>` +
      `<g transform="translate(80 80) scale(1.25)">${iconG(SCHEMES.dark)}</g>` +
      `<text x="80" y="420" font-family="${MONO}" font-size="26" letter-spacing="4" fill="${C.chispa}">NASA SPACE APPS CHALLENGE 2026</text>` +
      `<text font-family="${FONT}" font-weight="700" font-size="72" fill="${C.polvo}"><tspan x="80" y="530">Rumbo a Marte</tspan><tspan x="80" y="625">con datos</tspan><tspan x="80" y="720" fill="${C.ocre}">abiertos</tspan></text>` +
      `<text font-family="${BODY}" font-size="34" fill="${C.polvo}" opacity=".85"><tspan x="80" y="820">Proyecto Senda: una consola de</tspan><tspan x="80" y="866">inteligencia para planear caminatas</tspan><tspan x="80" y="912">seguras en la superficie marciana.</tspan></text>` +
      `<g transform="translate(80 1190) scale(.82)">${horizontal('dark').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`, 'Post de Instagram: Rumbo a Marte con datos abiertos', 1080, 1350);
  }
  function cover() {
    const id = 'mc' + (++uid);
    return wrap('0 0 1920 1080', `<rect width="1920" height="1080" fill="${C.noche}"/>${stars(1920, 1080, 220, 5)}${marsDisc(1460, 540, 300, id)}` +
      `<ellipse cx="1460" cy="540" rx="430" ry="120" transform="rotate(-22 1460 540)" fill="none" stroke="${C.bobina}" stroke-width="5"/>` +
      `<path d="${smallStar(1858, 380, 26)}" fill="${C.polvo}"/>` +
      `<text x="120" y="250" font-family="${MONO}" font-size="28" letter-spacing="4" fill="${C.chispa}">NASA SPACE APPS CHALLENGE 2026</text>` +
      `<text x="114" y="470" font-family="${FONT}" font-weight="700" font-size="190" fill="${C.polvo}">Senda</text>` +
      `<text font-family="${BODY}" font-size="46" fill="${C.polvo}" opacity=".88"><tspan x="120" y="570">Consola de inteligencia de superficie</tspan><tspan x="120" y="630">para caminatas tripuladas en Marte</tspan></text>` +
      `<path d="M120 700H260" stroke="${C.ocre}" stroke-width="6"/>` +
      `<g transform="translate(120 880) scale(1.05)">${horizontal('dark').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`, 'Portada de presentación del proyecto Senda', 1920, 1080);
  }
  function badge() {
    return wrap('0 0 600 900', `<rect x="4" y="4" width="592" height="892" rx="36" fill="${C.polvo}" stroke="#D5DAE4" stroke-width="2"/>` +
      `<path d="M4 40A36 36 0 0 1 40 4H560A36 36 0 0 1 596 40V360H4Z" fill="${C.noche}"/>${stars(600, 360, 40, 9).replace(/<circle/g, '<circle clip-path="none"')}` +
      `<rect x="250" y="34" width="100" height="18" rx="9" fill="${C.polvo}" opacity=".9"/>` +
      `<g transform="translate(225 96) scale(1.25)">${iconG(SCHEMES.dark)}</g>` +
      `<text x="300" y="320" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="30" letter-spacing="3" fill="${C.polvo}">TESLA STARS ONE</text>` +
      `<rect x="4" y="360" width="16" height="536" fill="${C.bobina}"/>` +
      `<text x="64" y="470" font-family="${FONT}" font-weight="700" font-size="44" fill="${C.noche}">Nombre</text><text x="64" y="530" font-family="${FONT}" font-weight="700" font-size="44" fill="${C.noche}">Apellido</text>` +
      `<text x="64" y="596" font-family="${BODY}" font-weight="600" font-size="30" fill="${C.bobinaTx}">Líder de equipo</text>` +
      `<path d="M64 650H536" stroke="#D5DAE4" stroke-width="2"/>` +
      `<text x="64" y="706" font-family="${MONO}" font-size="22" letter-spacing="2" fill="#5A6478">PROYECTO</text><text x="64" y="746" font-family="${BODY}" font-weight="600" font-size="30" fill="${C.noche}">Senda · Marte</text>` +
      `<text x="64" y="830" font-family="${MONO}" font-size="20" letter-spacing="2" fill="#5A6478">NASA SPACE APPS CHALLENGE 2026</text>` +
      `<path d="${smallStar(530, 822, 14)}" fill="${C.ocre}"/>`, 'Credencial del equipo', 600, 900);
  }
  function senda(k) {
    const o = S(k);
    return wrap('0 0 640 120', `<text x="0" y="82" font-family="${FONT}" font-weight="700" font-size="76" fill="${o.text}">Senda</text>` +
      `<path d="M300 22V98" stroke="${o.line}" stroke-width="2"/>` +
      `<text x="330" y="42" font-family="${MONO}" font-size="15" letter-spacing="3" fill="${o.sub}">UN PROYECTO DE</text>` +
      `<g transform="translate(330 52) scale(.5)">${iconG(o)}</g>` +
      `<text x="400" y="96" font-family="${FONT}" font-weight="700" font-size="22" textLength="230" lengthAdjust="spacingAndGlyphs" fill="${o.text}">TESLA STARS ONE</text>`, 'Senda, un proyecto de Tesla Stars One');
  }
  const api = { C, SCHEMES, icon, horizontal, vertical, wordmark, avatar, instagram, cover, badge, senda };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TSO = api;
})(typeof window !== 'undefined' ? window : globalThis);
