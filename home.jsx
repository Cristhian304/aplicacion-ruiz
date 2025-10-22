import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Home</Text>
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
  title: {
    color: '#000',
    fontSize: 20,
    },
});