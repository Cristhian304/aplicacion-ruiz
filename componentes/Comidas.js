import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Comidas = ({ navigation }) => {
  const [seccionActiva, setSeccionActiva] = useState('Todas');
  const [comidas, setComidas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritas, setFavoritas] = useState([]);

  // Fetch comidas populares
  const fetchComidas = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      setComidas(data.meals || []);
    } catch (error) {
      console.error('Error fetching comidas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categorías
  const fetchCategorias = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategorias(data.categories || []);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  // Fetch ingredientes
  const fetchIngredientes = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
      const data = await response.json();
      setIngredientes(data.meals || []);
    } catch (error) {
      console.error('Error fetching ingredientes:', error);
    }
  };

  useEffect(() => {
    fetchComidas();
    fetchCategorias();
    fetchIngredientes();
  }, []);

  const toggleFavorita = (comidaId) => {
    if (favoritas.includes(comidaId)) {
      setFavoritas(favoritas.filter(id => id !== comidaId));
    } else {
      setFavoritas([...favoritas, comidaId]);
    }
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

  const renderItemComida = (comida) => (
    <TouchableOpacity 
      key={comida.idMeal} 
      style={styles.itemComida}
      onPress={() => navigation.navigate('DetalleComida', { comida })}
    >
      <Image 
        source={{ uri: comida.strMealThumb }} 
        style={styles.comidaImagen}
        resizeMode="cover"
      />
      <View style={styles.infoComida}>
        <Text style={styles.nombreComida}>{comida.strMeal}</Text>
        <Text style={styles.categoriaComida}>{comida.strCategory}</Text>
        <Text style={styles.areaComida}>{comida.strArea}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorita(comida.idMeal)}>
        <Ionicons 
          name={favoritas.includes(comida.idMeal) ? "heart" : "heart-outline"} 
          size={24} 
          color={favoritas.includes(comida.idMeal) ? "#ff6b6b" : "#666"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderListaComidas = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffc163" />
          <Text style={styles.loadingText}>Cargando comidas...</Text>
        </View>
      );
    }

    const comidasMostrar = seccionActiva === 'Favoritas' 
      ? comidas.filter(comida => favoritas.includes(comida.idMeal))
      : comidas;

    return (
      <View style={styles.listaContainer}>
        {comidasMostrar.map(renderItemComida)}
      </View>
    );
  };

  const renderGridCategorias = () => (
    <View style={styles.gridContainer}>
      {categorias.map((categoria) => (
        <TouchableOpacity 
          key={categoria.idCategory} 
          style={styles.itemCategoria}
          onPress={() => navigation.navigate('ComidasPorCategoria', { categoria: categoria.strCategory })}
        >
          <Image 
            source={{ uri: categoria.strCategoryThumb }} 
            style={styles.categoriaImagen}
            resizeMode="cover"
          />
          <Text style={styles.nombreCategoria}>{categoria.strCategory}</Text>
          <Text style={styles.descripcionCategoria}>{categoria.strCategoryDescription.substring(0, 60)}...</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderListaIngredientes = () => (
    <View style={styles.listaContainer}>
      {ingredientes.slice(0, 20).map((ingrediente, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.itemIngrediente}
          onPress={() => navigation.navigate('ComidasPorIngrediente', { ingrediente: ingrediente.strIngredient })}
        >
          <Text style={styles.nombreIngrediente}>{ingrediente.strIngredient}</Text>
          <Text style={styles.descripcionIngrediente}>{ingrediente.strDescription ? 
            ingrediente.strDescription.substring(0, 80) + '...' : 'Sin descripción disponible'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Comidas</Text>
      </View>

      {renderSeccionBotones()}

      <ScrollView style={styles.contenido} contentContainerStyle={styles.contenidoCompacto}>
        {seccionActiva === 'Todas' && renderListaComidas()}
        {seccionActiva === 'Favoritas' && renderListaComidas()}
        {seccionActiva === 'categorias' && renderGridCategorias()}
        {seccionActiva === 'Ingredientes' && renderListaIngredientes()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
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
    paddingVertical: 4,
  },
  botonSeccion: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
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
  },
  contenidoCompacto: {
    padding: 0,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listaContainer: {
    padding: 0,
  },
  itemComida: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  comidaImagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  infoComida: {
    flex: 1,
  },
  nombreComida: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoriaComida: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  areaComida: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  itemCategoria: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
    padding: 8,
    alignItems: 'center',
  },
  categoriaImagen: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  nombreCategoria: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  descripcionCategoria: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  itemIngrediente: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nombreIngrediente: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descripcionIngrediente: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default Comidas;