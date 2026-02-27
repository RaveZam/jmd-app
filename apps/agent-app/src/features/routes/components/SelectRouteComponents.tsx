import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export type RouteSelectionItemProps = {
  title: string;
  storeCount: number;
  meta?: string;
};

export function RouteSelectionItem({
  title,
  storeCount,
  meta,
}: RouteSelectionItemProps) {
  const storeLabel = storeCount === 1 ? "store" : "stores";

  return (
    <View style={styles.rowContainer}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name="navigate-outline"
          size={20}
          color={Colors.light.background}
        />
      </View>

      <View style={styles.textColumn}>
        <ThemedText
          type="defaultSemiBold"
          style={styles.title}
          lightColor={Colors.light.text}
          darkColor={Colors.light.text}
        >
          {title}
        </ThemedText>

        <ThemedText
          style={styles.subtitle}
          lightColor="#64748B"
          darkColor="#64748B"
        >
          {storeCount} {storeLabel}
          {meta ? ` · ${meta}` : ""}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
    justifyContent: "center",
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 13,
  },
});
