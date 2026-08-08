import type { Credential } from '@/types/credential';

// Sin reordenamiento en nativo: la version .web depende de
// pragmatic-drag-and-drop, que lee navigator al importarse y no existe en RN.
export function useCredentialOrder(credentials: Credential[]) {
  return { items: credentials, draggingId: null as string | null, moveItem: () => {} };
}
