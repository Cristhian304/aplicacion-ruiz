// RecetaDetalle.js - Con mejor visualización de textos
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Linking, TouchableOpacity, ActivityIndicator } from 'react-native';
import { translateRecipe } from '../services/translationService';

// Función helper para decodificar textos (por si acaso)
const decodeText = (text) => {
  if (!text) return text;
  try {
    return decodeURIComponent(text.toString().replace(/\+/g, ' '));
  } catch (error) {
    return text.toString().replace(/%20/g, ' ').replace(/\+/g, ' ');
  }
};

export default function RecetaDetalle({ route }) {
  const { receta } = route.params;
  const [translatedRecipe, setTranslatedRecipe] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [translationStatus, setTranslationStatus] = useState('');

  // Asegurarnos de que los textos estén decodificados para mostrar
  const getCurrentRecipe = () => {
    const recipeToShow = translatedRecipe || receta;
    return {
      ...recipeToShow,
      nombre: decodeText(recipeToShow.nombre),
      categoria: decodeText(recipeToShow.categoria),
      area: decodeText(recipeToShow.area),
      dificultad: decodeText(recipeToShow.dificultad),
      ingredientes: recipeToShow.ingredientes.map(ing => ({
        ...ing,
        cantidad: decodeText(ing.cantidad),
        producto: decodeText(ing.producto),
        indicacion: decodeText(ing.indicacion)
      })),
      pasos: recipeToShow.pasos.map(paso => decodeText(paso))
    };
  };

  const currentRecipe = getCurrentRecipe();
  const isTranslated = !!translatedRecipe;

  const getImageSource = () => {
    if (typeof receta.imagen === 'string') {
      return { uri: receta.imagen };
    } else {
      return receta.imagen;
    }
  };

  const handleTranslate = async () => {
    try {
      setTranslating(true);
      setTranslationStatus('🔄 Traduciendo receta...');
      
      console.log('📥 Receta original recibida:', {
        nombre: receta.nombre,
        ingredientes: receta.ingredientes.slice(0, 2),
        pasos: receta.pasos.slice(0, 1)
      });
      
      const translated = await translateRecipe(receta);
      
      console.log('📤 Receta traducida:', {
        nombre: translated.nombre,
        ingredientes: translated.ingredientes.slice(0, 2),
        pasos: translated.pasos.slice(0, 1)
      });
      
      setTranslatedRecipe(translated);
      setTranslationStatus('✅ ¡Traducción completada!');
      
    } catch (error) {
      console.log('Error en traducción:', error);
      setTranslationStatus('❌ Error en traducción');
    } finally {
      setTranslating(false);
      setTimeout(() => setTranslationStatus(''), 3000);
    }
  };

  const handleResetTranslation = () => {
    setTranslatedRecipe(null);
    setTranslationStatus('↩️ Mostrando texto original');
    setTimeout(() => setTranslationStatus(''), 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Image 
          source={getImageSource()}
          style={styles.imagenReceta}
          resizeMode="cover"
        />
        
        <View style={styles.header}>
          <Text style={styles.titulo}>{currentRecipe.nombre}</Text>
          
          {currentRecipe.categoria && (
            <Text style={styles.categoria}>{currentRecipe.categoria}</Text>
          )}
          
          {currentRecipe.area && (
            <Text style={styles.area}>{currentRecipe.area}</Text>
          )}
          
          {currentRecipe.dificultad && (
            <Text style={styles.dificultad}>Dificultad: {currentRecipe.dificultad}</Text>
          )}
          
          {translationStatus ? (
            <Text style={styles.statusText}>{translationStatus}</Text>
          ) : null}
          
          <View style={styles.buttonContainer}>
            {!isTranslated ? (
              <TouchableOpacity 
                style={styles.translateButton}
                onPress={handleTranslate}
                disabled={translating}
              >
                {translating ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.translateButtonText}> Traduciendo...</Text>
                  </View>
                ) : (
                  <Text style={styles.translateButtonText}>🌍 Traducir al Español</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleResetTranslation}
              >
                <Text style={styles.resetButtonText}>↩️ Mostrar Original</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.subtitulo}>📋 Ingredientes</Text>
          {currentRecipe.ingredientes.map((ingrediente, index) => (
            <View key={index} style={styles.ingrediente}>
              <Text style={styles.cantidad}>{ingrediente.cantidad}</Text>
              <Text style={styles.producto}>{ingrediente.producto}</Text>
              {ingrediente.indicacion && (
                <Text style={styles.indicacion}>({ingrediente.indicacion})</Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.seccion}>
          <Text style={styles.subtitulo}>👨‍🍳 Preparación</Text>
          {currentRecipe.pasos.map((paso, index) => (
            <View key={index} style={styles.paso}>
              <Text style={styles.numeroPaso}>{index + 1}.</Text>
              <Text style={styles.textoPaso}>{paso}</Text>
            </View>
          ))}
        </View>

        {currentRecipe.youtube && (
          <Text style={styles.youtubeLink} onPress={() => Linking.openURL(currentRecipe.youtube)}>
            📺 Ver video en YouTube
          </Text>
        )}

        {isTranslated && (
          <Text style={styles.translationNote}>
            🌐 Traducido con MyMemory Translator API
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

// Los styles se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  imagenReceta: {
    width: '100%',
    height: 250,
  },
  header: {
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  categoria: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  area: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  dificultad: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  statusText: {
    textAlign: 'center',
    color: '#007AFF',
    fontStyle: 'italic',
    marginBottom: 10,
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  translateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 200,
  },
  translateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 200,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  seccion: {
    marginHorizontal: 15,
    marginBottom: 25,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007AFF',
  },
  ingrediente: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  cantidad: {
    width: 80,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  producto: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  indicacion: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  paso: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  numeroPaso: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  textoPaso: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  youtubeLink: {
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  translationNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 20,
  },
});