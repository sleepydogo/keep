import type { OnboardingStep } from '@/types/credential';
import type { Rol } from '@/services/rol';
import { SplashStep } from './splash-step';
import { WelcomeStep } from './welcome-step';
import { WarningStep } from './warning-step';
import { CreatingStep } from './creating-step';
import { ReadyStep } from './ready-step';
import { IdentityStep } from './identity-step';
import { RolStep } from './rol-step';
import { BiometriaStep } from './biometria-step';

type OnboardingFlowProps = {
  step: OnboardingStep;
  onContinue: () => void;
  onConfirm: () => void;
  onReady: () => void;
  onCompleteIdentity: () => void;
  onBiometriaLista: () => void;
  onElegirRol: (rol: Rol) => void;
  onEnterDemo: () => void;
};

export function OnboardingFlow({
  step,
  onContinue,
  onConfirm,
  onReady,
  onCompleteIdentity,
  onBiometriaLista,
  onElegirRol,
  onEnterDemo,
}: OnboardingFlowProps) {
  switch (step) {
    case 'splash':
      return <SplashStep />;
    case 'welcome':
      return <WelcomeStep onContinue={onContinue} />;
    case 'biometria':
      return <BiometriaStep onListo={onBiometriaLista} />;
    case 'warning':
      return <WarningStep onConfirm={onConfirm} onEnterDemo={onEnterDemo} />;
    case 'creating':
      return <CreatingStep />;
    case 'ready':
      return <ReadyStep onReady={onReady} />;
    case 'rol':
      return <RolStep onElegir={onElegirRol} />;
    case 'identity':
      return <IdentityStep onComplete={onCompleteIdentity} />;
    default:
      return null;
  }
}
