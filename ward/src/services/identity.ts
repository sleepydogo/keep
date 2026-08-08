import { getRandomBytes } from 'expo-crypto';
import { guardar, leer } from './store';

const CLAVE = 'ward.holder.secret';

const hex = (b: Uint8Array) =>
  [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

/**
 * 32 bytes que no salen del dispositivo. De acá sale el holderId
 * (holderIdPublico), que es lo unico tuyo que ve un emisor.
 */
export const asegurarHolderSecret = async (): Promise<string> => {
  const guardado = await leer(CLAVE);
  if (guardado) return guardado;
  const nuevo = hex(getRandomBytes(32));
  await guardar(CLAVE, nuevo);
  return nuevo;
};
