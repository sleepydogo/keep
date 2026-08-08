import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { QRCode } from "@/components/ui/qr-code";
import type { Credential } from "@/types/credential";
import { Colors, Fonts, Spacing } from '@/constants/theme';

type AddedScreenProps = {
  credential: Credential;
  onBack: () => void;
};

const colors = Colors.light;

export function AddedScreen({ credential, onBack }: AddedScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>‹ Volver al tarjetero</Text>
          </Pressable>
        </View>

        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Código QR para Verificación Criptográfica</Text>
          <View style={styles.qrBox}>
            <QRCode value={`ward:credential:${credential.id}`} size={160} />
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>Credencial Verificada y Válida</Text>
          </View>
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.successTitle}>✓ Agregada Exitosamente</Text>
          <Text style={styles.successDesc}>
            Tu credencial {credential.title} ya está disponible. Podés validarla
            escaneando o acercándola al lector NFC.
          </Text>
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
    paddingBottom: Spacing.two,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: colors.action,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  qrCard: {
    backgroundColor: colors.backgroundElement,
    borderRadius: 20,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: Spacing.three,
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
    borderRadius: 16,
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
  statusIcon: {
    color: colors.verified,
    fontSize: 14,
    fontWeight: '700',
  },
  statusText: {
    color: colors.verified,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  messageBox: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  successTitle: {
    color: colors.verified,
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
  },
  successDesc: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
