import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [jsconfigPaths()],
  esbuild: {
    jsx: 'transform',
    jsxInject: `import { jsx, Fragment } from '@lib/jsx/jsx-runtime'`,
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@lib': '/src/library',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3100,
    watch: {
      usePolling: true,
      interval: 10,
    },
  },
});
