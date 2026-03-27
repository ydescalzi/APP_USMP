import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// Nota: Si usas degradados en el botón del modal, asegúrate de tener instalada:
// react-native-linear-gradient
import api from "../../services/api";
import styles from "../../styles/PerfilDocStyles";

export default function PerfilDocScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [perfil, setPerfil] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");

  // =========================
  // CARGAR PERFIL DESDE API
  // =========================
  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const codigosap = await AsyncStorage.getItem("codigosap");
      const response = await api.get(`/perfildoc/${codigosap}`);
      if (response.data.success) {
        const data = response.data.data;
        setPerfil(data);
        setDireccion(data.DIRECCION || "");
        setCelular(data.CELULAR || "");
        setCorreo(data.CORREO_PERSONAL || "");
      }
    } catch (error) {
      console.log("ERROR PERFIL DOC:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  // =========================
  // GUARDAR CAMBIOS EN PERFIL
  // =========================
  const guardarPerfil = async () => {
    try {
      setSaving(true);
      const codigosap = await AsyncStorage.getItem("codigosap");
      const response = await api.put("/perfildoc/actualizar", {
        codigosap,
        direccion,
        celular,
        correo
      });

      if (response.data.success) {
        setShowSuccessModal(true);

        // Actualizamos perfil localmente para reflejar cambios inmediatos
        setPerfil(prev => ({
          ...prev,
          DIRECCION: direccion,
          CELULAR: celular,
          CORREO_PERSONAL: correo
        }));

        // Actualizamos también los estados individuales de los inputs
        setDireccion(direccion);
        setCelular(celular);
        setCorreo(correo);
      }
    } catch (error) {
      console.log("ERROR ACTUALIZAR DOC:", error);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9B0000" />
      </View>
    );
  }

  // =========================
  // RENDER PRINCIPAL
  // =========================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9B0000" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER AESTHETIC */}
        <View style={styles.headerBanner}>
          <View style={styles.avatarCircle}>
            <Icon name="account-circle-outline" size={75} color="#FFF" />
          </View>
          <Text style={styles.headerName}>{perfil?.NOMBRES}</Text>
          <Text style={styles.headerLastName}>
            {perfil?.APELLIDOPATERNO} {perfil?.APELLIDOMATERNO}
          </Text>
        </View>

        {/* CARD PRINCIPAL */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Icon name="badge-account-horizontal-outline" size={24} color="#9B0000" />
            <Text style={styles.cardTitle}>Información Personal</Text>
          </View>

          {/* CÓDIGO SAP (Solo lectura con estilo) */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Código SAP</Text>
            <Text style={styles.value}>{perfil?.CODIGOSAP}</Text>
          </View>

          {/* INPUTS DINÁMICOS */}
          {[
            { label: "Dirección", icon: "map-marker-outline", val: direccion, set: setDireccion, ph: "Tu dirección" },
            { label: "Celular", icon: "phone-outline", val: celular, set: setCelular, ph: "999 999 999", type: "phone-pad" },
            { label: "Correo Personal", icon: "email-outline", val: correo, set: setCorreo, ph: "ejemplo@correo.com", type: "email-address" }
          ].map((item, idx) => (
            <View key={idx} style={styles.inputGroup}>
              <Text style={styles.label}>{item.label}</Text>
              <View style={styles.inputWrapper}>
                <Icon name={item.icon} size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={item.val}
                  onChangeText={item.set}
                  keyboardType={item.type || "default"}
                  placeholder={item.ph}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={guardarPerfil}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Guardar cambios</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL PERSONALIZADO */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalGlassContainer}>
            <View style={styles.modalCheckIcon}>
              <Icon name="check-decagram" size={60} color="#A0E9E5" />
            </View>
            <Text style={styles.modalTitle}>¡Actualizado!</Text>
            <Text style={styles.modalDescription}>
              Tus datos se guardaron correctamente en el sistema.
            </Text>
            
            <TouchableOpacity 
              style={[styles.modalGradientButton, { backgroundColor: '#9B0000' }]} 
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}