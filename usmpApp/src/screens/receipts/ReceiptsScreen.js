import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StatusBar, FlatList, TouchableOpacity,
  ActivityIndicator, Platform, Modal, TouchableWithoutFeedback
} from 'react-native';

// --- CORRECCIÓN: Importar desde la librería externa ---
import { SafeAreaView } from 'react-native-safe-area-context';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { styles } from '../../styles/receiptsStyles';

export default function ReceiptsScreen({ navigation, route }) {
  const routeCodigo = route?.params?.codigosap || route?.params?.codigoSAP || null;
  const [codigosap, setCodigosap] = useState(routeCodigo);
  
  const [receipts, setReceipts] = useState([]);
  const [conceptos, setConceptos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [estado, setEstado] = useState(''); 
  const [claseobjeto, setClaseobjeto] = useState(''); 
  const [periodo, setPeriodo] = useState(''); 

  const [modalVisible, setModalVisible] = useState(null);

  useEffect(() => {
    if (codigosap) return;
    (async () => {
      try {
        const userRaw = await AsyncStorage.getItem('user');
        if (userRaw) {
          const localUser = JSON.parse(userRaw);
          const codigo = localUser?.codigoSAP || localUser?.CodigoSAP || localUser?.CODIGOSAP;
          if (codigo) setCodigosap(codigo);
        }
      } catch (e) { console.log(e); }
    })();
  }, [codigosap]);

  const loadFilters = useCallback(async () => {
    if (!codigosap) return;
    try {
      const [resC, resP] = await Promise.all([
        api.get(`/recibos/conceptos/${codigosap}`),
        api.get(`/recibos/periodos/${codigosap}`)
      ]);
      setConceptos(resC.data?.data || resC.data || []);
      setPeriodos(resP.data?.data || resP.data || []);
    } catch (err) { console.log(err); }
  }, [codigosap]);

  const loadReceipts = useCallback(async () => {
    if (!codigosap) return;
    try {
      setLoading(true);
      const res = await api.get(`/recibos/${codigosap}`, {
        params: { estado: estado || undefined, claseobjeto: claseobjeto || undefined, periodo: periodo || undefined },
      });
      const data = res.data?.data || res.data || [];
      setReceipts(Array.isArray(data) ? data : data.rows || []);
    } catch (err) { setReceipts([]); } 
    finally { setLoading(false); }
  }, [codigosap, estado, claseobjeto, periodo]);

  useEffect(() => { loadFilters(); }, [codigosap, loadFilters]);
  useEffect(() => { loadReceipts(); }, [loadReceipts]);

  const getPeriodoName = (clave) => {
    const found = periodos.find(p => (p.codigo || p.CLAVE) === clave);
    return found ? (found.DESCRIPCION || found.descripcion) : clave;
  };

  const getConceptoName = (clave) => {
    const found = conceptos.find(c => (c.codigo || c.CODIGO) === clave);
    return found ? (found.DENOMINACION || found.concepto) : 'Todos los Conceptos';
  };

  const SelectorModal = ({ type, data, title, currentVal, setVal }) => (
    <Modal visible={modalVisible === type} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setModalVisible(null)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
                <TouchableOpacity onPress={() => setModalVisible(null)}>
                  <Icon name="close-circle" size={28} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={data}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => {
                  const label = item.label || item.DESCRIPCION || item.descripcion || item.DENOMINACION || item.concepto;
                  const value = item.value !== undefined ? item.value : (item.codigo || item.CLAVE || item.CODIGO);
                  const isSelected = currentVal === value;

                  return (
                    <TouchableOpacity 
                      style={[styles.modalItem, isSelected && styles.modalItemSelected]} 
                      onPress={() => { setVal(value); setModalVisible(null); }}
                    >
                      <Icon 
                        name={isSelected ? "record-circle-outline" : "circle-outline"} 
                        size={22} 
                        color={isSelected ? "#8B0000" : "#9CA3AF"} 
                      />
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderItem = ({ item }) => {
    const isPaid = (item.CODIGOESTADORECIBO || item.estado) === 'C';
    const importe = Number(item.IMPORTE || item.importe || 0).toFixed(2);
    
    return (
      <View style={styles.card}>
        <View style={[styles.statusIndicator, { backgroundColor: isPaid ? '#4CAF50' : '#F44336' }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.receiptLabel}>RECIBO N°</Text>
              <Text style={styles.receiptNumber}>{item.NUMERO || item.CONSECUTIVORECIBO || '---'}</Text>
            </View>
            <View style={[styles.badge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
              <Icon name={isPaid ? "check-circle" : "clock-outline"} size={14} color={isPaid ? "#2E7D32" : "#C62828"} />
              <Text style={[styles.badgeText, isPaid ? styles.paidText : styles.pendingText]}>
                {isPaid ? 'PAGADO' : 'PENDIENTE'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Icon name="tag-outline" size={18} color="#8B0000" />
            <Text style={styles.infoText} numberOfLines={2}>{item.DENOMINACION || item.DESCRIPCION || 'Concepto'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar-month-outline" size={18} color="#8B0000" />
            <Text style={styles.infoText}>{getPeriodoName(item.CLAVEPERIODO || item.periodo) || 'Periodo actual'}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Monto Total:</Text>
            <Text style={styles.amountValue}>S/ {importe}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Recibos</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Home')}>
          <Icon name="home-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterCard}>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible('estado')}>
            <Icon name="filter-variant" size={20} color="#8B0000" />
            <Text style={styles.selectBtnText}>
              {estado === 'P' ? 'Pendientes' : estado === 'C' ? 'Cancelados' : 'Todos los Estados'}
            </Text>
            <Icon name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible('concepto')}>
            <Icon name="book-outline" size={20} color="#8B0000" />
            <Text style={styles.selectBtnText} numberOfLines={1}>
              {claseobjeto ? getConceptoName(claseobjeto) : 'Todos los Conceptos'}
            </Text>
            <Icon name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible('periodo')}>
            <Icon name="calendar-clock" size={20} color="#8B0000" />
            <Text style={styles.selectBtnText} numberOfLines={1}>
              {periodo ? getPeriodoName(periodo) : 'Todos los Periodos'}
            </Text>
            <Icon name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <SelectorModal 
        type="estado" title="Seleccionar Estado" currentVal={estado} setVal={setEstado}
        data={[{label: 'Todos los Estados', value: ''}, {label: 'Pendiente', value: 'P'}, {label: 'Cancelado', value: 'C'}]}
      />
      <SelectorModal 
        type="concepto" title="Seleccionar Concepto" currentVal={claseobjeto} setVal={setClaseobjeto}
        data={[{DENOMINACION: 'Todos los Conceptos', CODIGO: ''}, ...conceptos]}
      />
      <SelectorModal 
        type="periodo" title="Seleccionar Periodo" currentVal={periodo} setVal={setPeriodo}
        data={[{DESCRIPCION: 'Todos los Periodos', CLAVE: ''}, ...periodos]}
      />

      {loading ? (
        <View style={{marginTop: 50}}><ActivityIndicator size="large" color="#8B0000" /></View>
      ) : (
        <FlatList
          data={receipts}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyText}>No hay recibos</Text></View>}
        />
      )}
    </SafeAreaView>
  );
}