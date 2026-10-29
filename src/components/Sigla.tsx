import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSigla } from '../state/SiglaContext';
import { INK, PAL, type Mood } from '../theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Path for a CSS-style elliptical border-radius: `tl tr br bl / tl tr br bl`, as fractions.
export function blobPath(w: number, h: number, rx: number[], ry: number[]) {
  'worklet';
  const [a, b, c, d] = rx.map(r => r * w);
  const [e, f, g, k] = ry.map(r => r * h);
  return `M0 ${e}A${a} ${e} 0 0 1 ${a} 0L${w - b} 0A${b} ${f} 0 0 1 ${w} ${f}L${w} ${h - g}A${c} ${g} 0 0 1 ${w - c} ${h}L${d} ${h}A${d} ${k} 0 0 1 0 ${h - k}Z`;
}

function useTimed<T extends number | string>(v: T, duration = 600): SharedValue<T> {
  const sv = useSharedValue(v);
  useEffect(() => {
    sv.value = withTiming(v, { duration }) as T;
  }, [v, duration, sv]);
  return sv;
}

function useLoop(on: boolean, duration: number) {
  const p = useSharedValue(0);
  useEffect(() => {
    if (on) {
      p.value = 0;
      p.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false);
    } else {
      cancelAnimation(p);
      p.value = 0;
    }
  }, [on, duration, p]);
  return p;
}

const LOOP_MS: Record<Mood, number> = { idle: 4500, walking: 2200, goal: 900 };

const SPARKS: [number, number, number, number, string][] = [
  [4, 30, 0.07, 0, PAL.goal.main], [90, 22, 0.06, 0.5, PAL.walking.main], [14, 4, 0.05, 1.0, PAL.walking.main],
  [80, 0, 0.075, 0.3, PAL.goal.main], [-2, 60, 0.045, 1.3, PAL.goal.deep], [100, 56, 0.05, 0.8, PAL.goal.main],
];

type Props = { mood: Mood; size: number; still?: boolean; id?: string; animate?: boolean };

