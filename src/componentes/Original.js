// src/componentes/Original.js
// Juego "¿Quién es este guerrero?": se muestra la silueta de un personaje
// y el jugador elige entre 4 opciones. Los aciertos/fallos se guardan en Firestore.
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { colores } from '../tema';

export default function Original() {
  const [personajes, setPersonajes] = useState([]);
  const [actual, setActual] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [respuesta, setRespuesta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userWin, setUserWin] = useState(0);
  const [userLose, setUserLose] = useState(0);
  const [racha, setRacha] = useState(0);
  const [uid, setUid] = useState(null);

  // Escuchar el login del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return unsubscribe;
  }, []);

  // Obtener estadísticas del usuario desde Firestore
  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserWin(data.ganados || 0);
        setUserLose(data.perdidos || 0);
      } else {
        await setDoc(docRef, { ganados: 0, perdidos: 0 });
      }
    };
    traerDatos();
  }, [uid]);

  // Traer todos los personajes del API (viene paginado)
  useEffect(() => {
    const obtenerPersonajes = async () => {
      try {
        let url = 'https://dragonball-api.com/api/characters?limit=20';
        let todos = [];
        while (url) {
          const res = await fetch(url);
          const json = await res.json();
          todos = [...todos, ...json.items];
          url = json.links.next;
        }
        setPersonajes(todos);
        nuevaRonda(todos);
      } catch (err) {
        console.error('Error al obtener personajes:', err);
      }
    };
    obtenerPersonajes();
  }, []);

  // Elige un personaje al azar y 3 nombres incorrectos
  const nuevaRonda = (lista = personajes) => {
    const correcto = lista[Math.floor(Math.random() * lista.length)];
    const incorrectos = lista
      .filter((p) => p.id !== correcto.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((p) => p.name);
    const mezcladas = [...incorrectos, correcto.name].sort(() => Math.random() - 0.5);

    setActual(correcto);
    setOpciones(mezcladas);
    setRespuesta(null);
    setLoading(false);
  };

  const guardarResultado = async (acierto) => {
    if (!uid) return;
    const fecha = new Date().toISOString();
    try {
      // Guardar resultado individual
      await setDoc(doc(db, 'resultados', `${uid}_${fecha}`), {
        uid,
        personaje: actual.name,
        aciertos: acierto ? 1 : 0,
        errores: acierto ? 0 : 1,
        fecha,
      });
      // Actualizar ganados/perdidos del usuario
      await updateDoc(doc(db, 'usuarios', uid), {
        ganados: acierto ? userWin + 1 : userWin,
        perdidos: !acierto ? userLose + 1 : userLose,
      });
    } catch (e) {
      console.error('Error al guardar resultado:', e);
    }
  };

  const elegir = async (nombre) => {
    if (respuesta) return;
    setRespuesta(nombre);
    const acierto = nombre === actual.name;
    if (acierto) {
      setUserWin(userWin + 1);
      setRacha(racha + 1);
    } else {
      setUserLose(userLose + 1);
      setRacha(0);
    }
    await guardarResultado(acierto);
  };

  const colorOpcion = (nombre) => {
    if (!respuesta) return styles.opcion;
    if (nombre === actual.name) return [styles.opcion, styles.correcta];
    if (nombre === respuesta) return [styles.opcion, styles.incorrecta];
    return [styles.opcion, styles.deshabilitada];
  };

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.container}>
      <Text style={styles.title}>¿Quién es este guerrero?</Text>
      <View style={styles.statsFila}>
        <Text style={[styles.chip, { backgroundColor: colores.verde }]}>✔ {userWin}</Text>
        <Text style={[styles.chip, { backgroundColor: colores.rojo }]}>✘ {userLose}</Text>
        <Text style={[styles.chip, { backgroundColor: colores.naranja }]}>🔥 {racha}</Text>
      </View>

      {loading || !actual ? (
        <ActivityIndicator size="large" color={colores.naranja} />
      ) : (
        <>
          {/* tintColor convierte la imagen en silueta hasta que responde */}
          <Image
            source={{ uri: actual.image }}
            style={[styles.image, !respuesta && { tintColor: 'black' }]}
          />

          {!respuesta && <Text style={styles.pista}>Pista: es de raza {actual.race}</Text>}

          {opciones.map((nombre) => (
            <TouchableOpacity
              key={nombre}
              style={colorOpcion(nombre)}
              onPress={() => elegir(nombre)}
              disabled={!!respuesta}
            >
              <Text style={styles.opcionTexto}>{nombre}</Text>
            </TouchableOpacity>
          ))}

          {respuesta && (
            <>
              {respuesta === actual.name ? (
                <Text style={styles.won}>🎉 ¡Correcto! Es {actual.name}</Text>
              ) : (
                <Text style={styles.lost}>💀 ¡Fallaste! Era {actual.name}</Text>
              )}
              <Text style={styles.info}>
                {actual.race} · Ki: {actual.ki} · Ki máximo: {actual.maxKi}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => nuevaRonda()}>
                <Text style={styles.buttonText}>Siguiente personaje</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: { backgroundColor: colores.fondo },
  container: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    flexGrow: 1,
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 12, color: colores.amarillo },
  statsFila: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  chip: {
    color: colores.texto,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: { width: 200, height: 260, resizeMode: 'contain', marginVertical: 15 },
  pista: { fontStyle: 'italic', color: colores.textoSuave, marginBottom: 12 },
  opcion: {
    width: '100%',
    padding: 14,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: colores.tarjeta,
    borderWidth: 2,
    borderColor: colores.borde,
    alignItems: 'center',
  },
  opcionTexto: { fontSize: 16, fontWeight: 'bold', color: colores.texto },
  correcta: { backgroundColor: colores.verde, borderColor: colores.verde },
  incorrecta: { backgroundColor: colores.rojo, borderColor: colores.rojo },
  deshabilitada: { opacity: 0.4 },
  won: { color: colores.verde, fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  lost: { color: colores.rojo, fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  info: { fontSize: 13, color: colores.textoSuave, textAlign: 'center', marginTop: 5 },
  button: {
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: colores.naranja,
    borderRadius: 25,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});