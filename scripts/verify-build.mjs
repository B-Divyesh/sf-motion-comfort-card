import { readFile } from 'node:fs/promises';

const [manifest, serviceWorker, index, hostConfig, notFound] = await Promise.all([
  readFile('dist/manifest.webmanifest', 'utf8'),
  readFile('dist/sw.js', 'utf8'),
  readFile('dist/index.html', 'utf8'),
  readFile('dist/staticwebapp.config.json', 'utf8'),
  readFile('dist/404.html', 'utf8'),
]);
const parsedManifest = JSON.parse(manifest);
const version = parsedManifest.start_url.match(/^\/\?v=(comfort-card-[a-f0-9]{12})$/)?.[1];
if (!version || serviceWorker.includes('__BUILD_VERSION__') || serviceWorker.includes('__PRECACHE__')) throw new Error('PWA build version placeholders were not resolved.');
if (!serviceWorker.includes(`const VERSION = '${version}';`)) throw new Error('Manifest and service worker build versions do not match.');
if (serviceWorker.includes('staticwebapp.config.json')) throw new Error('The service worker must not precache deployment-only staticwebapp.config.json.');
if (serviceWorker.includes('assets/social-card.png')) throw new Error('The service worker must not precache the large social preview.');
const asset = index.match(/\/assets\/[^"']+\.js/)?.[0];
if (!asset || !serviceWorker.includes(asset)) throw new Error('The generated service worker does not precache the current application bundle.');
const parsedHostConfig = JSON.parse(hostConfig);
if (parsedHostConfig.responseOverrides?.['404']?.statusCode !== 404 || parsedHostConfig.responseOverrides?.['404']?.rewrite !== '/404.html') throw new Error('The host must serve the designed 404 page with a real 404 status.');
for (const route of ['/demo*', '/new', '/card/*', '/session/*', '/check-in/*']) {
  if (!parsedHostConfig.routes?.some((entry) => entry.route === route && entry.rewrite === '/index.html')) throw new Error(`Missing app route rewrite for ${route}.`);
}
if (!notFound.includes('<title>Page not found — Comfort Card</title>')) throw new Error('The built 404 page needs its own title.');
console.log(`Verified build-derived PWA version ${version}.`);
