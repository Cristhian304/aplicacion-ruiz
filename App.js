import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Home</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Perfil</Text>

      <Image
        source={{ uri: 'https://www.w3schools.com/howto/img_avatar.png' }} // Imagen de avatar predeterminada
        style={styles.avatar}
      />

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Favoritos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
          <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesiÃ³n</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto"/>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc163',
    alignItems: 'center',
    paddingTop: 50,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  menuContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  menuItem: {
    width: '80%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#ffffff',
  },
  logoutContainer: {
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoutButton: {
    borderBottomWidth: 0,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#ff0000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
