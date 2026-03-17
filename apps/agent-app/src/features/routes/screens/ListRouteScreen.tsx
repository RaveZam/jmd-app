import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  StoreCard,
  TenderedCard,
} from "../components/route-components/RouteComponents";
import { CreateRouteModal } from "../components/create-route-components/createRouteModal";
import { Header } from "@/components/ui/header";

export default function ListRouteScreen() {
  const params = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
  }>();
  const routeId =
    typeof params.routeId === "string" ? params.routeId : undefined;

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <ThemedView style={styles.container}>
        <Header
          title={params?.routeName ?? "Route"}
          onBack={() => router.push("/main/routes")}
        />

        <View style={styles.content}>
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
              {/* {provincesForRoute.map((province) => (
                <View key={province.id}>
                  <ThemedText type="defaultSemiBold" style={styles.subtitle}>
                    {province.name}
                  </ThemedText>
                  {province.storeIds.map((storeId) => {
                    const store = stores.find((store) => store.id === storeId);
                    if (!store) {
                      return null;
                    }
                    return (
                      <StoreCard
                        key={store.id}
                        name={store.name}
                        areaTag={province.name}
                        address={store.address}
                        status="Not yet today"
                        contactName={store.contactName}
                        contactNumber={store.contactNumber}
                        onPress={() =>
                          router.push({
                            pathname: "/main/routes/store/[storeId]",
                            params: { storeId: store.id },
                          })
                        }
                      />
                    );
                  })}
                </View>
              ))} */}
            </View>
            {/* Tendered Cards */}
            {/* <View style={styles.sectionSpacing}>
              <TenderedCard
                routeName="Guadalupe"
                areaTag="Makati"
                address="Guadalupe Nuevo, Makati City"
                contactName="Rico"
                contactNumber="0917 000 0002"
              />
            </View> */}
          </ScrollView>
        </View>

        <View style={styles.startRouteBar}>
          <TouchableOpacity
            style={styles.startRouteButton}
            activeOpacity={0.85}
            onPress={() => {
              // TODO: Start route / begin expedition
            }}
          >
            <LinearGradient
              colors={["#1b6e40", "#0b4c29"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startRouteButtonGradient}
            >
              <Ionicons name="navigate" size={22} color="#FFFFFF" />
              <Text style={styles.startRouteButtonText}>Start Route</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity> */}
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
    paddingTop: 12,
    gap: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    color: "#0F172A",
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
  startRouteBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
  },
  startRouteButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  startRouteButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  startRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
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
