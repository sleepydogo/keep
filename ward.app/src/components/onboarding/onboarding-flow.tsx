import type { OnboardingStep } from '@/types/credential';
import { SplashStep } from './splash-step';
import { WelcomeStep } from './welcome-step';
import { WarningStep } from './warning-step';
import { CreatingStep } from './creating-step';
import { ReadyStep } from './ready-step';

type OnboardingFlowProps = {
  step: OnboardingStep;
  onContinue: () => void;
  onConfirm: () => void;
  onReady: () => void;
  onEnterDemo: () => void;
};

export function OnboardingFlow({
  step,
  onContinue,
  onConfirm,
  onReady,
  onEnterDemo,
}: OnboardingFlowProps) {
  switch (step) {
    case 'splash':
      return <SplashStep />;
    case 'welcome':
      return <WelcomeStep onContinue={onContinue} />;
    case 'warning':
      return <WarningStep onConfirm={onConfirm} onEnterDemo={onEnterDemo} />;
    case 'creating':
      return <CreatingStep />;
    case 'ready':
      return <ReadyStep onReady={onReady} />;
    default:
      return null;
  }
}
