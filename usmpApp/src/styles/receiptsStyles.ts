import { StyleSheet, Platform, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#8B0000',
    height: 125,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  iconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  
  filterSection: { paddingHorizontal: 20, marginTop: -40, marginBottom: 10 },
  filterCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },

  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  selectBtnText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500'
  },

  // --- ESTILOS DEL MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20
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

  // --- ESTILOS ESPECÍFICOS DEL INSTRUCTIVO (NUEVO) ---
  insSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 8
  },
  insTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B0000',
    marginLeft: 8,
    textTransform: 'uppercase'
  },
  insItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 5
  },
  insIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF1F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FFCCC7'
  },
  insTextContainer: {
    flex: 1
  },
  insLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  insDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18
  },
  insAlertCard: {
    backgroundColor: '#FFFBE6',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE58F',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row'
  },
  insAlertText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    lineHeight: 17,
    marginLeft: 10
  },
  btnEntendido: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8B0000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  },

  // --- RESTO DE ESTILOS ---
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB'
  },
  modalItemSelected: { backgroundColor: '#FFF5F5' },
  modalItemText: { marginLeft: 15, fontSize: 15, color: '#4B5563' },
  modalItemTextSelected: { color: '#8B0000', fontWeight: 'bold' },

  list: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF', borderRadius: 18, marginBottom: 15,
    flexDirection: 'row', overflow: 'hidden',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
  },
  statusIndicator: { width: 6 },
  cardBody: { flex: 1, padding: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  receiptLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: 'bold' },
  receiptNumber: { fontSize: 15, fontWeight: '800', color: '#111827' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  paidBadge: { backgroundColor: '#E8F5E9' },
  pendingBadge: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  paidText: { color: '#2E7D32' },
  pendingText: { color: '#DC2626' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#4B5563', marginLeft: 10, flex: 1 },
  amountContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  amountLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  amountValue: { fontSize: 17, fontWeight: 'bold', color: '#8B0000' },
  emptyContainer: { padding: 50, alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 15 },
});