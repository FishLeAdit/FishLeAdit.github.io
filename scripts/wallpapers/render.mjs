// Renders SVG files to 1920x1080 JPEGs with headless Edge.
// Usage: node render.mjs <svgDir> <outDir> name1 name2 ...
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [svgDir, outDir, ...names] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const profile = join(svgDir, "edge-render");
mkdirSync(profile, { recursive: true });
const port = 9399;
const proc = spawn("C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", ["--headless=new", "--disable-gpu",
  "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
for (const name of names) {
  const url = pathToFileURL(resolve(svgDir, `${name}.svg`)).href;
  // Wrap in a page with no margins so the SVG fills the viewport exactly.
  const html = `<html><body style="margin:0;overflow:hidden"><img src="${url}" width="1920" height="1080" style="display:block"></body></html>`;
  writeFileSync(join(svgDir, `${name}.html`), html);
  await send("Page.navigate", { url: pathToFileURL(resolve(svgDir, `${name}.html`)).href });
  await sleep(1500);
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
  const file = join(outDir, `${name}.jpg`);
  writeFileSync(file, Buffer.from(shot.result.data, "base64"));
  console.log("wrote", file, Math.round(Buffer.from(shot.result.data, "base64").length / 1024) + " KB");
}
ws.close(); proc.kill(); process.exit(0);
