import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

// --- CORRECCIÓN: Importar desde la librería recomendada ---
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookOpen, ChevronLeft, GraduationCap, Award, Layers } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/MallaStyles';
import api from '../../services/api';

export default function MallaScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [mallaAgrupada, setMallaAgrupada] = useState({});
  const [cicloSeleccionado, setCicloSeleccionado] = useState('Todos');

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const userRaw = await AsyncStorage.getItem('user');
      const localUser = JSON.parse(userRaw);
      const codigoSAP = localUser?.codigoSAP || localUser?.CodigoSAP || localUser?.CODIGOSAP;

      const response = await api.get(`/malla/planes/${codigoSAP}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const listaPlanes = response.data?.data || [];
      setPlanes(listaPlanes);

      if (listaPlanes.length > 0) {
        setPlanSeleccionado(listaPlanes[0].CLAVE);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron obtener los planes de estudio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planSeleccionado) {
      cargarCursosDelPlan(planSeleccionado);
    }
  }, [planSeleccionado]);

  const cargarCursosDelPlan = async (clave) => {
    try {
      setLoadingCursos(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await api.get(`/malla/plan/${clave}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const cursos = response.data?.data || [];
      const agrupado = {};

      cursos.forEach((curso) => {
        const ciclo = curso.CODIGOCICLO?.trim() || '?';
        if (!agrupado[ciclo]) agrupado[ciclo] = [];
        agrupado[ciclo].push(curso);
      });

      setMallaAgrupada(agrupado);
    } catch (error) {
      console.error("Error al cargar la malla:", error);
    } finally {
      setLoadingCursos(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF4B5C" />
        <Text style={styles.loaderText}>Cargando planes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color="#1E293B" size={28} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.headerSubtitle}>MI PROGRESO</Text>
          <Text style={styles.headerTitle}>Malla Curricular</Text>
        </View>
        <View style={styles.headerIconContainer}>
          <GraduationCap color="#FF4B5C" size={30} />
        </View>
      </View>

      {/* SELECTOR DE PLANES */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>Plan de Estudios Vigente:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollPadding}
        >
          {planes.map((plan) => (
            <TouchableOpacity
              key={plan.CLAVE}
              activeOpacity={0.7}
              onPress={() => setPlanSeleccionado(plan.CLAVE)}
              style={[
                styles.planChip,
                planSeleccionado === plan.CLAVE && styles.planChipActivo
              ]}
            >
              <Text style={[styles.planCodigoText, planSeleccionado === plan.CLAVE && { color: '#FFF' }]}>
                {plan.CODIGO}
              </Text>
              <Text style={[styles.planChipText, planSeleccionado === plan.CLAVE && styles.planChipTextActivo]}>
                {plan.DENOMINACION}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FILTROS DE CICLO */}
      <View style={styles.sectionContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          <TouchableOpacity
            style={[styles.filtroButton, cicloSeleccionado === 'Todos' && styles.filtroActivo]}
            onPress={() => setCicloSeleccionado('Todos')}
          >
            <Text style={[styles.filtroText, cicloSeleccionado === 'Todos' && styles.filtroTextActivo]}>Todos</Text>
          </TouchableOpacity>

          {Object.keys(mallaAgrupada).sort((a, b) => a - b).map((ciclo) => (
            <TouchableOpacity
              key={ciclo}
              style={[styles.filtroButton, cicloSeleccionado === ciclo && styles.filtroActivo]}
              onPress={() => setCicloSeleccionado(ciclo)}
            >
              <Text style={[styles.filtroText, cicloSeleccionado === ciclo && styles.filtroTextActivo]}>Ciclo {ciclo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LISTADO DE CURSOS */}
      {loadingCursos ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#FF4B5C" />
          <Text style={styles.loaderText}>Cargando cursos del plan...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          {Object.keys(mallaAgrupada)
            .sort((a, b) => a - b)
            .filter(ciclo => cicloSeleccionado === 'Todos' || cicloSeleccionado === ciclo)
            .map((ciclo) => (
              <View key={ciclo} style={styles.cicloSection}>
                <View style={styles.cicloHeader}>
                  <Layers size={18} color="#FF4B5C" />
                  <Text style={styles.cicloTitle}>Semestre {ciclo}</Text>
                </View>

                {mallaAgrupada[ciclo].map((curso) => (
                  <View key={curso.CLAVE} style={styles.cursoCard}>
                    <View style={styles.cursoIconBlue}>
                      <BookOpen color="#FFF" size={20} />
                    </View>
                    <View style={styles.cursoInfo}>
                      <View style={styles.cursoTopRow}>
                        <Text style={styles.cursoCodigo}>{curso.CODIGO}</Text>
                        <Text style={styles.tipoBadge}>{curso.CODIGOTIPOOBJETO || 'SM'}</Text>
                      </View>
                      <Text style={styles.cursoText}>{curso.DENOMINACION}</Text>
                      <View style={styles.badgeRow}>
                        <View style={styles.creditoBadge}>
                          <Award size={12} color="#64748B" />
                          <Text style={styles.creditosText}>{curso.CREDITOS} Créditos</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}