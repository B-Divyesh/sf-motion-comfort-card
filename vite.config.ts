import { defineConfig } from 'vitest/config';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

async function filesIn(directory: string, relative = ''): Promise<string[]> {
  const entries = await readdir(resolve(directory, relative), { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    return entry.isDirectory() ? filesIn(directory, path) : [path];
  }));
  return paths.flat();
}

function publicUrl(file: string): string {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file}`;
}

/** Writes PWA metadata after Vite has named every production asset. */
function versionedPwa(): Plugin {
  return {
    name: 'versioned-pwa-shell',
    apply: 'build',
    async closeBundle() {
      const output = resolve(root, 'dist');
      const files = (await filesIn(output)).filter((file) => file !== 'sw.js' && file !== 'manifest.webmanifest' && !file.endsWith('.map')).sort();
      const hash = createHash('sha256');
      hash.update(await readFile(resolve(root, 'public/sw.js')));
      for (const file of files) {
        hash.update(file);
        hash.update(await readFile(resolve(output, file)));
      }
      const version = `comfort-card-${hash.digest('hex').slice(0, 12)}`;
      const template = await readFile(resolve(root, 'public/sw.js'), 'utf8');
      const manifest = await readFile(resolve(root, 'public/manifest.webmanifest'), 'utf8');
      await writeFile(resolve(output, 'sw.js'), template
        .replaceAll('__BUILD_VERSION__', version)
        .replace('__PRECACHE__', JSON.stringify(files.map(publicUrl))));
      await writeFile(resolve(output, 'manifest.webmanifest'), manifest.replaceAll('__BUILD_VERSION__', version));
    },
  };
}

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        privacy: resolve(root, 'privacy/index.html'),
        terms: resolve(root, 'terms/index.html'),
        offline: resolve(root, 'offline.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  plugins: [versionedPwa()],
});
