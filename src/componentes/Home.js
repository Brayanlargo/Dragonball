// src/componentes/Home.js
// Lista todos los personajes de la Dragon Ball API con buscador por nombre
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import { colores } from '../tema';

export default function Home() {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // El API viene paginado: recorremos "links.next" hasta traer todos
        let url = 'https://dragonball-api.com/api/characters?limit=20';
        let todos = [];
        while (url) {
          const res = await fetch(url);
          const json = await res.json();
          todos = [...todos, ...json.items];
          url = json.links.next; // cuando no hay más páginas viene ""
        }
        setData(todos);
      } catch (error) {
        console.error('Error al obtener personajes:', error);
      }
      setCargando(false);
    };
    obtenerDatos();
  }, []);

  const filtrados = data.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.naranja} />
        <Text style={styles.dato}>Cargando guerreros...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      <Text style={styles.titulo}>Personajes de Dragon Ball</Text>
      <Text style={styles.contador}>{filtrados.length} guerreros</Text>
      <TextInput
        style={styles.buscador}
        placeholderTextColor={colores.textoSuave}
        placeholder="🔍 Buscar personaje..."
        value={busqueda}
        onChangeText={setBusqueda}
      />
      <View style={styles.lista}>
        {filtrados.map((personaje) => (
          <View key={personaje.id} style={styles.item}>
            <Image source={{ uri: personaje.image }} style={styles.imagen} />
            <Text style={styles.nombre}>{personaje.id} - {personaje.name}</Text>
            <Text style={styles.dato}>{personaje.race} · {personaje.gender}</Text>
            <Text style={styles.dato}>Ki: {personaje.ki}</Text>
            <Text style={styles.afiliacion}>{personaje.affiliation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: { backgroundColor: colores.fondo },
  contenido: { width: '100%', maxWidth: 1000, alignSelf: 'center', paddingBottom: 20 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colores.fondo },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 20, color: colores.amarillo },
  contador: { textAlign: 'center', color: colores.textoSuave, marginTop: 4 },
  buscador: {
    margin: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 25,
    backgroundColor: colores.tarjeta,
    color: colores.texto,
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: colores.tarjeta,
    width: 165,
    padding: 12,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  imagen: { width: 120, height: 170, resizeMode: 'contain' },
  nombre: { fontWeight: 'bold', marginTop: 8, textAlign: 'center', color: colores.texto, fontSize: 15 },
  dato: { fontSize: 12, color: colores.textoSuave, marginTop: 2 },
  afiliacion: {
    fontSize: 11,
    color: colores.fondo,
    backgroundColor: colores.naranja,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
});