import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function PantallaPrincipal() {
  return (
    <ScrollView style={styles.contenedor}>
     
      <View style={styles.encabezado}>
        <Text style={styles.hora}>9:41</Text>
        <View style={styles.botonesSuperiores}>
          <TouchableOpacity>
            <Text style={styles.textoBoton}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.textoBoton}>Receta recomendada</Text>
          </TouchableOpacity>
        </View>
      </View>

      
      <Text style={styles.tituloSeccion}>Recetas ya probadas</Text>
      {['Receta 1', 'Receta 2', 'Receta 3', 'Receta 4'].map((receta, index) => (
        <TouchableOpacity key={index} style={styles.tarjeta}>
          <Text>{receta}</Text>
        </TouchableOpacity>
      ))}

     
      <Text style={styles.tituloSeccion}>Productos</Text>
      {['Marca Producto 1', 'Marca Producto 2', 'etn.aa', 'etn.c'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.tarjeta}>
          <Text>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { padding: 16 },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  hora: { fontWeight: 'bold' },
  botonesSuperiores: { flexDirection: 'row', gap: 16 },
  textoBoton: { color: '#007AFF' },
  tituloSeccion: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  tarjeta: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
});