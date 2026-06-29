import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    outDir: mode === 'ads' ? 'dist-ads' : 'dist',
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      input:
        mode === 'ads'
          ? path.resolve(__dirname, 'index.ads.html')
          : path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: undefined,
        entryFileNames: mode === 'ads' ? 'assets/[name]-[hash].js' : 'assets/[name]-[hash].js',
      },
    },
  },
  plugins:
    mode === 'ads'
      ? [
          {
            name: 'ads-index-html',
            generateBundle(_options, bundle) {
              const adsHtml = bundle['index.ads.html'];
              if (adsHtml && adsHtml.type === 'asset') {
                adsHtml.fileName = 'index.html';
              }
            },
          },
        ]
      : [],
}));
