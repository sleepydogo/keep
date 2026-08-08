import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = join(root, "data", "keep.db");

mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS orgs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL REFERENCES orgs(id),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS devices (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    org_id TEXT NOT NULL REFERENCES orgs(id),
    emisor_id TEXT NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    label TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS credentials (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    org_id TEXT NOT NULL REFERENCES orgs(id),
    alias TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    address_type TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    expires_at TEXT,
    validity_days INTEGER,
    issuer_id TEXT NOT NULL,
    public_key TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

// Migración suave desde schema ECDSA (public_key UNIQUE sin emisor_id)
const cols = db.prepare(`PRAGMA table_info(devices)`).all() as {
  name: string;
}[];
if (cols.length && !cols.some((c) => c.name === "emisor_id")) {
  db.exec(`
    DROP TABLE devices;
    CREATE TABLE devices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      org_id TEXT NOT NULL REFERENCES orgs(id),
      emisor_id TEXT NOT NULL UNIQUE,
      public_key TEXT NOT NULL,
      label TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL
    );
  `);
}

const demoOrgId = "demo-org";
const demoUserId = "demo-user";
const demoCreatedAt = "2026-01-01T00:00:00.000Z";
const demoExists = db
  .prepare(`SELECT id FROM users WHERE username = ?`)
  .get("demo");
if (!demoExists) {
  db.prepare(
    `INSERT INTO orgs (id, name, created_at) VALUES (?, ?, ?)`,
  ).run(demoOrgId, "Instituto KEEP Demo", demoCreatedAt);
  db.prepare(
    `INSERT INTO users (id, org_id, username, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(
    demoUserId,
    demoOrgId,
    "demo",
    "$2b$10$0DTvTCScmqG0KIid4eKixuepyFrAg5IwqBczOkVGFhThaKhFCyQCO",
    demoCreatedAt,
  );
}
