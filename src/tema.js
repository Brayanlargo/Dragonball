// src/tema.js
// Colores y estilos compartidos por todas las pantallas
export const colores = {
  fondo: '#0b1d3a',
  tarjeta: '#13294b',
  naranja: '#f57c00',
  amarillo: '#ffc107',
  texto: '#ffffff',
  textoSuave: '#a9b8d0',
  borde: '#2a4470',
  verde: '#43a047',
  rojo: '#e53935',
};

// Estilos de formulario reutilizados en Login, Registro y Perfil
export const formulario = {
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  caja: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colores.tarjeta,
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  esfera: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colores.naranja,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: colores.amarillo,
  },
  estrella: { fontSize: 30, color: colores.rojo },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colores.amarillo,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.textoSuave,
    textAlign: 'center',
    marginBottom: 20,
  },
  etiqueta: { color: colores.textoSuave, fontSize: 13, marginBottom: 5 },
  input: {
    backgroundColor: colores.fondo,
    color: colores.texto,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
  },
  boton: {
    backgroundColor: colores.naranja,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  botonTexto: { color: colores.texto, fontWeight: 'bold', fontSize: 16 },
  enlace: { color: colores.amarillo, textAlign: 'center', marginTop: 18 },
};