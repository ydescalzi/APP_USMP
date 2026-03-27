import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#8B0000",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubTitle: {
    color: "#F3F4F6",
    fontSize: 14,
  },
  iconBtn: {
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    color: "#555",
  },
  filterSection: {
    padding: 15,
  },
  // Added the missing key that was causing the syntax error
  filterContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000", // Added for iOS shadow consistency
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  periodSelectorContainer: {
    backgroundColor: '#FFF',
    padding: 12,
    marginHorizontal: 15,
    marginTop: -10,
    borderRadius: 10,
    elevation: 3,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 10,
  },
  periodButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 6,
  },
  periodButtonActive: {
    backgroundColor: '#8B0000',
  },
  periodButtonText: {
    color: '#333',
  },
  periodButtonTextActive: {
    color: '#FFF',
  },
  periodText: {
    color: '#555',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
  },
  labelFiltro: {
    fontSize: 14,
    color: "#555",
  },
  selectBtnText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  turnoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8B0000",
  },
  list: {
    padding: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  statusIndicator: {
    width: 6,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardBody: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  receiptNumber: {
    marginLeft: 5,
    color: "#6B7280",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontWeight: "bold",
  },
  cursoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 6,
    color: "#444",
  },
  infoTextBold: {
    fontWeight: "bold",
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 10,
    color: "#999",
  },
});