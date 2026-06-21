import { promises as fs } from 'fs';
import path from 'path';
import mongoose, { Schema, Model } from 'mongoose';

/**
 * A stored roast certificate record returned by the API layer.
 */
export interface RoastRecord {
  id: string;
  serial: number;
  serialLabel: string;
  name: string;
  professionOrHobby: string;
  title: string;
  roastLine: string;
  hiddenCompliment: string;
  certificateText: string;
  socialCaption: string;
  tone: string;
  createdAt: string;
}

/** Content of a roast without server-assigned id/serial/timestamp. */
export type NewRoast = Omit<RoastRecord, 'id' | 'serial' | 'serialLabel' | 'createdAt'>;

/** Storage backend modes reported by /health. */
export type StorageMode = 'mongo' | 'local-dev-file' | 'unavailable';

/**
 * Unified store interface used by the API routes.
 */
export interface Store {
  all(): Promise<RoastRecord[]>;
  byId(id: string): Promise<RoastRecord | undefined>;
  add(record: NewRoast): Promise<RoastRecord>;
  count(): Promise<number>;
  exportCsv(): Promise<string>;
}

/** Result of resolving the active storage backend at startup. */
export interface StoreState {
  /** Active store, or null when the database is unavailable. */
  store: Store | null;
  /** Backend mode for /health reporting. */
  mode: StorageMode;
  /** True when the app can accept new roast submissions. */
  ready: boolean;
}

const serialLabelOf = (serial: number): string => `Roast #${String(serial).padStart(6, '0')}`;

function buildCsv(records: RoastRecord[]): string {
  const header = 'serial,name,tone,title,roastLine,createdAt';
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = records.map(
    (r) =>
      `${r.serial},${escape(r.name)},${escape(r.tone)},${escape(r.title)},${escape(r.roastLine)},${escape(r.createdAt)}`
  );
  return [header, ...rows].join('\n');
}

// ---------------------------------------------------------------------------
// MongoDB backend (production + dev when MONGO_URL is set)
// ---------------------------------------------------------------------------

interface IRoastDocument {
  serial: number;
  serialLabel: string;
  name: string;
  professionOrHobby: string;
  title: string;
  roastLine: string;
  hiddenCompliment: string;
  certificateText: string;
  socialCaption: string;
  tone: string;
  createdAt: Date;
}

