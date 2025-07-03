// inicioSesion.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const InicioSesion = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleInicioSesion = () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    // Aquí iría la lógica para validar el usuario (ej: API, Firebase, etc.)
    Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
    navigation.navigate('Home'); // Redirige al home después de iniciar sesión
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
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.boton} onPress={handleInicioSesion}>
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('CrearCuenta')}>
        <Text style={styles.enlace}>¿No tienes cuenta? <Text style={styles.enlaceNegrita}>Regístrate aquí</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
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

export default InicioSesion;