/**
 * Generates the placeholder product illustrations in /public/products (SVG).
 * Run: node scripts/generate-product-art.mjs
 * Replace them anytime by uploading real photos from the host panel.
 */
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const OUT = join(process.cwd(), "public", "products");
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 1000;

const hexPattern = (id, color, opacity = 0.08) => `
  <pattern id="${id}" width="56" height="97" patternUnits="userSpaceOnUse" patternTransform="scale(0.9)">
    <path d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L28 97 M0 48 L0 16" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.5"/>
  </pattern>`;

const backdrop = (bgA, bgB) => `
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="${bgA}"/>
      <stop offset="100%" stop-color="${bgB}"/>
    </radialGradient>
    ${hexPattern("hex", "#9A5A12", 0.1)}
    <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#5E3715" stop-opacity=".35"/>
      <stop offset="100%" stop-color="#5E3715" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" x2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".0"/>
      <stop offset=".12" stop-color="#fff" stop-opacity=".55"/>
      <stop offset=".22" stop-color="#fff" stop-opacity=".05"/>
      <stop offset=".85" stop-color="#fff" stop-opacity=".0"/>
      <stop offset=".93" stop-color="#fff" stop-opacity=".25"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#hex)"/>
  <ellipse cx="400" cy="860" rx="250" ry="34" fill="url(#shadow)"/>`;

const label = (title, sub, y = 560, color = "#27231E") => `
  <g>
    <rect x="245" y="${y - 70}" width="310" height="175" rx="14" fill="#FBF6EC" stroke="#C27612" stroke-width="2"/>
    <rect x="257" y="${y - 58}" width="286" height="151" rx="9" fill="none" stroke="#C27612" stroke-opacity=".5" stroke-width="1"/>
    <path d="M400 ${y - 52} l12 7 v14 l-12 7 l-12 -7 v-14 z" fill="#E0961A"/>
    <text x="400" y="${y + 22}" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="${title.length > 12 ? 30 : 38}" font-weight="700" fill="${color}">${title}</text>
    <text x="400" y="${y + 60}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="17" letter-spacing="4" fill="#9A5A12">${sub}</text>
  </g>`;

/** Classic glass honey jar */
function jar({ honeyA, honeyB, lid = "#C27612", lidB = "#7A4716", title, sub, bg = ["#FFF8E8", "#F5ECDA"], extra = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">
  ${backdrop(bg[0], bg[1])}
  <defs>
    <linearGradient id="honey" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${honeyA}"/>
      <stop offset="1" stop-color="${honeyB}"/>
    </linearGradient>
    <linearGradient id="lid" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="${lid}"/>
      <stop offset="1" stop-color="${lidB}"/>
    </linearGradient>
  </defs>
  <!-- jar body -->
  <path d="M230 330 Q210 330 210 360 L210 800 Q210 850 260 850 L540 850 Q590 850 590 800 L590 360 Q590 330 570 330 Z" fill="url(#honey)"/>
  <path d="M230 330 Q210 330 210 360 L210 800 Q210 850 260 850 L540 850 Q590 850 590 800 L590 360 Q590 330 570 330 Z" fill="url(#glass)"/>
  <path d="M226 330 Q206 330 206 362 L206 800 Q206 854 260 854 L540 854 Q594 854 594 800 L594 362 Q594 330 574 330" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>
  ${extra}
  <!-- neck + lid -->
  <rect x="250" y="300" width="300" height="40" rx="8" fill="${honeyB}" opacity=".9"/>
  <rect x="235" y="215" width="330" height="95" rx="16" fill="url(#lid)"/>
  <g stroke="#000" stroke-opacity=".12" stroke-width="3">
    ${Array.from({ length: 15 }, (_, i) => `<line x1="${255 + i * 20}" y1="225" x2="${255 + i * 20}" y2="300"/>`).join("")}
  </g>
  <rect x="235" y="215" width="330" height="18" rx="9" fill="#fff" opacity=".22"/>
  <!-- twine -->
  <path d="M240 312 Q400 340 560 312" fill="none" stroke="#D9C39A" stroke-width="5"/>
  ${label(title, sub)}
  <!-- drip over lid -->
  <path d="M470 305 q0 40 10 60 q10 20 0 32 q-12 10 -20 -4 q-6 -14 0 -30 q8 -22 10 -58 z" fill="${honeyA}"/>
  <circle cx="469" cy="376" r="5" fill="#fff" opacity=".6"/>
</svg>`;
}

function detail({ colorA, colorB, title, sub }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${colorA}"/>
      <stop offset="1" stop-color="${colorB}"/>
    </linearGradient>
    ${hexPattern("hx", "#FFF8E8", 0.22)}
    <radialGradient id="shine" cx="30%" cy="25%" r="60%">
      <stop offset="0" stop-color="#fff" stop-opacity=".45"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#d)"/>
  <rect width="${W}" height="${H}" fill="url(#hx)"/>
  <rect width="${W}" height="${H}" fill="url(#shine)"/>
  <!-- dipper -->
  <g transform="translate(150 70) rotate(-28 400 420)">
    <rect x="388" y="40" width="24" height="330" rx="12" fill="#7A4716"/>
    ${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="400" cy="${400 + i * 32}" rx="${70 - Math.abs(2 - i) * 6}" ry="16" fill="#9A5A12" stroke="#5E3715" stroke-width="3"/>`).join("")}
    <ellipse cx="400" cy="560" rx="30" ry="12" fill="#7A4716"/>
  </g>
  <!-- honey stream -->
  <path d="M606 600 C 608 700, 598 760, 602 1000 L 630 1000 C 626 760, 622 700, 624 600 Z" fill="${colorA}" opacity=".95"/>
  <path d="M0 880 Q 200 840 400 870 T 800 860 L800 1000 L0 1000 Z" fill="${colorB}"/>
  <path d="M0 900 Q 200 860 400 890 T 800 880" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>
  <text x="60" y="130" font-family="'Playfair Display', Georgia, serif" font-size="64" font-weight="700" fill="#FFF8E8">${title}</text>
  <text x="62" y="176" font-family="Inter, Arial, sans-serif" font-size="20" letter-spacing="6" fill="#FFF8E8" opacity=".85">${sub}</text>
