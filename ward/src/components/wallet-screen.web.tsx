import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppleWalletCard } from '@/components/credentials/apple-wallet-card';
import { useCredentialOrder } from '@/hooks/use-credential-order';
import { useCardCustomisation } from '@/hooks/use-card-customisation';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import type { Credential } from '@/types/credential';
import { storageService, STORAGE_KEYS } from '@/services/storage';

type WalletScreenProps = {
  credentials: Credential[];
  pending?: Credential;
  onOpen: (credential: Credential) => void;
  onAcceptPending?: () => void;
  onSwitchMode?: () => void;
};

const colors = Colors.light;

export function WalletScreen({
  credentials,
  pending,
  onOpen,
  onAcceptPending,
  onSwitchMode,
}: WalletScreenProps) {
  const { items } = useCredentialOrder(credentials);
  const { masked, toggleMask, templateMap, setTemplate } = useCardCustomisation();
  const [alias, setAlias] = useState('joaquin.night');

  useEffect(() => {
    const savedAlias = storageService.getItem(STORAGE_KEYS.USER_ALIAS);
    if (savedAlias) {
      setAlias(savedAlias);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>WARD</Text>
            <View style={styles.brandDot} />
          </View>

          <View style={styles.headerActions}>
            <Text style={styles.aliasText}>@{alias}</Text>

            {onSwitchMode && (
              <Pressable style={styles.modeBtn} onPress={onSwitchMode}>
                <Text style={styles.modeBtnText}>KEEP</Text>
              </Pressable>
            )}

            <Pressable style={styles.iconBtn} onPress={toggleMask}>
              <Text style={styles.iconText}>{masked ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>
        </View>

        {/* Pending credential banner */}
        {pending && onAcceptPending && (
          <View style={styles.pendingCard}>
            <View style={[styles.pendingMark, { backgroundColor: pending.tone || colors.action }]}>
              <Text style={styles.pendingMarkText}>{pending.mark || '★'}</Text>
            </View>
            <View style={styles.pendingCopy}>
              <Text style={styles.pendingKicker}>Nueva credencial</Text>
              <Text style={styles.pendingTitle}>{pending.title}</Text>
            </View>
            <Pressable style={styles.acceptBtn} onPress={onAcceptPending}>
              <Text style={styles.acceptBtnText}>Agregar</Text>
            </Pressable>
          </View>
        )}

        {/* Cards List */}
        <View style={styles.cardsList}>
          {items.map((credential) => {
            const enriched: Credential = templateMap[credential.id]
              ? { ...credential, templateId: templateMap[credential.id] }
              : credential;

            return (
              <AppleWalletCard
                key={credential.id}
                credential={enriched}
                masked={masked}
                onClick={() => onOpen(credential)}
                onTemplateChange={(tid) => setTemplate(credential.id, tid)}
              />
            );
          })}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  aliasText: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  modeBtn: {
    backgroundColor: colors.backgroundElement,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeBtnText: {
    color: colors.textSecondary,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    padding: Spacing.one,
  },
  iconText: {
    fontSize: 18,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElement,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.two,
  },
  pendingMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingMarkText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  pendingCopy: {
    flex: 1,
    gap: 2,
  },
  pendingKicker: {
    color: colors.action,
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
  },
  pendingTitle: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  acceptBtn: {
    backgroundColor: colors.action,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 10,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  cardsList: {
    gap: Spacing.two,
  },
});
