import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { colores, formulario } from '../tema';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    }
  };

  return (
    <View style={styles.pantalla}>
      <View style={styles.caja}>
        <View style={styles.esfera}>
          <Text style={styles.estrella}>★</Text>
        </View>
        <Text style={styles.titulo}>Dragon Ball App</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>

        <Text style={styles.etiqueta}>Correo electrónico</Text>
        <TextInput
          placeholder="goku@capsule.com"
          placeholderTextColor={colores.textoSuave}
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.etiqueta}>Contraseña</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colores.textoSuave}
          value={contrasena}
          onChangeText={setContrasena}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.boton} onPress={handleLogin}>
          <Text style={styles.botonTexto}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.enlace}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(formulario);