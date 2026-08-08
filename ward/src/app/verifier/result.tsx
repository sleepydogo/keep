import { useLocalSearchParams, useRouter } from 'expo-router';
import { VerifierResultScreen } from '@/components/verifier/verifier-result-screen';

export default function VerifierResultRoute() {
  const router = useRouter();
  const { variant } = useLocalSearchParams<{ variant?: 'valid' | 'invalid' | 'offline' }>();

  return (
    <VerifierResultScreen
      variant={variant === 'invalid' || variant === 'offline' ? variant : 'valid'}
      onDone={() => router.replace('/verifier')}
      onScanAgain={() => router.replace('/verifier/scanning')}
    />
  );
}
