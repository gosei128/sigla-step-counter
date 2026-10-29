import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GoalPicker } from '../../components/GoalPicker';
import { Enter, PressScale, Toggle } from '../../components/motion';
import { Screen, ScreenTitle } from '../../components/Screen';
import { Sigla } from '../../components/Sigla';
import { Card, Eyebrow, s as ui } from '../../components/ui';
import { useSigla } from '../../state/SiglaContext';
import { C, F, PAL } from '../../theme';

export default function SettingsScreen() {
  const { goal, setGoal, mood, animations, setAnimations, reminders, setReminders, resetOnboarding } = useSigla();
  const accent = PAL.goal.main;

  return (
    <Screen>
      <Enter i={0}><ScreenTitle kicker="Sigla 1.0" title="Settings" /></Enter>

      <Enter i={1}>
        <Card style={{ padding: 18, gap: 14 }}>
          <View style={{ gap: 2 }}>
            <Eyebrow>Daily goal</Eyebrow>
            <Text style={ui.muted}>{"How far we go each day. Sigla's mood follows it."}</Text>
          </View>
          <GoalPicker value={goal} onChange={setGoal} />
        </Card>
      </Enter>

      <Enter i={2}>
        <Card style={{ paddingHorizontal: 18 }}>
          <Row title="Evening nudge" sub="A reminder at 6pm if we're behind.">
            <Toggle value={reminders} onChange={setReminders} color={accent} />
          </Row>
          <View style={st.divider} />
          <Row title="Animations" sub="Sigla bounces, blinks and sparkles.">
            <Toggle value={animations} onChange={setAnimations} color={accent} />
          </Row>
        </Card>
      </Enter>

      <Enter i={3}>
        <Card style={{ padding: 18, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.onDevice }} />
            <Eyebrow>Privacy</Eyebrow>
          </View>
          <Text style={st.rowTitle}>Everything stays on this phone.</Text>
          <Text style={ui.muted}>No account, no cloud, no signal needed. Deleting the app deletes your steps.</Text>
        </Card>
      </Enter>

      <Enter i={4}>
        <Card style={{ paddingHorizontal: 18 }}>
          <PressScale onPress={resetOnboarding} to={0.98} style={st.link}>
            <Text style={st.rowTitle}>Replay the intro</Text>
            <Text style={st.chev}>›</Text>
          </PressScale>
          <View style={st.divider} />
          <View style={st.link}>
            <Text style={st.rowTitle}>Version</Text>
            <Text style={ui.muted}>1.0.0</Text>
          </View>
        </Card>
      </Enter>

      <Enter i={5} style={{ alignItems: 'center', paddingTop: 8, gap: 4 }}>
        <Sigla mood={mood} size={56} />
        <Text style={[ui.muted, { fontSize: 12 }]}>Made with lots of little steps.</Text>
      </Enter>
    </Screen>
  );
}

function Row({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <View style={st.row}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={st.rowTitle}>{title}</Text>
        <Text style={[ui.muted, { fontSize: 12 }]}>{sub}</Text>
      </View>
      {children}
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
  rowTitle: { fontFamily: F.displayMed, fontSize: 17, color: C.ink },
  divider: { height: 1, backgroundColor: C.track },
  link: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  chev: { fontFamily: F.display, fontSize: 22, color: C.faint, lineHeight: 22 },
});
