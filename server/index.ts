import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { initStore, StoreState } from './store.js';
import { createApiRouter } from './api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the built React frontend. Overridable via FRONTEND_DIST. */
const FRONTEND_DIST = process.env.FRONTEND_DIST
  ? path.resolve(process.env.FRONTEND_DIST)
  : path.resolve(process.cwd(), 'roast-wall/roast-app/dist');

async function main(): Promise<void> {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // Mutable store state. Starts "unavailable" and is filled in the background
  // so the port binds immediately and /health is always reachable.
  const state: StoreState = { store: null, mode: 'unavailable', ready: false };

  /**
   * Health check. Reports app status, database status, and storage mode.
   * Never exposes MONGO_URL or any secret. Always 200 while the app is running.
   */
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      app: 'running',
      database: state.ready ? 'ready' : 'unavailable',
      storage: state.mode, // 'mongo' | 'local-dev-file' | 'unavailable'
    });
  });

  // Mount the API at both prefixes. The existing frontend calls
  // /api/roast-service/...; /api/... is provided as a convenience alias.
  // The router reads `state` live, so writes are gated until the store is ready.
  const apiRouter = createApiRouter(state);
  app.use('/api/roast-service', apiRouter);
  app.use('/api', apiRouter);

  // Serve the built React frontend.
  const indexHtml = path.join(FRONTEND_DIST, 'index.html');
  const hasFrontend = await fs
    .access(indexHtml)
    .then(() => true)
    .catch(() => false);

  if (hasFrontend) {
    app.use(express.static(FRONTEND_DIST));
    // SPA fallback: any non-API GET that wants HTML gets index.html so that
    // client routes (/wall, /certificate/:id) work on refresh.
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api') || req.path === '/health') return next();
      res.sendFile(indexHtml);
    });
  } else {
    console.warn(`Frontend build not found at ${FRONTEND_DIST}. Run the build first.`);
  }

  // Bind the port FIRST so the app is reachable immediately.
  app.listen(port, () => {
    console.log(`Roast Wall running on http://localhost:${port}`);
  });

  // Resolve persistence in the background; update the shared state in place.
  const resolved = await initStore();
  Object.assign(state, resolved);
  console.log(`Storage mode: ${state.mode} | database: ${state.ready ? 'ready' : 'unavailable'}`);
}

main().catch((err) => {
  console.error('Fatal startup error:', (err as Error).message);
  process.exit(1);
});
