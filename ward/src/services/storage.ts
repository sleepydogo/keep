export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'ward.onboarding.completed',
  CREDENTIAL_ORDER: 'ward.credential.order',
  USER_ALIAS: 'ward.user_alias',
} as const;

export const storageService = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`[storageService] Failed to read key ${key}:`, e);
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[storageService] Failed to write key ${key}:`, e);
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storageService] Failed to remove key ${key}:`, e);
    }
  },
};
