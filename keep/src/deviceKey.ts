import { clavesEmisor, pureCircuits } from "@keep/contract/credencial";

const DB_NAME = "keep-device";
const STORE = "keys";
const DB_VERSION = 3;

export type EmisorJubjub = {
  emisorSecret: Uint8Array;
  emisorId: string;
  sk: bigint;
  pk: { x: string; y: string };
};

export const toHex = (bytes: Uint8Array): string =>
  [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

export const deHex = (hex: string): Uint8Array =>
  Uint8Array.from(hex.match(/../g)!.map((h) => parseInt(h, 16)));

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const idb = async <T>(
  modo: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest,
): Promise<T> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, modo).objectStore(STORE));
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
};

/**
 * Identidad del emisor: un solo secreto guardado. El emisorId y la clave de
 * firma se derivan de él, así que reiniciar el navegador no los cambia.
 */
export const ensureDeviceKey = async (
  userId: string,
  register: (emisor: EmisorJubjub) => Promise<void>,
): Promise<EmisorJubjub> => {
  // El emisor de la demo: el mismo secreto que registró `npm run registrar`.
  // Sin esto cada navegador inventa un emisorId que no está on-chain y las
  // presentaciones fallan con "Emisor no registrado".
  const delEnv = import.meta.env["VITE_EMISOR_SECRET"] as string | undefined;

  const clave = `user:${userId}`;
  let hex = delEnv || (await idb<string | undefined>("readonly", (s) => s.get(clave)));

  if (!hex) {
    hex = toHex(crypto.getRandomValues(new Uint8Array(32)));
    await idb("readwrite", (s) => s.put(hex, clave));
  }

  const emisorSecret = deHex(hex);
  const { sk, pk } = clavesEmisor(emisorSecret);
  const emisor: EmisorJubjub = {
    emisorSecret,
    emisorId: toHex(pureCircuits.derivarEmisorId(emisorSecret)),
    sk,
    pk: { x: pk.x.toString(), y: pk.y.toString() },
  };

  await register(emisor);
  return emisor;
};
