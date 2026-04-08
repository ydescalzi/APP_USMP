import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { styles } from '../../styles/HorarioStyles';

export default function HorarioScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [horarioPorDia, setHorarioPorDia] = useState({});

  const diasOrden = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

  // --- PALETA DE COLORES JUVENILES Y MODERNOS ---
  const getCourseColor = (curso) => {
    const palette = [
      '#FF85A1', // Rosa chicle
      '#4ECDC4', // Turquesa
      '#A29BFE', // Lavanda
      '#FFD93D', // Amarillo sol
      '#6C5CE7', // Morado intenso
      '#FF7675', // Coral
      '#55E6C1', // Menta
      '#74B9FF', // Azul cielo
    ];
    let hash = 0;
    for (let i = 0; i < curso.length; i++) {
      hash = curso.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % palette.length);
    return palette[index];
  };

  useEffect(() => {
    obtenerHorario();
  }, []);

  const agruparPorDia = (data) => {
    if (!data) return {};    
    const grupos = data.reduce((acc, item) => {
      const diaNormalizado = item.DIA.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!acc[diaNormalizado]) acc[diaNormalizado] = [];
      acc[diaNormalizado].push(item);
      return acc;
    }, {});

    Object.keys(grupos).forEach(dia => {
      grupos[dia].sort((a, b) => a.HORAINICIO.localeCompare(b.HORAINICIO));
    });
    return grupos;
  };

  const obtenerHorario = async () => {
    try {
      setLoading(true);
      const codigosap = await AsyncStorage.getItem('codigosap');
      const anio = await AsyncStorage.getItem('anio');
      const semestre = await AsyncStorage.getItem('semestre');
      const response = await api.get(`/horario/${codigosap}/${anio}/${semestre}`);
      if (response.data.success) {
        setHorarioPorDia(agruparPorDia(response.data.data));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el horario');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    obtenerHorario();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mi Horario</Text>
          <Text style={styles.headerSubtitle}>Semestre Académico</Text>
        </View>
        <Icon name="lightning-bolt" size={28} color="#FFD93D" />
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableContainer}>
          {diasOrden.map((dia) => (
            <View key={dia} style={styles.column}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayText}>{dia.substring(0, 3)}</Text>
              </View>
              
              <View style={styles.classesContainer}>
                {horarioPorDia[dia] ? (
                  horarioPorDia[dia].map((clase, index) => {
                    const color = getCourseColor(clase.CURSO);
                    return (
                      <View key={index} style={[styles.classCard, { backgroundColor: color + '15', borderLeftColor: color }]}>
                        <Text style={[styles.classTime, { color: color }]}>
                          {clase.HORAINICIO.substring(0, 5)} - {clase.HORAFIN.substring(0, 5)}
                        </Text>
                        <Text style={styles.classTitle} numberOfLines={3}>{clase.CURSO}</Text>
                        <View style={styles.classFooter}>
                          <Icon name="map-marker-radius" size={12} color="#4B5563" />
                          <Text style={styles.classRoom}>{clase.AULA || 'VIRTUAL'}</Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyDay}><Text style={styles.emptyDayText}>Relax 😎</Text></View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}