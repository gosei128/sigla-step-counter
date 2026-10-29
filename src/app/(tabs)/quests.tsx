import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Enter, PressScale } from '../../components/motion';
import { Screen, ScreenTitle } from '../../components/Screen';
import { Sigla } from '../../components/Sigla';
import { Card, Diamond, Eyebrow, ProgressBar, s as ui } from '../../components/ui';
import { DAILY_QUESTS, LEVEL, WEEKLY_QUESTS, type Quest } from '../../data/copy';
import { useSigla } from '../../state/SiglaContext';
import { C, F, PAL } from '../../theme';

export default function QuestsScreen() {
  const { mood, goal, steps } = useSigla();
  const goalQuest: Quest = { id: 'goal', title: 'Hit your daily goal.', done: Math.min(steps, goal), total: goal, unit: 'steps', xp: 80, note: 'ends midnight' };
  const daily = [DAILY_QUESTS[0], goalQuest, ...DAILY_QUESTS.slice(1)];
  const open = daily.filter(q => q.done < q.total).length;
  let i = 0;

  return (
    <Screen>
      <Enter i={i++}>
        <ScreenTitle
          kicker={`${open} open · resets in 9h`}
          title="Quests"
          right={
            <View style={st.shards}>
              <Diamond size={9} radius={2} color={C.shard} />
              <Text style={{ fontFamily: F.bold, fontSize: 14, color: C.shardInk }}>12</Text>
            </View>
          }
        />
      </Enter>

      <Enter i={i++}>
        <Card style={st.level}>
          <View style={[st.levelMascot, { backgroundColor: PAL[mood].soft }]}>
            <Sigla mood={mood} size={40} still />
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <View style={st.rowBase}>
              <Text style={[ui.display, { fontSize: 19 }]}>Level {LEVEL.level}</Text>
              <Text style={ui.muted}>{LEVEL.xp} / {LEVEL.next} XP</Text>
            </View>
            <ProgressBar pct={(LEVEL.xp / LEVEL.next) * 100} color={PAL.walking.main} />
            <Text style={[ui.muted, { fontSize: 12 }]}>160 XP until Sigla finds a new shard spot.</Text>
          </View>
        </Card>
      </Enter>

      <Enter i={i++}><Eyebrow style={st.section}>Today</Eyebrow></Enter>
      {daily.map(q => <Enter key={q.id} i={i++}><QuestCard q={q} /></Enter>)}

      <Enter i={i++}><Eyebrow style={st.section}>This week</Eyebrow></Enter>
      {WEEKLY_QUESTS.map(q => <Enter key={q.id} i={i++}><QuestCard q={q} weekly /></Enter>)}
    </Screen>
  );
}

function QuestCard({ q, weekly }: { q: Quest; weekly?: boolean }) {
  const done = q.done >= q.total;
  const [open, setOpen] = useState(false);
  const accent = weekly ? PAL.goal : PAL.walking;
  return (
    <PressScale onPress={() => setOpen(o => !o)} to={0.98} style={[ui.card as object, st.quest, done && { opacity: 0.75 }]}>
      <View style={[st.icon, { backgroundColor: done ? PAL.goal.soft : accent.soft }]}>
        {done ? (
          <Animated.View entering={ZoomIn.springify().damping(12)} style={st.check}>
            <View style={st.checkMark} />
          </Animated.View>
        ) : (
          <Diamond size={16} radius={4} color={weekly ? accent.main : C.shard} />
        )}
      </View>
      <View style={{ flex: 1, gap: 8, minWidth: 0 }}>
        <View style={[st.rowBase, { alignItems: 'flex-start', gap: 10 }]}>
          <Text style={[st.title, done && { textDecorationLine: 'line-through', color: C.muted }]}>{q.title}</Text>
          <Text style={st.xp}>+{q.xp} XP</Text>
        </View>
        {!done && <ProgressBar pct={(q.done / q.total) * 100} color={accent.main} />}
        <Text style={[ui.muted, { fontSize: 12 }]}>
          {done ? 'Completed · shard collected' : `${q.done.toLocaleString()} / ${q.total.toLocaleString()} ${q.unit} · ${q.note}`}
        </Text>
        {open && !done && (
          <Animated.Text entering={ZoomIn.duration(220)} style={st.tip}>
            {weekly ? 'Steady days count more than big ones. I keep track for you.' : "Tap me on Home if you need a pep talk."}
          </Animated.Text>
        )}
      </View>
    </PressScale>
  );
}

const st = StyleSheet.create({
  shards: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, backgroundColor: C.shardSoft },
  level: { padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' },
  levelMascot: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  section: { marginTop: 8, paddingLeft: 4 },
  quest: { paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  check: { width: 22, height: 22, borderRadius: 11, backgroundColor: PAL.goal.main, alignItems: 'center', justifyContent: 'center' },
  checkMark: { width: 10, height: 6, borderLeftWidth: 2.5, borderBottomWidth: 2.5, borderColor: '#fff', transform: [{ rotate: '-45deg' }, { translateY: -1 }] },
  title: { flex: 1, fontFamily: F.displayMed, fontSize: 17, lineHeight: 22, color: C.ink },
  xp: { fontFamily: F.bold, fontSize: 12, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999, overflow: 'hidden', backgroundColor: C.chip, color: C.body },
  tip: { fontFamily: F.displayMed, fontSize: 14, lineHeight: 19, color: C.ink, padding: 10, borderRadius: 12, overflow: 'hidden', backgroundColor: C.well },
});
