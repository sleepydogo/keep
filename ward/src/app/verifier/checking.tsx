import { useRouter } from 'expo-router';
import { VerifierCheckingScreen } from '@/components/verifier/verifier-checking-screen';

export default function VerifierCheckingRoute() {
  const router = useRouter();

  return (
    <VerifierCheckingScreen
      isOnline
      onBack={() => router.back()}
      onResult={(result) => router.replace(`/verifier/result?variant=${result}`)}
    />
  );
}
