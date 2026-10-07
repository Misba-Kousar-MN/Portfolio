import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

export interface StoredFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  mimeType?: string;
  buffer?: Buffer;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DATA_UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure local directories exist for fallback/dev
function ensureLocalDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_UPLOADS_DIR)) {
    fs.mkdirSync(DATA_UPLOADS_DIR, { recursive: true });
  }
}

// PostgreSQL Connection Setup (if DATABASE_URL or POSTGRES_URL is defined)
const postgresUrl = process.env['DATABASE_URL'] || process.env['POSTGRES_URL'];
let pool: Pool | null = null;
let tablesInitialized = false;

if (postgresUrl) {
  try {
    pool = new Pool({
      connectionString: postgresUrl,
      ssl: process.env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : undefined,
    });
  } catch (err) {
    console.error('Failed to initialize Postgres pool:', err);
  }
}

async function initPgTables() {
  if (!pool || tablesInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_kv_store (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_files (
        filename VARCHAR(255) PRIMARY KEY,
        mime_type VARCHAR(100) NOT NULL,
        content_base64 TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    tablesInitialized = true;
  } catch (err) {
    console.error('Error initializing PostgreSQL tables:', err);
  }
}

// Vercel KV / Upstash Redis REST credentials (if configured)
const kvRestUrl = process.env['KV_REST_API_URL'] || process.env['UPSTASH_REDIS_REST_URL'];
const kvRestToken = process.env['KV_REST_API_TOKEN'] || process.env['UPSTASH_REDIS_REST_TOKEN'];

async function kvRestFetch(command: string, ...args: (string | number)[]) {
  if (!kvRestUrl || !kvRestToken) return null;
  try {
    const url = `${kvRestUrl}/${command}/${args.map(encodeURIComponent).join('/')}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${kvRestToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch (err) {
    console.error('KV REST fetch error:', err);
    return null;
  }
}

// ----------------------------------------------------
// KV Storage Interface (portfolio-content & contact-messages)
// ----------------------------------------------------

export async function getKVStore(key: string): Promise<string | null> {
  // 1. Try PostgreSQL
  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query('SELECT value FROM portfolio_kv_store WHERE key = $1', [key]);
      if (res.rows.length > 0) {
        return res.rows[0].value;
      }
    } catch (err) {
      console.error(`PostgreSQL getKVStore error for key [${key}]:`, err);
    }
  }

  // 2. Try Redis / Vercel KV REST
  if (kvRestUrl && kvRestToken) {
    try {
      const val = await kvRestFetch('get', key);
      if (typeof val === 'string') return val;
      if (val) return JSON.stringify(val);
    } catch (err) {
      console.error(`KV REST getKVStore error for key [${key}]:`, err);
    }
  }

  // 3. Fallback to Local Disk JSON file
  try {
    ensureLocalDirs();
    const filePath = path.join(DATA_DIR, `${key}.json`);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.error(`Local disk getKVStore error for key [${key}]:`, err);
  }

  return null;
}

export async function setKVStore(key: string, value: string): Promise<void> {
  // Always update local disk as backup/dev copy
  try {
    ensureLocalDirs();
    const filePath = path.join(DATA_DIR, `${key}.json`);
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, value, 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.warn(`Local disk setKVStore fallback error for key [${key}]:`, err);
  }

  // 1. Try PostgreSQL
  if (pool) {
    try {
      await initPgTables();
      await pool.query(
        `INSERT INTO portfolio_kv_store (key, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [key, value]
      );
    } catch (err) {
      console.error(`PostgreSQL setKVStore error for key [${key}]:`, err);
    }
  }

  // 2. Try Redis / Vercel KV REST
  if (kvRestUrl && kvRestToken) {
    try {
      await kvRestFetch('set', key, value);
    } catch (err) {
      console.error(`KV REST setKVStore error for key [${key}]:`, err);
    }
  }
}

// ----------------------------------------------------
// File Storage Interface (Resume PDF & Uploaded Media)
// ----------------------------------------------------

export async function saveStoredFile(
  filename: string,
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const base64 = buffer.toString('base64');
  const size = buffer.length;
  const publicUrl = `/uploads/${filename}`;

  // Always write locally to public/uploads & data/uploads for local dev & fallback
  try {
    ensureLocalDirs();
    const targetPathPublic = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(targetPathPublic, buffer);

    const targetPathData = path.join(DATA_UPLOADS_DIR, filename);
    fs.writeFileSync(targetPathData, buffer);

    if (filename === 'resume.pdf' || filename.startsWith('resume')) {
      const rootResumePath = path.join(process.cwd(), 'public', 'resume.pdf');
      fs.writeFileSync(rootResumePath, buffer);
    }
  } catch (err) {
    console.warn(`Local disk saveStoredFile fallback error for [${filename}]:`, err);
  }

  // 1. PostgreSQL Persistence
  if (pool) {
    try {
      await initPgTables();
      await pool.query(
        `INSERT INTO portfolio_files (filename, mime_type, content_base64, size, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (filename) DO UPDATE SET mime_type = $2, content_base64 = $3, size = $4, created_at = NOW()`,
        [filename, mimeType, base64, size]
      );
    } catch (err) {
      console.error(`PostgreSQL saveStoredFile error for [${filename}]:`, err);
    }
  }

  // 2. KV REST Persistence
  if (kvRestUrl && kvRestToken) {
    try {
      const fileObj = JSON.stringify({ filename, mimeType, base64, size, createdAt: new Date().toISOString() });
      await kvRestFetch('set', `file:${filename}`, fileObj);
    } catch (err) {
      console.error(`KV REST saveStoredFile error for [${filename}]:`, err);
    }
  }

  return publicUrl;
}

export async function getStoredFile(
  filename: string
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  // 1. PostgreSQL
  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query(
        'SELECT mime_type, content_base64 FROM portfolio_files WHERE filename = $1',
        [filename]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          buffer: Buffer.from(row.content_base64, 'base64'),
          mimeType: row.mime_type,
        };
      }
    } catch (err) {
      console.error(`PostgreSQL getStoredFile error for [${filename}]:`, err);
    }
  }

  // 2. KV REST
  if (kvRestUrl && kvRestToken) {
    try {
      const raw = await kvRestFetch('get', `file:${filename}`);
      if (raw) {
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (parsed && parsed.base64) {
          return {
            buffer: Buffer.from(parsed.base64, 'base64'),
            mimeType: parsed.mimeType || 'application/octet-stream',
          };
        }
      }
    } catch (err) {
      console.error(`KV REST getStoredFile error for [${filename}]:`, err);
    }
  }

  // 3. Fallback to Local Disk
  try {
    ensureLocalDirs();
    let filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DATA_UPLOADS_DIR, filename);
    }
    if (!fs.existsSync(filePath) && filename === 'resume.pdf') {
      filePath = path.join(process.cwd(), 'public', 'resume.pdf');
    }

    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      let mimeType = 'application/octet-stream';
      if (filename.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (filename.endsWith('.png')) mimeType = 'image/png';
      else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (filename.endsWith('.webp')) mimeType = 'image/webp';
      else if (filename.endsWith('.svg')) mimeType = 'image/svg+xml';
      else if (filename.endsWith('.gif')) mimeType = 'image/gif';

      return { buffer, mimeType };
    }
  } catch (err) {
    console.error(`Local disk getStoredFile error for [${filename}]:`, err);
  }

  return null;
}