export function Sigla({ mood, size: s, still, id, animate }: Props) {
  const { poke, burst, animations } = useSigla();
  const [pressed, setPressed] = useState(false);
  const c = PAL[mood];
  const idle = mood === 'idle';
  const animOn = (animate ?? animations) && !still && !pressed;

  const bw = useTimed(idle ? s * 1.04 : s * 0.92);
  const bh = useTimed(idle ? s * 0.68 : s * 0.86);
  const rxB = useTimed(idle ? 0.42 : 0.45);
  const ryT = useTimed(idle ? 0.64 : 0.58);
  const eyeTopF = useTimed(idle ? 0.44 : 0.36, 500);
  const ewT = idle ? s * 0.1 : s * (mood === 'goal' ? 0.09 : 0.08);
  const ew = useTimed(ewT, 500);
  const eh = useTimed(idle || pressed ? Math.max(2.5, s * 0.024) : ewT, 500);
  const cheekOp = useTimed(idle ? 0 : 0.28);
  const press = useSharedValue(0);
  const boing = useSharedValue(1);

  const clock = useLoop(animOn, LOOP_MS[mood]);
  const blink = useLoop(animOn && !idle, 5000);

  useEffect(() => {
    press.value = withTiming(pressed ? 1 : 0, { duration: 120, easing: Easing.out(Easing.quad) });
  }, [pressed, press]);

  const bodyProps = useAnimatedProps(() => ({
    d: blobPath(bw.value, bh.value, [0.5, 0.5, rxB.value, rxB.value], [ryT.value, ryT.value, 1 - ryT.value, 1 - ryT.value]),
  }));

  const bodyStyle = useAnimatedStyle(() => {
    const p = clock.value;
    const e = (1 - Math.cos(2 * Math.PI * p)) / 2;
    let sx = 1, sy = 1, ty = 0;
    if (mood === 'idle') { sx = 1 + 0.025 * e; sy = 1 - 0.045 * e; }
    else if (mood === 'walking') { ty = -0.06 * bh.value * e; }
    else if (animOn) {
      const st = [0, 0.35, 0.6, 1];
      ty = interpolate(p, st, [0, -0.16, -0.12, 0]) * bh.value;
      sx = interpolate(p, st, [1.05, 0.96, 0.98, 1.05]);
      sy = interpolate(p, st, [0.93, 1.05, 1.02, 0.93]);
    }
    const k = press.value;
    return {
      width: bw.value,
      height: bh.value,
      transform: [{ translateY: ty * (1 - k) }, { scaleX: sx + (1.16 - sx) * k }, { scaleY: sy + (0.72 - sy) * k }],
    };
  });

  const boingStyle = useAnimatedStyle(() => {
    const p = boing.value, st = [0, 0.3, 0.55, 0.75, 1];
    return {
      transform: [
        { translateY: interpolate(p, st, [0, -0.1, 0, 0, 0]) * bh.value },
        { scaleX: interpolate(p, st, [1.16, 0.88, 1.07, 0.97, 1]) },
        { scaleY: interpolate(p, st, [0.72, 1.16, 0.94, 1.03, 1]) },
      ],
    };
  });

  const hlStyle = useAnimatedStyle(() => ({
    top: bh.value * 0.13, left: bw.value * 0.2, width: bw.value * 0.17, height: bh.value * 0.1,
  }));

  const eyesStyle = useAnimatedStyle(() => {
    const p = blink.value;
    return {
      top: bh.value * eyeTopF.value,
      height: eh.value,
      transform: [{ scaleY: p < 0.92 ? 1 : interpolate(p, [0.92, 0.95, 1], [1, 0.1, 1]) }],
    };
  });
  const eyeL = useAnimatedStyle(() => ({ left: bw.value / 2 - s * 0.14 - ew.value / 2, width: ew.value }));
  const eyeR = useAnimatedStyle(() => ({ left: bw.value / 2 + s * 0.14 - ew.value / 2, width: ew.value }));

  const cheeksStyle = useAnimatedStyle(() => ({ top: bh.value * eyeTopF.value + s * 0.1, opacity: cheekOp.value }));
  const cheekL = useAnimatedStyle(() => ({ left: bw.value / 2 - s * 0.25 - s * 0.055 }));
  const cheekR = useAnimatedStyle(() => ({ left: bw.value / 2 + s * 0.25 - s * 0.055 }));

  const mouthStyle = useAnimatedStyle(() => ({ top: bh.value * eyeTopF.value + s * (idle ? 0.09 : 0.11) }));
  const shadowStyle = useAnimatedStyle(() => ({ width: bw.value * 0.7, left: (s * 1.2 - bw.value * 0.7) / 2 }));

  const sw = Math.max(2, s * 0.022);
  const mouth = idle ? (
    <View style={{ width: s * 0.07, height: Math.max(2, s * 0.018), backgroundColor: INK, borderRadius: 2, opacity: 0.7 }} />
  ) : mood === 'walking' ? (
    <Svg width={s * 0.12} height={s * 0.055}>
      <Path
        d={`M${sw / 2} 0A${(s * 0.12 - sw) / 2} ${s * 0.055 - sw / 2} 0 0 0 ${s * 0.12 - sw / 2} 0`}
        stroke={INK} strokeWidth={sw} fill="none" strokeLinecap="round"
      />
    </Svg>
  ) : (
    <View style={{ width: s * 0.15, height: s * 0.08, backgroundColor: INK, borderBottomLeftRadius: s * 0.075, borderBottomRightRadius: s * 0.075 }} />
  );

  const bursting = !!id && burst === id;
  const sparks = (mood === 'goal' || bursting) && s > 60;
  const maxW = s * 1.04, maxH = s * 0.86;

  const box = (
    <View pointerEvents={id ? 'none' : 'auto'} style={{ width: s * 1.2, height: s * 1.08, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Animated.View style={[{ position: 'absolute', bottom: 0, height: s * 0.06, borderRadius: 999, backgroundColor: 'rgba(42,37,33,0.09)' }, shadowStyle]} />
      <Animated.View style={[{ marginBottom: s * 0.04, transformOrigin: 'bottom' }, boingStyle]}>
        <Animated.View style={[{ transformOrigin: 'bottom' }, bodyStyle]}>
          <Svg width={maxW} height={maxH} style={{ position: 'absolute', left: 0, top: 0 }}>
            <AnimatedPath animatedProps={bodyProps} fill={c.main} />
          </Svg>
          <Animated.View style={[{ position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.4)', transform: [{ rotate: '-22deg' }] }, hlStyle]} />
          {[eyeL, eyeR].map((st, i) => (
            <Animated.View key={i} style={[{ position: 'absolute', borderRadius: 999, backgroundColor: INK }, eyesStyle, st]} />
          ))}
          {[cheekL, cheekR].map((st, i) => (
            <Animated.View key={i} style={[{ position: 'absolute', width: s * 0.11, height: s * 0.05, borderRadius: 999, backgroundColor: c.deep }, cheeksStyle, st]} />
          ))}
          <Animated.View style={[{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }, mouthStyle]}>{mouth}</Animated.View>
        </Animated.View>
      </Animated.View>
      {sparks && SPARKS.map(([x, y, z, dl, col], i) => (
        <Spark key={i} x={x} y={y} size={s * z} delay={dl} color={col} on={animOn} />
      ))}
    </View>
  );

  if (!id) return box;
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => {
        setPressed(false);
        boing.set(0);
        boing.set(withTiming(1, { duration: 650, easing: Easing.out(Easing.quad) }));
        poke(id, mood);
      }}
    >
      {box}
    </Pressable>
  );
}

function Spark({ x, y, size, delay, color, on }: { x: number; y: number; size: number; delay: number; color: string; on: boolean }) {
  const p = useSharedValue(on ? 0 : 0.3);
  useEffect(() => {
    if (!on) { cancelAnimation(p); p.value = 0.3; return; }
    p.value = 0;
    p.value = withDelay(delay * 1000, withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1, false));
  }, [on, delay, p]);
  const st = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.3, 1], [0, 1, 0]),
    transform: [
      { translateY: interpolate(p.value, [0, 0.3, 1], [0, 0, -16]) },
      { scale: interpolate(p.value, [0, 0.3, 1], [0.3, 1, 0.5]) },
      { rotate: '45deg' },
    ],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: 2, backgroundColor: color }, st]}
    />
  );
}
