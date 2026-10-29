import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { balanceLines, CountUp, Enter } from '../../components/motion';
import { Screen } from '../../components/Screen';
import { Sigla } from '../../components/Sigla';
import { Card, Diamond, Eyebrow, Halo, ProgressBar, s as ui } from '../../components/ui';
import { DATA, DAYS, homeLine } from '../../data/copy';
import { useSigla } from '../../state/SiglaContext';
import { C, F, INK, PAL, type Mood } from '../../theme';

const WK_DONE = [1, 1, 1, 1, 0, 0, 0];
const TODAY = 4;

export default function HomeScreen() {
  const { mood, steps, goal, reply, burst, animations } = useSigla();
  const c = PAL[mood];
  const pct = Math.min(100, Math.round((steps / goal) * 100));
  const line = burst === 'home' && reply ? reply : homeLine(mood, steps, goal);
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Screen>
      {__DEV__ && <MoodSwitcher />}
      <Enter i={0} style={st.header}>
        <View style={{ gap: 1 }}>
          <Text style={ui.muted}>{date}</Text>
          <Text style={ui.title}>Today</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <View style={st.pill}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.onDevice }} />
            <Text style={st.pillText}>On device</Text>
          </View>
          <View style={[st.pill, { backgroundColor: C.shardSoft, borderWidth: 0, gap: 7, paddingHorizontal: 12 }]}>
            <Diamond size={9} radius={2} color={C.shard} />
            <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.shardInk }}>12</Text>
          </View>
        </View>
      </Enter>

      <Enter i={1} style={st.stage}>
        <Halo size={250} color={c.soft} style={{ top: 8, alignSelf: 'center' }} />
        <Sigla mood={mood} size={168} id="home" />
        <Animated.View key={line} entering={animations ? ZoomIn.springify().damping(14).stiffness(220) : undefined} style={st.bubble}>
          <View style={st.bubbleTip} />
          <Text style={st.bubbleText}>{balanceLines(line, 28)}</Text>
        </Animated.View>
      </Enter>

      <Enter i={2}>
      <Card style={{ paddingVertical: 16, paddingHorizontal: 18, gap: 12 }}>
        <View style={st.rowBase}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 7 }}>
            <CountUp value={steps} style={[ui.display, { fontSize: 34, letterSpacing: -0.5 }]} />
            <Text style={[ui.muted, { fontSize: 14 }]}>/ {goal.toLocaleString()} steps</Text>
          </View>
          <Text style={{ fontFamily: F.bold, fontSize: 13, color: c.deep }}>{pct}%</Text>
        </View>
        <ProgressBar pct={pct} color={c.main} />
        <View style={[st.rowBase, { alignItems: 'center', paddingTop: 2 }]}>
          <Text style={ui.muted}>12-day streak</Text>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {DAYS.map((l, i) => {
              const today = i === TODAY;
              const bg = WK_DONE[i] ? PAL.walking.main : today ? (mood === 'goal' ? PAL.walking.main : '#fff') : C.track;
              return (
                <View key={i} style={{ alignItems: 'center', gap: 3 }}>
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: bg, borderWidth: today && mood !== 'goal' ? 2 : 0, borderColor: PAL.walking.main }} />
                  <Text style={{ fontFamily: F.bold, fontSize: 9, color: C.faint }}>{l}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Card>
      </Enter>

      <Enter i={3}>
      <Card style={{ paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
        <View style={st.questIcon}><Diamond size={16} radius={4} color={C.shard} /></View>
        <View style={{ flex: 1, gap: 6, minWidth: 0 }}>
          <View style={[st.rowBase, { alignItems: 'center' }]}>
            <Eyebrow>Daily quest</Eyebrow>
            <Text style={st.xp}>+50 XP</Text>
          </View>
          <Text style={{ fontFamily: F.displayMed, fontSize: 17, lineHeight: 22, color: C.ink }}>
            {"Walk before 9am and I'll dig up a bonus shard."}
          </Text>
          <Text style={[ui.muted, { fontSize: 12 }]}>620 / 1,000 steps · ends 9:00</Text>
        </View>
      </Card>
      </Enter>
    </Screen>
  );
}

// Dev-only: preview each mood with mock step counts, like the design canvas switcher.
function MoodSwitcher() {
  const { mood, setMoodPreview } = useSigla();
  return (
    <View style={st.switcher}>
      {(Object.keys(DATA) as Mood[]).map(k => (
        <Pressable key={k} onPress={() => setMoodPreview(k)} style={[st.switchBtn, k === mood && { backgroundColor: INK }]}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: PAL[k].main }} />
          <Text style={{ fontFamily: F.bold, fontSize: 12, color: k === mood ? C.bg : C.body }}>{DATA[k].label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(42,37,33,0.07)' },
  pillText: { fontFamily: F.semi, fontSize: 12, color: C.muted },
  stage: { height: 300, alignItems: 'center', justifyContent: 'flex-end', gap: 14 },
  bubble: { maxWidth: 300, backgroundColor: '#fff', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  bubbleTip: { position: 'absolute', top: -6, alignSelf: 'center', width: 12, height: 12, backgroundColor: '#fff', transform: [{ rotate: '45deg' }], borderLeftWidth: 1, borderTopWidth: 1, borderColor: C.border },
  bubbleText: { fontFamily: F.displayMed, fontSize: 18, lineHeight: 23, color: C.ink, textAlign: 'center' },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  questIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.shardSoft, alignItems: 'center', justifyContent: 'center' },
  xp: { fontFamily: F.bold, fontSize: 12, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999, overflow: 'hidden', backgroundColor: C.chip, color: C.body },
  switcher: { flexDirection: 'row', gap: 6, padding: 4, backgroundColor: '#fff', borderRadius: 999, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(42,37,33,0.08)' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999 },
});
