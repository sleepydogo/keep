import * as SecureStore from 'expo-secure-store';

export const leer = (clave: string) => SecureStore.getItemAsync(clave);

export const guardar = (clave: string, valor: string) =>
  SecureStore.setItemAsync(clave, valor, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
