import { useEffect, useState } from 'react';
import { STORAGE_KEYS, storageService } from '@/services/storage';
import type { OnboardingStep } from '@/types/credential';

export function useOnboarding() {
  const [step, setStep] = useState<OnboardingStep>(() => {
    const isCompleted = storageService.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return isCompleted ? 'wallet' : 'splash';
  });

  // Automatic splash timeout to welcome
  useEffect(() => {
    if (step !== 'splash') return;
    const timer = setTimeout(() => setStep('welcome'), 900);
    return () => clearTimeout(timer);
  }, [step]);

  // Automatic creating timeout to ready
  useEffect(() => {
    if (step !== 'creating') return;
    const timer = setTimeout(() => setStep('ready'), 1100);
    return () => clearTimeout(timer);
  }, [step]);

  // Automatic ready timeout to role selection
  useEffect(() => {
    if (step !== 'ready') return;
    const timer = setTimeout(() => setStep('role-selection'), 900);
    return () => clearTimeout(timer);
  }, [step]);

  const goToWarning = () => setStep('warning');
  const goToCreating = () => setStep('creating');
  const goToAlias = () => setStep('alias');

  const goToRoleSelection = () => setStep('role-selection');
  const goToWallet = () => setStep('wallet');

  const completeOnboarding = () => {
    storageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setStep('role-selection');
  };

  const enterDemo = (onDemoEntered?: () => void) => {
    storageService.setItem('ward.user_alias', 'demo.user');
    storageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    onDemoEntered?.();
    setStep('role-selection');
  };

  return {
    step,
    goToWarning,
    goToCreating,
    goToAlias,
    goToRoleSelection,
    goToWallet,
    completeOnboarding,
    enterDemo,
  };
}
