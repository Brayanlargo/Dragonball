import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { colores, formulario } from '../tema';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();

  let ganados = 0;
  let perdidos = 0;

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      // Guardar datos en Firestore con el mismo UID como ID del documento
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
        fecha,
        telefono,
        ganados,
        perdidos,
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    }
  };

  const campo = (etiqueta, valor, setValor, extra = {}) => (
    <>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        value={valor}
        onChangeText={setValor}
        style={styles.input}
        placeholderTextColor={colores.textoSuave}
        {...extra}
      />
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.pantalla} style={{ backgroundColor: colores.fondo }}>
      <View style={styles.caja}>
        <View style={styles.esfera}>
          <Text style={styles.estrella}>★★</Text>
        </View>
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Únete a los guerreros Z</Text>

        {campo('Nombre', nombre, setNombre, { placeholder: 'Son Goku' })}
        {campo('Correo', correo, setCorreo, { placeholder: 'goku@capsule.com', autoCapitalize: 'none', keyboardType: 'email-address' })}
        {campo('Contraseña', contrasena, setContrasena, { placeholder: 'Mínimo 6 caracteres', secureTextEntry: true })}
        {campo('Fecha de nacimiento', fecha, setFecha, { placeholder: 'YYYY-MM-DD' })}
        {campo('Teléfono', telefono, setTelefono, { placeholder: '300 123 4567', keyboardType: 'phone-pad' })}

        <TouchableOpacity style={styles.boton} onPress={handleRegistro}>
          <Text style={styles.botonTexto}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ...formulario,
  pantalla: { ...formulario.pantalla, flexGrow: 1 },
});