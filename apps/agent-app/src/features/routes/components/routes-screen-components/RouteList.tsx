import { StyleSheet, View, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { useRoutesContext } from "../../context/useRoutesContext";
import { CreateRouteModal } from "./CreateRouteModal";
import { RouteCard } from "./RouteCard";
import { EmptyRoutes } from "./EmptyRoutes";
import { CreateRouteFab } from "./CreateRouteFab";
import { DeleteRouteModal } from "./DeleteRouteModal";

export function RouteList() {
  const { routes } = useRoutesContext();

  return (
    <>
      <View style={styles.content}>
        {routes.length > 0 && (
          <Text style={styles.sectionLabel}>
            {routes.length} {routes.length === 1 ? "route" : "routes"} available
          </Text>
        )}

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {routes.length === 0 ? (
            <EmptyRoutes />
          ) : (
            routes.map((route) => <RouteCard key={route.id} route={route} />)
          )}
        </ScrollView>
      </View>

      <CreateRouteFab />
      <CreateRouteModal />
      <DeleteRouteModal />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 100,
  },
});
