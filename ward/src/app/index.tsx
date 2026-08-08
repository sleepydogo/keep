import { WalletScreen } from '@/components/wallet-screen';
import { VerifierScreen } from '@/components/verifier-screen';
import { IdScreen } from '@/components/id-screen';
import { SettingsScreen } from '@/components/settings-screen';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { DetailScreen } from '@/components/credentials/detail-screen';
import { ShowScreen } from '@/components/credentials/show-screen';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useCredentials } from '@/hooks/use-credentials';
import { useRol } from '@/hooks/use-rol';
import type { Rol } from '@/services/rol';

export default function HomeScreen() {
  const {
    step,
    goToBiometria,
    goToWarning,
    goToCreating,
    goToRol,
    goToIdentity,
    completeOnboarding,
    enterDemo,
  } = useOnboarding();
  const {
    screen,
    selected,
    credentials,
    openCredential,
    goToWallet,
    goToDetail,
    goToId,
    goToSettings,
  } = useCredentials();
  const { rol, setRol } = useRol();

  // El verificador no maneja secretos: no necesita crear identidad.
  const elegirRol = async (r: Rol) => {
    await setRol(r);
    if (r === 'verificador') completeOnboarding();
    else goToIdentity();
  };

  if (step !== 'wallet') {
    return (
      <OnboardingFlow
        step={step}
        onContinue={goToBiometria}
        onBiometriaLista={goToWarning}
        onConfirm={goToRol}
        onElegirRol={elegirRol}
        onCompleteIdentity={goToCreating}
        onReady={completeOnboarding}
        onEnterDemo={() => enterDemo()}
      />
    );
  }

  if (screen === 'settings')
    return <SettingsScreen onBack={goToWallet} rol={rol} onCambiarRol={setRol} />;

  if (rol === 'verificador')
    return <VerifierScreen onSettings={goToSettings} />;

  switch (screen) {
    case 'detail':
      if (!selected) break;
      return (
        <DetailScreen
          credential={selected}
          credentials={credentials}
          onSelectCredential={openCredential}
          onBack={goToWallet}
        />
      );
    case 'show':
      if (!selected) break;
      return <ShowScreen credential={selected} onBack={goToDetail} />;
    case 'id':
      return <IdScreen onBack={goToWallet} />;
  }

  return (
    <WalletScreen
      credentials={credentials}
      onOpen={openCredential}
      onShowId={goToId}
      onSettings={goToSettings}
    />
  );
}
