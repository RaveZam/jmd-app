import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { RouteSelectionItem } from "../components/SelectRouteComponents";
import RoutesDao from "@/lib/sqlite/dao/routes-dao";
import { Route } from "../types/routes-type";

function SelectRouteScreen() {
  const handleSelectRoute = (routeId: string) => {
    router.push({
      pathname: "/main/routes/select",
      params: { routeId },
    });
  };

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
              {/* {routes.map((route: Route) => (
                <TouchableOpacity
                  key={route.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectRoute(route.id)}
                ></TouchableOpacity>
              ))} */}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.9}
          onPress={() => router.push("/main/routes/add")}
        >
          <Ionicons name="add" size={26} color={Colors.light.background} />
        </TouchableOpacity>
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
