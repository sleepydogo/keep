import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CARD_TEMPLATES, CardTemplate } from '@/constants/card-templates';
import { AppIcon } from '@/components/ui/app-icon';
import { colors, Spacing, BorderRadius, Fonts } from '@/constants/theme';

type TemplateSelectorProps = {
  currentId?: string;
  onSelect: (template: CardTemplate) => void;
  onClose: () => void;
};

export function TemplateSelector({ currentId, onSelect, onClose }: TemplateSelectorProps) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Diseño de tarjeta</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <AppIcon name="xmark" size={18} tintColor={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {CARD_TEMPLATES.map((t) => (
              <Pressable
                key={t.id}
                style={[styles.chip, t.id === currentId && styles.chipSelected]}
                onPress={() => onSelect(t)}
              >
                <LinearGradient
                  colors={t.gradient.colors}
                  start={t.gradient.start}
                  end={t.gradient.end}
                  style={styles.chipGradient}
                >
                  <Text style={styles.chipName}>{t.name}</Text>
                  {t.id === currentId && (
                    <AppIcon name="checkmark.circle.fill" size={14} tintColor="#FFFFFF" />
                  )}
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: Spacing.one,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  chip: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  chipGradient: {
    minWidth: 112,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  chipSelected: {
    borderColor: colors.accent,
  },
  chipName: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
