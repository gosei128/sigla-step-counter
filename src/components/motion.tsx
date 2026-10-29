import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, type PressableProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSigla } from '../state/SiglaContext';
import { C, F } from '../theme';

// Bumps every time the screen regains focus, so keyed content replays its entering animation.
export function useFocusKey() {
  const focused = useIsFocused();
  const [key, setKey] = useState(0);
  const was = useRef(focused);
  useEffect(() => {
    if (focused && !was.current) setKey(k => k + 1);
    was.current = focused;
  }, [focused]);
  return key;
}

// Staggered fade-up for cards as a screen appears.
export function Enter({ i = 0, children, style }: { i?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { animations } = useSigla();
  return (
    <Animated.View
      entering={animations ? FadeInDown.delay(60 + i * 70).duration(420) : undefined}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// Counts a number up from 0 (or its previous value) with an ease-out.
export function CountUp({ value, style, duration = 900 }: { value: number; style?: StyleProp<TextStyle>; duration?: number }) {
  const { animations } = useSigla();
  const [shown, setShown] = useState(animations ? 0 : value);
  const from = useRef(animations ? 0 : value);
  useEffect(() => {
    if (!animations) { from.current = value; return; }
    const start = from.current, t0 = Date.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / duration);
      const v = Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3)));
      setShown(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, animations]);
  return <Text style={style}>{(animations ? shown : value).toLocaleString()}</Text>;
}

// Pressable that squashes slightly while held.
export function PressScale({ children, style, to = 0.96, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; to?: number; children: ReactNode }) {
  const k = useSharedValue(1);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: k.value }] }));
  return (
    <Pressable
      {...rest}
      onPressIn={e => { k.set(withTiming(to, { duration: 90 })); rest.onPressIn?.(e); }}
      onPressOut={e => { k.set(withSpring(1, { damping: 12, stiffness: 260 })); rest.onPressOut?.(e); }}
    >
      <Animated.View style={[style, st]}>{children}</Animated.View>
    </Pressable>
  );
}

export function Toggle({ value, onChange, color }: { value: boolean; onChange: (v: boolean) => void; color: string }) {
  const p = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    p.value = withSpring(value ? 1 : 0, { damping: 16, stiffness: 220 });
  }, [value, p]);
  const track = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(p.value, [0, 1], [C.dash, color]) }));
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: p.value * 20 }] }));
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value }} onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[{ width: 50, height: 30, borderRadius: 15, padding: 3 }, track]}>
        <Animated.View style={[{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(42,37,33,0.2)' }, knob]} />
      </Animated.View>
    </Pressable>
  );
}

// RN has no text-wrap: balance. Break text longer than `oneLine` chars at the space that makes two even lines.
export function balanceLines(text: string, oneLine = 16) {
  if (text.length <= oneLine) return text;
  let best = -1, score = Infinity;
  for (let i = text.indexOf(' '); i !== -1; i = text.indexOf(' ', i + 1)) {
    const worst = Math.max(i, text.length - i - 1);
    if (worst < score) { score = worst; best = i; }
  }
  return best === -1 ? text : `${text.slice(0, best)}\n${text.slice(best + 1)}`;
}

// Type styles from the reference: Fredoka headings with tight leading, Nunito body in muted ink.
export function Heading({ children, size = 30, balance, style }: { children: string; size?: number; balance?: boolean; style?: StyleProp<TextStyle> }) {
  return (
    <Text style={[{ fontFamily: F.display, fontSize: size, lineHeight: Math.round(size * 1.15), color: C.ink, letterSpacing: -0.2 }, style]}>
      {balance ? balanceLines(children) : children}
    </Text>
  );
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[{ fontFamily: F.regular, fontSize: 16, lineHeight: 24, color: C.muted }, style]}>{children}</Text>;
}
