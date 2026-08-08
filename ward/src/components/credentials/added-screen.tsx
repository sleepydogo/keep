import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { QRCode } from '@/components/ui/qr-code';
import type { Credential } from '@/types/credential';
import { ScreenContainer } from '@/components/ui/screen-container';
import { AppIcon } from '@/components/ui/app-icon';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

type AddedScreenProps = {
  credential: Credential;
  onBack: () => void;
};

export function AddedScreen({ credential, onBack }: AddedScreenProps) {
  return (
    <ScreenContainer>
      <Pressable style={styles.backRow} onPress={onBack}>
        <AppIcon name="chevron.left" size={18} tintColor={colors.accent} />
        <Text style={styles.backText}>Volver al tarjetero</Text>
      </Pressable>

      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Código QR para Verificación Criptográfica</Text>
        <View style={styles.qrBox}>
          <QRCode value={`ward:credential:${credential.id}`} size={160} />
        </View>
        <View style={styles.statusPill}>
          <AppIcon name="checkmark.circle.fill" size={14} tintColor={colors.success} />
          <Text style={styles.statusText}>Credencial Verificada y Válida</Text>
        </View>
      </View>

      <View style={styles.messageBox}>
        <View style={styles.successRow}>
          <AppIcon name="checkmark.circle.fill" size={22} tintColor={colors.success} />
          <Text style={styles.successTitle}>Agregada Exitosamente</Text>
        </View>
        <Text style={styles.successDesc}>
          Tu credencial {credential.title} ya está disponible. Podés validarla
          escaneando o acercándola al lector NFC.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.four,
  },
  backText: {
    color: colors.accent,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  qrTitle: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
  qrBox: {
    padding: Spacing.two,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
  },
  statusText: {
    color: colors.success,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  messageBox: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  successTitle: {
    color: colors.success,
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
  },
  successDesc: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});
