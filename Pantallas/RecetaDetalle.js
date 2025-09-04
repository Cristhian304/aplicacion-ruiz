import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Linking } from 'react-native';

export default function RecetaDetalle({ route }) {
  const { receta } = route.params;

  // Función para determinar la fuente de la imagen
  const getImageSource = () => {
    if (typeof receta.imagen === 'string') {
      // Si es string, es URL de API
      return { uri: receta.imagen };
    } else {
      // Si no, es require() local
      return receta.imagen;
    }
  };

  const handleYoutubePress = () => {
    if (receta.youtube) {
      Linking.openURL(receta.youtube);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Image 
          source={getImageSource()}  // ← Usamos la función aquí
          style={styles.imagenReceta}
          resizeMode="cover"
        />
        
        <Text style={styles.titulo}>{receta.nombre}</Text>

        <View style={styles.seccion}>
          <Text style={styles.subtitulo}>Ingredientes</Text>
          {receta.ingredientes.map((ingrediente, index) => (
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
          <Text style={styles.subtitulo}>Preparación</Text>
          {receta.pasos.map((paso, index) => (
            <View key={index} style={styles.paso}>
              <Text style={styles.numeroPaso}>{index + 1}.</Text>
              <Text style={styles.textoPaso}>{paso}</Text>
            </View>
          ))}
        </View>

        {receta.youtube && (
          <Text style={styles.youtubeLink} onPress={handleYoutubePress}>
            🎥 Ver video en YouTube
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
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
  },
  producto: {
    flex: 1,
    fontSize: 16,
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
  },
  textoPaso: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  youtubeLink: {
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});