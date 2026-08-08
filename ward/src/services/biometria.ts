import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { guardar, leer } from './store';

const CLAVE = 'ward.biometria';

export const enWeb = Platform.OS === 'web';

/** ¿El dispositivo tiene cara o huella configurada? */
export const disponible = async () =>
  !enWeb &&
  (await LocalAuthentication.hasHardwareAsync()) &&
  (await LocalAuthentication.isEnrolledAsync());

export const pedir = async (promptMessage: string) => {
  if (!(await disponible())) return true;
  const r = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: 'Cancelar',
  });
  return r.success;
};

export const activada = async () => (await leer(CLAVE)) === 'on';

export const activar = () => guardar(CLAVE, 'on');
