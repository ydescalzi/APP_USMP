import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { styles } from '../../styles/HorarioStyles';

export default function HorarioScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [horarioAgrupado, setHorarioAgrupado] = useState([]);

  useEffect(() => {
    obtenerHorario();
  }, []);

  const agruparPorDia = (data) => {
    if (!data || data.length === 0) return [];

    // 1. Definimos el orden y normalizamos para evitar errores de tildes o espacios
    const diasOrden = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
    
    const grupos = data.reduce((acc, item) => {
      // Limpiamos el texto: quitamos espacios y tildes
      const diaRaw = item.DIA || "OTROS";
      const diaNormalizado = diaRaw
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Quita tildes (é -> e)

      if (!acc[diaNormalizado]) acc[diaNormalizado] = [];
      acc[diaNormalizado].push(item);
      return acc;
    }, {});

    // 2. Mapeamos al formato requerido por SectionList
    return diasOrden
      .filter((dia) => grupos[dia]) // Solo días que tienen clases
      .map((dia) => ({
        title: dia,
        data: grupos[dia],
      }));
  };

  const obtenerHorario = async () => {
    try {
      setLoading(true);
      const codigosap = await AsyncStorage.getItem('codigosap');
      const anio = await AsyncStorage.getItem('anio');
      const semestre = await AsyncStorage.getItem('semestre');

      if (!codigosap || !anio || !semestre) {
        Alert.alert('Error', 'No se encontró información de la sesión. Inicie sesión nuevamente.');
        return;
      }

      // Llamada a la API
      const response = await api.get(`/horario/${codigosap}/${anio}/${semestre}`);

      if (response.data.success) {
        const datosAgrupados = agruparPorDia(response.data.data);
        setHorarioAgrupado(datosAgrupados);
      } else {
        setHorarioAgrupado([]);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    obtenerHorario();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.statusIndicator} />
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="book-open-variant" size={20} color="#8B0000" />
          <Text style={styles.cursoText} numberOfLines={2}>
            {item.CURSO}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.amountContainer}>
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={18} color="#D4AF37" />
            <Text style={styles.horaText}>
              {item.HORAINICIO.substring(0, 5)} - {item.HORAFIN.substring(0, 5)}
            </Text>
          </View>

          <View style={styles.goldTag}>
            <Icon name="door-open" size={14} color="#8B4513" style={{ marginRight: 4 }} />
            <Text style={styles.goldTagText}>
              {item.AULA || 'VIRTUAL'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Icon name="calendar-today" size={18} color="#111827" />
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={{ marginTop: 10, color: '#8B0000' }}>Cargando horario...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mi Horario</Text>
          <Text style={styles.headerSubtitle}>Ciclo Académico Actual</Text>
        </View>
        <View style={styles.iconBtn}>
          <Icon name="calendar-month" size={26} color="#FFF" />
        </View>
      </View>

      <SectionList
        sections={horarioAgrupado}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#8B0000"]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-remove" size={60} color="#9CA3AF" />
            <Text style={styles.emptyText}>No hay clases registradas para este periodo</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}