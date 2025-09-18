import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InicioSesion from './componentes/InicioSesion';
import CrearCuenta from './componentes/CrearCuenta';
import Comidas from './componentes/Comidas';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="InicioSesion"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffc163',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
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
        <Stack.Screen 
          name="Comidas" 
          component={Comidas} 
          options={{ 
            title: 'Comidas',
          }} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc163',
    alignItems: 'center',
    justifyContent: 'center',
  },
});