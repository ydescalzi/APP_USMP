import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PieChart } from "react-native-chart-kit";
import { ChevronLeft, Calendar, Clock, BarChart3, AlertCircle } from "lucide-react-native";
import api from "../../services/api";
import styles from "../../styles/AttendanceStyles";

const screenWidth = Dimensions.get("window").width;

const AttendanceDetailScreen = ({ route, navigation }) => {
  const { codigosap, curso, ano, semestre, clavePaquete, abreviaturaPaquete } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [info, setInfo] = useState({ total: 0, asistencias: 0, faltas: 0, porcentaje: 0 });

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/asistencia/${codigosap}/${ano}/${semestre}/${clavePaquete}/${abreviaturaPaquete}`);
        
        if (response.data && response.data.success) {
          const data = response.data.data;
          
          // Mapeo basado en el SQL: usamos 'estado' y 'fecha'
          const asistencias = data.filter(a => a.estado === 'A').length;
          const faltas = data.filter(a => a.estado === 'F').length;
          
          setInfo({
            total: data.length,
            asistencias,
            faltas,
            porcentaje: data.length > 0 ? ((asistencias / data.length) * 100).toFixed(1) : 0
          });
          setAttendance(data);
        }
      } catch (e) { 
        console.error("Error al cargar detalle:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    loadDetail();
  }, [codigosap, ano, semestre, clavePaquete, abreviaturaPaquete]);

  const renderItem = ({ item }) => {
    // Mapeo exacto según tu SQL
    const getStatus = (code) => {
      switch (code) {
        case 'A': return { label: 'ASISTIÓ', color: '#10B981' };
        case 'F': return { label: 'FALTA', color: '#EF4444' };
        case 'J': return { label: 'JUSTIFICADO', color: '#F59E0B' };
        default: return { label: 'SIN REGISTRO', color: '#6B7280' };
      }
    };

    const status = getStatus(item.estado);

    return (
      <View style={styles.card}>
        <View style={[styles.statusIndicator, { backgroundColor: status.color }]} />
        <View style={styles.cardBody}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={14} color="#6B7280" />
            <Text style={{ marginLeft: 5, color: status.color, fontWeight: 'bold' }}>{status.label}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Calendar size={16} color="#8B0000" />
            <Text style={{ marginLeft: 5 }}>
              {/* Formateo de fecha según el campo 'fecha' de tu SQL */}
              {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Sin fecha'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft color="#FFF" size={28} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>Detalle del Curso</Text>
          <Text style={styles.headerSubTitle} numberOfLines={1}>{curso}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8B0000" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.filterSection}>
              <Text style={styles.infoTextBold}>Resumen Estadístico</Text>
              {info.total > 0 ? (
                <PieChart 
                    data={[
                        { name: "Asistencias", population: info.asistencias, color: "#10B981", legendFontColor: "#7F7F7F" },
                        { name: "Faltas", population: info.faltas, color: "#EF4444", legendFontColor: "#7F7F7F" }
                    ]} 
                    width={screenWidth - 40} height={180} chartConfig={{ color: () => '#000' }} 
                    accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} absolute 
                />
              ) : <Text style={{ textAlign: 'center', margin: 20 }}>No hay datos disponibles</Text>}
              
              <View style={styles.amountContainer}>
                <BarChart3 size={18} color="#8B0000" />
                <Text style={styles.infoTextBold}> Porcentaje: {info.porcentaje}%</Text>
              </View>
            </View>
          }
          data={attendance}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay registros.</Text>}
        />
      )}
    </SafeAreaView>
  );
};

export default AttendanceDetailScreen;