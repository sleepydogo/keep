import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppMode } from '@/types/app';
import { ScreenContainer } from '@/components/ui/screen-container';
import { AppIcon } from '@/components/ui/app-icon';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

type RoleSelectionScreenProps = {
  onSelect: (mode: AppMode) => void;
};

export function RoleSelectionScreen({ onSelect }: RoleSelectionScreenProps) {
  return (
    <ScreenContainer>
      <View style={styles.brand}>
        <View style={styles.logoRow}>
          <Text style={styles.brandName}>KEEP</Text>
          <View style={styles.brandDot} />
        </View>
        <Text style={styles.brandSub}>Verifiable Credentials</Text>
      </View>

      <View style={styles.cardsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            styles.cardHolder,
            pressed && styles.cardPressed,
          ]}
          onPress={() => onSelect('holder')}
        >
          <View style={styles.iconContainer}>
            <AppIcon name="person.badge.key.fill" size={24} tintColor={colors.accent} />
          </View>
          <Text style={styles.cardTitle}>Ver mis credenciales</Text>
          <Text style={styles.cardDescription}>
            Gestionar y presentar documentos desde WARD
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>WARD</Text>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() => onSelect('verifier')}
        >
          <View style={styles.iconContainer}>
            <AppIcon name="qrcode" size={24} tintColor={colors.textSecondary} />
          </View>
          <Text style={styles.cardTitle}>Verificar una credencial</Text>
          <Text style={styles.cardDescription}>
            Confirmar la validez de un documento con KEEP
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>KEEP</Text>
          </View>
        </Pressable>
      </View>

      <Text style={styles.footerText}>
        Seleccioná el modo según lo que quieras hacer en este momento.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.six,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  brandName: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  brandSub: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    letterSpacing: 1,
  },
  cardsContainer: {
    width: '100%',
    gap: Spacing.three,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  cardHolder: {
    borderColor: colors.accent,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '700',
  },
  cardDescription: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242, 84, 45, 0.15)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(242, 84, 45, 0.3)',
    marginTop: Spacing.one,
  },
  badgeText: {
    color: colors.accent,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerText: {
    color: colors.textFaint,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.three,
  },
});
