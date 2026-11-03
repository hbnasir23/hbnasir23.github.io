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
    ? `<text x="350" y="420" text-anchor="middle" direction="rtl" font-family="Noto Nastaliq Urdu" font-weight="700" font-size="${Math.min(200, Math.round(1000 / Math.max(word.ur.length, 3)))}" fill="${C.ink}">${harfEscape(word.ur)}</text>`
    : `<text x="350" y="420" text-anchor="middle" font-family="Instrument Serif" font-style="italic" font-size="${roman.length > 8 ? 130 : 170}" fill="${C.ink}">${roman}</text>`;
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
