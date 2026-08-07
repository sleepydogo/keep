import { ecMulGenerator, type JubjubPoint } from "@midnight-ntwrk/compact-runtime";

const DB_NAME = "keep-device";
const STORE = "keys";
const DB_VERSION = 2;
const ORDEN =
  6554484396890773809930967563523245729705921265872317281365359162392183254199n;

export type EmisorJubjub = {
  emisorId: string;
  pk: { x: string; y: string };
};

type StoredDevice = {
  sk: string;
  emisorSecret: string;
  emisorId: string;
  pk: { x: string; y: string };
};

const toHex = (bytes: Uint8Array): string =>
  [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

const bytesAleatorios = (n: number): Uint8Array =>
  crypto.getRandomValues(new Uint8Array(n));

const aBigInt = (b: Uint8Array): bigint => BigInt("0x" + toHex(b));

const pkToJson = (pk: JubjubPoint) => ({
  x: pk.x.toString(),
  y: pk.y.toString(),
});

/** emisorId = SHA-256(emisorSecret), 32 bytes en hex. */
const derivarEmisorId = async (emisorSecret: Uint8Array): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    emisorSecret as BufferSource,
  );
  return toHex(new Uint8Array(digest));
};

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const idbGet = async (key: string): Promise<StoredDevice | undefined> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as StoredDevice | undefined);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (key: string, value: StoredDevice): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const generar = async (): Promise<StoredDevice> => {
  const emisorSecret = bytesAleatorios(32);
  const sk = aBigInt(bytesAleatorios(32)) % ORDEN;
  const pk = pkToJson(ecMulGenerator(sk));
  const emisorId = await derivarEmisorId(emisorSecret);
  return {
    sk: sk.toString(16),
    emisorSecret: toHex(emisorSecret),
    emisorId,
    pk,
  };
};

/** Genera o reutiliza la identidad Jubjub del dispositivo y la registra. */
export const ensureDeviceKey = async (
  userId: string,
  register: (emisor: EmisorJubjub) => Promise<void>,
): Promise<EmisorJubjub> => {
  const storageKey = `user:${userId}`;
  let stored = await idbGet(storageKey);

  // Migración: claves ECDSA viejas no sirven
  if (stored && (!stored.emisorId || !stored.pk?.x)) {
    stored = undefined;
  }

  if (!stored) {
    stored = await generar();
    await idbSet(storageKey, stored);
  }

  const emisor: EmisorJubjub = {
    emisorId: stored.emisorId,
    pk: stored.pk,
  };
  await register(emisor);
  return emisor;
};
