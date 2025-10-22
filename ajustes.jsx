import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function AjustesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.profileTitle}>Ajustes</Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacidad</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Preferencias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Sitios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notificaciones</Text>
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
  }
});