const roastSchema = new Schema<IRoastDocument>(
  {
    serial: { type: Number, required: true, unique: true },
    serialLabel: { type: String, required: true },
    name: { type: String, required: true },
    professionOrHobby: { type: String, default: '' },
    title: { type: String, required: true },
    roastLine: { type: String, required: true },
    hiddenCompliment: { type: String, required: true },
    certificateText: { type: String, required: true },
    socialCaption: { type: String, required: true },
    tone: { type: String, default: 'brutal-but-safe' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

const RoastModel: Model<IRoastDocument> =
  (mongoose.models['Roast'] as Model<IRoastDocument>) ||
  mongoose.model<IRoastDocument>('Roast', roastSchema);

/** Atomic counter document — one row per named sequence. */
interface ICounterDocument {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounterDocument>({
  _id: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
});

const CounterModel: Model<ICounterDocument> =
  (mongoose.models['Counter'] as Model<ICounterDocument>) ||
  mongoose.model<ICounterDocument>('Counter', counterSchema);

const COUNTER_ID = 'roast';

function docToRecord(raw: Record<string, unknown>): RoastRecord {
  const id = String(raw._id ?? raw.id ?? '');
  const createdAt =
    raw.createdAt instanceof Date ? raw.createdAt.toISOString() : String(raw.createdAt ?? '');
  return {
    id,
    serial: raw.serial as number,
    serialLabel: raw.serialLabel as string,
    name: raw.name as string,
    professionOrHobby: (raw.professionOrHobby as string) || '',
    title: raw.title as string,
    roastLine: raw.roastLine as string,
    hiddenCompliment: raw.hiddenCompliment as string,
    certificateText: raw.certificateText as string,
    socialCaption: raw.socialCaption as string,
    tone: (raw.tone as string) || 'brutal-but-safe',
    createdAt,
  };
}

class MongoStore implements Store {
  /**
   * Open the connection and seed the serial counter so it is never lower than
   * the highest existing serial (protects against resets and migrations from
   * the old max+1 store).
   */
  async connect(): Promise<void> {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error('MONGO_URL is not set');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
    const last = await RoastModel.findOne().sort({ serial: -1 }).lean();
    const maxSerial = last ? (last.serial as number) : 0;
    // $max + upsert: create at maxSerial if absent, else raise to maxSerial.
    await CounterModel.updateOne({ _id: COUNTER_ID }, { $max: { seq: maxSerial } }, { upsert: true });
  }

  /** Atomically reserve the next serial number. Concurrency-safe. */
  private async nextSerial(): Promise<number> {
    const counter = await CounterModel.findOneAndUpdate(
      { _id: COUNTER_ID },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).lean();
    return (counter as ICounterDocument).seq;
  }

  async all(): Promise<RoastRecord[]> {
    const docs = await RoastModel.find().sort({ serial: -1 }).lean();
    return docs.map((d) => docToRecord(d as Record<string, unknown>));
  }

  async byId(id: string): Promise<RoastRecord | undefined> {
    if (!mongoose.isValidObjectId(id)) return undefined;
    const doc = await RoastModel.findById(id).lean();
    return doc ? docToRecord(doc as Record<string, unknown>) : undefined;
  }

  async add(record: NewRoast): Promise<RoastRecord> {
    const serial = await this.nextSerial();
    const doc = await RoastModel.create({
      ...record,
      serial,
      serialLabel: serialLabelOf(serial),
    });
    return docToRecord(JSON.parse(JSON.stringify(doc)) as Record<string, unknown>);
  }

  async count(): Promise<number> {
    return RoastModel.countDocuments();
  }

  async exportCsv(): Promise<string> {
    return buildCsv(await this.all());
  }
}

// ---------------------------------------------------------------------------
// Dev-only file backend (NODE_ENV !== 'production', no MONGO_URL)
// ---------------------------------------------------------------------------

const DEV_DATA_DIR = path.resolve(process.cwd(), 'data');
const DEV_DATA_FILE = path.join(DEV_DATA_DIR, 'roasts.json');

/**
 * Local development store. Writes to ./data/roasts.json (git-ignored) so data
 * survives a restart on a developer machine. NEVER used in production.
 */
class DevFileStore implements Store {
  private records: RoastRecord[] = [];
  private loaded = false;

  private async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await fs.readFile(DEV_DATA_FILE, 'utf-8');
      this.records = JSON.parse(raw);
    } catch {
      this.records = [];
    }
    this.loaded = true;
  }

  private async persist(): Promise<void> {
    await fs.mkdir(DEV_DATA_DIR, { recursive: true });
    await fs.writeFile(DEV_DATA_FILE, JSON.stringify(this.records, null, 2), 'utf-8');
  }

  async all(): Promise<RoastRecord[]> {
    await this.load();
    return [...this.records].sort((a, b) => b.serial - a.serial);
  }

  async byId(id: string): Promise<RoastRecord | undefined> {
    await this.load();
    return this.records.find((r) => r.id === id);
  }

  async add(record: NewRoast): Promise<RoastRecord> {
    await this.load();
    const serial = this.records.reduce((max, r) => Math.max(max, r.serial), 0) + 1;
    const full: RoastRecord = {
      ...record,
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      serial,
      serialLabel: serialLabelOf(serial),
      createdAt: new Date().toISOString(),
    };
    this.records.push(full);
    await this.persist();
    return full;
  }

  async count(): Promise<number> {
    await this.load();
    return this.records.length;
  }

  async exportCsv(): Promise<string> {
    return buildCsv(await this.all());
  }
}

// ---------------------------------------------------------------------------
// Resolver
// ---------------------------------------------------------------------------

const isProd = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Resolve the active storage backend.
 *
 * Production: requires MONGO_URL and a live connection. On any failure the app
 * stays up but reports the database as unavailable and refuses submissions.
 * It NEVER falls back to file storage in production.
 *
 * Development: uses Mongo if MONGO_URL is set, otherwise the local ./data file
 * store for testing only.
 *
 * @returns the resolved store state for the lifetime of the process.
 */
export async function initStore(): Promise<StoreState> {
  const hasMongo = Boolean(process.env.MONGO_URL);

  if (hasMongo) {
    try {
      const store = new MongoStore();
      await store.connect();
      return { store, mode: 'mongo', ready: true };
    } catch (err) {
      // Do not leak the URI or credentials — log message only.
      console.error('MongoDB connection failed:', (err as Error).message);
      if (isProd()) return { store: null, mode: 'unavailable', ready: false };
      // dev: fall through to local file store below.
    }
  }

  if (isProd()) {
    // Production with no MONGO_URL: refuse to persist anywhere.
    console.error('Production requires MONGO_URL. Database is unavailable.');
    return { store: null, mode: 'unavailable', ready: false };
  }

  // Development fallback only.
  console.warn('Using local ./data file store (development only).');
  return { store: new DevFileStore(), mode: 'local-dev-file', ready: true };
}
