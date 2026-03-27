import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  // SafeAreaView ya no se importa de aquí
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Modal
} from 'react-native';

// Corrección: Importación desde la librería recomendada
import { SafeAreaView } from 'react-native-safe-area-context';

import { 
  BookOpen, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  GraduationCap,
  ChevronDown,
  CheckCircle2,
  Info
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import styles from '../../styles/MatriculaStyles'; // Asegúrate de que la ruta sea correcta

export default function MatriculaScreen() {
  const [loading, setLoading] = useState(false);
  const [semestres, setSemestres] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    cargarSemestres();
  }, []);

  const cargarSemestres = async () => {
    try {
      setLoading(true);
      const codigosap = await AsyncStorage.getItem('codigosap');
      if (!codigosap) {
        Alert.alert('Error', 'No se encontró código del estudiante');
        return;
      }

      const response = await api.get(`/matricula/semestres/${codigosap}`);
      if (response.data.success && response.data.data.length > 0) {
        setSemestres(response.data.data);
        const primero = response.data.data[0];
        setSeleccionado(primero);
        obtenerMatricula(primero.ANO, primero.SEMESTRE);
      } else {
        Alert.alert('Aviso', 'No se encontraron semestres disponibles');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de periodos');
    } finally {
      setLoading(false);
    }
  };

  const obtenerMatricula = async (anio, semestre) => {
    try {
      setLoading(true);
      const codigosap = await AsyncStorage.getItem('codigosap');
      const response = await api.get(`/matricula/${codigosap}/${anio}/${semestre}`);
      if (response.data && response.data.success) {
        setCursos(response.data.data);
      } else {
        setCursos([]);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarPeriodo = (item) => {
    setSeleccionado(item);
    setModalVisible(false);
    obtenerMatricula(item.ANO, item.SEMESTRE);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      <View style={styles.header}>
        <View style={styles.iconBtn}><BookOpen color="#FFF" size={20} /></View>
        <Text style={styles.headerTitle}>Mis Cursos</Text>
        <View style={styles.avatarCircle}><GraduationCap color="#FFF" size={24} /></View>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterCard}>
          <Text style={styles.labelFiltro}>Periodo Académico</Text>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible(true)}>
            <Calendar color="#8B0000" size={20} />
            <Text style={styles.selectBtnText}>
              {seleccionado ? `${seleccionado.ANO} - ${seleccionado.SEMESTRE}` : 'Seleccionar Periodo'}
            </Text>
            <ChevronDown color="#9CA3AF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={styles.loaderText}>Cargando horario...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {cursos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Info color="#D1D5DB" size={50} />
              <Text style={styles.emptyText}>No hay cursos registrados</Text>
            </View>
          ) : (
            cursos.map((curso, index) => (
              <View key={index} style={styles.card}>
                <View style={[styles.statusIndicator, { backgroundColor: '#8B0000' }]} />
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.receiptLabel}>CÓDIGO CURSO</Text>
                      <Text style={styles.receiptNumber}>{curso.ID_CURSO || 'CUR-00'}</Text>
                    </View>
                    <View style={styles.badge}>
                      <Clock color="#8B0000" size={12} />
                      <Text style={styles.badgeText}>{curso.HORAINICIO || '--:--'}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.cursoNombre}>{(curso.CURSO || "Curso").toLowerCase()}</Text>
                  <View style={styles.infoRow}>
                    <User color="#6B7280" size={14} />
                    <Text style={styles.infoText} numberOfLines={1}>{curso.DOCENTE || "Por asignar"}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MapPin color="#6B7280" size={14} />
                    <Text style={styles.infoText}>{curso.AULA || 'S/A'} • {curso.PABELLON || 'S/P'}</Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <View style={styles.row}>
                      <Calendar color="#8B0000" size={14} />
                      <Text style={styles.diaText}>{curso.DIA || 'S/D'}</Text>
                    </View>
                    <Text style={styles.turnoValue}>{curso.TURNO || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Periodo</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#8B0000', fontWeight: 'bold' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {semestres.map((item, index) => {
                const esSeleccionado = seleccionado?.ANO === item.ANO && seleccionado?.SEMESTRE === item.SEMESTRE;
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.modalItem, esSeleccionado && styles.modalItemSelected]}
                    onPress={() => seleccionarPeriodo(item)}
                  >
                    <Calendar color={esSeleccionado ? "#8B0000" : "#9CA3AF"} size={20} />
                    <Text style={[styles.modalItemText, esSeleccionado && styles.modalItemTextSelected]}>
                      Periodo {item.ANO} - {item.SEMESTRE}
                    </Text>
                    {esSeleccionado && <CheckCircle2 color="#8B0000" size={18} style={{marginLeft: 'auto'}} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}