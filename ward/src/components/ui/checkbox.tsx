import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { AppIcon } from '@/components/ui/app-icon';

type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

const colors = Colors.light;

export function Checkbox({ checked, onToggle, label }: CheckboxProps) {
  return (
    <Pressable onPress={onToggle} style={styles.checkRow}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <AppIcon name="checkmark.circle.fill" size={16} tintColor="#FFFDF8" />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.action,
    borderColor: colors.action,
  },
  check: {
    color: '#FFFDF8',
    fontWeight: '700',
  },
  checkLabel: {
    flex: 1,
    color: colors.text,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 20,
  },
});
