import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StatusBar, FlatList, TouchableOpacity,
  ActivityIndicator, Platform, Modal, TouchableWithoutFeedback, ScrollView, StyleSheet
} from 'react-native';
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
  const [instruccionesVisible, setInstruccionesVisible] = useState(false);

  // --- ESTADO PARA ALERTAS DE PAGO ---
  const [alertaPago, setAlertaPago] = useState(null);

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

  // --- LÓGICA DE VERIFICACIÓN DE VENCIMIENTOS (A 15 DÍAS) ---
  const verificarVencimientos = (recibos) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const pendientes = recibos.filter(r => (r.CODIGOESTADORECIBO || r.estado) === 'P');

    for (let recibo of pendientes) {
      const fechaVenRaw = recibo.FECHAVENCIMIENTO || recibo.vencimiento || recibo.FECHA_VENCIMIENTO;
      if (!fechaVenRaw) continue;

      const fechaVen = new Date(fechaVenRaw);
      fechaVen.setHours(0, 0, 0, 0);
      
      const diffTime = fechaVen - hoy;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        setAlertaPago({
          tipo: 'vencido',
          mensaje: `Tienes un recibo vencido hace ${Math.abs(diffDays)} día(s).`,
          concepto: recibo.DENOMINACION || recibo.DESCRIPCION || 'Concepto de pago'
        });
        break; 
      } 
      else if (diffDays <= 15) {
        setAlertaPago({
          tipo: 'proximo',
          mensaje: diffDays === 0 
            ? "¡Tu pago vence hoy!" 
            : `Tu próximo pago vence en ${diffDays} día(s).`,
          concepto: recibo.DENOMINACION || recibo.DESCRIPCION || 'Concepto de pago'
        });
        break;
      }
    }
  };

  const loadReceipts = useCallback(async () => {
    if (!codigosap) return;
    try {
      setLoading(true);
      setAlertaPago(null); 
      const res = await api.get(`/recibos/${codigosap}`, {
        params: { estado: estado || undefined, claseobjeto: claseobjeto || undefined, periodo: periodo || undefined },
      });
      const data = res.data?.data || res.data || [];
      const rows = Array.isArray(data) ? data : data.rows || [];

      const sortedData = [...rows].sort((a, b) => {
        const estA = a.CODIGOESTADORECIBO || a.estado;
        const estB = b.CODIGOESTADORECIBO || b.estado;
        if (estA === 'P' && estB !== 'P') return -1;
        if (estA !== 'P' && estB === 'P') return 1;
        return 0;
      });

      setReceipts(sortedData);
      verificarVencimientos(sortedData);

    } catch (err) { 
      setReceipts([]); 
    } finally { 
      setLoading(false); 
    }
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

  const PagoModal = () => (
    <Modal visible={instruccionesVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="bank-transfer" size={26} color="#8B0000" />
              <Text style={[styles.modalTitle, {marginLeft: 10, color: '#8B0000'}]}>TESORERÍA USMP-FN</Text>
            </View>
            <TouchableOpacity onPress={() => setInstruccionesVisible(false)}>
              <Icon name="close-circle" size={28} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ paddingHorizontal: 20 }}>
            <View style={styles.insSectionTitle}>
              <Icon name="clock-check-outline" size={20} color="#8B0000" />
              <Text style={styles.insTitleText}>Horario de Atención</Text>
            </View>
            <Text style={[styles.insDescription, {marginBottom: 10}]}>
              De Lunes a Viernes de 8:00 am a 13:00pm / 13:45 A 16:45 pm.
            </Text>

            <View style={styles.insSectionTitle}>
              <Icon name="credit-card-settings-outline" size={20} color="#8B0000" />
              <Text style={styles.insTitleText}>Modalidades de Pago</Text>
            </View>

            {[
              { icon: "storefront-outline", label: "Agentes", desc: "Efectivo en agentes BIF, Scotiabank, BCP, BBVA e Interbank." },
              { icon: "laptop-account", label: "Intranet SAP", desc: "Solo para alumnos matriculados en el semestre actual." },
              { icon: "cellphone-nfc", label: "Banca Móvil", desc: "Apps de los cinco bancos autorizados mencionados." },
              { icon: "map-marker-radius-outline", label: "Oficina de Tesorería", desc: "Solo tarjetas (débito/crédito). NO EFECTIVO." },
              { icon: "qrcode-scan", label: "Yape", desc: "Opción 'Yapear Servicios' / USMP / Cód. SAP o DNI." },
            ].map((item, index) => (
              <View key={index} style={styles.insItem}>
                <View style={styles.insIconContainer}><Icon name={item.icon} size={18} color="#8B0000" /></View>
                <View style={styles.insTextContainer}>
                  <Text style={styles.insLabel}>{item.label}</Text>
                  <Text style={styles.insDescription}>{item.desc}</Text>
                </View>
              </View>
            ))}

            <View style={styles.insAlertCard}>
              <Icon name="alert-decagram" size={24} color="#856404" />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={{fontWeight: 'bold', color: '#856404', fontSize: 13}}>¡IMPORTANTE EN AGENTES!</Text>
                <Text style={styles.insAlertText}>Indique su código (DNI) y verifique en su SAP que el pago figure como "REGISTRADO".</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.btnEntendido, {marginBottom: 20}]} onPress={() => setInstruccionesVisible(false)}>
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>ENTENDIDO</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

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
                      <Icon name={isSelected ? "record-circle-outline" : "circle-outline"} size={22} color={isSelected ? "#8B0000" : "#9CA3AF"} />
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>{label}</Text>
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
      <TouchableOpacity activeOpacity={0.8} onPress={() => !isPaid && setInstruccionesVisible(true)} style={styles.card}>
        <View style={[styles.statusIndicator, { backgroundColor: isPaid ? '#4CAF50' : '#F44336' }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.receiptLabel}>RECIBO N°</Text>
              <Text style={styles.receiptNumber}>{item.NUMERO || item.CONSECUTIVORECIBO || '---'}</Text>
            </View>
            <View style={[styles.badge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
              <Icon name={isPaid ? "check-circle" : "information-outline"} size={14} color={isPaid ? "#2E7D32" : "#DC2626"} />
              <Text style={[styles.badgeText, isPaid ? styles.paidText : styles.pendingText]}>
                {isPaid ? 'PAGADO' : '¿CÓMO PAGAR?'}
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
          {!isPaid && (
            <View style={localStyles.payPrompt}>
              <Icon name="touch-app" size={16} color="#8B0000" />
              <Text style={localStyles.payPromptText}>Presiona para ver instructivo</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
            <Text style={styles.selectBtnText}>{estado === 'P' ? 'Pendientes' : estado === 'C' ? 'Cancelados' : 'Todos los Estados'}</Text>
            <Icon name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible('concepto')}>
            <Icon name="book-outline" size={20} color="#8B0000" />
            <Text style={styles.selectBtnText} numberOfLines={1}>{claseobjeto ? getConceptoName(claseobjeto) : 'Todos los Conceptos'}</Text>
            <Icon name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectBtn} onPress={() => setModalVisible('periodo')}>
            <Icon name="calendar-clock" size={20} color="#8B0000" />
            <Text style={styles.selectBtnText} numberOfLines={1}>{periodo ? getPeriodoName(periodo) : 'Todos los Periodos'}</Text>
            <Icon name="chevron-down" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <PagoModal />

      {alertaPago && (
        <View style={[localStyles.alertBanner, { backgroundColor: alertaPago.tipo === 'vencido' ? '#FFF5F5' : '#FFFBEB' }]}>
          <Icon 
            name={alertaPago.tipo === 'vencido' ? "alert-octagon" : "clock-alert-outline"} 
            size={24} 
            color={alertaPago.tipo === 'vencido' ? "#DC2626" : "#D97706"} 
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[localStyles.alertTitle, { color: alertaPago.tipo === 'vencido' ? "#991B1B" : "#92400E" }]}>
              {alertaPago.tipo === 'vencido' ? '¡Pago Vencido!' : 'Próximo Vencimiento'}
            </Text>
            <Text style={localStyles.alertMessage}>{alertaPago.mensaje}</Text>
            <Text style={localStyles.alertConcept} numberOfLines={1}>{alertaPago.concepto}</Text>
          </View>
          <TouchableOpacity onPress={() => setAlertaPago(null)}>
            <Icon name="close" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      )}

      <SelectorModal type="estado" title="Seleccionar Estado" currentVal={estado} setVal={setEstado} data={[{label: 'Todos los Estados', value: ''}, {label: 'Pendiente', value: 'P'}, {label: 'Cancelado', value: 'C'}]} />
      <SelectorModal type="concepto" title="Seleccionar Concepto" currentVal={claseobjeto} setVal={setClaseobjeto} data={[{DENOMINACION: 'Todos los Conceptos', CODIGO: ''}, ...conceptos]} />
      <SelectorModal type="periodo" title="Seleccionar Periodo" currentVal={periodo} setVal={setPeriodo} data={[{DESCRIPCION: 'Todos los Periodos', CLAVE: ''}, ...periodos]} />

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}><ActivityIndicator size="large" color="#8B0000" /></View>
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

const localStyles = StyleSheet.create({
  alertBanner: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 3 } }),
  },
  alertTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  alertMessage: { fontSize: 13, color: '#4B5563' },
  alertConcept: { fontSize: 11, fontStyle: 'italic', color: '#6B7280', marginTop: 2 },
  payPrompt: { backgroundColor: '#FFF5F5', padding: 8, borderRadius: 8, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#FEE2E2' },
  payPromptText: { color: '#8B0000', fontSize: 11, fontWeight: 'bold', marginLeft: 5 }
});