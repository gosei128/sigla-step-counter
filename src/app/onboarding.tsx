import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInLeft, FadeInRight, FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoalPicker } from '../components/GoalPicker';
import { Body, Heading } from '../components/motion';
import { Sigla } from '../components/Sigla';
import { Halo } from '../components/ui';
import { OB } from '../data/copy';
import { useSigla } from '../state/SiglaContext';
import { C, F, INK, PAL } from '../theme';

export default function Onboarding() {
  const { goal: savedGoal, finishOnboarding, animations } = useSigla();
  const insets = useSafeAreaInsets();
  const [{ step, forward }, setNav] = useState({ step: 0, forward: true });
  const [goal, setGoal] = useState(savedGoal);
  const o = OB[step];
  const last = step === OB.length - 1;
  const go = (n: number) => setNav({ step: n, forward: n >= step });

  // Slide text in from the side we're moving toward.
  const enter = animations ? (forward ? FadeInRight : FadeInLeft).duration(360) : undefined;
  const exit = animations ? FadeOut.duration(140) : undefined;

  return (
    <View style={[st.screen, { paddingTop: insets.top }]}>
      <View style={st.topBar}>
        <Pressable disabled={step === 0} onPress={() => go(Math.max(0, step - 1))} style={{ opacity: step === 0 ? 0 : 1 }}>
          <Text style={st.topBtn}>Back</Text>
        </Pressable>
        <Pressable onPress={() => go(OB.length - 1)}>
          <Text style={st.topBtn}>Skip</Text>
        </Pressable>
      </View>

      <View style={st.stage}>
        <Halo size={280} color={PAL[o.mood].soft} style={{ alignSelf: 'center', top: '50%', marginTop: -150 }} />
        <Animated.View style={{ marginTop: 40 }} entering={animations ? FadeIn.duration(600) : undefined}>
          <Sigla mood={o.mood} size={170} id="ob" />
        </Animated.View>
      </View>

      <View style={[st.bottom, { paddingBottom: Math.max(insets.bottom, 12) + 28 }]}>
        <View style={st.dots}>
          {OB.map((_, i) => <Dot key={i} active={i === step} />)}
        </View>
        <Animated.View key={step} entering={enter} exiting={exit} style={{ gap: 10, flex: 1 }}>
          <Heading size={30} balance style={{ textAlign: 'center' }}>{o.title}</Heading>
          <Body style={{ textAlign: 'center' }}>{o.body}</Body>
          {step === 1 && <View style={{ marginTop: 10 }}><GoalPicker value={goal} onChange={setGoal} /></View>}
        </Animated.View>
        <Pressable onPress={() => (last ? finishOnboarding(goal) : go(step + 1))}>
          {({ pressed }) => (
            <View style={[st.cta, pressed && st.ctaPressed]}>
              <Animated.Text key={o.cta} entering={animations ? FadeIn.duration(250) : undefined} style={st.ctaText}>{o.cta}</Animated.Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const w = useSharedValue(active ? 22 : 7);
  useEffect(() => {
    w.value = withTiming(active ? 22 : 7, { duration: 300 });
  }, [active, w]);
  const style = useAnimatedStyle(() => ({ width: w.value }));
  return <Animated.View style={[{ height: 7, borderRadius: 999, backgroundColor: active ? INK : C.dash }, style]} />;
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  topBar: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  topBtn: { fontFamily: F.bold, fontSize: 15, color: C.muted, paddingVertical: 8 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { paddingHorizontal: 28, gap: 22, minHeight: 330 },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  cta: {
    height: 58, borderRadius: 20, backgroundColor: INK, alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 0 #5C544E',
  },
  ctaPressed: { transform: [{ translateY: 3 }], boxShadow: '0 1px 0 #5C544E' },
  ctaText: { fontFamily: F.bold, fontSize: 17, color: C.bg },
});
