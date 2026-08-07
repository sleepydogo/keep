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

  const goToWarning = () => setStep('warning');
  const goToCreating = () => setStep('creating');
  const goToAlias = () => setStep('alias');

  const completeOnboarding = () => {
    storageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setStep('wallet');
  };

  const enterDemo = (onDemoEntered?: () => void) => {
    // If skipping to demo, set a default alias so they have one
    storageService.setItem('ward.user_alias', 'demo.user');
    storageService.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    onDemoEntered?.();
    setStep('wallet');
  };

  return {
    step,
    goToWarning,
    goToCreating,
    goToAlias,
    completeOnboarding,
    enterDemo,
  };
}
