import { WalletScreen } from '@/components/web/wallet-screen.web';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { PendingScreen } from '@/components/credentials/pending-screen';
import { AddedScreen } from '@/components/credentials/added-screen';
import { DetailScreen } from '@/components/credentials/detail-screen';
import { ShowScreen } from '@/components/credentials/show-screen';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useCredentials } from '@/hooks/use-credentials';

export default function HomeScreen() {
  const { step, goToWarning, goToCreating, goToAlias, completeOnboarding, enterDemo } = useOnboarding();
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
        />
      );
  }
}
