import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';

type VerifierResultVariant = 'valid' | 'invalid' | 'offline';

type VerifierResultScreenProps = {
  variant: VerifierResultVariant;
  onDone: () => void;
  onScanAgain: () => void;
};

const credentialData = {
  type: 'Identidad',
  title: 'Mayoría de edad',
  issuer: 'Registro Civil',
  verifiedAttribute: 'Mayor de 18 años',
  verifiedAt: new Date().toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
};

const colors = Colors.light;

export function VerifierResultScreen({ variant, onDone, onScanAgain }: VerifierResultScreenProps) {
  const isValid = variant === 'valid';
  const isOffline = variant === 'offline';

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>KEEP</Text>
            <View style={styles.brandDot} />
          </View>
        </View>

        <View style={styles.resultSection}>
          <View style={[styles.badge, isValid ? styles.badgeValid : styles.badgeInvalid]}>
            <AppIcon name={isValid ? 'checkmark.circle.fill' : 'xmark.circle.fill'} size={30} tintColor={colors.text} />
          </View>

          <Text style={[styles.resultTitle, isValid ? styles.titleValid : styles.titleInvalid]}>
            {isValid ? 'Credencial válida' : 'Credencial no válida'}
          </Text>

          {isValid && (
            <>
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.label}>Tipo</Text>
                  <Text style={styles.value}>{credentialData.type}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Título</Text>
                  <Text style={styles.value}>{credentialData.title}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Emisor</Text>
                  <Text style={styles.value}>{credentialData.issuer}</Text>
                </View>
              </View>

              <View style={styles.verifiedBlock}>
                <View style={styles.verifiedHeader}>
                  <AppIcon name="checkmark.circle.fill" size={16} tintColor={colors.verified} />
                  <Text style={styles.verifiedHeaderText}>Dato verificado</Text>
                </View>
                <Text style={styles.attribute}>{credentialData.verifiedAttribute}</Text>
                <Text style={styles.meta}>Verificado el {credentialData.verifiedAt}</Text>
                {isOffline && (
                  <Text style={styles.metaWarning}>
                    Verificación offline — sin comprobación de revocación
                  </Text>
                )}
              </View>

              <View style={styles.privacyNote}>
                <AppIcon name="shield.checkmark.fill" size={20} tintColor={colors.textFaint} />
                <View style={styles.privacyContent}>
                  <Text style={styles.privacyTitle}>Datos no revelados</Text>
                  <Text style={styles.privacyDesc}>Nombre · DNI · Fecha de nacimiento</Text>
                </View>
              </View>
            </>
          )}

          {!isValid && (
            <View style={[styles.card, styles.cardError]}>
              <Text style={styles.errorTitle}>No se pudo validar esta credencial.</Text>
              <Text style={styles.errorReason}>
                La firma del emisor no es válida o la credencial fue alterada.
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.scanAgainBtn, pressed && styles.pressed]}
              onPress={onScanAgain}
            >
              <Text style={styles.scanAgainText}>Escanear otra</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}
              onPress={onDone}
            >
              <Text style={styles.doneText}>Finalizar</Text>
            </Pressable>
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
  resultSection: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  badgeValid: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 2,
    borderColor: colors.verified,
  },
  badgeInvalid: {
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    borderWidth: 2,
    borderColor: colors.danger,
  },
  badgeIcon: {
    fontSize: 28,
    color: colors.text,
  },
  resultTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleValid: {
    color: colors.verified,
  },
  titleInvalid: {
    color: colors.danger,
  },
  card: {
    width: '100%',
    backgroundColor: colors.backgroundElement,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.two,
  },
  cardError: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.half,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBlock: {
    width: '100%',
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    gap: Spacing.one,
  },
  verifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  verifiedHeaderIcon: {
    color: colors.verified,
    fontSize: 16,
    fontWeight: '700',
  },
  verifiedHeaderText: {
    color: colors.verified,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  attribute: {
    color: colors.text,
    fontFamily: Fonts.serif,
    fontSize: 20,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  meta: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  metaWarning: {
    color: colors.warning,
    fontFamily: Fonts.sans,
    fontSize: 12,
    marginTop: Spacing.one,
  },
  privacyNote: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: colors.backgroundElement,
    borderRadius: 14,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
  },
  privacyIcon: {
    fontSize: 20,
  },
  privacyContent: {
    flex: 1,
    gap: 2,
  },
  privacyTitle: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  privacyDesc: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  errorTitle: {
    color: colors.danger,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  errorReason: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  actions: {
    width: '100%',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  scanAgainBtn: {
    backgroundColor: colors.action,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: colors.backgroundElement,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  doneText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
