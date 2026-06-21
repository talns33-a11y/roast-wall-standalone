import { Router, RequestHandler } from 'express';
import { timingSafeEqual } from 'crypto';
import { generateRoast, RoastInput } from '../roast-wall/roast-service/roast-generator.js';
import type { StoreState } from './store.js';

const isProd = (): boolean => process.env.NODE_ENV === 'production';

/** Constant-time string compare that is safe against length leaks. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Guard for admin routes. The token is read ONLY from the ADMIN_TOKEN
 * environment variable and is never logged or returned.
 *
 * - Token set  → caller must send it via `Authorization: Bearer <token>` or
 *   the `x-admin-token` header; mismatch → 403.
 * - Token unset in production → 404 (route is hidden, not merely refused).
 * - Token unset in development → allowed, with a one-time warning.
 */
let warnedNoToken = false;
const adminGuard: RequestHandler = (req, res, next) => {
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    if (isProd()) {
      res.status(404).end();
      return;
    }
    if (!warnedNoToken) {
      console.warn('ADMIN_TOKEN not set — admin routes are open (development only).');
      warnedNoToken = true;
    }
    next();
    return;
  }

  const bearer = (req.header('authorization') || '').replace(/^Bearer\s+/i, '');
  const provided = bearer || req.header('x-admin-token') || '';
  if (provided && safeEqual(provided, expected)) {
    next();
    return;
  }
  res.status(403).json({ error: 'Forbidden' });
};

/**
 * Build the roast API router. The same router instance is mounted at both
 * `/api/roast-service` (the path the existing frontend already calls) and
 * `/api` (so `/api/roasts` works too).
 *
 * @param state the resolved store state; `state.store` may be null when the
 *   database is unavailable, in which case writes return 503.
 */
export function createApiRouter(state: StoreState): Router {
  const router = Router();

  /** Guard: require a ready store for any write. */
  const requireStore = (): NonNullable<StoreState['store']> | null =>
    state.ready && state.store ? state.store : null;

  /** Create a roast — generate, assign serial, persist. */
  router.post('/roasts', async (req, res) => {
    const store = requireStore();
    if (!store) {
      res.status(503).json({ error: 'Database not ready. Roast submissions are temporarily unavailable.' });
      return;
    }
    try {
      const input = req.body as RoastInput;
      if (!input?.name) {
        res.status(400).json({ error: 'name is required' });
        return;
      }
      const roast = generateRoast(input);
      const record = await store.add({
        name: input.name,
        professionOrHobby: input.professionOrHobby || '',
        title: roast.title,
        roastLine: roast.roastLine,
        hiddenCompliment: roast.hiddenCompliment,
        certificateText: roast.certificateText,
        socialCaption: roast.socialCaption,
        tone: input.tone || 'brutal-but-safe',
      });
      res.json(record);
    } catch (err) {
      console.error('POST /roasts error:', (err as Error).message);
      res.status(500).json({ error: 'Failed to generate roast' });
    }
  });

  /** List all roasts (newest first). */
  router.get('/roasts', async (_req, res) => {
    const store = requireStore();
    if (!store) {
      res.status(503).json({ error: 'Database not ready.' });
      return;
    }
    try {
      res.json(await store.all());
    } catch (err) {
      console.error('GET /roasts error:', (err as Error).message);
      res.status(500).json({ error: 'Failed to load roasts' });
    }
  });

  /** Get a single roast by id. */
  router.get('/roasts/:id', async (req, res) => {
    const store = requireStore();
    if (!store) {
      res.status(503).json({ error: 'Database not ready.' });
      return;
    }
    try {
      const record = await store.byId(req.params.id);
      if (!record) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(record);
    } catch (err) {
      console.error('GET /roasts/:id error:', (err as Error).message);
      res.status(500).json({ error: 'Failed to load roast' });
    }
  });

  /** Admin routes require ADMIN_TOKEN (see adminGuard). Covers /admin and /admin/export.csv. */
  router.use('/admin', adminGuard);

  /** Admin stats. */
  router.get('/admin', async (_req, res) => {
    const store = requireStore();
    if (!store) {
      res.status(503).json({ error: 'Database not ready.' });
      return;
    }
    try {
      const total = await store.count();
      const latest = (await store.all()).slice(0, 10);
      res.json({ total, latest, db: state.mode });
    } catch {
      res.status(500).json({ error: 'Failed to load admin data' });
    }
  });

  /** Admin CSV export. */
  router.get('/admin/export.csv', async (_req, res) => {
    const store = requireStore();
    if (!store) {
      res.status(503).json({ error: 'Database not ready.' });
      return;
    }
    try {
      const csv = await store.exportCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="roast-wall-export.csv"');
      res.send(csv);
    } catch {
      res.status(500).json({ error: 'Export failed' });
    }
  });

  return router;
}
