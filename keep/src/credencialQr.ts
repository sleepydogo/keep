import type { Credencial } from "@keep/contract/credencial";

/**
 * Formato del QR de emisión. Todo en hex para que entre: en decimal los
 * elementos de campo ocupan ~77 caracteres cada uno y son siete.
 * WARD tiene que decodificar exactamente esto.
 */
export type PaqueteQr = {
  v: 1;
  emisorId: string;
  titulo: string;
  vence: string;
  hojas: string[];
  firma: [string, string, string];
};

const h = (n: bigint) => n.toString(16);

export const empaquetar = (
  emisorId: string,
  titulo: string,
  c: Credencial,
): string =>
  JSON.stringify({
    v: 1,
    emisorId,
    titulo,
    vence: h(c.fechaVencimiento),
    hojas: c.hojas.map(h),
    firma: [h(c.firma.announcement.x), h(c.firma.announcement.y), h(c.firma.response)],
  } satisfies PaqueteQr);
