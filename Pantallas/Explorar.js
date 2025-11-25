import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Image, ActivityIndicator, Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Diccionario para búsquedas bilingües
const spanishToEnglishDict = {
  'pollo': 'chicken', 'carne': 'beef', 'cerdo': 'pork', 'pescado': 'fish',
  'pasta': 'pasta', 'arroz': 'rice', 'ensalada': 'salad', 'sopa': 'soup',
  'postre': 'dessert', 'vegetariano': 'vegetarian', 'vegano': 'vegan',
  'desayuno': 'breakfast', 'entrada': 'starter', 'mariscos': 'seafood'
};

export default function Explorar({ navigation }) {
  const [searchText, setSearchText] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      
      const [categoriasRes, ...recetasData] = await Promise.all([
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php').then(res => res.json()),
        ...Array.from({ length: 6 }, () => 
          fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
        )
      ]);
      
      const categoriasTransformadas = categoriasRes.categories.map(cat => ({
        id: `cat-${cat.idCategory}`,
        nombre: cat.strCategory,
        imagen: cat.strCategoryThumb
      }));

      const recetasTransformadas = recetasData
        .filter(data => data.meals?.[0])
        .map((data, index) => transformarRecetaAPI(data.meals[0], `random-${index}`));

      setCategorias(categoriasTransformadas);
      setRecetas(recetasTransformadas);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las recetas');
    } finally {
      setLoading(false);
    }
  };

  const buscarRecetas = async (texto) => {
    if (!texto.trim()) {
      setRecetas([]);
      setMostrarResultadosBusqueda(false);
      return;
    }

    try {
      setMostrarResultadosBusqueda(true);
      const searchTerm = Object.entries(spanishToEnglishDict).reduce((term, [es, en]) => 
        term.toLowerCase().includes(es) ? en : term, texto);
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      
      setRecetas(data.meals ? data.meals.map((meal, index) => transformarRecetaAPI(meal, `search-${index}`)) : []);
      
    } catch (error) {
      console.error('Error buscando recetas:', error);
      Alert.alert('Error', 'No se pudieron buscar las recetas');
      setRecetas([]);
    }
  };

  const filtrarPorCategoria = async (categoria) => {
    try {
      setMostrarResultadosBusqueda(true);
      setSearchText(categoria.nombre);
      
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria.nombre}`);
      const data = await response.json();
      
      if (data.meals) {
        const recetasDetalles = await Promise.all(
          data.meals.slice(0, 8).map((receta, index) => 
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${receta.idMeal}`)
              .then(res => res.json())
              .then(data => transformarRecetaAPI(data.meals[0], `cat-${receta.idMeal}-${index}`))
          )
        );
        setRecetas(recetasDetalles);
      } else {
        setRecetas([]);
      }
    } catch (error) {
      console.error('Error filtrando por categoría:', error);
      Alert.alert('Error', 'No se pudieron cargar las recetas de esta categoría');
    }
  };

  const transformarRecetaAPI = (recetaAPI, uniqueId) => {
    const ingredientes = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingrediente = recetaAPI[`strIngredient${i}`];
      const medida = recetaAPI[`strMeasure${i}`];
      
      if (ingrediente?.trim()) {
        ingredientes.push({
          cantidad: medida?.trim() || 'Al gusto',
          producto: ingrediente.trim(),
        });
      }
    }

    const pasos = recetaAPI.strInstructions 
      ? recetaAPI.strInstructions.split('\r\n').filter(paso => paso.trim())
      : ['No hay instrucciones disponibles'];

    return {
      id: uniqueId || recetaAPI.idMeal,
      nombre: recetaAPI.strMeal,
      imagen: recetaAPI.strMealThumb,
      categoria: recetaAPI.strCategory,
      area: recetaAPI.strArea,
      ingredientes,
      pasos,
      tiempo: '30 min'
    };
  };

  const renderCategoria = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoriaCard}
      onPress={() => filtrarPorCategoria(item)}
    >
      <Image source={{ uri: item.imagen }} style={styles.categoriaImagen} />
      <Text style={styles.categoriaNombre} numberOfLines={2}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const renderReceta = ({ item }) => (
    <TouchableOpacity 
      style={styles.recetaCard}
      onPress={() => navigation.navigate('RecetaDetalle', { receta: item })}
    >
      <Image source={{ uri: item.imagen }} style={styles.recetaImagen} />
      <View style={styles.recetaInfo}>
        <Text style={styles.recetaNombre}>{item.nombre}</Text>
        <View style={styles.recetaMeta}>
          <Text style={styles.recetaTiempo}>{item.tiempo}</Text>
          {item.area && <Text style={styles.recetaArea}>🍴 {item.area}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

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

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar recetas..."
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            buscarRecetas(text);
          }}
        />
        {(searchText || mostrarResultadosBusqueda) && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => { setSearchText(''); setRecetas([]); setMostrarResultadosBusqueda(false); }}
          >
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <FlatList
          data={categorias}
          renderItem={renderCategoria}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasList}
        />
      </View>

      <View style={styles.recetasSection}>
        <Text style={styles.sectionTitle}>
          {mostrarResultadosBusqueda ? 'Resultados' : 'Recetas Populares'}
        </Text>
        
        {recetas.length === 0 && mostrarResultadosBusqueda ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchText ? `No se encontraron recetas para "${searchText}"` : 'No hay recetas disponibles'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={recetas}
            renderItem={renderReceta}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.recetasList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { paddingHorizontal: 20, paddingBottom: 15 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0',
    marginHorizontal: 20, marginBottom: 10, borderRadius: 10, paddingHorizontal: 15, height: 50
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  clearButton: { padding: 5 },
  section: { marginBottom: 20 },
  recetasSection: { flex: 1, marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginHorizontal: 20, marginBottom: 15 },
  categoriasList: { paddingHorizontal: 15 },
  categoriaCard: {
    alignItems: 'center', backgroundColor: '#f8f8f8', padding: 12, borderRadius: 12,
    marginRight: 10, width: 90, height: 90, justifyContent: 'space-between'
  },
  categoriaImagen: { width: 45, height: 45, borderRadius: 22 },
  categoriaNombre: { fontSize: 11, fontWeight: '500', textAlign: 'center', color: '#333', lineHeight: 13 },
  recetasList: { paddingHorizontal: 20, paddingBottom: 20 },
  recetaCard: { flexDirection: 'row', backgroundColor: '#f8f8f8', marginBottom: 15, borderRadius: 12, overflow: 'hidden' },
  recetaImagen: { width: 100, height: 100 },
  recetaInfo: { flex: 1, padding: 15, justifyContent: 'center' },
  recetaNombre: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  recetaMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  recetaTiempo: { fontSize: 12, color: '#666' },
  recetaArea: { fontSize: 12, color: '#007AFF', fontWeight: '500' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  emptyStateText: { fontSize: 16, color: '#666', textAlign: 'center' },
});