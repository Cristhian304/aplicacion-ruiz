import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CrearCuenta({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCrearCuenta = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert('Éxito', '¡Cuenta creada exitosamente!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('InicioSesion')
      }
    ]);
  };

  const PasswordInput = ({ placeholder, value, onChangeText, show, setShow }) => (
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!show}
        autoCapitalize="none"
      />
      <TouchableOpacity 
        style={styles.eyeIcon}
        onPress={() => setShow(!show)}
      >
        <Ionicons 
          name={show ? 'eye-off' : 'eye'} 
          size={24} 
          color="#666" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetario</Text>
      
      <Text style={styles.subtitle}>Crea una cuenta</Text>
      <Text style={styles.instruction}>Ingrese sus datos para crear la cuenta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="email@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <PasswordInput 
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        show={showPassword}
        setShow={setShowPassword}
      />

      <PasswordInput 
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        show={showConfirmPassword}
        setShow={setShowConfirmPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleCrearCuenta}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerText}>
        Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc163',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
});