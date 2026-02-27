import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StoreCard, TenderedCard } from "../components/RouteComponents";
import { RoutesProvider, useRoutes } from "../context/RoutesContext";

export default function ListRoute() {
  return (
    <RoutesProvider>
      <ListRouteContent />
    </RoutesProvider>
  );
}

function ListRouteContent() {
  const { routes } = useRoutes();
  const firstRoute = routes[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.8}
                onPress={() => router.push("/main/routes/select")}
              >
                <Ionicons name="arrow-back-outline" size={16} color="#0F172A" />
              </TouchableOpacity>
              <ThemedText
                type="defaultSemiBold"
                style={styles.title}
                lightColor="#0F172A"
                darkColor="#0F172A"
              >
                Route: {firstRoute?.name ?? "Selected Route"}
              </ThemedText>
            </View>

            <View style={styles.divider} />
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                placeholder="Search Store..."
                placeholderTextColor="#94A3B8"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
              <Ionicons name="options-outline" size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionSpacing}>
              {/* Untendered Cards */}
              <StoreCard
                name="Kapitolyo"
                areaTag="Pasig"
                address="Kapitolyo, Pasig City"
                status="Not yet today"
                contactName="Mia"
                contactNumber="0917 000 0003"
              />
            </View>
            {/* Tendered Cards */}
            <View style={styles.sectionSpacing}>
              <TenderedCard
                routeName="Guadalupe"
                areaTag="Makati"
                address="Guadalupe Nuevo, Makati City"
                contactName="Rico"
                contactNumber="0917 000 0002"
              />
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 12,
  },
  headerSection: {
    gap: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  title: {
    fontSize: 16,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 10,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionSpacing: {
    gap: 12,
    marginBottom: 24,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1F6B46",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabIcon: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "700",
  },
});
