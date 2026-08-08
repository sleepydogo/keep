import { CryptoDigestAlgorithm, digest } from 'expo-crypto';

const bytes = (hex: string) =>
  Uint8Array.from(hex.match(/../g)!.map((h) => parseInt(h, 16)));

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

/** Igual que pureCircuits.holderIdPublico, pero sin el WASM de Midnight. */
export const holderIdDe = async (secretHex: string): Promise<string> => {
  const dominio = new TextEncoder().encode('keep:holder');
  const entrada = Uint8Array.from([...dominio, ...bytes(secretHex)]);
  return hex(new Uint8Array(await digest(CryptoDigestAlgorithm.SHA256, entrada)));
};
