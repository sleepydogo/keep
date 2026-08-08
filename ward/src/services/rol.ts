import { guardar, leer } from './store';

export type Rol = 'holder' | 'verificador';

const CLAVE = 'ward.rol';

export const leerRol = async (): Promise<Rol | null> =>
  (await leer(CLAVE)) as Rol | null;

export const guardarRol = (rol: Rol) => guardar(CLAVE, rol);
