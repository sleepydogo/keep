import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Credential } from '@/types/credential';
import { STORAGE_KEYS } from '@/services/storage';

/**
 * Native stub for use-credential-order.
 *
 * @atlaskit/pragmatic-drag-and-drop uses browser DOM APIs that don't exist on
 * React Native. This file is resolved instead of the main hook on iOS/Android
 * (via Metro's platform-specific extension resolution: .native.ts wins over .ts
 * on native platforms). It provides the same public API with reorder disabled.
 */
export function useCredentialOrder(credentials: Credential[]) {
  const [items, setItems] = useState(credentials);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const credentialKey = credentials.map((credential) => credential.id).join('|');
  const credentialsRef = useRef(credentials);
  credentialsRef.current = credentials;

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEYS.CREDENTIAL_ORDER).then((saved) => {
      if (!active || !saved) return;
      try {
        const order = JSON.parse(saved) as string[];
        const positions = new Map(order.map((id, index) => [id, index]));
        setItems([...credentialsRef.current].sort((a, b) => {
          const aPosition = positions.get(a.id) ?? order.length + 1;
          const bPosition = positions.get(b.id) ?? order.length + 1;
          return aPosition - bPosition;
        }));
      } catch {
        AsyncStorage.removeItem(STORAGE_KEYS.CREDENTIAL_ORDER);
      }
    });
    return () => {
      active = false;
    };
  }, [credentialKey]);

  const moveItem = (index: number, offset: number) => {
    const finishIndex = index + offset;
    if (finishIndex < 0 || finishIndex >= items.length || finishIndex === index) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(finishIndex, 0, moved);
    setItems(next);
    AsyncStorage.setItem(
      STORAGE_KEYS.CREDENTIAL_ORDER,
      JSON.stringify(next.map((item) => item.id)),
    );
  };

  return {
    items,
    draggingId,
    setDraggingId,
    moveItem,
  };
}
