import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { QRCode } from '@/components/ui/qr-code';
import { AppIcon } from '@/components/ui/app-icon';
import { ScreenContainer } from '@/components/ui/screen-container';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';
import type { Credential } from '@/types/credential';

type DetailScreenProps = {
  credential: Credential;
  credentials?: Credential[];
  onSelectCredential?: (cred: Credential) => void;
  onBack: () => void;
};

export function DetailScreen({
  credential,
  credentials = [],
  onSelectCredential,
  onBack,
}: DetailScreenProps) {
  const pages = useMemo(() => credentials.length ? credentials : [credential], [credentials, credential]);
  const { width } = useWindowDimensions();
  const initialIndex = Math.max(0, pages.findIndex((item) => item.id === credential.id));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const translateX = useSharedValue(0);
  const activeCredential = pages[activeIndex] ?? credential;

  useEffect(() => {
    const nextIndex = pages.findIndex((item) => item.id === credential.id);
    if (nextIndex >= 0) setActiveIndex(nextIndex);
  }, [credential.id, pages]);

  const movePage = (direction: -1 | 1) => {
    const nextIndex = activeIndex + direction;
    if (nextIndex < 0 || nextIndex >= pages.length) return;
    setActiveIndex(nextIndex);
    onSelectCredential?.(pages[nextIndex]);
  };

  const swipeGesture = Gesture.Pan()
    .activateAfterLongPress(240)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const direction = event.translationX < 0 ? 1 : -1;
      const shouldMove = Math.abs(event.translationX) > 72;
      if (shouldMove) {
        translateX.value = withTiming(direction * -width, { duration: 220 }, (finished) => {
          if (finished) {
            runOnJS(movePage)(direction);
            translateX.value = 0;
          }
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const cardAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(translateX.value), [0, width * 0.5], [1, 0.35], 'clamp'),
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${interpolate(translateX.value, [-width, 0, width], [-4, 0, 4], 'clamp')}deg` },
      { scale: interpolate(Math.abs(translateX.value), [0, width], [1, 0.96], 'clamp') },
    ],
  }));

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <AppIcon name="chevron.left" size={20} tintColor={colors.accent} />
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{activeCredential.title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={cardAnimation}>
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Mantené y deslizá para cambiar</Text>
            <View style={styles.qrBox}>
              <QRCode value={`ward:credential:${activeCredential.id}`} size={160} />
            </View>
            <View style={styles.statusPill}>
              <AppIcon name="checkmark.circle.fill" size={14} tintColor={colors.success} />
              <Text style={styles.statusText}>Credencial Verificada y Válida</Text>
            </View>
          </View>

          <View style={styles.metaCard}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Categoría</Text>
          <Text style={styles.metaValue}>{activeCredential.type}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Emisor</Text>
          <Text style={styles.metaValue}>{activeCredential.issuer}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Entidad reguladora</Text>
          <Text style={styles.metaValue}>{activeCredential.issuerDetail}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Fecha de emisión</Text>
          <Text style={styles.metaValue}>{activeCredential.issued}</Text>
        </View>
        <View style={[styles.metaRow, styles.lastMetaRow]}>
          <Text style={styles.metaLabel}>Válida hasta</Text>
          <Text style={styles.metaValue}>{activeCredential.validUntil}</Text>
          </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.pagerControls}>
        <Pressable
          onPress={() => movePage(-1)}
          disabled={activeIndex === 0}
          style={[styles.pagerButton, activeIndex === 0 && styles.disabled]}
        >
          <AppIcon name="chevron.left" size={18} tintColor={colors.textSecondary} />
          <Text style={styles.pagerText}>Anterior</Text>
        </Pressable>
        <Text style={styles.pageCount}>{activeIndex + 1} / {pages.length}</Text>
        <Pressable
          onPress={() => movePage(1)}
          disabled={activeIndex === pages.length - 1}
          style={[styles.pagerButton, activeIndex === pages.length - 1 && styles.disabled]}
        >
          <Text style={styles.pagerText}>Siguiente</Text>
          <AppIcon name="chevron.right" size={18} tintColor={colors.textSecondary} />
        </Pressable>
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
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    color: colors.accent,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
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
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 0,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastMetaRow: {
    borderBottomWidth: 0,
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
  pagerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.three,
  },
  pagerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  pagerText: {
    color: colors.textSecondary,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  pageCount: {
    color: colors.textFaint,
    fontFamily: Fonts.mono,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.25,
  },
});
