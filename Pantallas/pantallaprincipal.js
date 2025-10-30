import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, 
  FlatList, ActivityIndicator, StatusBar 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function PantallaPrincipal({ navigation }) {
  const [recetaDestacada, setRecetaDestacada] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos locales para mostrar mientras carga la app
  const recetasSlider = [
    { id: '1', nombre: "Empanadas", imagen: require('../assets/empanadasdecarne.png') },
    { id: '2', nombre: "Omelette", imagen: require('../assets/omelette.png') },
    { id: '3', nombre: "Pizza", imagen: require('../assets/pizza.png') }
  ];

  const recetasRecientes = [
    { id: '1', nombre: "Milanesa Napolitana" },
    { id: '2', nombre: "Risotto de Hongos" },
    { id: '3', nombre: "Ensalada César" }
  ];

  // Simular carga de receta destacada desde API
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecetaDestacada({
        id: '4',
        nombre: "Spicy Arrabiata Penne",
        imagen: require('../assets/arrabiatepenne.png'),
        categoria: "Vegetarian",
        tiempo: '25 min'
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Renderizado de items del slider horizontal
  const renderRecetaSlider = ({ item }) => (
    <TouchableOpacity 
      style={styles.slide}
      onPress={() => navigation.navigate('RecetaDetalle', { receta: item })}
    >
      <Image source={item.imagen} style={styles.slideImage} />
      <Text style={styles.slideText}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  // Pantalla de carga mientras se obtienen datos
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
      <StatusBar barStyle="dark-content" />
      
      {/* Header con título y botón de búsqueda */}
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Recetario</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => navigation.navigate('Explorar')}
        >
          <Feather name="search" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Contenido principal scrollable */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Receta destacada principal */}
        <Text style={styles.destacadaTitulo}>Receta recomendada</Text>
        {recetaDestacada && (
          <TouchableOpacity 
            style={styles.recetaDestacadaContainer}
            onPress={() => navigation.navigate('RecetaDetalle', { receta: recetaDestacada })}
          >
            <Image source={recetaDestacada.imagen} style={styles.recetaDestacadaImagen} />
            <View style={styles.recetaDestacadaOverlay}>
              <Text style={styles.recetaDestacadaNombre}>{recetaDestacada.nombre}</Text>
              <Text style={styles.recetaDestacadaCategoria}>{recetaDestacada.categoria}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Slider horizontal de recetas */}
        <Text style={styles.sectionTitle}>Otras recetas</Text>
        <FlatList
          data={recetasSlider}
          renderItem={renderRecetaSlider}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sliderContent}
        />

        {/* Lista de recetas recientes */}
        <Text style={styles.sectionTitle}>Recetas recientes</Text>
        {recetasRecientes.map((item) => (
          <View key={item.id} style={styles.recetaItem}>
            <Text style={styles.recetaNombre}>{item.nombre}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Estilos optimizados para la pantalla principal
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  loadingText: { marginTop: 10, color: '#666' },
  topBar: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e0e0e0'
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  searchButton: { padding: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  content: { flex: 1 },
  destacadaTitulo: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 20, marginTop: 20, marginBottom: 15, color: '#333' },
  recetaDestacadaContainer: { height: 200, marginHorizontal: 20, marginBottom: 25, borderRadius: 15, overflow: 'hidden', backgroundColor: '#f8f8f8' },
  recetaDestacadaImagen: { width: '100%', height: '100%' },
  recetaDestacadaOverlay: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 15 
  },
  recetaDestacadaNombre: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  recetaDestacadaCategoria: { color: '#ff8a00', fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, marginVertical: 15, color: '#333' },
  sliderContent: { paddingHorizontal: 15 },
  slide: { width: 110, height: 140, marginRight: 12, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f8f8f8' },
  slideImage: { width: '100%', height: 100 },
  slideText: { padding: 8, textAlign: 'center', fontSize: 12, fontWeight: '500' },
  recetaItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  recetaNombre: { fontSize: 16, color: '#333' },
});