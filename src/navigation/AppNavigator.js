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
import AttendanceDetailScreen from '../screens/attendance/AttendanceDetailScreen'; 
import MatriculaScreen from '../screens/matricula/MatriculaScreen';
import MallaScreen from '../screens/malla/MallaScreen';
import HorarioScreen from '../screens/horario/HorarioScreen';
import TramiteScreen from '../screens/tramite/TramiteScreen'; 

// IMPORTACIÓN DE LA NUEVA PANTALLA PARA TEAMS Y CORREO
import BrowserScreen from '../screens/BrowserScreen'; 

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
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* LOGIN */}
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* ======================
          ESTUDIANTE
      ====================== */}
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />

      <Stack.Screen name="Recibos" component={ReceiptsScreen} />

      <Stack.Screen name="Asistencias" component={AttendanceScreen} />

      <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} />

      <Stack.Screen name="Matricula" component={MatriculaScreen} />

      <Stack.Screen name="Malla" component={MallaScreen} />

      <Stack.Screen name="Horario" component={HorarioScreen} />

      <Stack.Screen name="Tramites" component={TramiteScreen} />

      {/* PANTALLA INTEGRADA PARA TEAMS Y CORREO (WEBVIEW) */}
      <Stack.Screen 
        name="Browser" 
        component={BrowserScreen} 
        options={({ route }) => ({ 
          headerShown: true, // Mostramos el header para poder regresar
          title: route.params?.title || 'Cargando...',
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#8B0000' }, // Color guinda USMP
          headerTitleStyle: { fontWeight: 'bold' },
        })} 
      />

      {/* ======================
          DOCENTE
      ====================== */}
      <Stack.Screen name="HomeDoc" component={HomeDocScreen} />

      <Stack.Screen name="PerfilDoc" component={PerfilDocScreen} />

      <Stack.Screen name="Marcaciones" component={MarcacionesScreen} />

      <Stack.Screen name="AsistenciasDoc" component={AsistenciasDocScreen} />

      <Stack.Screen name="HorarioDoc" component={HorarioDocScreen} />

      <Stack.Screen name="Manuales" component={ManualesScreen} />

    </Stack.Navigator>
  );
}