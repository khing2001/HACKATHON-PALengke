import { Stack } from 'expo-router';

export default function RootLayout(){
  return(
  <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4D0045', 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => null, 
        title: 'palengke', 
      }}>
    </Stack>
  )
}
