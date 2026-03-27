import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import styles from '../../styles/TramiteStyles';

export default function TramiteScreen() {

  const [loading, setLoading] = useState(true);

  const [motivos, setMotivos] = useState([]);
  const [motivo, setMotivo] = useState('');

  // valores fijos
  const origen = 1;
  const tipo = 1;

  useEffect(() => {
    loadMotivos();
  }, []);

  const loadMotivos = async () => {

    try {

      const res = await api.get('/tramites/motivos');

      setMotivos(res.data);

    } catch (error) {

      console.log('Error cargando motivos:', error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#8B0000"/>
      </View>
    );
  }

  return (

    <View style={styles.container}>

      <Text style={styles.label}>Motivo del Documento</Text>

      <Picker
        selectedValue={motivo}
        onValueChange={(value) => setMotivo(value)}
      >
        <Picker.Item label="Seleccione motivo" value="" />

        {motivos.map((item) => (
          <Picker.Item
            key={item.CODIGO}
            label={item.DESCRIPCION}
            value={item.CODIGO}
          />
        ))}

      </Picker>

      <Text style={styles.label}>Origen</Text>

      <Picker
        selectedValue={origen}
        enabled={false}
      >
        <Picker.Item label="Filial Norte" value={1} />
      </Picker>

      <Text style={styles.label}>Tipo Documento</Text>

      <Picker
        selectedValue={tipo}
        enabled={false} 
      >
        <Picker.Item label="Solicitud" value={1} />
      </Picker>

    </View>

  );
}