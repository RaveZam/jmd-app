import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { CreateRouteForm } from "../components/create-route-components/CreateRouteComponents";

export default function CreateRouteScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        <CreateRouteForm />
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
});
