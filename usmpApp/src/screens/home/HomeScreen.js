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
  Image
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles/HomeStyles';

export default function HomeScreen({ navigation }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const API_URL = "http://10.0.2.2:3001";

  useEffect(() => {
    loadUser();
  }, []);

  /* =========================
     CARGAR USUARIO
  ========================= */

  const loadUser = async () => {

    try {

      const data = await AsyncStorage.getItem('user');

      if (data) {

        const parsedUser = JSON.parse(data);
        setUser(parsedUser);

      }

    } catch (e) {

      console.log("Error cargando usuario:", e);

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     LOGOUT
  ========================= */

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

  /* =========================
     ITEM MENU
  ========================= */

  const MenuItem = ({ title, icon, screen, color = "#8B0000" }) => (

    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() =>
        navigation.navigate(screen, { codigosap: user?.CODIGOSAP })
      }
    >

      <View style={[styles.iconCircle, { backgroundColor: `${color}12` }]}>
        <Icon name={icon} size={28} color={color} />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{title}</Text>
        <Text style={styles.cardSubText}>Acceder ahora</Text>
      </View>

      <View style={styles.cardArrow}>
        <Icon name="chevron-right" size={18} color="#94A3B8" />
      </View>

    </TouchableOpacity>

  );

  /* =========================
     LOADING
  ========================= */

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

            {/* FOTO USUARIO */}

            <View style={styles.avatar}>

              {user?.CODIGOSAP ? (

                <Image
                  source={{
                    uri: `${API_URL}/foto/${user.CODIGOSAP}`,
                    cache: "force-cache"
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25
                  }}
                  resizeMode="cover"
                  onLoad={() => console.log("Foto cargada")}
                  onError={(e) =>
                    console.log("Error cargando foto:", e.nativeEvent)
                  }
                />

              ) : (

                <Text style={styles.avatarText}>
                  {user?.NOMBRES ? user.NOMBRES.charAt(0) : "U"}
                </Text>

              )}

            </View>

            <View style={styles.infoUser}>

              <Text style={styles.welcomeText}>
                Panel del Estudiante
              </Text>

              <Text style={styles.userName}>
                {user?.NOMBRES}
              </Text>

              <View style={styles.tagSede}>
                <Icon name="map-marker" size={12} color="#FFD700" />
                <Text style={styles.tagSedeText}>
                  USMP - Filial Norte
                </Text>
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

      {/* CONTENIDO */}

      <ImageBackground
        source={require('../../assets/images/logo_20_negro.png')}
        style={styles.backgroundLogo}
        imageStyle={styles.imgStyle}
      >

        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Servicios Académicos
            </Text>

            <View style={styles.titleBadge}>
              <Text style={styles.titleBadgeText}>NUEVO</Text>
            </View>

          </View>

          <View style={styles.grid}>

            <MenuItem title="Perfil" icon="account-tie" screen="Profile" color="#6366F1" />
            <MenuItem title="Matrícula" icon="file-certificate" screen="Matricula" color="#0EA5E9" />
            <MenuItem title="Recibos" icon="credit-card-outline" screen="Recibos" color="#EF4444" />
            <MenuItem title="Asistencias" icon="calendar-check-outline" screen="Asistencias" color="#10B981" />
            <MenuItem title="Malla" icon="file-tree" screen="Malla" color="#F59E0B" />
            <MenuItem title="Horario" icon="clock-fast" screen="Horario" color="#8B5CF6" />
            <MenuItem title="Trámites" icon="file-document-outline" screen="Tramites" color="#F97316" />

          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Los derechos Reservados USMP-FN 2026
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

            <Text style={styles.modalTitle}>
              Cerrar Sesión
            </Text>

            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas finalizar tu sesión actual?
            </Text>

            <View style={styles.modalButtonsRow}>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.confirmBtnText}>Sí, salir</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

      {/* LOADING LOGOUT */}

      {isLoggingOut && (

        <View style={styles.logoutOverlay}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.logoutOverlayText}>
            Cerrando sesión...
          </Text>
        </View>

      )}

    </SafeAreaView>

  );

}