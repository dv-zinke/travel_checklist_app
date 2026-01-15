import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TripProvider } from '../contexts/TripContext';

export default function RootLayout() {
  return (
    <TripProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A90D9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="trip/create"
          options={{
            title: 'New Trip',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="trip/[id]"
          options={{
            title: 'Trip Details',
          }}
        />
      </Stack>
    </TripProvider>
  );
}
