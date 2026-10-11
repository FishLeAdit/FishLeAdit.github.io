// Generates four 1920x1080 vaporwave wallpapers as SVG.
// Usage: node generate.mjs <outDir>
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
mkdirSync(out, { recursive: true });

const W = 1920;
const H = 1080;
const f = (n) => Math.round(n * 10) / 10;

// Deterministic randomness so re-running gives the same images.
let seed = 98;
const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

// Ground-plane projection: camera looks at the horizon; z is depth.
function project(X, z, horizon, height, focal) {
  return { x: W / 2 + (X * focal) / z, y: horizon + height / z };
}

function stars(count, maxY, colors = ["#ffffff", "#ffd6f6", "#bdf6ff"]) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const r = rand() < 0.08 ? 2.2 : rand() * 1.3 + 0.4;
    s += `<circle cx="${f(rand() * W)}" cy="${f(rand() * maxY)}" r="${f(r)}" fill="${colors[i % colors.length]}" opacity="${f(0.4 + rand() * 0.6)}"/>`;
  }
  return s;
}

// A sun with the classic horizontal cut-outs in its lower half.
function stripedSun(id, cx, cy, r, topColor, bottomColor, horizon) {
  const [top_, bottom_] = [topColor, bottomColor];
  // Stripes cover the visible lower part of the sun and thicken downwards.
  let gaps = "";
  const top = cy - r * 0.3;
  const bottom = Math.min(cy + r, horizon);
  const count = 8;
  for (let i = 0; i < count; i++) {
    const y = top + (bottom - top) * (i / count);
    const h = 3 + i * 2.6;
    gaps += `<rect x="${cx - r}" y="${f(y)}" width="${r * 2}" height="${f(h)}" fill="black"/>`;
  }
  return `
  <defs>
    <linearGradient id="${id}-g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top_}"/>
      <stop offset="1" stop-color="${bottom_}"/>
    </linearGradient>
    <radialGradient id="${id}-glow">
      <stop offset="0.55" stop-color="${bottom_}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${bottom_}" stop-opacity="0"/>
    </radialGradient>
    <mask id="${id}-m">
      <rect width="${W}" height="${horizon}" fill="white"/>
      ${gaps}
    </mask>
  </defs>
  <circle cx="${cx}" cy="${cy}" r="${r * 1.7}" fill="url(#${id}-glow)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-g)" mask="url(#${id}-m)"/>`;
}

function gridLines(horizon, color, { height = H - horizon, focal = 700, spread = 30, step = 1.5, glowId } = {}) {
  let lines = "";
  // Depth lines, denser towards the horizon.
  for (let z = 1; z < 30; z *= 1.16) {
    const { y } = project(0, z, horizon, height, focal);
    lines += `<line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}"/>`;
  }
  // Lines running to the vanishing point.
  for (let X = -spread; X <= spread; X += step) {
    const a = project(X, 0.6, horizon, height, focal);
    const b = project(X, 400, horizon, height, focal);
    lines += `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"/>`;
  }
  return `
  <g clip-path="url(#floor)">
    <g stroke="${color}" stroke-width="5" opacity="0.35" filter="url(#${glowId})">${lines}</g>
    <g stroke="${color}" stroke-width="2">${lines}</g>
  </g>`;
}

const glowFilter = (id, dev = 6) =>
  `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${dev}"/></filter>`;

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;