export async function listStoredMedia(): Promise<StoredFile[]> {
  const mediaMap = new Map<string, StoredFile>();

  // 1. PostgreSQL Files
  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query(
        "SELECT filename, mime_type, size, created_at FROM portfolio_files WHERE filename NOT LIKE 'resume%' ORDER BY created_at DESC"
      );
      for (const row of res.rows) {
        mediaMap.set(row.filename, {
          name: row.filename,
          url: `/uploads/${row.filename}`,
          size: Number(row.size),
          createdAt: new Date(row.created_at).toISOString(),
          mimeType: row.mime_type,
        });
      }
    } catch (err) {
      console.error('PostgreSQL listStoredMedia error:', err);
    }
  }

  // 2. Local Disk Files (Merge)
  try {
    ensureLocalDirs();
    const localFiles = fs.readdirSync(UPLOADS_DIR);
    for (const file of localFiles) {
      if (file.startsWith('.') || file.startsWith('resume')) continue;
      if (!mediaMap.has(file)) {
        const filePath = path.join(UPLOADS_DIR, file);
        const stats = fs.statSync(filePath);
        mediaMap.set(file, {
          name: file,
          url: `/uploads/${file}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        });
      }
    }
  } catch (err) {
    console.error('Local disk listStoredMedia error:', err);
  }

  return Array.from(mediaMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deleteStoredFile(filename: string): Promise<boolean> {
  let deleted = false;

  // Local disk deletion
  try {
    ensureLocalDirs();
    const p1 = path.join(UPLOADS_DIR, filename);
    const p2 = path.join(DATA_UPLOADS_DIR, filename);
    if (fs.existsSync(p1)) {
      fs.unlinkSync(p1);
      deleted = true;
    }
    if (fs.existsSync(p2)) {
      fs.unlinkSync(p2);
      deleted = true;
    }
  } catch (err) {
    console.warn(`Local disk deleteStoredFile error for [${filename}]:`, err);
  }

  // Postgres deletion
  if (pool) {
    try {
      await initPgTables();
      const res = await pool.query('DELETE FROM portfolio_files WHERE filename = $1', [filename]);
      if (res.rowCount && res.rowCount > 0) deleted = true;
    } catch (err) {
      console.error(`PostgreSQL deleteStoredFile error for [${filename}]:`, err);
    }
  }

  // KV REST deletion
  if (kvRestUrl && kvRestToken) {
    try {
      await kvRestFetch('del', `file:${filename}`);
      deleted = true;
    } catch (err) {
      console.error(`KV REST deleteStoredFile error for [${filename}]:`, err);
    }
  }

  return deleted;
}
