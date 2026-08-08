import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCredentialOrder } from '@/hooks/use-credential-order';
import { useCardCustomisation } from '@/hooks/use-card-customisation';
import { AppIcon } from '@/components/ui/app-icon';
import { ScreenContainer } from '@/components/ui/screen-container';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import type { Credential } from '@/types/credential';
import { storageService, STORAGE_KEYS } from '@/services/storage';
import { ReorderableCard } from './reorderable-card';

type WalletScreenProps = {
  credentials: Credential[];
  pending?: Credential;
  onOpen: (credential: Credential) => void;
  onAcceptPending?: () => void;
  onSwitchMode?: () => void;
};

export function WalletScreen({
  credentials,
  pending,
  onOpen,
  onAcceptPending,
  onSwitchMode,
}: WalletScreenProps) {
  const { items, draggingId, moveItem, setDraggingId } = useCredentialOrder(credentials);
  const { masked, toggleMask, templateMap, setTemplate } = useCardCustomisation();
  const [alias, setAlias] = useState('joaquin.night');

  useEffect(() => {
    const savedAlias = storageService.getItem(STORAGE_KEYS.USER_ALIAS);
    if (savedAlias) {
      setAlias(savedAlias);
    }
  }, []);

  return (
    <ScreenContainer>
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
            <AppIcon
              name={masked ? 'eye.slash' : 'eye'}
              size={20}
              tintColor={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {pending && onAcceptPending && (
        <View style={styles.pendingCard}>
          <View style={[styles.pendingMark, { backgroundColor: pending.tone || colors.accent }]}>
            <Text style={styles.pendingMarkText}>{pending.mark || '*'}</Text>
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

      <View style={styles.cardsList}>
        {items.map((credential) => {
          const enriched: Credential = templateMap[credential.id]
            ? { ...credential, templateId: templateMap[credential.id] }
            : credential;

          return (
            <ReorderableCard
              key={credential.id}
              index={items.indexOf(credential)}
              credential={enriched}
              masked={masked}
              onOpen={() => onOpen(credential)}
              onTemplateChange={(tid) => setTemplate(credential.id, tid)}
              onMove={moveItem}
              onDraggingChange={setDraggingId}
              dragging={draggingId === credential.id}
            />
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: Spacing.four,
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
    backgroundColor: colors.surface,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: BorderRadius.sm,
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
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
    gap: Spacing.two,
    marginBottom: Spacing.four,
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
    color: colors.accent,
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
    backgroundColor: colors.accent,
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
