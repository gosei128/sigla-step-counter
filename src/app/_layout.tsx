import { Fredoka_500Medium, Fredoka_600SemiBold } from '@expo-google-fonts/fredoka';
import { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold, NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SiglaProvider, useSigla } from '../state/SiglaContext';
import { C } from '../theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fredoka_500Medium, Fredoka_600SemiBold,
    NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold, NunitoSans_800ExtraBold,
  });
  return (
    <SafeAreaProvider>
      <SiglaProvider>
        <StatusBar style="dark" />
        {fontsLoaded ? <Routes /> : <View style={{ flex: 1, backgroundColor: C.bg }} />}
      </SiglaProvider>
    </SafeAreaProvider>
  );
}

function Routes() {
  const { ready, onboarded } = useSigla();
  if (!ready) return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
      <Stack.Protected guard={onboarded}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}