// 1. Sunset Grid -------------------------------------------------------------
{
  const hz = 640;
  const mountains = (() => {
    const pts = [[0, hz]];
    let x = 0;
    while (x < W) {
      x += 60 + rand() * 110;
      pts.push([x, hz - 30 - rand() * 120]);
    }
    pts.push([W, hz]);
    return pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
  })();
  writeFileSync(
    join(out, "sunset-grid.svg"),
    svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#090022"/>
      <stop offset="0.45" stop-color="#2d0a5c"/>
      <stop offset="0.8" stop-color="#8a1a7a"/>
      <stop offset="1" stop-color="#ff3d8b"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a0548"/>
      <stop offset="1" stop-color="#0b0018"/>
    </linearGradient>
    <clipPath id="floor"><rect y="${hz}" width="${W}" height="${H - hz}"/></clipPath>
    ${glowFilter("glow")}
  </defs>
  <rect width="${W}" height="${hz}" fill="url(#sky)"/>
  ${stars(220, hz - 120)}
  ${stripedSun("sun", W / 2, hz - 40, 280, "#ffe66d", "#ff2e88", hz)}
  <polygon points="${mountains}" fill="#16002e" stroke="#00e5ff" stroke-width="2" opacity="0.95"/>
  <rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#ground)"/>
  ${gridLines(hz, "#ff2bd6", { glowId: "glow" })}
  <rect y="${hz - 2}" width="${W}" height="4" fill="#ff8be0" opacity="0.9" filter="url(#glow)"/>`),
  );
}

// 2. Palm Dusk ---------------------------------------------------------------
{
  const hz = 700;
  const sunX = 1320;
  let reflection = "";
  for (let i = 0; i < 26; i++) {
    const y = hz + 10 + i * 14 + i * i * 0.35;
    const w = 380 - i * 9 + rand() * 60;
    reflection += `<rect x="${f(sunX - w / 2 + (rand() - 0.5) * 40)}" y="${f(y)}" width="${f(w)}" height="${f(3 + i * 0.25)}" fill="${i % 2 ? "#ff8fb1" : "#ffc46b"}" opacity="${f(0.75 - i * 0.025)}"/>`;
  }
  const palm = (x, base, h, lean, scale) => {
    const top = { x: x + lean, y: base - h };
    const trunk = `<path d="M${x - 16 * scale},${base} C${x - 10 * scale},${base - h * 0.45} ${top.x - 18 * scale},${top.y + h * 0.3} ${top.x - 5 * scale},${top.y} L${top.x + 5 * scale},${top.y} C${top.x - 4 * scale},${top.y + h * 0.3} ${x + 14 * scale},${base - h * 0.45} ${x + 16 * scale},${base} Z"/>`;
    // Each frond is a crescent: it arches up from the crown, then droops,
    // with a row of short leaflets hanging off its underside.
    let fronds = "";
    const angles = [-176, -152, -128, -52, -28, -4];
    for (const a of angles) {
      const rad = (a * Math.PI) / 180;
      const len = (250 + rand() * 70) * scale;
      const dir = { x: Math.cos(rad), y: Math.sin(rad) };
      // Tip falls below the crown; fronds pointing sideways droop most.
      const droop = len * (0.35 + 0.35 * Math.abs(dir.x));
      const end = { x: top.x + dir.x * len, y: top.y + dir.y * len * 0.45 + droop };
      const ctrl = { x: top.x + dir.x * len * 0.55, y: top.y + dir.y * len * 0.6 - 30 * scale };
      const w = 20 * scale;
      fronds += `<path d="M${f(top.x)},${f(top.y)} Q${f(ctrl.x)},${f(ctrl.y - w)} ${f(end.x)},${f(end.y)} Q${f(ctrl.x)},${f(ctrl.y + w)} ${f(top.x)},${f(top.y + 8 * scale)} Z"/>`;
      // Leaflets along the frond's curve.
      for (let t = 0.2; t < 0.95; t += 0.09) {
        const bx = (1 - t) ** 2 * top.x + 2 * (1 - t) * t * ctrl.x + t * t * end.x;
        const by = (1 - t) ** 2 * top.y + 2 * (1 - t) * t * ctrl.y + t * t * end.y;
        const ll = (30 - t * 18) * scale;
        const side = dir.x < 0 ? -1 : 1;
        fronds += `<path d="M${f(bx - 6 * scale)},${f(by)} L${f(bx + side * ll * 0.7)},${f(by + ll * 0.8)} L${f(bx + 6 * scale)},${f(by + 2)} Z"/>`;
      }
    }
    return trunk + fronds + `<circle cx="${f(top.x)}" cy="${f(top.y + 4 * scale)}" r="${f(14 * scale)}"/>`;
  };
  writeFileSync(
    join(out, "palm-dusk.svg"),
    svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#140a33"/>
      <stop offset="0.4" stop-color="#55208f"/>
      <stop offset="0.75" stop-color="#e2509e"/>
      <stop offset="1" stop-color="#ffb070"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b1670"/>
      <stop offset="1" stop-color="#0c0528"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${hz}" fill="url(#sky)"/>
  ${stars(120, 380)}
  ${stripedSun("sun", sunX, hz - 60, 230, "#fff27a", "#ff4f9a", hz)}
  <rect y="${hz}" width="${W}" height="${H - hz}" fill="url(#sea)"/>
  ${reflection}
  <g fill="#0d0420">
    ${palm(260, H + 20, 760, 140, 1.15)}
    ${palm(520, H + 20, 600, 60, 0.9)}
    ${palm(1820, H + 20, 520, -90, 0.8)}
  </g>`),
  );
}

// 3. Neon Peaks --------------------------------------------------------------
{
  const hz = 620;
  // Low-poly mountain range: alternating valleys and peaks, each peak split
  // into facets that meet at a "shoulder" point on its face.
  const range = (spacing, minH, maxH, valleyH) => {
    const ridge = [[-60, hz - valleyH * rand()]];
    let x = -60;
    while (x < W + 60) {
      x += spacing * (0.6 + rand() * 0.5);
      ridge.push([x, hz - minH - rand() * (maxH - minH)]);
      x += spacing * (0.5 + rand() * 0.4);
      ridge.push([x, hz - valleyH * rand()]);
    }
    let facets = "";
    for (let i = 1; i < ridge.length - 1; i += 2) {
      const [vlx, vly] = ridge[i - 1];
      const [px, py] = ridge[i];
      const [vrx, vry] = ridge[i + 1];
      const sx = px + (rand() - 0.5) * (vrx - vlx) * 0.3;
      const sy = py + (hz - py) * (0.5 + rand() * 0.15);
      facets += `<polyline points="${f(vlx)},${f(vly)} ${f(sx)},${f(sy)} ${f(vrx)},${f(vry)}"/>`;
      facets += `<line x1="${f(px)}" y1="${f(py)}" x2="${f(sx)}" y2="${f(sy)}"/>`;
      facets += `<line x1="${f(sx)}" y1="${f(sy)}" x2="${f(sx + (rand() - 0.5) * 60)}" y2="${hz}"/>`;
    }
    const pts = ridge.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
    return { pts, facets };
  };
  const back = range(230, 180, 330, 90);
  const front = range(300, 90, 230, 40);
  const drawRange = ({ pts, facets }, fill, color) => `
  <polygon points="-60,${hz} ${pts} ${W + 60},${hz}" fill="${fill}"/>
  <g fill="none" stroke="${color}" stroke-width="5" opacity="0.3" filter="url(#glow)">${facets}<polyline points="${pts}"/></g>
  <g fill="none" stroke="${color}" stroke-width="1.6" stroke-linejoin="round">${facets}<polyline points="${pts}" stroke-width="2.5"/></g>`;
  writeFileSync(
    join(out, "neon-peaks.svg"),
    svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#03000f"/>
      <stop offset="0.6" stop-color="#1a0038"/>
      <stop offset="1" stop-color="#4a0a5e"/>
    </linearGradient>
    <clipPath id="floor"><rect y="${hz}" width="${W}" height="${H - hz}"/></clipPath>
    ${glowFilter("glow", 5)}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${stars(260, hz - 200)}
  ${stripedSun("sun", W / 2, hz - 170, 300, "#ffb347", "#ff2e88", hz)}
  ${drawRange(back, "#14002c", "#ff2bd6")}
  ${drawRange(front, "#08001c", "#00f0ff")}
  <rect y="${hz}" width="${W}" height="${H - hz}" fill="#07001a"/>
  ${gridLines(hz, "#00f0ff", { glowId: "glow", spread: 36, step: 2 })}`),
  );
}

