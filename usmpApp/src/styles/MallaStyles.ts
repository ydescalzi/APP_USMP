import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loaderText: { marginTop: 10, color: '#64748B', fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  headerSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '600', textTransform: 'uppercase' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  headerIconContainer: { backgroundColor: '#FFE4E6', padding: 10, borderRadius: 15 },
  sectionContainer: { marginVertical: 10 },
  sectionLabel: { marginLeft: 20, fontSize: 12, fontWeight: '800', color: '#64748B', marginBottom: 10, textTransform: 'uppercase' },
  scrollPadding: { paddingHorizontal: 20, paddingBottom: 10 },
  
  // BOTONES DE PLAN (CHIPS)
  planChip: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginRight: 10,
    minWidth: 140, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  planChipActivo: {
    borderColor: '#FF4B5C',
    backgroundColor: '#FF4B5C',
  },
  planCodigoText: { fontSize: 10, fontWeight: '800', color: '#94A3B8', marginBottom: 2 },
  planChipText: { color: '#64748B', fontWeight: '700', fontSize: 13 },
  planChipTextActivo: { color: '#FFF' },

  // CICLOS Y CURSOS
  filtroButton: { backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  filtroActivo: { backgroundColor: '#334155', borderColor: '#334155' },
  filtroText: { color: '#64748B', fontWeight: '600' },
  filtroTextActivo: { color: '#FFF' },
  cicloSection: { marginTop: 20, paddingHorizontal: 20 },
  cicloHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
  cicloTitle: { fontSize: 18, fontWeight: '700', color: '#334155' },
  cursoCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 20, marginBottom: 12, alignItems: 'center', elevation: 3 },
  cursoIconBlue: { backgroundColor: '#475569', padding: 12, borderRadius: 15, marginRight: 15 },
  cursoInfo: { flex: 1 },
  cursoTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cursoCodigo: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  tipoBadge: { fontSize: 10, fontWeight: '800', color: '#FF4B5C', backgroundColor: '#FFF1F2', paddingHorizontal: 6, borderRadius: 5 },
  cursoText: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  badgerRow: { flexDirection: 'row', marginTop: 10 },
  creditoBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8,
    marginRight: 10
  },
  creditosText: { fontSize: 11, color: '#64748B', fontWeight: '700' },
});