import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSigla } from '../state/SiglaContext';
import { C, F, INK, PAL } from '../theme';
import { Blob, Diamond } from './ui';

const TABS: Record<string, { label: string; icon: number }> = {
  index: { label: 'Home', icon: 0 },
  quests: { label: 'Quests', icon: 1 },
  sigla: { label: 'Sigla', icon: 2 },
  stats: { label: 'Stats', icon: 3 },
  settings: { label: 'Settings', icon: 4 },
};

function NavIcon({ i, color }: { i: number; color: string }) {
  if (i === 0) return <View style={{ width: 18, height: 18, borderRadius: 6, backgroundColor: color }} />;
  if (i === 1) return <Diamond size={14} radius={3} color={color} />;
  if (i === 2) return <Blob w={22} h={18} color={color} />;
  if (i === 3) {
    return (
      <View style={{ flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: 18 }}>
        {[8, 18, 12].map((v, k) => <View key={k} style={{ width: 4.5, height: v, borderRadius: 2, backgroundColor: color }} />)}
      </View>
    );
  }
  return <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 4, borderColor: color }} />;
}

// Icon hops when its tab becomes active.
function Bouncy({ active, children }: { active: boolean; children: React.ReactNode }) {
  const { animations } = useSigla();
  const y = useSharedValue(0), k = useSharedValue(1);
  useEffect(() => {
    if (!active || !animations) return;
    y.value = withSequence(withTiming(-5, { duration: 120 }), withSpring(0, { damping: 9, stiffness: 260 }));
    k.value = withSequence(withTiming(1.15, { duration: 120 }), withSpring(1, { damping: 9, stiffness: 260 }));
  }, [active, animations, y, k]);
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { scale: k.value }] }));
  return <Animated.View style={st}>{children}</Animated.View>;
}

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const { mood } = useSigla();
  const insets = useSafeAreaInsets();
  const accent = mood === 'idle' ? INK : PAL[mood].main;
  return (
    <View style={[st.bar, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
      {state.routes.map((route, idx) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const active = state.index === idx;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => !active && navigateToTab(route.key)}
            style={st.item}
          >
            <View style={st.icon}><Bouncy active={active}><NavIcon i={tab.icon} color={active ? accent : C.navOff} /></Bouncy></View>
            <Text style={[st.label, { color: active ? INK : C.faint, fontFamily: active ? F.heavy : F.semi }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const st = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10, paddingHorizontal: 12 },
  item: { width: 62, alignItems: 'center', gap: 5 },
  icon: { height: 22, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11 },
});
