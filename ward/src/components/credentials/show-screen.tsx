import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { AppIcon } from '@/components/ui/app-icon';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import type { Credential } from '@/types/credential';

type ShowScreenProps = {
  credential: Credential;
  onBack: () => void;
};

export function ShowScreen({ credential, onBack }: ShowScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.showHeader}>
        <Text style={styles.kicker}>Presentando credencial</Text>
        <Text style={styles.heading}>Información verificada</Text>
      </View>
      <View style={[styles.showCard, { backgroundColor: credential.tone || colors.surface }]}>
        <Text style={styles.showBrand}>WARD</Text>
        <Text style={styles.showType}>{credential.type}</Text>
        <Text style={styles.showTitle}>{credential.title}</Text>
        <View style={styles.showRule} />
        <Text style={styles.showIssuer}>{credential.issuer}</Text>
        <View style={styles.showValid}>
          <AppIcon name="checkmark.circle.fill" size={20} tintColor="#FFFDF8" />
          <Text style={styles.showValidText}>Válida</Text>
        </View>
      </View>
      <Text style={styles.showNote}>
        Esta credencial fue emitida por una organización confiable.
      </Text>
      <Button label="Cerrar" onPress={onBack} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  showHeader: {
    paddingVertical: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.four,
  },
  kicker: {
    color: colors.success,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  heading: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '700',
  },
  showCard: {
    minHeight: 360,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginBottom: Spacing.four,
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
    fontFamily: Fonts.sans,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '700',
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
  showValidText: {
    color: '#FFFDF8',
    fontFamily: Fonts.sans,
    fontWeight: '700',
    fontSize: 16,
  },
  showNote: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
});
