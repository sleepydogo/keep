import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { Credential } from '@/types/credential';
import { AppleWalletCard } from './apple-wallet-card';

type ReorderableCardProps = {
  credential: Credential;
  index: number;
  onOpen: () => void;
  onTemplateChange: (templateId: string) => void;
  masked: boolean;
  onMove: (index: number, offset: number) => void;
  onDraggingChange: (id: string | null) => void;
  dragging: boolean;
};

const CARD_STEP = 196;

export function ReorderableCard({
  credential,
  index,
  onOpen,
  onTemplateChange,
  masked,
  onMove,
  onDraggingChange,
  dragging,
}: ReorderableCardProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .activateAfterLongPress(260)
    .onStart(() => {
      scale.value = withSpring(1.03);
      runOnJS(onDraggingChange)(credential.id);
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const offset = Math.round(event.translationY / CARD_STEP);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      runOnJS(onDraggingChange)(null);
      if (offset !== 0) runOnJS(onMove)(index, offset);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: dragging ? 0.92 : 1,
    zIndex: translateY.value === 0 ? 0 : 10,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <AppleWalletCard
          credential={credential}
          masked={masked}
          onClick={onOpen}
          onTemplateChange={onTemplateChange}
        />
      </Animated.View>
    </GestureDetector>
  );
}
