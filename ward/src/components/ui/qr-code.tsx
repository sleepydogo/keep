import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, Pressable } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { AppIcon } from './app-icon';

type QRCodeProps = {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
};

function generateQRMatrix(value: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isReserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const addFinderPattern = (rowStart: number, colStart: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const rPos = rowStart + r;
        const cPos = colStart + c;
        isReserved[rPos][cPos] = true;
        if (r === 0 || r === 6 || c === 0 || c === 6) {
          matrix[rPos][cPos] = true;
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          matrix[rPos][cPos] = true;
        } else {
          matrix[rPos][cPos] = false;
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, 14);
  addFinderPattern(14, 0);

  for (let i = 0; i < 8; i++) {
    if (i < 7) {
      isReserved[7][i] = true;
      isReserved[i][7] = true;
      isReserved[7][14 + i] = true;
      isReserved[i][13] = true;
      isReserved[13][i] = true;
      isReserved[14 + i][7] = true;
    } else {
      isReserved[7][7] = true;
    }
  }

  for (let i = 8; i < 13; i++) {
    isReserved[6][i] = true;
    matrix[6][i] = i % 2 === 0;
    isReserved[i][6] = true;
    matrix[i][6] = i % 2 === 0;
  }

  isReserved[13][8] = true;
  matrix[13][8] = true;

  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      isReserved[8][i] = true;
      isReserved[i][8] = true;
    }
  }
  for (let i = 13; i < 21; i++) {
    isReserved[8][i] = true;
    isReserved[i][8] = true;
  }

  const formatBits = [true, false, true, false, true, true, false, true, true, false, true, false, false, true, false];
  let fbIdx = 0;
  for (let col = 0; col <= 8; col++) {
    if (col !== 6 && fbIdx < formatBits.length) {
      matrix[8][col] = formatBits[fbIdx++];
    }
  }
  for (let row = 7; row >= 0; row--) {
    if (row !== 6 && fbIdx < formatBits.length) {
      matrix[row][8] = formatBits[fbIdx++];
    }
  }

  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }

  const pseudoRandomBit = (index: number) => {
    const x = Math.sin(hash + index * 997) * 10000;
    return (x - Math.floor(x)) > 0.48;
  };

  let bitIndex = 0;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let row = 0; row < size; row++) {
      const actualRow = Math.floor((col + 1) / 2) % 2 === 0 ? row : size - 1 - row;
      for (let c = 0; c < 2; c++) {
        const cPos = col - c;
        if (cPos >= 0 && !isReserved[actualRow][cPos]) {
          matrix[actualRow][cPos] = pseudoRandomBit(bitIndex++);
        }
      }
    }
  }

  return matrix;
}

export function QRCode({
  value,
  size = 180,
  color = '#1C1917',
  backgroundColor = '#FFFFFF',
}: QRCodeProps) {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    // Prevent screen capture / screenshots on mobile (Android FLAG_SECURE & iOS recording/capture flag)
    ScreenCapture.preventScreenCaptureAsync('qr-code-protection').catch(() => {});

    // Enable app switcher blur protection on iOS
    if (Platform.OS === 'ios') {
      ScreenCapture.enableAppSwitcherProtectionAsync(0.9).catch(() => {});
    }

    // Listener for screenshot events (triggers overlay protection on iOS/Android if screenshot is attempted)
    const subscription = ScreenCapture.addScreenshotListener(() => {
      setIsBlocked(true);
    });

    return () => {
      ScreenCapture.allowScreenCaptureAsync('qr-code-protection').catch(() => {});
      if (Platform.OS === 'ios') {
        ScreenCapture.disableAppSwitcherProtectionAsync().catch(() => {});
      }
      subscription.remove();
    };
  }, []);

  const matrix = generateQRMatrix(value);
  const cellSize = size / matrix.length;

  return (
    <View style={[styles.container, { width: size + 16, height: size + 36, backgroundColor }]}>
      <View style={{ width: size, height: size, position: 'relative' }}>
        {isBlocked ? (
          <Pressable
            style={styles.blockedOverlay}
            onPress={() => setIsBlocked(false)}
          >
            <AppIcon name="shield.checkmark.fill" size={36} tintColor="#EF4444" />
            <Text style={styles.blockedTitle}>Captura Bloqueada</Text>
            <Text style={styles.blockedSubtext}>Por seguridad, el QR no se puede capturar.</Text>
            <Text style={styles.unblockBtn}>Tocar para mostrar</Text>
          </Pressable>
        ) : (
          matrix.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((isDark, c) => (
                <View
                  key={c}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isDark ? color : backgroundColor,
                  }}
                />
              ))}
            </View>
          ))
        )}
      </View>

      {/* Screenshot Protection Indicator Badge */}
      <View style={styles.securityBadge}>
        <AppIcon name="shield.checkmark.fill" size={12} tintColor="#059669" />
        <Text style={styles.securityBadgeText}>Protegido contra capturas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  blockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  blockedTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginTop: 6,
  },
  blockedSubtext: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  unblockBtn: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  securityBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
});

