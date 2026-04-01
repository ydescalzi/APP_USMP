import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // --- CONTENEDOR PRINCIPAL ---
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },

  // --- HEADER (ESTILO ROJO INSTITUCIONAL) ---
  header: {
    backgroundColor: '#8B0000',
    height: Platform.OS === 'ios' ? 160 : 140, // Un poco más alto en iOS por el Notch
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold',
    letterSpacing: 0.5 
  },
  headerSubtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 13, 
    fontWeight: '500',
    marginTop: 2
  },
  iconBtn: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },

  // --- SECCIONES POR DÍA (SECTIONLIST) ---
  list: { 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 40 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 1,
    marginHorizontal: 10,
    textTransform: 'uppercase'
  },
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#D4AF37', // Línea dorada divisoria
    opacity: 0.4,
  },

  // --- TARJETAS DE CURSOS (CARDS) ---
  card: {
    backgroundColor: '#FFF', 
    borderRadius: 18, 
    marginBottom: 15,
    flexDirection: 'row', 
    overflow: 'hidden',
    // Sombras para Android
    elevation: 4, 
    // Sombras para iOS
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 6,
  },
  statusIndicator: { 
    width: 6,
    backgroundColor: '#8B0000' // Barra lateral roja institucional
  },
  cardBody: { 
    flex: 1, 
    padding: 16 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  cursoText: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginLeft: 10,
    flex: 1,
    lineHeight: 20
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginVertical: 12 
  },

  // --- CONTENEDOR DE HORA Y AULA ---
  amountContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  horaText: { 
    fontSize: 14, 
    color: '#4B5563', 
    marginLeft: 8, 
    fontWeight: '700' 
  },

  // --- ETIQUETA DORADA (AULA/MODALIDAD) ---
  goldTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37', 
  },
  goldTagText: {
    fontSize: 11,
    color: '#8B4513', 
    fontWeight: 'bold',
    letterSpacing: 0.5
  },

  // --- ESTADOS VACÍOS Y CARGA ---
  emptyContainer: { 
    paddingTop: height * 0.15, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: { 
    color: '#9CA3AF', 
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6'
  },

  // --- MODAL Y FILTROS ---
  filterSection: { 
    paddingHorizontal: 20, 
    marginTop: -30, 
    marginBottom: 10 
  },
  filterCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    elevation: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  selectBtnText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600'
  }
});

export default styles;