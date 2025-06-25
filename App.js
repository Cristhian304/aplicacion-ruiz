import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
    
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Receta recomendada</Text>
        </TouchableOpacity>
      </View>

    
      <ScrollView style={styles.content}>
  
        <Text style={styles.sectionTitle}>Receitas ya probadas</Text>
        {['Receta 1', 'Receta 2', 'Receta 3', 'Receta 4'].map((item, index) => (
          <View key={`receta-${index}`} style={styles.itemCard}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}

    
        <Text style={styles.sectionTitle}>Title</Text>
        {['Comida 1', 'Comida 2', 'Comida 3', 'Comida 4'].map((item, index) => (
          <View 
            key={`product-${index}`} 
            style={[
              styles.itemCard,
              item.includes('etn.') && styles.codeItem
            ]}
          >
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>

   
      <View style={styles.bottomMenu}>
        {['🏠', '🧭', '🛒', '⏱', '👤'].map((icon, index) => (
          <TouchableOpacity key={`menu-${index}`} style={styles.menuButton}>
            <Text style={styles.menuIcon}>{icon}</Text>
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
  button: {
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 8,
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
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
  },
});