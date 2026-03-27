import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Servicios
import styles from '../../styles/ProfileStyles';
import api from '../../services/api';

/* =========================
   MODAL DE ÉXITO
========================= */
const SuccessModal = ({ visible, onClose, message }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalIconCircle}>
          <Icon name="check-bold" size={45} color="#FFFFFF" />
        </View>
        <Text style={styles.modalTitle}>¡Operación Exitosa!</Text>
        <Text style={styles.modalMessage}>{message}</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

/* =========================
   PANTALLA DE PERFIL
========================= */
export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Campos editables
  const [direccion, setDireccion] = useState('');
  const [celular, setCelular] = useState('');
  const [emailPersonal, setEmailPersonal] = useState('');
  
  // Estado para manejar errores de carga de imagen
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  /* =========================
     GESTIÓN DE FOTOS
  ========================= */
  const seleccionarFoto = () => {
    Alert.alert("Foto de Perfil", "Selecciona una opción", [
      { text: "Cámara", onPress: () => abrirCamara() },
      { text: "Galería", onPress: () => abrirGaleria() },
      { text: "Cancelar", style: "cancel" }
    ]);
  };

  const abrirCamara = () => {
    launchCamera({ mediaType: "photo", quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        console.log("Nueva foto:", response.assets[0].uri);
        // Aquí deberías implementar la lógica para subir la imagen al servidor
      }
    });
  };

  const abrirGaleria = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.assets && response.assets.length > 0) {
        console.log("Nueva foto:", response.assets[0].uri);
      }
    });
  };

  /* =========================
     OBTENER DATOS DEL PERFIL
  ========================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setImageError(false);

      const token = await AsyncStorage.getItem('token');
      const userRaw = await AsyncStorage.getItem('user');
      const localUser = JSON.parse(userRaw);

      const codigoSAP = localUser?.codigoSAP || localUser?.CodigoSAP || localUser?.CODIGOSAP;

      const response = await api.get(`/perfil/${codigoSAP}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data = response.data?.data || response.data;

      // --- CORRECCIÓN CRÍTICA DE LA URL DE IMAGEN ---
      if (data.foto) {
        // 1. Si es HTTP, intentamos forzar HTTPS para Android
        if (data.foto.startsWith('http:')) {
            data.foto = data.foto.replace('http:', 'https:');
        }
        // 2. Si recibes solo el nombre del archivo, concatena tu URL base
        // data.foto = `https://tu-servidor.com/storage/${data.foto}`;
      }

      setUser(data);
      setDireccion(data.direccion || '');
      setCelular(data.celular || '');
      setEmailPersonal(data.gmailPersonal || '');

    } catch (error) {
      console.error("Error al obtener perfil:", error);
      Alert.alert("Error", "No se pudo obtener el perfil del servidor");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     GUARDAR CAMBIOS
  ========================= */
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');

      const payload = {
        codigoSAP: user.codigoSAP,
        direccion,
        celular,
        gmailPersonal: emailPersonal
      };

      const response = await api.put("/perfil/actualizar", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        setShowSuccess(true);
        fetchProfile();
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={localStyles.center}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={localStyles.loaderText}>Cargando Perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          
          {/* SECCIÓN DEL AVATAR */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { overflow: 'hidden', backgroundColor: '#F5F5F5' }]}>
                
                {user?.foto && !imageError ? (
                  <Image
                    source={{ uri: user.foto }}
                    style={localStyles.avatarImg}
                    resizeMode="cover"
                    onError={(e) => {
                        console.log("Error cargando imagen:", e.nativeEvent.error);
                        setImageError(true);
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    style={localStyles.cameraPlaceholder}
                    onPress={seleccionarFoto}
                  >
                    <Icon name="camera-plus" size={40} color="#8B0000" />
                    <Text style={localStyles.addPhotoText}>
                      {imageError ? "Error al cargar" : "Agregar Foto"}
                    </Text>
                  </TouchableOpacity>
                )}

              </View>
              <View style={styles.onlineBadge} />
            </View>

            <Text style={styles.name}>{user?.nombres} {user?.apellidoPaterno}</Text>
            <Text style={styles.escuelaText}>{user?.escuela}</Text>
            
            <View style={styles.sapBadge}>
              <Text style={styles.sapText}>SAP: {user?.codigoSAP}</Text>
            </View>
          </View>

          {/* INFORMACIÓN ACADÉMICA */}
          <Text style={styles.sectionTitle}>Información Académica</Text>
          <View style={styles.infoGrid}>
            <ReadOnlyBox icon="calendar-check" label="Año Ingreso" value={user?.anioIngreso} />
            <ReadOnlyBox icon="clock-outline" label="Semestre" value={user?.semestreIngreso} />
          </View>

          {/* DATOS DE CONTACTO */}
          <Text style={styles.sectionTitle}>Datos de Contacto</Text>
          <View style={styles.editCard}>
            <EditableField icon="map-marker-radius" label="Dirección" value={direccion} onChangeText={setDireccion} />
            <EditableField icon="phone" label="Celular" value={celular} onChangeText={setCelular} keyboardType="phone-pad" />
            <EditableField icon="email" label="Correo Personal" value={emailPersonal} onChangeText={setEmailPersonal} keyboardType="email-address" />
          </View>

          {/* BOTÓN ACTUALIZAR */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#8B0000" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="content-save-check" size={20} color="#8B0000" style={{ marginRight: 8 }} />
                <Text style={styles.saveText}>ACTUALIZAR PERFIL</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal 
        visible={showSuccess} 
        message="Tu perfil ha sido actualizado correctamente" 
        onClose={() => setShowSuccess(false)} 
      />
    </SafeAreaView>
  );
}

/* =========================
   SUB-COMPONENTES REUTILIZABLES
========================= */
const ReadOnlyBox = ({ icon, label, value }) => (
  <View style={styles.readOnlyBox}>
    <Icon name={icon} size={22} color="#8B0000" />
    <View style={{ marginLeft: 10 }}>
      <Text style={styles.miniLabel}>{label}</Text>
      <Text style={styles.miniValue}>{value || "-"}</Text>
    </View>
  </View>
);

const EditableField = ({ icon, label, value, onChangeText, keyboardType }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputGroup}>
      <Icon name={icon} size={20} color="#8B0000" style={styles.inputIcon} />
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={onChangeText} 
        keyboardType={keyboardType} 
        placeholderTextColor="#999"
      />
    </View>
  </View>
);

/* Estilos locales de seguridad para asegurar visibilidad */
const localStyles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, color: "#8B0000", fontWeight: "600" },
  avatarImg: { width: '100%', height: '100%' }, // Importante: dimensiones al 100% del padre
  cameraPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  addPhotoText: { fontSize: 12, color: "#8B0000", marginTop: 5, textAlign: 'center' }
});