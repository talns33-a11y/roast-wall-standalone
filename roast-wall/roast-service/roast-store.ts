import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

/**
 * A stored roast certificate record.
 */
export interface RoastRecord {
  /** Unique id. */
  id: string;
  /** Sequential serial number, e.g. 1 -> "Roast #000001". */
  serial: number;
  /** Formatted serial label. */
  serialLabel: string;
  /** Person's name. */
  name: string;
  /** Profession or hobby. */
  professionOrHobby: string;
  /** Roast title. */
  title: string;
  /** Funny roast line. */
  roastLine: string;
  /** Hidden compliment. */
  hiddenCompliment: string;
  /** Full shareable certificate text. */
  certificateText: string;
  /** Social sharing caption. */
  socialCaption: string;
  /** Selected tone. */
  tone: string;
  /** Creation timestamp (ISO string). */
  createdAt: string;
}

const STORE_PATH = path.join(os.tmpdir(), 'million-ai-roast-wall.json');

/**
 * Simple file-based JSON store for roast records. No external dependencies,
 * persists across requests within a running instance.
 */
export class RoastStore {
  private records: RoastRecord[] = [];
  private loaded = false;

  private async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await fs.readFile(STORE_PATH, 'utf-8');
      this.records = JSON.parse(raw);
    } catch {
      this.records = [];
    }
    this.loaded = true;
  }

  private async persist(): Promise<void> {
    try {
      await fs.writeFile(STORE_PATH, JSON.stringify(this.records, null, 2), 'utf-8');
    } catch {
      // ignore persistence errors; keep in-memory copy.
    }
  }

  /**
   * Get all roast records, newest first.
   */
  async all(): Promise<RoastRecord[]> {
    await this.load();
    return [...this.records].sort((a, b) => b.serial - a.serial);
  }

  /**
   * Find a single record by id.
   */
  async byId(id: string): Promise<RoastRecord | undefined> {
    await this.load();
    return this.records.find((r) => r.id === id);
  }

  /**
   * Count total records.
   */
  async count(): Promise<number> {
    await this.load();
    return this.records.length;
  }

  /**
   * Export all records as CSV.
   */
  async exportCsv(): Promise<string> {
    const records = await this.all();
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = records.map(
      (r) => `${r.serial},${escape(r.name)},${escape(r.tone)},${escape(r.title)},${escape(r.roastLine)},${escape(r.createdAt)}`
    );
    return ['serial,name,tone,title,roastLine,createdAt', ...rows].join('\n');
  }

  /**
   * Add a new record. Serial is auto-incremented.
   */
  async add(record: Omit<RoastRecord, 'id' | 'serial' | 'serialLabel' | 'createdAt'>): Promise<RoastRecord> {
    await this.load();
    const serial = this.records.reduce((max, r) => Math.max(max, r.serial), 0) + 1;
    const full: RoastRecord = {
      ...record,
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      serial,
      serialLabel: `Roast #${String(serial).padStart(6, '0')}`,
      createdAt: new Date().toISOString(),
    };
    this.records.push(full);
    await this.persist();
    return full;
  }
}
