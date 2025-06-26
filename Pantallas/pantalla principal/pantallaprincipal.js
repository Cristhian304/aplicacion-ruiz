import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PantallaPrincipal() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
        <Text style={styles.sectionTitle}>Recetas ya probadas</Text>
        {['Receta 1', 'Receta 2', 'Receta 3', 'Receta 4'].map((item, index) => (
          <TouchableOpacity 
            key={`receta-${index}`} 
            style={styles.itemCard}
            onPress={() => navigation.navigate('DetalleReceta')} // Ejemplo de navegación
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Nuevas</Text>
        {['Comida 1', 'Comida 2', 'Comida 3', 'Comida 4'].map((item, index) => (
          <TouchableOpacity 
            key={`nueva-${index}`}
            style={[styles.itemCard, item.includes('etn.') && styles.codeItem]}
          >
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menú inferior personalizado */}
      <View style={styles.bottomMenu}>
        {[
          { icon: '🏠', screen: 'Main' },
          { icon: '🧭', screen: 'Explorar' },
          { icon: '🛒', screen: 'Carrito' },
          { icon: '🕗', screen: 'Historial' },
          { icon: '👤', screen: 'Perfil' }
        ].map((item, index) => (
          <TouchableOpacity 
            key={`menu-${index}`} 
            style={styles.menuButton}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
    marginBottom: 60, // Ajuste para el menú inferior
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
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  menuIcon: {
    fontSize: 24,
  },
});