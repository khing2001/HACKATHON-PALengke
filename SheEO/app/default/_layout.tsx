import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide stack navigator headers to avoid duplication
      }}
    >
      <Stack.Screen name="home/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="chat/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="shop/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="wallet/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="share/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="resources/index" options={{ title: 'palengke' }} />
    </Stack>
  );
}

