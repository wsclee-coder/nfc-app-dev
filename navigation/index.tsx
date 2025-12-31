import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import MainScreen from '../screens/MainScreen';
import CardWalletScreen from '../screens/CardWalletScreen';
import RecordScreen from '../screens/RecordScreen';
import TopupScreen from '../screens/TopupScreen';
import NfcModal from '../components/NfcModal';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
      <NfcModal />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} options={{ title: '', headerShown: false }} />
      <Stack.Screen name="Balance" component={CardWalletScreen} options={{ title: 'Card Wallet' }} />
      <Stack.Screen name="Record" component={RecordScreen} options={{ title: 'Payment Records' }} />
      <Stack.Screen name="Topup" component={TopupScreen} options={{ title: 'Top up' }} />
    </Stack.Navigator>
  );
}


