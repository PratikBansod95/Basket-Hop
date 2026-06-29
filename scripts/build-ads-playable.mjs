import { createWriteStream } from 'fs';
import { mkdir, readFile, readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist-ads');
const outDir = path.join(root, 'dist-ads-zip');

const EXIT_API = `<script src="https://tpc.googlesyndication.com/pagead/gadgets/html5/api/exitapi.js"></script>`;

async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function injectExitApi(html) {
  if (html.includes('exitapi.js')) return html;
  return html.replace('</head>', `  ${EXIT_API}\n</head>`);
}

async function buildZip() {
  const { default: archiver } = await import('archiver');
  await mkdir(outDir, { recursive: true });
  const zipPath = path.join(outDir, 'basket-hop-playable.zip');
  const output = createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  const done = pipeline(archive, output);

  const htmlCandidates = ['index.html', 'index.ads.html'];
  let indexPath = null;
  for (const name of htmlCandidates) {
    const candidate = path.join(distDir, name);
    try {
      await stat(candidate);
      indexPath = candidate;
      break;
    } catch {
      /* try next */
    }
  }
  if (!indexPath) throw new Error('No index.html or index.ads.html in dist-ads');

  let indexHtml = await readFile(indexPath, 'utf-8');
  indexHtml = await injectExitApi(indexHtml);

  const files = await getAllFiles(distDir);
  let totalSize = Buffer.byteLength(indexHtml, 'utf-8');

  for (const file of files) {
    const rel = path.relative(distDir, file).replace(/\\/g, '/');
    if (rel === 'index.html' || rel === 'index.ads.html') {
      archive.append(indexHtml, { name: 'index.html' });
      continue;
    }
    const content = await readFile(file);
    totalSize += content.length;
    archive.append(content, { name: rel });
  }

  await archive.finalize();
  await done;

  const zipStat = await stat(zipPath);
  const sizeMb = (zipStat.size / (1024 * 1024)).toFixed(2);
  console.log(`\nAds playable ZIP: ${zipPath}`);
  console.log(`ZIP size: ${sizeMb} MB (limit: 5 MB)`);
  console.log(`Uncompressed assets: ~${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  if (zipStat.size > 5 * 1024 * 1024) {
    console.warn('WARNING: ZIP exceeds 5 MB Google Ads limit');
    process.exitCode = 1;
  } else {
    console.log('OK: within 5 MB limit');
  }
}

buildZip().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
