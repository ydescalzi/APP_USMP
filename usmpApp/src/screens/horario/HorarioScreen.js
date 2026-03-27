import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  SectionList,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
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
      const dia = item.DIA.toUpperCase();
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
        Alert.alert('Error', 'Datos no encontrados');
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
      <View style={[styles.statusIndicator, { backgroundColor: '#8B0000' }]} />
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Icon name="book-open-variant" size={20} color="#8B0000" />
          <Text style={styles.cursoText}>{item.CURSO}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={18} color="#D4AF37" />
          <Text style={styles.horaText}>{item.HORAINICIO} - {item.HORAFIN}</Text>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Icon name="calendar-today" size={18} color="#111827" style={{ marginRight: 8 }} />
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mi Horario</Text>
          <Text style={styles.headerSubtitle}>Ciclo Académico Actual</Text>
        </View>
        <View style={styles.iconBtn}>
          <Icon name="calendar-month" size={26} color="#FFF" />
        </View>
      </View>

      {/* Lista Agrupada */}
      <SectionList
        sections={horarioAgrupado}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-remove" size={50} color="#9CA3AF" />
            <Text style={styles.emptyText}>No hay clases registradas</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}