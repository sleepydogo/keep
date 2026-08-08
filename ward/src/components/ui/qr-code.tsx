import { View } from 'react-native';
import QR from 'react-native-qrcode-svg';

type QRCodeProps = {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
};

export function QRCode({
  value,
  size = 180,
  color = '#1C1917',
  backgroundColor = '#FFFFFF',
}: QRCodeProps) {
  if (!value) return <View style={{ width: size, height: size }} />;
  return (
    <View style={{ padding: 8, borderRadius: 16, backgroundColor }}>
      <QR value={value} size={size} color={color} backgroundColor={backgroundColor} />
    </View>
  );
}
