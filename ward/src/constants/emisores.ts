/**
 * Catálogo de organismos en los que el verificador puede confiar. El id sale de
 * derivarEmisorId(emisorSecret) y se distribuye con la app: el verificador
 * elige un nombre, nunca escribe un hash.
 */
export type Emisor = {
  id: string;
  nombre: string;
  detalle: string;
};

export const EMISORES: Emisor[] = [
  {
    id: '3b6b6955ecce5cc458ccd3357da286383340ef1bbfa23d7ff8d5d7bcae5b0a07',
    nombre: 'REPROCANN',
    detalle: 'Ministerio de Salud de la Nación',
  },
];
