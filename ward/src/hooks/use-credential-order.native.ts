import { useState } from 'react';
import type { Credential } from '@/types/credential';

/**
 * Native stub for use-credential-order.
 *
 * @atlaskit/pragmatic-drag-and-drop uses browser DOM APIs that don't exist on
 * React Native. This file is resolved instead of the main hook on iOS/Android
 * (via Metro's platform-specific extension resolution: .native.ts wins over .ts
 * on native platforms). It provides the same public API with reorder disabled.
 */
export function useCredentialOrder(credentials: Credential[]) {
  const [items] = useState(credentials);

  const moveItem = (_index: number, _offset: number) => {
    // Drag-and-drop is web-only; no-op on native.
  };

  return {
    items,
    draggingId: null as string | null,
    moveItem,
  };
}
