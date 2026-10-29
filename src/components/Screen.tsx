import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { useFocusKey } from './motion';
import { s as ui } from './ui';

// Scrollable tab screen. Content remounts on refocus so its entering animations replay.
export function Screen({ children, gap = 12, top = 6 }: { children: ReactNode; gap?: number; top?: number }) {
  const insets = useSafeAreaInsets();
  const key = useFocusKey();
  return (
    <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + top, paddingHorizontal: 20, paddingBottom: 24 }}>
      <View key={key} style={{ gap }}>{children}</View>
    </ScrollView>
  );
}

export function ScreenTitle({ kicker, title, right }: { kicker: string; title: string; right?: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ gap: 1 }}>
        <Text style={ui.muted}>{kicker}</Text>
        <Text style={ui.title}>{title}</Text>
      </View>
      {right}
    </View>
  );
}
