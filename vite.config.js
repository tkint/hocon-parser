import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'hocon-parser',
    },
  },
});
