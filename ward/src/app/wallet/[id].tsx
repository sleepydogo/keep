import { useLocalSearchParams, useRouter } from 'expo-router';
import { credentials, pendingCredential } from '@/constants/mock-data';
import { DetailScreen } from '@/components/credentials/detail-screen';

export default function CredentialDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const credential = [...credentials, pendingCredential].find((item) => item.id === id);

  if (!credential) {
    router.replace('/');
    return null;
  }

  return (
    <DetailScreen
      credential={credential}
      credentials={[...credentials, pendingCredential]}
      onBack={() => router.back()}
    />
  );
}
