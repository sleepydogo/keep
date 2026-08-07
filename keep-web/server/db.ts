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
    public_key TEXT NOT NULL UNIQUE,
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
`);
