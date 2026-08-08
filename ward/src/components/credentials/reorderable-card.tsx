import React from 'react';
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

export function ReorderableCard({
  credential,
  onOpen,
  onTemplateChange,
  masked,
}: ReorderableCardProps) {
  return (
    <AppleWalletCard
      credential={credential}
      masked={masked}
      onClick={onOpen}
      onTemplateChange={onTemplateChange}
    />
  );
}
