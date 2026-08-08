import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ui/screen-container';
import { AppIcon } from '@/components/ui/app-icon';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

type VerifierScanningScreenProps = {
  onBack: () => void;
  onProcessed: () => void;
};

export function VerifierScanningScreen({ onBack, onProcessed }: VerifierScanningScreenProps) {
  React.useEffect(() => {
    const timer = setTimeout(onProcessed, 2500);
    return () => clearTimeout(timer);
  }, [onProcessed]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>KEEP</Text>
          <View style={styles.brandDot} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.viewfinder}>
          <AppIcon name="qrcode" size={64} tintColor={colors.accent} />
        </View>

        <Text style={styles.title}>Escaneando...</Text>
        <Text style={styles.subtitle}>Apuntá al código que muestra la otra persona</Text>

        <Pressable
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
          onPress={onBack}
        >
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: Spacing.three,
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  brandText: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  viewfinder: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242, 84, 45, 0.08)',
    marginBottom: Spacing.two,
  },
  title: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: 'center',
  },
  cancelBtn: {
    marginTop: Spacing.four,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
