import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

import pantallaprincipal from './pantallas/pantallaprincipal';
import RecetaDetalle from './pantallas/RecetaDetalle';
import Explorar from './pantallas/Explorar';
import Historial from './pantallas/Historial';
import Perfil from './pantallas/Perfil';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Pantallaprincipal" 
        component={pantallaprincipal} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RecetaDetalle" 
        component={RecetaDetalle} 
        options={{ 
          title: 'Detalle de Receta',
          headerBackTitle: 'Atrás',
          headerTintColor: '#007AFF',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="Inicio" component={HomeStack} />
        <Tab.Screen name="Explorar" component={Explorar} />
        <Tab.Screen name="Historial" component={Historial} />
        <Tab.Screen name="Perfil" component={Perfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}