import { Pressable, StyleSheet, Text, View } from 'react-native';
import { pendingCredential } from '@/constants/mock-data';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { CredentialInfo } from './credential-info';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type PendingScreenProps = {
  onAccept: () => void;
  onBack: () => void;
};

const colors = Colors.light;

export function PendingScreen({ onAccept, onBack }: PendingScreenProps) {
  return (
    <PageContainer>
      <BackButton onPress={onBack} />
      <View style={styles.reviewWrap}>
        <View style={[styles.largeMark, { backgroundColor: pendingCredential.tone }]}>
          <Text style={styles.largeMarkText}>✓</Text>
        </View>
        <Text style={styles.reviewKicker}>Recibiste una credencial</Text>
        <Text style={styles.reviewTitle}>{pendingCredential.title}</Text>
        <Text style={styles.reviewIssuer}>Enviada por {pendingCredential.issuer}</Text>
        <CredentialInfo credential={pendingCredential} />
        <Text style={styles.helper}>Al agregarla, quedará guardada en tu tarjetero.</Text>
        <Button label="Agregar a WARD" onPress={onAccept} />
        <Pressable onPress={onBack} style={styles.rejectButton}>
          <Text style={styles.rejectText}>Rechazar</Text>
        </Pressable>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  reviewWrap: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  largeMark: {
    width: 92,
    height: 92,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  largeMarkText: {
    color: '#FFFDF8',
    fontFamily: Fonts.serif,
    fontSize: 34,
    fontWeight: '700',
  },
  reviewKicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  reviewTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 36,
    textAlign: 'center',
  },
  reviewIssuer: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    textAlign: 'center',
  },
  helper: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
  rejectButton: {
    padding: Spacing.two,
  },
  rejectText: {
    color: colors.reject,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
});
