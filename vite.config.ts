import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [
        legacy({
          // Use plugin defaults (browserslist defaults, not IE 11)
          renderLegacyChunks: true,
          modernPolyfills: true,
        })
      ],
      build: {
        // Slightly lower modern target; legacy chunks will cover older browsers
        target: 'es2017'
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
