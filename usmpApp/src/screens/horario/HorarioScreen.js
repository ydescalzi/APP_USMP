import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { styles } from '../../styles/HorarioStyles';

export default function HorarioScreen() {
  const [loading, setLoading] = useState(true);
  const [horarioAgrupado, setHorarioAgrupado] = useState([]);

  useEffect(() => {
    obtenerHorario();
  }, []);

  const agruparPorDia = (data) => {
    const diasOrden = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];
    const grupos = data.reduce((acc, item) => {
      const dia = item.DIA?.toUpperCase() || "OTROS";
      if (!acc[dia]) acc[dia] = [];
      acc[dia].push(item);
      return acc;
    }, {});

    return diasOrden
      .filter((dia) => grupos[dia])
      .map((dia) => ({
        title: dia,
        data: grupos[dia],
      }));
  };

  const obtenerHorario = async () => {
    try {
      const codigosap = await AsyncStorage.getItem('codigosap');
      const anio = await AsyncStorage.getItem('anio');
      const semestre = await AsyncStorage.getItem('semestre');

      if (!codigosap || !anio || !semestre) {
        Alert.alert('Error', 'Información de sesión no encontrada');
        setLoading(false);
        return;
      }

      const response = await api.get(`/horario/${codigosap}/${anio}/${semestre}`);

      if (response.data.success) {
        setHorarioAgrupado(agruparPorDia(response.data.data));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Indicador lateral */}
      <View style={styles.statusIndicator} />
      
      <View style={styles.cardBody}>
        {/* Fila del Curso (Corregido: era un div) */}
        <View style={styles.infoRow}>
          <Icon name="book-open-variant" size={20} color="#8B0000" />
          <Text style={styles.cursoText} numberOfLines={2}>
            {item.CURSO}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        {/* Fila de Hora y Aula */}
        <View style={styles.amountContainer}>
          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={18} color="#D4AF37" />
            <Text style={styles.horaText}>
              {item.HORAINICIO} - {item.HORAFIN}
            </Text>
          </View>

          {/* Etiqueta dorada para el Aula */}
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      {/* Header Institucional */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mi Horario</Text>
          <Text style={styles.headerSubtitle}>Ciclo Académico Actual</Text>
        </View>
        <View style={styles.iconBtn}>
          <Icon name="calendar-month" size={26} color="#FFF" />
        </View>
      </View>

      {/* Lista Principal */}
      <SectionList
        sections={horarioAgrupado}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-remove" size={60} color="#9CA3AF" />
            <Text style={styles.emptyText}>No hay clases registradas</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}