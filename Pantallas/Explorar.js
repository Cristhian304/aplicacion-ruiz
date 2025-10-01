// Explorar.js - Con búsqueda en español/inglés
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Image, ActivityIndicator, Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { translateText } from '../services/translationService';

// Diccionario inverso español-inglés para búsquedas
const spanishToEnglishDict = {
  'pollo': 'chicken',
  'carne': 'beef',
  'cerdo': 'pork',
  'pescado': 'fish',
  'pasta': 'pasta',
  'arroz': 'rice',
  'ensalada': 'salad',
  'sopa': 'soup',
  'postre': 'dessert',
  'pizza': 'pizza',
  'taco': 'taco',
  'hamburguesa': 'burger',
  'sándwich': 'sandwich',
  'queso': 'cheese',
  'tomate': 'tomato',
  'cebolla': 'onion',
  'ajo': 'garlic',
  'papa': 'potato',
  'zanahoria': 'carrot',
  'pimiento': 'pepper',
  'chile': 'chili',
  'limón': 'lemon',
  'naranja': 'orange',
  'manzana': 'apple',
  'plátano': 'banana',
  'fresa': 'strawberry',
  'helado': 'ice cream',
  'pastel': 'cake',
  'galleta': 'cookie',
  'pan': 'bread',
  'huevo': 'egg',
  'leche': 'milk',
  'mantequilla': 'butter',
  'aceite': 'oil',
  'sal': 'salt',
  'pimienta': 'pepper',
  'azúcar': 'sugar',
  'vinagre': 'vinegar',
  'horneado': 'baked',
  'frito': 'fried',
  'asado': 'grilled',
  'hervido': 'boiled',
  'picado': 'chopped',
  'rallado': 'grated'
};

