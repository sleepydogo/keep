import { useEffect, useState } from 'react';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { STORAGE_KEYS, storageService } from '@/services/storage';
import type { Credential } from '@/types/credential';

function loadSavedOrder(credentials: Credential[]): Credential[] {
  const saved = storageService.getItem(STORAGE_KEYS.CREDENTIAL_ORDER);
  if (!saved) return credentials;
  try {
    const order = JSON.parse(saved) as string[];
    return [...credentials].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  } catch {
    storageService.removeItem(STORAGE_KEYS.CREDENTIAL_ORDER);
    return credentials;
  }
}

function saveOrder(items: Credential[]): void {
  storageService.setItem(
    STORAGE_KEYS.CREDENTIAL_ORDER,
    JSON.stringify(items.map((item) => item.id))
  );
}

export function useCredentialOrder(credentials: Credential[]) {
  const [items, setItems] = useState(() => loadSavedOrder(credentials));
  const [prevCredentials, setPrevCredentials] = useState(credentials);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  if (prevCredentials !== credentials) {
    setPrevCredentials(credentials);
    setItems(loadSavedOrder(credentials));
  }

  useEffect(() => {
    const cleanups = items.map((item) => {
      const element = document.querySelector<HTMLElement>(`[data-credential-id="${item.id}"]`);
      if (!element) return () => {};
      return draggable({
        element,
        getInitialData: () => ({ id: item.id }),
        onDragStart: () => setDraggingId(item.id),
        onDrop: () => setDraggingId(null),
      });
    });

    const targets = items.map((item) => {
      const element = document.querySelector<HTMLElement>(`[data-credential-id="${item.id}"]`);
      if (!element) return () => {};
      return dropTargetForElements({
        element,
        getData: () => ({ id: item.id }),
        canDrop: ({ source }) => source.data.id !== item.id,
      });
    });

    const monitor = monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        const sourceId = source.data.id;
        const targetId = target?.data.id;
        if (typeof sourceId !== 'string' || typeof targetId !== 'string' || sourceId === targetId) return;

        setItems((current) => {
          const startIndex = current.findIndex((item) => item.id === sourceId);
          const finishIndex = current.findIndex((item) => item.id === targetId);
          const next = reorder({ list: current, startIndex, finishIndex });
          saveOrder(next);
          return next;
        });
        setDraggingId(null);
      },
    });

    return () => [...cleanups, ...targets, monitor].forEach((cleanup) => cleanup());
  }, [items]);

  const moveItem = (index: number, offset: number) => {
    const finishIndex = index + offset;
    if (finishIndex < 0 || finishIndex >= items.length) return;
    const next = reorder({ list: items, startIndex: index, finishIndex });
    setItems(next);
    saveOrder(next);
  };

  return {
    items,
    draggingId,
    moveItem,
  };
}
