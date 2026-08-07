const DB_NAME = "keep-device";
const STORE = "keys";

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const idbGet = async (key: string): Promise<CryptoKeyPair | undefined> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as CryptoKeyPair | undefined);
    req.onerror = () => reject(req.error);
  });
};

const idbSet = async (key: string, value: CryptoKeyPair): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

const exportPublicKey = async (key: CryptoKey): Promise<string> => {
  const raw = await crypto.subtle.exportKey("spki", key);
  const bytes = new Uint8Array(raw);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

/** Genera o reutiliza la key del dispositivo para este usuario y la registra. */
export const ensureDeviceKey = async (
  userId: string,
  register: (publicKey: string) => Promise<void>,
): Promise<string> => {
  const storageKey = `user:${userId}`;
  let pair = await idbGet(storageKey);

  if (!pair) {
    pair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"],
    );
    await idbSet(storageKey, pair);
  }

  const publicKey = await exportPublicKey(pair.publicKey);
  await register(publicKey);
  return publicKey;
};
