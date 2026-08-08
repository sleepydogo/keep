/**
 * Cliente del nodo KEEP. WARD no bundlea el WASM de Midnight, así que la parte
 * de cadena la hace el nodo. Desde el teléfono hay que apuntar a la IP de la
 * máquina, no a localhost: EXPO_PUBLIC_NODO_URL=http://192.168.x.x:5176
 */
const BASE = process.env.EXPO_PUBLIC_NODO_URL ?? 'http://localhost:5176';

const json = async (ruta: string, init?: RequestInit) => {
  const r = await fetch(`${BASE}${ruta}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error ?? `El nodo respondió ${r.status}`);
  return d;
};

export type Pedido = {
  emisorId: string;
  nonce: string;
  fechaConsulta: string;
  presentacionId: string;
};

export type Estado = 'pendiente' | 'vigente' | 'no-vigente';

export const nuevoPedido = (emisorId: string): Promise<Pedido> =>
  json('/pedido', { method: 'POST', body: JSON.stringify({ emisorId }) });

export const estaRegistrado = (emisorId: string): Promise<{ registrado: boolean }> =>
  json(`/emisor/${emisorId}`);

export const consultar = (presentacionId: string): Promise<{ estado: Estado }> =>
  json(`/verificacion/${presentacionId}`);

export const presentar = (cuerpo: {
  emisorId: string;
  nonce: string;
  fechaConsulta: string;
  holderSecret: string;
  credencial: unknown;
}): Promise<{ ok: boolean }> =>
  json('/presentar', { method: 'POST', body: JSON.stringify(cuerpo) });
