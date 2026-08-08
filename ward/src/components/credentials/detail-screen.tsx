import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { QRCode } from '@/components/ui/qr-code';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Credential } from '@/types/credential';
import { CredentialInfo } from './credential-info';

type DetailScreenProps = {
  credential: Credential;
  credentials?: Credential[];
  onSelectCredential?: (credential: Credential) => void;
  onBack: () => void;
  onPresentar?: () => void;
};

const colors = Colors.light;

export function DetailScreen({
  credential,
  onBack,
  onPresentar,
}: DetailScreenProps) {
  return (
    <PageContainer>
      <BackButton onPress={onBack} label="Volver" />
      <View style={[styles.card, { backgroundColor: credential.tone }]}>
        <Text style={styles.cardType}>{credential.type}</Text>
        <Text style={styles.cardTitle}>{credential.title}</Text>
        <Text style={styles.cardIssuer}>{credential.issuer}</Text>
      </View>
      <CredentialInfo credential={credential} />
      <Text style={styles.details}>{credential.details}</Text>
      {onPresentar && <Button label="Presentar" onPress={onPresentar} />}
      <View style={styles.qr}>
        <QRCode value={`ward:credential:${credential.id}`} size={160} />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.four,
    gap: 6,
  },
  cardType: {
    color: '#FFFDF8',
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    opacity: 0.8,
  },
  cardTitle: {
    color: '#FFFDF8',
    fontFamily: Fonts.serif,
    fontSize: 28,
  },
  cardIssuer: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontSize: 13,
    opacity: 0.85,
  },
  details: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  qr: {
    alignItems: 'center',
  },
});
