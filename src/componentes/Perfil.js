// src/componentes/Perfil.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { colores, formulario } from '../tema';

export default function Perfil() {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombre(data.nombre || '');
        setFecha(data.fecha || '');
        setTelefono(data.telefono || '');
        setGanados(data.ganados || 0);
        setPerdidos(data.perdidos || 0);
      } else {
        Alert.alert('Usuario no encontrado');
      }
      setCargando(false);
    };
    traerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      await updateDoc(docRef, { nombre, fecha, telefono });
      Alert.alert('Datos actualizados');
    } catch (error) {
      console.error(error);
      Alert.alert('Error al actualizar');
    }
  };

  if (cargando) {
    return (
      <View style={styles.pantalla}>
        <ActivityIndicator size="large" color={colores.naranja} />
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.caja}>
        <View style={styles.esfera}>
          <Text style={styles.inicial}>{nombre ? nombre[0].toUpperCase() : '?'}</Text>
        </View>
        <Text style={styles.titulo}>{nombre || 'Mi perfil'}</Text>
        <Text style={styles.subtitulo}>{auth.currentUser?.email}</Text>

        {/* Estadísticas del juego */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statNumero, { color: colores.verde }]}>{ganados}</Text>
            <Text style={styles.statTexto}>Ganados</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumero, { color: colores.rojo }]}>{perdidos}</Text>
            <Text style={styles.statTexto}>Perdidos</Text>
          </View>
        </View>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

        <Text style={styles.etiqueta}>Fecha de nacimiento</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colores.textoSuave}
          value={fecha}
          onChangeText={setFecha}
        />

        <Text style={styles.etiqueta}>Teléfono</Text>
        <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.boton} onPress={actualizarDatos}>
          <Text style={styles.botonTexto}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ...formulario,
  inicial: { fontSize: 32, fontWeight: 'bold', color: colores.texto },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  stat: {
    alignItems: 'center',
    backgroundColor: colores.fondo,
    paddingVertical: 10,
    width: '45%',
    borderRadius: 10,
  },
  statNumero: { fontSize: 24, fontWeight: 'bold' },
  statTexto: { color: colores.textoSuave, fontSize: 12 },
});