export default function Explorar({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [recetasPopulares, setRecetasPopulares] = useState([]);
  const [recetasBuscadas, setRecetasBuscadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Cargar categorías y recetas populares al iniciar
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const categoriasResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const categoriasData = await categoriasResponse.json();
      
      // Cargar recetas populares (recetas aleatorias)
      const recetasPromises = Array.from({ length: 6 }, () => 
        fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
      );
      
      const recetasData = await Promise.all(recetasPromises);
      
      // Transformar datos de categorías
      const categoriasTransformadas = categoriasData.categories.map(cat => ({
        id: cat.idCategory,
        nombre: cat.strCategory,
        imagen: cat.strCategoryThumb,
        icon: getIconForCategory(cat.strCategory)
      }));

      // Transformar datos de recetas
      const recetasTransformadas = recetasData
        .filter(data => data.meals && data.meals[0])
        .map(data => transformarRecetaAPI(data.meals[0]));

      setCategorias(categoriasTransformadas);
      setRecetasPopulares(recetasTransformadas);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  // Función para traducir términos de búsqueda español -> inglés
  const translateSearchTerm = (spanishTerm) => {
    const lowerTerm = spanishTerm.toLowerCase();
    
    // Buscar en el diccionario
    for (const [es, en] of Object.entries(spanishToEnglishDict)) {
      if (lowerTerm.includes(es)) {
        return en;
      }
    }
    
    // Si no encuentra, devolver el término original (puede estar en inglés)
    return spanishTerm;
  };

  // Buscar recetas - acepta español e inglés
  const buscarRecetas = async (texto) => {
    if (!texto.trim()) {
      setRecetasBuscadas([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      
      // Traducir término de búsqueda si es necesario
      const searchTerm = translateSearchTerm(texto);
      console.log(`🔍 Buscando: "${texto}" -> "${searchTerm}"`);
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      
      if (data.meals) {
        const recetasTransformadas = data.meals.map(receta => transformarRecetaAPI(receta));
        setRecetasBuscadas(recetasTransformadas);
      } else {
        setRecetasBuscadas([]);
      }
    } catch (error) {
      console.error('Error buscando recetas:', error);
      Alert.alert('Error', 'No se pudieron buscar las recetas');
    } finally {
      setSearching(false);
    }
  };

  // Filtrar recetas por categoría
  const filtrarPorCategoria = async (categoria) => {
    try {
      setSearching(true);
      setCategoriaSeleccionada(categoria);
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria.nombre}`);
      const data = await response.json();
      
      if (data.meals) {
        // Para cada receta, obtener los detalles completos
        const recetasDetalles = await Promise.all(
          data.meals.slice(0, 10).map(receta => 
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${receta.idMeal}`)
              .then(res => res.json())
              .then(data => transformarRecetaAPI(data.meals[0]))
          )
        );
        
        setRecetasBuscadas(recetasDetalles);
      } else {
        setRecetasBuscadas([]);
      }
    } catch (error) {
      console.error('Error filtrando por categoría:', error);
      Alert.alert('Error', 'No se pudieron cargar las recetas de esta categoría');
    } finally {
      setSearching(false);
    }
  };

  // Transformar receta de la API a nuestro formato
  const transformarRecetaAPI = (recetaAPI) => {
    const ingredientes = [];
    
    // Extraer ingredientes (de strIngredient1 a strIngredient20)
    for (let i = 1; i <= 20; i++) {
      const ingrediente = recetaAPI[`strIngredient${i}`];
      const medida = recetaAPI[`strMeasure${i}`];
      
      if (ingrediente && ingrediente.trim() !== '') {
        ingredientes.push({
          cantidad: medida ? medida.trim() : 'Al gusto',
          producto: ingrediente.trim(),
          indicacion: ''
        });
      }
    }

    // Dividir instrucciones en pasos
    const pasos = recetaAPI.strInstructions 
      ? recetaAPI.strInstructions.split('\r\n').filter(paso => paso.trim() !== '')
      : ['No hay instrucciones disponibles'];

    return {
      id: recetaAPI.idMeal,
      nombre: recetaAPI.strMeal,
      imagen: recetaAPI.strMealThumb,
      categoria: recetaAPI.strCategory,
      area: recetaAPI.strArea,
      ingredientes,
      pasos,
      dificultad: 'Media',
      tiempo: '30 min',
      youtube: recetaAPI.strYoutube,
      // Guardar datos originales en inglés para la traducción
      _original: {
        nombre: recetaAPI.strMeal,
        categoria: recetaAPI.strCategory,
        area: recetaAPI.strArea,
        ingredientes: ingredientes.map(ing => ing.producto),
        pasos: pasos
      }
    };
  };

  // Función para obtener iconos por categoría
  const getIconForCategory = (categoria) => {
    const iconMap = {
      'Beef': '🍖', 'Chicken': '🍗', 'Dessert': '🍰', 'Lamb': '🐑',
      'Pasta': '🍝', 'Pork': '🥓', 'Seafood': '🐟', 'Side': '🥗',
      'Starter': '🍤', 'Vegan': '🌱', 'Vegetarian': '🥬', 'Breakfast': '🍳'
    };
    return iconMap[categoria] || '🍴';
  };

  // Renderizar categorías
  const renderCategoria = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoriaCard,
        categoriaSeleccionada?.id === item.id && styles.categoriaSeleccionada
      ]}
      onPress={() => filtrarPorCategoria(item)}
    >
      <Image 
        source={{ uri: item.imagen }} 
        style={styles.categoriaImagen} 
      />
      <Text style={styles.categoriaNombre}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  // Renderizar recetas
  const renderReceta = ({ item }) => (
    <TouchableOpacity 
      style={styles.recetaCard}
      onPress={() => navigation.navigate('RecetaDetalle', { receta: item })}
    >
      <Image 
        source={{ uri: item.imagen }} 
        style={styles.recetaImagen} 
      />
      <View style={styles.recetaInfo}>
        <Text style={styles.recetaNombre}>{item.nombre}</Text>
        <View style={styles.recetaMeta}>
          <Text style={styles.recetaTiempo}>{item.tiempo}</Text>
          <Text style={styles.recetaDificultad}>{item.dificultad}</Text>
        </View>
        {item.area && (
          <Text style={styles.recetaArea}>🍴 {item.area}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Determinar qué datos mostrar
  const mostrarResultadosBusqueda = searchText.trim() !== '' || categoriaSeleccionada;
  const datosAMostrar = mostrarResultadosBusqueda ? recetasBuscadas : recetasPopulares;
  const tituloSeccion = mostrarResultadosBusqueda 
    ? `Resultados (${recetasBuscadas.length})` 
    : 'Recetas Populares';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando recetas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>🔍 Explorar Recetas</Text>
      </View>

      {/* Barra de búsqueda MEJORADA */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en español o inglés (pollo, chicken, pasta, etc.)"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            buscarRecetas(text);
          }}
          returnKeyType="search"
        />
        {(searchText || categoriaSeleccionada) && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              setSearchText('');
              setCategoriaSeleccionada(null);
              setRecetasBuscadas([]);
            }}
          >
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Info de búsqueda */}
      {searchText && (
        <Text style={styles.searchInfo}>
          💡 Podés buscar en español o inglés
        </Text>
      )}

      {/* Categorías */}
      <Text style={styles.sectionTitle}>Categorías</Text>
      <FlatList
        data={categorias}
        renderItem={renderCategoria}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasList}
      />

      {/* Resultados */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{tituloSeccion}</Text>
        {searching && <ActivityIndicator size="small" color="#007AFF" />}
      </View>

      {datosAMostrar.length === 0 && !searching && searchText ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No se encontraron recetas para "{searchText}"</Text>
          <Text style={styles.emptyStateHint}>
            Probá con: pollo, carne, pasta, ensalada, postre, etc.
          </Text>
        </View>
      ) : datosAMostrar.length === 0 && !searching ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay recetas disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={datosAMostrar}
          renderItem={renderReceta}
          keyExtractor={item => item.id}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recetasList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInfo: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoriasList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  categoriaCard: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 80,
  },
  categoriaSeleccionada: {
    backgroundColor: '#007AFF',
  },
  categoriaImagen: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  categoriaNombre: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  recetasList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recetaCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  recetaImagen: {
    width: 100,
    height: 100,
  },
  recetaInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  recetaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  recetaMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  recetaTiempo: {
    fontSize: 12,
    color: '#666',
  },
  recetaDificultad: {
    fontSize: 12,
    color: '#666',
  },
  recetaArea: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});