</svg>`;
}

function honeycomb() {
  const cells = [];
  const r = 34;
  const w = Math.sqrt(3) * r;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 7; col++) {
      const cx = 205 + col * w + (row % 2 ? w / 2 : 0);
      const cy = 380 + row * r * 1.5;
      if (cx > 600) continue;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      }).join(" ");
      const capped = (row * 7 + col) % 5 !== 0;
      cells.push(`<polygon points="${pts}" fill="${capped ? "url(#cap)" : "url(#cell)"}" stroke="#C27612" stroke-width="4"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Petek Bal">
  ${backdrop("#FFF8E8", "#F5ECDA")}
  <defs>
    <radialGradient id="cap" cx="40%" cy="35%"><stop offset="0" stop-color="#FDEBC0"/><stop offset="1" stop-color="#EFAE2A"/></radialGradient>
    <radialGradient id="cell" cx="50%" cy="50%"><stop offset="0" stop-color="#F6C453"/><stop offset="1" stop-color="#9A5A12"/></radialGradient>
    <clipPath id="frame"><rect x="180" y="330" width="440" height="500" rx="18"/></clipPath>
  </defs>
  <rect x="160" y="310" width="480" height="540" rx="26" fill="#9A5A12"/>
  <rect x="170" y="320" width="460" height="520" rx="22" fill="#E0961A"/>
  <g clip-path="url(#frame)">${cells.join("")}</g>
  <rect x="180" y="330" width="440" height="500" rx="18" fill="url(#glass)"/>
  <rect x="250" y="160" width="300" height="110" rx="14" fill="#FBF6EC" stroke="#C27612" stroke-width="2"/>
  <text x="400" y="222" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="40" font-weight="700" fill="#27231E">Petek Bal</text>
  <text x="400" y="252" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="17" letter-spacing="4" fill="#9A5A12">ŞİFA BALI · 1 KG</text>
  <path d="M430 830 q0 40 8 56 q8 18 -2 28 q-12 8 -18 -6 q-4 -12 2 -26 q6 -20 10 -52 z" fill="#E0961A"/>
</svg>`;
}

function dropper() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Propolis Damla">
  ${backdrop("#F4F3E6", "#E6E3CC")}
  <defs>
    <linearGradient id="amber" x1="0" x2="1"><stop offset="0" stop-color="#7A4716"/><stop offset=".5" stop-color="#9A5A12"/><stop offset="1" stop-color="#5E3715"/></linearGradient>
  </defs>
  <rect x="330" y="120" width="140" height="130" rx="60" fill="#27231E"/>
  <rect x="345" y="235" width="110" height="90" rx="10" fill="#35302A"/>
  <rect x="345" y="245" width="110" height="10" fill="#C27612"/>
  <path d="M300 340 Q300 320 330 320 L470 320 Q500 320 500 340 L520 420 L520 810 Q520 850 480 850 L320 850 Q280 850 280 810 L280 420 Z" fill="url(#amber)"/>
  <path d="M300 340 Q300 320 330 320 L470 320 Q500 320 500 340 L520 420 L520 810 Q520 850 480 850 L320 850 Q280 850 280 810 L280 420 Z" fill="url(#glass)"/>
  <rect x="300" y="500" width="200" height="220" rx="10" fill="#FBF6EC" stroke="#C27612" stroke-width="2"/>
  <path d="M400 520 l10 6 v12 l-10 6 l-10 -6 v-12 z" fill="#6F7543"/>
  <text x="400" y="600" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="700" fill="#27231E">Propolis</text>
  <text x="400" y="640" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" letter-spacing="4" fill="#565C33">DAMLA · 30 ML</text>
  <text x="400" y="690" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" letter-spacing="3" fill="#9A5A12">ALKOLSÜZ</text>
  <ellipse cx="610" cy="780" rx="14" ry="20" fill="#9A5A12"/><path d="M610 748 l-10 20 h20z" fill="#9A5A12"/>
  <ellipse cx="660" cy="820" rx="9" ry="13" fill="#9A5A12" opacity=".7"/>
</svg>`;
}

