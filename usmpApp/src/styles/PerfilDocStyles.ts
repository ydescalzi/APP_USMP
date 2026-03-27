import { StyleSheet, Dimensions, TextStyle, ViewStyle, Platform } from "react-native";

const { width } = Dimensions.get("window");

interface Styles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  headerBanner: ViewStyle;
  avatarCircle: ViewStyle;
  headerName: TextStyle;
  headerLastName: TextStyle;
  mainCard: ViewStyle;
  cardHeader: ViewStyle;
  cardTitle: TextStyle;
  inputGroup: ViewStyle;
  label: TextStyle;
  inputWrapper: ViewStyle;
  inputIcon: ViewStyle;
  input: TextStyle;
  infoRow: ViewStyle;
  value: TextStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
  modalOverlay: ViewStyle;
  modalGlassContainer: ViewStyle;
  modalCheckIcon: ViewStyle;
  modalTitle: TextStyle;
  modalDescription: TextStyle;
  modalGradientButton: ViewStyle;
  modalButtonText: TextStyle;
}

export default StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  headerBanner: {
    backgroundColor: "#9B0000",
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginBottom: 12,
  },
  headerName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerLastName: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
    textTransform: 'uppercase',
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 30,
    padding: 25,
    marginBottom: 30,
    elevation: 10,
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#334155",
  },
  infoRow: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#9B0000",
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#9B0000",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalGlassContainer: {
    width: width * 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 15 },
    }),
  },
  modalCheckIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalGradientButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});