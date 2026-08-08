import React from 'react';
import {
  Eye,
  EyeOff,
  Settings,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Nfc,
  UserCheck,
  QrCode,
  ArrowUpDown,
  Plus,
  X,
  Star,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  LucideIcon,
} from 'lucide-react-native';
import { colors } from '@/constants/theme';

export type IconName =
  | 'eye'
  | 'eye.slash'
  | 'gearshape'
  | 'checkmark.circle.fill'
  | 'xmark.circle.fill'
  | 'chevron.left'
  | 'chevron.right'
  | 'nfc'
  | 'person.badge.key.fill'
  | 'qrcode'
  | 'arrow.up.arrow.down'
  | 'plus'
  | 'xmark'
  | 'star.fill'
  | 'star'
  | 'contactless'
  | 'shield.checkmark.fill'
  | 'exclamationmark.triangle.fill'
  | 'arrow.left';

type AppIconProps = {
  name: IconName;
  size?: number;
  tintColor?: string;
  weight?: 'thin' | 'ultraLight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
};

const ICON_MAP: Record<IconName, LucideIcon> = {
  eye: Eye,
  'eye.slash': EyeOff,
  gearshape: Settings,
  'checkmark.circle.fill': CheckCircle2,
  'xmark.circle.fill': XCircle,
  'chevron.left': ChevronLeft,
  'chevron.right': ChevronRight,
  nfc: Nfc,
  'person.badge.key.fill': UserCheck,
  qrcode: QrCode,
  'arrow.up.arrow.down': ArrowUpDown,
  plus: Plus,
  xmark: X,
  'star.fill': Star,
  star: Star,
  contactless: Nfc,
  'shield.checkmark.fill': ShieldCheck,
  'exclamationmark.triangle.fill': AlertTriangle,
  'arrow.left': ArrowLeft,
};

const strokeWidthMap: Record<NonNullable<AppIconProps['weight']>, number> = {
  thin: 1,
  ultraLight: 1.25,
  light: 1.5,
  regular: 2,
  medium: 2.25,
  semibold: 2.5,
  bold: 3,
  heavy: 3.5,
  black: 4,
};

export function AppIcon({ name, size = 20, tintColor = colors.text, weight = 'regular' }: AppIconProps) {
  const Component = ICON_MAP[name] || QrCode;
  const strokeWidth = strokeWidthMap[weight] ?? 2;
  const isFilledStar = name === 'star.fill';

  return (
    <Component
      size={size}
      color={tintColor}
      strokeWidth={strokeWidth}
      fill={isFilledStar ? tintColor : 'none'}
    />
  );
}

