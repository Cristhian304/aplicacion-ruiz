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
  const [traducciones, setTraducciones] = useState({});
  const [traduciendo, setTraduciendo] = useState(false);

  // Función de traducción
  const traducirTexto = async (texto, de = 'en', a = 'es') => {
    if (!texto || texto.trim() === '') return texto;
    
    // Cache de traducciones para evitar llamadas repetidas
    const cacheKey = `${texto}_${de}_${a}`;
    if (traducciones[cacheKey]) {
      return traducciones[cacheKey];
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${de}|${a}`
      );
      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        const textoTraducido = data.responseData.translatedText;
        // Actualizar cache
        setTraducciones(prev => ({
          ...prev,
          [cacheKey]: textoTraducido
        }));
        return textoTraducido;
      }
      return texto;
    } catch (error) {
      console.error('Error en traducción:', error);
      return texto; // Devuelve el texto original si hay error
    }
  };

  // Traducir todas las comidas
  const traducirComidas = async (comidasData) => {
    setTraduciendo(true);
    const comidasTraducidas = await Promise.all(
      comidasData.map(async (comida) => ({
        ...comida,
        strMealTraducido: await traducirTexto(comida.strMeal, 'en', 'es'),
        strCategoryTraducido: await traducirTexto(comida.strCategory, 'en', 'es'),
        strAreaTraducido: await traducirTexto(comida.strArea, 'en', 'es')
      }))
    );
    setTraduciendo(false);
    return comidasTraducidas;
  };

  // Traducir categorías
  const traducirCategorias = async (categoriasData) => {
    return await Promise.all(
      categoriasData.map(async (categoria) => ({
        ...categoria,
        strCategoryTraducido: await traducirTexto(categoria.strCategory, 'en', 'es'),
        strCategoryDescriptionTraducido: await traducirTexto(
          categoria.strCategoryDescription.substring(0, 100), 'en', 'es'
        )
      }))
    );
  };

  // Traducir ingredientes
  const traducirIngredientes = async (ingredientesData) => {
    return await Promise.all(
      ingredientesData.slice(0, 20).map(async (ingrediente) => ({
        ...ingrediente,
        strIngredientTraducido: await traducirTexto(ingrediente.strIngredient, 'en', 'es'),
        strDescriptionTraducido: ingrediente.strDescription 
          ? await traducirTexto(ingrediente.strDescription.substring(0, 100), 'en', 'es')
          : 'Sin descripción disponible'
      }))
    );
  };

  // Fetch comidas populares
  const fetchComidas = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();
      const comidasTraducidas = await traducirComidas(data.meals || []);
      setComidas(comidasTraducidas);
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
      const categoriasTraducidas = await traducirCategorias(data.categories || []);
      setCategorias(categoriasTraducidas);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  // Fetch ingredientes
  const fetchIngredientes = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
      const data = await response.json();
      const ingredientesTraducidos = await traducirIngredientes(data.meals || []);
      setIngredientes(ingredientesTraducidos);
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
        <Text style={styles.nombreComida}>
          {comida.strMealTraducido || comida.strMeal}
        </Text>
        <Text style={styles.categoriaComida}>
          {comida.strCategoryTraducido || comida.strCategory}
        </Text>
        <Text style={styles.areaComida}>
          {comida.strAreaTraducido || comida.strArea}
        </Text>
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
    if (loading || traduciendo) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffc163" />
          <Text style={styles.loadingText}>
            {traduciendo ? 'Traduciendo comidas...' : 'Cargando comidas...'}
          </Text>
        </View>
      );
    }

    const comidasMostrar = seccionActiva === 'Favoritas' 
      ? comidas.filter(comida => favoritas.includes(comida.idMeal))
      : comidas;

    if (comidasMostrar.length === 0 && seccionActiva === 'Favoritas') {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No tienes comidas favoritas aún</Text>
        </View>
      );
    }

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
          <Text style={styles.nombreCategoria}>
            {categoria.strCategoryTraducido || categoria.strCategory}
          </Text>
          <Text style={styles.descripcionCategoria}>
            {(categoria.strCategoryDescriptionTraducido || categoria.strCategoryDescription || '').substring(0, 60)}...
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderListaIngredientes = () => (
    <View style={styles.listaContainer}>
      {ingredientes.map((ingrediente, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.itemIngrediente}
          onPress={() => navigation.navigate('ComidasPorIngrediente', { ingrediente: ingrediente.strIngredient })}
        >
          <Text style={styles.nombreIngrediente}>
            {ingrediente.strIngredientTraducido || ingrediente.strIngredient}
          </Text>
          <Text style={styles.descripcionIngrediente}>
            {ingrediente.strDescriptionTraducido || 
             (ingrediente.strDescription ? 
              ingrediente.strDescription.substring(0, 80) + '...' : 'Sin descripción disponible')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Comidas</Text>
        {(loading || traduciendo) && (
          <Text style={styles.traduccionInfo}>Traduciendo contenido...</Text>
        )}
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  traduccionInfo: {
    fontSize: 12,
    color: '#ffc163',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
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