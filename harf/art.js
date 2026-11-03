// Draws the dictionary-style word print and the hoodie around it. Used by the site and the print renderer.
const HARF_COLORS = {
  black: { cloth: "#1F1F21", shade: "#0E0E10", hi: "#3a3a40", ink: "#F3E9D2", accent: "#E9B44C" },
  cream: { cloth: "#E7DBC2", shade: "#C9BB9E", hi: "#F6EEDC", ink: "#1B1B1B", accent: "#8B2E2E" },
  olive: { cloth: "#4A5138", shade: "#323726", hi: "#5f6847", ink: "#F3E9D2", accent: "#E9B44C" },
};

function harfEscape(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// The print as SVG markup in a 700x800 box (14x16 in). word: { roman, ur, pos, def }
function harfPrint(word, colorName) {
  const C = HARF_COLORS[colorName] || HARF_COLORS.black;
  const roman = harfEscape((word.roman || "").toLowerCase());
  const big = word.ur
    ? `<text x="350" y="400" text-anchor="middle" direction="rtl" font-family="Noto Nastaliq Urdu" font-weight="700" font-size="${Math.min(200, Math.round(1000 / Math.max(word.ur.length, 3)))}" fill="${C.ink}">${harfEscape(word.ur)}</text>`
    : `<text x="350" y="400" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="${roman.length > 8 ? 130 : 170}" fill="${C.ink}">${roman}</text>`;
  const def = harfEscape(word.def || "");
  const lines = def.length > 22 ? harfWrap(def, 22) : [def];
  return `
    ${big}
    <text x="350" y="545" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="40" letter-spacing="7" fill="${C.ink}">${roman}<tspan fill="${C.accent}" font-weight="400" dx="14">${harfEscape(word.pos || "n.")}</tspan></text>
    <rect x="310" y="575" width="80" height="5" rx="2.5" fill="${C.accent}"/>
    ${lines.map((l, i) => `<text x="350" y="${645 + i * 56}" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="54" fill="${C.ink}">${l}</text>`).join("")}`;
}

function harfWrap(text, max) {
  const out = [""];
  for (const w of text.split(" ")) {
    if ((out[out.length - 1] + " " + w).trim().length > max) out.push(w);
    else out[out.length - 1] = (out[out.length - 1] + " " + w).trim();
  }
  return out;
}

// Drop-shoulder hoodie, "back" (with the print) or "front" (pocket, strings, small chest mark).
function harfHoodie(view, colorName, word, id) {
  const C = HARF_COLORS[colorName] || HARF_COLORS.black;
  const g = "hg" + id;
  const parts = `
    <defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${C.shade}"/><stop offset=".22" stop-color="${C.cloth}"/><stop offset=".78" stop-color="${C.cloth}"/><stop offset="1" stop-color="${C.shade}"/></linearGradient></defs>
    <path d="M300 210 C220 228 172 262 158 335 L92 878 L210 896 L262 470 Z" fill="url(#${g})" stroke="${C.shade}" stroke-width="3"/>
    <path d="M700 210 C780 228 828 262 842 335 L908 878 L790 896 L738 470 Z" fill="url(#${g})" stroke="${C.shade}" stroke-width="3"/>
    <path d="M92 878 L210 896 L203 958 L84 941 Z M908 878 L790 896 L797 958 L916 941 Z" fill="${C.shade}"/>
    <path d="M300 210 L700 210 C742 260 762 330 762 420 L766 945 L234 945 L238 420 C238 330 258 260 300 210 Z" fill="url(#${g})" stroke="${C.shade}" stroke-width="3"/>
    <path d="M234 945 L766 945 L766 1008 L234 1008 Z" fill="${C.shade}"/>
    <path d="M262 470 C250 600 246 760 240 930 M738 470 C750 600 754 760 760 930" stroke="${C.shade}" stroke-width="4" fill="none" opacity=".6"/>`;
  const back = `
    <path d="M352 232 C338 92 662 92 648 232 C600 262 400 262 352 232 Z" fill="url(#${g})" stroke="${C.shade}" stroke-width="3"/>
    <path d="M500 112 L500 246" stroke="${C.shade}" stroke-width="3"/>
    <svg x="320" y="300" width="360" height="411" viewBox="0 0 700 800">${harfPrint(word, colorName)}</svg>`;
  const front = `
    <path d="M330 215 C330 118 670 118 670 215 C640 300 360 300 330 215 Z" fill="${C.cloth}" stroke="${C.shade}" stroke-width="3"/>
    <path d="M380 222 C420 292 580 292 620 222 C588 246 412 246 380 222 Z" fill="${C.shade}"/>
    <path d="M440 268 L432 430 M560 268 L568 430" stroke="${C.hi}" stroke-width="7" stroke-linecap="round"/>
    <path d="M338 690 L662 690 L702 868 L298 868 Z" fill="none" stroke="${C.shade}" stroke-width="5"/>
    <text x="610" y="380" text-anchor="middle" font-family="Noto Nastaliq Urdu" font-weight="700" font-size="44" fill="${C.accent}">حرف</text>`;
  return `<svg viewBox="70 80 860 940" xmlns="http://www.w3.org/2000/svg">${parts}${view === "front" ? front : back}</svg>`;
}

// Abstract line: retro sunset, wavy circle, orbit. Same 700x800 print box as harfPrint.
const HARF_ABSTRACT = {
  sunset: { title: "golden hour", def: "a retro sun that never quite sets" },
  waves:  { title: "calm chaos",  def: "a hundred lines that can't sit still" },
  orbit:  { title: "out of orbit", def: "drifting, and fine with it" },
};

function harfAbstract(name, colorName) {
  const C = HARF_COLORS[colorName] || HARF_COLORS.black;
  const caption = (t, y) => `<text x="350" y="${y}" text-anchor="middle" font-family="Space Mono" font-weight="700" font-size="34" letter-spacing="12" fill="${C.ink}">${t.toUpperCase()}</text>`;
  if (name === "sunset") {
    // Sun cut by stripes that thicken towards the horizon, with hills in front
    let stripes = "";
    for (let i = 0; i < 7; i++) {
      const y = 300 + i * 26 + i * i * 1.6, h = 3 + i * 2.6;
      stripes += `<rect x="0" y="${y}" width="700" height="${h}" fill="#000"/>`;
    }
    return `
      <defs><mask id="sm-${colorName}"><rect width="700" height="800" fill="#fff"/>${stripes}</mask>
        <clipPath id="sc-${colorName}"><rect x="0" y="0" width="700" height="470"/></clipPath></defs>
      <circle cx="350" cy="330" r="200" fill="${C.accent}" mask="url(#sm-${colorName})" clip-path="url(#sc-${colorName})"/>
      <path d="M90 470 C190 400 260 430 330 455 C410 482 470 405 610 470" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>
      <path d="M130 510 C230 480 300 500 370 515 C450 532 520 492 580 510" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
      <path d="M200 546 C280 530 330 540 380 548 C430 556 470 538 510 546" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" opacity=".45"/>
      ${caption("golden hour", 650)}`;
  }
  if (name === "waves") {
    // Sine lines with drifting phase, clipped to a circle
    let lines = "";
    for (let i = 0; i < 26; i++) {
      const y0 = 140 + i * 16;
      let d = `M60 ${y0}`;
      for (let x = 60; x <= 640; x += 10) {
        const y = y0 + Math.sin(x / 52 + i * 0.16) * 20 + Math.sin(x / 23 + i * 0.3) * 4;
        d += ` L${x} ${y.toFixed(1)}`;
      }
      lines += `<path d="${d}" fill="none" stroke="${i % 6 === 3 ? C.accent : C.ink}" stroke-width="${i % 6 === 3 ? 6 : 3.4}" stroke-linecap="round"/>`;
    }
    return `
      <defs><clipPath id="wc-${colorName}"><circle cx="350" cy="350" r="230"/></clipPath></defs>
      <g clip-path="url(#wc-${colorName})">${lines}</g>
      <circle cx="350" cy="350" r="236" fill="none" stroke="${C.ink}" stroke-width="5"/>
      ${caption("calm chaos", 670)}`;
  }
  // orbit: a planet, a tilted ring passing behind and in front, and a few sparkles
  const spark = (x, y, r) => `<path d="M${x} ${y - r} L${x + r * .22} ${y - r * .22} L${x + r} ${y} L${x + r * .22} ${y + r * .22} L${x} ${y + r} L${x - r * .22} ${y + r * .22} L${x - r} ${y} L${x - r * .22} ${y - r * .22} Z" fill="${C.accent}"/>`;
  return `
    <defs>
      <clipPath id="ob-${colorName}"><rect x="0" y="0" width="700" height="340"/></clipPath>
      <clipPath id="of-${colorName}"><rect x="0" y="340" width="700" height="460"/></clipPath>
    </defs>
    <g transform="rotate(-14 350 340)"><ellipse cx="350" cy="340" rx="290" ry="74" fill="none" stroke="${C.ink}" stroke-width="7" clip-path="url(#ob-${colorName})"/></g>
    <circle cx="350" cy="340" r="150" fill="${C.ink}"/>
    <circle cx="350" cy="340" r="150" fill="none" stroke="${C.accent}" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>
    <g transform="rotate(-14 350 340)"><ellipse cx="350" cy="340" rx="290" ry="74" fill="none" stroke="${C.ink}" stroke-width="7" clip-path="url(#of-${colorName})"/></g>
    ${spark(140, 160, 34)}${spark(585, 520, 26)}${spark(555, 150, 14)}${spark(170, 545, 12)}
    ${caption("out of orbit", 680)}`;
}
