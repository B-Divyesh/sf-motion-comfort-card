import { readFile } from 'node:fs/promises';

const [manifest, serviceWorker, index] = await Promise.all([
  readFile('dist/manifest.webmanifest', 'utf8'),
  readFile('dist/sw.js', 'utf8'),
  readFile('dist/index.html', 'utf8'),
]);
const parsedManifest = JSON.parse(manifest);
const version = parsedManifest.start_url.match(/^\/\?v=(comfort-card-[a-f0-9]{12})$/)?.[1];
if (!version || serviceWorker.includes('__BUILD_VERSION__') || serviceWorker.includes('__PRECACHE__')) throw new Error('PWA build version placeholders were not resolved.');
if (!serviceWorker.includes(`const VERSION = '${version}';`)) throw new Error('Manifest and service worker build versions do not match.');
const asset = index.match(/\/assets\/[^"']+\.js/)?.[0];
if (!asset || !serviceWorker.includes(asset)) throw new Error('The generated service worker does not precache the current application bundle.');
console.log(`Verified build-derived PWA version ${version}.`);
