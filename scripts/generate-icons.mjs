/**
 * Run this script once to generate PNG icons from logo.svg
 * Usage: node scripts/generate-icons.mjs
 * Requires: npm install sharp (dev dependency)
 *
 * OR — use any online SVG-to-PNG converter:
 * https://svgtopng.com  or  https://cloudconvert.com/svg-to-png
 * Export at 512x512 and save as public/icons/icon-512.png
 * Then resize to: 72, 96, 128, 144, 152, 192, 384, 512
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '../public/logo.svg');
const outDir = join(__dirname, '../public/icons');

mkdirSync(outDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgBuffer = readFileSync(svgPath);

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}.png`));
  console.log(`✅ icon-${size}.png`);
}

console.log('\n🎉 All icons generated in public/icons/');
