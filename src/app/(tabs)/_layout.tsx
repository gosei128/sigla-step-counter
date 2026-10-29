import { Tabs } from 'expo-router';
import { TabBar } from '../../components/TabBar';
import { C } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'shift', sceneStyle: { backgroundColor: C.bg } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="quests" />
      <Tabs.Screen name="sigla" />
      <Tabs.Screen name="stats" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
