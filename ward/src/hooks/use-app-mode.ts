import { useState, useCallback, useEffect } from 'react';
import { storageService } from '@/services/storage';
import type { AppMode, VerifierScreen } from '@/types/app';

const STORAGE_KEY = 'ward.app_mode';

export function useAppMode() {
  const [mode, setModeInternal] = useState<AppMode>('holder');
  const [verifierScreen, setVerifierScreen] = useState<VerifierScreen>('home');
  const [hasSelectedMode, setHasSelectedMode] = useState(false);

  useEffect(() => {
    const saved = storageService.getItem(STORAGE_KEY) as AppMode | null;
    if (saved === 'holder' || saved === 'verifier') {
      setModeInternal(saved);
      setHasSelectedMode(true);
    }
  }, []);

  const selectMode = useCallback((newMode: AppMode) => {
    setModeInternal(newMode);
    setHasSelectedMode(true);
    storageService.setItem(STORAGE_KEY, newMode);
  }, []);

  const switchMode = useCallback((newMode: AppMode) => {
    setModeInternal(newMode);
    setVerifierScreen('home');
    storageService.setItem(STORAGE_KEY, newMode);
  }, []);

  const goToVerifierHome = useCallback(() => setVerifierScreen('home'), []);
  const goToVerifierScanning = useCallback(() => setVerifierScreen('scanning'), []);
  const goToVerifierChecking = useCallback(() => setVerifierScreen('checking'), []);
  const goToVerifierResultValid = useCallback(() => setVerifierScreen('result-valid'), []);
  const goToVerifierResultInvalid = useCallback(() => setVerifierScreen('result-invalid'), []);
  const goToVerifierResultOffline = useCallback(() => setVerifierScreen('result-offline'), []);

  return {
    mode,
    verifierScreen,
    hasSelectedMode,
    selectMode,
    switchMode,
    goToVerifierHome,
    goToVerifierScanning,
    goToVerifierChecking,
    goToVerifierResultValid,
    goToVerifierResultInvalid,
    goToVerifierResultOffline,
  };
}
