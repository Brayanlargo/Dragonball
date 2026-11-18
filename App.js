import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';
import Home from './src/componentes/Home';
import Original from './src/componentes/Original';
import Perfil from './src/componentes/Perfil';
import Logout from './src/componentes/Logout';
import { colores } from './src/tema';

const Tab = createBottomTabNavigator();

// Ícono de cada pestaña
const iconos = {
  Inicio: 'home',
  Juego: 'game-controller',
  Perfil: 'person',
  Salir: 'log-out',
  Login: 'log-in',
  Registro: 'person-add',
};

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colores.fondo }}>
        <ActivityIndicator size="large" color={colores.naranja} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconos[route.name]} size={size} color={color} />
          ),
          tabBarActiveTintColor: colores.naranja,
          tabBarInactiveTintColor: colores.textoSuave,
          tabBarStyle: {
            backgroundColor: colores.tarjeta,
            borderTopColor: colores.borde,
            height: 60,
            paddingBottom: 6,
          },
        })}
      >
        {usuario ? (
          <>
            <Tab.Screen name="Inicio" component={Home} />
            <Tab.Screen name="Juego" component={Original} />
            <Tab.Screen name="Perfil" component={Perfil} />
            <Tab.Screen name="Salir" component={Logout} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Registro" component={Registro} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}