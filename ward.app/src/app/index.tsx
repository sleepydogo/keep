import { WalletScreen } from '@/components/web/wallet-screen.web';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { PendingScreen } from '@/components/credentials/pending-screen';
import { AddedScreen } from '@/components/credentials/added-screen';
import { DetailScreen } from '@/components/credentials/detail-screen';
import { ShowScreen } from '@/components/credentials/show-screen';
import { useOnboarding } from '@/hooks/use-onboarding';
import { useCredentials } from '@/hooks/use-credentials';

export default function HomeScreen() {
  const { step, goToWarning, goToCreating, completeOnboarding, enterDemo } = useOnboarding();
  const {
    screen,
    selected,
    accepted,
    pending,
    credentials,
    openCredential,
    acceptPending,
    viewPendingDetail,
    goToPending,
    goToWallet,
    goToShow,
    goToDetail,
    enableDemoAccepted,
  } = useCredentials();

  if (step !== 'wallet') {
    return (
      <OnboardingFlow
        step={step}
        onContinue={goToWarning}
        onConfirm={goToCreating}
        onReady={completeOnboarding}
        onEnterDemo={() => enterDemo(enableDemoAccepted)}
      />
    );
  }

  switch (screen) {
    case 'pending':
      return <PendingScreen onAccept={acceptPending} onBack={goToWallet} />;
    case 'added':
      return <AddedScreen onView={viewPendingDetail} onBack={goToWallet} />;
    case 'detail':
      return <DetailScreen credential={selected} onBack={goToWallet} onShow={goToShow} />;
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
          onPending={goToPending}
        />
      );
  }
}
