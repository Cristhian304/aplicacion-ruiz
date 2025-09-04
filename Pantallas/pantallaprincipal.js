import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
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

  const fetchArrabiataPenne = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771');
      const data = await response.json();
      
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        
        const ingredientes = [];
        for (let i = 1; i <= 20; i++) {
          const ingrediente = meal[`strIngredient${i}`];
          const medida = meal[`strMeasure${i}`];
          
          if (ingrediente && ingrediente.trim() !== '') {
            ingredientes.push({
              cantidad: medida ? medida.trim() : 'Al gusto',
              producto: ingrediente.trim(),
              indicacion: ''
            });
          }
        }

        const pasos = meal.strInstructions 
          ? meal.strInstructions.split('\r\n').filter(paso => paso.trim() !== '')
          : ['No hay instrucciones disponibles'];

        const recetaTransformada = {
          id: meal.idMeal,
          nombre: meal.strMeal,
          imagen: meal.strMealThumb,
          categoria: meal.strCategory,
          area: meal.strArea,
          ingredientes,
          pasos,
          dificultad: 'Media',
          tiempo: '35 min'
        };

        setRecetaDestacada(recetaTransformada);
      }
    } catch (err) {
      setRecetaDestacada({
        id: 4,
        nombre: "Penne Arrabiata",
        imagen: require('../assets/arrabiatepenne.png'), 
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrabiataPenne();
  }, []);

  const renderRecetaSlider = ({ item }) => (
    <TouchableOpacity 
      style={styles.slide}
      onPress={() => navigation.navigate('RecetaDetalle', { receta: item })}
    >
      <Image 
        source={typeof item.imagen === 'string' 
          ? { uri: item.imagen }      
          : item.imagen}              
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
        
        {recetaDestacada && (
          <TouchableOpacity 
            style={styles.recetaDestacadaContainer}
            onPress={() => navigation.navigate('RecetaDetalle', { receta: recetaDestacada })}
          >
            <Image 
              source={typeof recetaDestacada.imagen === 'string' 
                ? { uri: recetaDestacada.imagen }  
                : recetaDestacada.imagen}         
              style={styles.recetaDestacadaImagen}
              resizeMode="cover"
            />
            <Text style={styles.recetaDestacadaNombre}>{recetaDestacada.nombre}</Text>
            {recetaDestacada.categoria && (
              <Text style={styles.recetaDestacadaCategoria}>{recetaDestacada.categoria}</Text>
            )}
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
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
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
    height: 200,
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
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  recetaDestacadaCategoria: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,122,255,0.8)',
    color: '#fff',
    fontSize: 14,
    padding: 4,
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