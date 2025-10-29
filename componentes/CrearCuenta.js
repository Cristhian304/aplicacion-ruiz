import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

// 🚀 CAMBIO CLAVE 1: Debe incluir el puerto 3000
// ASEGÚRATE DE QUE ESTA IP (10.0.7.172) SEA LA IP LOCAL DE TU COMPUTADORA
const API_BASE_URL = 'http://10.0.7.172:3000'; 

export default function CrearCuenta({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleCrearCuenta = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        // --- CONEXIÓN AL BACKEND ---
        try {
            // 🚀 CAMBIO CLAVE 2: Incluye el prefijo /api/
            const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: 'Nuevo Usuario',
                    email: email,
                    password: password,
                }),
            });

            // Verifica si la respuesta es OK antes de intentar parsear el JSON
            if (!response.ok && response.headers.get('content-type') !== 'application/json') {
                 // Si falla, pero no devuelve JSON (como el error HTML que tenías)
                const text = await response.text(); 
                console.log("Error de respuesta no JSON:", text);
                Alert.alert('Error de Servidor', 'El servidor devolvió un error inesperado (no JSON). Revisa logs de Express.');
                return;
            }

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Éxito', '¡Cuenta creada exitosamente! Ahora inicia sesión.');
                navigation.navigate('InicioSesion'); 
            } else {
                // Muestra el mensaje de error del backend (ej: "El correo ya está registrado")
                Alert.alert('Error', data.message || 'Error al crear la cuenta.');
            }
        } catch (error) {
            console.log("Error de red:", error);
            Alert.alert('Error', 'No se pudo conectar con el servidor. Verifica tu IP, puerto y la conexión de Docker.');
        }
        // -----------------------------
    };

    // ... (El resto de tu componente JSX con los estilos) ...
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
            />
            
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#666" 
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Ionicons 
                        name={showConfirmPassword ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#666" 
                    />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleCrearCuenta}>
                <Text style={styles.buttonText}>Crear Cuenta</Text>
            </TouchableOpacity>
            
            <Text style={styles.orText}>o</Text>
            
            <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continuar con Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continuar con Apple</Text>
            </TouchableOpacity>
            
            <Text style={styles.footerText}>
                Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
            </Text>
            
            <StatusBar style="auto" />
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
        backgroundColor: '#007bff',
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
    orText: {
        marginVertical: 10,
        color: '#666',
    },
    socialButton: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    socialButtonText: {
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