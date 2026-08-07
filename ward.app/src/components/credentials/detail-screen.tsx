import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { CredentialInfo } from './credential-info';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Credential } from '@/types/credential';

type DetailScreenProps = {
  credential: Credential;
  onBack: () => void;
  onShow: () => void;
};

const colors = Colors.light;

export function DetailScreen({ credential, onBack, onShow }: DetailScreenProps) {
  return (
    <PageContainer>
      <BackButton onPress={onBack} />
      <View style={[styles.detailCard, { borderTopColor: credential.tone }]}>
        <View style={[styles.largeMark, { backgroundColor: credential.tone }]}>
          <Text style={styles.largeMarkText}>{credential.mark}</Text>
        </View>
        <Text style={styles.cardType}>{credential.type}</Text>
        <Text style={styles.detailTitle}>{credential.title}</Text>
        <Text style={styles.reviewIssuer}>{credential.issuer}</Text>
        <CredentialInfo credential={credential} />
        <View style={styles.detailLine}>
          <Text style={styles.detailLabel}>Detalles</Text>
          <Text style={styles.detailValue}>{credential.details}</Text>
        </View>
      </View>
      <Button label="Mostrar credencial" onPress={onShow} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  detailCard: {
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5DDCF',
    borderTopWidth: 5,
    padding: Spacing.four,
    gap: Spacing.two,
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
  cardType: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  detailTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 38,
  },
  reviewIssuer: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  detailLine: {
    borderTopWidth: 1,
    borderColor: '#DED6C8',
    paddingTop: Spacing.three,
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  detailLabel: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
});
