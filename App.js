import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function App() {
  // Datos de las recetas
  const recetaDestacada = {
    nombre: "Milanesa de Pollo",
    imagen: require('./assets/milanesadepollo.png')
  };

  const recetasSlider = [
    { id: 1, nombre: "Empanadas", imagen: require('./assets/empanadasdecarne.png') },
    { id: 2, nombre: "Omelette", imagen: require('./assets/omelette.png') },
    { id: 3, nombre: "Pizza", imagen: require('./assets/pizza.png') },
   { id: 4, nombre: "Arrabiata penne", imagen: require('./assets/arrabiatapenne.png') }

  ];

  const renderRecetaSlider = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.imagen} style={styles.slideImage} resizeMode="cover" />
      <Text style={styles.slideText}>{item.nombre}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={20} color="#007AFF" />
            <Text style={styles.headerText}> Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content}>
        {/* Título sobre la receta destacada */}
        <Text style={styles.destacadaTitulo}>Receta recomendada</Text>
        
        {/* Receta destacada */}
        <View style={styles.recetaDestacadaContainer}>
          <Image 
            source={recetaDestacada.imagen} 
            style={styles.recetaDestacadaImagen}
            resizeMode="cover"
          />
          <Text style={styles.recetaDestacadaNombre}>{recetaDestacada.nombre}</Text>
        </View>

        {/* Slider de recetas*/}
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

        {/* Lista de recetas probadas */}
        <Text style={styles.sectionTitle}>Recetas ya probadas</Text>
        {['Receta 1', 'Receta 2', 'Receta 3', 'Receta 4'].map((item, index) => (
          <View key={index} style={styles.recetaItem}>
            <Text style={styles.recetaNombre}>{item}</Text>
          </View>
        ))}

      </ScrollView>

      {/* Menú inferior */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="home" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="compass" size={24} color="#7f8c8d" />
          <Text style={styles.menuText}>Explorar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="clock" size={24} color="#7f8c8d" />
          <Text style={styles.menuText}>Historial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="person-outline" size={24} color="#7f8c8d" />
          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  time: {
    fontWeight: 'bold',
    fontSize: 16,
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
    marginBottom: 70,
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
    height: 180, // Reducido ligeramente
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
  productoItem: {
    padding: 15,
  },
  productoMarca: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productoNombre: {
    fontSize: 16,
    marginVertical: 3,
  },
  productoCodigo: {
    fontFamily: 'monospace',
    color: '#555',
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
});