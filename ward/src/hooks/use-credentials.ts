import { useState } from 'react';
import { credentials as initialCredentials, pendingCredential } from '@/constants/mock-data';
import type { Credential, Screen } from '@/types/credential';

export function useCredentials() {
  const [screen, setScreen] = useState<Screen>('wallet');
  const [selected, setSelected] = useState<Credential>(initialCredentials[0]);
  const [accepted, setAccepted] = useState(false);

  const walletCredentials = accepted
    ? [pendingCredential, ...initialCredentials]
    : initialCredentials;

  const openCredential = (credential: Credential) => {
    setSelected(credential);
    setScreen('detail');
  };

  const acceptPending = () => {
    setAccepted(true);
    setScreen('added');
  };

  const viewPendingDetail = () => {
    setSelected(pendingCredential);
    setScreen('detail');
  };

  const goToPending = () => setScreen('pending');
  const goToWallet = () => setScreen('wallet');
  const goToShow = () => setScreen('show');
  const goToDetail = () => setScreen('detail');

  const enableDemoAccepted = () => {
    setAccepted(true);
  };

  return {
    screen,
    selected,
    accepted,
    pending: accepted ? undefined : pendingCredential,
    credentials: walletCredentials,
    openCredential,
    acceptPending,
    viewPendingDetail,
    goToPending,
    goToWallet,
    goToShow,
    goToDetail,
    enableDemoAccepted,
  };
}
