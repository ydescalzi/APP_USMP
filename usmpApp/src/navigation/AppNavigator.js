import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';

/* ======================
    ESTUDIANTE
====================== */
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ReceiptsScreen from '../screens/receipts/ReceiptsScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import AttendanceDetailScreen from '../screens/attendance/AttendanceDetailScreen'; // Nueva pantalla de detalle
import MatriculaScreen from '../screens/matricula/MatriculaScreen';
import MallaScreen from '../screens/malla/MallaScreen';
import HorarioScreen from '../screens/horario/HorarioScreen';
import TramiteScreen from '../screens/tramite/TramiteScreen'; 

/* ======================
    DOCENTE
====================== */
import HomeDocScreen from '../screens/home/HomeDocScreen';
import PerfilDocScreen from '../screens/docente/PerfilDocScreen';
import MarcacionesScreen from '../screens/docente/MarcacionesScreen';
import AsistenciasDocScreen from '../screens/docente/AsistenciasDocScreen';
import HorarioDocScreen from '../screens/docente/HorarioDocScreen';
import ManualesScreen from '../screens/docente/ManualesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* SPLASH */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      {/* LOGIN */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      {/* ======================
          ESTUDIANTE
      ====================== */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="Recibos"
        component={ReceiptsScreen}
      />

      {/* Pantalla principal de asistencias (Lista de Cursos) */}
      <Stack.Screen
        name="Asistencias"
        component={AttendanceScreen}
      />

      {/* Pantalla de detalle (Gráfico y lista de fechas por curso) */}
      <Stack.Screen
        name="AttendanceDetail"
        component={AttendanceDetailScreen}
      />

      <Stack.Screen
        name="Matricula"
        component={MatriculaScreen}
      />

      <Stack.Screen
        name="Malla"
        component={MallaScreen}
      />

      <Stack.Screen
        name="Horario"
        component={HorarioScreen}
      />

      <Stack.Screen 
        name="Tramites" 
        component={TramiteScreen} 
      />

      {/* ======================
          DOCENTE
      ====================== */}
      <Stack.Screen
        name="HomeDoc"
        component={HomeDocScreen}
      />

      <Stack.Screen
        name="PerfilDoc"
        component={PerfilDocScreen}
      />

      <Stack.Screen
        name="Marcaciones"
        component={MarcacionesScreen}
      />

      <Stack.Screen
        name="AsistenciasDoc"
        component={AsistenciasDocScreen}
      />

      <Stack.Screen
        name="HorarioDoc"
        component={HorarioDocScreen}
      />

      <Stack.Screen
        name="Manuales"
        component={ManualesScreen}
      />

    </Stack.Navigator>
  );
}