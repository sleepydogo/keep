import { useRouter } from 'expo-router';
import { VerifierHomeScreen } from '@/components/verifier/verifier-home-screen';

export default function VerifierRoute() {
  const router = useRouter();

  return (
    <VerifierHomeScreen
      isOnline
      onScan={() => router.push('/verifier/scanning' as any)}
      onSwitchMode={() => router.replace('/')}
    />
  );
}
