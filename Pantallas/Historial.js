import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Historial() {
  
  const historialRecetas = [
    { id: '1', nombre: "Spicy Arrabiata Penne", fecha: "Hoy", categoria: "Italiana" },
    { id: '2', nombre: "Empanadas de Carne", fecha: "Ayer", categoria: "Argentina" },
    { id: '3', nombre: "Omelette de Queso", fecha: "15 Ene", categoria: "Desayuno" },
    { id: '4', nombre: "Pizza Margherita", fecha: "14 Ene", categoria: "Italiana" },
    { id: '5', nombre: "Ensalada César", fecha: "13 Ene", categoria: "Ensaladas" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>📚 Mi Historial</Text>
        <Text style={styles.subtitle}>Recetas que has visto recientemente</Text>
        
        {historialRecetas.map((receta) => (
          <TouchableOpacity key={receta.id} style={styles.recetaItem}>
            <View style={styles.recetaInfo}>
              <Text style={styles.recetaNombre}>{receta.nombre}</Text>
              <View style={styles.recetaMeta}>
                <Text style={styles.recetaFecha}>{receta.fecha}</Text>
                <Text style={styles.recetaCategoria}>{receta.categoria}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
        
        <View style={styles.emptySpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  recetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recetaInfo: {
    flex: 1,
  },
  recetaNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  recetaMeta: {
    flexDirection: 'row',
  },
  recetaFecha: {
    fontSize: 14,
    color: '#666',
    marginRight: 15,
  },
  recetaCategoria: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptySpace: {
    height: 30,
  },
});