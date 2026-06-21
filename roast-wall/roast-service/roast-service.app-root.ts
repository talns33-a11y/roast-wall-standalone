import express from 'express';
import cors from 'cors';
import { generateRoast, RoastInput } from "./roast-generator.js";
import { MongoRoastStore, RoastRecord } from "./roast-store-mongo.js";
import { RoastStore as FileRoastStore } from "./roast-store.js";

/**
 * Unified store interface used by the API routes.
 */
interface Store {
  all(): Promise<RoastRecord[]>;
  byId(id: string): Promise<RoastRecord | undefined>;
  add(record: Omit<RoastRecord, 'id' | 'serial' | 'serialLabel' | 'createdAt'>): Promise<RoastRecord>;
  count(): Promise<number>;
  exportCsv(): Promise<string>;
}

/**
 * Roast service entry point.
 *
 * The server binds its port IMMEDIATELY so the platform gateway can register
 * it. MongoDB Atlas connection happens in the background after the server is
 * already up. All requests wait for the store to be ready via a lightweight
 * promise gate.
 */
export function run() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  // Store promise — resolves once the backing store is ready.
  let storeReady!: (s: Store) => void;
  const storePromise = new Promise<Store>((resolve) => { storeReady = resolve; });
  let dbType = 'initializing';

  /**
   * Return the active store. All route handlers call this so they naturally
   * wait for MongoDB (or file store) to be ready without blocking startup.
   */
  const getStore = () => storePromise;

  // Resolve the store in the background — server is already listening.
  const initStore = async () => {
    const mongoUrl = process.env.MONGO_URL;
    if (mongoUrl) {
      try {
        const mongo = new MongoRoastStore();
        // Use a 10-second timeout so we don't hang forever.
        await Promise.race([
          mongo.count(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('MongoDB connection timeout')), 10_000)
          ),
        ]);
        dbType = 'mongodb';
        console.log('🗄️  Using MongoDB Atlas for persistence');
        storeReady(mongo);
        return;
      } catch (err) {
        console.error('⚠️  MongoDB connection failed, using file store:', (err as Error).message);
      }
    } else {
      console.warn('⚠️  MONGO_URL not set — using file-based store');
    }
    dbType = 'file';
    storeReady(new FileRoastStore());
    console.log('📁  Using file-based store');
  };

  // Fire and forget — binds after server starts.
  initStore().catch((err) => {
    console.error('Fatal store init error:', err);
    dbType = 'file';
    storeReady(new FileRoastStore());
  });

  /** Health check — shows which DB backend is active. */
  app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'roast-service', db: dbType });
  });

  /** Create a roast — generate, assign serial, persist. */
  app.post('/roasts', async (req, res) => {
    try {
      const input = req.body as RoastInput;
      if (!input?.name) { res.status(400).json({ error: 'name is required' }); return; }
      const roast = generateRoast(input);
      const store = await getStore();
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
      console.error('POST /roasts error:', err);
      res.status(500).json({ error: 'Failed to generate roast' });
    }
  });

  /** List all roasts (newest first). */
  app.get('/roasts', async (_req, res) => {
    try {
      const store = await getStore();
      res.json(await store.all());
    } catch (err) {
      console.error('GET /roasts error:', err);
      res.status(500).json({ error: 'Failed to load roasts' });
    }
  });

  /** Get a single roast by id. */
  app.get('/roasts/:id', async (req, res) => {
    try {
      const store = await getStore();
      const record = await store.byId(req.params.id);
      if (!record) { res.status(404).json({ error: 'Not found' }); return; }
      res.json(record);
    } catch (err) {
      console.error('GET /roasts/:id error:', err);
      res.status(500).json({ error: 'Failed to load roast' });
    }
  });

  /** Admin stats. */
  app.get('/admin', async (_req, res) => {
    try {
      const store = await getStore();
      const total = await store.count();
      const latest = (await store.all()).slice(0, 10);
      res.json({ total, latest, db: dbType });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load admin data' });
    }
  });

  /** Admin CSV export. */
  app.get('/admin/export.csv', async (_req, res) => {
    try {
      const store = await getStore();
      const csv = await store.exportCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="roast-wall-export.csv"');
      res.send(`serial,name,tone,title,roastLine,createdAt\n${csv}`);
    } catch (err) {
      res.status(500).json({ error: 'Export failed' });
    }
  });

  // Bind the port FIRST — store resolves in the background.
  const server = app.listen(port, () => {
    console.log(`🔥  Roast service starting at: http://localhost:${port} (store initializing…)`);
  });

  return {
    port,
    stop: async () => {
      server.closeAllConnections();
      server.close();
    }
  };
}
