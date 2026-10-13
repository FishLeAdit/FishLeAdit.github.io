// Draws the 32x32 Windows 98-style project icons as crisp pixel SVGs.
// Usage: node scripts/icons/generate-project-icons.mjs <outDir>
//
// Each shape is rasterised to a pixel mask, given a black outline, and shaded
// with a lighter top-left edge and a darker bottom-right edge, the way 98-era
// icons were drawn.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SIZE = 32;
const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });

class Icon {
  constructor() {
    this.px = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  set(x, y, color) {
    if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) this.px[y][x] = color;
  }

  // Build a mask from a predicate over pixel centres.
  static mask(test) {
    const m = [];
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) if (test(x + 0.5, y + 0.5)) m.push([x, y]);
    return m;
  }

  // Fill a mask with an outline, base colour and optional bevel shading.
  shape(mask, { fill, light, dark, outline = "#000000" }) {
    const inside = new Set(mask.map(([x, y]) => `${x},${y}`));
    const has = (x, y) => inside.has(`${x},${y}`);
    if (outline) {
      for (const [x, y] of mask)
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
          if (!has(x + dx, y + dy)) this.set(x + dx, y + dy, outline);
    }
    for (const [x, y] of mask) {
      let c = fill;
      if (light && (!has(x - 1, y) || !has(x, y - 1))) c = light;
      if (dark && (!has(x + 1, y) || !has(x, y + 1))) c = dark;
      this.set(x, y, c);
    }
  }

  line(x0, y0, x1, y1, color, width = 1) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 || 1;
    const r = (width - 1) / 2;
    for (let i = 0; i <= steps; i++) {
      const x = x0 + ((x1 - x0) * i) / steps;
      const y = y0 + ((y1 - y0) * i) / steps;
      for (let dy = -Math.ceil(r); dy <= Math.ceil(r); dy++)
        for (let dx = -Math.ceil(r); dx <= Math.ceil(r); dx++)
          if (dx * dx + dy * dy <= r * r + 0.25) this.set(Math.round(x + dx), Math.round(y + dy), color);
    }
  }

  polyline(points, color, width = 1) {
    for (let i = 0; i < points.length - 1; i++) this.line(...points[i], ...points[i + 1], color, width);
  }

  // Draw a small bitmap ("#" = pixel) with its top-left at (x, y).
  bitmap(x, y, rows, color) {
    rows.forEach((row, j) => [...row].forEach((ch, i) => ch === "#" && this.set(x + i, y + j, color)));
  }

  toSvg(title) {
    let rects = "";
    for (let y = 0; y < SIZE; y++) {
      let x = 0;
      while (x < SIZE) {
        const c = this.px[y][x];
        if (!c) { x++; continue; }
        let w = 1;
        while (x + w < SIZE && this.px[y][x + w] === c) w++;
        rects += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${c}"/>`;
        x += w;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges"><title>${title}</title>${rects}</svg>\n`;
  }
}

const ellipse = (cx, cy, rx, ry) => Icon.mask((x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);
const rect = (x0, y0, w, h) => Icon.mask((x, y) => x >= x0 && x < x0 + w && y >= y0 && y < y0 + h);

// --- Stackwise: a stack of gold coins in front of a rising bar chart --------
{
  const icon = new Icon();
  const bars = [[17, 20, 9], [22, 14, 15], [27, 7, 22]];
  for (const [x, y, h] of bars)
    icon.shape(rect(x, y, 4, h), { fill: "#00a000", light: "#60e060", dark: "#006000" });
  icon.line(16, 29, 31, 29, "#000000");

  // Coins from the bottom up, so each one sits on the last.
  for (const cy of [26, 22, 18, 14, 10]) {
    icon.shape(ellipse(10, cy + 1.5, 8, 3), { fill: "#c08000", dark: "#805000" });
    icon.shape(ellipse(10, cy, 8, 3), { fill: "#ffd700", light: "#fff3a0", dark: "#d4a000" });
  }
  // A "$" stamped on the top coin.
  icon.bitmap(9, 8, [" ##", "#  ", " # ", "  #", "## "], "#7a4a00");
  writeFileSync(join(outDir, "stackwise.svg"), icon.toSvg("Stackwise"));
}

// --- ECOTRACK: a green leaf with veins and a stem ---------------------------
{
  const icon = new Icon();
  // Leaf along the diagonal from bottom-left to top-right, pointed at both ends.
  const cx = 16.5, cy = 15.5, L = 13, W = 8;
  const leaf = Icon.mask((x, y) => {
    const u = ((x - cx) + (cy - y)) / Math.SQRT2; // along the leaf
    const v = ((x - cx) - (cy - y)) / Math.SQRT2; // across it
    if (Math.abs(u) > L) return false;
    const t = (u + L) / (2 * L);
    return Math.abs(v) <= W * Math.sin(Math.PI * t) ** 0.8;
  });
  icon.shape(leaf, { fill: "#30b030", light: "#8ee870", dark: "#187018" });

  // Midrib and veins.
  icon.line(8, 24, 25, 7, "#0c5a0c");
  for (const [sx, sy] of [[10, 22], [14, 18], [18, 14]]) {
    icon.line(sx, sy, sx - 1, sy - 5, "#1c7a1c");
    icon.line(sx, sy, sx + 5, sy + 1, "#1c7a1c");
  }
  // Stem.
  icon.line(2, 30, 7, 25, "#000000", 3);
  icon.line(2, 30, 7, 25, "#6b4a1a", 1);
  writeFileSync(join(outDir, "ecotrack.svg"), icon.toSvg("ECOTRACK"));
}

// --- Brain tumor segmentation: a brain with an outlined tumour ---------------
{
  const icon = new Icon();
  icon.shape(rect(17, 20, 4, 9), { fill: "#d89aa8", light: "#f0c4ce", dark: "#a8687a" });
  icon.shape(ellipse(22, 21, 6.5, 4.5), { fill: "#e88aa0", light: "#ffc2d0", dark: "#b85a70" });
  icon.shape(ellipse(15, 13, 13, 9.5), { fill: "#ffa0b8", light: "#ffd4df", dark: "#d06a86" });

  // Folds of the cortex.
  const fold = "#c05a76";
  icon.polyline([[5, 10], [8, 8], [11, 10], [14, 7], [17, 9], [20, 6], [23, 9], [26, 11]], fold);
  icon.polyline([[4, 14], [7, 13], [10, 15], [13, 12], [16, 15], [19, 13], [22, 15], [26, 14]], fold);
  icon.polyline([[6, 18], [10, 17], [14, 19], [19, 17], [24, 19]], fold);

  // The tumour, outlined like a segmentation mask, with cyan corner brackets.
  icon.shape(ellipse(19.5, 11.5, 3.5, 3), { fill: "#ff2020", light: "#ff7070", dark: "#b00000", outline: "#ffff00" });
  const c = "#00e0ff";
  for (const [x, y, dx, dy] of [[14, 6, 1, 1], [25, 6, -1, 1], [14, 17, 1, -1], [25, 17, -1, -1]]) {
    icon.line(x, y, x + 2 * dx, y, c);
    icon.line(x, y, x, y + 2 * dy, c);
  }
  writeFileSync(join(outDir, "brain-tumor.svg"), icon.toSvg("Pediatric Brain Tumor Segmentation"));
}

// --- git-why: a git branch graph under a magnifying glass with a "?" -------
{
  const icon = new Icon();
  // Main line and a branch that splits off and merges back.
  icon.line(5, 3, 5, 29, "#404040", 2);
  icon.polyline([[5, 8], [11, 12], [11, 18], [5, 22]], "#404040", 2);
  for (const [x, y, fill, light, dark] of [
    [5, 5, "#ff8000", "#ffc080", "#b05000"],
    [5, 14, "#ff8000", "#ffc080", "#b05000"],
    [5, 26, "#ff8000", "#ffc080", "#b05000"],
    [11, 15, "#00a0a0", "#60e0e0", "#006060"],
  ])
    icon.shape(ellipse(x + 0.5, y + 0.5, 2.6, 2.6), { fill, light, dark });

  // Handle first, so the lens sits on top of it.
  icon.line(26, 25, 30, 29, "#000000", 4);
  icon.line(26, 25, 30, 29, "#7a4a1a", 2);

  icon.shape(ellipse(21.5, 18.5, 7.5, 7.5), { fill: "#c0c0c0", light: "#ffffff", dark: "#606060" });
  icon.shape(ellipse(21.5, 18.5, 5.5, 5.5), { fill: "#c8f4ff", light: "#ffffff", dark: "#8fd0e8", outline: "#606060" });
  icon.bitmap(19, 15, [" ### ", "#   #", "    #", "   # ", "  #  ", "     ", "  #  "], "#000080");
  writeFileSync(join(outDir, "git-why.svg"), icon.toSvg("git-why"));
}

console.log("wrote 4 icons to", outDir);
