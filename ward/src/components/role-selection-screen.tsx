import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { AppMode } from '@/types/app';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type RoleSelectionScreenProps = {
  onSelect: (mode: AppMode) => void;
};

const colors = Colors.light;

export function RoleSelectionScreen({ onSelect }: RoleSelectionScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
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
              <Text style={styles.iconText}>👤</Text>
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
              styles.cardVerifier,
              pressed && styles.cardPressed,
            ]}
            onPress={() => onSelect('verifier')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>👁</Text>
            </View>
            <Text style={styles.cardTitle}>Verificar una credencial</Text>
            <Text style={styles.cardDescription}>
              Confirmar la validez de un documento con KEEP
            </Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>KEEP</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          Seleccioná el modo según lo que quieras hacer en este momento.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    gap: Spacing.five,
    paddingVertical: Spacing.four,
  },
  brand: {
    alignItems: 'center',
    gap: Spacing.one,
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
    backgroundColor: colors.action,
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
    backgroundColor: colors.backgroundElement,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Spacing.four,
    gap: Spacing.two,
    position: 'relative',
  },
  cardHolder: {
    borderColor: colors.action,
  },
  cardVerifier: {
    borderColor: colors.border,
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
  iconText: {
    fontSize: 24,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
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
    color: colors.action,
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
    marginTop: Spacing.two,
  },
});

