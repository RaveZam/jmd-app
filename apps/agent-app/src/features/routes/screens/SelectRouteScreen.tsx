import { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

import { Route } from "../types/routes-type";
import { CreateRouteModal } from "../components/create-route-components/createRouteModal";
import useGetRoutes from "../hooks/useGetRoutes";
import { useEffect } from "react";

export default function SelectRouteScreen() {
  const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);
  const { getAllRoutes } = useGetRoutes();
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    (async () => {
      const routes = await getAllRoutes();
      setRoutes(routes);
    })();
  }, [showCreateRouteModal]);
  console.log("routes", routes);
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.title}
                lightColor={Colors.light.text}
                darkColor={Colors.light.text}
              >
                Select Route
              </ThemedText>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/main/settings" as any)}
                style={styles.settingsButton}
                testID="open-settings"
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={Colors.light.text}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionSpacing}>
              {routes.map((route: Route) => (
                <TouchableOpacity
                  key={route.id}
                  activeOpacity={0.7}
                  style={styles.routeCard}
                  onPress={() => {
                    console.log("Selected route:", route.id);
                    router.push({
                      pathname: "/main/routes/list",
                      params: { routeId: route.id, routeName: route.name },
                    });
                  }}
                  testID={`route-item-${route.id}`}
                >
                  <ThemedText type="default" style={styles.routeName}>
                    {route.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
              {routes.length === 0 && (
                <ThemedText style={styles.emptyStateText}>
                  No routes yet. Create one to get started!
                </ThemedText>
              )}
            </View>
          </ScrollView>
        </View>

        {!showCreateRouteModal && (
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.9}
            onPress={() => setShowCreateRouteModal(true)}
          >
            <Ionicons name="add" size={26} color={Colors.light.background} />
          </TouchableOpacity>
        )}

        {showCreateRouteModal && (
          <CreateRouteModal onClose={() => setShowCreateRouteModal(false)} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    gap: 12,
  },
  headerSection: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginTop: 10,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96,
  },
  sectionSpacing: {
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 4,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  routeName: {
    fontSize: 16,
    color: "#000000",
  },
  emptyStateText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 32,
    fontSize: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  settingsButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
