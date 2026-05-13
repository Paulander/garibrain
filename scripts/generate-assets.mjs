import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const assetsDir = path.join(root, "assets");

async function renderSquare(source, target, size) {
  await sharp(path.join(assetsDir, source), { density: 320 })
    .resize(size, size, { fit: "contain", background: "#0B0F10" })
    .png()
    .toFile(path.join(assetsDir, target));
}

await mkdir(assetsDir, { recursive: true });

await renderSquare("icon-source.svg", "icon.png", 1024);
await renderSquare("icon-source.svg", "adaptive-icon.png", 1024);
await renderSquare("splash-source.svg", "splash-icon.png", 1024);
await renderSquare("icon-source.svg", "favicon.png", 64);

console.log("Generated Expo icon, adaptive icon, splash icon, and favicon.");
