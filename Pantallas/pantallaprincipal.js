import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function pantallaprincipal({ navigation }) {
  const recetaDestacada = {
    id: 1,
    nombre: "Milanesa de Pollo",
    imagen: require('../assets/milanesadepollo.png'),
    ingredientes: [
      { cantidad: "4", producto: "Pechugas de pollo", indicacion: "fileteadas" },
      { cantidad: "2", producto: "Huevos", indicacion: "batidos" },
      { cantidad: "1 taza", producto: "Pan rallado" }
    ],
    pasos: [
      "Condimentar los filetes de pollo",
      "Pasar por huevo batido",
      "Rebozar con pan rallado",
      "Freír en aceite caliente"
    ]
  };

  const recetasSlider = [
    { 
      id: 1, 
      nombre: "Empanadas", 
      imagen: require('../assets/empanadasdecarne.png'),
      ingredientes: [
        { cantidad: "12", producto: "Tapas para empanadas" },
        { cantidad: "500 g", producto: "Carne picada" }
      ],
      pasos: ["Preparar el relleno", "Rellenar las tapas", "Cocinar"]
    },
    { 
      id: 2, 
      nombre: "Omelette", 
      imagen: require('../assets/omelette.png'),
      ingredientes: [
        { cantidad: "3", producto: "Huevos" },
        { cantidad: "50 g", producto: "Queso"}
      ],
      pasos: ["Batir los huevos", "Agregar ingredientes", "Cocinar en sartén"]
    },
    { 
      id: 3, 
      nombre: "Pizza", 
      imagen: require('../assets/pizza.png'),
      ingredientes: [
        { cantidad: "1", producto: "Masa de pizza" },
        { cantidad: "200 g", producto: "Queso mozzarella" }
      ],
      pasos: ["Estirar la masa", "Agregar ingredientes", "Hornear"]
    },
    { 
      id: 4, 
      nombre: "Arrabiata penne", 
      imagen: require('../assets/arrabiatepenne.png'),
      ingredientes: [
        { cantidad: "250 g", producto: "Penne" },
        { cantidad: "400 g", producto: "Salsa de tomate" }
      ],
      pasos: ["Cocinar la pasta", "Preparar la salsa", "Mezclar y servir"]
    }
  ];

  const recetasProbadas = [
    { id: 1, nombre: "Milanesa Napolitana" },
    { id: 2, nombre: "Risotto de Hongos" },
    { id: 3, nombre: "Ensalada César" },
    { id: 4, nombre: "Brownie de Chocolate" }
  ];

  const renderRecetaSlider = ({ item }) => (
    <TouchableOpacity 
      style={styles.slide}
      onPress={() => navigation.navigate('RecetaDetalle', { receta: item })}
    >
      <Image source={item.imagen} style={styles.slideImage} resizeMode="cover" />
      <Text style={styles.slideText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const renderRecetaProbada = ({ item }) => (
    <View style={styles.recetaItem}>
      <Text style={styles.recetaNombre}>{item.nombre}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={20} color="#007AFF" />
            <Text style={styles.headerText}> Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.destacadaTitulo}>Receta recomendada</Text>
        
        <TouchableOpacity 
          style={styles.recetaDestacadaContainer}
          onPress={() => navigation.navigate('RecetaDetalle', { receta: recetaDestacada })}
        >
          <Image 
            source={recetaDestacada.imagen} 
            style={styles.recetaDestacadaImagen}
            resizeMode="cover"
          />
          <Text style={styles.recetaDestacadaNombre}>{recetaDestacada.nombre}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Otras recetas</Text>
        <View style={styles.sliderContainer}>
          <FlatList
            data={recetasSlider}
            renderItem={renderRecetaSlider}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Recetas ya probadas</Text>
        <FlatList
          data={recetasProbadas}
          renderItem={renderRecetaProbada}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  destacadaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  recetaDestacadaContainer: {
    height: 180,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recetaDestacadaImagen: {
    width: '100%',
    height: '100%',
  },
  recetaDestacadaNombre: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
    textAlign: 'center',
  },
  sliderContainer: {
    height: 130,
    marginBottom: 15,
  },
  slide: {
    width: 110,
    height: 130, 
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  slideImage: {
    width: '100%',
    height: 90,
  },
  slideText: {
    padding: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginVertical: 10,
    color: '#333',
  },
  recetaItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recetaNombre: {
    fontSize: 16,
  },
});