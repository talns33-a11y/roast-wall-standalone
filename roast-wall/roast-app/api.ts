/**
 * A roast certificate record returned by the backend.
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
 * Payload for creating a new roast.
 */
export interface CreateRoastInput {
  name: string;
  age: string;
  professionOrHobby: string;
  proudOf: string;
  ridiculousThing: string;
  tone: string;
}

/**
 * Base URL for the roast backend service.
 *
 * Both in dev and production the frontend talks to the API gateway through the
 * relative `/api` prefix. In dev, Vite proxies `/api` to the local gateway
 * (see vite.config.js). In production, the platform's public proxy forwards
 * `/api/*` to the gateway. The gateway then routes `/<service-name>/*` to each
 * backend service.
 */
const BASE = '/api/roast-service';

/**
 * Create a new roast certificate.
 *
 * @param input the submission details.
 * @returns the created roast record with serial number.
 */
export async function createRoast(input: CreateRoastInput): Promise<RoastRecord> {
  const res = await fetch(`${BASE}/roasts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create roast');
  return res.json();
}

/**
 * Fetch all roast certificates for the public wall.
 *
 * @returns array of roast records, newest first.
 */
export async function listRoasts(): Promise<RoastRecord[]> {
  const res = await fetch(`${BASE}/roasts`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load roasts');
  return res.json();
}

/**
 * Fetch a single roast certificate by id.
 *
 * @param id the roast id.
 * @returns the roast record.
 */
export async function getRoast(id: string): Promise<RoastRecord> {
  const res = await fetch(`${BASE}/roasts/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load roast');
  return res.json();
}
