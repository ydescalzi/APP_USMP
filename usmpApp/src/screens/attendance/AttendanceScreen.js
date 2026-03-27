import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, BookOpen, Search } from "lucide-react-native";
import api from "../../services/api";
import styles from "../../styles/AttendanceStyles";

const AttendanceScreen = ({ route, navigation }) => {
  const { codigosap } = route.params;

  // Filtros iniciales según tus capturas de DB
  const [selectedAno, setSelectedAno] = useState(2025);
  const [selectedSemestre, setSelectedSemestre] = useState(2);
  
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCursos = async () => {
    setLoading(true);
    try {
      // 1. Formateo de SAP para que coincida con DB (000072368613)
      const sapFormateado = codigosap.toString().padStart(12, '0');
      
      // 2. IMPORTANTE: Verifica que esta ruta exista en tu index.js o app.js del backend
      // Si te da 404, revisa si el backend usa '/matricula/cursos' o solo '/cursos'
      const response = await api.get(`/matricula/cursos/${sapFormateado}/${selectedAno}/${selectedSemestre}`);
      
      console.log("Datos recibidos:", response.data);

      if (response.data && response.data.success) {
        setCursos(response.data.data || []);
      } else {
        setCursos([]);
      }
    } catch (error) {
      console.error("Error cargando cursos:", error.message);
      // Si el error es 404, revisa la consola del VS Code para ver la URL exacta
      setCursos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCursos();
  }, [selectedAno, selectedSemestre]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCursos();
  }, [selectedAno, selectedSemestre]);

  const renderCursoItem = ({ item }) => {
    // Mapeo basado en tus columnas de DBeaver: 'abrev_paqueteeventos'
    const nombreCurso = item.NOMBRE_CURSO || item.abrev_paqueteeventos || "Curso";
    const clavePaq = item.CLAVE_PAQUETE || item.clavepaqueteeventos;
    const abrevPaq = item.ABREVIATURA || item.abrev_paqueteeventos;

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate("AttendanceDetail", { 
          codigosap: codigosap.toString().padStart(12, '0'), 
          curso: nombreCurso, 
          ano: selectedAno,
          semestre: selectedSemestre,
          clavePaquete: clavePaq,
          abreviaturaPaquete: abrevPaq
        })}
      >
        <View style={[styles.statusIndicator, { backgroundColor: '#8B0000' }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.cursoNombre} numberOfLines={2}>{nombreCurso}</Text>
            <BookOpen size={18} color="#8B0000" />
          </View>
          <Text style={styles.infoText}>ID: {clavePaq}</Text>
          <View style={styles.divider} />
          <Text style={[styles.infoText, { color: '#8B0000', fontWeight: 'bold' }]}>
            Ver detalle de asistencias →
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>Mis Asistencias</Text>
          <Text style={styles.headerSubTitle}>Periodo Académico</Text>
        </View>
      </View>

      <View style={styles.periodSelectorContainer}>
        <View style={styles.periodRow}>
          <Text style={styles.periodLabel}>Año:</Text>
          {[2026, 2025, 2024, 2023].map(ano => (
            <TouchableOpacity
              key={ano}
              style={[styles.periodButton, ano === selectedAno && styles.periodButtonActive]}
              onPress={() => setSelectedAno(ano)}
            >
              <Text style={ano === selectedAno ? styles.periodButtonTextActive : styles.periodButtonText}>{ano}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.periodRow, { marginTop: 10 }]}> 
          <Text style={styles.periodLabel}>Semestre:</Text>
          {[1, 2].map((sem) => (
            <TouchableOpacity
              key={sem}
              style={[styles.periodButton, sem === selectedSemestre && styles.periodButtonActive]}
              onPress={() => setSelectedSemestre(sem)}
            >
              <Text style={sem === selectedSemestre ? styles.periodButtonTextActive : styles.periodButtonText}>{sem}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#8B0000" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={cursos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCursoItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search size={50} color="#CCC" />
              <Text style={styles.emptyText}>No hay cursos en {selectedAno}-{selectedSemestre}</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default AttendanceScreen;