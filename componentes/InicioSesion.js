import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// ✅ CORRECCIÓN 1: Usar la IP real de tu PC y el puerto 3000
// ASEGÚRATE DE QUE ESTA IP (10.0.7.172) SEA LA IP CORRECTA DE TU MÁQUINA
const API_BASE_URL = 'http://10.0.7.172:3000';

const InicioSesion = ({ navigation }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mostrarContrasena, setMostrarContrasena] = useState(false); 

    const handleInicioSesion = async () => {
        if (!correo || !contrasena) {
            Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
            return;
        }
        
        // --- CONEXIÓN AL BACKEND ---
        try {
            // ✅ CORRECCIÓN 2: Se agrega el prefijo /api
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: correo,
                    password: contrasena,
                }),
            });

            // Manejo de errores no JSON (como el HTML de un 404/proxy)
            if (!response.ok && response.headers.get('content-type') !== 'application/json') {
                 const text = await response.text(); 
                 console.log("Error de respuesta no JSON:", text);
                 Alert.alert('Error de Servidor', 'El servidor devolvió un error inesperado. Revisa la ruta /api/login.');
                 return;
            }

            const data = await response.json();

            if (response.ok && data.token) {
                // ÉXITO: Guarda el token JWT y navega
                await AsyncStorage.setItem('userToken', data.token);
                
                Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
                
                // 🚀 NAVEGACIÓN SOLICITADA: Lleva a Comidas.js
                navigation.navigate('Comidas'); 
            } else {
                // Error de credenciales (401) o de servidor (500)
                Alert.alert('Error', data.message || 'Correo o contraseña incorrectos.');
            }
        } catch (error) {
            console.error("Error de red:", error);
            Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu IP y la conexión.');
        }
        // -----------------------------
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
            
            <View style={styles.contenedorContrasena}>
                <TextInput
                    style={styles.inputContrasena}
                    placeholder="Contraseña"
                    value={contrasena}
                    onChangeText={setContrasena}
                    secureTextEntry={!mostrarContrasena} 
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
};

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
    },
    inputContrasena: {
        flex: 1,
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    botonOjo: {
        position: 'absolute',
        right: 15,
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

export default InicioSesion;