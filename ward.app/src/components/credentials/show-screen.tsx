import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/ui/page-container';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Credential } from '@/types/credential';

type ShowScreenProps = {
  credential: Credential;
  onBack: () => void;
};

const colors = Colors.light;

export function ShowScreen({ credential, onBack }: ShowScreenProps) {
  return (
    <PageContainer>
      <BackButton onPress={onBack} />
      <View style={styles.showHeader}>
        <Text style={styles.kicker}>Presentando credencial</Text>
        <Text style={styles.heading}>Información verificada</Text>
      </View>
      <View style={[styles.showCard, { backgroundColor: credential.tone }]}>
        <Text style={styles.showBrand}>WARD</Text>
        <Text style={styles.showType}>{credential.type}</Text>
        <Text style={styles.showTitle}>{credential.title}</Text>
        <View style={styles.showRule} />
        <Text style={styles.showIssuer}>{credential.issuer}</Text>
        <View style={styles.showValid}>
          <Text style={styles.showValidMark}>✓</Text>
          <Text style={styles.showValidText}>Válida</Text>
        </View>
      </View>
      <Text style={styles.showNote}>
        Esta credencial fue emitida por una organización confiable.
      </Text>
      <Button label="Cerrar" onPress={onBack} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  showHeader: {
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  kicker: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  heading: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 42,
    lineHeight: 48,
    marginTop: 4,
  },
  showCard: {
    minHeight: 360,
    borderRadius: 22,
    padding: Spacing.four,
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  showBrand: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontSize: 14,
    letterSpacing: 3,
    position: 'absolute',
    top: Spacing.four,
    right: Spacing.four,
  },
  showType: {
    color: '#F8EBD1',
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  showTitle: {
    color: '#FFFDF8',
    fontFamily: Fonts.serif,
    fontSize: 42,
    lineHeight: 46,
    maxWidth: 400,
  },
  showRule: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginVertical: Spacing.two,
  },
  showIssuer: {
    color: '#F8EBD1',
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  showValid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  showValidMark: {
    color: '#FFFDF8',
    fontSize: 20,
  },
  showValidText: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontWeight: '700',
  },
  showNote: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
});
