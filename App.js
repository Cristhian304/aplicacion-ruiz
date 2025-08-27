import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InicioSesion from './componentes/InicioSesion';
import CrearCuenta from './componentes/CrearCuenta';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InicioSesion">
        <Stack.Screen 
          name="InicioSesion" 
          component={InicioSesion} 
          options={{ title: 'Iniciar Sesión' }} 
        />
        <Stack.Screen 
          name="CrearCuenta" 
          component={CrearCuenta} 
          options={{ title: 'Crear Cuenta' }} 
        />
      </Stack.Navigator>
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