import { StyleSheet, Dimensions, ViewStyle, TextStyle } from "react-native";

const { width } = Dimensions.get("window");

// Definición de interfaces para mantener el tipado fuerte de TS
interface HomeDocStyles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  profileSection: ViewStyle;
  avatarContainer: ViewStyle;
  profileInfo: ViewStyle;
  welcome: TextStyle;
  name: TextStyle;
  menuGrid: ViewStyle;
  menuButton: ViewStyle;
  iconContainer: ViewStyle;
  menuText: TextStyle;
  logoutButton: ViewStyle;
  logoutText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
}

const PRIMARY_COLOR = "#9B0000";
const SECONDARY_COLOR = "#333333";
const BACKGROUND_LIGHT = "#F8F9FA";

export const styles = StyleSheet.create<HomeDocStyles>({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  /* HEADER: Estilo curvado para dar profundidad */
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    marginTop: 2,
  },

  /* PERFIL: Tarjeta flotante sobre el header */
  profileSection: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -35, // Efecto de solapamiento
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    // Sombras para Android/iOS
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },

  avatarContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 40,
    padding: 5,
    marginRight: 15,
  },

  profileInfo: {
    flex: 1,
  },

  welcome: {
    fontSize: 12,
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "600",
  },

  name: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 2,
  },

  /* MENÚ: Grid de dos columnas */
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
    paddingBottom: 100, // Espacio para el footer
  },

  menuButton: {
    backgroundColor: "#FFFFFF",
    width: width * 0.43, // Casi la mitad del ancho menos el padding
    height: 130,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  iconContainer: {
    backgroundColor: "#FCECEC", // Fondo rojizo muy suave
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
  },

  menuText: {
    color: "#444444",
    fontSize: 14,
    fontWeight: "700",
  },

  /* BOTÓN CERRAR SESIÓN */
  logoutButton: {
    backgroundColor: SECONDARY_COLOR,
    width: width * 0.43,
    height: 130,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    elevation: 4,
  },

  logoutText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 14,
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 18,
    backgroundColor: BACKGROUND_LIGHT,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    alignItems: "center",
  },

  footerText: {
    fontSize: 11,
    color: "#999999",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});