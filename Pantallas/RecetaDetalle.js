import React, { useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, Image, StyleSheet, 
  TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { translateRecipe } from '../services/translationService';

export default function RecetaDetalle({ route }) {
  const { receta } = route.params;
  const [translatedRecipe, setTranslatedRecipe] = useState(null);
  const [translating, setTranslating] = useState(true);

  // Efecto para traducción automática al cargar la pantalla
  useEffect(() => {
    const translateRecipeAsync = async () => {
      setTranslating(true);
      try {
        const translated = await translateRecipe(receta);
        setTranslatedRecipe(translated);
      } catch (error) {
        console.log('Error en traducción:', error);
        setTranslatedRecipe(receta); // Fallback a receta original
      } finally {
        setTranslating(false);
      }
    };
    
    translateRecipeAsync();
  }, []);

  // Usar receta traducida o la original como fallback
  const currentRecipe = translatedRecipe || receta;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Imagen principal de la receta */}
        <Image 
          source={typeof currentRecipe.imagen === 'string' ? 
            { uri: currentRecipe.imagen } : currentRecipe.imagen}
          style={styles.imagenReceta}
        />
        
        {/* Header con título y categoría */}
        <View style={styles.header}>
          <Text style={styles.titulo}>{currentRecipe.nombre}</Text>
          {currentRecipe.categoria && (
            <Text style={styles.categoria}>{currentRecipe.categoria}</Text>
          )}

          {/* Indicador visual de traducción en proceso */}
          {translating && (
            <View style={styles.translatingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.translatingText}>Traduciendo...</Text>
            </View>
          )}
        </View>

        {/* Sección de ingredientes */}
        <View style={styles.seccion}>
          <Text style={styles.subtitulo}>📋 Ingredientes</Text>
          {currentRecipe.ingredientes.map((ingrediente, index) => (
            <View key={index} style={styles.ingrediente}>
              <Text style={styles.cantidad}>{ingrediente.cantidad}</Text>
              <Text style={styles.producto}>{ingrediente.producto}</Text>
            </View>
          ))}
        </View>

        {/* Sección de pasos de preparación */}
        <View style={styles.seccion}>
          <Text style={styles.subtitulo}>👨‍🍳 Preparación</Text>
          {translating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Traduciendo pasos...</Text>
            </View>
          ) : (
            currentRecipe.pasos.map((paso, index) => (
              <View key={index} style={styles.paso}>
                <Text style={styles.numeroPaso}>{index + 1}.</Text>
                <Text style={styles.textoPaso}>{paso}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  imagenReceta: { width: '100%', height: 250 },
  header: { padding: 15, marginVertical: 15 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 10 },
  categoria: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 15 },
  translatingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  translatingText: { marginLeft: 10, color: '#007AFF', fontSize: 14 },
  seccion: { margin: 15, marginBottom: 25 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#007AFF' },
  ingrediente: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  cantidad: { width: 80, fontWeight: 'bold', fontSize: 16, color: '#333' },
  producto: { flex: 1, fontSize: 16, color: '#333' },
  paso: { flexDirection: 'row', marginBottom: 12 },
  numeroPaso: { fontWeight: 'bold', marginRight: 8, fontSize: 16, color: '#007AFF' },
  textoPaso: { flex: 1, fontSize: 16, color: '#333', lineHeight: 22 },
  loadingContainer: { alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#666' }
});