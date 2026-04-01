import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../../styles/HomeDocStyles";

export default function HomeDocScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.log("Error cargando usuario", error);
    }
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user", "tipo"]);
    navigation.replace("Login");
  };

  const MenuButton = ({ title, icon, screen }) => (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={32} color="#9B0000" />
      </View>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9B0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9B0000" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER DINÁMICO */}
        <View style={styles.header}>
          <Text style={styles.title}>USMP</Text>
          <Text style={styles.subtitle}>Filial Norte</Text>
        </View>

        {/* PERFIL ESTILIZADO */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={80} color="#DDD" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.welcome}>Bienvenido, Docente</Text>
            <Text style={styles.name}>
              {user?.NOMBRES} {user?.APELLIDOPATERNO}
            </Text>
          </View>
        </View>

        {/* GRID DE MENÚ */}
        <View style={styles.menuGrid}>
          <MenuButton title="Perfil" icon="account-details" screen="PerfilDoc" />
          <MenuButton title="Marcaciones" icon="fingerprint" screen="Marcaciones" />
          <MenuButton title="Asistencias" icon="clipboard-check-outline" screen="Asistencias" />
          <MenuButton title="Horario" icon="calendar-clock" screen="HorarioDoc" />
          <MenuButton title="Manuales" icon="book-open-page-variant" screen="Manuales" />
          
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Icon name="logout" size={24} color="#FFF" />
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 100 }} /> 
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 USMP-FN | Innovación Académica</Text>
      </View>
    </SafeAreaView>
  );
}