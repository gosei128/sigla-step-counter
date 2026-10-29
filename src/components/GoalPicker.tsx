import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GOALS } from '../data/copy';
import { useSigla } from '../state/SiglaContext';
import { C, F, PAL } from '../theme';
import { PressScale } from './motion';

export function GoalPicker({ value, onChange }: { value: number; onChange: (g: number) => void }) {
  const { animations } = useSigla();
  return (
    <View style={st.row}>
      {GOALS.map(([g, sub], i) => {
        const on = value === g;
        return (
          <Animated.View key={g} style={{ flex: 1 }} entering={animations ? FadeInDown.delay(i * 60).duration(320) : undefined}>
            <PressScale
              onPress={() => onChange(g)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={[st.btn, { backgroundColor: on ? PAL.walking.soft : '#fff', borderColor: on ? PAL.walking.main : C.goalBorder }]}
            >
              <Text style={[st.num, { color: on ? PAL.walking.deep : C.body }]}>{g.toLocaleString()}</Text>
              <Text style={[st.sub, { color: on ? PAL.walking.deep : C.body }]}>{sub}</Text>
            </PressScale>
          </Animated.View>
        );
      })}
    </View>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  btn: { paddingVertical: 14, borderRadius: 16, borderWidth: 2, alignItems: 'center', gap: 2 },
  num: { fontFamily: F.display, fontSize: 18 },
  sub: { fontFamily: F.bold, fontSize: 11, opacity: 0.7 },
});
