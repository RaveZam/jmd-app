import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/ui/header";
import { EndRouteModal } from "../components/session-route-components/EndRouteModal";
import usePlanRoute from "../hooks/session_hooks/usePlanRoute";
import { useEffect } from "react";

export default function SessionRouteScreen() {
  const params = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
  }>();

  const routeName =
    typeof params.routeName === "string" ? params.routeName : "Route";

  const [showEndModal, setShowEndModal] = useState(false);

  const handleEndConfirm = () => {
    setShowEndModal(false);
    router.push("/main/routes");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        <Header title={routeName} />

        <View style={styles.content}>
          <Text style={styles.placeholder}>Session screen coming soon.</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.endRouteButton}
            activeOpacity={0.85}
            onPress={() => setShowEndModal(true)}
          >
            <LinearGradient
              colors={["#991B1B", "#7F1D1D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.endRouteButtonGradient}
            >
              <Ionicons name="stop-circle-outline" size={22} color="#FFFFFF" />
              <Text style={styles.endRouteButtonText}>End Route</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <EndRouteModal
          visible={showEndModal}
          onConfirm={handleEndConfirm}
          onCancel={() => setShowEndModal(false)}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 14,
    color: "#94A3B8",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  endRouteButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  endRouteButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  endRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
