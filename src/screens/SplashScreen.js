import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  StatusBar
} from 'react-native';

export default function SplashScreen({ navigation }) {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, 
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timer);

  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#9B0000" barStyle="light-content" />

      <Animated.Image
        source={require('../assets/images/logo_20_blanco.png')}
        style={[
          styles.logo, 
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
        resizeMode="contain"
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B0000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: 200,
    height: 200
  }
});