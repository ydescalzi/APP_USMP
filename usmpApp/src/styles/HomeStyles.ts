import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },

  header: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 15,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B0000',
  },

  infoUser: {
    flex: 1,
  },

  welcomeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  tagSede: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 4,
  },

  tagSedeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 5,
  },

  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundLogo: {
    flex: 1,
    marginTop: -15,
  },

  imgStyle: {
    opacity: 0.04,
    resizeMode: 'contain',
    top: 50,
  },

  scrollContent: {
    padding: 20,
    paddingTop: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },

  titleBadge: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },

  titleBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',

    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardContent: {
    alignItems: 'flex-start',
  },

  cardText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },

  cardSubText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },

  cardArrow: {
    position: 'absolute',
    top: 18,
    right: 15,
  },

  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  logoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutOverlayText: {
    color: '#FFF',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    width: width * 0.85,
    borderRadius: 32,
    padding: 25,
    alignItems: 'center',
  },

  modalIconBg: {
    width: 80,
    height: 80,
    backgroundColor: '#FEF2F2',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },

  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 8,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },

  cancelBtnText: {
    color: '#475569',
    fontWeight: '800',
    fontSize: 15,
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 8,
    borderRadius: 18,
    backgroundColor: '#8B0000',
    alignItems: 'center',
  },

  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },

});

export default styles;