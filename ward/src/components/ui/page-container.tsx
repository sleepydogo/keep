import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

type PageContainerProps = {
  children: ReactNode;
};

const colors = Colors.light;

export function PageContainer({ children }: PageContainerProps) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.container}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    minHeight: '100%',
    backgroundColor: colors.background,
    padding: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
});
