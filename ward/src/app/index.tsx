import { WalletScreen } from '@/components/web/wallet-screen.web';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { PendingScreen } from '@/components/credentials/pending-screen';
import { AddedScreen } from '@/components/credentials/added-screen';
import { DetailScreen } from '@/components/credentials/detail-screen';
import { ShowScreen } from '@/components/credentials/show-screen';
import { RoleSelectionScreen } from '@/components/role-selection-screen';
import { VerifierHomeScreen } from '@/components/verifier/verifier-home-screen';
import { VerifierScanningScreen } from '@/components/verifier/verifier-scanning-screen';
import { VerifierCheckingScreen } from '@/components/verifier/verifier-checking-screen';
import { VerifierResultScreen } from '@/components/verifier/verifier-result-screen';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useCredentials } from '@/hooks/use-credentials';
import { useAppMode } from '@/hooks/use-app-mode';

export default function HomeScreen() {
  const {
    step,
    goToWarning,
    goToCreating,
    goToAlias,
    completeOnboarding,
    enterDemo,
    goToWallet: goToWalletStep,
  } = useOnboarding();
  const {
    screen,
    selected,
    accepted,
    pending,
    credentials,
    openCredential,
    acceptPending,
    viewPendingDetail,
    goToWallet,
    goToDetail,
    enableDemoAccepted,
  } = useCredentials();
  const {
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
  } = useAppMode();

  const handleSelectRole = (selectedMode: import('@/types/app').AppMode) => {
    selectMode(selectedMode);
    goToWalletStep();
  };

  if (step === 'role-selection') {
    return <RoleSelectionScreen onSelect={handleSelectRole} />;
  }

  if (step !== 'wallet') {
    return (
      <OnboardingFlow
        step={step}
        onContinue={goToWarning}
        onConfirm={goToAlias}
        onCompleteAlias={goToCreating}
        onReady={completeOnboarding}
        onEnterDemo={() => enterDemo(enableDemoAccepted)}
      />
    );
  }

  if (!hasSelectedMode) {
    return <RoleSelectionScreen onSelect={handleSelectRole} />;
  }

  if (mode === 'verifier') {
    return (
      <VerifierRouter
        screen={verifierScreen}
        onHome={goToVerifierHome}
        onScan={goToVerifierScanning}
        onChecking={goToVerifierChecking}
        onResultValid={goToVerifierResultValid}
        onResultInvalid={goToVerifierResultInvalid}
        onResultOffline={goToVerifierResultOffline}
        onSwitchMode={() => switchMode('holder')}
      />
    );
  }

  switch (screen) {
    case 'pending':
      return <PendingScreen onAccept={acceptPending} onBack={goToWallet} />;
    case 'added':
      return <AddedScreen credential={credentials[0]} onBack={goToWallet} />;
    case 'detail':
      return (
        <DetailScreen
          credential={selected}
          credentials={credentials}
          onSelectCredential={openCredential}
          onBack={goToWallet}
        />
      );
    case 'show':
      return <ShowScreen credential={selected} onBack={goToDetail} />;
    case 'wallet':
    default:
      return (
        <WalletScreen
          key={accepted ? 'accepted' : 'pending'}
          credentials={credentials}
          pending={pending}
          onOpen={openCredential}
          onAcceptPending={acceptPending}
          onSwitchMode={() => switchMode('verifier')}
        />
      );
  }
}

function VerifierRouter({
  screen,
  onHome,
  onScan,
  onChecking,
  onResultValid,
  onResultInvalid,
  onResultOffline,
  onSwitchMode,
}: {
  screen: import('@/types/app').VerifierScreen;
  onHome: () => void;
  onScan: () => void;
  onChecking: () => void;
  onResultValid: () => void;
  onResultInvalid: () => void;
  onResultOffline: () => void;
  onSwitchMode: () => void;
}) {
  switch (screen) {
    case 'scanning':
      return (
        <VerifierScanningScreen
          onBack={onHome}
          onProcessed={onChecking}
        />
      );
    case 'checking':
      return (
        <VerifierCheckingScreen
          onBack={onHome}
          onResult={(r) => {
            if (r === 'valid') onResultValid();
            else if (r === 'offline') onResultOffline();
            else onResultInvalid();
          }}
          isOnline={true}
        />
      );
    case 'result-valid':
      return (
        <VerifierResultScreen
          variant="valid"
          onDone={onHome}
          onScanAgain={onScan}
        />
      );
    case 'result-invalid':
      return (
        <VerifierResultScreen
          variant="invalid"
          onDone={onHome}
          onScanAgain={onScan}
        />
      );
    case 'result-offline':
      return (
        <VerifierResultScreen
          variant="offline"
          onDone={onHome}
          onScanAgain={onScan}
        />
      );
    case 'home':
    default:
      return (
        <VerifierHomeScreen
          onScan={onScan}
          onSwitchMode={onSwitchMode}
          isOnline={true}
        />
      );
  }
}
