import 'react-native-gesture-handler';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import creaCuenta from './componentes/creaCuenta';

const MyStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <MyStack.Navigator>
        <MyStack.Screen
          name="Home"
          component={creaCuenta}
        />
      </MyStack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});