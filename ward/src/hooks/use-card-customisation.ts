import { useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TEMPLATE_MAP_KEY = 'ward.templateMap';

/**
 * Manages per-credential template overrides, persisted on each platform.
 * Also controls the global privacy mask for all cards.
 */
export function useCardCustomisation() {
  const [masked, setMasked] = useState(false);

  const [templateMap, setTemplateMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        setTemplateMap(JSON.parse(localStorage.getItem(TEMPLATE_MAP_KEY) || '{}'));
      } catch {
        setTemplateMap({});
      }
      return;
    }

    AsyncStorage.getItem(TEMPLATE_MAP_KEY).then((value) => {
      if (!value) return;
      try {
        setTemplateMap(JSON.parse(value));
      } catch {
        setTemplateMap({});
      }
    });
  }, []);

  const toggleMask = useCallback(() => setMasked((m) => !m), []);

  const setTemplate = useCallback((credentialId: string, templateId: string) => {
    setTemplateMap((prev) => {
      const next = { ...prev, [credentialId]: templateId };
      if (Platform.OS === 'web') {
        try {
          localStorage.setItem(TEMPLATE_MAP_KEY, JSON.stringify(next));
        } catch {
          // Storage is optional; the in-memory update still applies.
        }
      } else {
        void AsyncStorage.setItem(TEMPLATE_MAP_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return { masked, toggleMask, templateMap, setTemplate };
}
