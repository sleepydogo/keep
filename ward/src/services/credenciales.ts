import type { Credential } from '@/types/credential';
import { guardar, leer } from './store';

const CLAVE = 'ward.credenciales';

/** Espejo de keep/src/credencialQr.ts. Si cambia allá, cambia acá. */
export type PaqueteQr = {
  v: 1;
  emisorId: string;
  titulo: string;
  vence: string;
  hojas: string[];
  firma: [string, string, string];
};

export type Recibida = PaqueteQr & { id: string };

export const parsearQr = (raw: string): PaqueteQr => {
  const p = JSON.parse(raw) as PaqueteQr;
  if (p.v !== 1 || !p.emisorId || !p.vence || !Array.isArray(p.hojas))
    throw new Error('Ese QR no es una credencial de KEEP.');
  return p;
};

export const listar = async (): Promise<Recibida[]> =>
  JSON.parse((await leer(CLAVE)) ?? '[]');

export const agregar = async (p: PaqueteQr): Promise<Recibida> => {
  const nueva = { ...p, id: `${p.emisorId}:${p.vence}` };
  const todas = (await listar()).filter((c) => c.id !== nueva.id);
  await guardar(CLAVE, JSON.stringify([nueva, ...todas]));
  return nueva;
};

export const borrarTodas = () => guardar(CLAVE, '[]');

const fecha = (hexSegundos: string) =>
  new Date(Number(BigInt('0x' + hexSegundos)) * 1000).toLocaleDateString('es-AR');

/** La lleva a la forma que muestran las tarjetas. */
export const aCredential = (c: Recibida): Credential => ({
  id: c.id,
  type: 'Credencial verificable',
  title: c.titulo || 'Credencial',
  issuer: `Emisor ${c.emisorId.slice(0, 8)}…`,
  issuerDetail: c.emisorId,
  issued: '—',
  validUntil: fecha(c.vence),
  details: 'Emitida y firmada por el organismo. Se verifica on-chain.',
  mark: '✓',
  tone: '#1F6F4A',
  status: 'valid',
});
