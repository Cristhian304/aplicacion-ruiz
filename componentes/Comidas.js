// componentes/Comidas.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Comidas = ({ navigation }) => {
  const [seccionActiva, setSeccionActiva] = useState('Todas');

  // Datos de ejemplo para las comidas
  const comidasData = {
    Todas: [
      { id: '1', nombre: 'Pizza Margarita', categoria: 'Italiana' },
      { id: '2', nombre: 'Tacos al Pastor', categoria: 'Mexicana' },
      { id: '3', nombre: 'Sushi California', categoria: 'Japonesa' },
      { id: '4', nombre: 'Hamburguesa Clásica', categoria: 'Americana' },
      { id: '5', nombre: 'Ensalada César', categoria: 'Ensaladas' },
      { id: '6', nombre: 'Paella Valenciana', categoria: 'Española' },
    ],
    Favoritas: [
      { id: '1', nombre: 'Pizza Margarita', categoria: 'Italiana' },
      { id: '3', nombre: 'Sushi California', categoria: 'Japonesa' },
      { id: '6', nombre: 'Paella Valenciana', categoria: 'Española' },
    ],
    categorias: [
      { id: '1', nombre: 'Italiana', count: 12 },
      { id: '2', nombre: 'Mexicana', count: 8 },
      { id: '3', nombre: 'Japonesa', count: 15 },
      { id: '4', nombre: 'China', count: 10 },
      { id: '5', nombre: 'Americana', count: 7 },
      { id: '6', nombre: 'Española', count: 5 },
    ],
    Ingredientes: [
      { id: '1', nombre: 'Pollo', count: 23 },
      { id: '2', nombre: 'Carne de Res', count: 18 },
      { id: '3', nombre: 'Pescado', count: 15 },
      { id: '4', nombre: 'Verduras', count: 30 },
      { id: '5', nombre: 'Queso', count: 25 },
      { id: '6', nombre: 'Arroz', count: 20 },
    ]
  };

  const renderSeccionBotones = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.seccionBotonesContainer}
      contentContainerStyle={styles.botonesContentContainer}
    >
      {['Todas', 'Favoritas', 'categorias', 'Ingredientes'].map((seccion) => (
        <TouchableOpacity
          key={seccion}
          style={[
            styles.botonSeccion,
            seccionActiva === seccion && styles.botonSeccionActivo
          ]}
          onPress={() => setSeccionActiva(seccion)}
        >
          <Text
            style={[
              styles.textoBotonSeccion,
              seccionActiva === seccion && styles.textoBotonSeccionActivo
            ]}
          >
            {seccion}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderItemComida = ({ item }) => (
    <TouchableOpacity style={styles.itemComida}>
      <View style={styles.infoComida}>
        <Text style={styles.nombreComida}>{item.nombre}</Text>
        <Text style={styles.categoriaComida}>{item.categoria}</Text>
      </View>
      <Ionicons name="heart-outline" size={20} color="#666" />
    </TouchableOpacity>
  );

  const renderItemCategoria = ({ item }) => (
    <TouchableOpacity style={styles.itemCategoria}>
      <Text style={styles.nombreCategoria}>{item.nombre}</Text>
      <Text style={styles.contadorCategoria}>({item.count})</Text>
    </TouchableOpacity>
  );

  const renderItemIngrediente = ({ item }) => (
    <TouchableOpacity style={styles.itemIngrediente}>
      <Text style={styles.nombreIngrediente}>{item.nombre}</Text>
      <Text style={styles.contadorIngrediente}>{item.count} recetas</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Comidas</Text>
      </View>

      {renderSeccionBotones()}

      <View style={styles.contenido}>
        {seccionActiva === 'Todas' && (
          <FlatList
            data={comidasData.Todas}
            renderItem={renderItemComida}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}

        {seccionActiva === 'Favoritas' && (
          <FlatList
            data={comidasData.Favoritas}
            renderItem={renderItemComida}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}

        {seccionActiva === 'categorias' && (
          <FlatList
            data={comidasData.categorias}
            renderItem={renderItemCategoria}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.gridContainer}
          />
        )}

        {seccionActiva === 'Ingredientes' && (
          <FlatList
            data={comidasData.Ingredientes}
            renderItem={renderItemIngrediente}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  seccionBotonesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  botonesContentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  botonSeccion: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36, // Altura fija para consistencia
  },
  botonSeccionActivo: {
    backgroundColor: '#ffc163',
  },
  textoBotonSeccion: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  textoBotonSeccionActivo: {
    color: '#000',
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
    padding: 12,
  },
  itemComida: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoComida: {
    flex: 1,
  },
  nombreComida: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoriaComida: {
    fontSize: 14,
    color: '#666',
  },
  gridContainer: {
    justifyContent: 'space-between',
    gap: 8,
  },
  itemCategoria: {
    width: '48%',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
  },
  nombreCategoria: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contadorCategoria: {
    fontSize: 12,
    color: '#666',
  },
  itemIngrediente: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nombreIngrediente: {
    fontSize: 14,
    fontWeight: '500',
  },
  contadorIngrediente: {
    fontSize: 12,
    color: '#666',
  },
});

export default Comidas;