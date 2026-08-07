import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import express from "express";
import { randomUUID } from "node:crypto";
import { db } from "./db.js";

const PORT = 5175;
const SESSION_DAYS = 14;
const COOKIE = "keep_session";

const app = express();
app.use(express.json());
app.use(cookieParser());

type UserRow = {
  id: string;
  org_id: string;
  username: string;
  password_hash: string;
};

const nowIso = () => new Date().toISOString();

const expiresAt = () => {
  const d = new Date();
  d.setDate(d.getDate() + SESSION_DAYS);
  return d.toISOString();
};

const getUserBySession = (sessionId: string | undefined) => {
  if (!sessionId) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.org_id, u.username, u.password_hash, o.name AS org_name
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       JOIN orgs o ON o.id = u.org_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(sessionId, nowIso()) as
    | (UserRow & { org_name: string })
    | undefined;
  return row ?? null;
};

const createSession = (res: express.Response, userId: string) => {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`,
  ).run(id, userId, expiresAt(), nowIso());
  res.cookie(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
};

app.post("/api/register", (req, res) => {
  const orgName = String(req.body?.orgName ?? "").trim();
  const username = String(req.body?.username ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");

  if (!orgName || !username || password.length < 6) {
    res.status(400).json({
      error: "Completá institución, usuario y contraseña (mín. 6).",
    });
    return;
  }

  const existing = db
    .prepare(`SELECT id FROM users WHERE username = ?`)
    .get(username);
  if (existing) {
    res.status(409).json({ error: "Ese usuario ya existe." });
    return;
  }

  const orgId = randomUUID();
  const userId = randomUUID();
  const passwordHash = bcrypt.hashSync(password, 10);
  const t = nowIso();

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO orgs (id, name, created_at) VALUES (?, ?, ?)`,
    ).run(orgId, orgName, t);
    db.prepare(
      `INSERT INTO users (id, org_id, username, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(userId, orgId, username, passwordHash, t);
  });
  tx();

  createSession(res, userId);
  res.json({
    user: { id: userId, username, orgId, orgName },
  });
});

app.post("/api/login", (req, res) => {
  const username = String(req.body?.username ?? "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password ?? "");

  const user = db
    .prepare(
      `SELECT u.id, u.org_id, u.username, u.password_hash, o.name AS org_name
       FROM users u JOIN orgs o ON o.id = u.org_id
       WHERE u.username = ?`,
    )
    .get(username) as (UserRow & { org_name: string }) | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    return;
  }

  createSession(res, user.id);
  res.json({
    user: {
      id: user.id,
      username: user.username,
      orgId: user.org_id,
      orgName: user.org_name,
    },
  });
});

app.post("/api/logout", (req, res) => {
  const sessionId = req.cookies?.[COOKIE] as string | undefined;
  if (sessionId) {
    db.prepare(`DELETE FROM sessions WHERE id = ?`).run(sessionId);
  }
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

app.get("/api/me", (req, res) => {
  const user = getUserBySession(req.cookies?.[COOKIE]);
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }
  res.json({
    user: {
      id: user.id,
      username: user.username,
      orgId: user.org_id,
      orgName: user.org_name,
    },
  });
});

app.post("/api/devices", (req, res) => {
  const user = getUserBySession(req.cookies?.[COOKIE]);
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }

  const emisorId = String(req.body?.emisorId ?? "").trim();
  const pk = req.body?.pk as { x?: string; y?: string } | undefined;
  const label = String(req.body?.label ?? "Este navegador").trim();

  if (!emisorId || !pk?.x || !pk?.y) {
    res.status(400).json({
      error: "Falta la identidad Jubjub del dispositivo (emisorId, pk).",
    });
    return;
  }

  const publicKey = JSON.stringify({ x: pk.x, y: pk.y });

  const existing = db
    .prepare(`SELECT id, status FROM devices WHERE emisor_id = ?`)
    .get(emisorId) as { id: string; status: string } | undefined;

  if (existing) {
    res.json({ device: { id: existing.id, status: existing.status } });
    return;
  }

  const id = randomUUID();
  db.prepare(
    `INSERT INTO devices
      (id, user_id, org_id, emisor_id, public_key, label, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
  ).run(id, user.id, user.org_id, emisorId, publicKey, label, nowIso());

  res.status(201).json({ device: { id, status: "active" } });
});

app.get("/api/devices", (req, res) => {
  const user = getUserBySession(req.cookies?.[COOKIE]);
  if (!user) {
    res.status(401).json({ error: "No autenticado." });
    return;
  }

  const devices = db
    .prepare(
      `SELECT id, label, status, created_at FROM devices
       WHERE org_id = ? ORDER BY created_at DESC`,
    )
    .all(user.org_id);

  res.json({ devices });
});

app.listen(PORT, () => {
  console.log(`KEEP API http://localhost:${PORT}`);
});
