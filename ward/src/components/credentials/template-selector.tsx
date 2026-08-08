import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CARD_TEMPLATES, CardTemplate } from '@/constants/card-templates';
import { Colors, Fonts, Spacing } from '@/constants/theme';

type TemplateSelectorProps = {
  currentId?: string;
  onSelect: (template: CardTemplate) => void;
  onClose: () => void;
};

const colors = Colors.light;

export function TemplateSelector({ currentId, onSelect, onClose }: TemplateSelectorProps) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Diseño de tarjeta</Text>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {CARD_TEMPLATES.map((t) => (
              <Pressable
                key={t.id}
                style={[
                  styles.chip,
                  { backgroundColor: colors.backgroundElement },
                  t.id === currentId && styles.chipSelected,
                ]}
                onPress={() => onSelect(t)}
              >
                <Text style={[styles.chipName, { color: colors.text }]}>{t.name}</Text>
                {t.id === currentId && <Text style={[styles.chipCheck, { color: colors.action }]}>✓</Text>}
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: Spacing.one,
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  chipSelected: {
    borderColor: colors.action,
  },
  chipName: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  chipCheck: {
    fontSize: 14,
    fontWeight: '700',
  },
});
