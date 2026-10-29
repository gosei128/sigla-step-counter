import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { blobPath } from './Sigla';
import { C, F } from '../theme';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Eyebrow({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.eyebrow, style]}>{children}</Text>;
}

export function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const w = useSharedValue(0);
  const col = useSharedValue(color);
  useEffect(() => {
    w.value = withTiming(pct, { duration: 600 });
    col.value = withTiming(color, { duration: 600 });
  }, [pct, color, w, col]);
  const st = useAnimatedStyle(() => ({ width: `${w.value}%`, backgroundColor: col.value }));
  return (
    <View style={s.track}>
      <Animated.View style={[s.fill, st]} />
    </View>
  );
}

// Animated soft halo behind the mascot.
export function Halo({ size, color, style }: { size: number; color: string; style?: StyleProp<ViewStyle> }) {
  const col = useSharedValue(color);
  useEffect(() => {
    col.value = withTiming(color, { duration: 600 });
  }, [color, col]);
  const st = useAnimatedStyle(() => ({ backgroundColor: col.value }));
  return <Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2 }, st, style]} />;
}

export function Diamond({ size, color, radius }: { size: number; color: string; radius: number }) {
  return <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />;
}

// The small mood blob used in "My week" and the nav icon.
export function Blob({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <Svg width={w} height={h}>
      <Path d={blobPath(w, h, [0.5, 0.5, 0.45, 0.45], [0.58, 0.58, 0.42, 0.42])} fill={color} />
    </Svg>
  );
}

export const s = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 24, borderWidth: 1, borderColor: C.border },
  eyebrow: { fontFamily: F.bold, fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: C.faint },
  track: { height: 6, borderRadius: 999, backgroundColor: C.track, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  muted: { fontFamily: F.semi, fontSize: 13, color: C.muted },
  display: { fontFamily: F.display, color: C.ink },
  title: { fontFamily: F.display, fontSize: 26, color: C.ink },
});
