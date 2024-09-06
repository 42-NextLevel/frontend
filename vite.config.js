import { defineConfig } from 'vite';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig({
  plugins: [jsconfigPaths()],
  esbuild: {
    jsx: 'transform',
    jsxInject: `import { jsx } from '@lib/jsx/jsx-runtime'`,
    jsxFactory: 'jsx',
  },
  resolve: {
    alias: {
      '@': '/src',
      '@lib': '/src/library',
    },
  },
});
