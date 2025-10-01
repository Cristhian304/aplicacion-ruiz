import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function Pantallaprincipal({ navigation }) {
  const [recetaDestacada, setRecetaDestacada] = useState(null);
  const [loading, setLoading] = useState(true);

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
        { cantidad: "50 g", producto: "Queso", indicacion: "rallado" }
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
    }
  ];

  const recetasProbadas = [
    { id: 1, nombre: "Milanesa Napolitana" },
    { id: 2, nombre: "Risotto de Hongos" },
    { id: 3, nombre: "Ensalada César" },
    { id: 4, nombre: "Brownie de Chocolate" }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecetaDestacada({
        id: 4,
        nombre: "Spicy Arrabiata Penne",
        imagen: require('../assets/arrabiatepenne.png'),
        categoria: "Vegetarian",
        ingredientes: [
          { cantidad: "250 g", producto: "Penne" },
          { cantidad: "400 g", producto: "Salsa de tomate" },
          { cantidad: "2 dientes", producto: "Ajo" },
          { cantidad: "1 cucharadita", producto: "Chile molido" }
        ],
        pasos: [
          "Cocinar la pasta al dente",
          "Saltear ajo y chile en aceite de oliva",
          "Agregar salsa de tomate y cocinar 10 min",
          "Mezclar con la pasta y servir"
        ],
        dificultad: 'Media',
        tiempo: '25 min'
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Función para navegar a Explorar
  const handleSearchPress = () => {
    navigation.navigate('Explorar');
  };

  const renderRecetaSlider = ({ item }) => (
    <TouchableOpacity 
      style={styles.slide}
      onPress={() => navigation.navigate('RecetaDetalle', { receta: item })}
    >
      <Image 
        source={item.imagen}
        style={styles.slideImage} 
        resizeMode="cover" 
      />
      <Text style={styles.slideText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const renderRecetaProbada = ({ item }) => (
    <View style={styles.recetaItem}>
      <Text style={styles.recetaNombre}>{item.nombre}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando receta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* StatusBar con espacio para notch */}
      <StatusBar barStyle="dark-content" />
      
      {/* Header fijo en la parte superior */}
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Recetario</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <Feather name="search" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.destacadaTitulo}>Receta recomendada</Text>
        
        {recetaDestacada && (
          <TouchableOpacity 
            style={styles.recetaDestacadaContainer}
            onPress={() => navigation.navigate('RecetaDetalle', { receta: recetaDestacada })}
          >
            <Image 
              source={recetaDestacada.imagen}
              style={styles.recetaDestacadaImagen}
              resizeMode="cover"
            />
            <View style={styles.recetaDestacadaOverlay}>
              <Text style={styles.recetaDestacadaNombre}>{recetaDestacada.nombre}</Text>
              {recetaDestacada.categoria && (
                <Text style={styles.recetaDestacadaCategoria}>{recetaDestacada.categoria}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Otras recetas</Text>
        <View style={styles.sliderContainer}>
          <FlatList
            data={recetasSlider}
            renderItem={renderRecetaSlider}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sliderContent}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  destacadaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  recetaDestacadaContainer: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recetaDestacadaImagen: {
    width: '100%',
    height: '100%',
  },
  recetaDestacadaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
  },
  recetaDestacadaNombre: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recetaDestacadaCategoria: {
    color: '#ff8a00',
    fontSize: 14,
    fontWeight: '600',
  },
  sliderContainer: {
    height: 140,
    marginBottom: 20,
  },
  sliderContent: {
    paddingHorizontal: 15,
  },
  slide: {
    width: 110,
    height: 140,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  slideImage: {
    width: '100%',
    height: 100,
  },
  slideText: {
    padding: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
    color: '#333',
  },
  recetaItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recetaNombre: {
    fontSize: 16,
    color: '#333',
  },
});