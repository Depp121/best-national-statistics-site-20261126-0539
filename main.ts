// Statistik Indonesia — program entri untuk bounty "Make the best national statistics site".
//
// Menyalin app/ (situs statis) dan screenshots/ (hasil render) ke direktori
// output, lalu menulis dossier.json dari direktori itu dengan buildDossier
// dari vendor/makefun-frontend.ts (salinan kit, tidak diubah).
//
// Dijalankan sebagai `node main.ts` (Node 22, tanpa build dan tanpa install).
// Direktori output dibaca dari MAKEFUN_OUTPUT_DIR, bila ada, dan /output bila tidak.

import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dst = join(to, name);
    if (statSync(src).isDirectory()) copyTree(src, dst);
    else copyFileSync(src, dst);
  }
}

function countFiles(dir) {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    n += statSync(p).isDirectory() ? countFiles(p) : 1;
  }
  return n;
}

mkdirSync(outDir, { recursive: true });
copyTree(join(repoRoot, "app"), join(outDir, "app"));
copyTree(join(repoRoot, "screenshots"), join(outDir, "screenshots"));

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log(`Statistik Indonesia: ${countFiles(join(outDir, "app"))} file app, ` +
  `${countFiles(join(outDir, "screenshots"))} screenshot, dossier.json ditulis ke ${outDir}.`);
