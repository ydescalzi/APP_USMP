import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Platform
} from 'react-native';

import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CalendarScreen() {
  const [selected, setSelected] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [events, setEvents] = useState({});

  // Cargar eventos guardados al iniciar
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await AsyncStorage.getItem('EVENTS');
      if (data) setEvents(JSON.parse(data));
    } catch (e) {
      console.log(e);
    }
  };

  // Guardar eventos
  const saveEvents = async (newEvents) => {
    try {
      await AsyncStorage.setItem('EVENTS', JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (e) {
      console.log(e);
    }
  };

  // ➕ Agregar evento
  const addEvent = () => {
    if (!selected || !title) return;

    const newEvent = {
      title,
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedEvents = {
      ...events,
      [selected]: events[selected] ? [...events[selected], newEvent] : [newEvent]
    };

    saveEvents(updatedEvents);
    setTitle('');
    setTime(new Date());
    setModalVisible(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendario Académico</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="plus-circle" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Calendar
          onDayPress={(day) => setSelected(day.dateString)}
          markedDates={{
            ...Object.fromEntries(
              Object.keys(events).map((date) => [
                date,
                { marked: true, dotColor: '#9B0000' }
              ])
            ),
            [selected]: { selected: true, selectedColor: '#9B0000' }
          }}
          theme={{
            selectedDayBackgroundColor: '#9B0000',
            todayTextColor: '#FFD700',
            arrowColor: '#9B0000'
          }}
        />

        {/* LISTA DE EVENTOS DEL DÍA */}
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>Eventos del día</Text>
          {selected && events[selected] ? (
            events[selected].map((ev, index) => (
              <View key={index} style={styles.eventItem}>
                <Icon name="bell-ring" size={20} color="#9B0000" />
                <Text style={styles.eventText}>
                  {ev.time} - {ev.title}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#777', marginTop: 10 }}>No hay eventos</Text>
          )}
        </View>
      </ScrollView>

      {/* MODAL AGREGAR EVENTO */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Evento</Text>

            <TextInput
              placeholder="Ej: Examen Parcial"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: {
    backgroundColor: '#9B0000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  eventsContainer: { margin: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 15 },
  eventsTitle: { fontWeight: 'bold', marginBottom: 10 },
  eventItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  eventText: { marginLeft: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFF', margin: 20, padding: 25, borderRadius: 20 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 12, marginBottom: 15 },
  timeButton: { padding: 12, backgroundColor: '#EEE', borderRadius: 12, marginBottom: 15 },
  timeText: { textAlign: 'center' },
  saveButton: { backgroundColor: '#9B0000', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  saveText: { color: '#FFD700', fontWeight: 'bold' },
  cancelText: { textAlign: 'center', color: '#777' }
});