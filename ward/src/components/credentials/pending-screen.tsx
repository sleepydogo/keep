import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { pendingCredential } from '@/constants/mock-data';
import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { CredentialInfo } from './credential-info';
import { AppIcon } from '@/components/ui/app-icon';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

type PendingScreenProps = {
  onAccept: () => void;
  onBack: () => void;
};

export function PendingScreen({ onAccept, onBack }: PendingScreenProps) {
  return (
    <ScreenContainer>
      <Pressable style={styles.backRow} onPress={onBack}>
        <AppIcon name="chevron.left" size={18} tintColor={colors.accent} />
        <Text style={styles.backText}>Volver</Text>
      </Pressable>

      <View style={styles.reviewWrap}>
        <View style={[styles.largeMark, { backgroundColor: pendingCredential.tone || colors.accent }]}>
          <AppIcon name="checkmark.circle.fill" size={40} tintColor="#FFFDF8" />
        </View>
        <Text style={styles.reviewKicker}>Recibiste una credencial</Text>
        <Text style={styles.reviewTitle}>{pendingCredential.title}</Text>
        <Text style={styles.reviewIssuer}>Enviada por {pendingCredential.issuer}</Text>
        <CredentialInfo credential={pendingCredential} />
        <Text style={styles.helper}>Al agregarla, quedará guardada en tu tarjetero.</Text>
        <Button label="Agregar a WARD" onPress={onAccept} />
        <Pressable onPress={onBack} style={styles.rejectButton}>
          <Text style={styles.rejectText}>Rechazar</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.three,
  },
  backText: {
    color: colors.accent,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewWrap: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  largeMark: {
    width: 92,
    height: 92,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  reviewKicker: {
    color: colors.success,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  reviewTitle: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 36,
    textAlign: 'center',
    fontWeight: '700',
  },
  reviewIssuer: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 15,
    textAlign: 'center',
  },
  helper: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
  rejectButton: {
    padding: Spacing.two,
  },
  rejectText: {
    color: colors.danger,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
});
