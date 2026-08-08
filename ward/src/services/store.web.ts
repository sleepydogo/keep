// SecureStore no existe en web (docs Expo 54). En la demo va a localStorage,
// que no es lo mismo: en nativo esto vive en el Keychain.
export const leer = async (clave: string) => window.localStorage.getItem(clave);

export const guardar = async (clave: string, valor: string) =>
  window.localStorage.setItem(clave, valor);
