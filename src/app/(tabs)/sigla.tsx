import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Enter } from '../../components/motion';
import { Screen } from '../../components/Screen';
import { Sigla } from '../../components/Sigla';
import { Blob, Card, Eyebrow, Halo, ProgressBar, s as ui } from '../../components/ui';
import { DAYS, EVO_LINE } from '../../data/copy';
import { useSigla } from '../../state/SiglaContext';
import { C, F, INK, PAL, type Mood } from '../../theme';

const TEAL = PAL.goal.main;

export default function EvolutionScreen() {
  const { mood, reply, burst, animations } = useSigla();
  const c = PAL[mood];
  const quote = burst === 'evo' && reply ? reply : EVO_LINE;
  const wm: (Mood | null)[] = ['goal', 'walking', 'goal', 'idle', mood, null, null];

  return (
    <Screen gap={10} top={4}>
      <Enter i={0} style={{ gap: 1 }}>
        <Text style={ui.muted}>Stage 2 of 4 · Sprout</Text>
        <Text style={ui.title}>Sigla</Text>
      </Enter>

      <Enter i={1} style={st.stage}>
        <Halo size={166} color={c.soft} style={{ top: 0, alignSelf: 'center' }} />
        <Sigla mood={mood} size={118} id="evo" />
      </Enter>

      <Enter i={2}>
      <Card style={{ padding: 18, gap: 12 }}>
        <View style={st.rowBase}>
          <Text style={[ui.display, { fontSize: 19 }]}>Next: Bloom</Text>
          <Text style={{ fontFamily: F.bold, fontSize: 13, color: C.evoPct }}>76%</Text>
        </View>
        <ProgressBar pct={76} color={TEAL} />
        <View style={st.rowBase}>
          <Text style={ui.muted}>38,200 / 50,000 steps</Text>
          <Text style={ui.muted}>~2 days at your pace</Text>
        </View>
        <Animated.Text key={quote} entering={animations ? FadeIn.duration(260) : undefined} style={st.quote}>“{quote}”</Animated.Text>
      </Card>
      </Enter>

      <Enter i={3}>
      <Card style={{ paddingVertical: 18, paddingHorizontal: 16, gap: 14 }}>
        <Eyebrow style={{ paddingLeft: 2 }}>Evolution path</Eyebrow>
        <View style={st.path}>
          <View style={[st.line, { left: '12.5%', right: '12.5%', backgroundColor: C.track }]} />
          <View style={[st.line, { left: '12.5%', width: '25%', backgroundColor: TEAL }]} />
          <Stage label="Wisp">
            <View style={[st.node, { backgroundColor: C.well, borderWidth: 2, borderColor: '#fff' }]}>
              <Sigla mood="walking" size={30} still />
            </View>
          </Stage>
          <Stage label="Sprout">
            <View style={[st.node, { backgroundColor: c.soft, borderWidth: 3, borderColor: TEAL }]}>
              <Sigla mood={mood} size={38} still />
            </View>
          </Stage>
          <Stage label="Bloom" locked><Locked /></Stage>
          <Stage label="???" locked><Locked /></Stage>
        </View>
      </Card>
      </Enter>

      <Enter i={4}>
      <Card style={{ paddingVertical: 16, paddingHorizontal: 18, gap: 12 }}>
        <Eyebrow>My week</Eyebrow>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {DAYS.map((l, i) => (
            <View key={i} style={{ alignItems: 'center', gap: 6 }}>
              <Blob w={26} h={22} color={wm[i] ? PAL[wm[i]!].main : C.track} />
              <Text style={{ fontFamily: F.bold, fontSize: 11, color: i === 4 ? INK : C.faint }}>{l}</Text>
            </View>
          ))}
        </View>
      </Card>
      </Enter>
    </Screen>
  );
}

function Stage({ label, locked, children }: { label: string; locked?: boolean; children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      {children}
      <Text style={{ fontSize: 12, fontFamily: locked ? F.semi : F.bold, color: locked ? C.faint : C.ink }}>{label}</Text>
    </View>
  );
}

function Locked() {
  return (
    <View style={[st.node, { backgroundColor: C.well, borderWidth: 2, borderStyle: 'dashed', borderColor: C.dash }]}>
      <Text style={{ fontFamily: F.displayMed, fontSize: 20, color: C.qmark }}>?</Text>
    </View>
  );
}

const st = StyleSheet.create({
  stage: { height: 166, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 2 },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  quote: { fontFamily: F.displayMed, fontSize: 16, lineHeight: 21.6, color: C.ink, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, overflow: 'hidden', backgroundColor: C.well },
  path: { flexDirection: 'row', alignItems: 'flex-start' },
  line: { position: 'absolute', top: 27, height: 3, borderRadius: 2 },
  node: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
