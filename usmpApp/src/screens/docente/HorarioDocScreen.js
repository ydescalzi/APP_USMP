import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function HorarioDocScreen({ navigation }) {

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} />
        </TouchableOpacity>

        <Text style={styles.title}>
          Horario del Docente
        </Text>

      </View>

      <View style={styles.content}>

        <Icon name="calendar-month" size={70} color="#9B0000" />

        <Text style={styles.text}>
          Aquí se mostrará el horario del docente.
        </Text>

      </View>

    </SafeAreaView>

  );

}

const styles = {

  container:{
    flex:1,
    backgroundColor:"#f5f5f5",
    padding:20
  },

  header:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:30
  },

  title:{
    fontSize:20,
    fontWeight:"bold",
    marginLeft:10
  },

  content:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  text:{
    marginTop:15,
    textAlign:"center"
  }

};