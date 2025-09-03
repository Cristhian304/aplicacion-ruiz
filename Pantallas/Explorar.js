import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Explorar() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔍 Pantalla de Explorar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});