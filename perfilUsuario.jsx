import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AjustesScreen from './ajustes.jsx';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Perfil</Text>

      <Image
        source={{ uri: 'https://thispersondoesnotexist.com/' }}
        style={styles.avatar}
      />

      <View style={styles.menuContainer}>
        <TouchableOpacity 
  style={styles.menuItem}
  onPress={() => {
    console.log('Intentando navegar a AjustesScreen');
    navigation.navigate('AjustesScreen');
  }}
>
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
        <TouchableOpacity>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 40,
  },
  menuContainer: {
    alignItems: 'center',
    flex: 1,
  },
  menuItem: {
    marginBottom: 20,
  },
  menuText: {
    fontSize: 20,
    color: '#000',
  },
  logoutContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 30,
  },
  logoutText: {
    color: '#ff0033',
    fontWeight: 'bold',
    fontSize: 18,
  },
});