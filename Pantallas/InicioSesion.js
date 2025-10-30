import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InicioSesion({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleInicioSesion = () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    
    Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
    navigation.navigate('MainApp');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View style={styles.contenedorContrasena}>
        <TextInput
          style={styles.inputContrasena}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry={!mostrarContrasena}
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.botonOjo}
          onPress={() => setMostrarContrasena(!mostrarContrasena)}
        >
          <Ionicons 
            name={mostrarContrasena ? 'eye-off' : 'eye'} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.boton} onPress={handleInicioSesion}>
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('CrearCuenta')}>
        <Text style={styles.enlace}>¿No tienes cuenta? <Text style={styles.enlaceNegrita}>Regístrate aquí</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffc163',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  contenedorContrasena: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputContrasena: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  botonOjo: {
    padding: 10,
  },
  boton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  enlace: {
    textAlign: 'center',
    color: '#666',
  },
  enlaceNegrita: {
    fontWeight: 'bold',
    color: '#007bff',
  },
});