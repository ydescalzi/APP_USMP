import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
  Modal,
  PermissionsAndroid,
  Platform
} from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';
import styles from '../../styles/LoginStyles';

export default function LoginScreen({ navigation }) {

  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState({ nombres: '' });
  const [tipoUsuario, setTipoUsuario] = useState('');

  // ✅ PERMISO CAMARA
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleLogin = async () => {

    if (!dni.trim() || !email.trim()) {
      Alert.alert('Validación', 'Ingrese DNI y correo');
      return;
    }

    try {

      setLoading(true);

      const response = await api.post('/login', {
        dni: dni.trim(),
        email: email.trim(),
      });

      const { success, tipo, token, user, message } = response.data;

      if (!success || !user) {
        Alert.alert('Error', message || 'Credenciales incorrectas');
        return;
      }

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('tipo', tipo);

      await AsyncStorage.setItem(
        'codigosap',
        String(user.CODIGOSAP || user.codigosap)
      );

      await AsyncStorage.setItem('anio', '2024');
      await AsyncStorage.setItem('semestre', '1');

      setUserData({
        nombres: user.NOMBRES || user.nombres || 'Usuario',
      });

      setTipoUsuario(tipo);
      setModalVisible(true);

    } catch (error) {

      console.log('ERROR LOGIN:', error);

      Alert.alert('Error', 'No se pudo conectar con el servidor');

    } finally {
      setLoading(false);
    }
  };

  // ✅ PROCESAR IMAGEN (CAMARA O GALERIA)
  const procesarImagen = async (response) => {

  if (response.didCancel) return;

  if (response.errorCode) {
    Alert.alert('Error', 'No se pudo obtener la imagen');
    return;
  }

  if (!response.assets || !response.assets.length) {
    Alert.alert('Error', 'No se obtuvo la imagen');
    return;
  }

  try {

    setLoading(true);

    const photo = response.assets[0];

    const formData = new FormData();

    formData.append('file', {
      uri: photo.uri,
      type: photo.type || 'image/jpeg',
      name: photo.fileName || 'face.jpg'
    });

    console.log("Imagen enviada:", photo.uri);

    const res = await api.post(
      '/login-face',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Respuesta backend login-face:', res.data);

    const { success, tipo, token, user, message } = res.data;

    if (!success || !user) {
      Alert.alert('Error', message || 'Rostro no reconocido');
      return;
    }

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('tipo', tipo);

    await AsyncStorage.setItem(
      'codigosap',
      String(user.CODIGOSAP || user.codigosap)
    );

    await AsyncStorage.setItem('anio', '2024');
    await AsyncStorage.setItem('semestre', '1');

    setUserData({
      nombres: user.NOMBRES || 'Usuario'
    });

    setTipoUsuario(tipo);
    setModalVisible(true);

  } catch (error) {

    console.log("ERROR FACE LOGIN:", error?.response?.data || error);

    Alert.alert(
      'Error',
      error?.response?.data?.message || 'No se pudo reconocer el rostro'
    );

  } finally {

    setLoading(false);

  }

};

  // ✅ CAMARA
  const abrirCamara = async () => {

    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      Alert.alert('Permiso requerido', 'Activa la cámara');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        quality: 0.7,
        saveToPhotos: false
      },
      procesarImagen
    );
  };

  // ✅ GALERIA
  const abrirGaleria = () => {
    launchImageLibrary(
      {
        mediaType: 'photo'
      },
      procesarImagen
    );
  };

  // ✅ BOTON PRINCIPAL
  const handleFaceLogin = () => {

    Alert.alert(
      "Ingresar con rostro",
      "Seleccione una opción",
      [
        { text: "Cámara", onPress: abrirCamara },
        { text: "Galería", onPress: abrirGaleria },
        { text: "Cancelar", style: "cancel" }
      ]
    );

  };

  return (
    <LinearGradient colors={['#7A0000', '#9B0000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>

        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo_20_blanco.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Sistema Académico
          </Text>
        </View>

        <View style={styles.card}>

          <View style={styles.inputContainer}>
            <Icon name="card-account-details-outline" size={22} color="#9B0000" />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su DNI"
              keyboardType="numeric"
              value={dni}
              onChangeText={setDni}
              maxLength={8}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={22} color="#9B0000" />
            <TextInput
              style={styles.input}
              placeholder="Correo institucional"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                INGRESAR
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#444', marginTop: 10 }]}
            onPress={handleFaceLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                INGRESAR CON ROSTRO
              </Text>
            )}
          </TouchableOpacity>

        </View>

        <Modal animationType="fade" transparent visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitleText}>
                ¡Bienvenido!
              </Text>

              <Text style={styles.modalUserName}>
                {userData.nombres}
              </Text>

              <TouchableOpacity
                style={styles.modalButtonAction}
                onPress={() => {

                  setModalVisible(false);

                  if (tipoUsuario === 'docente') {
                    navigation.replace('HomeDoc');
                  } else {
                    navigation.replace('Home');
                  }

                }}
              >
                <Text style={styles.modalButtonTextAction}>
                  CONTINUAR
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}