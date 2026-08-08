import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type VerifierHomeScreenProps = {
  onScan: () => void;
  onSwitchMode: () => void;
  isOnline: boolean;
};

const colors = Colors.light;

export function VerifierHomeScreen({ onScan, onSwitchMode, isOnline }: VerifierHomeScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>KEEP</Text>
            <View style={styles.brandDot} />
          </View>
          <Pressable style={styles.switchBtn} onPress={onSwitchMode}>
            <Text style={styles.switchBtnText}>WARD</Text>
          </Pressable>
        </View>

        <View style={styles.statusBar}>
          <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
          <Text style={styles.statusLabel}>
            {isOnline ? 'Con conexión' : 'Sin conexión'}
          </Text>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIconText}>👁</Text>
          </View>
          <Text style={styles.heroTitle}>Verificar una credencial</Text>
          <Text style={styles.heroSub}>Confirmá solo lo necesario.</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.scanBtn, pressed && styles.pressed]}
          onPress={onScan}
        >
          <Text style={styles.scanBtnIcon}>📷</Text>
          <Text style={styles.scanBtnText}>Escanear credencial</Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Cómo funciona?</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>La otra persona muestra un código QR con su credencial</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>Escaneás el código con tu cámara</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>Verificás que los datos sean correctos</Text>
          </View>

          {!isOnline && (
            <View style={styles.offlineNotice}>
              <Text style={styles.offlineText}>
                ⚠️ Verificación offline — sin comprobación de revocación
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.two,
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
    backgroundColor: colors.action,
  },
  switchBtn: {
    backgroundColor: colors.backgroundElement,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchBtnText: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: {
    backgroundColor: colors.verified,
  },
  dotOffline: {
    backgroundColor: colors.warning,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  heroIconText: {
    fontSize: 32,
  },
  heroTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSub: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    textAlign: 'center',
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: colors.action,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: 14,
  },
  scanBtnIcon: {
    fontSize: 20,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  infoCard: {
    backgroundColor: colors.backgroundElement,
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.two,
  },
  infoTitle: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stepNumber: {
    color: colors.action,
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    flex: 1,
  },
  offlineNotice: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    backgroundColor: 'rgba(255, 183, 77, 0.15)',
    borderRadius: 8,
  },
  offlineText: {
    color: colors.warning,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
});

