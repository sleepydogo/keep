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
    id: '0000000000000000000000000000000000000000000000000000000000000000',
    nombre: 'REPROCANN',
    detalle: 'Ministerio de Salud de la Nación',
  },
];
