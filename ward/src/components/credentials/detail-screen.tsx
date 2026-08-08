import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { QRCode } from "@/components/ui/qr-code";
import type { Credential } from "@/types/credential";
import { Colors, Fonts, Spacing } from '@/constants/theme';

type DetailScreenProps = {
  credential: Credential;
  credentials?: Credential[];
  onSelectCredential?: (cred: Credential) => void;
  onBack: () => void;
};

const colors = Colors.light;

export function DetailScreen({
  credential,
  credentials = [],
  onSelectCredential,
  onBack,
}: DetailScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>‹ Volver</Text>
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>{credential.title}</Text>
          <View style={{ width: 40 }} />
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

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Categoría</Text>
            <Text style={styles.metaValue}>{credential.type}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Emisor</Text>
            <Text style={styles.metaValue}>{credential.issuer}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Entidad reguladora</Text>
            <Text style={styles.metaValue}>{credential.issuerDetail}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Fecha de emisión</Text>
            <Text style={styles.metaValue}>{credential.issued}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Válida hasta</Text>
            <Text style={styles.metaValue}>{credential.validUntil}</Text>
          </View>
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
  backBtn: {
    paddingVertical: Spacing.half,
  },
  backBtnText: {
    color: colors.action,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
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
  metaCard: {
    backgroundColor: colors.backgroundElement,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.two,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaLabel: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  metaValue: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
});
