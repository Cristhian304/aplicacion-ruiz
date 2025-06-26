import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Receta recomendada</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        {/* Sección de recetas */}
        <Text style={styles.sectionTitle}>Recetas ya probadas</Text>
        {['Receta 1', 'Receta 2', 'Receta 3', 'Receta 4'].map((item, index) => (
          <View key={`receta-${index}`} style={styles.itemCard}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}

        {/* Sección de productos */}
        <Text style={styles.sectionTitle}>Productos</Text>
        {['Marca Producto 1', 'Marca Producto 2', 'etn.aa', 'etn.c'].map((item, index) => (
          <View
            key={`producto-${index}`}
            style={[
              styles.itemCard,
              item.includes('etn.') && styles.codeItem
            ]}
          >
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Menú inferior personalizado */}
      <View style={styles.bottomMenu}>
        <View style={styles.menuButton}>
          <Text style={styles.menuIcon}>🏠</Text>
          <Text style={styles.menuText}>Inicio</Text>
        </View>
        
        <View style={styles.menuButton}>
          <Text style={styles.menuIcon}>🔍</Text>
          <Text style={styles.menuText}>Buscar</Text>
        </View>
        
        <View style={styles.menuButton}>
          <Text style={styles.menuIcon}>🛒</Text>
          <Text style={styles.menuText}>Carrito</Text>
        </View>
        
        <View style={styles.menuButton}>
          <Text style={styles.menuIcon}>❤️</Text>
          <Text style={styles.menuText}>Favoritos</Text>
        </View>
        
        <View style={styles.menuButton}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>Perfil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  button: {
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
    marginBottom: 70, // Espacio para el menú inferior
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  codeItem: {
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  menuText: {
    fontSize: 12,
    color: '#333',
  },
});