// 4. Aesthetic (pastel checkerboard) ----------------------------------------
{
  const hz = 640;
  const height = H - hz;
  const focal = 520;
  let tiles = "";
  const zs = [];
  for (let z = 1; z < 26; z *= 1.09) zs.push(z);
  for (let r = 0; r < zs.length - 1; r++) {
    const zn = zs[r];
    const zf = zs[r + 1];
    const range = Math.ceil((W / 2) * (zf / focal)) + 1;
    for (let X = -range; X < range; X++) {
      if ((X + r) % 2 !== 0) continue;
      const a = project(X, zn, hz, height, focal);
      const b = project(X + 1, zn, hz, height, focal);
      const c = project(X + 1, zf, hz, height, focal);
      const d = project(X, zf, hz, height, focal);
      tiles += `<polygon points="${f(a.x)},${f(a.y)} ${f(b.x)},${f(b.y)} ${f(c.x)},${f(c.y)} ${f(d.x)},${f(d.y)}"/>`;
    }
  }
  const cloud = (cx, cy, s) =>
    `<g opacity="0.7" fill="#ffffff"><ellipse cx="${cx}" cy="${cy}" rx="${170 * s}" ry="${38 * s}"/><ellipse cx="${cx - 60 * s}" cy="${cy - 22 * s}" rx="${80 * s}" ry="${42 * s}"/><ellipse cx="${cx + 50 * s}" cy="${cy - 30 * s}" rx="${95 * s}" ry="${50 * s}"/></g>`;
  writeFileSync(
    join(out, "aesthetic.svg"),
    svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8fd8ff"/>
      <stop offset="0.55" stop-color="#c7a6ff"/>
      <stop offset="1" stop-color="#ffb3e1"/>
    </linearGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd3ef" stop-opacity="1"/>
      <stop offset="1" stop-color="#ffd3ef" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="pyrL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#01cdfe"/>
      <stop offset="1" stop-color="#b967ff"/>
    </linearGradient>
    <linearGradient id="pyrR" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff71ce"/>
      <stop offset="1" stop-color="#7a2cff"/>
    </linearGradient>
    <radialGradient id="sphere" cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#fffbd6"/>
      <stop offset="0.45" stop-color="#ff9de2"/>
      <stop offset="1" stop-color="#7f3bd8"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="${W}" height="${hz}" fill="url(#sky)"/>
  ${cloud(380, 230, 1.2)}${cloud(1500, 160, 0.9)}${cloud(1150, 420, 0.7)}
  <rect y="${hz}" width="${W}" height="${height}" fill="#fff0fa"/>
  <g fill="#ff71ce">${tiles}</g>
  <rect y="${hz}" width="${W}" height="70" fill="url(#haze)"/>
  <ellipse cx="560" cy="905" rx="190" ry="26" fill="#7a2cff" opacity="0.25" filter="url(#soft)"/>
  <polygon points="560,470 420,820 560,880" fill="url(#pyrL)"/>
  <polygon points="560,470 560,880 720,800" fill="url(#pyrR)"/>
  <ellipse cx="1400" cy="935" rx="150" ry="22" fill="#7a2cff" opacity="0.25" filter="url(#soft)"/>
  <circle cx="1400" cy="640" r="170" fill="url(#sphere)"/>
  <text x="${W / 2}" y="300" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="150" font-weight="900" letter-spacing="40" fill="#ff71ce" stroke="#7a2cff" stroke-width="3" opacity="0.9">ＡＥＳＴＨＥＴＩＣ</text>`),
  );
}

console.log("generated 4 SVGs in", out);
