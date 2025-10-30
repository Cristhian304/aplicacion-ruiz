import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

// Importar todas las pantallas de la aplicación
import PantallaPrincipal from './pantallas/pantallaprincipal';
import RecetaDetalle from './pantallas/RecetaDetalle';
import Explorar from './pantallas/Explorar';
import Historial from './pantallas/Historial';
import PerfilUsuario from './pantallas/perfilUsuario';
import AjustesScreen from './pantallas/ajustes';
import InicioSesion from './pantallas/InicioSesion';
import CrearCuenta from './pantallas/CrearCuenta';

// Crear navegadores para tabs (inferior) y stacks (pila)
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack para la pantalla de Inicio - incluye pantalla principal y detalle de recetas
function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PantallaPrincipal" 
        component={PantallaPrincipal} 
        options={{ headerShown: false }} // Ocultar header para diseño personalizado
      />
      <Stack.Screen 
        name="RecetaDetalle" 
        component={RecetaDetalle} 
        options={{ 
          title: 'Detalle de Receta',
          headerBackTitle: 'Atrás', // Texto personalizado para botón de retroceso
          headerTintColor: '#007AFF', // Color azul para elementos del header
        }}
      />
    </Stack.Navigator>
  );
}

// Stack para la pantalla de Explorar - búsqueda y categorías
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

// Stack para el Historial - recetas vistas recientemente
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

// Stack para Perfil - incluye pantalla de perfil y ajustes
function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PerfilMain" 
        component={PerfilUsuario} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AjustesScreen" 
        component={AjustesScreen}
        options={{ 
          title: 'Ajustes',
          headerBackTitle: 'Atrás',
          headerTintColor: '#007AFF',
        }}
      />
    </Stack.Navigator>
  );
}

// Componente principal de la aplicación con configuración de navegación
export default function App() {
  return (
    // NavigationContainer es el componente raíz que maneja el estado de navegación
    <NavigationContainer>
      {/* Stack Navigator principal - maneja transiciones entre pantallas */}
      <Stack.Navigator 
        initialRouteName="InicioSesion" // Pantalla inicial al abrir la app
        screenOptions={{ headerShown: false }} // Ocultar headers por defecto
      >
        {/* Pantallas de autenticación - fuera del tab navigator */}
        <Stack.Screen name="InicioSesion" component={InicioSesion} />
        <Stack.Screen name="CrearCuenta" component={CrearCuenta} />
        
        {/* Pantalla principal de la app con sistema de tabs */}
        <Stack.Screen name="MainApp">
          {() => (
            // Tab Navigator - navegación inferior entre secciones principales
            <Tab.Navigator
              screenOptions={({ route }) => ({
                // Configuración dinámica de iconos para cada tab
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  
                  // Asignar icono diferente para cada tab
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
                // Colores para estado activo e inactivo de los tabs
                tabBarActiveTintColor: '#007AFF', // Azul para tab activo
                tabBarInactiveTintColor: '#7f8c8d', // Gris para tabs inactivos
                // Estilos personalizados para la barra de tabs
                tabBarStyle: {
                  height: 70, // Altura aumentada para mejor usabilidad
                  paddingVertical: 10, // Espaciado interno
                  backgroundColor: 'white', // Fondo blanco
                  borderTopWidth: 1, // Línea superior sutil
                  borderTopColor: '#e0e0e0', // Color gris claro para la línea
                },
                // Estilos para las etiquetas de texto de los tabs
                tabBarLabelStyle: {
                  fontSize: 12, // Tamaño pequeño para las etiquetas
                  marginTop: 4, // Espacio arriba del texto
                },
                headerShown: false, // Ocultar header ya que cada stack maneja el suyo
              })}
            >
              {/* Definición de los 4 tabs principales de la aplicación */}
              <Tab.Screen name="Inicio" component={InicioStack} />
              <Tab.Screen name="Explorar" component={ExplorarStack} />
              <Tab.Screen name="Historial" component={HistorialStack} />
              <Tab.Screen name="Perfil" component={PerfilStack} />
            </Tab.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}