function candles() {
  const candle = (x, h) => `
    <rect x="${x}" y="${850 - h}" width="140" height="${h}" rx="12" fill="url(#wax)"/>
    <g stroke="#C27612" stroke-opacity=".35" stroke-width="2">${Array.from({ length: Math.floor(h / 28) }, (_, i) => `<path d="M${x} ${850 - h + 20 + i * 28} h140"/>`).join("")}</g>
    <path d="M${x + 70} ${850 - h} v-26" stroke="#27231E" stroke-width="4"/>
    <path d="M${x + 70} ${850 - h - 84} C ${x + 96} ${850 - h - 50}, ${x + 84} ${850 - h - 22}, ${x + 70} ${850 - h - 22} C ${x + 56} ${850 - h - 22}, ${x + 44} ${850 - h - 50}, ${x + 70} ${850 - h - 84} Z" fill="url(#flame)"/>
    <circle cx="${x + 70}" cy="${850 - h - 46}" r="70" fill="url(#halo)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Balmumu Mum Seti">
  ${backdrop("#3a322a", "#1B1814")}
  <defs>
    <linearGradient id="wax" x1="0" x2="1"><stop offset="0" stop-color="#F6C453"/><stop offset=".5" stop-color="#FAD98A"/><stop offset="1" stop-color="#E0961A"/></linearGradient>
    <radialGradient id="flame" cx="50%" cy="70%"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#FAD98A"/><stop offset="1" stop-color="#E0961A"/></radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#F6C453" stop-opacity=".35"/><stop offset="1" stop-color="#F6C453" stop-opacity="0"/></radialGradient>
  </defs>
  ${candle(150, 330)}${candle(330, 440)}${candle(510, 260)}
  <text x="400" y="940" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="700" fill="#FAD98A">Balmumu Mum Seti</text>
</svg>`;
}

function giftBox() {
  const mini = (x, c1, c2, name) => `
    <rect x="${x}" y="470" width="120" height="170" rx="16" fill="${c1}"/>
    <rect x="${x}" y="470" width="120" height="170" rx="16" fill="url(#glass)"/>
    <rect x="${x - 4}" y="430" width="128" height="48" rx="10" fill="${c2}"/>
    <rect x="${x + 10}" y="530" width="100" height="60" rx="6" fill="#FBF6EC"/>
    <text x="${x + 60}" y="566" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="17" font-weight="700" fill="#27231E">${name}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Hediye Kutusu">
  ${backdrop("#FFF8E8", "#EDDFC3")}
  <!-- box -->
  <path d="M120 600 L400 520 L680 600 L680 830 L400 900 L120 830 Z" fill="#434828"/>
  <path d="M120 600 L400 680 L400 900 L120 830 Z" fill="#565C33"/>
  <path d="M680 600 L400 680 L400 900 L680 830 Z" fill="#434828"/>
  ${mini(190, "#EFAE2A", "#9A5A12", "Çiçek")}${mini(340, "#7A4716", "#5E3715", "Kestane")}${mini(490, "#C27612", "#7A4716", "Karakovan")}
  <path d="M120 600 L400 680 L680 600 L680 650 L400 730 L120 650 Z" fill="#6F7543"/>
  <path d="M380 674 L420 674 L420 900 L380 900 Z" fill="#E0961A"/>
  <path d="M400 690 C 340 640, 300 700, 380 700 M400 690 C 460 640, 500 700, 420 700" fill="none" stroke="#E0961A" stroke-width="14" stroke-linecap="round"/>
  <text x="400" y="200" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="700" fill="#27231E">Hediye Kutusu</text>
  <text x="400" y="245" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" letter-spacing="6" fill="#9A5A12">BAL ÇEŞİTLERİ</text>
</svg>`;
}

