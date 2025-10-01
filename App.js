import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

import PantallaPrincipal from './pantallas/pantallaprincipal';
import RecetaDetalle from './pantallas/RecetaDetalle';
import Explorar from './pantallas/Explorar';
import Historial from './pantallas/Historial';
import Perfil from './pantallas/Perfil';
import InicioSesion from './pantallas/InicioSesion';
import CrearCuenta from './pantallas/CrearCuenta';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para la pantalla de Inicio (que incluye RecetaDetalle)
function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PantallaPrincipal" 
        component={PantallaPrincipal} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RecetaDetalle" 
        component={RecetaDetalle} 
        options={{ 
          title: 'Detalle de Receta',
          headerBackTitle: 'Atrás',
          headerTintColor: '#007AFF',
        }}
      />
    </Stack.Navigator>
  );
}

// Stack para la pantalla de Explorar (que también incluye RecetaDetalle)
function ExplorarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ExplorarMain" 
        component={Explorar} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RecetaDetalle" 
        component={RecetaDetalle} 
        options={{ 
          title: 'Detalle de Receta',
          headerBackTitle: 'Atrás',
          headerTintColor: '#007AFF',
        }}
      />
    </Stack.Navigator>
  );
}

// Stack para Historial (que también incluye RecetaDetalle)
function HistorialStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HistorialMain" 
        component={Historial} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RecetaDetalle" 
        component={RecetaDetalle} 
        options={{ 
          title: 'Detalle de Receta',
          headerBackTitle: 'Atrás',
          headerTintColor: '#007AFF',
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="InicioSesion"
        screenOptions={{ headerShown: false }}
      >
        {/* Pantallas de Autenticación */}
        <Stack.Screen name="InicioSesion" component={InicioSesion} />
        <Stack.Screen name="CrearCuenta" component={CrearCuenta} />
        
        {/* Pantalla Principal con Tabs */}
        <Stack.Screen name="MainApp">
          {() => (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  if (route.name === 'Inicio') {
                    return <MaterialIcons name="home" size={size} color={color} />;
                  } else if (route.name === 'Explorar') {
                    return <Feather name="compass" size={size} color={color} />;
                  } else if (route.name === 'Historial') {
                    return <Feather name="clock" size={size} color={color} />;
                  } else if (route.name === 'Perfil') {
                    return <Ionicons name="person-outline" size={size} color={color} />;
                  }
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#7f8c8d',
                tabBarStyle: {
                  height: 70,
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  borderTopWidth: 1,
                  borderTopColor: '#e0e0e0',
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  marginTop: 4,
                },
                headerShown: false,
              })}
            >
              <Tab.Screen name="Inicio" component={InicioStack} />
              <Tab.Screen name="Explorar" component={ExplorarStack} />
              <Tab.Screen name="Historial" component={HistorialStack} />
              <Tab.Screen name="Perfil" component={Perfil} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}