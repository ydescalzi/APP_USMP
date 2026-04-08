import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width * 0.5; // Un poco más ancho para leer mejor

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },

  header: {
    backgroundColor: '#8B0000',
    height: Platform.OS === 'ios' ? 120 : 100, // Altura corregida sin errores
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },

  tableContainer: { 
    paddingHorizontal: 15, 
    paddingTop: 25,
    paddingBottom: 50 
  },
  column: { 
    width: COLUMN_WIDTH, 
    marginHorizontal: 8 
  },
  dayHeader: {
    paddingVertical: 10,
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingLeft: 10,
  },
  dayText: { 
    color: '#111827', 
    fontWeight: '900', 
    fontSize: 18, 
    letterSpacing: 0.5 
  },

  classCard: {
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    minHeight: 130,
    borderLeftWidth: 8,
    // Sutil sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  classTime: { 
    fontSize: 12, 
    fontWeight: '800', 
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  classTitle: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1F2937', 
    lineHeight: 19,
    marginBottom: 12 
  },
  classFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  classRoom: { 
    fontSize: 11, 
    color: '#374151', 
    marginLeft: 4, 
    fontWeight: '700' 
  },

  emptyDay: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  emptyDayText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default styles;