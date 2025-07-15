import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4D0045' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        title: 'palengke', 
      }}
    >
      <Stack.Screen name="index" options={{ title: 'palengke' }} />
      <Stack.Screen name="language/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="onboarding/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="existing-storeoptions/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="existing-inventory/index" options={{ title: 'palengke' }} />
      <Stack.Screen name="main/index" options={{ title: 'palengke' }} />
    </Stack>
  );
}

