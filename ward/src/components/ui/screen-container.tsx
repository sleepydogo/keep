import React from 'react';
import { View, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, MaxContentWidth } from '@/constants/theme';

type ScreenContainerProps = {
  children: React.ReactNode;
  contentCentered?: boolean;
  padBottom?: boolean;
};

export function ScreenContainer({
  children,
  contentCentered = true,
  padBottom = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} hidden />
      <View
        style={[
          styles.inner,
          {
            paddingTop: insets.top > 0 ? insets.top : 0,
            paddingBottom: padBottom && insets.bottom > 0 ? insets.bottom : 0,
          },
        ]}
      >
        <View
          style={[
            contentCentered && styles.centered,
            { maxWidth: Math.min(width - 48, MaxContentWidth), width: '100%' },
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    alignItems: 'stretch',
  },
  centered: {
    alignSelf: 'center',
  },
});
