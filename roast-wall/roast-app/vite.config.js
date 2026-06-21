import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The platform runs the API gateway on the backend main port range, which
 * starts at 5000. In dev we proxy `/api/*` to that gateway so the browser
 * makes same-origin requests (no CORS). The gateway strips the `/api` prefix
 * and routes `/<service-name>/*` to each backend service.
 */
const GATEWAY_TARGET = process.env.BACKEND_URL || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // match only `/api/...` so source modules like `/api.ts` are not proxied.
      '^/api/': {
        target: GATEWAY_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
