import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  header: {
    backgroundColor: '#8B0000',
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  iconBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 10, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  // SECCIÓN DE FILTRO (CARD FLOTANTE)
  filterSection: { 
    paddingHorizontal: 20, 
    marginTop: -35, 
    marginBottom: 10 
  },
  filterCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    elevation: 8,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
  },
  labelFiltro: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#9CA3AF', 
    marginBottom: 8, 
    textTransform: 'uppercase' 
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  selectBtnText: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 15, 
    color: '#374151', 
    fontWeight: '600' 
  },

  // LISTADO DE CURSOS (CARDS)
  list: { 
    paddingHorizontal: 20, 
    paddingTop: 15, 
    paddingBottom: 40 
  },
  card: {
    backgroundColor: '#FFF', 
    borderRadius: 18, 
    marginBottom: 16,
    flexDirection: 'row', 
    overflow: 'hidden',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5,
  },
  statusIndicator: { 
    width: 6 
  },
  cardBody: { 
    flex: 1, 
    padding: 18 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  receiptLabel: { 
    fontSize: 10, 
    color: '#9CA3AF', 
    fontWeight: 'bold' 
  },
  receiptNumber: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#111827' 
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF5F5', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  badgeText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginLeft: 4, 
    color: '#8B0000' 
  },
  cursoNombre: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#111827', 
    textTransform: 'capitalize', 
    marginVertical: 8 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F3F4F6', 
    marginVertical: 10 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 6 
  },
  infoText: { 
    fontSize: 13, 
    color: '#6B7280', 
    marginLeft: 10, 
    flex: 1 
  },
  amountContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 10, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#F9FAFB' 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  diaText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#374151', 
    marginLeft: 6 
  },
  turnoValue: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#8B0000', 
    backgroundColor: '#FEE2E2', 
    paddingHorizontal: 10, 
    paddingVertical: 2, 
    borderRadius: 6 
  },

  // MODAL DE SELECCIÓN
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContainer: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    maxHeight: height * 0.6, 
    paddingBottom: 20 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  modalItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F9FAFB' 
  },
  modalItemSelected: { 
    backgroundColor: '#FFF5F5' 
  },
  modalItemText: { 
    marginLeft: 15, 
    fontSize: 16, 
    color: '#4B5563' 
  },
  modalItemTextSelected: { 
    color: '#8B0000', 
    fontWeight: 'bold' 
  },

  // CARGAS Y VACÍOS
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loaderText: { 
    marginTop: 15, 
    color: '#9CA3AF', 
    fontSize: 14 
  },
  emptyContainer: { 
    padding: 60, 
    alignItems: 'center' 
  },
  emptyText: { 
    color: '#9CA3AF', 
    fontSize: 15, 
    textAlign: 'center', 
    marginTop: 10 
  },
});