import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
// ESTA LÍNEA ES CRÍTICA: WebView debe ir entre llaves { }
import { WebView } from 'react-native-webview'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrowserScreen({ route }) {
  // Extraemos los parámetros de forma segura
  const url = route.params?.url;
  const title = route.params?.title || 'Navegador';

  // Si no hay URL, mostramos un error en lugar de que la app falle
  if (!url) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No se proporcionó una URL válida.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: url }} 
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#8B0000" size="large" />
          </View>
        )}
        // Configuraciones necesarias para Teams y Outlook
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: '#8B0000',
    fontWeight: 'bold'
  }
});