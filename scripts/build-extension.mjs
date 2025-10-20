import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const distDir = path.join(rootDir, "dist");
const unpackedDir = path.join(distDir, "extension");

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyExtensionAssets() {
  const filesToCopy = ["manifest.json"];
  const dirsToCopy = ["src", "icons"];

  for (const file of filesToCopy) {
    const from = path.join(rootDir, file);
    const to = path.join(unpackedDir, file);
    fs.copyFileSync(from, to);
  }

  for (const dir of dirsToCopy) {
    const from = path.join(rootDir, dir);
    const to = path.join(unpackedDir, dir);
    fs.cpSync(from, to, { recursive: true });
  }
}

async function createArchive() {
  const archivePath = path.join(distDir, "extension.zip");
  const output = fs.createWriteStream(archivePath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(unpackedDir, false);

  await archive.finalize();

  return archivePath;
}

async function main() {
  ensureCleanDir(distDir);
  ensureCleanDir(unpackedDir);

  copyExtensionAssets();

  const zipPath = await createArchive();
  console.info(`Extensão copiada para ${unpackedDir}`);
  console.info(`Pacote gerado em ${zipPath}`);
}

main().catch((err) => {
  console.error("Falha ao gerar build da extensão:", err);
  process.exitCode = 1;
});
