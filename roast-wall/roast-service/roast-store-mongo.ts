import mongoose from 'mongoose';
import { RoastModel } from './roast-model.js';

/**
 * A stored roast certificate record (serialised for the API layer).
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

/**
 * Convert a Mongoose lean object to a plain API-safe record.
 * Uses `unknown` as the bridge type to avoid conflicts between the lean
 * Mongoose type and our interface.
 *
 * @param doc the lean document from Mongoose.
 * @returns a serialised RoastRecord.
 */
function toRecord(doc: unknown): RoastRecord {
  const raw = doc as Record<string, unknown>;
  const id = (raw.id as string | undefined) || String(raw._id);
  const createdAt =
    raw.createdAt instanceof Date
      ? raw.createdAt.toISOString()
      : String(raw.createdAt ?? '');
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

/**
 * MongoDB-backed roast store. Connects lazily on first use and keeps a single
 * connection alive for the lifetime of the process.
 */
export class MongoRoastStore {
  private connected = false;

  /** Ensure the Mongoose connection is open before any DB operation. */
  private async connect(): Promise<void> {
    if (this.connected && mongoose.connection.readyState === 1) return;
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error('MONGO_URL env var is not set');
    await mongoose.connect(uri);
    this.connected = true;
    console.log('🗄️  MongoDB connected');
  }

  /**
   * Get all roast records, newest first.
   *
   * @returns sorted array of roast records.
   */
  async all(): Promise<RoastRecord[]> {
    await this.connect();
    const docs = await RoastModel.find().sort({ serial: -1 }).lean();
    return docs.map(toRecord);
  }

  /**
   * Find a single record by MongoDB `_id` string.
   *
   * @param id the roast document id.
   * @returns the matching record, or undefined.
   */
  async byId(id: string): Promise<RoastRecord | undefined> {
    await this.connect();
    if (!mongoose.isValidObjectId(id)) return undefined;
    const doc = await RoastModel.findById(id).lean();
    return doc ? toRecord(doc) : undefined;
  }

  /**
   * Add a new roast. Serial number is atomically determined as max+1.
   *
   * @param record the roast content without id/serial/timestamp.
   * @returns the fully-populated persisted record.
   */
  async add(
    record: Omit<RoastRecord, 'id' | 'serial' | 'serialLabel' | 'createdAt'>
  ): Promise<RoastRecord> {
    await this.connect();
    const last = await RoastModel.findOne().sort({ serial: -1 }).lean();
    const lastSerial = last ? (last.serial as number) : 0;
    const serial = lastSerial + 1;
    const serialLabel = `Roast #${String(serial).padStart(6, '0')}`;
    const doc = await RoastModel.create({ ...record, serial, serialLabel });
    // JSON.parse(JSON.stringify(...)) produces a plain object with no
    // Mongoose prototype methods, making it safe to pass to `toRecord`.
    return toRecord(JSON.parse(JSON.stringify(doc)) as unknown);
  }

  /**
   * Count total roast submissions.
   *
   * @returns number of documents in the collection.
   */
  async count(): Promise<number> {
    await this.connect();
    return RoastModel.countDocuments();
  }

  /**
   * Export all roasts as a CSV string (admin use).
   *
   * @returns CSV content with a header row.
   */
  async exportCsv(): Promise<string> {
    const records = await this.all();
    const header = 'serial,name,tone,title,roastLine,createdAt';
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = records.map(
      (r) =>
        `${r.serial},${escape(r.name)},${escape(r.tone)},${escape(r.title)},${escape(r.roastLine)},${escape(r.createdAt)}`
    );
    return [header, ...rows].join('\n');
  }
}
