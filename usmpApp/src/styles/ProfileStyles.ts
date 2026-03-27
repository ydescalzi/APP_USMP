import { StyleSheet, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';

const { width } = Dimensions.get('window');

// Definición de la interfaz para asegurar que todos los estilos tengan el tipo correcto
interface Styles {
  container: ViewStyle;
  loader: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  backButton: ViewStyle;
  content: ViewStyle;
  profileCard: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ViewStyle;
  avatarImage: ImageStyle;
  editPhotoBadge: ViewStyle;
  onlineBadge: ViewStyle;
  name: TextStyle;
  escuelaText: TextStyle;
  sapBadge: ViewStyle;
  sapText: TextStyle;
  sectionTitle: TextStyle;
  infoGrid: ViewStyle;
  readOnlyBox: ViewStyle;
  miniLabel: TextStyle;
  miniValue: TextStyle;
  editCard: ViewStyle;
  inputWrapper: ViewStyle;
  inputLabel: TextStyle;
  inputGroup: ViewStyle;
  inputIcon: TextStyle;
  input: TextStyle;
  saveButton: ViewStyle;
  saveText: TextStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalIconCircle: ViewStyle;
  modalTitle: TextStyle;
  modalMessage: TextStyle;
  modalButton: ViewStyle;
  modalButtonText: TextStyle;
}

export default StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },

  header: {
    backgroundColor: '#8B0000',
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },

  backButton: {
    padding: 5,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginTop: -30,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 25,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
  width: 110,
  height: 110,
  borderRadius: 55,
  backgroundColor: '#FFF5F5',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#FFD700',
  overflow: 'hidden',
  elevation: 4,
  },

  avatarImage: {
  width: 120, // Ajusta al tamaño de tu contenedor
  height: 120,
  borderRadius: 60,
  },

  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B0000',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },

  onlineBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center'
  },

  escuelaText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },

  sapBadge: {
    backgroundColor: '#8B000015',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },

  sapText: {
    color: '#8B0000',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 15,
    marginLeft: 5,
  },

  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

  readOnlyBox: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  miniLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },

  miniValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },

  editCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    elevation: 3,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  inputWrapper: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },

  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 15,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },

  saveButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20,
  },

  saveText: {
    color: '#8B0000',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1.2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },

  modalIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -70,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    elevation: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 15,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },

  modalButton: {
    backgroundColor: '#8B0000',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 3,
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
});