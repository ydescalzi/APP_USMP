import React, { useEffect, useState, useCallback } from 'react';
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

// Componente MenuItem mejorado con sistema de Notificaciones (Badges)
const MenuItem = React.memo(({ title, icon, color = "#8B0000", onPress, subText = "Acceder ahora", hasBadge = false }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.card}
    onPress={onPress}
  >
    <View style={[styles.iconCircle, { backgroundColor: `${color}12` }]}>
      <Icon name={icon} size={28} color={color} />
      {hasBadge && (
        <View style={localStyles.badgeDot} />
      )}
    </View>

    <View style={styles.cardContent}>
      <Text style={styles.cardText}>{title}</Text>
      <Text style={[styles.cardSubText, hasBadge && { color: '#EF4444', fontWeight: 'bold' }]}>
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
  
  // ESTADO PARA NOTIFICACIÓN DE RECIBOS
  const [hasPendingReceipts, setHasPendingReceipts] = useState(false);

  const API_URL = "http://10.0.2.2:3001";

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const data = await AsyncStorage.getItem('user');
      if (data) {
        const localUser = JSON.parse(data);
        setUser(localUser);
        
        const codigo = localUser?.codigoSAP || localUser?.CODIGOSAP;
        if (codigo) {
          checkReceipts(codigo);
        }
      }
    } catch (e) {
      console.log("Error cargando datos:", e);
    } finally {
      setLoading(false);
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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
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
                  source={{
                    uri: `${API_URL}/foto/${user.CODIGOSAP}`,
                    cache: "force-cache"
                  }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {user?.NOMBRES ? user.NOMBRES.charAt(0) : "U"}
                </Text>
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

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutModalVisible(true)}
          >
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
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servicios Académicos</Text>
            <View style={styles.titleBadge}>    
              <Text style={styles.titleBadgeText}>2026</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <MenuItem 
              title="Perfil" icon="account-tie" color="#6366F1" 
              onPress={() => navigation.navigate('Profile', { codigosap: user?.CODIGOSAP })} 
            />
            
            <MenuItem 
              title="Matrícula" icon="file-certificate" color="#0EA5E9" 
              onPress={() => navigation.navigate('Matricula', { codigosap: user?.CODIGOSAP })} 
            />

            <MenuItem 
              title="Ayuda en Línea" icon="microsoft-teams" color="#444791" 
              subText="Chat en vivo"
              hasBadge={true} 
              onPress={() => navigation.navigate('Browser', { 
                url: 'https://teams.microsoft.com/_#/messaging', 
                title: 'Ayuda en Línea - Microsoft Teams' 
              })} 
            />

            <MenuItem 
              title="Correo Outlook" icon="microsoft-outlook" color="#0078D4" 
              subText="Bandeja de Entrada"
              hasBadge={true} 
              onPress={() => navigation.navigate('Browser', { 
                url: 'https://outlook.office.com/mail/', 
                title: 'Correo Outlook' 
              })} 
            />

            <MenuItem 
              title="Asistencias" icon="calendar-check-outline" color="#10B981" 
              onPress={() => navigation.navigate('Asistencias', { codigosap: user?.CODIGOSAP })} 
            />

            <MenuItem 
              title="Recibos" icon="credit-card-outline" color="#EF4444" 
              hasBadge={hasPendingReceipts} 
              onPress={() => navigation.navigate('Recibos', { codigosap: user?.CODIGOSAP })} 
            />

            <MenuItem 
              title="Malla" icon="file-tree" color="#F59E0B" 
              onPress={() => navigation.navigate('Malla', { codigosap: user?.CODIGOSAP })} 
            />

            <MenuItem 
              title="Horario" icon="clock-fast" color="#8B5CF6" 
              onPress={() => navigation.navigate('Horario', { codigosap: user?.CODIGOSAP })} 
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © Derechos Reservados USMP-FN 2026 - V01
            </Text>
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
  }
});