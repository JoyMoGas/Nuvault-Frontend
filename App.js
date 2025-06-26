import { ExpoRoot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ExpoRoot />
    </SafeAreaProvider>
  );
}
