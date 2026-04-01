import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function MarcacionesScreen({ navigation }) {

  const [loading, setLoading] = useState(true);
  const [marcaciones, setMarcaciones] = useState([]);

  useEffect(() => {
    loadMarcaciones();
  }, []);

  const loadMarcaciones = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      /* AQUÍ LUEGO IRÁ TU API */

      const dataDemo = [
        {
          id: "1",
          fecha: "10/03/2026",
          entrada: "08:00 AM",
          salida: "01:00 PM"
        },
        {
          id: "2",
          fecha: "09/03/2026",
          entrada: "08:05 AM",
          salida: "01:02 PM"
        },
        {
          id: "3",
          fecha: "08/03/2026",
          entrada: "07:58 AM",
          salida: "12:55 PM"
        }
      ];

      setMarcaciones(dataDemo);

    } catch (error) {

      console.log("Error cargando marcaciones", error);

    }

    setLoading(false);
  };

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <View style={styles.row}>

        <Icon name="calendar" size={22} color="#9B0000" />

        <Text style={styles.fecha}>
          {item.fecha}
        </Text>

      </View>

      <View style={styles.row}>

        <Icon name="login" size={22} color="green" />

        <Text style={styles.text}>
          Entrada: {item.entrada}
        </Text>

      </View>

      <View style={styles.row}>

        <Icon name="logout" size={22} color="red" />

        <Text style={styles.text}>
          Salida: {item.salida}
        </Text>

      </View>

    </View>

  );

  if (loading) {

    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#9B0000" />
      </SafeAreaView>
    );

  }

  return (

    <SafeAreaView style={styles.container}>

      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>
          Marcaciones
        </Text>

      </View>

      <FlatList
        data={marcaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

    </SafeAreaView>

  );

}

const styles = {

  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 15
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },

  fecha: {
    fontWeight: "bold",
    marginLeft: 10
  },

  text: {
    marginLeft: 10
  }

};