import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Modal,
  Image,
  StyleSheet,
  Platform
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../services/api'; 
import styles from '../../styles/HomeStyles';

// Componente MenuItem Optimizado
const MenuItem = React.memo(({ title, icon, color = "#8B0000", onPress, subText = "Acceder ahora", hasBadge = false }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: `${color}12` }]}>
      <Icon name={icon} size={28} color={color} />
      {hasBadge && <View style={localStyles.badgeDot} />}
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardText}>{title}</Text>
      <Text style={[styles.cardSubText, (hasBadge && title === "Recibos") && { color: '#EF4444', fontWeight: 'bold' }]}>
        {hasBadge && title === "Recibos" ? "¡Pago pendiente!" : subText}
      </Text>
    </View>
    <View style={styles.cardArrow}>
      <Icon name="chevron-right" size={18} color="#94A3B8" />
    </View>
  </TouchableOpacity>
));

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hasPendingReceipts, setHasPendingReceipts] = useState(false);
  const [todayClass, setTodayClass] = useState(null);

  const API_URL = "http://10.0.2.2:3001";

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const data = await AsyncStorage.getItem('user');
      const anio = await AsyncStorage.getItem('anio') || "2026";
      const semestre = await AsyncStorage.getItem('semestre') || "1";

      if (data) {
        const localUser = JSON.parse(data);
        setUser(localUser);
        const codigo = localUser?.CODIGOSAP;

        if (codigo) {
          checkReceipts(codigo);
          checkTodayClasses(codigo, anio, semestre);
        }
      }
    } catch (e) {
      console.log("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayClasses = async (codigo, anio, semestre) => {
    try {
      const res = await api.get(`/horario/${codigo}/${anio}/${semestre}`);
      const data = res.data?.data || [];
      const dias = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
      const hoy = dias[new Date().getDay()];

      const clasesHoy = data.filter(item => {
        const diaNorm = item.DIA?.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return diaNorm === hoy;
      });

      if (clasesHoy.length > 0) {
        clasesHoy.sort((a, b) => a.HORAINICIO.localeCompare(b.HORAINICIO));
        setTodayClass(clasesHoy[0]);
      }
    } catch (err) {
      console.log("Error consultando clases de hoy:", err);
    }
  };

  const checkReceipts = async (codigo) => {
    try {
      const res = await api.get(`/recibos/${codigo}`);
      const data = res.data?.data || res.data || [];
      const rows = Array.isArray(data) ? data : data.rows || [];
      const pending = rows.some(r => (r.CODIGOESTADORECIBO || r.estado) === 'P');
      setHasPendingReceipts(pending);
    } catch (err) {
      console.log("Error al verificar notificaciones de recibos:", err);
    }
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    setIsLoggingOut(true);
    setTimeout(async () => {
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 1200);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {user?.CODIGOSAP && !imageError ? (
                <Image
                  source={{ uri: `${API_URL}/foto/${user.CODIGOSAP}`, cache: "force-cache" }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Text style={styles.avatarText}>{user?.NOMBRES ? user.NOMBRES.charAt(0) : "U"}</Text>
              )}
            </View>
            <View style={styles.infoUser}>
              <Text style={styles.welcomeText}>Panel del Estudiante</Text>
              <Text style={styles.userName}>{user?.NOMBRES}</Text>
              <View style={styles.tagSede}>
                <Icon name="map-marker" size={12} color="#FFD700" />
                <Text style={styles.tagSedeText}>USMP - Filial Norte</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => setLogoutModalVisible(true)}>
            <Icon name="power" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ImageBackground
        source={require('../../assets/images/logo_20_negro.png')}
        style={styles.backgroundLogo}
        imageStyle={styles.imgStyle}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* NOTIFICACIÓN DE CLASE */}
          {todayClass && (
            <TouchableOpacity 
              activeOpacity={0.9}
              style={localStyles.notifCard}
              onPress={() => navigation.navigate('Horario')}
            >
              <View style={localStyles.notifIconBg}>
                <Icon name="clock-alert-outline" size={24} color="#8B0000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={localStyles.notifAlertText}>HOY TIENES CLASE DE:</Text>
                <Text style={localStyles.notifCourseText} numberOfLines={1}>
                  {todayClass.CURSO}
                </Text>
                <Text style={localStyles.notifTimeText}>
                  {todayClass.HORAINICIO.substring(0, 5)} - Aula: {todayClass.AULA || 'VIRTUAL'}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color="#8B0000" />
            </TouchableOpacity>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servicios Académicos</Text>
            <View style={styles.titleBadge}>    
              <Text style={styles.titleBadgeText}>2026</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <MenuItem title="Perfil" icon="account-tie" color="#6366F1" onPress={() => navigation.navigate('Profile', { codigosap: user?.CODIGOSAP })} />
            <MenuItem title="Matrícula" icon="file-certificate" color="#0EA5E9" onPress={() => navigation.navigate('Matricula', { codigosap: user?.CODIGOSAP })} />
            
            {/* NUEVO: BIBLIOTECA SIBUS */}
            <MenuItem 
                title="Biblioteca" 
                icon="book-open-page-variant" 
                color="#06B6D4" 
                subText="Recursos SIBUS"
                onPress={() => navigation.navigate('Browser', { url: 'https://sibus.usmp.edu.pe/', title: 'Biblioteca Virtual' })} 
            />

            <MenuItem title="Asistencias" icon="calendar-check-outline" color="#10B981" onPress={() => navigation.navigate('Asistencias', { codigosap: user?.CODIGOSAP })} />
            <MenuItem title="Recibos" icon="credit-card-outline" color="#EF4444" hasBadge={hasPendingReceipts} onPress={() => navigation.navigate('Recibos', { codigosap: user?.CODIGOSAP })} />
            <MenuItem title="Horario" icon="clock-fast" color="#8B5CF6" onPress={() => navigation.navigate('Horario', { codigosap: user?.CODIGOSAP })} />
            <MenuItem title="Malla" icon="file-tree" color="#F59E0B" onPress={() => navigation.navigate('Malla', { codigosap: user?.CODIGOSAP })} />
            
            <MenuItem title="Correo Outlook" icon="microsoft-outlook" color="#0078D4" subText="Bandeja de Entrada" onPress={() => navigation.navigate('Browser', { url: 'https://outlook.office.com/mail/', title: 'Correo Outlook' })} />
            <MenuItem title="Ayuda en Línea" icon="microsoft-teams" color="#444791" subText="Chat soporte" onPress={() => navigation.navigate('Browser', { url: 'https://teams.microsoft.com/_#/messaging', title: 'Ayuda en Línea' })} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© Derechos Reservados USMP-FN 2026 - V01</Text>
          </View>

        </ScrollView>
      </ImageBackground>

      {/* MODAL LOGOUT */}
      <Modal animationType="fade" transparent visible={logoutModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBg}>
              <Icon name="logout-variant" size={40} color="#8B0000" />
            </View>
            <Text style={styles.modalTitle}>Cerrar Sesión</Text>
            <Text style={styles.modalMessage}>¿Estás seguro de que deseas finalizar tu sesión actual?</Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setLogoutModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmLogout}>
                <Text style={styles.confirmBtnText}>Sí, salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isLoggingOut && (
        <View style={styles.logoutOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.logoutOverlayText}>Cerrando sesión...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFF',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2 },
      android: { elevation: 2 }
    })
  },
  notifCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    elevation: 4,
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  notifIconBg: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notifAlertText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#8B0000',
    letterSpacing: 1,
  },
  notifCourseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginVertical: 2,
  },
  notifTimeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  }
});