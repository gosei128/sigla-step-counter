import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import { CountUp, Enter } from '../../components/motion';
import { Screen, ScreenTitle } from '../../components/Screen';
import { Card, Diamond, Eyebrow, s as ui } from '../../components/ui';
import { DAYS, MONTH_STEPS, STREAK, WEEK_STEPS } from '../../data/copy';
import { useSigla } from '../../state/SiglaContext';
import { C, F, INK, PAL } from '../../theme';

const CHART_H = 150;
const TODAY = 4;

export default function StatsScreen() {
  const { steps, goal, mood } = useSigla();
  const [range, setRange] = useState<'week' | 'month'>('week');

  const week = WEEK_STEPS.map((v, i) => (i === TODAY ? steps : v));
  const logged = week.filter((v): v is number => v != null);
  const weekTotal = logged.reduce((a, b) => a + b, 0);
  const monthTotal = MONTH_STEPS.reduce((a, b) => a + b, 0);
  const isWeek = range === 'week';
  const values = isWeek ? week : MONTH_STEPS;
  const labels = isWeek ? DAYS : ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];
  const target = isWeek ? goal : goal * 7;
  const max = Math.max(target * 1.15, ...values.map(v => v ?? 0));
  const total = isWeek ? weekTotal : monthTotal;
  const avg = Math.round(isWeek ? weekTotal / logged.length : monthTotal / 28);
  const best = Math.max(...logged);
  const km = Math.round(total * 0.00075);
  const minutes = Math.round(total / 105);

  return (
    <Screen>
      <Enter i={0}>
        <ScreenTitle kicker={isWeek ? 'Oct 25 – 31' : 'October'} title="Stats" right={<Segmented value={range} onChange={setRange} />} />
      </Enter>

      <Enter i={1}>
        <Card style={{ padding: 18, gap: 16 }}>
          <View style={{ gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 7 }}>
              <CountUp value={total} style={[ui.display, { fontSize: 34, letterSpacing: -0.5 }]} />
              <Text style={[ui.muted, { fontSize: 14 }]}>steps</Text>
            </View>
            <Text style={ui.muted}>{avg.toLocaleString()} a day on average</Text>
          </View>
          <View style={{ height: CHART_H + 22 }}>
            <View style={[st.goalLine, { bottom: 22 + (target / max) * CHART_H }]}>
              <Text style={st.goalLabel}>goal</Text>
            </View>
            <View style={st.bars}>
              {values.map((v, i) => {
                const hit = v != null && v >= target;
                const today = isWeek && i === TODAY;
                const color = v == null ? C.track : today ? (mood === 'idle' ? INK : PAL[mood].main) : hit ? PAL.goal.main : PAL.walking.main;
                return (
                  <View key={`${range}-${i}`} style={st.barCol}>
                    <Bar h={v == null ? 6 : Math.max(6, (v / max) * CHART_H)} color={color} delay={i * 55} />
                    <Text style={[st.barLabel, today && { color: INK, fontFamily: F.heavy }]}>{labels[i]}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>
      </Enter>

      <View style={st.grid}>
        <Tile i={2} label="Daily average" value={avg} unit="steps" />
        <Tile i={3} label={isWeek ? 'Best day' : 'Best week'} value={isWeek ? best : Math.max(...MONTH_STEPS)} unit="steps" />
        <Tile i={4} label="Distance" value={km} unit="km" />
        <Tile i={5} label="Active time" value={minutes} unit="min" />
      </View>

      <Enter i={6}>
        <Card style={st.streak}>
          <View style={st.streakIcon}><Diamond size={18} radius={4} color={C.shard} /></View>
          <View style={{ flex: 1, gap: 2 }}>
            <Eyebrow>Streak</Eyebrow>
            <Text style={[ui.display, { fontSize: 19 }]}>{STREAK.current} days and counting</Text>
            <Text style={ui.muted}>{STREAK.best - STREAK.current} more to beat your best of {STREAK.best}.</Text>
          </View>
        </Card>
      </Enter>
    </Screen>
  );
}

function Bar({ h, color, delay }: { h: number; color: string; delay: number }) {
  const { animations } = useSigla();
  const v = useSharedValue(animations ? 0 : h);
  useEffect(() => {
    v.value = animations ? withDelay(delay, withSpring(h, { damping: 15, stiffness: 140 })) : h;
  }, [h, delay, animations, v]);
  const st = useAnimatedStyle(() => ({ height: Math.max(0, v.value) }));
  return <Animated.View style={[{ width: '62%', maxWidth: 26, borderRadius: 8, backgroundColor: color }, st]} />;
}

function Tile({ i, label, value, unit }: { i: number; label: string; value: number; unit: string }) {
  return (
    <Enter i={i} style={{ flexBasis: '40%', flexGrow: 1 }}>
      <Card style={{ padding: 16, gap: 6 }}>
        <Eyebrow>{label}</Eyebrow>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
          <CountUp value={value} style={[ui.display, { fontSize: 24 }]} />
          <Text style={[ui.muted, { fontSize: 12 }]}>{unit}</Text>
        </View>
      </Card>
    </Enter>
  );
}

function Segmented({ value, onChange }: { value: 'week' | 'month'; onChange: (v: 'week' | 'month') => void }) {
  const x = useSharedValue(value === 'week' ? 0 : 1);
  useEffect(() => {
    x.value = withTiming(value === 'week' ? 0 : 1, { duration: 260, easing: Easing.out(Easing.cubic) });
  }, [value, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 64 }] }));
  return (
    <View style={st.seg}>
      <Animated.View style={[st.segPill, pill]} />
      {(['week', 'month'] as const).map(k => (
        <Pressable key={k} onPress={() => onChange(k)} style={st.segBtn} accessibilityRole="tab" accessibilityState={{ selected: value === k }}>
          <Text style={{ fontFamily: F.bold, fontSize: 12, color: value === k ? C.bg : C.body }}>{k === 'week' ? 'Week' : 'Month'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  goalLine: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: C.dash },
  goalLabel: { position: 'absolute', right: 0, top: -16, fontFamily: F.bold, fontSize: 10, color: C.faint },
  bars: { position: 'absolute', left: 0, right: 0, bottom: 0, height: CHART_H + 22, flexDirection: 'row', alignItems: 'flex-end' },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barLabel: { fontFamily: F.bold, fontSize: 11, color: C.faint, height: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  streak: { paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', gap: 14, alignItems: 'center' },
  streakIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.shardSoft, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', padding: 4, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(42,37,33,0.08)' },
  segPill: { position: 'absolute', top: 4, left: 4, width: 64, bottom: 4, borderRadius: 999, backgroundColor: INK },
  segBtn: { width: 64, paddingVertical: 7, alignItems: 'center' },
});