const pollenDots = Array.from({ length: 70 }, (_, i) => {
  const colors = ["#F6C453", "#E0961A", "#B5B98A", "#EFAE2A", "#C27612", "#959A63"];
  const x = 235 + ((i * 53) % 330);
  const y = 620 + ((i * 37) % 210);
  return `<circle cx="${x}" cy="${y}" r="${7 + (i % 4)}" fill="${colors[i % colors.length]}"/>`;
}).join("");

const files = {
  "cicek-bali.svg": jar({ honeyA: "#F6C453", honeyB: "#E0961A", title: "Çiçek Balı", sub: "YAYLA · 850 G" }),
  "cicek-bali-detail.svg": detail({ colorA: "#F6C453", colorB: "#C27612", title: "Çiçek Balı", sub: "YÜZLERCE YAYLA ÇİÇEĞİ" }),
  "kestane-bali.svg": jar({ honeyA: "#9A5A12", honeyB: "#5E3715", title: "Kestane Balı", sub: "KARADENİZ · 850 G", lid: "#434828", lidB: "#27231E" }),
  "kestane-bali-detail.svg": detail({ colorA: "#9A5A12", colorB: "#5E3715", title: "Kestane Balı", sub: "YOĞUN · KOYU · ŞİFALI" }),
  "karakovan-bali.svg": jar({ honeyA: "#C27612", honeyB: "#7A4716", title: "Karakovan Balı", sub: "NADİR · 1 KG", lid: "#27231E", lidB: "#120F0C", bg: ["#FFF8E8", "#EDDFC3"] }),
  "karakovan-bali-detail.svg": detail({ colorA: "#C27612", colorB: "#7A4716", title: "Karakovan", sub: "AĞAÇ KOVUĞUNDAN" }),
  "petek-bal.svg": honeycomb(),
  "petek-bal-detail.svg": detail({ colorA: "#EFAE2A", colorB: "#9A5A12", title: "Petek Bal", sub: "DOĞAL PETEĞİYLE" }),
  "ari-sutu.svg": jar({ honeyA: "#FFF8E8", honeyB: "#FDEBC0", title: "Arı Sütü", sub: "TAZE · 50 G", lid: "#6F7543", lidB: "#434828", bg: ["#FFFDF8", "#F5ECDA"] }),
  "ari-sutu-detail.svg": detail({ colorA: "#FAD98A", colorB: "#C27612", title: "Arı Sütü", sub: "KRALİÇENİN BESİNİ" }),
  "propolis-damla.svg": dropper(),
  "propolis-damla-detail.svg": detail({ colorA: "#7A4716", colorB: "#434828", title: "Propolis", sub: "DOĞAL KORUYUCU" }),
  "cicek-poleni.svg": jar({ honeyA: "#FDEBC0", honeyB: "#FAD98A", title: "Çiçek Poleni", sub: "TAZE · 250 G", lid: "#959A63", lidB: "#565C33", extra: pollenDots }),
  "cicek-poleni-detail.svg": detail({ colorA: "#EFAE2A", colorB: "#6F7543", title: "Çiçek Poleni", sub: "DOĞAL PROTEİN" }),
  "balmumu-mum.svg": candles(),
  "balmumu-mum-detail.svg": detail({ colorA: "#FAD98A", colorB: "#9A5A12", title: "Balmumu", sub: "EL YAPIMI · İSSİZ" }),
  "hediye-kutusu.svg": giftBox(),
  "hediye-kutusu-detail.svg": detail({ colorA: "#6F7543", colorB: "#27231E", title: "Hediye Kutusu", sub: "SEVDİKLERİNİZE ŞİFA" }),
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(OUT, name), svg.replace(/\n\s+/g, "\n").trim() + "\n");
}
console.log(`✔ ${Object.keys(files).length} illustrations written to public/products`);
