import { useRouter } from 'expo-router';
import { VerifierScanningScreen } from '@/components/verifier/verifier-scanning-screen';

export default function VerifierScanningRoute() {
  const router = useRouter();

  return (
    <VerifierScanningScreen
      onBack={() => router.back()}
      onProcessed={() => router.replace('/verifier/checking')}
    />
  );
}
