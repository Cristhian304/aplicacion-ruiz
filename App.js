import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa tus componentes de autenticación y la pantalla principal
import InicioSesion from './componentes/InicioSesion';
import CrearCuenta from './componentes/CrearCuenta';
import Comidas from './componentes/Comidas';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        // La primera pantalla que se muestra al iniciar la app
        initialRouteName="InicioSesion"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffc163', // Color de fondo del encabezado
          },
          headerTintColor: '#000', // Color del texto del encabezado y botón de retroceso
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Pantalla de Inicio de Sesión */}
        <Stack.Screen 
          name="InicioSesion" 
          component={InicioSesion} 
          options={{ title: 'Iniciar Sesión' }} 
        />
        
        {/* Pantalla de Registro */}
        <Stack.Screen 
          name="CrearCuenta" 
          component={CrearCuenta} 
          options={{ title: 'Crear Cuenta' }} 
        />
        
        {/* Pantalla Principal (solo accesible después del login) */}
        <Stack.Screen 
          name="Comidas" 
          component={Comidas} 
          options={{ 
            title: 'Comidas',
            // Opcional: puedes ocultar el botón de retroceso si es la pantalla principal
            // headerLeft: () => null, 
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