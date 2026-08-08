import { useCallback, useEffect, useState } from 'react';
import { aCredential, listar } from '@/services/credenciales';
import type { Credential, Screen } from '@/types/credential';

export function useCredentials() {
  const [screen, setScreen] = useState<Screen>('wallet');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [selected, setSelected] = useState<Credential | null>(null);

  const recargar = useCallback(() => {
    listar().then((cs) => setCredentials(cs.map(aCredential)));
  }, []);

  useEffect(recargar, [recargar]);

  const openCredential = (credential: Credential) => {
    setSelected(credential);
    setScreen('detail');
  };

  return {
    screen,
    selected,
    credentials,
    openCredential,
    goToWallet: () => {
      recargar();
      setScreen('wallet');
    },
    goToShow: () => setScreen('show'),
    goToId: () => setScreen('id'),
    goToSettings: () => setScreen('settings'),
    goToDetail: () => setScreen('detail'),
  };
}
